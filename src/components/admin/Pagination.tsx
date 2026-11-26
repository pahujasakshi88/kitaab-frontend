"use client";

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-6 flex items-center justify-center gap-4">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="rounded-lg border border-[color:var(--c-20201d)]/15 bg-[color:var(--c-white)] px-4 py-1.5 text-sm disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-sm text-[color:var(--c-20201d)]/60">
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="rounded-lg border border-[color:var(--c-20201d)]/15 bg-[color:var(--c-white)] px-4 py-1.5 text-sm disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
