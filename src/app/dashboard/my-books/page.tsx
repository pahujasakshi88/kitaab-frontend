"use client";

import { useState } from "react";
import Link from "next/link";
import { BookMarked, Trash2 } from "lucide-react";
import { API } from "@/lib/api";
import {
  useReading,
  useRemoveFromReading,
  useUpdateReading,
} from "@/hooks/useReading";

type Status = "want" | "reading" | "completed";

type Entry = {
  _id: string;
  status: Status;
  progress: number;
  source: "order" | "manual";
  book: {
    _id: string;
    title: string;
    author: string;
    image?: string;
    pages?: number;
  };
};

const TABS: { key: Status; label: string }[] = [
  { key: "reading", label: "Currently Reading" },
  { key: "completed", label: "Completed" },
  { key: "want", label: "Want to Read" },
];

const EMPTY: Record<Status, string> = {
  reading: "You are not reading anything right now.",
  completed: "No completed books yet.",
  want: "Your Want to Read list is empty.",
};

const img = (i?: string) =>
  i ? (i.startsWith("http") ? i : `${API}${i}`) : null;

function Row({ entry }: { entry: Entry }) {
  const update = useUpdateReading();
  const remove = useRemoveFromReading();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(entry.progress);

  const { book } = entry;
  const cover = img(book.image);
  const busy = update.isPending || remove.isPending;

  const saveProgress = () =>
    update.mutate(
      { id: entry._id, progress: value },
      { onSuccess: () => setOpen(false) },
    );

  const primaryLabel =
    entry.status === "want"
      ? "Start Reading"
      : entry.status === "completed"
        ? "Read Again"
        : entry.progress === 0
          ? "Start Reading"
          : "Continue Reading";

  const onPrimary = () => {
    if (entry.status === "want") {
      update.mutate({ id: entry._id, status: "reading" });
    } else if (entry.status === "completed") {
      update.mutate({ id: entry._id, status: "reading", progress: 0 });
    } else {
      setValue(entry.progress);
      setOpen((o) => !o);
    }
  };

  return (
    <li className="rounded-2xl border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] p-4">
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/books/${book._id}`}
          className="h-20 w-14 shrink-0 overflow-hidden rounded-md bg-[color:var(--c-f3eadc)]"
        >
          {cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={book.title}
              className="h-full w-full object-cover"
            />
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{book.title}</p>
          <p className="truncate text-sm text-[color:var(--c-77716a)]">{book.author}</p>

          {entry.status !== "want" && (
            <div className="mt-2 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#efe7da]">
                <div
                  className="h-full rounded-full bg-[#8a4a2b]"
                  style={{ width: `${entry.progress}%` }}
                />
              </div>
              <span className="w-10 text-right text-xs text-[color:var(--c-77716a)]">
                {entry.progress}%
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrimary}
            disabled={busy}
            className={`rounded-full px-5 py-2 text-sm font-medium disabled:opacity-50 ${
              primaryLabel === "Continue Reading"
                ? "bg-[#8a4a2b] text-white"
                : "border border-[color:var(--c-8a4a2b)] text-[color:var(--c-8a4a2b)]"
            }`}
          >
            {primaryLabel}
          </button>

          {entry.source === "manual" && (
            <button
              onClick={() => remove.mutate(entry._id)}
              disabled={busy}
              aria-label="Remove from list"
              className="rounded-full p-2 text-[color:var(--c-77716a)] hover:text-red-600 disabled:opacity-50"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-[#efe7da] pt-4">
          <input
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="min-w-[160px] flex-1 accent-[#8a4a2b]"
          />
          <span className="w-10 text-sm">{value}%</span>
          <button
            onClick={saveProgress}
            disabled={busy}
            className="rounded-full bg-[#8a4a2b] px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Save
          </button>
          <button
            onClick={() =>
              update.mutate({ id: entry._id, status: "completed" })
            }
            disabled={busy}
            className="rounded-full border border-[color:var(--c-e5ded3)] px-5 py-2 text-sm disabled:opacity-50"
          >
            Mark as Completed
          </button>
        </div>
      )}

      {update.isError && (
        <p className="mt-2 text-sm text-red-600">
          Could not update. Try again.
        </p>
      )}
    </li>
  );
}

export default function MyBooksPage() {
  const [tab, setTab] = useState<Status>("reading");
  const { data = [], isLoading, isError } = useReading();

  const items = data as Entry[];
  const count = (s: Status) => items.filter((e) => e.status === s).length;
  const visible = items.filter((e) => e.status === tab);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-serif text-3xl font-semibold">My Books</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-1.5 text-sm ${
              tab === t.key
                ? "bg-[#8a4a2b] text-white"
                : "border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] hover:border-[color:var(--c-c66a45)]"
            }`}
          >
            {t.label} ({count(t.key)})
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-[color:var(--c-white)]" />
          ))}
        </div>
      )}

      {isError && (
        <p className="mt-6 text-center text-[color:var(--c-77716a)]">
          Could not load your books.
        </p>
      )}

      {!isLoading && !isError && visible.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] p-10 text-center">
          <BookMarked className="mx-auto text-[color:var(--c-c66a45)]" />
          <p className="mt-3 text-[color:var(--c-77716a)]">{EMPTY[tab]}</p>
          <Link
            href="/dashboard/books"
            className="mt-4 inline-block rounded-full bg-[#8a4a2b] px-6 py-2 text-sm font-medium text-white"
          >
            Browse Books
          </Link>
        </div>
      )}

      <ul className="mt-6 space-y-4">
        {visible.map((e) => (
          <Row key={e._id} entry={e} />
        ))}
      </ul>
    </div>
  );
}
