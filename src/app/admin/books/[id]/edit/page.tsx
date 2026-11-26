"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BookForm, { BookData, ENDPOINTS } from "@/components/admin/BookForm";
import { api } from "@/lib/api";

export default function EditBookPage() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`${ENDPOINTS.books}/${id}`)
      .then((d) => setBook(d.book || d))
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!book) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit Book</h1>
      <BookForm book={book} />
    </div>
  );
}
