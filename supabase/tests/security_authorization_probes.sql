-- Reproducible security regression probes.
-- Run only with a database-owner SQL editor connection, never inside a client browser.
-- The fabricated JWT claims are used solely for PostgreSQL policy simulation.
-- This does NOT prove the real Supabase Auth service validated a signed JWT.
-- Each block rolls back and leaves no rows or sessions behind.

-- 1. Nonmember cannot read private data or invoke privileged RPCs.
begin;
select set_config('request.jwt.claims',
 '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated","aal":"aal1","user_metadata":{"role":"admin"}}', true);
set local role authenticated;
do $checks$
declare sample_id uuid:='00000000-0000-4000-8000-000000000002';
begin
  if app_private.is_admin_with_mfa() then raise exception 'RLS FAIL: forged metadata granted admin'; end if;
  if (select count(*) from public.secure_booklets)>0 then raise exception 'RLS FAIL: private apostilas visible'; end if;
  if (select count(*) from public.certificate_issuances)>0 then raise exception 'RLS FAIL: certificate details visible'; end if;
  if (select count(*) from public.profiles)>0 then raise exception 'RLS FAIL: student profiles visible'; end if;
  if (select count(*) from public.verified_attendance)>0 then raise exception 'RLS FAIL: attendance visible'; end if;
  if has_table_privilege('authenticated','public.assessment_attempts','INSERT') then
    raise exception 'RLS FAIL: browser bypass of exam attempt limit';
  end if;

  begin
    perform public.start_official_assessment(sample_id);
    raise exception 'BYPASS: unauthorized exam start' using errcode='ZX001';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.get_official_assessment(sample_id);
    raise exception 'BYPASS: unauthorized question data' using errcode='ZX001';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.submit_official_assessment(sample_id,'{}'::jsonb);
    raise exception 'BYPASS: unauthorized exam submission' using errcode='ZX001';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.issue_cohort_certificates(sample_id);
    raise exception 'BYPASS: unauthorized certificate issue' using errcode='ZX001';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.revoke_uniao_certificate(sample_id,'Unauthorized attempt');
    raise exception 'BYPASS: unauthorized certificate revoke' using errcode='ZX001';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.attest_curriculum_completion(sample_id,sample_id,'Unauthorized attempt');
    raise exception 'BYPASS: unauthorized coursework attestation' using errcode='ZX001';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.confirm_practical_attendance(sample_id,sample_id,'Unauthorized attempt');
    raise exception 'BYPASS: unauthorized practical attendance' using errcode='ZX001';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.create_presence_session(sample_id);
    raise exception 'BYPASS: unauthorized instructor check-in code' using errcode='ZX001';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.redeem_presence_code(sample_id,'0000000000');
    raise exception 'BYPASS: unauthorized check-in' using errcode='ZX001';
  exception when insufficient_privilege then null;
  end;
end $checks$;
select 'PASS anonymous/nonmember API authorization regression' as result;
rollback;

-- 2. A real admin record with simulated AAL1 may read, but not change privileged configurations.
begin;
select set_config('request.jwt.claims', jsonb_build_object(
  'sub',(select user_id from public.platform_staff where role='admin' limit 1)::text,
  'role','authenticated','aal','aal1')::text,true);
set local role authenticated;
do $checks$
declare sample_id uuid:='00000000-0000-4000-8000-000000000002';
begin
  if app_private.is_admin_with_mfa() then raise exception 'MFA FAIL: AAL1 authorized staff writes'; end if;
  if (select count(*) from public.platform_staff)<>1 then raise exception 'MFA FAIL: admin AAL1 should read only self'; end if;
  if (select count(*) from public.certificate_templates)<1 then raise exception 'MFA FAIL: staff template reader blocked'; end if;
  begin
    perform public.issue_cohort_certificates(sample_id);
    raise exception 'BYPASS: AAL1 certificate issue' using errcode='ZX001';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.revoke_uniao_certificate(sample_id,'AAL1 probe');
    raise exception 'BYPASS: AAL1 certificate revoke' using errcode='ZX001';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.attest_curriculum_completion(sample_id,sample_id,'AAL1 probe');
    raise exception 'BYPASS: AAL1 curriculum attestation' using errcode='ZX001';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.confirm_practical_attendance(sample_id,sample_id,'AAL1 probe');
    raise exception 'BYPASS: AAL1 physical presence confirmation' using errcode='ZX001';
  exception when insufficient_privilege then null;
  end;
end $checks$;
select 'PASS staff without MFA has read access only' as result;
rollback;

-- 3. The same staff membership with simulated AAL2 enables administrative policy.
begin;
select set_config('request.jwt.claims', jsonb_build_object(
  'sub',(select user_id from public.platform_staff where role='admin' limit 1)::text,
  'role','authenticated','aal','aal2')::text,true);
set local role authenticated;
do $checks$
begin
  if not app_private.is_admin_with_mfa() then raise exception 'MFA FAIL: AAL2 admin refused'; end if;
  if (select count(*) from public.platform_staff)<1 then raise exception 'MFA FAIL: valid admin invisible'; end if;
end $checks$;
select 'PASS simulated admin AAL2 policy recognition' as result;
rollback;
