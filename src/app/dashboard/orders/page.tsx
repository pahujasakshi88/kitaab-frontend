"use client";

import { useState } from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import { API } from "@/lib/api";
import { useMyOrders } from "@/hooks/useOrders";
import { STATUS_STYLE, formatDate } from "@/lib/orderStatus";

const TABS = [
  { key: "", label: "All" },
  { key: "placed", label: "Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

export default function MyOrdersPage() {
  const [tab, setTab] = useState("");
  const {
    data: orders = [],
    isLoading,
    isError,
  } = useMyOrders(tab || undefined);

  const img = (i?: string) =>
    i ? (i.startsWith("http") ? i : `${API}${i}`) : null;

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-serif text-3xl font-semibold">My Orders</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-1.5 text-sm ${
              tab === t.key
                ? "bg-[#8a4a2b] text-white"
                : "border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] hover:border-[color:var(--c-c66a45)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-[color:var(--c-white)]" />
          ))}
        </div>
      )}

      {isError && (
        <p className="mt-6 text-center text-[color:var(--c-77716a)]">
          Could not load your orders.
        </p>
      )}

      {!isLoading && !isError && orders.length === 0 && (
        <div className="mt-6 rounded-3xl bg-[color:var(--c-white)] px-6 py-14 text-center">
          <Package size={36} className="mx-auto text-[color:var(--c-c66a45)]" />
          <p className="mt-3 text-[color:var(--c-77716a)]">No orders here yet.</p>
          <Link
            href="/dashboard/books"
            className="mt-5 inline-block rounded-full bg-[#8a4a2b] px-6 py-2.5 text-sm font-medium text-white"
          >
            Browse Books
          </Link>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {orders.map((o: any) => {
          const st = STATUS_STYLE[o.status];
          return (
            <Link
              key={o._id}
              href={`/dashboard/orders/${o._id}`}
              className="flex items-center gap-4 rounded-2xl border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] p-4 transition hover:shadow-md"
            >
              <div className="flex -space-x-3">
                {o.items.slice(0, 3).map((it: any, idx: number) => (
                  <div
                    key={idx}
                    className="h-16 w-12 overflow-hidden rounded border-2 border-white bg-[color:var(--c-f3eadc)]"
                  >
                    {img(it.image) && (
                      <img
                        src={img(it.image)!}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-semibold">#{o.orderNumber}</p>
                <p className="text-xs text-[color:var(--c-77716a)]">
                  {formatDate(o.createdAt)} · {o.items.length}{" "}
                  {o.items.length === 1 ? "book" : "books"}
                </p>
              </div>

              <p className="font-semibold">₹{o.total}</p>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${st.cls}`}
              >
                {st.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
