"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      const user = await login(email, password);
      // Admin ko admin panel, baaki users ko home
      router.push(user.role === "admin" ? "/admin" : "/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[color:var(--c-btn-dark)] px-6 pt-24">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl bg-[color:var(--c-f3eadc)] p-8 shadow-xl"
      >
        <div>
          <h1 className="text-3xl font-semibold text-[color:var(--c-20201d)]">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-[color:var(--c-20201d)]/70">
            Login to continue your reading journey.
          </p>
        </div>

        {error && (
          <p className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-[color:var(--c-20201d)]">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-[color:var(--c-20201d)]/20 bg-[color:var(--c-white)] px-4 py-2.5 text-[color:var(--c-20201d)] outline-none focus:border-[color:var(--c-20201d)]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-[color:var(--c-20201d)]">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            className="w-full rounded-lg border border-[color:var(--c-20201d)]/20 bg-[color:var(--c-white)] px-4 py-2.5 text-[color:var(--c-20201d)] outline-none focus:border-[color:var(--c-20201d)]"
          />
        </div>
        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-[color:var(--c-20201d)]/70 underline"
          >
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-[color:var(--c-btn-dark)] py-3 text-sm font-medium text-white transition hover:bg-black disabled:opacity-50"
        >
          {busy ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-[color:var(--c-20201d)]/70">
          New here?{" "}
          <Link href="/register" className="font-medium underline">
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
}
