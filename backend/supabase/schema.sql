create table if not exists public.certificate_batches (
  id uuid primary key,
  created_at timestamptz not null default now(),
  excel_original_name text,
  template_original_name text,
  total_rows integer not null default 0,
  generated_count integer not null default 0,
  skipped_count integer not null default 0,
  error_count integer not null default 0
);

create table if not exists public.certificates (
  id uuid primary key,
  batch_id uuid references public.certificate_batches(id) on delete set null,
  person_name text not null,
  document text not null,
  document_normalized text not null,
  course text,
  issue_date text,
  hours text,
  file_name text not null,
  file_key text not null unique,
  file_size bigint,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists certificates_document_normalized_idx
  on public.certificates (document_normalized);

create index if not exists certificates_batch_id_idx
  on public.certificates (batch_id);

create index if not exists certificates_created_at_idx
  on public.certificates (created_at desc);

alter table public.certificate_batches enable row level security;
alter table public.certificates enable row level security;

create or replace function public.get_certificate_stats()
returns table (
  total_participants bigint,
  generated_pdfs bigint,
  total_batches bigint,
  last_generation timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    (select count(distinct document_normalized) from public.certificates) as total_participants,
    (select count(*) from public.certificates) as generated_pdfs,
    (select count(*) from public.certificate_batches) as total_batches,
    (select max(created_at) from public.certificate_batches) as last_generation;
$$;

-- El backend usa SUPABASE_SERVICE_ROLE_KEY, que omite RLS.
-- No agregamos policies publicas porque el frontend debe consultar siempre por medio del backend.
