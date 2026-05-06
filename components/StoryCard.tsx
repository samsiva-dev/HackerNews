"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { HNItem } from "@/lib/types";
import { timeAgo, getDomain } from "@/lib/api";

interface Props {
  item: HNItem;
  rank: number;
}

const TYPE_BADGE: Partial<Record<string, { label: string; cls: string }>> = {
  ask: { label: "Ask HN", cls: "bg-blue-50 text-blue-600 border-blue-100" },
  show: { label: "Show HN", cls: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  job: { label: "Job", cls: "bg-violet-50 text-violet-600 border-violet-100" },
};

function getTypeBadge(item: HNItem) {
  if (item.type === "job") return TYPE_BADGE.job;
  if (item.title?.startsWith("Ask HN")) return TYPE_BADGE.ask;
  if (item.title?.startsWith("Show HN")) return TYPE_BADGE.show;
  return null;
}

export default function StoryCard({ item, rank }: Props) {
  const router = useRouter();
  const domain = getDomain(item.url);
  const isExternal = !!item.url;
  const badge = getTypeBadge(item);

  return (
    <article
      className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-100 transition-all duration-200 p-4 sm:p-5 cursor-pointer"
      onClick={() => router.push(`/item/${item.id}`)}
    >

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
          <div className="flex flex-wrap items-start gap-2 mb-2.5">
            {badge && (
              <span className={`inline-flex shrink-0 items-center text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded border ${badge.cls}`}>
                {badge.label}
              </span>
            )}
            {/* Title: opens external URL if available, otherwise falls through to card link */}
            {isExternal ? (
              <a
                href={item.url!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] font-semibold text-gray-900 hover:text-[#ff6600] leading-snug transition-colors break-words"
                onClick={(e) => e.stopPropagation()}
              >
                {item.title}
              </a>
            ) : (
              <span className="text-[15px] font-semibold text-gray-900 leading-snug break-words">
                {item.title}
              </span>
            )}
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {domain && (
              <span className="inline-flex items-center text-[11px] bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded-full font-medium">
                {domain}
              </span>
            )}
            <span className="text-[11px] text-gray-400 tabular-nums">#{rank}</span>
            <span className="text-[11px] text-gray-400">
              by{" "}
              <Link
                href={`/user/${item.by}`}
                className="font-medium text-gray-600 hover:text-[#ff6600] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {item.by}
              </Link>
            </span>
            <span className="text-[11px] text-gray-400">{timeAgo(item.time)}</span>
            <Link
              href={`/item/${item.id}`}
              className="inline-flex items-center gap-1 text-[11px] text-gray-400 font-medium hover:text-[#ff6600] transition-colors"
              onClick={(e) => e.stopPropagation()}
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
