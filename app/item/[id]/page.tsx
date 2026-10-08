import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getItem, buildCommentTree, timeAgo, getDomain, getKicker } from "@/lib/api";
import CommentTreeView from "@/components/CommentTreeView";
import BookmarkButton from "@/components/BookmarkButton";
import StoryDescription, { StoryDescriptionSkeleton } from "@/components/StoryDescription";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = await getItem(parseInt(id));
  return { title: item?.title ?? "Story" };
}

function formatDateline(unix: number): string {
  return new Date(unix * 1000).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });
}

const rule = "border-stone-300 dark:border-gray-700";

export default async function ItemPage({ params }: Props) {
  const { id } = await params;
  const item = await getItem(parseInt(id));

  if (!item || item.dead || item.deleted) notFound();

  const domain = getDomain(item.url);
  const isExternal = !!item.url;
  const kicker = getKicker(item);
  const commentCount = item.descendants ?? 0;
  const comments = item.kids?.length
    ? await buildCommentTree(item.kids, 0, 5)
    : [];

  return (
    <div className="max-w-3xl mx-auto text-stone-900 dark:text-gray-100">
      {/* Section bar */}
      <nav className="flex items-center justify-between gap-3 border-y border-stone-900 dark:border-gray-300 py-1.5 mb-8 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-stone-600 dark:text-gray-400">
        <Link href="/" className="hover:text-[#ff6600] transition-colors">
          ← Front Page
        </Link>
        <span className="truncate">
          {kicker ?? (domain ? "News" : "Hacker News")}
          {domain && <span className="normal-case tracking-normal"> · {domain}</span>}
        </span>
      </nav>

      <article>
        {/* Headline */}
        <header className="mb-6">
          {kicker && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ff6600] mb-3">
              {kicker}
            </p>
          )}
          <h1 className="font-[family-name:var(--font-display)] font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.1] break-words">
            {isExternal ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#ff6600] dark:hover:text-[#ff8533] transition-colors"
              >
                {item.title}
              </a>
            ) : (
              item.title
            )}
          </h1>

          {/* Standfirst: the linked page's own summary (link posts only) */}
          {!item.text && isExternal && (
            <div className="mt-4 font-[family-name:var(--font-serif)] italic text-lg sm:text-xl leading-relaxed text-stone-600 dark:text-gray-400">
              <Suspense fallback={<StoryDescriptionSkeleton lines={2} />}>
                <StoryDescription item={item} />
              </Suspense>
            </div>
          )}
        </header>

        {/* Byline */}
        <div className={`flex flex-wrap items-center gap-x-4 gap-y-3 border-y ${rule} py-3 mb-8`}>
          <div className="flex-1 min-w-[12rem] text-xs leading-relaxed">
            <p className="italic text-stone-600 dark:text-gray-400">
              By{" "}
              <Link
                href={`/user/${item.by}`}
                className="not-italic font-semibold uppercase tracking-wider text-stone-900 dark:text-gray-100 hover:text-[#ff6600] transition-colors"
              >
                {item.by}
              </Link>
            </p>
            <p className="text-stone-500 dark:text-gray-500">
              <time dateTime={new Date(item.time * 1000).toISOString()}>{formatDateline(item.time)}</time>
              <span className="mx-1.5">·</span>
              {timeAgo(item.time)}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-stone-500 dark:text-gray-400">
            <span>
              <span className="font-semibold text-[#ff6600] tabular-nums">{item.score ?? 0}</span> points
            </span>
            <a href="#comments" className="hover:text-[#ff6600] transition-colors">
              <span className="font-semibold text-stone-800 dark:text-gray-200 tabular-nums">{commentCount}</span>{" "}
              {commentCount === 1 ? "comment" : "comments"}
            </a>
            <BookmarkButton item={item} />
          </div>
        </div>

        {/* Body (Ask/Show/Job posts) */}
        {item.text && (
          <div
            className="comment-body news-body font-[family-name:var(--font-serif)] text-[17px] sm:text-lg leading-[1.75] text-stone-800 dark:text-gray-200 mb-8"
            dangerouslySetInnerHTML={{ __html: item.text }}
          />
        )}

        {/* Read the original */}
        {isExternal && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center justify-between gap-4 border ${rule} hover:border-[#ff6600] px-4 py-3 mb-10 transition-colors`}
          >
            <span className="min-w-0">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-stone-500 dark:text-gray-500">
                Continue reading at
              </span>
              <span className="block font-[family-name:var(--font-display)] font-bold text-lg truncate group-hover:text-[#ff6600] transition-colors">
                {domain}
              </span>
            </span>
            <span aria-hidden className="text-xl text-[#ff6600] group-hover:translate-x-1 transition-transform">
              →
            </span>
          </a>
        )}
      </article>

      {/* Reader discussion */}
      <section id="comments" className="scroll-mt-20">
        <div className="border-t-4 border-double border-stone-900 dark:border-gray-300 pt-2 mb-2 flex items-baseline justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] font-black text-2xl sm:text-3xl">
            Reader Discussion
          </h2>
          <span className="text-[11px] uppercase tracking-[0.2em] text-stone-500 dark:text-gray-400 tabular-nums">
            {commentCount} {commentCount === 1 ? "comment" : "comments"}
          </span>
        </div>

        {comments.length > 0 ? (
          <CommentTreeView comments={comments} />
        ) : (
          <p className={`border-t ${rule} py-10 text-center font-[family-name:var(--font-serif)] italic text-stone-500 dark:text-gray-400`}>
            No comments yet.
          </p>
        )}
      </section>
    </div>
  );
}
