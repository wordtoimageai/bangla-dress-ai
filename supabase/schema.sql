-- BanglaDress AI - Complete Database Schema
-- Run this in Supabase SQL Editor

create type user_role as enum ('customer', 'designer', 'admin');

create table public.users (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid not null,
  role user_role not null default 'customer',
  name text,
  phone text,
  avatar_url text,
  plan text not null default 'free',
  ai_quota_daily int not null default 5,
  created_at timestamptz default now()
);

alter table public.users
  add constraint users_auth_id_fkey
  foreign key (auth_id) references auth.users (id) on delete cascade;

create table public.designs (
  id uuid primary key default gen_random_uuid(),
  designer_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text,
  images text[] not null,
  fabric text not null,
  color_palette text[] not null,
  embroidery_type text,
  occasion text,
  base_size text,
  measurements jsonb not null default '{}',
  price_bdt integer not null check (price_bdt between 2000 and 15000),
  status text not null default 'pending',
  created_at timestamptz default now()
);

create index designs_designer_id_idx on public.designs(designer_id);
create index designs_status_idx on public.designs(status);
create index designs_price_idx on public.designs(price_bdt);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  design_id uuid not null references public.designs(id) on delete restrict,
  custom_measurements jsonb,
  ai_preview_image text,
  status text not null default 'pending',
  payment_provider text,
  payment_status text default 'unpaid',
  payment_trx_id text,
  payment_raw jsonb,
  payment_info jsonb,
  shipping_address jsonb,
  created_at timestamptz default now()
);

create index orders_user_id_idx on public.orders(user_id);
create index orders_design_id_idx on public.orders(design_id);

create view public.designer_commissions as
select
  d.designer_id,
  o.id as order_id,
  o.payment_status,
  o.status as order_status,
  d.price_bdt,
  round(d.price_bdt * 0.20)::int as commission_bdt
from public.orders o
join public.designs d on o.design_id = d.id
where o.payment_status = 'paid';

-- Storage bucket
insert into storage.buckets (id, name, public)
values ('design-images', 'design-images', true)
on conflict (id) do nothing;

create policy "Public read design images"
on storage.objects for select
using (bucket_id = 'design-images');

create policy "Designers upload design images"
on storage.objects for insert
with check (
  bucket_id = 'design-images'
  and auth.role() = 'authenticated'
);
