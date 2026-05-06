import Link from "next/link";
import StoryItem from "./StoryItem";
import type { HNItem } from "@/lib/types";

interface Props {
  stories: HNItem[];
  currentPage: number;
  totalPages: number;
  basePath: string;
  startRank: number;
}

export default function StoryList({
  stories,
  currentPage,
  totalPages,
  basePath,
  startRank,
}: Props) {
  return (
    <div>
      <div>
        {stories.map((story, i) => (
          <StoryItem key={story.id} item={story} rank={startRank + i} />
        ))}
      </div>
      <div className="flex justify-between items-center py-3 px-4 text-xs text-[#828282]">
        {currentPage > 1 ? (
          <Link
            href={`${basePath}?p=${currentPage - 1}`}
            className="text-[#ff6600] hover:underline"
          >
            ← prev
          </Link>
        ) : (
          <span />
        )}
        <span>
          page {currentPage} of {totalPages}
        </span>
        {currentPage < totalPages ? (
          <Link
            href={`${basePath}?p=${currentPage + 1}`}
            className="text-[#ff6600] hover:underline"
          >
            more →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
