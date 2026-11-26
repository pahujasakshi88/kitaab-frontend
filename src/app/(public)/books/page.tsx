import BooksListing from "@/components/books/BooksListing";

export default function PublicBooksPage() {
  return (
    <main className="min-h-screen bg-[color:var(--c-f7f3ec)] px-6 pb-24 pt-12 lg:px-10">
      <BooksListing detailsBase="/books" />
    </main>
  );
}

