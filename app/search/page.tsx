import type { Metadata } from "next";
import { searchStories, type SearchType, type SortBy, type DateRange } from "@/lib/search";
import SearchFilters from "@/components/SearchFilters";
import SearchResultItem from "@/components/SearchResultItem";
import Pagination from "@/components/Pagination";

// Algolia pages are 0-indexed; Pagination component is 1-indexed

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
  return { title: q ? `"${q}" – Search` : "Search" };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, type, sort, date, page: pageStr } = await searchParams;

  const query = q?.trim() ?? "";
  const searchType = (type as SearchType) || "all";
  const sortBy = (sort as SortBy) || "relevance";
  const dateRange = (date as DateRange) || "all";
  const page = Math.max(0, parseInt(pageStr ?? "0") || 0);

  const filters = { query, type: searchType, sortBy, dateRange };
  const searchBase = `/search?q=${encodeURIComponent(query)}&type=${searchType}&sort=${sortBy}&date=${dateRange}`;
  // Pagination uses 1-indexed pages; convert to Algolia's 0-indexed
  const hrefForPage = (p: number) => `${searchBase}&page=${p - 1}`;

  const results = query
    ? await searchStories({ ...filters, page, hitsPerPage: 30 })
    : null;

  return (
    <div className="space-y-4">
      {/* Filter card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
        <SearchFilters {...filters} />
        {results && (
          <p className="text-xs text-gray-400 mt-3">
            <span className="font-semibold text-gray-600">
              {results.nbHits.toLocaleString()}
            </span>{" "}
            {results.nbHits === 1 ? "result" : "results"}
            {query && (
              <>
                {" "}for{" "}
                <span className="font-semibold text-gray-700">&ldquo;{query}&rdquo;</span>
              </>
            )}
          </p>
        )}
      </div>

      {/* Empty states */}
      {!query && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
          <div className="text-3xl mb-3 select-none">🔍</div>
          <p className="text-sm text-gray-500 mb-1">Search Hacker News</p>
          <p className="text-xs text-gray-400">
            Powered by the{" "}
            <a
              href="https://hn.algolia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ff6600] hover:underline"
            >
              Algolia HN Search API
            </a>
          </p>
        </div>
      )}

      {results?.hits.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
          <div className="text-3xl mb-3 select-none">🤷</div>
          <p className="text-sm text-gray-500">No results found.</p>
          <p className="text-xs text-gray-400 mt-1">Try different keywords or filters.</p>
        </div>
      )}

      {/* Results */}
      {results && results.hits.length > 0 && (
        <>
          <div className="flex flex-col gap-3">
            {results.hits.map((hit, i) => (
              <SearchResultItem
                key={hit.objectID}
                hit={hit}
                rank={page * 30 + i + 1}
              />
            ))}
          </div>

          {results.nbPages > 1 && (
            <Pagination
              currentPage={page + 1}
              totalPages={results.nbPages}
              hrefForPage={hrefForPage}
            />
          )}
        </>
      )}
    </div>
  );
}
