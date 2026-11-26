"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { API } from "@/lib/api";
import { discountPercent } from "@/lib/discount";
import Stars from "@/components/Stars";
import ReviewsSection from "@/components/books/ReviewsSection";
import { useAuth } from "@/context/AuthContext";
import { useBook } from "@/hooks/useGuest";
import { useWishlist, useAddToWishlist } from "@/hooks/useWishlist";
import { useAddToCart, cartErr } from "@/hooks/useCart";

type Tab = "about" | "details" | "reviews";

export default function BookDetailsView({
  id,
  backHref,
}: {
  id: string;
  backHref: string;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("about");
const [qty, setQty] = useState(1);
  const { data: book, isLoading, isError } = useBook(id);
  const { data: wishlist = [] } = useWishlist();
  const add = useAddToWishlist();
  const addCart = useAddToCart();

  const inWishlist = wishlist.some((w: any) => (w.book?._id || w.book) === id);

  const handleWishlist = () => {
    if (!user) return router.push("/login");
    add.mutate(id);
  };

  const handleCart = () => {
    if (!user) return router.push("/login");
    addCart.mutate(
      { bookId: id, quantity: qty },
      { onSuccess: () => router.push("/dashboard/cart") },
    );
  };

    const handleBuyNow = () => {
      if (!user) return router.push("/login");
      router.push(`/dashboard/checkout?buy=${id}&qty=${qty}`);
    };

  if (isLoading) return <p className="p-10 text-center">Loading...</p>;

  if (isError || !book)
    return (
      <div className="p-10 text-center">
        <p>Book not found.</p>
        <Link href={backHref} className="mt-3 inline-block underline">
          Back to books
        </Link>
      </div>
    );

  const categoryName =
    typeof book.category === "object" ? book.category?.name : book.category;
  const outOfStock = book.stock === 0;
  const off = discountPercent(book.price, book.originalPrice);
  const imageSrc = book.image
    ? book.image.startsWith("http")
      ? book.image
      : `${API}${book.image}`
    : null;

  const details = [
    { label: "Author", value: book.author },
    { label: "Category", value: categoryName },
    { label: "Language", value: book.language },
    { label: "Pages", value: book.pages },
    { label: "Published", value: book.publishedYear },
  ].filter((d) => d.value);

  const tabs: { key: Tab; label: string }[] = [
    { key: "about", label: "About Book" },
    { key: "details", label: "Details" },
    {
      key: "reviews",
      label: `Reviews${book.ratingCount ? ` (${book.ratingCount})` : ""}`,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href={backHref}
        className="mb-6 inline-flex items-center gap-2 text-sm text-[color:var(--c-77716a)] hover:text-[color:var(--c-c66a45)]"
      >
        <ArrowLeft size={16} /> Back to Books
      </Link>

      <div className="grid gap-8 rounded-3xl bg-[color:var(--c-white)] p-6 md:p-10 lg:grid-cols-[300px_1fr_240px]">
        <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-[color:var(--c-f3eadc)]">
          {imageSrc && (
            <img
              src={imageSrc}
              alt={book.title}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--c-c66a45)]">
            {categoryName}
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-[color:var(--c-20201d)]">
            {book.title}
          </h1>
          <p className="mt-2 text-[color:var(--c-77716a)]">by {book.author}</p>

          {book.ratingCount > 0 && (
            <button
              onClick={() => setTab("reviews")}
              className="mt-2 flex items-center gap-2 text-sm"
            >
              <Stars value={book.ratingAverage} size={16} />
              <span className="font-medium">{book.ratingAverage}</span>
              <span className="text-[color:var(--c-77716a)]">
                ({book.ratingCount}{" "}
                {book.ratingCount === 1 ? "review" : "reviews"})
              </span>
            </button>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <p className="text-3xl font-semibold text-[color:var(--c-20201d)]">
              ₹{book.price}
            </p>
            {off > 0 && (
              <>
                <p className="text-lg text-[color:var(--c-77716a)] line-through">
                  ₹{book.originalPrice}
                </p>
                <span className="rounded-md border border-green-300 bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                  {off}% OFF
                </span>
              </>
            )}
          </div>

          <p
            className={`mt-2 text-sm font-medium ${
              outOfStock
                ? "text-red-600"
                : book.stock <= 5
                  ? "text-orange-600"
                  : "text-green-700"
            }`}
          >
            {outOfStock
              ? "Out of stock"
              : book.stock <= 5
                ? `Only ${book.stock} left`
                : "In stock"}
          </p>

          {!outOfStock && (
            <div className="mt-5 flex items-center gap-4">
              <span className="text-sm text-[color:var(--c-77716a)]">Quantity</span>
              <div className="flex items-center rounded-full border border-[color:var(--c-e5ded3)]">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  className="p-2.5 disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center text-sm font-medium">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(book.stock, q + 1))}
                  disabled={qty >= book.stock}
                  className="p-2.5 disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleCart}
              disabled={outOfStock || addCart.isPending}
              className="flex items-center gap-2 rounded-full bg-[#8a4a2b] px-6 py-3 text-sm font-medium text-white hover:bg-[#6f3a21] disabled:opacity-50"
            >
              <ShoppingCart size={16} />
              {addCart.isPending ? "Adding..." : "Add to Cart"}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={outOfStock || addCart.isPending}
              className="flex items-center gap-2 rounded-full border border-[color:var(--c-8a4a2b)] px-6 py-3 text-sm font-medium text-[color:var(--c-8a4a2b)] hover:bg-[#8a4a2b] hover:text-white disabled:opacity-50"
            >
              <Zap size={16} />
              Buy Now
            </button>
            <button
              onClick={handleWishlist}
              disabled={inWishlist || add.isPending}
              className="flex items-center gap-2 rounded-full border border-[color:var(--c-e5ded3)] px-6 py-3 text-sm font-medium hover:border-[color:var(--c-c66a45)] disabled:opacity-60"
            >
              <Heart
                size={16}
                className={inWishlist ? "fill-[color:var(--c-c66a45)] text-[color:var(--c-c66a45)]" : ""}
              />
              {inWishlist ? "In Wishlist" : "Add to Wishlist"}
            </button>
          </div>

          {add.isError && (
            <p className="mt-3 text-sm text-red-600">
              {(add.error as any)?.response?.data?.message ||
                "Could not add to wishlist"}
            </p>
          )}
          {addCart.isError && (
            <p className="mt-3 text-sm text-red-600">
              {cartErr(addCart.error)}
            </p>
          )}

          {/* Tabs */}
          <div className="mt-8 flex gap-6 border-b border-[color:var(--c-e5ded3)]">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`-mb-px border-b-2 pb-3 text-sm font-medium ${
                  tab === t.key
                    ? "border-[color:var(--c-8a4a2b)] text-[color:var(--c-8a4a2b)]"
                    : "border-transparent text-[color:var(--c-77716a)]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "about" && (
            <p className="mt-5 whitespace-pre-line leading-7 text-[color:var(--c-77716a)]">
              {book.description}
            </p>
          )}

          {tab === "details" && (
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
              {details.map((d) => (
                <div key={d.label}>
                  <dt className="text-[color:var(--c-77716a)]">{d.label}</dt>
                  <dd className="mt-0.5 font-medium">{d.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {tab === "reviews" && <ReviewsSection bookId={id} />}
        </div>

        <aside className="hidden h-fit rounded-2xl border border-[color:var(--c-e5ded3)] p-5 lg:block">
          <h2 className="mb-4 font-semibold">Book Details</h2>
          <dl className="space-y-4 text-sm">
            {details.map((d) => (
              <div key={d.label}>
                <dt className="text-xs text-[color:var(--c-77716a)]">{d.label}</dt>
                <dd className="mt-0.5 font-medium">{d.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </div>
  );
}
