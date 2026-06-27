"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Disc3 } from "lucide-react";
import { DarkCard } from "@/components/ui/dark-card";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { resetPasswordSchema } from "@/lib/validations";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState("Checking reset link...");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function prepareReset() {
      const supabase = getSupabaseBrowserClient();
      if (!isSupabaseConfigured() || !supabase) {
        setMessage("Supabase is not configured yet.");
        return;
      }

      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const urlError = searchParams.get("error_description") || hashParams.get("error_description");
      if (urlError) {
        setMessage(urlError.split("+").join(" "));
        return;
      }

      const code = searchParams.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setMessage(error.message);
          return;
        }
      }

      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setMessage("Open the newest reset link from your email or request a new one.");
        return;
      }

      setReady(true);
      setMessage("Enter your new password.");
    }

    prepareReset();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const parsed = resetPasswordSchema.safeParse({ password, confirmPassword });
    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message || "Check your password.");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setMessage("Supabase is not configured yet.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }

    await supabase.auth.signOut();
    setCompleted(true);
    setReady(false);
    setMessage("Password updated. You can log in now.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-night px-4 py-10 text-white">
      <DarkCard className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] border border-line bg-night text-violet">
            <Disc3 size={26} />
          </div>
          <h1 className="mt-4 text-3xl font-black">DJ Connect</h1>
          <p className="mt-1 text-sm text-muted">Reset password</p>
        </div>
        {ready ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium" htmlFor="password">New password</label>
              <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-2xl border border-line bg-night px-4 py-3 outline-none focus:border-violet" />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="confirmPassword">Confirm password</label>
              <input id="confirmPassword" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-2 w-full rounded-2xl border border-line bg-night px-4 py-3 outline-none focus:border-violet" />
            </div>
            <button type="submit" disabled={loading} className="gradient-button w-full rounded-2xl px-4 py-3 font-semibold disabled:opacity-60">
              {loading ? "Updating password" : "Update password"}
            </button>
          </form>
        ) : null}
        {message ? <p className="mt-4 text-center text-sm text-muted">{message}</p> : null}
        {completed || !ready ? (
          <Link href="/login" className="mt-4 block rounded-2xl border border-line bg-card px-4 py-3 text-center text-sm font-semibold text-white">
            Go to login
          </Link>
        ) : null}
      </DarkCard>
    </main>
  );
}
