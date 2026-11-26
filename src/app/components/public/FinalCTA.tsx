"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { DEFAULTS } from "@/lib/siteDefaults";

export default function FinalCTA() {
  const { data } = useSettings();
  const cta = data?.cta ?? DEFAULTS.cta;

  return (
    <section className="bg-[color:var(--c-f7f3ec)] px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-[#e2d8ca] bg-[#eee3d4]">
          {/* Decorative circle */}
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full border border-[#d7c7b5]" />

          <div className="relative grid items-center lg:grid-cols-2">
            {/* LEFT CONTENT */}
            <div className="px-8 py-14 md:px-12 md:py-16 lg:px-16 lg:py-20">
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-8 bg-[#c66a45]" />
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a85c3e]">
                  Your next chapter
                </p>
              </div>

              <h2 className="mt-6 max-w-xl font-serif text-4xl font-semibold leading-[1.08] text-[#29231f] md:text-5xl">
                {cta.title}
              </h2>

              <p className="mt-5 max-w-md text-[15px] leading-7 text-[#71675e]">
                {cta.text}
              </p>

              <Link
                href="/books"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#29231f] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:gap-4 hover:bg-[#3c332d]"
              >
                {cta.buttonText}
                <ArrowRight size={17} />
              </Link>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative px-6 pb-6 lg:px-6 lg:py-6 lg:pr-8">
              <div className="relative h-[320px] overflow-hidden rounded-[2rem] md:h-[380px] lg:h-[430px]">
                <Image
                  src="/cta-books.jpg"
                  alt="A reader enjoying a book"
                  fill
                  className="object-cover transition duration-700 hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-white/20 bg-[#fffaf3]/90 px-5 py-4 backdrop-blur-md">
                  <div>
                    <p className="font-serif text-lg font-semibold text-[#29231f]">
                      Turn the page.
                    </p>
                    <p className="mt-1 text-xs text-[#756b62]">
                      Your next favorite book might be here.
                    </p>
                  </div>

                  <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#c66a45] text-white sm:flex">
                    <Sparkles size={17} strokeWidth={1.6} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
