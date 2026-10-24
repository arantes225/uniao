-- Persistência de roteiros do Prompter administrativo (módulos e subtemas).
-- A autorização segue o mesmo critério de equipe das tabelas curriculares.
create table if not exists public.admin_prompters (
  item_key text primary key check (length(item_key) between 3 and 200),
  body text not null default '',
  updated_at timestamptz not null default now(),
  updated_by uuid default auth.uid() references auth.users(id) on delete set null
);

alter table public.admin_prompters enable row level security;

revoke all on public.admin_prompters from anon;
grant select, insert, update, delete on public.admin_prompters to authenticated;

create policy "staff_manage_admin_prompters"
on public.admin_prompters
for all
to authenticated
using ((select app_private.is_staff()))
with check ((select app_private.is_staff()));
