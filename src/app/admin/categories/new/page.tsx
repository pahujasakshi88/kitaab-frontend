import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CategoryForm from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div>
      <Link
        href="/admin/categories"
        className="mb-4 inline-flex items-center gap-2 text-sm text-[color:var(--c-20201d)]/60 hover:text-[color:var(--c-a8552a)]"
      >
        <ArrowLeft size={16} /> Back to Categories
      </Link>
      <h1 className="mb-6 text-2xl font-semibold">Add New Category</h1>
      <CategoryForm />
    </div>
  );
}
