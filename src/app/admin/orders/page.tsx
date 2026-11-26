"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Download } from "lucide-react";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import { STATUS_STYLE, formatDate } from "@/lib/orderStatus";
import { adminService } from "@/services/admin.service";
import Pagination from "@/components/admin/Pagination";
import { downloadCsv } from "@/lib/csv";

export default function AdminOrdersPage() {
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(1);

  // 400ms ruk kar search
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(text.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [text]);

  const { data, isLoading, isError } = useAdminOrders({
    status: status || undefined,
    search: search || undefined,
    from: from || undefined,
    to: to || undefined,
    page,
  });

  const orders: any[] = data?.orders || [];
    const totalPages: number = data?.pagination?.totalPages || 1;
  // filter ke hisaab se saare orders (50-50 ke pages mein) laakar CSV banata hai
  const exportCsv = async () => {
    setExporting(true);
    try {
      const all: any[] = [];
      let p = 1;
      let pages = 1;
      do {
        const d = await adminService.getOrders({
          status: status || undefined,
          search: search || undefined,
          from: from || undefined,
          to: to || undefined,
          page: p,
          limit: 50,
        });
        all.push(...(d.orders || []));
        pages = d.pagination?.totalPages || 1;
        p++;
      } while (p <= pages && p <= 20); // max 1000 orders
      downloadCsv(
        "orders.csv",
        ["Order", "Customer", "Email", "Items", "Amount", "Status", "Date"],
        all.map((o) => [
          o.orderNumber,
          o.user?.name || "Deleted user",
          o.user?.email || "",
          o.items.length,
          o.total,
          STATUS_STYLE[o.status]?.label || o.status,
          formatDate(o.createdAt),
        ]),
      );
    } catch {
      alert("Could not export orders");
    } finally {
      setExporting(false);
    }
  };
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">All Orders</h1>
        <button
          onClick={exportCsv}
          disabled={exporting || orders.length === 0}
          className="flex items-center gap-2 rounded-lg border border-[color:var(--c-20201d)]/15 bg-[color:var(--c-white)] px-4 py-2 text-sm font-medium hover:bg-[color:var(--c-20201d)]/5 disabled:opacity-40"
        >
          <Download size={16} /> {exporting ? "Exporting..." : "Export"}
        </button>
      </div>
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative w-full max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--c-20201d)]/50"
          />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search by order number"
            className="w-full rounded-lg border border-[color:var(--c-20201d)]/10 bg-[color:var(--c-white)] py-2 pl-9 pr-3 text-sm outline-none focus:border-[color:var(--c-a8552a)]"
          />
        </div>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-[color:var(--c-20201d)]/10 bg-[color:var(--c-white)] px-3 py-2 text-sm outline-none"
        >
          <option value="">All Statuses</option>
          {Object.entries(STATUS_STYLE).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-sm text-[color:var(--c-20201d)]/60">
          From
          <input
            type="date"
            value={from}
            max={to || undefined}
            onChange={(e) => {
              setFrom(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-[color:var(--c-20201d)]/10 bg-[color:var(--c-white)] px-3 py-2 text-sm text-[color:var(--c-20201d)] outline-none focus:border-[color:var(--c-a8552a)]"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-[color:var(--c-20201d)]/60">
          To
          <input
            type="date"
            value={to}
            min={from || undefined}
            onChange={(e) => {
              setTo(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-[color:var(--c-20201d)]/10 bg-[color:var(--c-white)] px-3 py-2 text-sm text-[color:var(--c-20201d)] outline-none focus:border-[color:var(--c-a8552a)]"
          />
        </label>
        {(from || to) && (
          <button
            onClick={() => {
              setFrom("");
              setTo("");
              setPage(1);
            }}
            className="text-sm text-[color:var(--c-a8552a)] hover:underline"
          >
            Clear dates
          </button>
        )}
      </div>
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">Could not load orders.</p>}
      {!isLoading && !isError && orders.length === 0 && (
        <p className="text-[color:var(--c-20201d)]/60">No orders found.</p>
      )}
      {orders.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-[color:var(--c-white)] shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[color:var(--c-20201d)]/10 text-[color:var(--c-20201d)]/60">
              <tr>
                {[
                  "Order",
                  "Customer",
                  "Items",
                  "Amount",
                  "Payment",
                  "Status",
                  "Date",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">
                    {h}
                  </th>
                ))}
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const st = STATUS_STYLE[o.status];
                return (
                  <tr
                    key={o._id}
                    className="border-b border-[color:var(--c-20201d)]/5 last:border-0"
                  >
                    <td className="px-4 py-3 font-medium">#{o.orderNumber}</td>
                    <td className="px-4 py-3">
                      <p>{o.user?.name || "Deleted user"}</p>
                      <p className="text-xs text-[color:var(--c-20201d)]/50">
                        {o.user?.email}
                      </p>
                    </td>
                    <td className="px-4 py-3">{o.items.length}</td>
                    <td className="px-4 py-3">₹{o.total}</td>
                    <td className="px-4 py-3 text-xs">
                      {o.paymentMethod === "online"
                        ? o.paymentStatus === "paid"
                          ? "Paid online"
                          : "Online (unpaid)"
                        : "COD"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${st.cls}`}
                      >
                        {st.label}
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />{" "}
    </div>
  );
}