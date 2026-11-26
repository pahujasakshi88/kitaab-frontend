"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Heart, Search } from "lucide-react";
import { API } from "@/lib/api";
import { discountPercent } from "@/lib/discount";
import Stars from "@/components/Stars";
import { useAuth } from "@/context/AuthContext";
import { useAuthors, useBooks, usePublicCategories } from "@/hooks/useGuest";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useWishlist,
} from "@/hooks/useWishlist";

interface Book {
  _id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  ratingAverage?: number;
  ratingCount?: number;
  image?: string;
  category: { _id: string; name: string } | string;
}
const PRICE_RANGES = [
  { value: "0-299", label: "Under ₹300" },
  { value: "300-499", label: "₹300 – ₹499" },
  { value: "500-799", label: "₹500 – ₹799" },
  { value: "800-", label: "₹800 & above" },
];
const select =
  "rounded-full border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] px-5 py-3 text-sm outline-none";

function Content({ detailsBase }: { detailsBase: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const { user } = useAuth();

  const category = sp.get("category") || "";
  const author = sp.get("author") || "";
  const search = sp.get("search") || "";
  const sort = sp.get("sort") || "newest";

    const price = sp.get("price") || "";
    const [minPrice, maxPrice] = price
      ? price.split("-").map((v) => (v === "" ? undefined : Number(v)))
      : [undefined, undefined];

  const page = Number(sp.get("page") || 1);

  const [text, setText] = useState(search);

  const update = (changes: Record<string, string>) => {
    const next = new URLSearchParams(sp.toString());
    Object.entries(changes).forEach(([k, v]) =>
      v ? next.set(k, v) : next.delete(k),
    );
    router.push(`${pathname}?${next.toString()}`);
  };

  useEffect(() => setText(search), [search]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (text !== search) update({ search: text, page: "1" });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const { data: categories = [] } = usePublicCategories();
  const { data: authors = [] } = useAuthors();
  const { data, isLoading, isError } = useBooks({
    search: search || undefined,
    category: category || undefined,
    author: author || undefined,
    minPrice,
    maxPrice,
    sort,
    page,
  });

  // Wishlist heart: guest aur user ko, admin ko nahi
  const showHeart = !user || user.role === "user";
  const { data: wishlist = [] } = useWishlist();
  const addWish = useAddToWishlist();
  const removeWish = useRemoveFromWishlist();
  const wished = new Map<string, string>(
    wishlist.map((w: any) => [w.book?._id || w.book, w._id]),
  );
  const busyWish = addWish.isPending || removeWish.isPending;

  const toggleWish = (bookId: string) => {
    if (!user) return router.push("/login");
    const itemId = wished.get(bookId);
    if (itemId) removeWish.mutate(itemId);
    else addWish.mutate(bookId);
  };

  const books: Book[] = data?.books || [];
  const totalPages: number = data?.pagination?.totalPages || 1;
  const filtered = !!(search || category || author || price);
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-serif text-3xl font-semibold md:text-4xl">
        All Books
      </h1>
      <p className="mt-1 text-sm text-[color:var(--c-77716a)]">
        Discover your next favorite book
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--c-77716a)]"
          />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search by title or author"
            className="w-full rounded-full border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] py-3 pl-11 pr-4 text-sm outline-none focus:border-[color:var(--c-c66a45)]"
          />
        </div>

        <select
          value={category}
          onChange={(e) => update({ category: e.target.value, page: "1" })}
          className={select}
        >
          <option value="">All Categories</option>
          {categories.map((c: { _id: string; name: string }) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={author}
          onChange={(e) => update({ author: e.target.value, page: "1" })}
          className={select}
        >
          <option value="">All Authors</option>
          {authors.map((a: string) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <select
          value={price}
          onChange={(e) => update({ price: e.target.value, page: "1" })}
          className={select}
        >
          <option value="">Price Range</option>
          {PRICE_RANGES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        
        <select
          value={sort}
          onChange={(e) => update({ sort: e.target.value, page: "1" })}
          className={select}
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {filtered && (
        <button
          onClick={() => router.push(pathname)}
          className="mt-3 text-sm text-[color:var(--c-c66a45)] hover:underline"
        >
          Clear filters
        </button>
      )}

      {isLoading && (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse rounded-2xl bg-[color:var(--c-white)]"
            />
          ))}
        </div>
      )}

      {isError && (
        <p className="mt-8 text-center text-[color:var(--c-77716a)]">
          Could not load books. Please try again.
        </p>
      )}

      {!isLoading && !isError && books.length === 0 && (
        <p className="mt-8 rounded-2xl bg-[color:var(--c-white)] px-6 py-12 text-center text-[color:var(--c-77716a)]">
          No books found.
        </p>
      )}

      {books.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {books.map((book) => {
            const off = discountPercent(book.price, book.originalPrice);
            const isWished = wished.has(book._id);

            return (
              <div
                key={book._id}
                className="group relative overflow-hidden rounded-2xl border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Link href={`${detailsBase}/${book._id}`} className="block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-[color:var(--c-f3eadc)]">
                    {book.image && (
                      <img
                        src={
                          book.image.startsWith("http")
                            ? book.image
                            : `${API}${book.image}`
                        }
                        alt={book.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    )}
                    {off > 0 && (
                      <span className="absolute left-2 top-2 rounded-md bg-green-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                        {off}% OFF
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--c-c66a45)]">
                      {typeof book.category === "object"
                        ? book.category?.name
                        : book.category}
                    </p>
                    <h3 className="mt-1 line-clamp-1 text-sm font-semibold">
                      {book.title}
                    </h3>
                    <p className="line-clamp-1 text-xs text-[color:var(--c-77716a)]">
                      {book.author}
                    </p>

                    {!!book.ratingCount && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-[color:var(--c-77716a)]">
                        <Stars value={book.ratingAverage || 0} size={12} />
                        <span>
                          {book.ratingAverage} ({book.ratingCount})
                        </span>
                      </div>
                    )}

                    <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
                      ₹{book.price}
                      {off > 0 && (
                        <span className="font-normal text-[color:var(--c-77716a)] line-through">
                          ₹{book.originalPrice}
                        </span>
                      )}
                    </p>
                  </div>
                </Link>

                {/* Link ke bahar, taaki click par details na khule */}
                {showHeart && (
                  <button
                    onClick={() => toggleWish(book._id)}
                    disabled={busyWish}
                    aria-label={
                      isWished ? "Remove from wishlist" : "Add to wishlist"
                    }
                    title={
                      isWished ? "Remove from wishlist" : "Add to wishlist"
                    }
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow hover:bg-[color:var(--c-white)] disabled:opacity-60"
                  >
                    <Heart
                      size={16}
                      className={
                        isWished
                          ? "fill-[color:var(--c-c66a45)] text-[color:var(--c-c66a45)]"
                          : "text-[color:var(--c-20201d)]/60"
                      }
                    />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            disabled={page <= 1}
            onClick={() => update({ page: String(page - 1) })}
            className="rounded-full border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] px-5 py-2 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-[color:var(--c-77716a)]">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => update({ page: String(page + 1) })}
            className="rounded-full border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] px-5 py-2 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default function BooksListing({ detailsBase }: { detailsBase: string }) {
  return (
    <Suspense fallback={<p className="p-10 text-center">Loading...</p>}>
      <Content detailsBase={detailsBase} />
    </Suspense>
  );
}
