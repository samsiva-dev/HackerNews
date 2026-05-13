"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import SearchBar from "./SearchBar";
import { useTheme } from "@/contexts/ThemeContext";

const NAV_LINKS = [
  { href: "/", label: "Top" },
  { href: "/new", label: "New" },
  { href: "/best", label: "Best" },
  { href: "/ask", label: "Ask" },
  { href: "/show", label: "Show" },
  { href: "/jobs", label: "Jobs" },
  { href: "/search", label: "Search" },
  { href: "/bookmarks", label: "Bookmarks" },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycle = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const icon =
    theme === "dark" ? (
      // Moon
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    ) : theme === "light" ? (
      // Sun
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5" />
        <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ) : (
      // System / auto
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path strokeLinecap="round" d="M8 21h8M12 17v4" />
      </svg>
    );

  const label =
    theme === "dark" ? "Dark mode (click for system)" :
    theme === "light" ? "Light mode (click for dark)" :
    "System theme (click for light)";

  return (
    <button
      onClick={cycle}
      title={label}
      aria-label={label}
      className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors"
    >
      {icon}
    </button>
  );
}

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

        <div className="ml-auto flex items-center gap-2 shrink-0">
          <ThemeToggle />
          <Suspense>
            <SearchBar />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
