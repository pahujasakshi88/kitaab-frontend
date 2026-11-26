import BookForm from "@/components/admin/BookForm";
export default function NewBookPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Add New Book</h1>
      <BookForm />
    </div>
  );
}