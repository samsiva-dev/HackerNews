import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { BookmarkProvider } from "@/contexts/BookmarkContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { VisitedProvider } from "@/contexts/VisitedContext";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Hacker News",
    template: "%s | HN",
  },
  description: "A modern Hacker News reader powered by the official HN API.",
};

// Inline script to apply theme before first paint (prevents flash of unstyled content)
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('hn-theme') || 'system';
    var dark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
  } catch(e){}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-[#f5f3ef] dark:bg-gray-950 font-[family-name:var(--font-inter)] antialiased transition-colors duration-200">
        <ThemeProvider>
          <BookmarkProvider>
            <VisitedProvider>
              <div className="min-h-screen flex flex-col">
                <Navigation />
                <main className="flex-1 w-full max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
                  {children}
                </main>
                <footer className="w-full max-w-3xl mx-auto px-4 py-5 mt-2 border-t border-orange-200/60 dark:border-gray-800">
                  <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
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
                    </a> {" · "}
                    <span className="text-gray-400 dark:text-gray-500">Built by Samba Siva</span>
                  </p>
                </footer>
              </div>
              <KeyboardShortcuts />
            </VisitedProvider>
          </BookmarkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
