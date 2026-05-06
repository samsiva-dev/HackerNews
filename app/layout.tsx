import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Hacker News",
    template: "%s | HN",
  },
  description: "A modern Hacker News reader powered by the official HN API.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-[#f5f3ef] font-[family-name:var(--font-inter)] antialiased">
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1 w-full max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
            {children}
          </main>
          <footer className="w-full max-w-3xl mx-auto px-4 py-5 mt-2 border-t border-orange-200/60">
            <p className="text-xs text-gray-400 text-center">
              Data from{" "}
              <a
                href="https://news.ycombinator.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-600 hover:underline"
              >
                Hacker News
              </a>{" "}
              via the{" "}
              <a
                href="https://github.com/HackerNews/API"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-600 hover:underline"
              >
                official Firebase API
              </a>
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
