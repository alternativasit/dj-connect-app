import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let serviceClient: SupabaseClient | null = null;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

export function getSupabaseServiceClient() {
  if (!supabaseUrl || !serviceRoleKey || !supabaseUrl.startsWith("https://")) return null;
  if (serviceClient) return serviceClient;

  serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  return serviceClient;
}
