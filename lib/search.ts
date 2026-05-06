export type SearchType = "all" | "story" | "ask_hn" | "show_hn" | "job";
export type SortBy = "relevance" | "date";
export type DateRange = "all" | "day" | "week" | "month" | "year";

export interface SearchHit {
  objectID: string;
  title?: string;
  url?: string;
  author: string;
  points: number | null;
  num_comments: number | null;
  created_at_i: number;
  story_text?: string;
  _tags: string[];
}

export interface SearchResponse {
  hits: SearchHit[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
}

const ALGOLIA_BASE = "https://hn.algolia.com/api/v1";

const DATE_SECONDS: Record<Exclude<DateRange, "all">, number> = {
  day: 86_400,
  week: 604_800,
  month: 2_592_000,
  year: 31_536_000,
};

const TYPE_TAGS: Record<Exclude<SearchType, "all">, string> = {
  story: "story",
  ask_hn: "ask_hn",
  show_hn: "show_hn",
  job: "job",
};

export async function searchStories(params: {
  query: string;
  type?: SearchType;
  sortBy?: SortBy;
  dateRange?: DateRange;
  page?: number;
  hitsPerPage?: number;
}): Promise<SearchResponse> {
  const {
    query,
    type = "all",
    sortBy = "relevance",
    dateRange = "all",
    page = 0,
    hitsPerPage = 30,
  } = params;

  const endpoint = sortBy === "date" ? "search_by_date" : "search";

  const p = new URLSearchParams({
    query,
    page: String(page),
    hitsPerPage: String(hitsPerPage),
    tags: type === "all" ? "(story,ask_hn,show_hn,job)" : TYPE_TAGS[type],
  });

  if (dateRange !== "all") {
    const since = Math.floor(Date.now() / 1000) - DATE_SECONDS[dateRange];
    p.set("numericFilters", `created_at_i>${since}`);
  }

  const res = await fetch(`${ALGOLIA_BASE}/${endpoint}?${p}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Search request failed");
  return res.json();
}
