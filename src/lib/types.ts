export type UserRole = "super_admin" | "dj_admin" | "venue_admin";
export type EventStatus = "Draft" | "Live" | "Finished";
export type SongRequestStatus = "Pending" | "Approved" | "Played" | "Rejected";
export type PollType = "genre" | "song" | "custom";
export type MediaType = "image" | "video";

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface DJ {
  id: string;
  owner_id?: string | null;
  name: string;
  slug: string;
  photo_url: string | null;
  logo_url: string | null;
  role: string | null;
  bio: string | null;
  city: string | null;
  country: string | null;
  genres: string[];
  instagram_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;
  featured_video_url?: string | null;
  soundcloud_url: string | null;
  mixcloud_url: string | null;
  whatsapp: string | null;
  email: string | null;
  booking_url: string | null;
  tip_paypal_url: string | null;
  tip_venmo_url: string | null;
  tip_cashapp_url: string | null;
  tip_stripe_url: string | null;
  tip_mercadopago_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Venue {
  id: string;
  owner_id?: string | null;
  name: string;
  logo_url: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  phone: string | null;
  website: string | null;
  instagram_url: string | null;
  contact_name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventRecord {
  id: string;
  dj_id: string;
  venue_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  city: string | null;
  address: string | null;
  banner_url: string | null;
  status: EventStatus;
  qr_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SongRequest {
  id: string;
  event_id: string;
  dj_id: string;
  guest_name: string;
  song_title: string;
  artist: string;
  note: string | null;
  music_url?: string | null;
  music_provider?: string | null;
  music_preview_image_url?: string | null;
  music_preview_embed_url?: string | null;
  status: SongRequestStatus;
  guest_session_id: string;
  created_at: string;
  updated_at: string;
}

export interface Poll {
  id: string;
  event_id: string;
  question: string;
  type: PollType;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PollOption {
  id: string;
  poll_id: string;
  label: string;
  image_url: string | null;
  display_order: number;
  created_at: string;
}

export interface PollVote {
  id: string;
  poll_id: string;
  option_id: string;
  guest_session_id: string;
  created_at: string;
}

export interface Drink {
  id: string;
  event_id: string;
  name: string;
  category: string;
  description: string | null;
  price: number;
  image_url: string | null;
  promo_text: string | null;
  is_available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Promo {
  id: string;
  event_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  sponsor_name: string | null;
  valid_until: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface DJPackage {
  id: string;
  dj_id: string;
  title: string;
  description: string | null;
  price_from: number | null;
  includes: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  dj_id: string;
  event_id: string | null;
  media_url: string;
  media_type: MediaType;
  caption: string | null;
  display_order: number;
  created_at: string;
}

export interface TipClick {
  id: string;
  event_id: string;
  dj_id: string;
  provider: string;
  guest_session_id: string;
  created_at: string;
}

export interface SponsorClick {
  id: string;
  event_id: string;
  sponsor_name: string;
  guest_session_id: string;
  created_at: string;
}

export interface EventBundle {
  event: EventRecord;
  dj: DJ;
  venue: Venue | null;
  upcomingEvents: EventRecord[];
  songRequests: SongRequest[];
  polls: Poll[];
  pollOptions: PollOption[];
  pollVotes: PollVote[];
  drinks: Drink[];
  promos: Promo[];
  packages: DJPackage[];
  gallery: GalleryItem[];
}

export interface DashboardMetrics {
  activeEvents: number;
  totalSongRequests: number;
  pendingRequests: number;
  totalVotes: number;
  activePromos: number;
  tipClicks: number;
  upcomingEvents: number;
}

export interface AdminData {
  metrics: DashboardMetrics;
  djs: DJ[];
  venues: Venue[];
  events: EventRecord[];
  songRequests: SongRequest[];
  polls: Poll[];
  pollOptions: PollOption[];
  pollVotes: PollVote[];
  drinks: Drink[];
  promos: Promo[];
  packages: DJPackage[];
  gallery: GalleryItem[];
  tipClicks: TipClick[];
}
