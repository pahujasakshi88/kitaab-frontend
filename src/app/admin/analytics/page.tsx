"use client";

import { useState, ReactNode } from "react";
import {
  IndianRupee,
  ShoppingCart,
  BookOpen,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const card = "rounded-2xl border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] p-5";
const COLORS = [
  "#a8552a",
  "#0f1c2e",
  "#e0a458",
  "#6b8f71",
  "#8c6bb1",
  "#c9c2b8",
];

const dm = (iso: string) => {
  const [, m, d] = iso.split("-");
  const mon = new Date(2000, Number(m) - 1, 1).toLocaleString("en-IN", {
    month: "short",
  });
  return `${Number(d)} ${mon}`;
};

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
      {Math.abs(value)}% vs previous period
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

/* ---------- Bar chart ---------- */
function Bars({
  data,
}: {
  data: { from: string; to: string; revenue: number }[];
}) {
  const W = 560;
  const H = 260;
  const pad = { top: 16, right: 16, bottom: 30, left: 52 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const rawMax = Math.max(...data.map((d) => d.revenue), 0);
  const step = rawMax > 0 ? Math.pow(10, Math.floor(Math.log10(rawMax))) : 1;
  const max = rawMax > 0 ? Math.ceil(rawMax / step) * step : 1000;
  const ticks = [0, 1, 2, 3, 4].map((i) => (max / 4) * i);
  const y = (v: number) => pad.top + innerH - (v / max) * innerH;

  const slot = innerW / data.length;
  const bw = Math.min(44, slot * 0.6);

  const short = (n: number) =>
    n >= 100000
      ? `${+(n / 100000).toFixed(1)}L`
      : n >= 1000
        ? `${+(n / 1000).toFixed(1)}k`
        : `${n}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
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

      {data.map((d, i) => {
        const h = (d.revenue / max) * innerH;
        const x = pad.left + slot * i + (slot - bw) / 2;
        return (
          <g key={d.from}>
            <rect
              x={x}
              y={y(d.revenue)}
              width={bw}
              height={Math.max(h, 0)}
              rx={4}
              fill="#e0a458"
            >
              <title>{`${dm(d.from)} - ${dm(d.to)}: ${inr(d.revenue)}`}</title>
            </rect>
            <text
              x={x + bw / 2}
              y={H - 10}
              textAnchor="middle"
              fontSize="11"
              fill="var(--c-77716a)"
            >
              {dm(d.from)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- Donut chart ---------- */
function Donut({ data }: { data: { name: string; qty: number }[] }) {
  const total = data.reduce((s, d) => s + d.qty, 0);
  const R = 70;
  const C = 2 * Math.PI * R;
  let acc = 0;

  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <svg viewBox="0 0 200 200" className="h-44 w-44">
        <g transform="rotate(-90 100 100)">
          {data.map((d, i) => {
            const len = (d.qty / total) * C;
            const el = (
              <circle
                key={d.name}
                cx={100}
                cy={100}
                r={R}
                fill="none"
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={28}
                strokeDasharray={`${len} ${C - len}`}
                strokeDashoffset={-acc}
              />
            );
            acc += len;
            return el;
          })}
        </g>
        <text
          x={100}
          y={98}
          textAnchor="middle"
          fontSize="24"
          fontWeight="600"
          fill="var(--c-20201d)"
        >
          {total}
        </text>
        <text x={100} y={118} textAnchor="middle" fontSize="11" fill="var(--c-77716a)">
          books sold
        </text>
      </svg>

      <ul className="space-y-2 text-sm">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="flex-1">{d.name}</span>
            <span className="text-[color:var(--c-77716a)]">
              {Math.round((d.qty / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Page ---------- */
export default function AdminAnalyticsPage() {
  const [days, setDays] = useState<7 | 30 | 90>(30);
  const { data, isLoading, error } = useAdminAnalytics(days);

  if (isLoading) return <p className="text-[color:var(--c-77716a)]">Loading analytics...</p>;
  if (error || !data)
    return (
      <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
        Analytics load nahi ho paya. Backend chal raha hai ya nahi check karein.
      </p>
    );

  const { cards } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value) as 7 | 30 | 90)}
          className="rounded-lg border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] px-3 py-2 text-sm outline-none focus:border-[color:var(--c-a8552a)]"
        >
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 90 Days</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={inr(cards.revenue.value)}
          trend={cards.revenue.trend}
          tint="bg-green-100 text-green-700"
          icon={<IndianRupee size={22} />}
        />
        <StatCard
          label="Total Orders"
          value={cards.orders.value.toLocaleString("en-IN")}
          trend={cards.orders.trend}
          tint="bg-orange-100 text-orange-700"
          icon={<ShoppingCart size={22} />}
        />
        <StatCard
          label="Books Sold"
          value={cards.booksSold.value.toLocaleString("en-IN")}
          trend={cards.booksSold.trend}
          tint="bg-blue-100 text-blue-700"
          icon={<BookOpen size={22} />}
        />
        <StatCard
          label="New Users"
          value={cards.newUsers.value.toLocaleString("en-IN")}
          trend={cards.newUsers.trend}
          tint="bg-purple-100 text-purple-700"
          icon={<Users size={22} />}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <section className={`${card} xl:col-span-3`}>
          <h2 className="font-semibold">Revenue Overview</h2>
          <p className="mb-3 text-xs text-[color:var(--c-77716a)]">
            Sirf delivered orders ka revenue (cancelled aur pending shamil nahi)
          </p>
          <Bars data={data.revenueBuckets} />
        </section>

        <section className={`${card} xl:col-span-2`}>
          <h2 className="mb-4 font-semibold">Popular Categories</h2>
          {data.popularCategories.length === 0 ? (
            <p className="text-sm text-[color:var(--c-77716a)]">
              Is period mein koi sale nahi hui.
            </p>
          ) : (
            <Donut data={data.popularCategories} />
          )}
        </section>
      </div>
    </div>
  );
}
