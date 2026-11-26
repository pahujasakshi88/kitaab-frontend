"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    try {
      const data = await api("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setMessage(data.message);
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
            Forgot password?
          </h1>
          <p className="mt-1 text-sm text-[color:var(--c-20201d)]/70">
            Enter your email and we will send you a reset link.
          </p>
        </div>

        {error && (
          <p className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        {message && (
          <p className="rounded-lg bg-green-100 px-4 py-2 text-sm text-green-700">
            {message}
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

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-[color:var(--c-btn-dark)] py-3 text-sm font-medium text-white transition hover:bg-black disabled:opacity-50"
        >
          {busy ? "Sending..." : "Send reset link"}
        </button>

        <p className="text-center text-sm text-[color:var(--c-20201d)]/70">
          <Link href="/login" className="font-medium underline">
            Back to login
          </Link>
        </p>
      </form>
    </main>
  );
}
