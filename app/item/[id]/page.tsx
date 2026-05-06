import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getItem, buildCommentTree, timeAgo, getDomain } from "@/lib/api";
import CommentTreeView from "@/components/CommentTreeView";

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
    <div className="px-2 py-3">
      {/* Story header */}
      <div className="px-2 pb-3 border-b border-[#e8e8e0] mb-4">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <h1 className="text-base font-semibold leading-snug">
            {isExternal ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#ff6600]"
              >
                {item.title}
              </a>
            ) : (
              item.title
            )}
          </h1>
          {domain && (
            <span className="text-xs text-[#828282] shrink-0">({domain})</span>
          )}
        </div>
        <div className="text-[11px] text-[#828282] mt-1 flex flex-wrap gap-x-1.5 items-center">
          <span>{item.score ?? 0} points</span>
          <span>by</span>
          <Link href={`/user/${item.by}`} className="hover:underline text-[#555]">
            {item.by}
          </Link>
          <span>{timeAgo(item.time)}</span>
          <span className="text-[#ccc]">|</span>
          <span>{item.descendants ?? 0} comments</span>
          {isExternal && (
            <>
              <span className="text-[#ccc]">|</span>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-[#ff6600]"
              >
                visit →
              </a>
            </>
          )}
        </div>

        {item.text && (
          <div
            className="comment-body text-sm text-gray-700 mt-3 bg-white/60 rounded p-3 border border-[#e8e8e0]"
            dangerouslySetInnerHTML={{ __html: item.text }}
          />
        )}
      </div>

      {/* Comments */}
      <div className="px-2">
        {comments.length > 0 ? (
          <>
            <p className="text-xs text-[#828282] mb-3 font-medium">
              {item.descendants ?? 0} comments
            </p>
            <CommentTreeView comments={comments} />
          </>
        ) : (
          <p className="text-xs text-[#828282] italic">No comments yet.</p>
        )}
      </div>
    </div>
  );
}
