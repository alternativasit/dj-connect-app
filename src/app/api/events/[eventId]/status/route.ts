import { NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/client";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_request: Request, { params }: { params: { eventId: string } }) {
  const supabase = getSupabaseServiceClient() || getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured yet." }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("events")
    .select("id,status,is_active,updated_at")
    .eq("id", params.eventId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (!data) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  return NextResponse.json({ event: data });
}
