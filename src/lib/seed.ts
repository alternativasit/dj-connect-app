import type {
  DJ,
  DJPackage,
  Drink,
  EventBundle,
  EventRecord,
  GalleryItem,
  Poll,
  PollOption,
  PollVote,
  Promo,
  SongRequest,
  TipClick,
  Venue
} from "@/lib/types";

const now = "2026-06-26T19:00:00.000Z";

export const seedDjs: DJ[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    owner_id: null,
    name: "Alex Beat",
    slug: "alex-beat",
    photo_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80",
    logo_url: null,
    role: "DJ / Producer",
    bio: "Mexico City DJ blending House, Tech House and melodic late-night energy for rooftops, clubs and private events.",
    city: "Mexico City",
    country: "MX",
    genres: ["House", "Tech House", "Melodic"],
    instagram_url: "https://instagram.com/alexbeatdj",
    tiktok_url: "https://tiktok.com/@alexbeatdj",
    youtube_url: "https://youtube.com/@alexbeatdj",
    featured_video_url: "https://www.youtube.com/watch?v=FGBhQbmPwH8",
    soundcloud_url: "https://soundcloud.com/alexbeatdj",
    mixcloud_url: "https://mixcloud.com/alexbeatdj",
    whatsapp: "+525512345678",
    email: "bookings@alexbeat.dj",
    booking_url: "mailto:bookings@alexbeat.dj?subject=Booking%20Alex%20Beat",
    tip_paypal_url: "https://paypal.me/alexbeatdj",
    tip_venmo_url: "https://venmo.com/alexbeatdj",
    tip_cashapp_url: "https://cash.app/$alexbeatdj",
    tip_stripe_url: "https://buy.stripe.com/test_alexbeat",
    tip_mercadopago_url: "https://mpago.la/alexbeatdj",
    is_active: true,
    created_at: now,
    updated_at: now
  }
];

export const seedVenues: Venue[] = [
  {
    id: "22222222-2222-4222-8222-222222222222",
    owner_id: null,
    name: "Rooftop Lounge",
    logo_url: null,
    address: "Av. Reforma 500",
    city: "Mexico City",
    state: "CDMX",
    country: "MX",
    phone: "+525598765432",
    website: "https://example.com/rooftop-lounge",
    instagram_url: "https://instagram.com/rooftoplounge",
    contact_name: "Venue Manager",
    is_active: true,
    created_at: now,
    updated_at: now
  },
  {
    id: "22222222-2222-4222-8222-222222222223",
    owner_id: null,
    name: "Club Central",
    logo_url: null,
    address: "Centro 22",
    city: "Mexico City",
    state: "CDMX",
    country: "MX",
    phone: null,
    website: null,
    instagram_url: "https://instagram.com/clubcentral",
    contact_name: null,
    is_active: true,
    created_at: now,
    updated_at: now
  }
];

export const seedEvents: EventRecord[] = [
  {
    id: "33333333-3333-4333-8333-333333333333",
    dj_id: seedDjs[0].id,
    venue_id: seedVenues[0].id,
    name: "Sunset Rooftop Party",
    slug: "sunset-rooftop-party",
    description: "A high-energy sunset session with live requests, polls, promos and a rooftop drinks menu.",
    event_date: "2026-07-12",
    start_time: "19:00",
    end_time: "01:00",
    city: "Mexico City",
    address: "Rooftop Lounge, Av. Reforma 500",
    banner_url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1400&q=80",
    status: "Live",
    qr_url: null,
    is_active: true,
    created_at: now,
    updated_at: now
  },
  {
    id: "33333333-3333-4333-8333-333333333334",
    dj_id: seedDjs[0].id,
    venue_id: seedVenues[1].id,
    name: "Neon Nights",
    slug: "neon-nights-club-central",
    description: "Late-night club set with house and tech-house selectors.",
    event_date: "2026-08-09",
    start_time: "22:00",
    end_time: "03:00",
    city: "Mexico City",
    address: "Club Central",
    banner_url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80",
    status: "Draft",
    qr_url: null,
    is_active: true,
    created_at: now,
    updated_at: now
  },
  {
    id: "33333333-3333-4333-8333-333333333335",
    dj_id: seedDjs[0].id,
    venue_id: seedVenues[0].id,
    name: "Sunset Sessions",
    slug: "sunset-sessions-rooftop",
    description: "Warm-up rooftop session with melodic house and pop edits.",
    event_date: "2026-08-23",
    start_time: "18:00",
    end_time: "23:30",
    city: "Mexico City",
    address: "Rooftop Lounge",
    banner_url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=80",
    status: "Draft",
    qr_url: null,
    is_active: true,
    created_at: now,
    updated_at: now
  }
];

