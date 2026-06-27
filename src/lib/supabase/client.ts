import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("https://"));
}

export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) return null;
  if (browserClient) return browserClient;

  browserClient = createClient(
    supabaseUrl as string,
    supabaseAnonKey as string,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    }
  );

  return browserClient;
}

export function getSupabaseServerClient() {
  if (!isSupabaseConfigured()) return null;
  return createClient(
    supabaseUrl as string,
    supabaseAnonKey as string,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  );
}
