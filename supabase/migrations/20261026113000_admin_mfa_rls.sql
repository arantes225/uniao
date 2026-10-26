-- Require fully MFA-verified administrative session for modifying
-- staff membership, certificate templates and instructor signatures.
-- Staff can still read own membership at AAL1 to enroll MFA.
create or replace function app_private.is_admin_with_mfa()
returns boolean language sql stable security definer set search_path='' as $fn$
  select coalesce((select auth.jwt()->>'aal')='aal2',false)
    and exists (select 1 from public.platform_staff s
      where s.user_id=(select auth.uid()) and s.role='admin');
$fn$;
revoke all on function app_private.is_admin_with_mfa() from public,anon,authenticated;
grant execute on function app_private.is_admin_with_mfa() to authenticated;

drop policy if exists staff_manage on public.platform_staff;
drop policy if exists staff_self_read on public.platform_staff;
drop policy if exists staff_admin_insert_mfa on public.platform_staff;
drop policy if exists staff_admin_update_mfa on public.platform_staff;
drop policy if exists staff_admin_delete_mfa on public.platform_staff;
create policy staff_self_read on public.platform_staff for select to authenticated
 using (user_id=(select auth.uid()) or (select app_private.is_admin_with_mfa()));
create policy staff_admin_insert_mfa on public.platform_staff for insert to authenticated
 with check ((select app_private.is_admin_with_mfa()) and role='admin');
create policy staff_admin_update_mfa on public.platform_staff for update to authenticated
 using ((select app_private.is_admin_with_mfa()))
 with check ((select app_private.is_admin_with_mfa()) and role='admin');
create policy staff_admin_delete_mfa on public.platform_staff for delete to authenticated
 using ((select app_private.is_admin_with_mfa()));

drop policy if exists certificate_templates_staff_only on public.certificate_templates;
drop policy if exists certificate_template_staff_read on public.certificate_templates;
drop policy if exists certificate_template_staff_insert_mfa on public.certificate_templates;
drop policy if exists certificate_template_staff_update_mfa on public.certificate_templates;
drop policy if exists certificate_template_staff_delete_mfa on public.certificate_templates;
create policy certificate_template_staff_read on public.certificate_templates for select to authenticated
 using ((select app_private.is_staff()));
create policy certificate_template_staff_insert_mfa on public.certificate_templates for insert to authenticated
 with check ((select app_private.is_admin_with_mfa()));
create policy certificate_template_staff_update_mfa on public.certificate_templates for update to authenticated
 using ((select app_private.is_admin_with_mfa()))
 with check ((select app_private.is_admin_with_mfa()));
create policy certificate_template_staff_delete_mfa on public.certificate_templates for delete to authenticated
 using ((select app_private.is_admin_with_mfa()));

drop policy if exists staff_insert_certificate_signatures on public.certificate_signature_sets;
drop policy if exists staff_update_certificate_signatures on public.certificate_signature_sets;
drop policy if exists staff_delete_certificate_signatures on public.certificate_signature_sets;
create policy staff_insert_certificate_signatures on public.certificate_signature_sets for insert to authenticated
 with check ((select app_private.is_admin_with_mfa()));
create policy staff_update_certificate_signatures on public.certificate_signature_sets for update to authenticated
 using ((select app_private.is_admin_with_mfa()))
 with check ((select app_private.is_admin_with_mfa()));
create policy staff_delete_certificate_signatures on public.certificate_signature_sets for delete to authenticated
 using ((select app_private.is_admin_with_mfa()));


-- Official exam authoring and answer-key edits require AAL2 too.
drop policy if exists staff_manage on public.assessments;
drop policy if exists official_exam_staff_read on public.assessments;
drop policy if exists official_exam_admin_insert_mfa on public.assessments;
drop policy if exists official_exam_admin_update_mfa on public.assessments;
drop policy if exists official_exam_admin_delete_mfa on public.assessments;
create policy official_exam_staff_read on public.assessments for select to authenticated using ((select app_private.is_staff()));
create policy official_exam_admin_insert_mfa on public.assessments for insert to authenticated with check ((select app_private.is_admin_with_mfa()));
create policy official_exam_admin_update_mfa on public.assessments for update to authenticated using ((select app_private.is_admin_with_mfa())) with check ((select app_private.is_admin_with_mfa()));
create policy official_exam_admin_delete_mfa on public.assessments for delete to authenticated using ((select app_private.is_admin_with_mfa()));

drop policy if exists staff_manage on public.assessment_questions;
drop policy if exists exam_questions_staff_read on public.assessment_questions;
drop policy if exists exam_questions_admin_insert_mfa on public.assessment_questions;
drop policy if exists exam_questions_admin_update_mfa on public.assessment_questions;
drop policy if exists exam_questions_admin_delete_mfa on public.assessment_questions;
create policy exam_questions_staff_read on public.assessment_questions for select to authenticated using ((select app_private.is_staff()));
create policy exam_questions_admin_insert_mfa on public.assessment_questions for insert to authenticated with check ((select app_private.is_admin_with_mfa()));
create policy exam_questions_admin_update_mfa on public.assessment_questions for update to authenticated using ((select app_private.is_admin_with_mfa())) with check ((select app_private.is_admin_with_mfa()));
create policy exam_questions_admin_delete_mfa on public.assessment_questions for delete to authenticated using ((select app_private.is_admin_with_mfa()));

drop policy if exists staff_manage on public.question_options;
drop policy if exists exam_options_staff_read on public.question_options;
drop policy if exists exam_options_admin_insert_mfa on public.question_options;
drop policy if exists exam_options_admin_update_mfa on public.question_options;
drop policy if exists exam_options_admin_delete_mfa on public.question_options;
create policy exam_options_staff_read on public.question_options for select to authenticated using ((select app_private.is_staff()));
create policy exam_options_admin_insert_mfa on public.question_options for insert to authenticated with check ((select app_private.is_admin_with_mfa()));
create policy exam_options_admin_update_mfa on public.question_options for update to authenticated using ((select app_private.is_admin_with_mfa())) with check ((select app_private.is_admin_with_mfa()));
create policy exam_options_admin_delete_mfa on public.question_options for delete to authenticated using ((select app_private.is_admin_with_mfa()));
