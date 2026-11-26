"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { API } from "@/lib/api";
import { useAdminOrder, useUpdateOrderStatus } from "@/hooks/useAdminOrders";
import { STATUS_STYLE, formatDate } from "@/lib/orderStatus";

// backend ke NEXT map jaisa
const NEXT: Record<string, string[]> = {
  placed: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export default function AdminOrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, isError } = useAdminOrder(id);
  const update = useUpdateOrderStatus();

  const img = (i?: string) =>
    i ? (i.startsWith("http") ? i : `${API}${i}`) : null;

  if (isLoading) return <p>Loading...</p>;
  if (isError || !order)
    return <p className="text-red-600">Order not found.</p>;

  const st = STATUS_STYLE[order.status];
  const options = NEXT[order.status] || [];

  const change = (status: string) => {
    if (
      status === "cancelled" &&
      !confirm("Cancel this order? Stock will be restored.")
    )
      return;
    update.mutate({ id: order._id, status });
  };

  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-4 inline-flex items-center gap-2 text-sm text-[color:var(--c-20201d)]/60 hover:text-[color:var(--c-a8552a)]"
      >
        <ArrowLeft size={16} /> Back to Orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Order #{order.orderNumber}</h1>
          <p className="text-sm text-[color:var(--c-20201d)]/60">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <span
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${st.cls}`}
        >
          {st.label}
        </span>
      </div>

      {/* Status update */}
      <div className="mt-6 rounded-xl bg-[color:var(--c-white)] p-5 shadow-sm">
        <h2 className="mb-3 font-semibold">Update Status</h2>
        {options.length === 0 ? (
          <p className="text-sm text-[color:var(--c-20201d)]/60">
            This order is {order.status}. No further changes possible.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {options.map((s) => (
              <button
                key={s}
                onClick={() => change(s)}
                disabled={update.isPending}
                className={`rounded-lg px-5 py-2 text-sm font-medium disabled:opacity-50 ${
                  s === "cancelled"
                    ? "border border-red-300 text-red-600 hover:bg-red-50"
                    : "bg-[#a8552a] text-white hover:bg-[#8f4623]"
                }`}
              >
                {s === "cancelled"
                  ? "Cancel Order"
                  : `Mark as ${STATUS_STYLE[s].label}`}
              </button>
            ))}
          </div>
        )}
        {update.isError && (
          <p className="mt-3 text-sm text-red-600">
            {(update.error as any)?.response?.data?.message ||
              "Could not update status"}
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-xl bg-[color:var(--c-white)] p-5 shadow-sm">
            <h2 className="mb-4 font-semibold">Items</h2>
            <ul className="space-y-4">
              {order.items.map((it: any) => (
                <li key={it.book} className="flex items-center gap-4">
                  <div className="h-16 w-12 shrink-0 overflow-hidden rounded bg-[color:var(--c-f3eadc)]">
                    {img(it.image) && (
                      <img
                        src={img(it.image)!}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{it.title}</p>
                    <p className="text-xs text-[color:var(--c-20201d)]/60">{it.author}</p>
                    <p className="text-xs text-[color:var(--c-20201d)]/60">
                      Qty {it.quantity} × ₹{it.price}
                    </p>
                  </div>
                  <p className="font-semibold">₹{it.price * it.quantity}</p>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1 border-t border-[color:var(--c-20201d)]/10 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-[color:var(--c-20201d)]/60">Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[color:var(--c-20201d)]/60">Delivery</span>
                <span>
                  {order.deliveryFee ? `₹${order.deliveryFee}` : "Free"}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <span>
                  Total (
                  {order.paymentMethod === "online"
                    ? order.paymentStatus === "paid"
                      ? "Paid online"
                      : "Online, payment pending"
                    : "Cash on Delivery"}
                  )
                </span>{" "}
                <span>₹{order.total}</span>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-[color:var(--c-white)] p-5 shadow-sm">
            <h2 className="mb-4 font-semibold">Status History</h2>
            <ul className="space-y-2 text-sm">
              {order.statusHistory.map((h: any, i: number) => (
                <li key={i} className="flex justify-between">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[h.status].cls}`}
                  >
                    {STATUS_STYLE[h.status].label}
                  </span>
                  <span className="text-[color:var(--c-20201d)]/60">
                    {new Date(h.at).toLocaleString("en-IN")}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl bg-[color:var(--c-white)] p-5 text-sm shadow-sm">
            <h2 className="mb-3 font-semibold">Customer</h2>
            <p className="font-medium">{order.user?.name || "Deleted user"}</p>
            <p className="text-[color:var(--c-20201d)]/60">{order.user?.email}</p>
          </section>

          <section className="rounded-xl bg-[color:var(--c-white)] p-5 text-sm shadow-sm">
            <h2 className="mb-3 font-semibold">Delivery Address</h2>
            <p className="font-medium">{order.address.fullName}</p>
            <p className="text-[color:var(--c-20201d)]/60">
              {order.address.line1}
              {order.address.line2 ? `, ${order.address.line2}` : ""},{" "}
              {order.address.city}, {order.address.state} -{" "}
              {order.address.pincode}
            </p>
            <p className="text-[color:var(--c-20201d)]/60">+91 {order.address.phone}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
