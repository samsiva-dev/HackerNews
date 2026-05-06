import StoryCard from "./StoryCard";
import Pagination from "./Pagination";
import type { HNItem } from "@/lib/types";

interface Props {
  stories: HNItem[];
  currentPage: number;
  totalPages: number;
  basePath: string;
  startRank: number;
  heading?: string;
}

export default function StoryList({
  stories,
  currentPage,
  totalPages,
  basePath,
  startRank,
  heading,
}: Props) {
  return (
    <div>
      {heading && (
        <h1 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 px-1">
          {heading}
        </h1>
      )}
      <div className="flex flex-col gap-3">
        {stories.map((story, i) => (
          <StoryCard key={story.id} item={story} rank={startRank + i} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={basePath}
      />
    </div>
  );
}
