-- Perfis públicos de instrutores e currículos em PDF.
-- Arquivos privados; leitura via URLs assinadas somente para currículos publicados.
create table if not exists public.instructor_profiles (
  id uuid primary key default gen_random_uuid(),
  display_name text not null check (char_length(btrim(display_name)) between 2 and 160),
  role_title text not null default '',
  biography text not null default '',
  curriculum_pdf_path text check (
    curriculum_pdf_path is null or
    curriculum_pdf_path ~ '^instructors/[0-9a-f-]+/[0-9a-f-]+[.]pdf$'
  ),
  published boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists instructor_profiles_public_order
on public.instructor_profiles (position, display_name) where published;

alter table public.instructor_profiles enable row level security;
drop policy if exists instructor_profiles_read on public.instructor_profiles;
drop policy if exists instructor_profiles_insert on public.instructor_profiles;
drop policy if exists instructor_profiles_update on public.instructor_profiles;
drop policy if exists instructor_profiles_delete on public.instructor_profiles;

create policy instructor_profiles_read on public.instructor_profiles
for select to anon, authenticated
using (published or (select app_private.is_admin_with_mfa()));

create policy instructor_profiles_insert on public.instructor_profiles
for insert to authenticated
with check ((select app_private.is_admin_with_mfa()));

create policy instructor_profiles_update on public.instructor_profiles
for update to authenticated
using ((select app_private.is_admin_with_mfa()))
with check ((select app_private.is_admin_with_mfa()));

create policy instructor_profiles_delete on public.instructor_profiles
for delete to authenticated
using ((select app_private.is_admin_with_mfa()));

grant select on public.instructor_profiles to anon, authenticated;
grant insert, update, delete on public.instructor_profiles to authenticated;

-- Acesso público NÃO é concedido ao bucket. O cliente solicita URL assinada.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('instructor-curricula', 'instructor-curricula', false, 10485760, array['application/pdf'])
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists instructor_curricula_read on storage.objects;
drop policy if exists instructor_curricula_insert on storage.objects;
drop policy if exists instructor_curricula_update on storage.objects;
drop policy if exists instructor_curricula_delete on storage.objects;

create policy instructor_curricula_read on storage.objects
for select to anon, authenticated
using (
  bucket_id = 'instructor-curricula'
  and (
    (select app_private.is_admin_with_mfa())
    or exists (
      select 1 from public.instructor_profiles ip
      where ip.curriculum_pdf_path = name and ip.published
    )
  )
);

create policy instructor_curricula_insert on storage.objects
for insert to authenticated
with check (
  bucket_id = 'instructor-curricula'
  and (select app_private.is_admin_with_mfa())
);

create policy instructor_curricula_update on storage.objects
for update to authenticated
using (
  bucket_id = 'instructor-curricula'
  and (select app_private.is_admin_with_mfa())
)
with check (
  bucket_id = 'instructor-curricula'
  and (select app_private.is_admin_with_mfa())
);

create policy instructor_curricula_delete on storage.objects
for delete to authenticated
using (
  bucket_id = 'instructor-curricula'
  and (select app_private.is_admin_with_mfa())
);
