create table if not exists public.pending_student_enrollments (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text not null,
  cpf text,
  cohort_id uuid not null references public.cohorts(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (email, cohort_id)
);

create index if not exists pending_student_enrollments_email_idx
  on public.pending_student_enrollments (lower(email));

alter table public.pending_student_enrollments enable row level security;

revoke all on public.pending_student_enrollments from anon, authenticated;
grant all on public.pending_student_enrollments to service_role;
