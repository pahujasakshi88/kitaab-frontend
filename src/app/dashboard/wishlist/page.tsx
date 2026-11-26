"use client";

import Link from "next/link";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { API } from "@/lib/api";
import {
  useWishlist,
  useRemoveFromWishlist,
  useClearWishlist,
} from "@/hooks/useWishlist";

export default function DashboardWishlistPage() {
  const { data: items = [], isLoading, isError } = useWishlist();
  const remove = useRemoveFromWishlist();
  const clear = useClearWishlist();

  const imageUrl = (img?: string) =>
    img ? (img.startsWith("http") ? img : `${API}${img}`) : null;

  const handleClear = () => {
    if (!confirm("Remove all books from your wishlist?")) return;
    clear.mutate();
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold">My Wishlist</h1>
          <p className="mt-1 text-sm text-[color:var(--c-77716a)]">
            {items.length} {items.length === 1 ? "book" : "books"}
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={handleClear}
            disabled={clear.isPending}
            className="text-sm text-[color:var(--c-77716a)] hover:text-red-600 disabled:opacity-50"
          >
            Clear All
          </button>
        )}
      </div>

      {isLoading && (
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-[color:var(--c-white)]" />
          ))}
        </div>
      )}

      {isError && (
        <p className="mt-8 text-center text-[color:var(--c-77716a)]">
          Could not load your wishlist. Please try again.
        </p>
      )}

      {!isLoading && !isError && items.length === 0 && (
        <div className="mt-8 rounded-3xl bg-[color:var(--c-white)] px-6 py-14 text-center">
          <Heart size={36} className="mx-auto text-[color:var(--c-c66a45)]" />
          <p className="mt-3 text-[color:var(--c-77716a)]">Your wishlist is empty.</p>
          <Link
            href="/dashboard/books"
            className="mt-5 inline-block rounded-full bg-[#8a4a2b] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#6f3a21]"
          >
            Browse Books
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-8 space-y-4">
          {items.map((item: any) => {
            const book = item.book;
            const img = imageUrl(book.image);

            return (
              <div
                key={item._id}
                className="flex items-center gap-5 rounded-2xl border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] p-4"
              >
                <Link
                  href={`/dashboard/books/${book._id}`}
                  className="shrink-0"
                >
                  <div className="h-24 w-[72px] overflow-hidden rounded-lg bg-[color:var(--c-f3eadc)]">
                    {img && (
                      <img
                        src={img}
                        alt={book.title}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                </Link>

                <div className="min-w-0 flex-1">
                  <Link href={`/dashboard/books/${book._id}`}>
                    <h3 className="truncate font-serif text-lg font-semibold hover:underline">
                      {book.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-[color:var(--c-77716a)]">{book.author}</p>
                  <p className="mt-1 text-sm font-semibold">₹{book.price}</p>
                  {book.stock === 0 && (
                    <p className="text-xs text-red-600">Out of stock</p>
                  )}
                </div>

                <button
                  disabled
                  title="Cart jaldi aa raha hai"
                  className="hidden items-center gap-2 rounded-full bg-[#8a4a2b] px-5 py-2 text-sm font-medium text-white opacity-50 sm:flex"
                >
                  <ShoppingCart size={14} /> Add to Cart
                </button>

                <button
                  onClick={() => remove.mutate(item._id)}
                  disabled={remove.isPending}
                  title="Remove"
                  className="text-[color:var(--c-77716a)] hover:text-red-600 disabled:opacity-40"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
