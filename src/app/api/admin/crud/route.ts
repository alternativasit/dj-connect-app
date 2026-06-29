import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

type AdminRole = "super_admin" | "dj_admin" | "venue_admin";

const allowedTables = new Set([
  "djs",
  "venues",
  "events",
  "song_requests",
  "polls",
  "poll_options",
  "drinks",
  "promos",
  "dj_packages",
  "gallery_items"
]);

const requestSchema = z.object({
  table: z.string(),
  action: z.enum(["insert", "update", "delete"]),
  id: z.string().optional(),
  payload: z.record(z.unknown()).optional()
});

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

async function requireAdmin(request: NextRequest) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return { error: "Server admin key is not configured. Add SUPABASE_SERVICE_ROLE_KEY in Netlify.", status: 500 as const };

  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  if (!token) return { error: "Please log in again before saving.", status: 401 as const };

  const { data: userResult, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userResult.user) return { error: "Your session expired. Please log in again.", status: 401 as const };

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userResult.user.id)
    .maybeSingle();

  if (profileError) return { error: profileError.message, status: 500 as const };
  const role = profile?.role as AdminRole | undefined;
  if (!role || !["super_admin", "dj_admin", "venue_admin"].includes(role)) {
    return { error: "This user does not have admin permissions.", status: 403 as const };
  }

  return { supabase, role, userId: userResult.user.id };
}

export async function POST(request: NextRequest) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Invalid admin request.");

  const { table, action, id, payload = {} } = parsed.data;
  if (!allowedTables.has(table)) return jsonError("This table cannot be changed from the admin panel.", 403);

  const auth = await requireAdmin(request);
  if ("error" in auth) return jsonError(auth.error || "Admin access failed.", auth.status || 500);

  try {
    if (action === "delete") {
      if (!id) return jsonError("Missing record ID.");
      if (table === "events") {
        const { data: eventPolls, error: pollLookupError } = await auth.supabase.from("polls").select("id").eq("event_id", id);
        if (pollLookupError) return jsonError(pollLookupError.message, 400);
        const pollIds = (eventPolls || []).map((poll) => poll.id).filter(Boolean);

        if (pollIds.length) {
          const { error: voteError } = await auth.supabase.from("poll_votes").delete().in("poll_id", pollIds);
          if (voteError) return jsonError(voteError.message, 400);
          const { error: optionError } = await auth.supabase.from("poll_options").delete().in("poll_id", pollIds);
          if (optionError) return jsonError(optionError.message, 400);
          const { error: pollError } = await auth.supabase.from("polls").delete().in("id", pollIds);
          if (pollError) return jsonError(pollError.message, 400);
        }

        const relatedTables = ["song_requests", "drinks", "promos", "gallery_items", "tip_clicks", "sponsor_clicks"];
        for (const relatedTable of relatedTables) {
          const { error: relatedError } = await auth.supabase.from(relatedTable).delete().eq("event_id", id);
          if (relatedError) return jsonError(relatedError.message, 400);
        }
      }
      if (table === "polls") {
        const { error: voteError } = await auth.supabase.from("poll_votes").delete().eq("poll_id", id);
        if (voteError) return jsonError(voteError.message, 400);
        const { error: optionError } = await auth.supabase.from("poll_options").delete().eq("poll_id", id);
        if (optionError) return jsonError(optionError.message, 400);
      }
      if (table === "poll_options") {
        const { error: voteError } = await auth.supabase.from("poll_votes").delete().eq("option_id", id);
        if (voteError) return jsonError(voteError.message, 400);
      }
      const { error } = await auth.supabase.from(table).delete().eq("id", id);
      if (error) return jsonError(error.message, 400);
      return NextResponse.json({ ok: true });
    }

    if (action === "update") {
      if (!id) return jsonError("Missing record ID.");
      const { data, error } = await auth.supabase.from(table).update(payload).eq("id", id).select("*").single();
      if (error) return jsonError(error.message, 400);
      return NextResponse.json({ ok: true, row: data });
    }

    const { data, error } = await auth.supabase.from(table).insert(payload).select("*").single();
    if (error) return jsonError(error.message, 400);
    return NextResponse.json({ ok: true, row: data });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not save.", 500);
  }
}

export async function GET(request: NextRequest) {
  const table = request.nextUrl.searchParams.get("table") || "";
  const filterColumn = request.nextUrl.searchParams.get("filterColumn");
  const filterValue = request.nextUrl.searchParams.get("filterValue");

  if (!allowedTables.has(table)) return jsonError("This table cannot be read from the admin panel.", 403);

  const auth = await requireAdmin(request);
  if ("error" in auth) return jsonError(auth.error || "Admin access failed.", auth.status || 500);

  try {
    let query = auth.supabase.from(table).select("*");
    if (filterColumn && filterValue) query = query.eq(filterColumn, filterValue);
    if (table === "events") query = query.order("event_date", { ascending: true });
    else query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) return jsonError(error.message, 400);
    return NextResponse.json({ ok: true, rows: data || [] });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not load records.", 500);
  }
}
