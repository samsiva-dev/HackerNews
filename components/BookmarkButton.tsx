"use client";

import { useBookmarks } from "@/contexts/BookmarkContext";
import type { HNItem } from "@/lib/types";

interface Props {
  item: HNItem;
  className?: string;
}

export default function BookmarkButton({ item, className = "" }: Props) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(item.id);

  return (
    <button
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        toggleBookmark(item);
      }}
      title={bookmarked ? "Remove bookmark" : "Bookmark this story"}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark this story"}
      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg transition-colors ${
        bookmarked
          ? "text-orange-500 bg-orange-50 hover:bg-orange-100"
          : "text-gray-300 hover:text-orange-400 hover:bg-orange-50"
      } ${className}`}
    >
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill={bookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
    </button>
  );
}
