"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import ThemePicker from "@/components/ThemePicker";
type Prefs = { orderUpdates: boolean; newBooks: boolean; promotions: boolean };

const OPTIONS: { key: keyof Prefs; title: string; text: string }[] = [
  {
    key: "orderUpdates",
    title: "Order Updates",
    text: "Get notified about your order status",
  },
  {
    key: "newBooks",
    title: "New Book Recommendations",
    text: "Get personalized book suggestions",
  },
  {
    key: "promotions",
    title: "Promotions & Offers",
    text: "Be the first to know about deals",
  },
];

export default function SettingsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["preferences"],
    queryFn: userService.getPreferences,
  });
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) setPrefs(data);
  }, [data]);

  const save = useMutation({
    mutationFn: userService.updatePreferences,
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  if (isLoading || !prefs)
    return <p className="p-10 text-center">Loading...</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-serif text-3xl font-semibold">Settings</h1>
      <ThemePicker />
      <div className="mt-6 rounded-2xl border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] p-6">
        <h2 className="font-semibold">Notification Preferences</h2>

        <div className="mt-4 divide-y divide-[color:var(--c-e5ded3)]">
          {OPTIONS.map((o) => (
            <div
              key={o.key}
              className="flex items-center justify-between gap-4 py-4"
            >
              <div>
                <p className="text-sm font-medium">{o.title}</p>
                <p className="text-xs text-[color:var(--c-77716a)]">{o.text}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={prefs[o.key]}
                onClick={() => setPrefs({ ...prefs, [o.key]: !prefs[o.key] })}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  prefs[o.key] ? "bg-[#8a4a2b]" : "bg-[#d8d0c4]"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                    prefs[o.key] ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        {save.isError && (
          <p className="mt-3 text-sm text-red-600">
            {(save.error as any)?.response?.data?.message || "Could not save"}
          </p>
        )}
        {saved && (
          <p className="mt-3 text-sm text-green-700">Preferences saved.</p>
        )}

        <button
          onClick={() => save.mutate(prefs)}
          disabled={save.isPending}
          className="mt-5 w-full rounded-full bg-[#8a4a2b] py-3 text-sm font-medium text-white hover:bg-[#6f3a21] disabled:opacity-50"
        >
          {save.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
