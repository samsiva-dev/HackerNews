"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { HNItem } from "@/lib/types";
import { timeAgo, getDomain, getKicker } from "@/lib/api";
import BookmarkButton from "@/components/BookmarkButton";
import { useVisited } from "@/contexts/VisitedContext";

export type StoryVariant = "lead" | "secondary" | "standard";

interface Props {
  item: HNItem;
  rank: number;
  variant?: StoryVariant;
  /** Server-rendered description (streamed via Suspense). */
  description?: React.ReactNode;
}

const HEADLINE: Record<StoryVariant, string> = {
  lead: "text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] font-bold",
  secondary: "text-xl sm:text-2xl leading-tight font-bold",
  standard: "text-lg leading-snug font-semibold",
};

const DESCRIPTION: Record<StoryVariant, string> = {
  lead: "text-base sm:text-lg",
  secondary: "text-[15px]",
  standard: "text-sm",
};

export default function StoryCard({ item, rank, variant = "standard", description }: Props) {
  const router = useRouter();
  const { isVisited, markVisited } = useVisited();
  const domain = getDomain(item.url);
  const isExternal = !!item.url;
  const kicker = getKicker(item);
  const visited = isVisited(item.id);

  const handleClick = () => {
    markVisited(item.id);
    router.push(`/item/${item.id}`);
  };

  const headlineCls = `font-[family-name:var(--font-display)] ${HEADLINE[variant]} break-words transition-colors ${
    visited ? "text-stone-500 dark:text-gray-500" : "text-stone-900 dark:text-gray-100"
  }`;

  return (
    <article
      data-story-id={item.id}
      data-story-url={item.url ?? ""}
      className="group relative cursor-pointer break-inside-avoid py-4"
      onClick={handleClick}
    >
      <BookmarkButton
        item={item}
        className="absolute top-3 right-0 opacity-60 group-hover:opacity-100 transition-opacity"
      />

      {/* Kicker */}
      <div className="flex items-center gap-2 mb-1.5 pr-8 text-[10px] font-semibold uppercase tracking-[0.18em]">
        <span className="text-stone-400 dark:text-gray-500 tabular-nums">No. {rank}</span>
        {kicker && (
          <>
            <span className="text-stone-300 dark:text-gray-700">·</span>
            <span className="text-[#ff6600]">{kicker}</span>
          </>
        )}
        {domain && (
          <>
            <span className="text-stone-300 dark:text-gray-700">·</span>
            <span className="text-stone-500 dark:text-gray-400 normal-case tracking-normal truncate">{domain}</span>
          </>
        )}
        {visited && (
          <span className="text-stone-400 dark:text-gray-600 normal-case tracking-normal italic" title="Already read">
            read
          </span>
        )}
      </div>

      {/* Headline */}
      <h2 className={`pr-8 ${variant === "lead" ? "mb-3" : "mb-1.5"}`}>
        {isExternal ? (
          <a
            href={item.url!}
            target="_blank"
            rel="noopener noreferrer"
            className={`${headlineCls} hover:text-[#ff6600] dark:hover:text-[#ff8533]`}
            onClick={(e) => {
              e.stopPropagation();
              markVisited(item.id);
            }}
          >
            {item.title}
          </a>
        ) : (
          <span className={`${headlineCls} group-hover:text-[#ff6600] dark:group-hover:text-[#ff8533]`}>
            {item.title}
          </span>
        )}
      </h2>

      {/* Description */}
      {description && (
        <div
          className={`font-[family-name:var(--font-serif)] leading-relaxed text-stone-700 dark:text-gray-300 ${
            DESCRIPTION[variant]
          } ${visited ? "opacity-70" : ""} ${variant === "lead" ? "news-dropcap" : ""}`}
        >
          {description}
        </div>
      )}

      {/* Byline */}
      <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-stone-500 dark:text-gray-500">
        <span className="font-semibold text-[#ff6600] tabular-nums">{item.score ?? 0} pts</span>
        <span className="text-stone-300 dark:text-gray-700">|</span>
        <span className="italic">
          By{" "}
          <Link
            href={`/user/${item.by}`}
            className="not-italic font-medium text-stone-700 dark:text-gray-300 hover:text-[#ff6600] transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {item.by}
          </Link>
        </span>
        <span className="text-stone-300 dark:text-gray-700">|</span>
        <time dateTime={new Date(item.time * 1000).toISOString()}>{timeAgo(item.time)}</time>
        <span className="text-stone-300 dark:text-gray-700">|</span>
        <Link
          href={`/item/${item.id}`}
          className="font-medium hover:text-[#ff6600] transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            markVisited(item.id);
          }}
        >
          {item.descendants ?? 0} {item.descendants === 1 ? "comment" : "comments"} →
        </Link>
      </div>
    </article>
  );
}
