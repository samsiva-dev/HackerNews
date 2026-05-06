import type { HNItem, HNUser, FeedType, CommentNode } from "./types";

const BASE = "https://hacker-news.firebaseio.com/v0";
const PER_PAGE = 30;

const FEED_ENDPOINTS: Record<FeedType, string> = {
  top: "topstories",
  new: "newstories",
  best: "beststories",
  ask: "askstories",
  show: "showstories",
  job: "jobstories",
};

export async function getStoryIds(feed: FeedType): Promise<number[]> {
  const res = await fetch(`${BASE}/${FEED_ENDPOINTS[feed]}.json`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Failed to fetch ${feed} story IDs`);
  return res.json();
}

export async function getItem(id: number): Promise<HNItem | null> {
  try {
    const res = await fetch(`${BASE}/item/${id}.json`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getUser(username: string): Promise<HNUser | null> {
  try {
    const res = await fetch(`${BASE}/user/${username}.json`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getStoriesPage(
  feed: FeedType,
  page: number
): Promise<{ stories: HNItem[]; totalPages: number; currentPage: number; startRank: number }> {
  const ids = await getStoryIds(feed);
  const totalPages = Math.ceil(ids.length / PER_PAGE);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const start = (currentPage - 1) * PER_PAGE;
  const pageIds = ids.slice(start, start + PER_PAGE);
  const items = await Promise.all(pageIds.map((id) => getItem(id)));
  const stories = items.filter(
    (s): s is HNItem => s !== null && !s.dead && !s.deleted
  );
  return { stories, totalPages, currentPage, startRank: start + 1 };
}

export async function buildCommentTree(
  ids: number[],
  depth = 0,
  maxDepth = 5
): Promise<CommentNode[]> {
  if (!ids.length || depth >= maxDepth) return [];
  const items = await Promise.all(ids.map((id) => getItem(id)));
  const valid = items.filter(
    (item): item is HNItem =>
      item !== null && !item.dead && !item.deleted && item.type === "comment"
  );
  return Promise.all(
    valid.map(async (item) => ({
      item,
      children: item.kids?.length
        ? await buildCommentTree(item.kids, depth + 1, maxDepth)
        : [],
    }))
  );
}

export function timeAgo(timestamp: number): string {
  const s = Math.floor(Date.now() / 1000 - timestamp);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

export function getDomain(url?: string): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}
