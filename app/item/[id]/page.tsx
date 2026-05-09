import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getItem, buildCommentTree, timeAgo, getDomain } from "@/lib/api";
import CommentTreeView from "@/components/CommentTreeView";
import BookmarkButton from "@/components/BookmarkButton";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = await getItem(parseInt(id));
  return { title: item?.title ?? "Story" };
}

export default async function ItemPage({ params }: Props) {
  const { id } = await params;
  const item = await getItem(parseInt(id));

  if (!item || item.dead || item.deleted) notFound();

  const domain = getDomain(item.url);
  const isExternal = !!item.url;
  const comments = item.kids?.length
    ? await buildCommentTree(item.kids, 0, 5)
    : [];

  return (
    <div className="space-y-4">
      {/* Story header card */}
      <article className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
        <BookmarkButton item={item!} className="absolute top-4 right-4" />
        <div className="flex gap-4">
          {/* Score */}
          <div className="flex flex-col items-center gap-0.5 w-9 shrink-0 pt-1">
            <span className="text-[#ff6600] text-2xl leading-none select-none">▲</span>
            <span className="text-sm font-bold text-[#ff6600] tabular-nums">
              {(item.score ?? 0) >= 1000
                ? `${((item.score ?? 0) / 1000).toFixed(1)}k`
                : item.score ?? 0}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug mb-3 pr-8">
              {isExternal ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#ff6600] transition-colors"
                >
                  {item.title}
                </a>
              ) : (
                item.title
              )}
            </h1>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              {domain && (
                <span className="inline-flex items-center text-xs bg-orange-50 text-orange-600 border border-orange-100 px-2.5 py-0.5 rounded-full font-medium">
                  {domain}
                </span>
              )}
              <span className="text-xs text-gray-500">
                by{" "}
                <Link
                  href={`/user/${item.by}`}
                  className="font-semibold text-gray-700 hover:text-[#ff6600] transition-colors"
                >
                  {item.by}
                </Link>
              </span>
              <span className="text-xs text-gray-400">{timeAgo(item.time)}</span>
              <span className="text-xs text-gray-400">
                {item.descendants ?? 0} comments
              </span>
              {isExternal && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#ff6600] hover:text-orange-700 font-medium transition-colors"
                >
                  Visit site
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {item.text && (
          <div
            className="comment-body text-sm text-gray-700 mt-5 pt-5 border-t border-gray-100 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: item.text }}
          />
        )}
      </article>

      {/* Comments section */}
      <section>
        <div className="flex items-center gap-3 mb-4 px-1">
          <h2 className="text-sm font-semibold text-gray-700">
            {item.descendants ?? 0} Comments
          </h2>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {comments.length > 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <CommentTreeView comments={comments} />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <p className="text-sm text-gray-400 italic">No comments yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}
