import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUser } from "@/lib/api";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `${id}'s profile` };
}

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function accountAge(ts: number) {
  const days = Math.floor((Date.now() / 1000 - ts) / 86400);
  if (days < 30) return `${days}d`;
  if (days < 365) return `${Math.floor(days / 30)}mo`;
  const y = Math.floor(days / 365);
  const mo = Math.floor((days % 365) / 30);
  return mo > 0 ? `${y}y ${mo}mo` : `${y}y`;
}

export default async function UserPage({ params }: Props) {
  const { id } = await params;
  const user = await getUser(id);
  if (!user) notFound();

  const initials = user.id.slice(0, 2).toUpperCase();

  return (
    <div className="max-w-lg">
      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <div className="flex items-start gap-4 mb-5">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm">
            {initials}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{user.id}</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Member since {formatDate(user.created)}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
            <div className="text-2xl font-bold text-[#ff6600] tabular-nums">
              {user.karma >= 1000
                ? `${(user.karma / 1000).toFixed(1)}k`
                : user.karma.toLocaleString()}
            </div>
            <div className="text-xs text-orange-600/70 font-medium mt-0.5">Karma</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <div className="text-2xl font-bold text-gray-700">{accountAge(user.created)}</div>
            <div className="text-xs text-gray-400 font-medium mt-0.5">Account age</div>
          </div>
        </div>

        {/* About */}
        {user.about && (
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">About</h2>
            <div
              className="comment-body text-sm text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: user.about }}
            />
          </div>
        )}
      </div>

      {/* Links */}
      <div className="flex gap-3">
        <a
          href={`https://news.ycombinator.com/submitted?id=${user.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-[#ff6600] bg-white hover:bg-orange-50 border border-orange-100 hover:border-orange-200 rounded-xl py-2.5 transition-colors"
        >
          Submissions ↗
        </a>
        <a
          href={`https://news.ycombinator.com/threads?id=${user.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-gray-600 bg-white hover:bg-gray-50 border border-gray-100 hover:border-gray-200 rounded-xl py-2.5 transition-colors"
        >
          Comments ↗
        </a>
      </div>
    </div>
  );
}
