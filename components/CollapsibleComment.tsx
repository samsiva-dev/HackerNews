"use client";

import { useState } from "react";
import Link from "next/link";
import { timeAgo } from "@/lib/api";
import type { HNItem } from "@/lib/types";

// Deterministic per-user color from username hash
const AVATAR_PALETTE = [
  "bg-orange-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-teal-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-cyan-500",
  "bg-lime-600",
  "bg-fuchsia-500",
];

function avatarColor(name: string): string {
  let h = 0;
  for (const c of name) h = c.charCodeAt(0) + ((h << 5) - h);
  return AVATAR_PALETTE[Math.abs(h) % AVATAR_PALETTE.length];
}

// Thin thread line color per nesting depth
const THREAD_COLORS = [
  "bg-orange-300",
  "bg-amber-300",
  "bg-emerald-300",
  "bg-sky-300",
  "bg-violet-300",
  "bg-pink-300",
];

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
  const initials = username.slice(0, 2).toUpperCase();
  const color = avatarColor(username);
  const threadColor = THREAD_COLORS[depth % THREAD_COLORS.length];
  const isTop = depth === 0;

  return (
    // Top-level: full white card. Nested: bare (lives inside parent thread)
    <div
      className={
        isTop
          ? "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          : ""
      }
    >
      <div className={isTop ? "p-4 sm:p-5" : ""}>
        {/* ── Header ─────────────────────────────────── */}
        <div className="flex items-center gap-2.5">
          {/* Avatar */}
          <Link
            href={`/user/${username}`}
            className={`w-7 h-7 rounded-lg ${color} text-white text-[10px] font-bold flex items-center justify-center shrink-0 hover:opacity-75 transition-opacity select-none`}
          >
            {initials}
          </Link>

          {/* Username + timestamp */}
          <div className="flex-1 flex items-center gap-2 min-w-0 overflow-hidden">
            <Link
              href={`/user/${username}`}
              className="text-sm font-semibold text-gray-800 hover:text-[#ff6600] transition-colors truncate"
            >
              {username}
            </Link>
            <span className="text-[11px] text-gray-400 shrink-0">
              {timeAgo(item.time)}
            </span>

            {/* Collapsed reply count badge */}
            {collapsed && totalReplies > 0 && (
              <button
                onClick={() => setCollapsed(false)}
                className="text-[10px] font-semibold text-gray-400 bg-gray-100 hover:bg-gray-200 px-1.5 py-0.5 rounded-full transition-colors shrink-0"
              >
                +{totalReplies}
              </button>
            )}
          </div>

          {/* Collapse / expand toggle */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand comment" : "Collapse comment"}
            className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors select-none"
          >
            {collapsed ? "+" : "−"}
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
                className="comment-body text-sm text-gray-700 leading-relaxed mt-3"
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
            )}

            {/* Nested replies with thread line */}
            {children && (
              <div className="flex gap-3 mt-4">
                {/* Vertical thread line */}
                <button
                  onClick={() => setCollapsed(true)}
                  aria-label="Collapse thread"
                  className="flex flex-col items-center shrink-0 group cursor-pointer pt-0.5"
                >
                  <div
                    className={`w-0.5 flex-1 ${threadColor} opacity-40 group-hover:opacity-80 rounded-full min-h-[16px] transition-opacity`}
                  />
                </button>

                {/* Reply subtree */}
                <div className="flex-1 min-w-0 flex flex-col gap-3 pb-1">
                  {children}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
