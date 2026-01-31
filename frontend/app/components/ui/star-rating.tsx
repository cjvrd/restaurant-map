import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "~/lib/utils";

type StarRatingProps = {
  value: number | null;
  onChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

export function StarRating({ value, onChange, size = "md" }: StarRatingProps) {
  const interactive = !!onChange;
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      className="flex items-center gap-0.5"
      onMouseLeave={() => setHovered(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          className={cn(
            "transition-transform",
            interactive && "cursor-pointer hover:scale-110",
            !interactive && "cursor-default",
          )}
        >
          <Star
            className={cn(
              sizeClasses[size],
              star <= (value ?? 0)
                ? "fill-yellow-400 text-yellow-400"
                : hovered !== null && star <= hovered
                  ? "fill-yellow-200 text-yellow-200"
                  : "fill-gray-200 text-gray-200",
            )}
          />
        </button>
      ))}
    </div>
  );
}
