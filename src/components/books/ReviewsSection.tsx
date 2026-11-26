"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Trash2 } from "lucide-react";
import Stars from "@/components/Stars";
import { useAuth } from "@/context/AuthContext";
import {
  useBookReviews,
  useMyReview,
  useSaveReview,
  useDeleteReview,
} from "@/hooks/useReviews";
import { formatDate } from "@/lib/orderStatus";

const errMsg = (e: any) =>
  e?.response?.data?.message || e?.message || "Something went wrong";

function ReviewForm({ bookId, existing }: { bookId: string; existing?: any }) {
  const [rating, setRating] = useState<number>(existing?.rating || 0);
  const [comment, setComment] = useState<string>(existing?.comment || "");
  const [saved, setSaved] = useState(false);
  const save = useSaveReview();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    if (!rating) return;
    save.mutate(
      { bookId, rating, comment },
      {
        onSuccess: () => {
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        },
      },
    );
  };

  return (
    <form onSubmit={submit} className="rounded-xl border border-[color:var(--c-e5ded3)] p-5">
      <p className="mb-3 font-medium">
        {existing ? "Update your review" : "Write a review"}
      </p>

      <div className="mb-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            type="button"
            key={i}
            onClick={() => setRating(i)}
            aria-label={`${i} star`}
          >
            <Star
              size={26}
              className={
                i <= rating
                  ? "fill-[#e0a030] text-[#e0a030]"
                  : "text-[color:var(--c-20201d)]/25 hover:text-[#e0a030]"
              }
            />
          </button>
        ))}
      </div>

      <textarea
        rows={3}
        maxLength={500}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share what you liked (optional)"
        className="w-full rounded-lg border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] px-3 py-2 text-sm outline-none focus:border-[color:var(--c-c66a45)]"
      />

      {save.isError && (
        <p className="mt-2 text-sm text-red-600">{errMsg(save.error)}</p>
      )}
      {saved && <p className="mt-2 text-sm text-green-700">Review saved.</p>}

      <button
        type="submit"
        disabled={!rating || save.isPending}
        className="mt-3 rounded-full bg-[#8a4a2b] px-6 py-2 text-sm font-medium text-white hover:bg-[#6f3a21] disabled:opacity-50"
      >
        {save.isPending
          ? "Saving..."
          : existing
            ? "Update Review"
            : "Submit Review"}
      </button>
    </form>
  );
}

export default function ReviewsSection({ bookId }: { bookId: string }) {
  const { user } = useAuth();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useBookReviews(bookId, page);
  const { data: mine } = useMyReview(bookId);
  const remove = useDeleteReview();

  const summary = data?.summary;
  const reviews: any[] = data?.reviews || [];
  const totalPages: number = data?.pagination?.totalPages || 1;

  return (
    <div className="mt-6 space-y-6">
      {/* Summary */}
      {summary && summary.count > 0 && (
        <div className="flex flex-wrap items-center gap-8">
          <div className="text-center">
            <p className="text-5xl font-semibold">{summary.average}</p>
            <Stars value={summary.average} size={16} />
            <p className="mt-1 text-xs text-[color:var(--c-77716a)]">
              {summary.count} {summary.count === 1 ? "review" : "reviews"}
            </p>
          </div>

          <div className="min-w-[200px] flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map((n) => {
              const c = summary.breakdown[n] || 0;
              const pct = summary.count ? (c / summary.count) * 100 : 0;
              return (
                <div key={n} className="flex items-center gap-2 text-xs">
                  <span className="w-3">{n}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#f1e9dd]">
                    <div
                      className="h-full bg-[#e0a030]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-[color:var(--c-77716a)]">{c}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Form ya message */}
      {!user && (
        <p className="rounded-xl bg-[color:var(--c-f7f3ec)] p-4 text-sm text-[color:var(--c-77716a)]">
          <Link href="/login" className="font-medium underline">
            Login
          </Link>{" "}
          to write a review.
        </p>
      )}
      {user?.role === "user" && mine && !mine.canReview && (
        <p className="rounded-xl bg-[color:var(--c-f7f3ec)] p-4 text-sm text-[color:var(--c-77716a)]">
          You can review this book after it has been delivered to you.
        </p>
      )}
      {user?.role === "user" && mine?.canReview && (
        <ReviewForm
          key={mine.review?._id || "new"}
          bookId={bookId}
          existing={mine.review}
        />
      )}

      {/* List */}
      {isLoading && (
        <p className="text-sm text-[color:var(--c-77716a)]">Loading reviews...</p>
      )}
      {!isLoading && reviews.length === 0 && (
        <p className="text-sm text-[color:var(--c-77716a)]">
          No reviews yet. Be the first one!
        </p>
      )}

      <ul className="space-y-5">
        {reviews.map((r) => {
          const canDelete = user?.role === "admin" || r.user?._id === user?._id;
          return (
            <li
              key={r._id}
              className="border-b border-[color:var(--c-e5ded3)] pb-5 last:border-0"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">
                    {r.user?.name || "Reader"}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <Stars value={r.rating} />
                    <span className="text-xs text-[color:var(--c-77716a)]">
                      {formatDate(r.createdAt)}
                    </span>
                  </div>
                </div>

                {canDelete && (
                  <button
                    onClick={() => {
                      if (confirm("Delete this review?")) remove.mutate(r._id);
                    }}
                    disabled={remove.isPending}
                    title="Delete review"
                    className="text-[color:var(--c-77716a)] hover:text-red-600 disabled:opacity-40"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              {r.comment && (
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#4b443d]">
                  {r.comment}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="rounded-full border border-[color:var(--c-e5ded3)] px-4 py-1.5 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-[color:var(--c-77716a)]">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded-full border border-[color:var(--c-e5ded3)] px-4 py-1.5 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