export const seedSongRequests: SongRequest[] = [
  {
    id: "44444444-4444-4444-8444-444444444441",
    event_id: seedEvents[0].id,
    dj_id: seedDjs[0].id,
    guest_name: "Mia",
    song_title: "One More Time",
    artist: "Daft Punk",
    note: "For the rooftop crew",
    music_url: "https://www.youtube.com/watch?v=FGBhQbmPwH8",
    music_provider: "YouTube",
    music_preview_image_url: "https://img.youtube.com/vi/FGBhQbmPwH8/hqdefault.jpg",
    music_preview_embed_url: "https://www.youtube.com/embed/FGBhQbmPwH8?rel=0",
    status: "Pending",
    guest_session_id: "seed-session-1",
    created_at: "2026-06-26T19:10:00.000Z",
    updated_at: "2026-06-26T19:10:00.000Z"
  },
  {
    id: "44444444-4444-4444-8444-444444444442",
    event_id: seedEvents[0].id,
    dj_id: seedDjs[0].id,
    guest_name: "Chris",
    song_title: "Titanium",
    artist: "David Guetta ft. Sia",
    note: null,
    music_url: "https://open.spotify.com/track/0lHAMNU8RGiIObScrsRgmP",
    music_provider: "Spotify",
    music_preview_image_url: null,
    music_preview_embed_url: "https://open.spotify.com/embed/track/0lHAMNU8RGiIObScrsRgmP",
    status: "Approved",
    guest_session_id: "seed-session-2",
    created_at: "2026-06-26T19:16:00.000Z",
    updated_at: "2026-06-26T19:18:00.000Z"
  },
  {
    id: "44444444-4444-4444-8444-444444444443",
    event_id: seedEvents[0].id,
    dj_id: seedDjs[0].id,
    guest_name: "Sam",
    song_title: "Blinding Lights",
    artist: "The Weeknd",
    note: "Birthday table",
    music_url: "https://music.apple.com/us/album/blinding-lights/1499378108?i=1499378617",
    music_provider: "Apple Music",
    music_preview_image_url: null,
    music_preview_embed_url: "https://embed.music.apple.com/us/album/blinding-lights/1499378108?i=1499378617",
    status: "Played",
    guest_session_id: "seed-session-3",
    created_at: "2026-06-26T19:24:00.000Z",
    updated_at: "2026-06-26T19:38:00.000Z"
  }
];

export const seedPolls: Poll[] = [
  {
    id: "55555555-5555-4555-8555-555555555551",
    event_id: seedEvents[0].id,
    question: "What genre do you want to hear right now?",
    type: "genre",
    is_active: true,
    starts_at: "2026-06-26T19:00:00.000Z",
    ends_at: "2026-07-12T23:59:00.000Z",
    created_at: now,
    updated_at: now
  },
  {
    id: "55555555-5555-4555-8555-555555555552",
    event_id: seedEvents[0].id,
    question: "Which song should Alex Beat play next?",
    type: "song",
    is_active: true,
    starts_at: "2026-06-26T19:00:00.000Z",
    ends_at: null,
    created_at: now,
    updated_at: now
  }
];

