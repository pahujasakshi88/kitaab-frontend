export const STATUS_STYLE: Record<string, { label: string; cls: string }> = {
  placed: { label: "Placed", cls: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Confirmed", cls: "bg-purple-100 text-purple-700" },
  shipped: { label: "Shipped", cls: "bg-blue-100 text-blue-700" },
  delivered: { label: "Delivered", cls: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", cls: "bg-red-100 text-red-700" },
};

export const formatDate = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";
