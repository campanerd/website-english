-- Extensão necessária para gerar UUIDs
create extension if not exists pgcrypto;

-- Tabelas

create table levels (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  order_index integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table topics (
  id uuid primary key default gen_random_uuid(),
  level_id uuid not null references levels(id) on delete cascade,
  slug text not null,
  title text not null,
  summary text,                -- descrição curta (uma linha), exibida abaixo do título
  pdf_path text,                -- caminho no Supabase Storage
  pdf_original_name text,       -- nome amigável pro download
  order_index integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (level_id, slug)
);

create table site_content (
  key text primary key,        -- 'about' | 'contact'
  content jsonb not null,
  updated_at timestamptz not null default now()
);

-- Row Level Security

alter table levels enable row level security;
alter table topics enable row level security;
alter table site_content enable row level security;

create policy "public read published levels" on levels for select using (is_published = true);
create policy "admin full access levels" on levels for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read published topics" on topics for select using (is_published = true);
create policy "admin full access topics" on topics for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public read site_content" on site_content for select using (true);
create policy "admin write site_content" on site_content for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Storage: buckets

insert into storage.buckets (id, name, public) values ('topic-pdfs', 'topic-pdfs', true);
insert into storage.buckets (id, name, public) values ('site-images', 'site-images', true);

-- Storage: policies (topic-pdfs)

create policy "public read topic-pdfs" on storage.objects for select using (bucket_id = 'topic-pdfs');
create policy "admin write topic-pdfs" on storage.objects for insert with check (bucket_id = 'topic-pdfs' and auth.role() = 'authenticated');
create policy "admin update topic-pdfs" on storage.objects for update using (bucket_id = 'topic-pdfs' and auth.role() = 'authenticated');
create policy "admin delete topic-pdfs" on storage.objects for delete using (bucket_id = 'topic-pdfs' and auth.role() = 'authenticated');

-- Storage: policies (site-images)

create policy "public read site-images" on storage.objects for select using (bucket_id = 'site-images');
create policy "admin write site-images" on storage.objects for insert with check (bucket_id = 'site-images' and auth.role() = 'authenticated');
create policy "admin update site-images" on storage.objects for update using (bucket_id = 'site-images' and auth.role() = 'authenticated');
create policy "admin delete site-images" on storage.objects for delete using (bucket_id = 'site-images' and auth.role() = 'authenticated');