"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { api, API } from "@/lib/api";
import { ENDPOINTS, BookData } from "@/components/admin/BookForm";

export default function AdminBooksPage() {
  const [books, setBooks] = useState<BookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  const load = async () => {
    try {
      const d = await api(ENDPOINTS.books);
      setBooks(Array.isArray(d) ? d : d.books || []);
      setError("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(s) || b.author.toLowerCase().includes(s),
    );
  }, [books, q]);

  const remove = async (b: BookData) => {
    if (!confirm(`Delete "${b.title}"?`)) return;
    try {
      await api(`${ENDPOINTS.books}/${b._id}`, { method: "DELETE" });
      await load();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const status = (stock: number) =>
    stock === 0
      ? { label: "Out of stock", cls: "bg-red-100 text-red-700" }
      : stock <= 5
        ? { label: "Low stock", cls: "bg-orange-100 text-orange-700" }
        : { label: "Active", cls: "bg-green-100 text-green-700" };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Books</h1>
        <Link
          href="/admin/books/new"
          className="flex items-center gap-2 rounded-lg bg-[#a8552a] px-4 py-2 text-sm font-medium text-white hover:bg-[#8f4623]"
        >
          <Plus size={16} /> Add New Book
        </Link>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--c-20201d)]/50"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title or author"
          className="w-full rounded-lg border border-[color:var(--c-20201d)]/10 bg-[color:var(--c-white)] py-2 pl-9 pr-3 text-sm outline-none focus:border-[color:var(--c-a8552a)]"
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="text-[color:var(--c-20201d)]/60">No books found.</p>
      )}

      {filtered.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-[color:var(--c-white)] shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[color:var(--c-20201d)]/10 text-[color:var(--c-20201d)]/60">
              <tr>
                {[
                  "Cover",
                  "Title",
                  "Author",
                  "Category",
                  "Price",
                  "Stock",
                  "Status",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">
                    {h}
                  </th>
                ))}
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
                const st = status(b.stock);
                return (
                  <tr
                    key={b._id}
                    className="border-b border-[color:var(--c-20201d)]/5 last:border-0"
                  >
                    <td className="px-4 py-3">
                      {b.image ? (
                        <img
                          src={`${b.image.startsWith("http") ? "" : API}${b.image}`}
                          alt={b.title}
                          className="h-14 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="h-14 w-10 rounded bg-[color:var(--c-f3eadc)]" />
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">{b.title}</td>
                    <td className="px-4 py-3">{b.author}</td>
                    <td className="px-4 py-3">
                      {typeof b.category === "object" ? b.category?.name : "-"}
                    </td>
                    <td className="px-4 py-3">₹{b.price}</td>
                    <td className="px-4 py-3">{b.stock}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${st.cls}`}
                      >
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/admin/books/${b._id}/edit`}
                          className="text-[color:var(--c-20201d)]/60 hover:text-[#13233a]"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => remove(b)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
