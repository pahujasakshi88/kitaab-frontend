  "use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import {
  Home,
  BookOpen,
  BookMarked,
  Heart,
  ShoppingCart,
  Package,
  Bell,
  User,
  Search,
  LogOut,
  Menu,
  X,
  Settings,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/useCart";
import NotificationBell from "@/components/NotificationBell";

const links = [
  { href: "/dashboard", label: "Home", icon: Home, ready: true },
  { href: "/dashboard/books", label: "All Books", icon: BookOpen, ready: true },
  {
    href: "/dashboard/my-books",
    label: "My Books",
    icon: BookMarked,
    ready: true,
  },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart, ready: true },
  { href: "/dashboard/cart", label: "Cart", icon: ShoppingCart, ready: true },
  { href: "/dashboard/orders", label: "My Orders", icon: Package, ready: true },
  {
    href: "/dashboard/notifications",
    label: "Notifications",
    icon: Bell,
    ready: true,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
    ready: true,
  },
  { href: "/dashboard/profile", label: "Profile", icon: User, ready: true },
];
function Sidebar({
  onNavigate,
  onLogout,
}: {
  onNavigate?: () => void;
  onLogout: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col border-r border-[color:var(--c-e5ded3)] bg-[color:var(--c-fbf8f3)]">
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="px-6 py-6 font-serif text-2xl font-semibold text-[color:var(--c-8a4a2b)]"
      >
        Kitaab
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {links.map((l) => {
          const Icon = l.icon;
          const active =
            l.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(l.href);

          if (!l.ready) {
            return (
              <div
                key={l.href}
                className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[color:var(--c-20201d)]/35"
              >
                <Icon size={18} />
                <span className="flex-1">{l.label}</span>
                <span className="rounded bg-[color:var(--c-20201d)]/10 px-1.5 py-0.5 text-[10px]">
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
                  ? "bg-[color:var(--c-f1e3d3)] font-medium text-[color:var(--c-8a4a2b)]"
                  : "hover:bg-[color:var(--c-20201d)]/5"
              }`}
            >
              <Icon size={18} />
              {l.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={onLogout}
        className="flex items-center gap-3 px-6 py-5 text-sm text-[color:var(--c-20201d)]/70 hover:text-[color:var(--c-c66a45)]"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}

export default function UserLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { data: cart } = useCart();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const cartCount = cart?.count || 0;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/dashboard/books?search=${encodeURIComponent(q)}`);
  };

  return (
    <ProtectedRoute role="user">
      <div className="min-h-screen bg-[color:var(--c-f7f3ec)] text-[color:var(--c-20201d)]">
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 lg:block">
          <Sidebar onLogout={handleLogout} />
        </aside>

        {/* Mobile drawer */}
        {open && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setOpen(false)}
            />
            <aside className="absolute inset-y-0 left-0 w-64">
              <Sidebar
                onNavigate={() => setOpen(false)}
                onLogout={handleLogout}
              />
            </aside>
          </div>
        )}

        <div className="lg:pl-56">
          <header className="flex items-center gap-3 border-b border-[color:var(--c-e5ded3)] bg-[color:var(--c-fbf8f3)] px-4 py-3 lg:gap-4 lg:px-8">
            <button
              className="lg:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>

            <form onSubmit={handleSearch} className="relative max-w-md flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--c-77716a)]"
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search books, authors..."
                className="w-full rounded-full border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] py-2 pl-9 pr-3 text-sm outline-none focus:border-[color:var(--c-c66a45)]"
              />
            </form>

            <div className="ml-auto flex items-center gap-4">
              <Link
                href="/dashboard/wishlist"
                title="Wishlist"
                aria-label="Wishlist"
                className="hidden sm:block"
              >
                <Heart
                  size={20}
                  className="text-[color:var(--c-20201d)]/60 hover:text-[color:var(--c-c66a45)]"
                />
              </Link>

              <Link
                href="/dashboard/cart"
                title="Cart"
                aria-label={`Cart, ${cartCount} items`}
                className="relative inline-flex items-center"
              >
                <ShoppingCart
                  size={20}
                  className="text-[color:var(--c-20201d)]/60 hover:text-[color:var(--c-c66a45)]"
                />
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c66a45] px-1 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
              <NotificationBell href="/dashboard/notifications" />

              <Link
                href="/dashboard/profile"
                title={user?.name || "Profile"}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8a4a2b] text-sm font-semibold text-white"
              >
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </Link>
            </div>
          </header>

          <main className="p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
