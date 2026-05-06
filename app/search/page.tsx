import type { Metadata } from "next";
import Link from "next/link";
import { searchStories, type SearchType, type SortBy, type DateRange } from "@/lib/search";
import SearchFilters from "@/components/SearchFilters";
import SearchResultItem from "@/components/SearchResultItem";

interface Props {
  searchParams: Promise<{
    q?: string;
    type?: string;
    sort?: string;
    date?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `"${q}" – Search | HN Mirror` : "Search | HN Mirror" };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, type, sort, date, page: pageStr } = await searchParams;

  const query = q?.trim() ?? "";
  const searchType = (type as SearchType) || "all";
  const sortBy = (sort as SortBy) || "relevance";
  const dateRange = (date as DateRange) || "all";
  const page = Math.max(0, parseInt(pageStr ?? "0") || 0);

  const filters = { query, type: searchType, sortBy, dateRange };
  const paginationBase = `/search?q=${encodeURIComponent(query)}&type=${searchType}&sort=${sortBy}&date=${dateRange}`;

  let results = null;
  if (query) {
    results = await searchStories({ ...filters, page, hitsPerPage: 30 });
  }

  return (
    <div>
      <div className="px-4 pt-4 pb-3 border-b border-[#e8e8e0] bg-white/30">
        <SearchFilters {...filters} />
        {results && (
          <p className="text-[11px] text-[#828282] mt-2">
            {results.nbHits.toLocaleString()} result
            {results.nbHits !== 1 ? "s" : ""}
            {query && (
              <>
                {" "}for <strong className="text-gray-700">{query}</strong>
              </>
            )}
          </p>
        )}
      </div>

      {!query && (
        <div className="px-4 py-10 text-center text-sm text-[#828282]">
          Search across HN stories using the{" "}
          <a
            href="https://hn.algolia.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ff6600] hover:underline"
          >
            Algolia HN Search API
          </a>
          .
        </div>
      )}

      {results && results.hits.length === 0 && (
        <div className="px-4 py-10 text-center text-sm text-[#828282]">
          No results found. Try different keywords or filters.
        </div>
      )}

      {results && results.hits.length > 0 && (
        <>
          <div>
            {results.hits.map((hit, i) => (
              <SearchResultItem
                key={hit.objectID}
                hit={hit}
                rank={page * 30 + i + 1}
              />
            ))}
          </div>

          {results.nbPages > 1 && (
            <div className="flex justify-between items-center py-3 px-4 text-xs text-[#828282]">
              {page > 0 ? (
                <Link
                  href={`${paginationBase}&page=${page - 1}`}
                  className="text-[#ff6600] hover:underline"
                >
                  ← prev
                </Link>
              ) : (
                <span />
              )}
              <span>
                page {page + 1} of {results.nbPages}
              </span>
              {page < results.nbPages - 1 ? (
                <Link
                  href={`${paginationBase}&page=${page + 1}`}
                  className="text-[#ff6600] hover:underline"
                >
                  more →
                </Link>
              ) : (
                <span />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
