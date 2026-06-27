-- DJ Connect seed data
-- Run after supabase/schema.sql. Create auth users separately, then set owner_id values as needed.

insert into public.djs (
  id, name, slug, photo_url, role, bio, city, country, genres,
  instagram_url, tiktok_url, youtube_url, featured_video_url, soundcloud_url, mixcloud_url,
  whatsapp, email, booking_url, tip_paypal_url, tip_venmo_url, tip_cashapp_url,
  tip_stripe_url, tip_mercadopago_url, is_active
) values (
  '11111111-1111-4111-8111-111111111111',
  'Alex Beat',
  'alex-beat',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80',
  'DJ / Producer',
  'Mexico City DJ blending House, Tech House and melodic late-night energy for rooftops, clubs and private events.',
  'Mexico City',
  'MX',
  array['House', 'Tech House', 'Melodic'],
  'https://instagram.com/alexbeatdj',
  'https://tiktok.com/@alexbeatdj',
  'https://youtube.com/@alexbeatdj',
  'https://www.youtube.com/watch?v=FGBhQbmPwH8',
  'https://soundcloud.com/alexbeatdj',
  'https://mixcloud.com/alexbeatdj',
  '+525512345678',
  'bookings@alexbeat.dj',
  'mailto:bookings@alexbeat.dj?subject=Booking%20Alex%20Beat',
  'https://paypal.me/alexbeatdj',
  'https://venmo.com/alexbeatdj',
  'https://cash.app/$alexbeatdj',
  'https://buy.stripe.com/test_alexbeat',
  'https://mpago.la/alexbeatdj',
  true
) on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  updated_at = now();

insert into public.venues (id, name, address, city, state, country, phone, website, instagram_url, contact_name, is_active)
values
  ('22222222-2222-4222-8222-222222222222', 'Rooftop Lounge', 'Av. Reforma 500', 'Mexico City', 'CDMX', 'MX', '+525598765432', 'https://example.com/rooftop-lounge', 'https://instagram.com/rooftoplounge', 'Venue Manager', true),
  ('22222222-2222-4222-8222-222222222223', 'Club Central', 'Centro 22', 'Mexico City', 'CDMX', 'MX', null, null, 'https://instagram.com/clubcentral', null, true)
on conflict (id) do update set name = excluded.name, updated_at = now();

insert into public.events (id, dj_id, venue_id, name, slug, description, event_date, start_time, end_time, city, address, banner_url, status, qr_url, is_active)
values
  ('33333333-3333-4333-8333-333333333333', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222', 'Sunset Rooftop Party', 'sunset-rooftop-party', 'A high-energy sunset session with live requests, polls, promos and a rooftop drinks menu.', '2026-07-12', '19:00', '01:00', 'Mexico City', 'Rooftop Lounge, Av. Reforma 500', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1400&q=80', 'Live', null, true),
  ('33333333-3333-4333-8333-333333333334', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222223', 'Neon Nights', 'neon-nights-club-central', 'Late-night club set with house and tech-house selectors.', '2026-08-09', '22:00', '03:00', 'Mexico City', 'Club Central', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80', 'Draft', null, true),
  ('33333333-3333-4333-8333-333333333335', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222', 'Sunset Sessions', 'sunset-sessions-rooftop', 'Warm-up rooftop session with melodic house and pop edits.', '2026-08-23', '18:00', '23:30', 'Mexico City', 'Rooftop Lounge', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=80', 'Draft', null, true)
on conflict (id) do update set name = excluded.name, slug = excluded.slug, status = excluded.status, updated_at = now();

