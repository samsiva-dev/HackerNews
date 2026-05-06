import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-4 py-12 text-center">
      <h2 className="text-lg font-semibold mb-2">Not Found</h2>
      <p className="text-sm text-[#828282] mb-4">
        This item or user doesn&apos;t exist.
      </p>
      <Link href="/" className="text-sm text-[#ff6600] hover:underline">
        ← Back to top stories
      </Link>
    </div>
  );
}
