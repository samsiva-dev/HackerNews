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
    <div className="flex gap-2 py-2 border-b border-[#e8e8e0] hover:bg-white/40 transition-colors px-2">
      <span className="text-[#828282] text-xs w-6 text-right shrink-0 mt-0.5 tabular-nums">
        {rank}.
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          <a
            href={titleHref}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="text-sm text-gray-900 hover:text-[#ff6600] font-medium leading-snug break-words"
          >
            {hit.title ?? "(untitled)"}
          </a>
          {domain && (
            <span className="text-[11px] text-[#828282] shrink-0">
              ({domain})
            </span>
          )}
        </div>
        <div className="text-[11px] text-[#828282] mt-0.5 flex flex-wrap gap-x-1 items-center">
          {hit.points !== null && <span>{hit.points} points</span>}
          <span>by</span>
          <Link
            href={`/user/${hit.author}`}
            className="hover:underline text-[#828282]"
          >
            {hit.author}
          </Link>
          <span>{timeAgo(hit.created_at_i)}</span>
          <span className="text-[#ccc]">|</span>
          <Link
            href={`/item/${hit.objectID}`}
            className="hover:underline text-[#828282]"
          >
            {hit.num_comments ?? 0} comments
          </Link>
        </div>
      </div>
    </div>
  );
}
