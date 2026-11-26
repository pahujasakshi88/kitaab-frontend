import { Star } from "lucide-react";

export default function Stars({
  value,
  size = 14,
}: {
  value: number;
  size?: number;
}) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= Math.round(value)
              ? "fill-[#e0a030] text-[#e0a030]"
              : "text-[color:var(--c-20201d)]/20"
          }
        />
      ))}
    </span>
  );
}
