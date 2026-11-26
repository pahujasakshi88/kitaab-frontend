"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WishlistRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/wishlist");
  }, [router]);

  return <p className="bg-[color:var(--c-f7f3ec)] p-10 text-center">Loading...</p>;
}
