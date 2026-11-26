"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, Check, CheckCircle2 } from "lucide-react";
import { API } from "@/lib/api";
import { useMyOrder, useCancelOrder } from "@/hooks/useOrders";
import { STATUS_STYLE, formatDate } from "@/lib/orderStatus";

const STEPS = ["placed", "confirmed", "shipped", "delivered"];

function Content() {
  const { id } = useParams<{ id: string }>();
  const placed = useSearchParams().get("placed") === "1";
  const { data: order, isLoading, isError } = useMyOrder(id);
  const cancel = useCancelOrder();

  const img = (i?: string) =>
    i ? (i.startsWith("http") ? i : `${API}${i}`) : null;

  if (isLoading) return <p className="p-10 text-center">Loading...</p>;
  if (isError || !order)
    return (
      <div className="p-10 text-center">
        <p>Order not found.</p>
        <Link href="/dashboard/orders" className="mt-3 inline-block underline">
          Back to orders
        </Link>
      </div>
    );

  const st = STATUS_STYLE[order.status];
  const cancelled = order.status === "cancelled";
  const reached = (s: string) =>
    order.statusHistory.find((h: any) => h.status === s);
  const currentIdx = STEPS.indexOf(order.status);
const canCancel =
  ["placed", "confirmed"].includes(order.status) &&
  order.paymentStatus !== "paid";

  const handleCancel = () => {
    if (!confirm("Cancel this order?")) return;
    cancel.mutate(order._id);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/dashboard/orders"
        className="mb-4 inline-flex items-center gap-2 text-sm text-[color:var(--c-77716a)] hover:text-[color:var(--c-c66a45)]"
      >
        <ArrowLeft size={16} /> Back to Orders
      </Link>

      {placed && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-green-50 p-4 text-green-800">
          <CheckCircle2 size={22} />
          <div>
            <p className="font-semibold">Order placed successfully!</p>
            <p className="text-sm">
              {order.paymentMethod === "online"
                ? "Payment received. Thank you!"
                : "Pay cash when your books arrive."}
            </p>{" "}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold">
            #{order.orderNumber}
          </h1>
          <p className="text-sm text-[color:var(--c-77716a)]">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <span
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${st.cls}`}
        >
          {st.label}
        </span>
      </div>

      {/* Tracking */}
      <section className="mt-6 rounded-2xl border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] p-6">
        <h2 className="mb-5 font-semibold">Order Status</h2>
        {cancelled ? (
          <p className="text-sm text-red-700">
            This order was cancelled on {formatDate(reached("cancelled")?.at)}.
          </p>
        ) : (
          <div className="flex items-start">
            {STEPS.map((s, i) => {
              const done = i <= currentIdx;
              return (
                <div
                  key={s}
                  className="flex flex-1 flex-col items-center text-center"
                >
                  <div className="flex w-full items-center">
                    <div
                      className={`h-0.5 flex-1 ${i === 0 ? "opacity-0" : done ? "bg-[#8a4a2b]" : "bg-[color:var(--c-e5ded3)]"}`}
                    />
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full ${done ? "bg-[#8a4a2b] text-white" : "bg-[color:var(--c-e5ded3)]"}`}
                    >
                      {done && <Check size={14} />}
                    </div>
                    <div
                      className={`h-0.5 flex-1 ${i === STEPS.length - 1 ? "opacity-0" : i < currentIdx ? "bg-[#8a4a2b]" : "bg-[color:var(--c-e5ded3)]"}`}
                    />
                  </div>
                  <p className="mt-2 text-xs font-medium">
                    {STATUS_STYLE[s].label}
                  </p>
                  <p className="text-[10px] text-[color:var(--c-77716a)]">
                    {formatDate(reached(s)?.at)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_300px]">
        {/* Items */}
        <section className="rounded-2xl border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] p-6">
          <h2 className="mb-4 font-semibold">Items</h2>
          <ul className="space-y-4">
            {order.items.map((it: any) => (
              <li key={it.book} className="flex items-center gap-4">
                <div className="h-20 w-14 shrink-0 overflow-hidden rounded bg-[color:var(--c-f3eadc)]">
                  {img(it.image) && (
                    <img
                      src={img(it.image)!}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/dashboard/books/${it.book}`}
                    className="font-medium hover:underline"
                  >
                    {it.title}
                  </Link>
                  <p className="text-xs text-[color:var(--c-77716a)]">{it.author}</p>
                  <p className="text-xs text-[color:var(--c-77716a)]">
                    Qty {it.quantity} × ₹{it.price}
                  </p>
                </div>
                <p className="font-semibold">₹{it.price * it.quantity}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Address + totals */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] p-6 text-sm">
            <h2 className="mb-3 font-semibold">Delivery Address</h2>
            <p className="font-medium">{order.address.fullName}</p>
            <p className="text-[color:var(--c-77716a)]">
              {order.address.line1}
              {order.address.line2 ? `, ${order.address.line2}` : ""},{" "}
              {order.address.city}, {order.address.state} -{" "}
              {order.address.pincode}
            </p>
            <p className="text-[color:var(--c-77716a)]">+91 {order.address.phone}</p>
          </section>

          <section className="rounded-2xl border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] p-6 text-sm">
            <h2 className="mb-3 font-semibold">Payment</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[color:var(--c-77716a)]">Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[color:var(--c-77716a)]">Delivery</span>
                <span>
                  {order.deliveryFee ? `₹${order.deliveryFee}` : "Free"}
                </span>
              </div>
              <div className="flex justify-between border-t border-[color:var(--c-e5ded3)] pt-2 text-base font-semibold">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
              {order.paymentMethod === "online"
                ? "Paid online"
                : "Cash on Delivery"}{" "}
            </div>
          </section>

          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={cancel.isPending}
              className="w-full rounded-full border border-red-300 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {cancel.isPending ? "Cancelling..." : "Cancel Order"}
            </button>
          )}
          {cancel.isError && (
            <p className="text-sm text-red-600">
              {(cancel.error as any)?.response?.data?.message ||
                "Could not cancel"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailsPage() {
  return (
    <Suspense fallback={<p className="p-10 text-center">Loading...</p>}>
      <Content />
    </Suspense>
  );
}
