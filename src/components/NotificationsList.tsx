"use client";

import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Package,
  XCircle,
  UserPlus,
  AlertTriangle,
  Bell,
  ChevronRight,
  BookOpen,
  Megaphone,
} from "lucide-react";
import {
  AppNotification,
  useNotifications,
  useMarkRead,
  useMarkAllRead,
} from "@/hooks/useNotifications";

const ICONS: Record<string, { icon: typeof Bell; cls: string }> = {
  order_placed: { icon: ShoppingCart, cls: "bg-blue-100 text-blue-700" },
  order_status: { icon: Package, cls: "bg-green-100 text-green-700" },
  order_cancelled: { icon: XCircle, cls: "bg-red-100 text-red-700" },
  new_user: { icon: UserPlus, cls: "bg-purple-100 text-purple-700" },
  low_stock: { icon: AlertTriangle, cls: "bg-orange-100 text-orange-700" },
  new_book: { icon: BookOpen, cls: "bg-amber-100 text-amber-700" },
  promotion: { icon: Megaphone, cls: "bg-pink-100 text-pink-700" },
};

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr > 1 ? "s" : ""} ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} day${day > 1 ? "s" : ""} ago`;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function NotificationsList({ accent }: { accent: string }) {
  const router = useRouter();
  const { data, isLoading, error } = useNotifications();
  const markRead = useMarkRead();
  const markAll = useMarkAllRead();

  const open = (n: AppNotification) => {
    if (!n.isRead) markRead.mutate(n._id);
    if (n.link) router.push(n.link);
  };

  const list = data?.notifications || [];
  const unread = data?.unreadCount || 0;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <p className="text-sm text-[color:var(--c-77716a)]">
            {unread > 0 ? `${unread} unread` : "You're all caught up"}
          </p>
        </div>
        <button
          onClick={() => markAll.mutate()}
          disabled={unread === 0 || markAll.isPending}
          className="rounded-full border px-4 py-2 text-sm font-medium disabled:opacity-40"
          style={{ color: accent, borderColor: accent }}
        >
          Mark all as read
        </button>
      </div>

      {isLoading && <p className="text-[color:var(--c-77716a)]">Loading...</p>}
      {error && (
        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          Notifications load nahi ho paayi.
        </p>
      )}
      {!isLoading && !error && list.length === 0 && (
        <div className="rounded-2xl border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] p-10 text-center text-[color:var(--c-77716a)]">
          <Bell className="mx-auto mb-3" size={32} />
          Abhi koi notification nahi hai.
        </div>
      )}

      {list.length > 0 && (
        <ul className="divide-y divide-[color:var(--c-e5ded3)] overflow-hidden rounded-2xl border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)]">
          {list.map((n) => {
            const meta = ICONS[n.type] || {
              icon: Bell,
              cls: "bg-gray-100 text-gray-700",
            };
            const Icon = meta.icon;
            return (
              <li key={n._id}>
                <button
                  onClick={() => open(n)}
                  className={`flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-[color:var(--c-20201d)]/[0.03] ${
                    n.isRead ? "" : "bg-[color:var(--c-fbf4ee)]"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${meta.cls}`}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm ${n.isRead ? "" : "font-semibold"}`}>
                      {n.title}
                    </p>
                    <p className="truncate text-sm text-[color:var(--c-77716a)]">
                      {n.message}
                    </p>
                    <p className="mt-0.5 text-xs text-[color:var(--c-77716a)]/80">
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>
                  {!n.isRead && (
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: accent }}
                    />
                  )}
                  <ChevronRight size={16} className="shrink-0 text-[color:var(--c-77716a)]" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
