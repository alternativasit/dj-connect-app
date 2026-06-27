# DJ Connect

DJ Connect is a complete Next.js + Supabase interactive event app for DJs, venues, bars, clubs and event organizers. Guests scan a QR code to request songs, vote in live polls, view drinks and promos, tip the DJ, follow social links and book services.

The user interface is intentionally in English for US-ready sales and demos.

## Main Features

- Guest event app at `/event/[eventSlug]`
- Request a Song form with guest session and My Requests
- Live Polls with one vote per guest session
- Drinks Menu with categories, prices, promos and availability
- Event Promos with sponsors and valid-until dates
- Public DJ Profile with links, gallery, packages, tip and booking buttons
- Tip page with external PayPal, Venmo, Cash App, Stripe and Mercado Pago links
- Screen Mode for TVs/tablets/laptops with large QR and promos
- Supabase Auth login at `/login`
- Admin Dashboard at `/admin`
- CRUD routes for DJs, Events, Venues, Packages and Gallery
- Event admin panels for Song Requests, Polls, Drinks and Promos
- Supabase Realtime support for song requests and poll votes
- PWA manifest and service worker
- Netlify-ready configuration

## Tech Stack

- Next.js + React + TypeScript
- Tailwind CSS
- Supabase PostgreSQL, Auth, Storage and Realtime
- Zod validation
- External payment/tip links for MVP
- QR generation per event URL

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Run the dev server:

```bash
npm run dev
```

4. Open:

- Guest app: http://localhost:3000/event/sunset-rooftop-party
- Admin: http://localhost:3000/admin
- Login: http://localhost:3000/login
- Screen Mode: http://localhost:3000/event/sunset-rooftop-party/screen

If Supabase env vars are not configured, the app runs with local seed data for preview. When Supabase is configured, admin routes require Supabase Auth.

## Supabase Setup

1. Create a Supabase project.
2. Open SQL Editor.
3. Run `supabase/schema.sql`.
4. Run `supabase/seed.sql`.
5. Create an Auth user for the admin.
6. Insert a profile row for that Auth user:

```sql
insert into public.profiles (id, full_name, role)
values ('AUTH_USER_UUID', 'Admin User', 'super_admin');
```

7. Optional: assign ownership for scoped DJ or venue admins:

```sql
update public.djs set owner_id = 'AUTH_USER_UUID' where slug = 'alex-beat';
update public.venues set owner_id = 'AUTH_USER_UUID' where name = 'Rooftop Lounge';
```

## Realtime

The schema adds `song_requests` and `poll_votes` to the Supabase realtime publication. In Supabase, confirm Realtime is enabled for those tables if your project settings require manual table toggles.

## Storage

The schema creates public buckets:

- `dj-assets`
- `event-assets`
- `venue-assets`

The current MVP accepts image URLs in admin forms. Supabase Storage buckets and policies are ready for replacing URL inputs with direct uploads.

## Netlify Deploy

1. Push this project to GitHub.
2. Create a new Netlify site from the repo.
3. Set build command: `npm run build`.
4. Leave publish directory empty unless Netlify asks for one. Netlify detects Next.js automatically.
5. Add environment variables from `.env.example`.
6. Set `NEXT_PUBLIC_APP_URL` to the final Netlify URL, for example `https://dj-connect.netlify.app`.
7. Deploy and then test the guest URL, login and admin dashboard.

## Vercel Deploy

The app also works on Vercel. Add the same environment variables and deploy as a standard Next.js project.

## Main Routes

### Guest

- `/event/[eventSlug]`
- `/event/[eventSlug]/request-song`
- `/event/[eventSlug]/polls`
- `/event/[eventSlug]/drinks`
- `/event/[eventSlug]/promos`
- `/event/[eventSlug]/dj`
- `/event/[eventSlug]/tip`
- `/event/[eventSlug]/screen`

### Admin

- `/login`
- `/admin`
- `/admin/djs`
- `/admin/events`
- `/admin/events/[eventId]`
- `/admin/events/[eventId]/requests`
- `/admin/events/[eventId]/polls`
- `/admin/events/[eventId]/drinks`
- `/admin/events/[eventId]/promos`
- `/admin/venues`
- `/admin/packages`
- `/admin/gallery`

## Seed Demo

Included demo:

- DJ: Alex Beat
- Event: Sunset Rooftop Party at Rooftop Lounge
- Upcoming: Neon Nights and Sunset Sessions
- Requests: One More Time, Titanium, Blinding Lights
- Genre Poll: Reggaeton, House, Pop, Hip-Hop
- Song Poll: Titi Me Pregunto, One More Time, Hotline Bling
- Drinks: Margarita, Mojito, Beer Bucket, Tequila Shot, Bottle Service
- Promos: Happy Hour 2x1 Cocktails, Follow the DJ and get a free shot, Neon Night Special
