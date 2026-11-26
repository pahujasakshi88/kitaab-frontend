"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ShoppingCart,
  Tags,
  BarChart3,
  Star,
  Bell,
  Megaphone,
  Settings,
  UserCircle,
  Search,
  LogOut,
  Menu,
  X,
  
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import NotificationBell from "@/components/NotificationBell";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, ready: true },
  { href: "/admin/books", label: "Books", icon: BookOpen, ready: true },
  { href: "/admin/users", label: "Users", icon: Users, ready: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart, ready: true },
  { href: "/admin/categories", label: "Categories", icon: Tags, ready: true },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
    ready: true,
  },
  { href: "/admin/featured", label: "Featured Books", icon: Star, ready: true },
  {
    href: "/admin/promotions",
    label: "Promotions",
    icon: Megaphone,
    ready: true,
  },
  {
    href: "/admin/notifications",
    label: "Notifications",
    icon: Bell,
    ready: true,
  },
  { href: "/admin/settings", label: "Settings", icon: Settings, ready: true },
  {
    href: "/admin/profile",
    label: "My Profile",
    icon: UserCircle,
    ready: true,
  },
];
function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-[#0f1c2e] text-white">
      {/* Logo */}
      <Link href="/" className="block px-5 py-5">
        <Image
          src="/logo.png"
          alt="Kitaab"
          width={140}
          height={46}
          style={{ width: "140px", height: "auto" }}
          priority
        />
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {links.map((l) => {
          const Icon = l.icon;

          const active =
            l.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(l.href);

          if (!l.ready) {
            return (
              <div
                key={l.href}
                className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/35"
              >
                <Icon size={18} />
                <span className="flex-1">{l.label}</span>
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px]">
                  Soon
                </span>
              </div>
            );
          }

          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-[#a8552a] text-white"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              <Icon size={18} />
              {l.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom quote + books image */}
      <div className="px-6 py-6">
        <Image
          src="/books-stack.png"
          alt=""
          width={80}
          height={60}
          style={{ width: "80px", height: "auto" }}
          className="opacity-90"
        />
        <p className="mt-2 text-xs italic text-white/50">
          &quot;Better Books, Better Minds&quot;
        </p>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <ProtectedRoute role="admin">
      <div className="min-h-screen bg-[color:var(--c-f7f1e8)] text-[color:var(--c-20201d)]">
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 lg:block">
          <Sidebar />
        </aside>

        {/* Mobile sidebar */}
        {open && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setOpen(false)}
            />
            <aside className="absolute inset-y-0 left-0 w-60">
              <Sidebar onNavigate={() => setOpen(false)} />
            </aside>
          </div>
        )}

        <div className="lg:pl-60">
          {/* Topbar */}
          <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-[color:var(--c-20201d)]/10 bg-[color:var(--c-f7f1e8)] px-4 py-3 lg:px-8">
            <button
              className="lg:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div className="relative max-w-md flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--c-20201d)]/50"
              />
              <input
                placeholder="Search anything..."
                className="w-full rounded-lg border border-[color:var(--c-20201d)]/10 bg-[color:var(--c-white)] py-2 pl-9 pr-3 text-sm outline-none focus:border-[color:var(--c-a8552a)]"
              />
            </div>

            <div className="ml-auto flex items-center gap-4">
              <NotificationBell
                href="/admin/notifications"
                badgeClass="bg-[#a8552a]"
              />  
              {/* Click karne par My Profile khulta hai */}
              <Link
                href="/admin/profile"
                title="My profile"
                className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition hover:bg-[color:var(--c-20201d)]/5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0f1c2e] text-sm font-semibold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden text-sm font-medium sm:inline">
                  {user?.name}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                title="Logout"
                className="text-[color:var(--c-20201d)]/70 hover:text-[color:var(--c-a8552a)]"
              >
                <LogOut size={20} />
              </button>
            </div>
          </header>

          <main className="p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
