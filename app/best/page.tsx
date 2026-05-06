import type { Metadata } from "next";
import { getStoriesPage } from "@/lib/api";
import StoryList from "@/components/StoryList";

export const metadata: Metadata = { title: "Best Stories | HN Mirror" };

export default async function BestPage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  const { p } = await searchParams;
  const page = Math.max(1, parseInt(p ?? "1") || 1);
  const { stories, totalPages, currentPage, startRank } = await getStoriesPage("best", page);

  return (
    <StoryList
      stories={stories}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/best"
      startRank={startRank}
    />
  );
}
