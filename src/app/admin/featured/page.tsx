"use client";

import { useMemo, useState } from "react";
import { Search, Star } from "lucide-react";
import { API } from "@/lib/api";
import { useAdminBooks, useSetFeatured } from "@/hooks/useAdminBooks";

export default function AdminFeaturedPage() {
  const { data: books = [], isLoading, isError } = useAdminBooks();
  const setFeatured = useSetFeatured();
  const [q, setQ] = useState("");
  const [onlyFeatured, setOnlyFeatured] = useState(false);

  const featuredCount = books.filter((b: any) => b.isFeatured).length;

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return books.filter(
      (b: any) =>
        (b.title.toLowerCase().includes(s) ||
          b.author.toLowerCase().includes(s)) &&
        (!onlyFeatured || b.isFeatured),
    );
  }, [books, q, onlyFeatured]);

  const img = (i?: string) =>
    i ? (i.startsWith("http") ? i : `${API}${i}`) : null;
  return (
    <div>
      <h1 className="text-2xl font-semibold">Featured Books</h1>
      <p className="mb-6 mt-1 text-sm text-[color:var(--c-20201d)]/60">
        Featured books homepage aur user dashboard par dikhti hain.{" "}
        {featuredCount} featured. Sirf stock wali books public par dikhti hain.
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
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
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlyFeatured}
            onChange={(e) => setOnlyFeatured(e.target.checked)}
          />
          Only featured
        </label>
      </div>

      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-600">Could not load books.</p>}
      {!isLoading && !isError && filtered.length === 0 && (
        <p className="text-[color:var(--c-20201d)]/60">No books found.</p>
      )}

      {setFeatured.isError && (
        <p className="mb-3 text-sm text-red-600">
          {(setFeatured.error as any)?.response?.data?.message ||
            "Could not update"}
        </p>
      )}

      {filtered.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-[color:var(--c-white)] shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[color:var(--c-20201d)]/10 text-[color:var(--c-20201d)]/60">
              <tr>
                <th className="px-4 py-3 font-medium">Cover</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Author</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 text-right font-medium">Featured</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b: any) => (
                <tr
                  key={b._id}
                  className="border-b border-[color:var(--c-20201d)]/5 last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="h-14 w-10 overflow-hidden rounded bg-[color:var(--c-f3eadc)]">
                      {img(b.image) && (
                        <img
                          src={img(b.image)!}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{b.title}</td>
                  <td className="px-4 py-3">{b.author}</td>
                  <td className="px-4 py-3">
                    {b.stock === 0 ? (
                      <span className="text-red-600">Out of stock</span>
                    ) : (
                      b.stock
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() =>
                        setFeatured.mutate({
                          id: b._id,
                          isFeatured: !b.isFeatured,
                        })
                      }
                      disabled={setFeatured.isPending}
                      title={
                        b.isFeatured ? "Remove from featured" : "Make featured"
                      }
                      className="disabled:opacity-40"
                    >
                      <Star
                        size={22}
                        className={
                          b.isFeatured
                            ? "fill-[#e0a030] text-[#e0a030]"
                            : "text-[color:var(--c-20201d)]/30 hover:text-[#e0a030]"
                        }
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
