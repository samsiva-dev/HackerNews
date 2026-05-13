import Link from "next/link";

interface Props {
  currentPage: number;
  totalPages: number;
  /** Either provide basePath (uses ?p=N) or hrefForPage for custom URLs */
  basePath?: string;
  hrefForPage?: (page: number) => string;
}

function getPages(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");

  const lo = Math.max(2, current - 1);
  const hi = Math.min(total - 1, current + 1);
  for (let i = lo; i <= hi; i++) pages.push(i);

  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

const btn =
  "inline-flex items-center justify-center min-w-[2rem] h-8 px-2 rounded-lg text-sm font-medium transition-colors";

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  hrefForPage,
}: Props) {
  if (totalPages <= 1) return null;

  const href = (page: number) =>
    hrefForPage ? hrefForPage(page) : `${basePath}?p=${page}`;

  const pages = getPages(currentPage, totalPages);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 py-6">
      {currentPage > 1 ? (
        <Link href={href(currentPage - 1)} className={`${btn} text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-[#ff6600] hover:shadow-sm border border-transparent hover:border-orange-100 dark:hover:border-orange-800/50`}>
          ← Prev
        </Link>
      ) : (
        <span className={`${btn} text-gray-300 dark:text-gray-600 cursor-not-allowed`}>← Prev</span>
      )}

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-1 text-sm text-gray-400 dark:text-gray-600 select-none">…</span>
        ) : p === currentPage ? (
          <span key={p} aria-current="page" className={`${btn} bg-[#ff6600] text-white shadow-sm`}>
            {p}
          </span>
        ) : (
          <Link key={p} href={href(p)} className={`${btn} text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-[#ff6600] hover:shadow-sm border border-transparent hover:border-orange-100 dark:hover:border-orange-800/50`}>
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link href={href(currentPage + 1)} className={`${btn} text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-[#ff6600] hover:shadow-sm border border-transparent hover:border-orange-100 dark:hover:border-orange-800/50`}>
          Next →
        </Link>
      ) : (
        <span className={`${btn} text-gray-300 dark:text-gray-600 cursor-not-allowed`}>Next →</span>
      )}
    </nav>
  );
}
