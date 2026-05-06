"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import SearchBar from "./SearchBar";

const NAV_LINKS = [
  { href: "/", label: "Top" },
  { href: "/new", label: "New" },
  { href: "/best", label: "Best" },
  { href: "/ask", label: "Ask" },
  { href: "/show", label: "Show" },
  { href: "/jobs", label: "Jobs" },
  { href: "/search", label: "Search" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 bg-[#ff6600] shadow-md">
      <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 flex items-center gap-3 py-2.5">
        <Link
          href="/"
          className="shrink-0 bg-white/20 hover:bg-white/30 border border-white/40 text-white font-bold text-sm px-2.5 py-1 rounded-lg transition-colors"
        >
          HN
        </Link>
        <Link
          href="/"
          className="hidden sm:block text-white font-semibold text-sm shrink-0 hover:text-white/80 transition-colors"
        >
          Hacker News
        </Link>
        <div className="hidden sm:block w-px h-5 bg-white/30 shrink-0" />

        <nav className="flex items-center gap-0.5 overflow-x-auto">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`text-xs px-2.5 py-1.5 rounded-md whitespace-nowrap transition-colors font-medium ${
                  isActive
                    ? "bg-white/25 text-white"
                    : "text-white/75 hover:text-white hover:bg-white/15"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto shrink-0">
          <Suspense>
            <SearchBar />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
