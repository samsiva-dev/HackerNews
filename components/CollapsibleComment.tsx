"use client";

import { useState } from "react";
import Link from "next/link";
import { timeAgo } from "@/lib/api";
import type { HNItem } from "@/lib/types";

interface Props {
  item: HNItem;
  depth: number;
  /** Total replies in the entire subtree (shown when collapsed) */
  totalReplies: number;
  children?: React.ReactNode;
}

export default function CollapsibleComment({
  item,
  depth,
  totalReplies,
  children,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);

  const username = item.by ?? "deleted";
  const isTop = depth === 0;

  return (
    <div className={isTop ? "py-5" : ""}>
      {/* ── Header ─────────────────────────────────── */}
      <div className="flex items-baseline gap-2 min-w-0">
        <Link
          href={`/user/${username}`}
          className="text-[11px] font-semibold uppercase tracking-wider text-stone-900 dark:text-gray-100 hover:text-[#ff6600] transition-colors truncate"
        >
          {username}
        </Link>
        <span className="text-[11px] italic text-stone-500 dark:text-gray-500 shrink-0">
          {timeAgo(item.time)}
        </span>

        {/* Collapsed reply count */}
        {collapsed && totalReplies > 0 && (
          <button
            onClick={() => setCollapsed(false)}
            className="text-[11px] text-[#ff6600] hover:underline shrink-0"
          >
            +{totalReplies} {totalReplies === 1 ? "reply" : "replies"}
          </button>
        )}

        {/* Collapse / expand toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand comment" : "Collapse comment"}
          aria-expanded={!collapsed}
          className="ml-auto shrink-0 text-[11px] font-mono text-stone-400 dark:text-gray-500 hover:text-[#ff6600] transition-colors select-none"
        >
          [{collapsed ? "+" : "–"}]
        </button>
      </div>

      {/* ── Body (smooth height animation via grid trick) ── */}
      <div
        className="grid"
        style={{
          gridTemplateRows: collapsed ? "0fr" : "1fr",
          transition: "grid-template-rows 200ms ease",
        }}
      >
        <div className="overflow-hidden">
          {/* Comment text */}
          {item.text && (
            <div
              className="comment-body font-[family-name:var(--font-serif)] text-[15px] leading-relaxed text-stone-800 dark:text-gray-300 mt-1.5"
              dangerouslySetInnerHTML={{ __html: item.text }}
            />
          )}

          {/* Nested replies with thread line */}
          {children && (
            <div className="flex gap-3 sm:gap-4 mt-4">
              {/* Vertical thread line */}
              <button
                onClick={() => setCollapsed(true)}
                aria-label="Collapse thread"
                className="flex flex-col items-center shrink-0 group cursor-pointer w-2"
              >
                <div className="w-px flex-1 bg-stone-300 dark:bg-gray-700 group-hover:w-0.5 group-hover:bg-[#ff6600] min-h-[16px] transition-colors" />
              </button>

              {/* Reply subtree */}
              <div className="flex-1 min-w-0 flex flex-col gap-4 pb-1">
                {children}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
