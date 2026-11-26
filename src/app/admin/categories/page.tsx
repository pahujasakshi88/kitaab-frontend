"use client";

import Link from "next/link";
import { Pencil, Trash2, Plus } from "lucide-react";
import { API } from "@/lib/api";
import {
  useAdminCategories,
  useDeleteCategory,
  errMsg,
} from "@/hooks/useAdminCategories";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  isActive: boolean;
  bookCount: number;
}

export default function AdminCategoriesPage() {
  const { data: categories = [], isLoading, error } = useAdminCategories();
  const remove = useDeleteCategory();

  const handleDelete = (c: Category) => {
    if (!confirm(`Delete category "${c.name}"?`)) return;
    remove.mutate(c._id, { onError: (err) => alert(errMsg(err)) });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">All Categories</h1>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 rounded-lg bg-[#a8552a] px-4 py-2 text-sm font-medium text-white hover:bg-[#8f4623]"
        >
          <Plus size={16} /> Add Category
        </Link>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-600">{errMsg(error)}</p>}
      {!isLoading && !error && categories.length === 0 && (
        <p className="text-[color:var(--c-20201d)]/60">
          No categories yet. Add your first one.
        </p>
      )}

      {categories.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-[color:var(--c-white)] shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[color:var(--c-20201d)]/10 text-[color:var(--c-20201d)]/60">
              <tr>
                <th className="px-4 py-3 font-medium">Image</th>
                <th className="px-4 py-3 font-medium">Category Name</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Books</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c: Category) => (
                <tr
                  key={c._id}
                  className="border-b border-[color:var(--c-20201d)]/5 last:border-0"
                >
                  <td className="px-4 py-3">
                    {c.image ? (
                      <img
                        src={`${c.image.startsWith("http") ? "" : API}${c.image}`}
                        alt={c.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-[color:var(--c-f3eadc)]" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-[color:var(--c-20201d)]/60">{c.slug}</td>
                  <td className="px-4 py-3">{c.bookCount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        c.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {c.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/categories/${c._id}/edit`}
                        className="text-[color:var(--c-20201d)]/60 hover:text-[#13233a]"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(c)}
                        disabled={remove.isPending}
                        className="text-red-500 hover:text-red-700 disabled:opacity-40"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
