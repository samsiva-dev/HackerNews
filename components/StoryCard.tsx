"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { HNItem } from "@/lib/types";
import { timeAgo, getDomain } from "@/lib/api";
import BookmarkButton from "@/components/BookmarkButton";
import { useVisited } from "@/contexts/VisitedContext";

interface Props {
  item: HNItem;
  rank: number;
}

const TYPE_BADGE: Partial<Record<string, { label: string; cls: string }>> = {
  ask: { label: "Ask HN", cls: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800" },
  show: { label: "Show HN", cls: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800" },
  job: { label: "Job", cls: "bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 border-violet-100 dark:border-violet-800" },
};

function getTypeBadge(item: HNItem) {
  if (item.type === "job") return TYPE_BADGE.job;
  if (item.title?.startsWith("Ask HN")) return TYPE_BADGE.ask;
  if (item.title?.startsWith("Show HN")) return TYPE_BADGE.show;
  return null;
}

export default function StoryCard({ item, rank }: Props) {
  const router = useRouter();
  const { isVisited, markVisited } = useVisited();
  const domain = getDomain(item.url);
  const isExternal = !!item.url;
  const badge = getTypeBadge(item);
  const visited = isVisited(item.id);

  const handleClick = () => {
    markVisited(item.id);
    router.push(`/item/${item.id}`);
  };

  return (
    <article
      data-story-id={item.id}
      data-story-url={item.url ?? ""}
      className={`relative bg-white dark:bg-gray-800/80 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 p-4 sm:p-5 cursor-pointer ${
        visited
          ? "border-gray-100 dark:border-gray-700/50 opacity-75 hover:opacity-100"
          : "border-gray-100 dark:border-gray-700 hover:border-orange-100 dark:hover:border-orange-800/50"
      }`}
      onClick={handleClick}
    >
      <BookmarkButton item={item} className="absolute top-3 right-3" />

      {visited && (
        <span className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" title="Already read" />
      )}

      <div className="flex gap-4">
        {/* Score column */}
        <div className="flex flex-col items-center gap-0.5 w-9 shrink-0 pt-0.5">
          <span className="text-[#ff6600] text-xl leading-none select-none">▲</span>
          <span className="text-sm font-bold text-[#ff6600] tabular-nums leading-tight">
            {(item.score ?? 0) >= 1000
              ? `${((item.score ?? 0) / 1000).toFixed(1)}k`
              : item.score ?? 0}
          </span>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex flex-wrap items-start gap-2 mb-2.5 pr-8">
            {badge && (
              <span className={`inline-flex shrink-0 items-center text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded border ${badge.cls}`}>
                {badge.label}
              </span>
            )}
            {isExternal ? (
              <a
                href={item.url!}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-[15px] font-semibold leading-snug transition-colors break-words ${
                  visited
                    ? "text-gray-500 dark:text-gray-400 hover:text-[#ff6600]"
                    : "text-gray-900 dark:text-gray-100 hover:text-[#ff6600]"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  markVisited(item.id);
                }}
              >
                {item.title}
              </a>
            ) : (
              <span className={`text-[15px] font-semibold leading-snug break-words ${
                visited ? "text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-gray-100"
              }`}>
                {item.title}
              </span>
            )}
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {domain && (
              <span className="inline-flex items-center text-[11px] bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-800/40 px-2 py-0.5 rounded-full font-medium">
                {domain}
              </span>
            )}
            <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">#{rank}</span>
            <span className="text-[11px] text-gray-400 dark:text-gray-500">
              by{" "}
              <Link
                href={`/user/${item.by}`}
                className="font-medium text-gray-600 dark:text-gray-400 hover:text-[#ff6600] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {item.by}
              </Link>
            </span>
            <span className="text-[11px] text-gray-400 dark:text-gray-500">{timeAgo(item.time)}</span>
            <Link
              href={`/item/${item.id}`}
              className="inline-flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 font-medium hover:text-[#ff6600] transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                markVisited(item.id);
              }}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {item.descendants ?? 0}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
