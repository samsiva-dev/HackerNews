import { Suspense } from "react";
import StoryCard, { type StoryVariant } from "./StoryCard";
import StoryDescription, { StoryDescriptionSkeleton } from "./StoryDescription";
import Pagination from "./Pagination";
import { getDomain } from "@/lib/api";
import type { HNItem } from "@/lib/types";

interface Props {
  stories: HNItem[];
  currentPage: number;
  totalPages: number;
  basePath: string;
  startRank: number;
  heading?: string;
  /** Edition name shown in the masthead, e.g. "Top Stories". */
  edition?: string;
}

function Story({ item, rank, variant }: { item: HNItem; rank: number; variant: StoryVariant }) {
  return (
    <StoryCard
      item={item}
      rank={rank}
      variant={variant}
      description={
        <Suspense fallback={<StoryDescriptionSkeleton lines={variant === "lead" ? 3 : 2} />}>
          <StoryDescription
            item={item}
            fallback={variant === "lead" ? <LeadFallback item={item} /> : null}
          />
        </Suspense>
      }
    />
  );
}

// Keeps the front page balanced when the lead story has no description.
function LeadFallback({ item }: { item: HNItem }) {
  const domain = getDomain(item.url);
  const comments = item.descendants ?? 0;
  return (
    <p className="m-0 italic text-stone-500 dark:text-gray-400">
      {domain ? `Read the full story at ${domain}, or join` : "Join"} the{" "}
      {comments === 1 ? "1-comment" : `${comments}-comment`} discussion on Hacker News.
    </p>
  );
}

export default function StoryList({
  stories,
  currentPage,
  totalPages,
  basePath,
  startRank,
  heading,
  edition,
}: Props) {
  const [lead, ...rest] = stories;
  const secondary = rest.slice(0, 2);
  const standard = rest.slice(2);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="text-stone-900 dark:text-gray-100">
      {/* Masthead */}
      <header className="text-center mb-6">
        <div className="flex items-center justify-between gap-2 border-y border-stone-900 dark:border-gray-300 py-1 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-stone-600 dark:text-gray-400">
          <span className="truncate">{today}</span>
          <span className="hidden sm:inline">{edition ?? heading ?? "Daily Edition"}</span>
          <span className="tabular-nums shrink-0">
            Page {currentPage} of {totalPages}
          </span>
        </div>
        <h1 className="font-[family-name:var(--font-display)] font-black tracking-tight text-5xl sm:text-6xl lg:text-7xl py-3 sm:py-4 leading-none">
          Hacker News
        </h1>
        <div className="border-t-4 border-double border-stone-900 dark:border-gray-300 pt-1">
          <p className="font-[family-name:var(--font-serif)] italic text-xs sm:text-sm text-stone-600 dark:text-gray-400">
            {edition ?? heading ?? "Daily Edition"}
            <span className="sm:hidden"> · </span>
            <span className="hidden sm:inline"> — </span>
            {stories.length} stories in this edition
          </p>
        </div>
      </header>

      {stories.length === 0 ? (
        <p className="text-center py-16 font-[family-name:var(--font-serif)] italic text-stone-500">
          No stories in this edition.
        </p>
      ) : (
        <>
          {/* Front page: lead + secondary column */}
          <section className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 border-b-2 border-stone-900 dark:border-gray-300 pb-2 mb-2">
            <div className="lg:col-span-2 lg:border-r lg:border-stone-300 lg:dark:border-gray-700 lg:pr-8">
              <Story item={lead} rank={startRank} variant="lead" />
            </div>
            {secondary.length > 0 && (
              <div className="divide-y divide-stone-300 dark:divide-gray-700 border-t border-stone-300 dark:border-gray-700 lg:border-t-0">
                {secondary.map((s, i) => (
                  <Story key={s.id} item={s} rank={startRank + 1 + i} variant="secondary" />
                ))}
              </div>
            )}
          </section>

          {/* Remaining stories in newspaper columns */}
          {standard.length > 0 && (
            <section className="news-columns columns-1 md:columns-2 lg:columns-3 gap-8">
              {standard.map((s, i) => (
                <div key={s.id} className="break-inside-avoid border-b border-stone-300 dark:border-gray-700">
                  <Story item={s} rank={startRank + 3 + i} variant="standard" />
                </div>
              ))}
            </section>
          )}
        </>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} basePath={basePath} />
    </div>
  );
}
