-- Agavi CRM Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- =====================
-- LEADS TABLE
-- =====================
create table leads (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text,
  email text,
  company text,
  source text,
  status text not null default 'New',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table leads enable row level security;

create policy "Authenticated users can read leads"
  on leads for select to authenticated using (true);

create policy "Authenticated users can insert leads"
  on leads for insert to authenticated with check (true);

create policy "Authenticated users can update leads"
  on leads for update to authenticated using (true) with check (true);

create policy "Authenticated users can delete leads"
  on leads for delete to authenticated using (true);

-- =====================
-- CALL SESSIONS TABLE
-- =====================
create table call_sessions (
  id uuid primary key default uuid_generate_v4(),
  session_date date not null default current_date,
  dials integer not null default 0,
  connects integer not null default 0,
  voicemails integer not null default 0,
  notes text,
  created_at timestamptz not null default now()
);

alter table call_sessions enable row level security;

create policy "Authenticated users can read call_sessions"
  on call_sessions for select to authenticated using (true);

create policy "Authenticated users can insert call_sessions"
  on call_sessions for insert to authenticated with check (true);

create policy "Authenticated users can update call_sessions"
  on call_sessions for update to authenticated using (true) with check (true);

create policy "Authenticated users can delete call_sessions"
  on call_sessions for delete to authenticated using (true);

-- =====================
-- SOCIAL POSTS TABLE
-- =====================
create table social_posts (
  id uuid primary key default uuid_generate_v4(),
  platform text not null,
  post_type text not null,
  post_date date not null default current_date,
  engagement_notes text,
  link text,
  created_at timestamptz not null default now()
);

alter table social_posts enable row level security;

create policy "Authenticated users can read social_posts"
  on social_posts for select to authenticated using (true);

create policy "Authenticated users can insert social_posts"
  on social_posts for insert to authenticated with check (true);

create policy "Authenticated users can update social_posts"
  on social_posts for update to authenticated using (true) with check (true);

create policy "Authenticated users can delete social_posts"
  on social_posts for delete to authenticated using (true);

-- =====================
-- ORDERS TABLE
-- =====================
create table orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text,
  customer_name text not null,
  customer_email text,
  customer_phone text,
  product_description text,
  amount numeric,
  status text not null default 'Pending',
  tracking_number text,
  tracking_link text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table orders enable row level security;

create policy "Authenticated users can read orders"
  on orders for select to authenticated using (true);

create policy "Authenticated users can insert orders"
  on orders for insert to authenticated with check (true);

create policy "Authenticated users can update orders"
  on orders for update to authenticated using (true) with check (true);

create policy "Authenticated users can delete orders"
  on orders for delete to authenticated using (true);
