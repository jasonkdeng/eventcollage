-- Mosaic SQL schema + RLS policies
-- Run this in the Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.mosaics (
  id uuid primary key default gen_random_uuid(),
  owner_name text not null check (char_length(owner_name) > 0),
  owner_key_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.connections (
  id uuid primary key default gen_random_uuid(),
  mosaic_id uuid not null references public.mosaics(id) on delete cascade,
  selfie_url text not null,
  first_name text not null check (char_length(first_name) > 0),
  last_name text,
  linkedin_url text,
  instagram_handle text,
  twitter_handle text,
  added_at timestamptz not null default now()
);

alter table public.mosaics enable row level security;
alter table public.connections enable row level security;

-- Anyone can read and create mosaics.
drop policy if exists "public read mosaics" on public.mosaics;
create policy "public read mosaics"
  on public.mosaics for select
  using (true);

drop policy if exists "public create mosaics" on public.mosaics;
create policy "public create mosaics"
  on public.mosaics for insert
  with check (true);

-- Anyone can view and add connections.
drop policy if exists "public read connections" on public.connections;
create policy "public read connections"
  on public.connections for select
  using (true);

drop policy if exists "public add connections" on public.connections;
create policy "public add connections"
  on public.connections for insert
  with check (true);

-- Only the authenticated owner of a mosaic can delete cards.
drop policy if exists "owner delete connections" on public.connections;
create policy "owner delete connections"
  on public.connections for delete
  using (
    exists (
      select 1
      from public.mosaics m
      where m.id = mosaic_id
        and m.owner_key_hash = encode(
          digest(
            coalesce((current_setting('request.headers', true)::json ->> 'x-owner-token'), ''),
            'sha256'
          ),
          'hex'
        )
    )
  );

create index if not exists idx_connections_mosaic_id on public.connections(mosaic_id);
create index if not exists idx_connections_added_at on public.connections(added_at desc);

-- Public storage bucket for selfies.
insert into storage.buckets (id, name, public)
values ('selfies', 'selfies', true)
on conflict (id) do nothing;

-- Allow anyone to upload and read files in selfies bucket.
drop policy if exists "public read selfies" on storage.objects;
create policy "public read selfies"
  on storage.objects for select
  using (bucket_id = 'selfies');

drop policy if exists "public upload selfies" on storage.objects;
create policy "public upload selfies"
  on storage.objects for insert
  with check (bucket_id = 'selfies');
