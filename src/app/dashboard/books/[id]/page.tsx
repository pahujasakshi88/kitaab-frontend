"use client";

import { useParams } from "next/navigation";
import BookDetailsView from "@/components/books/BookDetailsView";

export default function UserBookPage() {
  const { id } = useParams<{ id: string }>();
  return <BookDetailsView id={id} backHref="/dashboard/books" />;
}
