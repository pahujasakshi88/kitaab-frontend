"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { API } from "@/lib/api";
import {
  useCart,
  useUpdateCartItem,
  useRemoveFromCart,
  cartErr,
} from "@/hooks/useCart";
import { deliveryFeeFor, FREE_DELIVERY_ABOVE } from "@/lib/delivery";
export default function CartPage() {
  const { data, isLoading, isError } = useCart();
  const update = useUpdateCartItem();
  const remove = useRemoveFromCart();

  const items: any[] = data?.items || [];
  const total: number = data?.total || 0;
  const count: number = data?.count || 0;
const deliveryFee = deliveryFeeFor(total);
const grandTotal = total + deliveryFee;
  const img = (i?: string) =>
    i ? (i.startsWith("http") ? i : `${API}${i}`) : null;

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-serif text-3xl font-semibold">My Cart</h1>
      <p className="mt-1 text-sm text-[color:var(--c-77716a)]">
        {count} {count === 1 ? "item" : "items"}
      </p>

      {isLoading && (
        <div className="mt-8 space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-[color:var(--c-white)]" />
          ))}
        </div>
      )}

      {isError && (
        <p className="mt-8 text-center text-[color:var(--c-77716a)]">
          Could not load your cart. Please try again.
        </p>
      )}

      {!isLoading && !isError && items.length === 0 && (
        <div className="mt-8 rounded-3xl bg-[color:var(--c-white)] px-6 py-14 text-center">
          <ShoppingCart size={36} className="mx-auto text-[color:var(--c-c66a45)]" />
          <p className="mt-3 text-[color:var(--c-77716a)]">Your cart is empty.</p>
          <Link
            href="/dashboard/books"
            className="mt-5 inline-block rounded-full bg-[#8a4a2b] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#6f3a21]"
          >
            Browse Books
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((item) => {
              const b = item.book;
              const src = img(b.image);
              return (
                <div
                  key={b._id}
                  className="flex items-center gap-4 rounded-2xl border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] p-4"
                >
                  <Link href={`/dashboard/books/${b._id}`} className="shrink-0">
                    <div className="h-24 w-[72px] overflow-hidden rounded-lg bg-[color:var(--c-f3eadc)]">
                      {src && (
                        <img
                          src={src}
                          alt={b.title}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  </Link>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-serif text-lg font-semibold">
                      {b.title}
                    </h3>
                    <p className="text-sm text-[color:var(--c-77716a)]">{b.author}</p>
                    <p className="mt-1 text-sm font-semibold">₹{b.price}</p>
                    {item.quantity >= b.stock && (
                      <p className="mt-1 text-xs text-orange-600">
                        Only {b.stock} available
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-[color:var(--c-e5ded3)] px-2 py-1">
                    <button
                      disabled={item.quantity <= 1 || update.isPending}
                      onClick={() =>
                        update.mutate({
                          bookId: b._id,
                          quantity: item.quantity - 1,
                        })
                      }
                      className="p-1 disabled:opacity-30"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      disabled={item.quantity >= b.stock || update.isPending}
                      onClick={() =>
                        update.mutate({
                          bookId: b._id,
                          quantity: item.quantity + 1,
                        })
                      }
                      className="p-1 disabled:opacity-30"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => remove.mutate(b._id)}
                    disabled={remove.isPending}
                    title="Remove"
                    className="text-red-500 hover:text-red-700 disabled:opacity-40"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}

            {update.isError && (
              <p className="text-sm text-red-600">{cartErr(update.error)}</p>
            )}
          </div>

          <aside className="h-fit rounded-2xl border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] p-6 lg:sticky lg:top-6">
            <h2 className="font-semibold">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[color:var(--c-77716a)]">Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[color:var(--c-77716a)]">Delivery</span>
                <span className="text-green-700">Free</span>
              </div>
              <div className="flex justify-between border-t border-[color:var(--c-e5ded3)] pt-3 text-base font-semibold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-[color:var(--c-77716a)]">Delivery</span>
              {deliveryFee ? (
                <span>₹{deliveryFee}</span>
              ) : (
                <span className="text-green-700">Free</span>
              )}
            </div>
            {deliveryFee > 0 && (
              <p className="text-xs text-[color:var(--c-77716a)]">
                Add ₹{FREE_DELIVERY_ABOVE - total} more for free delivery.
              </p>
            )}
            <div className="flex justify-between border-t border-[color:var(--c-e5ded3)] pt-3 text-base font-semibold">
              <span>Total</span>
              <span>₹{grandTotal}</span>
            </div>
            <Link
              href="/dashboard/checkout"
              className="mt-5 block w-full rounded-full bg-[#8a4a2b] py-3 text-center text-sm font-medium text-white hover:bg-[#6f3a21]"
            >
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
