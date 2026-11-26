"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { DEFAULTS } from "@/lib/siteDefaults";

export default function Hero() {
  const { data } = useSettings();
  const hero = data?.hero ?? DEFAULTS.hero;

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/books.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/25" />
      <div className="absolute inset-0 bg-black/10 md:hidden" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[color:var(--c-f7f3ec)] to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-5 sm:px-6 lg:px-10">
        <div className="max-w-3xl pt-20 sm:pt-16">
          <h1 className="max-w-3xl font-serif text-[2.8rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {hero.heading}{" "}
            {hero.highlight && (
              <span className="text-[#d77a52]">{hero.highlight}</span>
            )}
          </h1>

          <p className="mt-8 max-w-xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8 md:text-xl">
            {hero.subheading}
          </p>

          <div className="mt-10 flex max-w-2xl flex-col gap-3 sm:mt-9 sm:flex-row">
            <div className="flex min-h-[54px] flex-1 items-center gap-3 rounded-full bg-[color:var(--c-white)] px-5 py-3.5">
              <Mail size={19} className="shrink-0 text-[color:var(--c-77716a)]" />
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full bg-transparent text-sm text-[color:var(--c-20201d)] outline-none placeholder:text-[color:var(--c-77716a)]"
              />
            </div>

            <Link
              href="/register"
              className="group flex min-h-[54px] items-center justify-center gap-2 rounded-full bg-[#c66a45] px-7 py-3.5 text-sm font-semibold text-white transition duration-300 hover:bg-[#b85d3b]"
            >
              Get Started
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
