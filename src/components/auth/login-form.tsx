"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Disc3 } from "lucide-react";
import { DarkCard } from "@/components/ui/dark-card";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { loginSchema } from "@/lib/validations";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message || "Check your login details");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!isSupabaseConfigured() || !supabase) {
      router.push("/admin");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    router.push("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-night px-4 py-10 text-white">
      <DarkCard className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] border border-line bg-night text-violet">
            <Disc3 size={26} />
          </div>
          <h1 className="mt-4 text-3xl font-black">DJ Connect</h1>
          <p className="mt-1 text-sm text-muted">Dashboard login</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-2xl border border-line bg-night px-4 py-3 outline-none focus:border-violet" />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-2xl border border-line bg-night px-4 py-3 outline-none focus:border-violet" />
          </div>
          <button type="submit" disabled={loading} className="gradient-button w-full rounded-2xl px-4 py-3 font-semibold disabled:opacity-60">
            {loading ? "Signing in" : "Login"}
          </button>
          {!isSupabaseConfigured() ? <p className="text-center text-xs text-muted">Demo mode is active until Supabase env vars are added.</p> : null}
          {message ? <p className="text-center text-sm text-rose-300">{message}</p> : null}
        </form>
      </DarkCard>
    </main>
  );
}