insert into public.song_requests (id, event_id, dj_id, guest_name, song_title, artist, note, music_url, music_provider, music_preview_image_url, music_preview_embed_url, status, guest_session_id, created_at, updated_at)
values
  ('44444444-4444-4444-8444-444444444441', '33333333-3333-4333-8333-333333333333', '11111111-1111-4111-8111-111111111111', 'Mia', 'One More Time', 'Daft Punk', 'For the rooftop crew', 'https://www.youtube.com/watch?v=FGBhQbmPwH8', 'YouTube', 'https://img.youtube.com/vi/FGBhQbmPwH8/hqdefault.jpg', 'https://www.youtube.com/embed/FGBhQbmPwH8?rel=0', 'Pending', 'seed-session-1', '2026-06-26T19:10:00Z', '2026-06-26T19:10:00Z'),
  ('44444444-4444-4444-8444-444444444442', '33333333-3333-4333-8333-333333333333', '11111111-1111-4111-8111-111111111111', 'Chris', 'Titanium', 'David Guetta ft. Sia', null, 'https://open.spotify.com/track/0lHAMNU8RGiIObScrsRgmP', 'Spotify', null, 'https://open.spotify.com/embed/track/0lHAMNU8RGiIObScrsRgmP', 'Approved', 'seed-session-2', '2026-06-26T19:16:00Z', '2026-06-26T19:18:00Z'),
  ('44444444-4444-4444-8444-444444444443', '33333333-3333-4333-8333-333333333333', '11111111-1111-4111-8111-111111111111', 'Sam', 'Blinding Lights', 'The Weeknd', 'Birthday table', 'https://music.apple.com/us/album/blinding-lights/1499378108?i=1499378617', 'Apple Music', null, 'https://embed.music.apple.com/us/album/blinding-lights/1499378108?i=1499378617', 'Played', 'seed-session-3', '2026-06-26T19:24:00Z', '2026-06-26T19:38:00Z')
on conflict (id) do nothing;

insert into public.polls (id, event_id, question, type, is_active, starts_at, ends_at)
values
  ('55555555-5555-4555-8555-555555555551', '33333333-3333-4333-8333-333333333333', 'What genre do you want to hear right now?', 'genre', true, '2026-06-26T19:00:00Z', '2026-07-12T23:59:00Z'),
  ('55555555-5555-4555-8555-555555555552', '33333333-3333-4333-8333-333333333333', 'Which song should Alex Beat play next?', 'song', true, '2026-06-26T19:00:00Z', null)
on conflict (id) do update set question = excluded.question, is_active = excluded.is_active, updated_at = now();

insert into public.poll_options (id, poll_id, label, image_url, display_order)
values
  ('66666666-6666-4666-8666-666666666661', '55555555-5555-4555-8555-555555555551', 'Reggaeton', null, 1),
  ('66666666-6666-4666-8666-666666666662', '55555555-5555-4555-8555-555555555551', 'House', null, 2),
  ('66666666-6666-4666-8666-666666666663', '55555555-5555-4555-8555-555555555551', 'Pop', null, 3),
  ('66666666-6666-4666-8666-666666666664', '55555555-5555-4555-8555-555555555551', 'Hip-Hop', null, 4),
  ('66666666-6666-4666-8666-666666666665', '55555555-5555-4555-8555-555555555552', 'Titi Me Pregunto - Bad Bunny', null, 1),
  ('66666666-6666-4666-8666-666666666666', '55555555-5555-4555-8555-555555555552', 'One More Time - Daft Punk', null, 2),
  ('66666666-6666-4666-8666-666666666667', '55555555-5555-4555-8555-555555555552', 'Hotline Bling - Drake', null, 3)
on conflict (id) do update set label = excluded.label, display_order = excluded.display_order;

insert into public.poll_votes (id, poll_id, option_id, guest_session_id)
values
  ('77777777-7777-4777-8777-777777777771', '55555555-5555-4555-8555-555555555551', '66666666-6666-4666-8666-666666666662', 'seed-session-1'),
  ('77777777-7777-4777-8777-777777777772', '55555555-5555-4555-8555-555555555551', '66666666-6666-4666-8666-666666666662', 'seed-session-2'),
  ('77777777-7777-4777-8777-777777777773', '55555555-5555-4555-8555-555555555551', '66666666-6666-4666-8666-666666666661', 'seed-session-3'),
  ('77777777-7777-4777-8777-777777777774', '55555555-5555-4555-8555-555555555552', '66666666-6666-4666-8666-666666666666', 'seed-session-4')
