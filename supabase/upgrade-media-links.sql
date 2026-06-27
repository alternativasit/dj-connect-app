-- DJ Connect media link upgrade
-- Run this once in Supabase SQL Editor on your live project.

alter table public.djs
  add column if not exists featured_video_url text;

alter table public.song_requests
  add column if not exists music_url text,
  add column if not exists music_provider text,
  add column if not exists music_preview_image_url text,
  add column if not exists music_preview_embed_url text;

grant select on public.song_requests to anon, authenticated;

drop policy if exists "public read live song requests" on public.song_requests;
create policy "public read live song requests"
  on public.song_requests
  for select
  to anon, authenticated
  using (public.is_live_event(event_id));

update public.djs
set featured_video_url = coalesce(featured_video_url, 'https://www.youtube.com/watch?v=FGBhQbmPwH8')
where slug = 'alex-beat';
