"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";

export default function AdminPromotionsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");

  const send = useMutation({
    mutationFn: adminService.sendPromotion,
    onSuccess: () => {
      setTitle("");
      setMessage("");
      setLink("");
    },
  });

  const errText =
    (send.error as any)?.response?.data?.message || "Could not send promotion";
  const canSend = title.trim() && message.trim() && !send.isPending;

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold">Send Promotion</h1>
      <p className="mt-1 text-sm text-[color:var(--c-77716a)]">
        Sirf un users ko jayegi jinhone Settings mein Promotions on rakha hai.
      </p>

      <div className="mt-6 space-y-4 rounded-2xl border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] p-6">
        <div>
          <label className="text-sm font-medium">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
            placeholder="Winter Sale is live!"
            className="mt-1 w-full rounded-lg border border-[color:var(--c-e5ded3)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={200}
            rows={3}
            placeholder="Up to 30% off on selected books."
            className="mt-1 w-full rounded-lg border border-[color:var(--c-e5ded3)] px-3 py-2 text-sm"
          />
          <p className="mt-1 text-right text-xs text-[color:var(--c-77716a)]">
            {message.length}/200
          </p>
        </div>
        <div>
          <label className="text-sm font-medium">Link (optional)</label>
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="/dashboard/books"
            className="mt-1 w-full rounded-lg border border-[color:var(--c-e5ded3)] px-3 py-2 text-sm"
          />
        </div>

        {send.isError && (
          <p className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">
            {errText}
          </p>
        )}
        {send.isSuccess && (
          <p className="rounded-lg bg-green-100 px-3 py-2 text-sm text-green-700">
            {send.data.message}
          </p>
        )}

        <button
          onClick={() =>
            send.mutate({
              title: title.trim(),
              message: message.trim(),
              link: link.trim() || undefined,
            })
          }
          disabled={!canSend}
          className="w-full rounded-full bg-[#a8552a] py-3 text-sm font-medium text-white disabled:opacity-50"
        >
          {send.isPending ? "Sending..." : "Send to users"}
        </button>
      </div>
    </div>
  );
}
