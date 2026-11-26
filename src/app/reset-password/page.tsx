"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

function ResetForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    setBusy(true);
    try {
      const data = await api("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      setMessage(data.message);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-md space-y-4 rounded-2xl bg-[color:var(--c-f3eadc)] p-8 text-center shadow-xl">
        <p className="text-[color:var(--c-20201d)]">This reset link is not valid.</p>
        <Link href="/forgot-password" className="font-medium underline">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-5 rounded-2xl bg-[color:var(--c-f3eadc)] p-8 shadow-xl"
    >
      <div>
        <h1 className="text-3xl font-semibold text-[color:var(--c-20201d)]">
          Set new password
        </h1>
        <p className="mt-1 text-sm text-[color:var(--c-20201d)]/70">
          Choose a new password for your account.
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
        <label className="text-sm font-medium text-[color:var(--c-20201d)]">
          New password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-[color:var(--c-20201d)]/20 bg-[color:var(--c-white)] px-4 py-2.5 text-[color:var(--c-20201d)] outline-none focus:border-[color:var(--c-20201d)]"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-[color:var(--c-20201d)]">
          Confirm password
        </label>
        <input
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full rounded-lg border border-[color:var(--c-20201d)]/20 bg-[color:var(--c-white)] px-4 py-2.5 text-[color:var(--c-20201d)] outline-none focus:border-[color:var(--c-20201d)]"
        />
      </div>

      <button
        type="submit"
        disabled={busy || !!message}
        className="w-full rounded-full bg-[color:var(--c-btn-dark)] py-3 text-sm font-medium text-white transition hover:bg-black disabled:opacity-50"
      >
        {busy ? "Saving..." : "Reset password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[color:var(--c-btn-dark)] px-6 pt-24">
      <Suspense fallback={null}>
        <ResetForm />
      </Suspense>
    </main>
  );
}
