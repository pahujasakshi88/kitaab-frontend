"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { API } from "@/lib/api";
import { usePublicCategories } from "@/hooks/useGuest";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export default function Categories() {
  const {
    data: categories = [],
    isLoading: loading,
    isError: error,
  } = usePublicCategories();

  return (
    <section className="bg-[color:var(--c-f7f3ec)] px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--c-c66a45)]">
            Explore
          </p>

          <h2 className="mt-3 font-serif text-4xl font-semibold text-[color:var(--c-20201d)] md:text-5xl">
            Find Your Next Read
          </h2>

          <p className="mt-4 text-[color:var(--c-77716a)]">
            Explore books based on what you&apos;re in the mood for.
          </p>
        </div>

        {/* States */}
        {loading && (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-3xl border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)]"
              />
            ))}
          </div>
        )}

        {error && (
          <p className="mt-12 text-center text-[color:var(--c-77716a)]">
            Could not load categories. Please try again later.
          </p>
        )}

        {!loading && !error && categories.length === 0 && (
          <p className="mt-12 text-center text-[color:var(--c-77716a)]">No categories yet.</p>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category: Category) => (
              <Link
                key={category._id}
                href={`/books?category=${category._id}`}
                className="group block rounded-3xl border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-[color:var(--c-f3eadc)] text-[color:var(--c-c66a45)] transition group-hover:bg-[#c66a45] group-hover:text-white">
                  {category.image ? (
                    <img
                      src={`${category.image.startsWith("http") ? "" : API}${category.image}`}
                      alt={category.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <BookOpen size={23} strokeWidth={1.8} />
                  )}
                </div>

                <h3 className="mt-6 font-serif text-2xl font-semibold text-[color:var(--c-20201d)]">
                  {category.name}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[color:var(--c-77716a)]">
                  {category.description || `Explore books in ${category.name}.`}
                </p>

                <span className="mt-6 inline-block text-sm font-semibold text-[color:var(--c-c66a45)] transition group-hover:translate-x-1">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
