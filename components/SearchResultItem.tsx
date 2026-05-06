import Link from "next/link";
import type { SearchHit } from "@/lib/search";
import { timeAgo, getDomain } from "@/lib/api";

interface Props {
  hit: SearchHit;
  rank: number;
}

export default function SearchResultItem({ hit, rank }: Props) {
  const domain = getDomain(hit.url);
  const isExternal = !!hit.url;
  const titleHref = isExternal ? hit.url! : `/item/${hit.objectID}`;

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-100 transition-all duration-200 p-4 sm:p-5">
      <div className="flex gap-4">
        {/* Score */}
        {hit.points !== null && (
          <div className="flex flex-col items-center gap-0.5 w-9 shrink-0 pt-0.5">
            <span className="text-[#ff6600] text-xl leading-none select-none">▲</span>
            <span className="text-sm font-bold text-[#ff6600] tabular-nums leading-tight">
              {hit.points >= 1000
                ? `${(hit.points / 1000).toFixed(1)}k`
                : hit.points}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start gap-2 mb-2.5">
            <a
              href={titleHref}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="text-[15px] font-semibold text-gray-900 hover:text-[#ff6600] leading-snug transition-colors break-words"
            >
              {hit.title ?? "(untitled)"}
            </a>
          </div>
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
                href={`/user/${hit.author}`}
                className="font-medium text-gray-600 hover:text-[#ff6600] transition-colors"
              >
                {hit.author}
              </Link>
            </span>
            <span className="text-[11px] text-gray-400">{timeAgo(hit.created_at_i)}</span>
            <Link
              href={`/item/${hit.objectID}`}
              className="inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-[#ff6600] transition-colors font-medium"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {hit.num_comments ?? 0}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
