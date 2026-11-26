"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useUnreadCount } from "@/hooks/useNotifications";

export default function NotificationBell({
  href,
  badgeClass = "bg-[#c66a45]",
}: {
  href: string;
  badgeClass?: string;
}) {
  const { data: count = 0 } = useUnreadCount();

  return (
    <Link
      href={href}
      title="Notifications"
      aria-label={`Notifications, ${count} unread`}
      className="relative inline-flex items-center"
    >
      <Bell size={20} className="text-[color:var(--c-20201d)]/60 hover:text-[color:var(--c-c66a45)]" />
      {count > 0 && (
        <span
          className={`absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white ${badgeClass}`}
        >
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
