"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAdminUser, useUpdateUserStatus } from "@/hooks/useAdminUsers";
import { STATUS_STYLE, formatDate } from "@/lib/orderStatus";

export default function AdminUserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useAdminUser(id);
  const update = useUpdateUserStatus();
  const [tab, setTab] = useState<"info" | "orders">("info");

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p className="text-red-600">User not found.</p>;

  const { user, orders, stats } = data;
  const active = user.status === "active";

  const toggle = () => {
    const next = active ? "inactive" : "active";
    if (
      next === "inactive" &&
      !confirm(
        `Deactivate ${user.name}? They will be logged out and cannot sign in.`,
      )
    )
      return;
    update.mutate({ id: user._id, status: next });
  };

  return (
    <div>
      <Link
        href="/admin/users"
        className="mb-4 inline-flex items-center gap-2 text-sm text-[color:var(--c-20201d)]/60 hover:text-[color:var(--c-a8552a)]"
      >
        <ArrowLeft size={16} /> Back to Users
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[color:var(--c-white)] p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0f1c2e] text-2xl font-semibold text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-semibold">{user.name}</h1>
            <p className="text-sm text-[color:var(--c-20201d)]/60">{user.email}</p>
            <span
              className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                active
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <button
          onClick={toggle}
          disabled={update.isPending}
          className={`rounded-lg px-5 py-2 text-sm font-medium disabled:opacity-50 ${
            active
              ? "border border-red-300 text-red-600 hover:bg-red-50"
              : "bg-[#a8552a] text-white hover:bg-[#8f4623]"
          }`}
        >
          {update.isPending
            ? "Updating..."
            : active
              ? "Deactivate"
              : "Activate"}
        </button>
      </div>

      {update.isError && (
        <p className="mt-3 text-sm text-red-600">
          {(update.error as any)?.response?.data?.message ||
            "Could not update status"}
        </p>
      )}

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Orders", value: stats.totalOrders },
          { label: "Active Orders", value: stats.activeOrders },
          {
            label: "Order Value",
            value: `₹${stats.totalSpent.toLocaleString("en-IN")}`,
          },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-[color:var(--c-white)] p-5 shadow-sm">
            <p className="text-sm text-[color:var(--c-20201d)]/60">{s.label}</p>
            <p className="mt-1 text-2xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-6 border-b border-[color:var(--c-20201d)]/10">
        {[
          { key: "info", label: "Personal Information" },
          { key: "orders", label: `Order History (${orders.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as "info" | "orders")}
            className={`-mb-px border-b-2 pb-3 text-sm font-medium ${
              tab === t.key
                ? "border-[color:var(--c-a8552a)] text-[color:var(--c-a8552a)]"
                : "border-transparent text-[color:var(--c-20201d)]/60"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "info" && (
        <div className="mt-6 grid gap-6 rounded-xl bg-[color:var(--c-white)] p-6 text-sm shadow-sm sm:grid-cols-2">
          {[
            { label: "Full Name", value: user.name },
            { label: "Email", value: user.email },
            {
              label: "Mobile",
              value: user.phone ? `+91 ${user.phone}` : "Not added",
            },
            { label: "Role", value: "User" },
            { label: "Status", value: active ? "Active" : "Inactive" },
            { label: "Joined On", value: formatDate(user.createdAt) },
          ].map((f) => (
            <div key={f.label}>
              <p className="text-[color:var(--c-20201d)]/50">{f.label}</p>
              <p className="mt-0.5 font-medium">{f.value}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "orders" && (
        <div className="mt-6">
          {orders.length === 0 ? (
            <p className="rounded-xl bg-[color:var(--c-white)] p-8 text-center text-[color:var(--c-20201d)]/60 shadow-sm">
              This user has not placed any orders yet.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl bg-[color:var(--c-white)] shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[color:var(--c-20201d)]/10 text-[color:var(--c-20201d)]/60">
                  <tr>
                    <th className="px-4 py-3 font-medium">Order</th>
                    <th className="px-4 py-3 font-medium">Items</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o: any) => (
                    <tr
                      key={o._id}
                      className="border-b border-[color:var(--c-20201d)]/5 last:border-0"
                    >
                      <td className="px-4 py-3 font-medium">
                        #{o.orderNumber}
                      </td>
                      <td className="px-4 py-3">{o.items.length}</td>
                      <td className="px-4 py-3">₹{o.total}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[o.status].cls}`}
                        >
                          {STATUS_STYLE[o.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[color:var(--c-20201d)]/70">
                        {formatDate(o.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/orders/${o._id}`}
                          className="text-[color:var(--c-a8552a)] hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
