import type { Metadata } from "next";
import BookmarksView from "@/components/BookmarksView";

export const metadata: Metadata = { title: "Bookmarks" };

export default function BookmarksPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <BookmarksView />
    </div>
  );
}