on conflict (id) do nothing;

insert into public.drinks (id, event_id, name, category, description, price, image_url, promo_text, is_available, display_order)
values
  ('88888888-8888-4888-8888-888888888881', '33333333-3333-4333-8333-333333333333', 'Margarita', 'Cocktails', 'Tequila, lime and orange liqueur served over ice.', 12, 'https://images.unsplash.com/photo-1556855810-ac404aa91e85?auto=format&fit=crop&w=800&q=80', '2x1 until 9 PM', true, 1),
  ('88888888-8888-4888-8888-888888888882', '33333333-3333-4333-8333-333333333333', 'Mojito', 'Cocktails', 'Rum, mint, lime and sparkling soda.', 11, 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80', null, true, 2),
  ('88888888-8888-4888-8888-888888888883', '33333333-3333-4333-8333-333333333333', 'Beer Bucket', 'Beer', 'Five chilled beers for the table.', 28, 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80', 'Best seller', true, 3),
  ('88888888-8888-4888-8888-888888888884', '33333333-3333-4333-8333-333333333333', 'Tequila Shot', 'Shots', 'Premium blanco tequila with lime and salt.', 8, 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=800&q=80', 'Free shot with DJ follow', true, 4),
  ('88888888-8888-4888-8888-888888888885', '33333333-3333-4333-8333-333333333333', 'Bottle Service', 'Bottle Service', 'Premium bottle with mixers and reserved service.', 160, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', 'Ask your server', true, 5)
on conflict (id) do update set name = excluded.name, updated_at = now();

insert into public.promos (id, event_id, title, description, image_url, sponsor_name, valid_until, is_active, display_order)
values
  ('99999999-9999-4999-8999-999999999991', '33333333-3333-4333-8333-333333333333', 'Happy Hour 2x1 Cocktails', 'Order two cocktails and pay one before 9 PM.', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80', 'Rooftop Lounge', '2026-07-12T21:00:00Z', true, 1),
  ('99999999-9999-4999-8999-999999999992', '33333333-3333-4333-8333-333333333333', 'Follow the DJ and get a free shot', 'Show the bar that you followed Alex Beat and claim a tequila shot.', 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80', 'Alex Beat', '2026-07-12T23:59:00Z', true, 2),
  ('99999999-9999-4999-8999-999999999993', '33333333-3333-4333-8333-333333333333', 'Neon Night Special', 'Reserve bottle service for the next show and unlock VIP entry.', 'https://images.unsplash.com/photo-1575444758702-4a6b9222336e?auto=format&fit=crop&w=900&q=80', 'Club Central', '2026-08-09T23:59:00Z', true, 3)
on conflict (id) do update set title = excluded.title, updated_at = now();

insert into public.dj_packages (id, dj_id, title, description, price_from, includes, image_url, is_active)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', '11111111-1111-4111-8111-111111111111', 'Club Night Set', 'Two-hour peak-time set for bars and clubs.', 900, 'DJ performance, USB/CDJ-ready set, social promo asset', 'https://images.unsplash.com/photo-1485872299829-c673f5194813?auto=format&fit=crop&w=900&q=80', true),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', '11111111-1111-4111-8111-111111111111', 'Private Event Package', 'Full event music experience for weddings, rooftops and brand events.', 1400, 'Consultation, playlist planning, four-hour performance, wireless mic', 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=900&q=80', true)
on conflict (id) do update set title = excluded.title, updated_at = now();

insert into public.gallery_items (id, dj_id, event_id, media_url, media_type, caption, display_order)
values
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', '11111111-1111-4111-8111-111111111111', '33333333-3333-4333-8333-333333333333', 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=80', 'image', 'Rooftop sunset crowd', 1),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', '11111111-1111-4111-8111-111111111111', null, 'https://images.unsplash.com/photo-1571266028243-4bb3cf00e331?auto=format&fit=crop&w=900&q=80', 'image', 'Main room energy', 2)
on conflict (id) do nothing;
