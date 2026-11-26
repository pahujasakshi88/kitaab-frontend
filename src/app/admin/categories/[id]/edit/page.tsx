"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import CategoryForm from "@/components/admin/CategoryForm";
import { useAdminCategory } from "@/hooks/useAdminCategories";

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useAdminCategory(id);

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data)
    return <p className="text-red-600">Category not found.</p>;

  return (
    <div>
      <Link
        href="/admin/categories"
        className="mb-4 inline-flex items-center gap-2 text-sm text-[color:var(--c-20201d)]/60 hover:text-[color:var(--c-a8552a)]"
      >
        <ArrowLeft size={16} /> Back to Categories
      </Link>
      <h1 className="mb-6 text-2xl font-semibold">Edit Category</h1>
      <CategoryForm category={data} />
    </div>
  );
}
