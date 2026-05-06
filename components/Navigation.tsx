"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "top" },
  { href: "/new", label: "new" },
  { href: "/best", label: "best" },
  { href: "/ask", label: "ask" },
  { href: "/show", label: "show" },
  { href: "/jobs", label: "jobs" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="bg-[#ff6600] px-2 py-1.5 flex items-center gap-2 sticky top-0 z-10 shadow-sm">
      <Link
        href="/"
        className="font-bold text-white border border-white/70 px-1.5 py-0.5 text-sm shrink-0 hover:bg-white/10 transition-colors"
      >
        HN
      </Link>
      <Link
        href="/"
        className="font-bold text-white text-sm hover:underline shrink-0"
      >
        Hacker News
      </Link>
      <span className="text-white/50 text-xs">|</span>
      <nav className="flex gap-3 overflow-x-auto">
        {NAV_LINKS.map(({ href, label }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`text-xs whitespace-nowrap transition-colors ${
                isActive
                  ? "text-white font-semibold underline"
                  : "text-white/80 hover:text-white hover:underline"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
