-- Prevent absent students from certifying by merely receiving a forwarded check-in code.
-- Instructors verify in-person participation with a permanent audit record.
ALTER TABLE public.verified_attendance
  ADD COLUMN IF NOT EXISTS confirmed_at timestamptz,
  ADD COLUMN IF NOT EXISTS confirmed_by uuid references auth.users(id),
  ADD COLUMN IF NOT EXISTS confirmation_note text;

CREATE OR REPLACE FUNCTION public.confirm_practical_attendance(p_cohort_id uuid, p_student_id uuid, p_note text)
 RETURNS timestamp with time zone
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_admin uuid:=(select auth.uid());v_result timestamptz;
begin
 if v_admin is null or not (select app_private.is_staff()) or
    coalesce((select auth.jwt())->>'aal','') <> 'aal2' then
   raise exception 'Equipe autorizada com MFA obrigatório' using errcode='42501';
 end if;
 if length(trim(coalesce(p_note,''))) not between 10 and 500 then
   raise exception 'Informe evidência presencial de 10 a 500 caracteres' using errcode='22023';
 end if;
 update public.verified_attendance v
   set confirmed_at=clock_timestamp(),confirmed_by=v_admin,confirmation_note=trim(p_note)
 where v.cohort_id=p_cohort_id and v.user_id=p_student_id and v.confirmed_at is null
   and exists(select 1 from public.enrollments e
     where e.cohort_id=p_cohort_id and e.user_id=p_student_id
       and e.status in('active','completed'))
 returning confirmed_at into v_result;
 if v_result is null then
  raise exception 'Confirmação indisponível: check-in ausente, já confirmado ou matrícula inválida' using errcode='22023';
 end if;
 return v_result;
end $function$;

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
     where v.cohort_id=c.id and v.user_id=e.user_id and v.confirmed_at is not null)
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

REVOKE ALL ON FUNCTION public.confirm_practical_attendance(uuid,uuid,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_practical_attendance(uuid,uuid,text) TO authenticated;
REVOKE ALL ON FUNCTION public.issue_cohort_certificates(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.issue_cohort_certificates(uuid) TO authenticated;
