"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/user.service";
import { formatDate } from "@/lib/orderStatus";

const errMsg = (e: any) =>
  e?.response?.data?.message || e?.message || "Something went wrong";

const input =
  "w-full rounded-lg border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] px-3 py-2.5 text-sm outline-none focus:border-[color:var(--c-c66a45)]";

export default function ProfileView({
  accent = "#8a4a2b",
}: {
  accent?: string;
}) {
  const { user, setUser } = useAuth();

  // Personal info
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saved, setSaved] = useState(false);

  const profile = useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (u) => {
      setUser(u);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  // Password
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwDone, setPwDone] = useState(false);

  const password = useMutation({
    mutationFn: userService.changePassword,
    onSuccess: () => {
      setCurrent("");
      setNext("");
      setConfirm("");
      setPwDone(true);
      setTimeout(() => setPwDone(false), 3000);
    },
    onError: (e) => setPwError(errMsg(e)),
  });

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    profile.mutate({ name, phone });
  };

  const savePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwDone(false);
    if (next.length < 6)
      return setPwError("New password must be at least 6 characters");
    if (next !== confirm) return setPwError("New passwords do not match");
    password.mutate({ currentPassword: current, newPassword: next });
  };

  if (!user) return null;

  const btn =
    "rounded-full px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50";

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-serif text-3xl font-semibold">My Profile</h1>

      {/* Header */}
      <div className="mt-6 flex items-center gap-4 rounded-2xl border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] p-6">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-semibold text-white"
          style={{ backgroundColor: accent }}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-sm text-[color:var(--c-77716a)]">{user.email}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-[color:var(--c-77716a)]">
            <span className="rounded-full bg-[color:var(--c-f1e3d3)] px-2 py-0.5 font-medium capitalize text-[color:var(--c-8a4a2b)]">
              {user.role}
            </span>
            <span>Member since {formatDate(user.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Personal info */}
      <form
        onSubmit={saveProfile}
        className="mt-6 rounded-2xl border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] p-6"
      >
        <h2 className="mb-4 font-semibold">Personal Information</h2>

        {profile.isError && (
          <p className="mb-4 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">
            {errMsg(profile.error)}
          </p>
        )}
        {saved && (
          <p className="mb-4 rounded-lg bg-green-100 px-3 py-2 text-sm text-green-700">
            Profile updated.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">Full name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={input}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input
              value={user.email}
              disabled
              className={`${input} cursor-not-allowed bg-[color:var(--c-f7f3ec)] text-[color:var(--c-77716a)]`}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Mobile</label>
            <input
              value={phone}
              maxLength={10}
              placeholder="10-digit number"
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className={input}
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={profile.isPending}
            className={btn}
            style={{ backgroundColor: accent }}
          >
            {profile.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Change password */}
      <form
        onSubmit={savePassword}
        className="mt-6 rounded-2xl border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] p-6"
      >
        <h2 className="mb-4 font-semibold">Change Password</h2>

        {pwError && (
          <p className="mb-4 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">
            {pwError}
          </p>
        )}
        {pwDone && (
          <p className="mb-4 rounded-lg bg-green-100 px-3 py-2 text-sm text-green-700">
            Password updated.
          </p>
        )}

        <div className="grid gap-4">
          <input
            type="password"
            required
            placeholder="Current password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className={input}
          />
          <input
            type="password"
            required
            placeholder="New password (min 6 characters)"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className={input}
          />
          <input
            type="password"
            required
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={input}
          />
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={password.isPending}
            className={btn}
            style={{ backgroundColor: accent }}
          >
            {password.isPending ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
