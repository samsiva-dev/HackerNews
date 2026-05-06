"use client";

import { useState } from "react";
import Link from "next/link";
import { timeAgo } from "@/lib/api";
import type { HNItem } from "@/lib/types";

const DEPTH_COLORS = [
  "border-orange-400",
  "border-amber-300",
  "border-emerald-400",
  "border-sky-400",
  "border-violet-400",
  "border-pink-400",
];

interface Props {
  item: HNItem;
  depth: number;
  replyCount: number;
  children?: React.ReactNode;
}

export default function CollapsibleComment({
  item,
  depth,
  replyCount,
  children,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const borderColor = DEPTH_COLORS[depth % DEPTH_COLORS.length];

  return (
    <div className={`border-l-2 ${borderColor} pl-3 sm:pl-4`}>
      {/* Comment header */}
      <div className="flex items-center gap-2 mb-1.5">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="text-gray-300 hover:text-gray-500 transition-colors text-[10px] leading-none select-none"
          aria-label={collapsed ? "Expand comment" : "Collapse comment"}
        >
          {collapsed ? "▶" : "▼"}
        </button>
        <Link
          href={`/user/${item.by}`}
          className="text-xs font-semibold text-gray-700 hover:text-[#ff6600] transition-colors"
        >
          {item.by}
        </Link>
        <span className="text-[11px] text-gray-400">{timeAgo(item.time)}</span>
        {collapsed && replyCount > 0 && (
          <button
            onClick={() => setCollapsed(false)}
            className="text-[11px] text-orange-400 hover:text-orange-500 italic"
          >
            {replyCount} {replyCount === 1 ? "reply" : "replies"} hidden
          </button>
        )}
      </div>

      {/* Comment body + children */}
      {!collapsed && (
        <>
          {item.text && (
            <div
              className="comment-body text-sm text-gray-700 leading-relaxed mb-3"
              dangerouslySetInnerHTML={{ __html: item.text }}
            />
          )}
          {children && <div className="flex flex-col gap-3">{children}</div>}
        </>
      )}
    </div>
  );
}
