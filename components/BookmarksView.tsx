"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBookmarks } from "@/contexts/BookmarkContext";
import { timeAgo, getDomain } from "@/lib/api";
import type { Bookmark } from "@/contexts/BookmarkContext";

function BookmarkCard({ bookmark }: { bookmark: Bookmark }) {
  const { toggleBookmark } = useBookmarks();
  const router = useRouter();
  const { item } = bookmark;
  const domain = getDomain(item.url);
  const isExternal = !!item.url;

  return (
    <article
      className="relative bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-orange-100 dark:hover:border-orange-800/50 transition-all duration-200 p-4 sm:p-5 cursor-pointer"
      onClick={() => router.push(`/item/${item.id}`)}
    >
      <div className="flex gap-4">
        {/* Score column */}
        <div className="flex flex-col items-center gap-0.5 w-9 shrink-0 pt-0.5">
          <span className="text-[#ff6600] text-xl leading-none select-none">▲</span>
          <span className="text-sm font-bold text-[#ff6600] tabular-nums leading-tight">
            {(item.score ?? 0) >= 1000
              ? `${((item.score ?? 0) / 1000).toFixed(1)}k`
              : item.score ?? 0}
          </span>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start gap-2 mb-2.5 pr-8">
            {isExternal ? (
              <a
                href={item.url!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 hover:text-[#ff6600] leading-snug transition-colors break-words"
                onClick={(e) => e.stopPropagation()}
              >
                {item.title}
              </a>
            ) : (
              <span className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 leading-snug break-words">
                {item.title}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {domain && (
              <span className="inline-flex items-center text-[11px] bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-800/40 px-2 py-0.5 rounded-full font-medium">
                {domain}
              </span>
            )}
            <span className="text-[11px] text-gray-400 dark:text-gray-500">
              by{" "}
              <Link
                href={`/user/${item.by}`}
                className="font-medium text-gray-600 dark:text-gray-400 hover:text-[#ff6600] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {item.by}
              </Link>
            </span>
            <span className="text-[11px] text-gray-400 dark:text-gray-500">{timeAgo(item.time)}</span>
            <Link
              href={`/item/${item.id}`}
              className="inline-flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 font-medium hover:text-[#ff6600] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {item.descendants ?? 0}
            </Link>
            <span className="text-[11px] text-gray-300 dark:text-gray-600">
              saved {timeAgo(bookmark.savedAt / 1000)}
            </span>
          </div>
        </div>
      </div>

      {/* Remove bookmark button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleBookmark(item);
        }}
        title="Remove bookmark"
        className="absolute top-3 right-3 inline-flex items-center justify-center w-7 h-7 rounded-lg text-orange-400 bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>
    </article>
  );
}

export default function BookmarksView() {
  const { bookmarks, exportBookmarks, importBookmarks, clearBookmarks } =
    useBookmarks();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { added, skipped } = await importBookmarks(file);
      setImportStatus(
        `Imported ${added} bookmark${added !== 1 ? "s" : ""}${skipped > 0 ? `, skipped ${skipped} duplicate${skipped !== 1 ? "s" : ""}` : ""}.`
      );
    } catch {
      setImportStatus("Failed to import — make sure the file is a valid HN bookmarks export.");
    }
    e.target.value = "";
    setTimeout(() => setImportStatus(null), 4000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Bookmarks</h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {bookmarks.length === 0
              ? "No bookmarks saved yet"
              : `${bookmarks.length} saved stor${bookmarks.length !== 1 ? "ies" : "y"}`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Import */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-orange-200 dark:hover:border-orange-700 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleImport}
          />

          {/* Export */}
          {bookmarks.length > 0 && (
            <button
              onClick={exportBookmarks}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-orange-200 dark:hover:border-orange-700 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          )}

          {/* Clear all */}
          {bookmarks.length > 0 && !showClearConfirm && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:border-red-200 dark:hover:border-red-800 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear all
            </button>
          )}

          {showClearConfirm && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 dark:text-gray-400">Are you sure?</span>
              <button
                onClick={() => {
                  clearBookmarks();
                  setShowClearConfirm(false);
                }}
                className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Yes, clear
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Import status toast */}
      {importStatus && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 text-xs rounded-xl px-4 py-2.5 font-medium">
          {importStatus}
        </div>
      )}

      {/* Bookmark list */}
      {bookmarks.length === 0 ? (
        <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-12 text-center">
          <div className="text-4xl mb-3 select-none">🔖</div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No bookmarks yet</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Click the bookmark icon on any story to save it here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.item.id} bookmark={bookmark} />
          ))}
        </div>
      )}

      {/* Export tip */}
      {bookmarks.length > 0 && (
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center pb-2">
          Use Export to save a JSON file and Import to restore it in another browser or window.
        </p>
      )}
    </div>
  );
}
