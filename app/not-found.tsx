import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl font-black text-orange-100 dark:text-orange-900/50 mb-4 select-none">404</div>
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">Nothing here</h2>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
        This item or user doesn&apos;t exist on Hacker News.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-[#ff6600] hover:bg-orange-600 px-4 py-2 rounded-xl transition-colors shadow-sm"
      >
        ← Back to top stories
      </Link>
    </div>
  );
}
