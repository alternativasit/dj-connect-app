-- DJ Connect quick fix for Neon Nights live testing
-- Run in Supabase SQL Editor if Neon Nights still appears as Draft.

update public.events
set status = 'Live',
    is_active = true,
    updated_at = now()
where slug = 'neon-nights-club-central';

drop policy if exists "guests insert song requests" on public.song_requests;
create policy "guests insert song requests"
  on public.song_requests
  for insert
  to anon, authenticated
  with check (status = 'Pending' and public.is_live_event(event_id));

grant insert on public.song_requests to anon, authenticated;
