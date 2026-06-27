-- DJ Connect - Supabase PostgreSQL schema
-- Run this file in Supabase SQL Editor before running supabase/seed.sql.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null check (role in ('super_admin', 'dj_admin', 'venue_admin')) default 'dj_admin',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.djs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null,
  name text not null,
  slug text not null unique,
  photo_url text,
  logo_url text,
  role text,
  bio text,
  city text,
  country text,
  genres text[] not null default '{}',
  instagram_url text,
  tiktok_url text,
  youtube_url text,
  soundcloud_url text,
  mixcloud_url text,
  whatsapp text,
  email text,
  booking_url text,
  tip_paypal_url text,
  tip_venmo_url text,
  tip_cashapp_url text,
  tip_stripe_url text,
  tip_mercadopago_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null,
  name text not null,
  logo_url text,
  address text,
  city text,
  state text,
  country text,
  phone text,
  website text,
  instagram_url text,
  contact_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  dj_id uuid not null references public.djs(id) on delete cascade,
  venue_id uuid references public.venues(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  event_date date not null,
  start_time time,
  end_time time,
  city text,
  address text,
  banner_url text,
  status text not null check (status in ('Draft', 'Live', 'Finished')) default 'Draft',
  qr_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.song_requests (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  dj_id uuid not null references public.djs(id) on delete cascade,
  guest_name text not null,
  song_title text not null,
  artist text not null,
  note text,
  status text not null check (status in ('Pending', 'Approved', 'Played', 'Rejected')) default 'Pending',
  guest_session_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.polls (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  question text not null,
  type text not null check (type in ('genre', 'song', 'custom')) default 'custom',
  is_active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  label text not null,
  image_url text,
  display_order integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.poll_votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  option_id uuid not null references public.poll_options(id) on delete cascade,
  guest_session_id text not null,
  created_at timestamptz not null default now(),
  constraint poll_votes_one_vote_per_guest unique (poll_id, guest_session_id)
);

create table if not exists public.drinks (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  category text not null,
  description text,
  price numeric not null default 0,
  image_url text,
  promo_text text,
  is_available boolean not null default true,
  display_order integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.promos (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  title text not null,
  description text,
  image_url text,
  sponsor_name text,
  valid_until timestamptz,
  is_active boolean not null default true,
  display_order integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dj_packages (
  id uuid primary key default gen_random_uuid(),
  dj_id uuid not null references public.djs(id) on delete cascade,
  title text not null,
  description text,
  price_from numeric,
  includes text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  dj_id uuid not null references public.djs(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  media_url text not null,
  media_type text not null check (media_type in ('image', 'video')) default 'image',
  caption text,
  display_order integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.tip_clicks (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  dj_id uuid not null references public.djs(id) on delete cascade,
  provider text not null,
  guest_session_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.sponsor_clicks (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  sponsor_name text not null,
  guest_session_id text not null,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_user_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(public.current_user_role() = 'super_admin', false)
$$;

create or replace function public.is_dj_owner(target_dj_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.djs
    where id = target_dj_id and owner_id = auth.uid()
  ) or public.is_super_admin()
$$;

create or replace function public.is_venue_owner(target_venue_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.venues
    where id = target_venue_id and owner_id = auth.uid()
  ) or public.is_super_admin()
$$;

create or replace function public.can_manage_event(target_event_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.events e
    left join public.djs d on d.id = e.dj_id
    left join public.venues v on v.id = e.venue_id
    where e.id = target_event_id
      and (d.owner_id = auth.uid() or v.owner_id = auth.uid())
  ) or public.is_super_admin()
$$;

create or replace function public.can_manage_poll(target_poll_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.polls p
    where p.id = target_poll_id and public.can_manage_event(p.event_id)
  ) or public.is_super_admin()
$$;

create or replace function public.is_live_event(target_event_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.events
    where id = target_event_id and status = 'Live' and is_active = true
  )
$$;

create trigger touch_profiles_updated_at before update on public.profiles for each row execute function public.touch_updated_at();
create trigger touch_djs_updated_at before update on public.djs for each row execute function public.touch_updated_at();
create trigger touch_venues_updated_at before update on public.venues for each row execute function public.touch_updated_at();
create trigger touch_events_updated_at before update on public.events for each row execute function public.touch_updated_at();
create trigger touch_song_requests_updated_at before update on public.song_requests for each row execute function public.touch_updated_at();
create trigger touch_polls_updated_at before update on public.polls for each row execute function public.touch_updated_at();
create trigger touch_drinks_updated_at before update on public.drinks for each row execute function public.touch_updated_at();
create trigger touch_promos_updated_at before update on public.promos for each row execute function public.touch_updated_at();
create trigger touch_dj_packages_updated_at before update on public.dj_packages for each row execute function public.touch_updated_at();

create index if not exists djs_slug_idx on public.djs(slug);
create index if not exists venues_owner_idx on public.venues(owner_id);
create index if not exists events_slug_idx on public.events(slug);
create index if not exists events_status_idx on public.events(status, is_active);
create index if not exists song_requests_event_status_idx on public.song_requests(event_id, status, created_at desc);
create index if not exists polls_event_active_idx on public.polls(event_id, is_active);
create index if not exists poll_options_poll_idx on public.poll_options(poll_id, display_order);
create index if not exists poll_votes_poll_idx on public.poll_votes(poll_id);
create index if not exists drinks_event_order_idx on public.drinks(event_id, display_order);
create index if not exists promos_event_order_idx on public.promos(event_id, display_order);
create index if not exists gallery_dj_order_idx on public.gallery_items(dj_id, display_order);

alter table public.profiles enable row level security;
alter table public.djs enable row level security;
alter table public.venues enable row level security;
alter table public.events enable row level security;
alter table public.song_requests enable row level security;
alter table public.polls enable row level security;
alter table public.poll_options enable row level security;
alter table public.poll_votes enable row level security;
alter table public.drinks enable row level security;
alter table public.promos enable row level security;
alter table public.dj_packages enable row level security;
alter table public.gallery_items enable row level security;
alter table public.tip_clicks enable row level security;
alter table public.sponsor_clicks enable row level security;

create policy "profiles own profile" on public.profiles for select to authenticated using (id = auth.uid() or public.is_super_admin());
create policy "profiles own update" on public.profiles for update to authenticated using (id = auth.uid() or public.is_super_admin()) with check (id = auth.uid() or public.is_super_admin());
create policy "profiles super insert" on public.profiles for insert to authenticated with check (public.is_super_admin() or id = auth.uid());

create policy "public read active djs" on public.djs for select to anon, authenticated using (is_active = true);
create policy "dj admins manage own djs" on public.djs for all to authenticated using (owner_id = auth.uid() or public.is_super_admin()) with check (owner_id = auth.uid() or public.is_super_admin());

create policy "public read active venues" on public.venues for select to anon, authenticated using (is_active = true);
create policy "venue admins manage own venues" on public.venues for all to authenticated using (owner_id = auth.uid() or public.is_super_admin()) with check (owner_id = auth.uid() or public.is_super_admin());

create policy "public read live events" on public.events for select to anon, authenticated using (status = 'Live' and is_active = true);
create policy "admins read managed events" on public.events for select to authenticated using (public.can_manage_event(id) or public.is_super_admin());
create policy "dj venue admins insert events" on public.events for insert to authenticated with check (public.is_dj_owner(dj_id) or (venue_id is not null and public.is_venue_owner(venue_id)) or public.is_super_admin());
create policy "dj venue admins update events" on public.events for update to authenticated using (public.can_manage_event(id)) with check (public.is_dj_owner(dj_id) or (venue_id is not null and public.is_venue_owner(venue_id)) or public.is_super_admin());
create policy "dj venue admins delete events" on public.events for delete to authenticated using (public.can_manage_event(id));

create policy "guests insert song requests" on public.song_requests for insert to anon, authenticated with check (status = 'Pending' and public.is_live_event(event_id));
create policy "admins manage song requests" on public.song_requests for all to authenticated using (public.can_manage_event(event_id) or public.is_dj_owner(dj_id)) with check (public.can_manage_event(event_id) or public.is_dj_owner(dj_id));

create policy "public read active polls" on public.polls for select to anon, authenticated using (is_active = true and public.is_live_event(event_id));
create policy "admins manage polls" on public.polls for all to authenticated using (public.can_manage_event(event_id)) with check (public.can_manage_event(event_id));

create policy "public read active poll options" on public.poll_options for select to anon, authenticated using (exists (select 1 from public.polls p where p.id = poll_id and p.is_active = true and public.is_live_event(p.event_id)));
create policy "admins manage poll options" on public.poll_options for all to authenticated using (public.can_manage_poll(poll_id)) with check (public.can_manage_poll(poll_id));

create policy "public read votes for active polls" on public.poll_votes for select to anon, authenticated using (exists (select 1 from public.polls p where p.id = poll_id and p.is_active = true and public.is_live_event(p.event_id)));
create policy "guests insert poll votes" on public.poll_votes for insert to anon, authenticated with check (exists (select 1 from public.polls p join public.poll_options o on o.poll_id = p.id where p.id = poll_id and o.id = option_id and p.is_active = true and public.is_live_event(p.event_id)));
create policy "admins read poll votes" on public.poll_votes for select to authenticated using (public.can_manage_poll(poll_id));

create policy "public read available drinks" on public.drinks for select to anon, authenticated using (is_available = true and public.is_live_event(event_id));
create policy "admins manage drinks" on public.drinks for all to authenticated using (public.can_manage_event(event_id)) with check (public.can_manage_event(event_id));

create policy "public read active promos" on public.promos for select to anon, authenticated using (is_active = true and public.is_live_event(event_id));
create policy "admins manage promos" on public.promos for all to authenticated using (public.can_manage_event(event_id)) with check (public.can_manage_event(event_id));

create policy "public read active packages" on public.dj_packages for select to anon, authenticated using (is_active = true and exists (select 1 from public.djs d where d.id = dj_id and d.is_active = true));
create policy "dj admins manage packages" on public.dj_packages for all to authenticated using (public.is_dj_owner(dj_id)) with check (public.is_dj_owner(dj_id));

create policy "public read gallery" on public.gallery_items for select to anon, authenticated using (exists (select 1 from public.djs d where d.id = dj_id and d.is_active = true));
create policy "dj admins manage gallery" on public.gallery_items for all to authenticated using (public.is_dj_owner(dj_id) or (event_id is not null and public.can_manage_event(event_id))) with check (public.is_dj_owner(dj_id) or (event_id is not null and public.can_manage_event(event_id)));

create policy "guests insert tip clicks" on public.tip_clicks for insert to anon, authenticated with check (public.is_live_event(event_id));
create policy "admins read tip clicks" on public.tip_clicks for select to authenticated using (public.can_manage_event(event_id) or public.is_dj_owner(dj_id));

create policy "guests insert sponsor clicks" on public.sponsor_clicks for insert to anon, authenticated with check (public.is_live_event(event_id));
create policy "admins read sponsor clicks" on public.sponsor_clicks for select to authenticated using (public.can_manage_event(event_id));

create or replace view public.poll_results as
select
  p.id as poll_id,
  p.event_id,
  o.id as option_id,
  o.label,
  count(v.id)::integer as votes,
  case when sum(count(v.id)) over (partition by p.id) = 0 then 0
       else round((count(v.id)::numeric / sum(count(v.id)) over (partition by p.id)) * 100, 2)
  end as percentage
from public.polls p
join public.poll_options o on o.poll_id = p.id
left join public.poll_votes v on v.option_id = o.id
group by p.id, p.event_id, o.id, o.label, o.display_order
order by p.id, votes desc, o.display_order;

grant usage on schema public to anon, authenticated;
grant select on public.djs, public.venues, public.events, public.polls, public.poll_options, public.poll_votes, public.drinks, public.promos, public.dj_packages, public.gallery_items, public.poll_results to anon, authenticated;
grant insert on public.song_requests, public.poll_votes, public.tip_clicks, public.sponsor_clicks to anon, authenticated;
grant all on public.profiles, public.djs, public.venues, public.events, public.song_requests, public.polls, public.poll_options, public.drinks, public.promos, public.dj_packages, public.gallery_items, public.tip_clicks, public.sponsor_clicks to authenticated;

do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
  if not exists (select 1 from pg_publication_rel pr join pg_class c on c.oid = pr.prrelid where pr.prpubid = (select oid from pg_publication where pubname = 'supabase_realtime') and c.relname = 'song_requests') then
    alter publication supabase_realtime add table public.song_requests;
  end if;
  if not exists (select 1 from pg_publication_rel pr join pg_class c on c.oid = pr.prrelid where pr.prpubid = (select oid from pg_publication where pubname = 'supabase_realtime') and c.relname = 'poll_votes') then
    alter publication supabase_realtime add table public.poll_votes;
  end if;
end $$;

insert into storage.buckets (id, name, public)
values
  ('dj-assets', 'dj-assets', true),
  ('event-assets', 'event-assets', true),
  ('venue-assets', 'venue-assets', true)
on conflict (id) do nothing;

create policy "public read storage assets" on storage.objects for select to anon, authenticated using (bucket_id in ('dj-assets', 'event-assets', 'venue-assets'));
create policy "authenticated upload storage assets" on storage.objects for insert to authenticated with check (bucket_id in ('dj-assets', 'event-assets', 'venue-assets'));
create policy "authenticated update storage assets" on storage.objects for update to authenticated using (bucket_id in ('dj-assets', 'event-assets', 'venue-assets')) with check (bucket_id in ('dj-assets', 'event-assets', 'venue-assets'));
create policy "authenticated delete storage assets" on storage.objects for delete to authenticated using (bucket_id in ('dj-assets', 'event-assets', 'venue-assets'));
