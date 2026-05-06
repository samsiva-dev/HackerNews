import Link from "next/link";
import type { HNItem } from "@/lib/types";
import { timeAgo, getDomain } from "@/lib/api";

interface Props {
  item: HNItem;
  rank: number;
}

export default function StoryItem({ item, rank }: Props) {
  const domain = getDomain(item.url);
  const isExternal = !!item.url;
  const titleHref = isExternal ? item.url! : `/item/${item.id}`;

  return (
    <div className="flex gap-2 py-2 border-b border-[#e8e8e0] hover:bg-white/40 transition-colors px-2">
      <span className="text-[#828282] text-xs w-6 text-right shrink-0 mt-0.5 tabular-nums">
        {rank}.
      </span>
      <span className="text-[#ff6600] text-xs shrink-0 mt-0.5 leading-none">▲</span>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          <a
            href={titleHref}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="text-sm text-gray-900 hover:text-[#ff6600] font-medium leading-snug break-words"
          >
            {item.title}
          </a>
          {domain && (
            <span className="text-[11px] text-[#828282] shrink-0">
              ({domain})
            </span>
          )}
        </div>
        <div className="text-[11px] text-[#828282] mt-0.5 flex flex-wrap gap-x-1 items-center">
          <span>{item.score ?? 0} points</span>
          <span>by</span>
          <Link
            href={`/user/${item.by}`}
            className="hover:underline text-[#828282]"
          >
            {item.by}
          </Link>
          <span>{timeAgo(item.time)}</span>
          <span className="text-[#ccc]">|</span>
          <Link
            href={`/item/${item.id}`}
            className="hover:underline text-[#828282]"
          >
            {item.descendants ?? 0}{" "}
            {item.descendants === 1 ? "comment" : "comments"}
          </Link>
        </div>
      </div>
    </div>
  );
}
