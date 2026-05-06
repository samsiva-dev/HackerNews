import Link from "next/link";
import type { CommentNode } from "@/lib/types";
import { timeAgo } from "@/lib/api";

const BORDER_COLORS = [
  "border-orange-300",
  "border-yellow-300",
  "border-green-300",
  "border-blue-300",
  "border-purple-300",
];

interface Props {
  comments: CommentNode[];
  depth?: number;
}

export default function CommentTreeView({ comments, depth = 0 }: Props) {
  if (!comments.length) return null;

  const borderColor = BORDER_COLORS[depth % BORDER_COLORS.length];

  return (
    <div className={depth > 0 ? `ml-4 border-l-2 ${borderColor} pl-3` : ""}>
      {comments.map(({ item, children }) => (
        <div key={item.id} className="py-2">
          <div className="text-[11px] text-[#828282] mb-1 flex items-center gap-1.5">
            <Link
              href={`/user/${item.by}`}
              className="font-semibold text-[#555] hover:underline"
            >
              {item.by}
            </Link>
            <span>{timeAgo(item.time)}</span>
            <Link
              href={`/item/${item.id}`}
              className="hover:underline opacity-50"
            >
              #
            </Link>
          </div>
          {item.text && (
            <div
              className="comment-body text-sm text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: item.text }}
            />
          )}
          {children.length > 0 && (
            <div className="mt-2">
              <CommentTreeView comments={children} depth={depth + 1} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