export const seedPollOptions: PollOption[] = [
  { id: "66666666-6666-4666-8666-666666666661", poll_id: seedPolls[0].id, label: "Reggaeton", image_url: null, display_order: 1, created_at: now },
  { id: "66666666-6666-4666-8666-666666666662", poll_id: seedPolls[0].id, label: "House", image_url: null, display_order: 2, created_at: now },
  { id: "66666666-6666-4666-8666-666666666663", poll_id: seedPolls[0].id, label: "Pop", image_url: null, display_order: 3, created_at: now },
  { id: "66666666-6666-4666-8666-666666666664", poll_id: seedPolls[0].id, label: "Hip-Hop", image_url: null, display_order: 4, created_at: now },
  { id: "66666666-6666-4666-8666-666666666665", poll_id: seedPolls[1].id, label: "Titi Me Pregunto - Bad Bunny", image_url: null, display_order: 1, created_at: now },
  { id: "66666666-6666-4666-8666-666666666666", poll_id: seedPolls[1].id, label: "One More Time - Daft Punk", image_url: null, display_order: 2, created_at: now },
  { id: "66666666-6666-4666-8666-666666666667", poll_id: seedPolls[1].id, label: "Hotline Bling - Drake", image_url: null, display_order: 3, created_at: now }
];

export const seedPollVotes: PollVote[] = [
  { id: "77777777-7777-4777-8777-777777777771", poll_id: seedPolls[0].id, option_id: seedPollOptions[1].id, guest_session_id: "seed-session-1", created_at: now },
  { id: "77777777-7777-4777-8777-777777777772", poll_id: seedPolls[0].id, option_id: seedPollOptions[1].id, guest_session_id: "seed-session-2", created_at: now },
  { id: "77777777-7777-4777-8777-777777777773", poll_id: seedPolls[0].id, option_id: seedPollOptions[0].id, guest_session_id: "seed-session-3", created_at: now },
  { id: "77777777-7777-4777-8777-777777777774", poll_id: seedPolls[1].id, option_id: seedPollOptions[5].id, guest_session_id: "seed-session-4", created_at: now }
];

export const seedDrinks: Drink[] = [
  {
    id: "88888888-8888-4888-8888-888888888881",
    event_id: seedEvents[0].id,
    name: "Margarita",
    category: "Cocktails",
    description: "Tequila, lime and orange liqueur served over ice.",
    price: 12,
    image_url: "https://images.unsplash.com/photo-1556855810-ac404aa91e85?auto=format&fit=crop&w=800&q=80",
    promo_text: "2x1 until 9 PM",
    is_available: true,
    display_order: 1,
    created_at: now,
    updated_at: now
  },
  {
    id: "88888888-8888-4888-8888-888888888882",
    event_id: seedEvents[0].id,
    name: "Mojito",
    category: "Cocktails",
    description: "Rum, mint, lime and sparkling soda.",
    price: 11,
    image_url: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80",
    promo_text: null,
    is_available: true,
    display_order: 2,
    created_at: now,
    updated_at: now
  },
  {
    id: "88888888-8888-4888-8888-888888888883",
    event_id: seedEvents[0].id,
    name: "Beer Bucket",
    category: "Beer",
    description: "Five chilled beers for the table.",
    price: 28,
    image_url: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80",
    promo_text: "Best seller",
    is_available: true,
    display_order: 3,
    created_at: now,
    updated_at: now
  },
  {
    id: "88888888-8888-4888-8888-888888888884",
    event_id: seedEvents[0].id,
    name: "Tequila Shot",
    category: "Shots",
    description: "Premium blanco tequila with lime and salt.",
    price: 8,
    image_url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=800&q=80",
    promo_text: "Free shot with DJ follow",
    is_available: true,
    display_order: 4,
    created_at: now,
    updated_at: now
  },
  {
    id: "88888888-8888-4888-8888-888888888885",
    event_id: seedEvents[0].id,
    name: "Bottle Service",
    category: "Bottle Service",
    description: "Premium bottle with mixers and reserved service.",
    price: 160,
    image_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    promo_text: "Ask your server",
    is_available: true,
    display_order: 5,
    created_at: now,
    updated_at: now
  }
];

