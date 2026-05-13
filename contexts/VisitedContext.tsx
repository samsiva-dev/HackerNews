"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

interface VisitedContextValue {
  isVisited: (id: number) => boolean;
  markVisited: (id: number) => void;
}

const VisitedContext = createContext<VisitedContextValue | null>(null);
const STORAGE_KEY = "hn-visited";
const MAX_VISITED = 500;

export function VisitedProvider({ children }: { children: React.ReactNode }) {
  const [visited, setVisited] = useState<Set<number>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setVisited(new Set(JSON.parse(stored)));
    } catch {}
  }, []);

  const isVisited = useCallback((id: number) => visited.has(id), [visited]);

  const markVisited = useCallback((id: number) => {
    setVisited((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      // Keep only the most recent MAX_VISITED entries
      const arr = Array.from(next);
      const trimmed = arr.length > MAX_VISITED ? arr.slice(arr.length - MAX_VISITED) : arr;
      const trimmedSet = new Set(trimmed);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      } catch {}
      return trimmedSet;
    });
  }, []);

  return (
    <VisitedContext.Provider value={{ isVisited, markVisited }}>
      {children}
    </VisitedContext.Provider>
  );
}

export function useVisited() {
  const ctx = useContext(VisitedContext);
  if (!ctx) throw new Error("useVisited must be used within VisitedProvider");
  return ctx;
}
