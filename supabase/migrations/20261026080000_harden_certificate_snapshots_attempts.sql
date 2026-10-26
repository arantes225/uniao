-- 2026-10-26: certificate anti-forgery and attempt quota integrity.
-- Existing issued certificates need their immutable student name filled by audited manual migration
-- before applying NOT NULL. Do not generate fake holder names.
ALTER TABLE public.certificate_issuances
 ADD COLUMN IF NOT EXISTS student_name_snapshot text,
 ADD COLUMN IF NOT EXISTS template_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb;
DO $guard$ BEGIN
  IF EXISTS(SELECT 1 FROM public.certificate_issuances WHERE student_name_snapshot IS NULL OR trim(student_name_snapshot)='') THEN
    RAISE EXCEPTION 'Existing issuances missing immutable student names; backfill against original issuance records first';
  END IF;
END $guard$;
ALTER TABLE public.certificate_issuances ALTER COLUMN student_name_snapshot SET NOT NULL;

-- Students must not bypass three-attempt limits with REST table insertion.
DROP POLICY IF EXISTS attempts_insert ON public.assessment_attempts;
REVOKE INSERT,UPDATE,DELETE ON public.assessment_attempts FROM authenticated;
REVOKE INSERT,UPDATE,DELETE ON public.attempt_answers FROM authenticated;

CREATE OR REPLACE FUNCTION public.issue_cohort_certificates(p_cohort_id uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_count integer:=0;v_uid uuid:=(select auth.uid());
begin
 if coalesce((select auth.jwt())->>'aal','') <> 'aal2' then
   raise exception 'Confirme a autenticação de dois fatores (MFA) no painel administrativo' using errcode='42501';
 end if;
 if v_uid is null or not(select app_private.is_staff()) then
   raise exception 'Acesso administrativo obrigatório' using errcode='42501';
 end if;
 if not exists(select 1 from public.cohorts where id=p_cohort_id and status='active') then
   raise exception 'Turma não encontrada ou inativa' using errcode='22023';
 end if;
 if not exists(select 1 from public.cohorts c join public.certificate_templates t on t.course_id=c.course_id
   where c.id=p_cohort_id and t.workload_hours>0 and t.is_active is distinct from false) then
   raise exception 'Salve primeiro um modelo válido de certificado do curso' using errcode='22023';
 end if;
 if not exists(select 1 from public.assessments a join public.cohorts c on c.course_id=a.course_id
   where c.id=p_cohort_id and a.published) then
   raise exception 'Não existem provas oficiais publicadas: emissão bloqueada' using errcode='22023';
 end if;
 insert into public.certificate_issuances(cohort_id,user_id,course_id,title,workload_hours,issued_by,template_snapshot,student_name_snapshot)
 select c.id,e.user_id,c.course_id,t.title,t.workload_hours,v_uid,
  jsonb_build_object('instructor_name',t.instructor_name,
    'instructor_role',t.instructor_role,
    'technical_director',t.technical_director,
    'legal_framework',t.legal_framework,
    'validity_months',t.validity_months,
    'syllabus',t.syllabus,
    'template_id',t.id), trim(p.full_name)
 from public.cohorts c
 join public.enrollments e on e.cohort_id=c.id and e.status in('active','completed')
 join public.profiles p on p.id=e.user_id and length(trim(p.full_name))>=3
 join lateral(select ct.id,ct.title,ct.workload_hours,ct.instructor_name,ct.instructor_role,ct.technical_director,ct.legal_framework,ct.validity_months,ct.syllabus from public.certificate_templates ct
   where ct.course_id=c.course_id and ct.workload_hours>0 and ct.is_active is distinct from false
   order by ct.updated_at desc nulls last limit 1) t on true
 where c.id=p_cohort_id
   and exists(select 1 from public.verified_attendance v
     where v.cohort_id=c.id and v.user_id=e.user_id)
   and (
     not exists(select 1 from public.cohort_lesson_access cla where cla.cohort_id=c.id)
     or exists(select 1 from public.curriculum_attestations t
       where t.cohort_id=c.id and t.user_id=e.user_id)
   )
   and not exists (
    select 1 from public.assessments a
    where a.course_id=c.course_id and a.published
      and not exists(select 1 from public.assessment_attempts at
        where at.assessment_id=a.id and at.user_id=e.user_id
        and at.status in ('submitted','completed','graded')
        and at.score>=a.passing_score)
   )
 on conflict(cohort_id,user_id) do nothing;
 get diagnostics v_count=row_count;
 return v_count;
end $function$;
REVOKE ALL ON FUNCTION public.issue_cohort_certificates(uuid) FROM PUBLIC;

CREATE OR REPLACE FUNCTION public.verify_uniao_certificate(p_code text)
 RETURNS TABLE(valid boolean, student_name text, course_title text, hours integer, issued_on date, certificate_status text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
 if p_code is null or upper(trim(p_code)) !~ '^USM-[A-F0-9]{32}$' then
    return query select false,null::text,null::text,null::integer,null::date,'invalid'::text;
    return;
 end if;
 return query
   select (ci.revoked_at is null),
          ci.student_name_snapshot, ci.title, ci.workload_hours,ci.issued_at::date,
          case when ci.revoked_at is not null then 'revoked' else 'valid' end::text
   from public.certificate_issuances ci
   where ci.verification_code=upper(trim(p_code))
   limit 1;
 if not found then
   return query select false,null::text,null::text,null::integer,null::date,'not_found'::text;
 end if;
end $function$;
REVOKE ALL ON FUNCTION public.verify_uniao_certificate(text) FROM PUBLIC;

