"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LayoutDashboard } from "lucide-react";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function AdminReturnLink() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setIsSignedIn(Boolean(data.session));
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(Boolean(session));
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!isSignedIn) return null;

  return (
    <Link
      href="/admin"
      aria-label="Back to dashboard"
      className="inline-flex items-center gap-2 rounded-2xl border border-line bg-surface2 px-2 py-2 text-xs font-semibold text-white transition hover:border-violet/60 hover:text-violet sm:px-3"
    >
      <LayoutDashboard size={15} />
      <span className="hidden sm:inline">Dashboard</span>
    </Link>
  );
}

