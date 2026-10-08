import { getStoryDescription } from "@/lib/preview";
import type { HNItem } from "@/lib/types";

interface Props {
  item: HNItem;
  className?: string;
  /** Shown when no description could be found. */
  fallback?: React.ReactNode;
}

// Async server component: streamed in behind a Suspense boundary so a slow
// site never blocks the rest of the page.
export default async function StoryDescription({ item, className = "", fallback = null }: Props) {
  const description = await getStoryDescription(item);
  if (!description) return fallback;
  return <p className={`news-description ${className}`}>{description}</p>;
}

export function StoryDescriptionSkeleton({ lines = 2 }: { lines?: number }) {
  return (
    <div className="space-y-1.5 mt-2 animate-pulse" aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-2.5 rounded bg-stone-200 dark:bg-gray-800"
          style={{ width: i === lines - 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  );
}
