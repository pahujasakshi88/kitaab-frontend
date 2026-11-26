"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
//import { usePublicBooks } from "@/hooks/useGuest";
import { useFeaturedBooks } from "@/hooks/useGuest";
import { API } from "@/lib/api";
interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  category: { _id: string; name: string; slug: string } | string;
  price: number;
  stock: number;
  image?: string;
}


export default function TrendingBooks() {
  const { data: books = [], isLoading: loading } = useFeaturedBooks();
  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
return `${API}${imagePath}`;
  };

  const getCategoryName = (category: Book["category"]) =>
    typeof category === "object" && category !== null
      ? category.name
      : category;

  return (
    <section className="bg-[color:var(--c-white)] px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--c-c66a45)]">
              Trending Reads
            </p>

            <h2 className="mt-3 font-serif text-4xl font-semibold text-[color:var(--c-20201d)] md:text-5xl">
              Books Everyone Is Loving
            </h2>
          </div>

          <Link
            href="/books"
            className="flex items-center gap-2 text-sm font-semibold text-[color:var(--c-c66a45)] transition-all hover:gap-3"
          >
            View all
            <ArrowRight size={17} />
          </Link>
        </div>

        {loading && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[520px] animate-pulse rounded-3xl bg-[color:var(--c-f7f3ec)]"
              />
            ))}
          </div>
        )}

        {!loading && books.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {books.slice(0, 8).map((book: Book) => (
              <div
                key={book._id}
                className="group overflow-hidden rounded-3xl border border-[color:var(--c-e5ded3)] bg-[color:var(--c-f7f3ec)] transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-[400px] w-full overflow-hidden">
                  {book.image ? (
                    <img
                      src={getImageUrl(book.image)!}
                      alt={book.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[color:var(--c-white)] p-6 text-center">
                      <p className="font-serif text-xl font-semibold text-[color:var(--c-20201d)]">
                        {book.title}
                      </p>
                    </div>
                  )}
                </div>

                <div className="min-h-[160px] p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--c-c66a45)]">
                    {getCategoryName(book.category)}
                  </p>

                  <h3 className="mt-2 line-clamp-2 font-serif text-2xl font-semibold text-[color:var(--c-20201d)]">
                    {book.title}
                  </h3>

                  <p className="mt-2 text-sm text-[color:var(--c-77716a)]">
                    {book.author}
                  </p>

                  <p className="mt-3 text-sm font-semibold text-[color:var(--c-20201d)]">
                    ₹{book.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && books.length === 0 && (
          <div className="mt-12 rounded-3xl bg-[color:var(--c-f7f3ec)] px-6 py-12 text-center">
            <p className="text-[color:var(--c-77716a)]">
              No books available right now.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

