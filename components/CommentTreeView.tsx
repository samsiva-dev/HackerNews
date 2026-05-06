import type { CommentNode } from "@/lib/types";
import CollapsibleComment from "./CollapsibleComment";

interface Props {
  comments: CommentNode[];
  depth?: number;
}

export default function CommentTreeView({ comments, depth = 0 }: Props) {
  if (!comments.length) return null;

  return (
    <div className="flex flex-col gap-3">
      {comments.map(({ item, children }) => (
        <CollapsibleComment
          key={item.id}
          item={item}
          depth={depth}
          replyCount={children.length}
        >
          {children.length > 0 && (
            <CommentTreeView comments={children} depth={depth + 1} />
          )}
        </CollapsibleComment>
      ))}
    </div>
  );
}
