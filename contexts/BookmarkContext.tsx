"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { HNItem } from "@/lib/types";

export interface Bookmark {
  item: HNItem;
  savedAt: number;
}

interface BookmarkContextValue {
  bookmarks: Bookmark[];
  isBookmarked: (id: number) => boolean;
  toggleBookmark: (item: HNItem) => void;
  exportBookmarks: () => void;
  importBookmarks: (file: File) => Promise<{ added: number; skipped: number }>;
  clearBookmarks: () => void;
}

const BookmarkContext = createContext<BookmarkContextValue | null>(null);
const STORAGE_KEY = "hn-bookmarks";

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setBookmarks(JSON.parse(stored));
    } catch {}
  }, []);

  const persist = (next: Bookmark[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setBookmarks(next);
  };

  const isBookmarked = useCallback(
    (id: number) => bookmarks.some((b) => b.item.id === id),
    [bookmarks]
  );

  const toggleBookmark = useCallback((item: HNItem) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.item.id === item.id);
      const next = exists
        ? prev.filter((b) => b.item.id !== item.id)
        : [{ item, savedAt: Date.now() }, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const exportBookmarks = useCallback(() => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      bookmarks,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hn-bookmarks-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [bookmarks]);

  const importBookmarks = useCallback(async (file: File) => {
    const text = await file.text();
    const data = JSON.parse(text);
    const incoming: Bookmark[] = Array.isArray(data.bookmarks)
      ? data.bookmarks
      : Array.isArray(data)
      ? data
      : [];

    let added = 0;
    let skipped = 0;

    setBookmarks((prev) => {
      const merged = [...prev];
      for (const b of incoming) {
        if (!b.item?.id) continue;
        if (merged.some((x) => x.item.id === b.item.id)) {
          skipped++;
        } else {
          merged.push(b);
          added++;
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    });

    return { added, skipped };
  }, []);

  const clearBookmarks = useCallback(() => {
    persist([]);
  }, []);

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        isBookmarked,
        toggleBookmark,
        exportBookmarks,
        importBookmarks,
        clearBookmarks,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error("useBookmarks must be used within BookmarkProvider");
  return ctx;
}
