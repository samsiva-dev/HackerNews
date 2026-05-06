import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: {
    default: "Hacker News Mirror",
    template: "%s | HN Mirror",
  },
  description: "A modern mirror of Hacker News built with the official HN Firebase API.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f6f6ef] font-sans">
        <div className="max-w-4xl mx-auto shadow-sm bg-[#f6f6ef] min-h-screen border-x border-[#e8e8e0]">
          <Navigation />
          <main>{children}</main>
          <footer className="text-center py-4 text-[11px] text-[#828282] border-t-2 border-[#ff6600] mt-6">
            Data from{" "}
            <a
              href="https://news.ycombinator.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-[#ff6600]"
            >
              Hacker News
            </a>{" "}
            via the{" "}
            <a
              href="https://github.com/HackerNews/API"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-[#ff6600]"
            >
              official API
            </a>
          </footer>
        </div>
      </body>
    </html>
  );
}
