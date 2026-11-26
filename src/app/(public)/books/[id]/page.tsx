"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import BookDetailsView from "@/components/books/BookDetailsView";

export default function PublicBookPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading } = useAuth();

  const isUser = user?.role === "user";

  useEffect(() => {
    if (isUser) router.replace(`/dashboard/books/${id}`);
  }, [isUser, id, router]);

  if (loading || isUser)
    return <p className="bg-[color:var(--c-f7f3ec)] p-10 text-center">Loading...</p>;

  return (
    <main className="min-h-screen bg-[color:var(--c-f7f3ec)] px-6 pb-24 pt-10 lg:px-10">
      <BookDetailsView id={id} backHref="/books" />
    </main>
  );
}
