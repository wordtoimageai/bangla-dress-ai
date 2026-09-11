"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        setMessage("আপনার ইমেইল যাচাই করুন — কনফার্মেশন লিঙ্ক পাঠানো হয়েছে");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(redirect);
        router.refresh();
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message === "Invalid login credentials"
            ? "ইমেইল বা পাসওয়ার্ড ভুল"
            : err.message
          : "সমস্যা হয়েছে"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}` },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-white px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-red-700 text-center mb-6">
          {isRegister ? "রেজিস্ট্রেশন" : "লগইন"}
        </h1>

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">ইমেইল</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="border rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">পাসওয়ার্ড</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              className="border rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2.5 rounded-lg font-semibold disabled:opacity-50 hover:bg-red-700 transition"
          >
            {loading ? "প্রসেস হচ্ছে..." : isRegister ? "অ্যাকাউন্ট তৈরি করুন" : "লগইন করুন"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-2">
          <div className="flex-1 border-t" />
          <span className="text-xs text-gray-400">অথবা</span>
          <div className="flex-1 border-t" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full border border-gray-300 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google দিয়ে চালু করুন
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          {isRegister ? "ইতিমধ্যে অ্যাকাউন্ট আছে?" : "নতুন যোগ দিতে চান?"}{" "}
          <button
            onClick={() => { setIsRegister(!isRegister); setError(""); setMessage(""); }}
            className="text-red-600 font-medium hover:underline"
          >
            {isRegister ? "লগইন করুন" : "রেজিস্ট্রেশন করুন"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">লোড হচ্ছে...</div>}>
      <LoginForm />
    </Suspense>
  );
}
