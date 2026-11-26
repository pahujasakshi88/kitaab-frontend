"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import {
  Users,
  BookOpen,
  ShoppingCart,
  IndianRupee,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { API } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useAdminStats } from "@/hooks/useAdminStats";
import { STATUS_STYLE, formatDate } from "@/lib/orderStatus";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

const card = "rounded-2xl border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] p-5";

/* ---------- Small pieces ---------- */

function Trend({ value }: { value: number }) {
  const up = value >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <p
      className={`mt-1 flex items-center gap-1 text-xs ${
        up ? "text-green-600" : "text-red-600"
      }`}
    >
      <Icon size={12} />
      {Math.abs(value)}% from last month
    </p>
  );
}

function StatCard({
  label,
  value,
  trend,
  icon,
  tint,
}: {
  label: string;
  value: string;
  trend: number;
  icon: ReactNode;
  tint: string;
}) {
  return (
    <div className={`${card} flex items-start gap-4`}>
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tint}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-[color:var(--c-77716a)]">{label}</p>
        <p className="text-2xl font-semibold">{value}</p>
        <Trend value={trend} />
      </div>
    </div>
  );
}

function Cover({ image, title }: { image?: string; title: string }) {
  return image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${image.startsWith("http") ? "" : API}${image}`}
      alt={title}
      className="h-12 w-9 shrink-0 rounded object-cover"
    />
  ) : (
    <div className="h-12 w-9 shrink-0 rounded bg-[color:var(--c-e5ded3)]" />
  );
}

function SectionHeader({
  title,
  href,
  children,
}: {
  title: string;
  href?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="font-semibold">{title}</h2>
      {children}
      {href && (
        <Link href={href} className="text-xs font-medium text-[color:var(--c-a8552a)]">
          View All
        </Link>
      )}
    </div>
  );
}

/* ---------- Sales chart (plain SVG, koi extra library nahi) ---------- */

function SalesChart({
  data,
}: {
  data: { date: string; sales: number; orders: number }[];
}) {
  const W = 620;
  const H = 240;
  const pad = { top: 16, right: 16, bottom: 28, left: 52 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const rawMax = Math.max(...data.map((d) => d.sales), 0);
  // 4 ticks ke liye "gol" max nikalo
  const step = rawMax > 0 ? Math.pow(10, Math.floor(Math.log10(rawMax))) : 1;
  const max = rawMax > 0 ? Math.ceil(rawMax / step) * step : 1000;
  const ticks = [0, 1, 2, 3, 4].map((i) => (max / 4) * i);

  const x = (i: number) =>
    pad.left +
    (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
  const y = (v: number) => pad.top + innerH - (v / max) * innerH;

  const line = data.map((d, i) => `${x(i)},${y(d.sales)}`).join(" ");
  const area = `${x(0)},${y(0)} ${line} ${x(data.length - 1)},${y(0)}`;

  const label = (iso: string) => {
    const [, m, d] = iso.split("-");
    const mon = new Date(2000, Number(m) - 1, 1).toLocaleString("en-IN", {
      month: "short",
    });
    return `${Number(d)} ${mon}`;
  };
  // 30 din me har label dikhane se bheed ho jati hai
  const every = data.length > 10 ? 5 : 1;

  const short = (n: number) =>
    n >= 100000
      ? `${+(n / 100000).toFixed(1)}L`
      : n >= 1000
        ? `${+(n / 1000).toFixed(1)}k`
        : `${n}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
      <defs>
        <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c66a45" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#c66a45" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {ticks.map((t) => (
        <g key={t}>
          <line
            x1={pad.left}
            x2={W - pad.right}
            y1={y(t)}
            y2={y(t)}
            stroke="var(--c-e5ded3)"
            strokeDasharray="3 4"
          />
          <text
            x={pad.left - 8}
            y={y(t) + 4}
            textAnchor="end"
            fontSize="11"
            fill="var(--c-77716a)"
          >
            {short(t)}
          </text>
        </g>
      ))}

      <polygon points={area} fill="url(#salesFill)" />
      <polyline
        points={line}
        fill="none"
        stroke="#a8552a"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {data.map((d, i) => (
        <g key={d.date}>
          <circle cx={x(i)} cy={y(d.sales)} r="4" fill="#a8552a">
            <title>{`${label(d.date)}: ${inr(d.sales)} (${d.orders} orders)`}</title>
          </circle>
          {i % every === 0 && (
            <text
              x={x(i)}
              y={H - 8}
              textAnchor="middle"
              fontSize="11"
              fill="var(--c-77716a)"
            >
              {label(d.date)}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

/* ---------- Page ---------- */

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [days, setDays] = useState<7 | 30>(7);
  const { data, isLoading, error } = useAdminStats(days);

  if (isLoading) return <p className="text-[color:var(--c-77716a)]">Loading dashboard...</p>;
  if (error || !data)
    return (
      <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
        Dashboard load nahi ho paya. Backend chal raha hai ya nahi check karein.
      </p>
    );

  const totalSales = data.salesByDay.reduce((s, d) => s + d.sales, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome back, {user?.name || "Admin"} 👋
        </h1>
        <p className="text-sm text-[color:var(--c-77716a)]">
          Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Users"
          value={data.users.toLocaleString("en-IN")}
          trend={data.trends.users}
          tint="bg-green-100 text-green-700"
          icon={<Users size={22} />}
        />
        <StatCard
          label="Total Books"
          value={data.books.toLocaleString("en-IN")}
          trend={data.trends.books}
          tint="bg-blue-100 text-blue-700"
          icon={<BookOpen size={22} />}
        />
        <StatCard
          label="Total Orders"
          value={data.orders.toLocaleString("en-IN")}
          trend={data.trends.orders}
          tint="bg-orange-100 text-orange-700"
          icon={<ShoppingCart size={22} />}
        />
        <StatCard
          label="Total Revenue"
          value={inr(data.revenue)}
          trend={data.trends.revenue}
          tint="bg-purple-100 text-purple-700"
          icon={<IndianRupee size={22} />}
        />
      </div>

      {/* Sales + Recent orders */}
      <div className="grid gap-4 xl:grid-cols-5">
        <section className={`${card} xl:col-span-3`}>
          <SectionHeader title="Sales Overview">
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value) as 7 | 30)}
              className="rounded-lg border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] px-3 py-1.5 text-xs outline-none focus:border-[color:var(--c-a8552a)]"
            >
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
            </select>
          </SectionHeader>
          <p className="mb-2 text-xs text-[color:var(--c-77716a)]">
            {inr(totalSales)} in the last {days} days (cancelled orders
            excluded)
          </p>
          <SalesChart data={data.salesByDay} />
        </section>

        <section className={`${card} xl:col-span-2`}>
          <SectionHeader title="Recent Orders" href="/admin/orders" />
          {data.recentOrders.length === 0 ? (
            <p className="text-sm text-[color:var(--c-77716a)]">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-[color:var(--c-77716a)]">
                  <tr>
                    <th className="pb-2 font-medium">Order ID</th>
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--c-e5ded3)]">
                  {data.recentOrders.map((o) => {
                    const st = STATUS_STYLE[o.status];
                    return (
                      <tr key={o._id}>
                        <td className="py-2.5 font-medium">
                          <Link
                            href={`/admin/orders/${o._id}`}
                            className="hover:text-[color:var(--c-a8552a)]"
                          >
                            #{o.orderNumber}
                          </Link>
                        </td>
                        <td className="py-2.5">
                          {o.user?.name || "Deleted user"}
                        </td>
                        <td className="py-2.5">{inr(o.total)}</td>
                        <td className="py-2.5">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] ${st?.cls || ""}`}
                          >
                            {st?.label || o.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Top selling / Low stock / Recent users */}
      <div className="grid gap-4 lg:grid-cols-3">
        <section className={card}>
          <SectionHeader title="Top Selling Books" href="/admin/books" />
          {data.topSelling.length === 0 ? (
            <p className="text-sm text-[color:var(--c-77716a)]">No sales yet.</p>
          ) : (
            <ul className="space-y-3">
              {data.topSelling.map((b) => (
                <li key={b._id} className="flex items-center gap-3">
                  <Cover image={b.image} title={b.title} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{b.title}</p>
                    <p className="truncate text-xs text-[color:var(--c-77716a)]">
                      {b.author}
                    </p>
                  </div>
                  <span className="text-xs text-[color:var(--c-77716a)]">{b.sold} sold</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={card}>
          <SectionHeader title="Low Stock Books" href="/admin/books" />
          {data.lowStock.length === 0 ? (
            <p className="text-sm text-[color:var(--c-77716a)]">
              Sab books ka stock theek hai.
            </p>
          ) : (
            <ul className="space-y-3">
              {data.lowStock.map((b) => (
                <li key={b._id} className="flex items-center gap-3">
                  <Cover image={b.image} title={b.title} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{b.title}</p>
                    <p
                      className={`text-xs ${
                        b.stock === 0 ? "text-red-600" : "text-orange-600"
                      }`}
                    >
                      {b.stock === 0 ? "Out of stock" : `Stock: ${b.stock}`}
                    </p>
                  </div>
                  <Link
                    href={`/admin/books/${b._id}/edit`}
                    className="text-xs font-medium text-[color:var(--c-a8552a)]"
                  >
                    Restock
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={card}>
          <SectionHeader title="Recent Users" href="/admin/users" />
          {data.recentUsers.length === 0 ? (
            <p className="text-sm text-[color:var(--c-77716a)]">No users yet.</p>
          ) : (
            <ul className="space-y-3">
              {data.recentUsers.map((u) => (
                <li key={u._id} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0f1c2e] text-sm font-semibold text-white">
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/users/${u._id}`}
                      className="block truncate text-sm font-medium hover:text-[color:var(--c-a8552a)]"
                    >
                      {u.name}
                    </Link>
                    <p className="truncate text-xs text-[color:var(--c-77716a)]">{u.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-[color:var(--c-77716a)]">
                      {formatDate(u.createdAt)}
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] ${
                        u.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
