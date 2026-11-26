"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";
import { API } from "@/lib/api";
import { useSaveCategory, errMsg } from "@/hooks/useAdminCategories";

export interface CategoryData {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
}

const input =
  "w-full rounded-lg border border-[color:var(--c-20201d)]/15 bg-[color:var(--c-white)] px-3 py-2 text-sm outline-none focus:border-[color:var(--c-a8552a)]";

const slugify = (t: string) =>
  t
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function CategoryForm({
  category,
}: {
  category?: CategoryData;
}) {
  const router = useRouter();
  const save = useSaveCategory();

  const [name, setName] = useState(category?.name || "");
  const [slug, setSlug] = useState(category?.slug || "");
  // naye category mein slug naam ke saath badalta hai, jab tak admin khud na chhede
const [slugTouched, setSlugTouched] = useState(Boolean(category));  const [description, setDescription] = useState(category?.description || "");
  const [isActive, setIsActive] = useState(category?.isActive ?? true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(
    category?.image
      ? `${category.image.startsWith("http") ? "" : API}${category.image}`
      : "",
  );
  const [error, setError] = useState("");

  const onName = (v: string) => {
    setName(v);
    if (!slugTouched) setSlug(slugify(v));
  };

  const onFile = (f: File | null) => {
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return setError(
        "Slug can only have small letters, numbers and hyphens (e.g. self-help)",
      );
    }

    const fd = new FormData();
    fd.append("name", name);
    fd.append("slug", slug);
    fd.append("description", description);
    fd.append("isActive", String(isActive));
    if (file) fd.append("image", file);

    save.mutate(
      { id: category?._id, fd },
      {
        onSuccess: () => router.push("/admin/categories"),
        onError: (err) => setError(errMsg(err)),
      },
    );
  };

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-5">
      {error && (
        <p className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium">Name *</label>
          <input
            required
            value={name}
            onChange={(e) => onName(e.target.value)}
            placeholder="e.g. Self Help"
            className={input}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Slug *</label>
          <input
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            placeholder="e.g. self-help"
            className={input}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Description</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short line shown on the homepage"
          className={input}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Image</label>
        <label className="flex h-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[color:var(--c-20201d)]/20 bg-[color:var(--c-white)] text-center text-sm text-[color:var(--c-20201d)]/60 hover:border-[color:var(--c-a8552a)]">
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <>
              <UploadCloud size={30} />
              <span className="mt-2">Click to upload (PNG, JPG)</span>
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

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Show on website (Active)
      </label>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/categories")}
          className="rounded-lg border border-[color:var(--c-20201d)]/20 px-5 py-2 text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={save.isPending}
          className="rounded-lg bg-[#a8552a] px-6 py-2 text-sm font-medium text-white hover:bg-[#8f4623] disabled:opacity-50"
        >
          {save.isPending
            ? "Saving..."
            : category
              ? "Update Category"
              : "Add Category"}
        </button>
      </div>
    </form>
  );
}