export const seedPromos: Promo[] = [
  {
    id: "99999999-9999-4999-8999-999999999991",
    event_id: seedEvents[0].id,
    title: "Happy Hour 2x1 Cocktails",
    description: "Order two cocktails and pay one before 9 PM.",
    image_url: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80",
    sponsor_name: "Rooftop Lounge",
    valid_until: "2026-07-12T21:00:00.000Z",
    is_active: true,
    display_order: 1,
    created_at: now,
    updated_at: now
  },
  {
    id: "99999999-9999-4999-8999-999999999992",
    event_id: seedEvents[0].id,
    title: "Follow the DJ and get a free shot",
    description: "Show the bar that you followed Alex Beat and claim a tequila shot.",
    image_url: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80",
    sponsor_name: "Alex Beat",
    valid_until: "2026-07-12T23:59:00.000Z",
    is_active: true,
    display_order: 2,
    created_at: now,
    updated_at: now
  },
  {
    id: "99999999-9999-4999-8999-999999999993",
    event_id: seedEvents[0].id,
    title: "Neon Night Special",
    description: "Reserve bottle service for the next show and unlock VIP entry.",
    image_url: "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?auto=format&fit=crop&w=900&q=80",
    sponsor_name: "Club Central",
    valid_until: "2026-08-09T23:59:00.000Z",
    is_active: true,
    display_order: 3,
    created_at: now,
    updated_at: now
  }
];

export const seedPackages: DJPackage[] = [
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1",
    dj_id: seedDjs[0].id,
    title: "Club Night Set",
    description: "Two-hour peak-time set for bars and clubs.",
    price_from: 900,
    includes: "DJ performance, USB/CDJ-ready set, social promo asset",
    image_url: "https://images.unsplash.com/photo-1485872299829-c673f5194813?auto=format&fit=crop&w=900&q=80",
    is_active: true,
    created_at: now,
    updated_at: now
  },
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2",
    dj_id: seedDjs[0].id,
    title: "Private Event Package",
    description: "Full event music experience for weddings, rooftops and brand events.",
    price_from: 1400,
    includes: "Consultation, playlist planning, four-hour performance, wireless mic",
    image_url: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=900&q=80",
    is_active: true,
    created_at: now,
    updated_at: now
  }
];

export const seedGallery: GalleryItem[] = [
  {
    id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1",
    dj_id: seedDjs[0].id,
    event_id: seedEvents[0].id,
    media_url: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=80",
    media_type: "image",
    caption: "Rooftop sunset crowd",
    display_order: 1,
    created_at: now
  },
  {
    id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2",
    dj_id: seedDjs[0].id,
    event_id: null,
    media_url: "https://images.unsplash.com/photo-1571266028243-4bb3cf00e331?auto=format&fit=crop&w=900&q=80",
    media_type: "image",
    caption: "Main room energy",
    display_order: 2,
    created_at: now
  }
];

export const seedTipClicks: TipClick[] = [
  { id: "cccccccc-cccc-4ccc-8ccc-ccccccccccc1", event_id: seedEvents[0].id, dj_id: seedDjs[0].id, provider: "PayPal", guest_session_id: "seed-session-1", created_at: now }
];

export function getSeedBundle(eventSlug = "sunset-rooftop-party"): EventBundle {
  const event = seedEvents.find((item) => item.slug === eventSlug) || seedEvents[0];
  const dj = seedDjs.find((item) => item.id === event.dj_id) || seedDjs[0];
  const venue = seedVenues.find((item) => item.id === event.venue_id) || null;
  const polls = seedPolls.filter((item) => item.event_id === event.id && item.is_active);
  const pollIds = polls.map((item) => item.id);

  return {
    event,
    dj,
    venue,
    upcomingEvents: seedEvents.filter((item) => item.dj_id === dj.id && item.id !== event.id),
    songRequests: seedSongRequests.filter((item) => item.event_id === event.id),
    polls,
    pollOptions: seedPollOptions.filter((item) => pollIds.includes(item.poll_id)),
    pollVotes: seedPollVotes.filter((item) => pollIds.includes(item.poll_id)),
    drinks: seedDrinks.filter((item) => item.event_id === event.id),
    promos: seedPromos.filter((item) => item.event_id === event.id && item.is_active),
    packages: seedPackages.filter((item) => item.dj_id === dj.id && item.is_active),
    gallery: seedGallery.filter((item) => item.dj_id === dj.id)
  };
}
