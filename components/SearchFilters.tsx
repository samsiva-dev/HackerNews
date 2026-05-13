"use client";

import { useRouter } from "next/navigation";
import type { SearchType, SortBy, DateRange } from "@/lib/search";

interface Props {
  query: string;
  type: SearchType;
  sortBy: SortBy;
  dateRange: DateRange;
}

const selectCls =
  "text-xs border border-gray-200 dark:border-gray-700 rounded px-2 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-[#ff6600] cursor-pointer";

export default function SearchFilters({ query, type, sortBy, dateRange }: Props) {
  const router = useRouter();

  function push(overrides: Partial<Record<"type" | "sort" | "date", string>>) {
    const p = new URLSearchParams({
      q: query,
      type: overrides.type ?? type,
      sort: overrides.sort ?? sortBy,
      date: overrides.date ?? dateRange,
      page: "0",
    });
    router.push(`/search?${p}`);
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value.trim();
    if (!q) return;
    const p = new URLSearchParams({ q, type, sort: sortBy, date: dateRange, page: "0" });
    router.push(`/search?${p}`);
  }

  return (
    <form onSubmit={handleSearch} className="flex flex-wrap gap-2 items-center">
      <input
        name="q"
        type="search"
        defaultValue={query}
        placeholder="Search Hacker News…"
        className="text-sm border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 flex-1 min-w-[180px] focus:outline-none focus:border-[#ff6600]"
      />
      <button
        type="submit"
        className="text-xs px-3 py-1.5 bg-[#ff6600] text-white rounded hover:bg-[#e65c00] transition-colors"
      >
        Search
      </button>

      <div className="flex gap-2 flex-wrap">
        <select
          value={type}
          onChange={(e) => push({ type: e.target.value })}
          className={selectCls}
          aria-label="Story type"
        >
          <option value="all">All types</option>
          <option value="story">Stories</option>
          <option value="ask_hn">Ask HN</option>
          <option value="show_hn">Show HN</option>
          <option value="job">Jobs</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => push({ sort: e.target.value })}
          className={selectCls}
          aria-label="Sort by"
        >
          <option value="relevance">Relevance</option>
          <option value="date">Date</option>
        </select>

        <select
          value={dateRange}
          onChange={(e) => push({ date: e.target.value })}
          className={selectCls}
          aria-label="Date range"
        >
          <option value="all">Any time</option>
          <option value="day">Past 24h</option>
          <option value="week">Past week</option>
          <option value="month">Past month</option>
          <option value="year">Past year</option>
        </select>
      </div>
    </form>
  );
}
