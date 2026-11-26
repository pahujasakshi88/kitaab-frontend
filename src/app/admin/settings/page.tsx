"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";

const ICONS = ["BookOpen", "Truck", "ShieldCheck", "Heart", "Sparkles", "Tag"];
const input =
  "w-full rounded-lg border border-[color:var(--c-20201d)]/15 bg-[color:var(--c-white)] px-3 py-2 text-sm outline-none focus:border-[color:var(--c-a8552a)]";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

function Form({ initial }: { initial: any }) {
  const [s, setS] = useState(() => structuredClone(initial));
  const [saved, setSaved] = useState(false);
  const update = useUpdateSettings();

  const set = (section: string, key: string, value: any) =>
    setS((p: any) => ({ ...p, [section]: { ...p[section], [key]: value } }));

  const setFeature = (i: number, key: string, value: string) =>
    set(
      "why",
      "features",
      s.why.features.map((f: any, idx: number) =>
        idx === i ? { ...f, [key]: value } : f,
      ),
    );

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    update.mutate(s, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      },
    });
  };

  const card = "rounded-xl bg-[color:var(--c-white)] p-6 shadow-sm";

  return (
    <form onSubmit={save} className="space-y-6">
      {update.isError && (
        <p className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">
          {(update.error as any)?.response?.data?.message || "Could not save"}
        </p>
      )}
      {saved && (
        <p className="rounded-lg bg-green-100 px-4 py-2 text-sm text-green-700">
          Saved. Homepage is updated.
        </p>
      )}

      <section className={card}>
        <h2 className="mb-4 font-semibold">Hero</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Heading">
            <input
              className={input}
              value={s.hero.heading}
              onChange={(e) => set("hero", "heading", e.target.value)}
            />
          </Field>
          <Field label="Highlighted word">
            <input
              className={input}
              value={s.hero.highlight}
              onChange={(e) => set("hero", "highlight", e.target.value)}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Subheading">
              <input
                className={input}
                value={s.hero.subheading}
                onChange={(e) => set("hero", "subheading", e.target.value)}
              />
            </Field>
          </div>
        </div>
      </section>

      <section className={card}>
        <h2 className="mb-4 font-semibold">Why Kitaab</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Small label">
            <input
              className={input}
              value={s.why.eyebrow}
              onChange={(e) => set("why", "eyebrow", e.target.value)}
            />
          </Field>
          <Field label="Title">
            <input
              className={input}
              value={s.why.title}
              onChange={(e) => set("why", "title", e.target.value)}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Subtitle">
              <input
                className={input}
                value={s.why.subtitle}
                onChange={(e) => set("why", "subtitle", e.target.value)}
              />
            </Field>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <p className="text-sm font-medium">Features (max 6)</p>
          {s.why.features.map((f: any, i: number) => (
            <div
              key={i}
              className="grid gap-2 rounded-lg border border-[color:var(--c-20201d)]/10 p-3 sm:grid-cols-[140px_1fr_2fr_auto]"
            >
              <select
                className={input}
                value={f.icon}
                onChange={(e) => setFeature(i, "icon", e.target.value)}
              >
                {ICONS.map((ic) => (
                  <option key={ic}>{ic}</option>
                ))}
              </select>
              <input
                required
                placeholder="Title"
                className={input}
                value={f.title}
                onChange={(e) => setFeature(i, "title", e.target.value)}
              />
              <input
                required
                placeholder="Text"
                className={input}
                value={f.text}
                onChange={(e) => setFeature(i, "text", e.target.value)}
              />
              <button
                type="button"
                title="Remove"
                onClick={() =>
                  set(
                    "why",
                    "features",
                    s.why.features.filter((_: any, idx: number) => idx !== i),
                  )
                }
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {s.why.features.length < 6 && (
            <button
              type="button"
              onClick={() =>
                set("why", "features", [
                  ...s.why.features,
                  { icon: "BookOpen", title: "", text: "" },
                ])
              }
              className="flex items-center gap-1 text-sm text-[color:var(--c-a8552a)]"
            >
              <Plus size={14} /> Add feature
            </button>
          )}
        </div>
      </section>

      <section className={card}>
        <h2 className="mb-4 font-semibold">Call to Action</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <input
              className={input}
              value={s.cta.title}
              onChange={(e) => set("cta", "title", e.target.value)}
            />
          </Field>
          <Field label="Button text">
            <input
              className={input}
              value={s.cta.buttonText}
              onChange={(e) => set("cta", "buttonText", e.target.value)}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Text">
              <input
                className={input}
                value={s.cta.text}
                onChange={(e) => set("cta", "text", e.target.value)}
              />
            </Field>
          </div>
        </div>
      </section>

      <section className={card}>
        <h2 className="mb-4 font-semibold">Footer</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="About">
              <textarea
                rows={2}
                className={input}
                value={s.footer.about}
                onChange={(e) => set("footer", "about", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Email">
            <input
              className={input}
              value={s.footer.email}
              onChange={(e) => set("footer", "email", e.target.value)}
            />
          </Field>
          <Field label="Phone">
            <input
              className={input}
              value={s.footer.phone}
              onChange={(e) => set("footer", "phone", e.target.value)}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Address">
              <input
                className={input}
                value={s.footer.address}
                onChange={(e) => set("footer", "address", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Instagram link">
            <input
              placeholder="https://..."
              className={input}
              value={s.footer.instagram}
              onChange={(e) => set("footer", "instagram", e.target.value)}
            />
          </Field>
          <Field label="Facebook link">
            <input
              placeholder="https://..."
              className={input}
              value={s.footer.facebook}
              onChange={(e) => set("footer", "facebook", e.target.value)}
            />
          </Field>
          <Field label="Twitter / X link">
            <input
              placeholder="https://..."
              className={input}
              value={s.footer.twitter}
              onChange={(e) => set("footer", "twitter", e.target.value)}
            />
          </Field>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={update.isPending}
          className="rounded-lg bg-[#a8552a] px-8 py-2.5 text-sm font-medium text-white hover:bg-[#8f4623] disabled:opacity-50"
        >
          {update.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export default function AdminSettingsPage() {
  const { data, isLoading, isError } = useSettings();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Site Settings</h1>
      <p className="mb-6 mt-1 text-sm text-[color:var(--c-20201d)]/60">
        Homepage ka text yahan se badlo. Khali chhodne par default text dikhta
        hai.
      </p>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">Could not load settings.</p>}
      {data && <Form initial={data} />}
    </div>
  );
}
