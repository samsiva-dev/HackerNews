import type { Metadata } from "next";
import { getStoriesPage } from "@/lib/api";
import StoryList from "@/components/StoryList";

export const metadata: Metadata = { title: "Jobs | HN Mirror" };

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  const { p } = await searchParams;
  const page = Math.max(1, parseInt(p ?? "1") || 1);
  const { stories, totalPages, currentPage, startRank } = await getStoriesPage("job", page);

  return (
    <StoryList
      stories={stories}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/jobs"
      startRank={startRank}
    />
  );
}
