"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const SHORTCUTS = [
  { key: "j", description: "Next story" },
  { key: "k", description: "Previous story" },
  { key: "o", description: "Open story link" },
  { key: "c", description: "Open comments" },
  { key: "b", description: "Toggle bookmark" },
  { key: "/", description: "Focus search" },
  { key: "?", description: "Show shortcuts" },
];

function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <ul className="space-y-2.5">
          {SHORTCUTS.map(({ key, description }) => (
            <li key={key} className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">{description}</span>
              <kbd className="inline-flex items-center justify-center min-w-[1.75rem] h-7 px-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs font-mono font-semibold text-gray-700 dark:text-gray-200">
                {key}
              </kbd>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[11px] text-gray-400 dark:text-gray-500 text-center">
          Shortcuts are disabled when a text field is focused.
        </p>
      </div>
    </div>
  );
}

export default function KeyboardShortcuts() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const getStoryCards = useCallback((): HTMLElement[] => {
    return Array.from(document.querySelectorAll<HTMLElement>("article[data-story-id]"));
  }, []);

  const scrollToCard = useCallback((card: HTMLElement) => {
    const rect = card.getBoundingClientRect();
    const offset = 80; // sticky nav height
    if (rect.top < offset || rect.bottom > window.innerHeight) {
      window.scrollTo({ top: card.offsetTop - offset - 16, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const inInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // Allow '?' and Escape even in inputs
      if (e.key === "Escape") {
        setShowHelp(false);
        return;
      }

      if (inInput && e.key !== "Escape") return;

      switch (e.key) {
        case "?": {
          e.preventDefault();
          setShowHelp((v) => !v);
          break;
        }
        case "j": {
          e.preventDefault();
          const cards = getStoryCards();
          if (!cards.length) break;
          const next = Math.min(focusedIndex + 1, cards.length - 1);
          setFocusedIndex(next);
          cards.forEach((c, i) =>
            c.classList.toggle("ring-2", i === next)
          );
          scrollToCard(cards[next]);
          break;
        }
        case "k": {
          e.preventDefault();
          const cards = getStoryCards();
          if (!cards.length) break;
          const prev = Math.max(focusedIndex - 1, 0);
          setFocusedIndex(prev);
          cards.forEach((c, i) =>
            c.classList.toggle("ring-2", i === prev)
          );
          scrollToCard(cards[prev]);
          break;
        }
        case "o": {
          e.preventDefault();
          const cards = getStoryCards();
          const card = cards[focusedIndex];
          if (!card) break;
          const href = card.dataset.storyUrl;
          if (href) window.open(href, "_blank", "noopener,noreferrer");
          break;
        }
        case "c": {
          e.preventDefault();
          const cards = getStoryCards();
          const card = cards[focusedIndex];
          if (!card) break;
          const id = card.dataset.storyId;
          if (id) router.push(`/item/${id}`);
          break;
        }
        case "b": {
          e.preventDefault();
          const cards = getStoryCards();
          const card = cards[focusedIndex];
          if (!card) break;
          const btn = card.querySelector<HTMLButtonElement>(
            'button[aria-label*="bookmark"], button[aria-label*="Bookmark"]'
          );
          btn?.click();
          break;
        }
        case "/": {
          e.preventDefault();
          const searchInput = document.querySelector<HTMLInputElement>(
            'input[type="search"]'
          );
          searchInput?.focus();
          break;
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [focusedIndex, getStoryCards, router, scrollToCard]);

  // Reset focus index when navigating to a new page
  useEffect(() => {
    setFocusedIndex(-1);
  }, []);

  if (!showHelp) return null;
  return <HelpModal onClose={() => setShowHelp(false)} />;
}
