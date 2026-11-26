"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Homepage par hero ke upar transparent, baaki pages par dark bar
  const isHome = pathname === "/";

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header
      className={`left-0 right-0 top-0 z-50 ${
        isHome ? "absolute" : "relative bg-[color:var(--c-btn-dark)]"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Kitaab"
            width={160}
            height={52}
            priority
          />
        </Link>

        {loading ? (
          <div className="h-10 w-24" />
        ) : user ? (
          <div className="flex items-center gap-4 text-white sm:gap-6">
            <span className="hidden text-sm sm:inline">Hi, {user.name}</span>

            {user.role === "admin" && (
              <Link href="/admin" className="text-sm hover:underline">
                Admin
              </Link>
            )}

            <Link href="/wishlist" className="text-sm hover:underline">
              Wishlist
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-full bg-[color:var(--c-white)] px-5 py-2 text-sm font-medium text-[color:var(--c-20201d)] transition hover:bg-[color:var(--c-f3eadc)]"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2.5 text-sm font-medium text-white hover:underline"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-[color:var(--c-white)] px-6 py-2.5 text-sm font-medium text-[color:var(--c-20201d)] transition hover:bg-[color:var(--c-f3eadc)]"
            >
              Sign Up
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
