"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Role = "user" | "admin" | "deliveryBoy";

const homeFor = (role: string) =>
  role === "admin"
    ? "/admin"
    : role === "deliveryBoy"
      ? "/delivery"
      : "/dashboard";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: ReactNode;
  role?: Role;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const wrongRole = !!user && !!role && user.role !== role;

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
    else if (wrongRole) router.replace(homeFor(user.role));
  }, [user, loading, wrongRole, router]);

  if (loading || !user || wrongRole) {
    return <p className="p-10 text-center">Loading...</p>;
  }
  return <>{children}</>;
}
