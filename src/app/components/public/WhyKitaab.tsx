"use client";

import {
  BookOpen,
  Heart,
  Sparkles,
  Truck,
  ShieldCheck,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { DEFAULTS } from "@/lib/siteDefaults";

const ICONS: Record<string, LucideIcon> = {
  BookOpen,
  Heart,
  Sparkles,
  Truck,
  ShieldCheck,
  Tag,
};

export default function WhyKitaab() {
  const { data } = useSettings();
  const why = data?.why ?? DEFAULTS.why;

  return (
    <section className="bg-[#eee5d8] px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b85f3d]">
            {why.eyebrow}
          </p>

          <h2 className="mt-3 font-serif text-4xl font-semibold text-[#28231f] md:text-5xl">
            {why.title}
          </h2>

          <p className="mt-4 text-[#6f665e]">{why.subtitle}</p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {why.features.map((f: any, i: number) => {
            const Icon = ICONS[f.icon] || BookOpen;

            return (
              <div
                key={`${f.title}-${i}`}
                className="rounded-3xl border border-[#51483f] bg-[#332c27] p-8 text-center transition duration-300 hover:-translate-y-1 hover:border-[#d77a52] hover:shadow-xl"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#493b32] text-[#d77a52]">
                  <Icon size={25} strokeWidth={1.8} />
                </div>

                <h3 className="mt-6 font-serif text-2xl font-semibold text-[#f8f3eb]">
                  {f.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#b8afa6]">
                  {f.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
