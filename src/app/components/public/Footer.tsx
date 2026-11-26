"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { DEFAULTS } from "@/lib/siteDefaults";

const social =
  "flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-[#aaa098] transition duration-300 hover:border-[color:var(--c-c66a45)] hover:bg-[#c66a45] hover:text-white";

export default function Footer() {
  const { data } = useSettings();
  const f = data?.footer ?? DEFAULTS.footer;

  return (
    <footer className="bg-[#29231f] px-6 pb-8 pt-16 text-[#f8f3eb] lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c66a45]">
                <BookOpen size={22} strokeWidth={1.7} />
              </div>
              <span className="font-serif text-3xl font-semibold">Kitaab</span>
            </div>

            <p className="mt-5 max-w-md text-sm leading-7 text-[#aaa098]">
              {f.about}
            </p>

            {(f.email || f.phone || f.address) && (
              <div className="mt-5 space-y-2 text-sm text-[#aaa098]">
                {f.email && (
                  <p className="flex items-center gap-2">
                    <Mail size={15} /> {f.email}
                  </p>
                )}
                {f.phone && (
                  <p className="flex items-center gap-2">
                    <Phone size={15} /> {f.phone}
                  </p>
                )}
                {f.address && (
                  <p className="flex items-center gap-2">
                    <MapPin size={15} /> {f.address}
                  </p>
                )}
              </div>
            )}

            <Link
              href="/books"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#d77a52] transition hover:text-[#e99a78]"
            >
              Explore Books
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f8f3eb]">
              Explore
            </h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-[#aaa098]">
              <Link href="/books" className="transition hover:text-white">
                Trending Books
              </Link>
              <Link href="/books" className="transition hover:text-white">
                Categories
              </Link>
              <Link
                href="/books?sort=newest"
                className="transition hover:text-white"
              >
                New Arrivals
              </Link>
              <Link href="/books" className="transition hover:text-white">
                All Books
              </Link>
            </div>
          </div>

          {/* Kitaab */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f8f3eb]">
              Kitaab
            </h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-[#aaa098]">
              <a href="#" className="transition hover:text-white">
                About Us
              </a>
              <a href="#" className="transition hover:text-white">
                Contact
              </a>
              <a href="#" className="transition hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="transition hover:text-white">
                Terms
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-5 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#80766e]">
            © {new Date().getFullYear()} Kitaab. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            {f.instagram && (
              <a
                href={f.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={social}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            )}

            {f.facebook && (
              <a
                href={f.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className={social}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            )}

            {f.twitter && (
              <a
                href={f.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className={social}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817-5.963 6.817H1.684l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
