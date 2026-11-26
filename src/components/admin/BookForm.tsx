"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";
import { api, API } from "@/lib/api";

export const ENDPOINTS = {
  books: "/api/books",
  categories: "/api/categories/admin",
};

interface Category {
  _id: string;
  name: string;
}

export interface BookData {
  _id?: string;
  title: string;
  author: string;
  description?: string;
  price: number;
  originalPrice?: number;
  language?: string;
  pages?: number;
  publishedYear?: number;
  stock: number;
  image?: string;
  category: string | { _id: string; name: string };
}

const input =
  "w-full rounded-lg border border-[color:var(--c-20201d)]/15 bg-[color:var(--c-white)] px-3 py-2 text-sm outline-none focus:border-[color:var(--c-a8552a)]";

export default function BookForm({ book }: { book?: BookData }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  const [title, setTitle] = useState(book?.title || "");
  const [author, setAuthor] = useState(book?.author || "");
  const [description, setDescription] = useState(book?.description || "");
  const [price, setPrice] = useState(book ? String(book.price) : "");
  const [originalPrice, setOriginalPrice] = useState(
    book?.originalPrice ? String(book.originalPrice) : "",
  );
  const [stock, setStock] = useState(book ? String(book.stock) : "");
  const [language, setLanguage] = useState(book?.language || "");
  const [pages, setPages] = useState(book?.pages ? String(book.pages) : "");
  const [publishedYear, setPublishedYear] = useState(
    book?.publishedYear ? String(book.publishedYear) : "",
  );
  const [category, setCategory] = useState(
    book
      ? typeof book.category === "object"
        ? book.category?._id
        : book.category
      : "",
  );
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(
    book?.image
      ? `${book.image.startsWith("http") ? "" : API}${book.image}`
      : "",
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api(ENDPOINTS.categories)
      .then((d) => setCategories(Array.isArray(d) ? d : d.categories || []))
      .catch(() => setError("Could not load categories"));
  }, []);

  const onFile = (f: File | null) => {
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!category) return setError("Please select a category");
    if (!book && !file) return setError("Please upload a book image");
    if (Number(price) < 0 || Number(stock) < 0)
      return setError("Price and stock cannot be negative");
    if (originalPrice && Number(originalPrice) <= Number(price))
      return setError("Original price must be greater than the selling price");

    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("author", author);
      fd.append("description", description);
      fd.append("price", price);
      fd.append("stock", stock);
      fd.append("category", category);
      // khali bhi bhejte hain, taaki edit mein hata sako
      fd.append("originalPrice", originalPrice);
      fd.append("language", language);
      fd.append("pages", pages);
      fd.append("publishedYear", publishedYear);
      if (file) fd.append("image", file);

      if (book?._id) {
        await api(`${ENDPOINTS.books}/${book._id}`, {
          method: "PATCH",
          body: fd,
        });
      } else {
        await api(ENDPOINTS.books, { method: "POST", body: fd });
      }
      router.push("/admin/books");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {error && (
        <p className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Image */}
        <div>
          <label className="mb-1 block text-sm font-medium">Book Image *</label>
          <label className="flex aspect-[3/4] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[color:var(--c-20201d)]/20 bg-[color:var(--c-white)] text-center text-sm text-[color:var(--c-20201d)]/60 hover:border-[color:var(--c-a8552a)]">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <>
                <UploadCloud size={32} />
                <span className="mt-2 px-4">Click to upload (PNG, JPG)</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        {/* Fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1 sm:col-span-2">
            <label className="text-sm font-medium">Title *</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={input}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Author *</label>
            <input
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={input}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Category *</label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={input}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Selling Price (₹) *</label>
            <input
              required
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={input}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Original Price (₹)</label>
            <input
              type="number"
              min="0"
              placeholder="Optional, shows discount"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className={input}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Stock *</label>
            <input
              required
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className={input}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Language</label>
            <input
              list="languages"
              placeholder="e.g. English"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={input}
            />
            <datalist id="languages">
              {[
                "English",
                "Hindi",
                "Punjabi",
                "Urdu",
                "Bengali",
                "Marathi",
                "Tamil",
              ].map((l) => (
                <option key={l} value={l} />
              ))}
            </datalist>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Pages</label>
            <input
              type="number"
              min="1"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              className={input}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Published Year</label>
            <input
              type="number"
              min="1000"
              placeholder="e.g. 2018"
              value={publishedYear}
              onChange={(e) => setPublishedYear(e.target.value)}
              className={input}
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-sm font-medium">Description *</label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={input}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/books")}
          className="rounded-lg border border-[color:var(--c-20201d)]/20 px-5 py-2 text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-[#a8552a] px-6 py-2 text-sm font-medium text-white hover:bg-[#8f4623] disabled:opacity-50"
        >
          {busy ? "Saving..." : book ? "Update Book" : "Add Book"}
        </button>
      </div>
    </form>
  );
}
