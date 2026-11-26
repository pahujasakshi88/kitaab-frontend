"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { API } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { usePublicBooks } from "@/hooks/useGuest";
import { useFeaturedBooks } from "@/hooks/useGuest";

interface Book {
  _id: string;
  title: string;
  author: string;
  price: number;
  image?: string;
}

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
};

const imgUrl = (img?: string) =>
  img ? (img.startsWith("http") ? img : `${API}${img}`) : null;

function BookCard({ book }: { book: Book }) {
  const src = imgUrl(book.image);
  return (
    <Link
      href={`/dashboard/books/${book._id}`}
      className="group overflow-hidden rounded-2xl border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="aspect-[3/4] overflow-hidden bg-[color:var(--c-f3eadc)]">
        {src && (
          <img
            src={src}
            alt={book.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="line-clamp-1 text-sm font-semibold">{book.title}</h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-[color:var(--c-77716a)]">
          {book.author}
        </p>
        <p className="mt-2 text-sm font-semibold">₹{book.price}</p>
      </div>
    </Link>
  );
}

function Row({
  title,
  books,
  loading,
}: {
  title: string;
  books: Book[];
  loading: boolean;
}) {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold">{title}</h2>
        <Link
          href="/dashboard/books"
          className="flex items-center gap-1 text-sm text-[color:var(--c-c66a45)] hover:gap-2"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse rounded-2xl bg-[color:var(--c-white)]"
            />
          ))}
        </div>
      ) : books.length === 0 ? (
        <p className="rounded-2xl bg-[color:var(--c-white)] p-8 text-center text-[color:var(--c-77716a)]">
          No books yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {books.map((b) => (
            <BookCard key={b._id} book={b} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function UserHome() {
  const { user } = useAuth();
const { data: featured = [], isLoading: fLoading } = useFeaturedBooks();
const { data: latest = [], isLoading: lLoading } = usePublicBooks();
  return (
    <div className="mx-auto max-w-6xl">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-[color:var(--c-f1e3d3)] to-[color:var(--c-fbf8f3)] p-8 md:p-12">
        <h1 className="font-serif text-3xl font-semibold md:text-4xl">
          {greeting()}, {user?.name}! 👋
        </h1>
        <p className="mt-2 text-[color:var(--c-77716a)]">
          Discover new worlds, one book at a time.
        </p>
        <Link
          href="/dashboard/books"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#8a4a2b] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#6f3a21]"
        >
          Explore Books <ArrowRight size={16} />
        </Link>
      </div>

      <Row
        title="Featured Books"
        books={featured.slice(0, 4)}
        loading={fLoading}
      />
      <Row title="New Arrivals" books={latest.slice(0, 4)} loading={lLoading} />
    </div>
  );
}
