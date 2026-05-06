import type { Metadata } from "next";
import { getStoriesPage } from "@/lib/api";
import StoryList from "@/components/StoryList";

export const metadata: Metadata = { title: "Ask HN | HN Mirror" };

export default async function AskPage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  const { p } = await searchParams;
  const page = Math.max(1, parseInt(p ?? "1") || 1);
  const { stories, totalPages, currentPage, startRank } = await getStoriesPage("ask", page);

  return (
    <StoryList
      stories={stories}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/ask"
      startRank={startRank}
    />
  );
}
