import type { CommentNode } from "@/lib/types";
import CollapsibleComment from "./CollapsibleComment";

/** Recursively counts every comment in the subtree */
function countAll(nodes: CommentNode[]): number {
  return nodes.reduce((sum, n) => sum + 1 + countAll(n.children), 0);
}

interface Props {
  comments: CommentNode[];
  depth?: number;
}

export default function CommentTreeView({ comments, depth = 0 }: Props) {
  if (!comments.length) return null;

  return (
    <div className={depth === 0 ? "divide-y divide-stone-300 dark:divide-gray-700 border-t border-stone-300 dark:border-gray-700" : "contents"}>
      {comments.map(({ item, children }) => (
        <CollapsibleComment
          key={item.id}
          item={item}
          depth={depth}
          totalReplies={countAll(children)}
        >
          {children.length > 0 && (
            <CommentTreeView comments={children} depth={depth + 1} />
          )}
        </CollapsibleComment>
      ))}
    </div>
  );
}
