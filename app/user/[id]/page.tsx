import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUser, timeAgo } from "@/lib/api";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `${id} | HN Mirror` };
}

export default async function UserPage({ params }: Props) {
  const { id } = await params;
  const user = await getUser(id);

  if (!user) notFound();

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "user", value: <strong>{user.id}</strong> },
    {
      label: "created",
      value: (
        <>
          {timeAgo(user.created)}{" "}
          <span className="text-[#828282]">
            ({new Date(user.created * 1000).toLocaleDateString()})
          </span>
        </>
      ),
    },
    {
      label: "karma",
      value: user.karma.toLocaleString(),
    },
  ];

  return (
    <div className="px-4 py-6 max-w-xl">
      <table className="text-sm w-full">
        <tbody>
          {rows.map(({ label, value }) => (
            <tr key={label} className="align-top">
              <td className="text-[#828282] pr-4 py-1.5 w-20 shrink-0">{label}:</td>
              <td className="py-1.5">{value}</td>
            </tr>
          ))}
          {user.about && (
            <tr className="align-top">
              <td className="text-[#828282] pr-4 py-1.5 w-20 shrink-0">about:</td>
              <td className="py-1.5">
                <div
                  className="comment-body text-sm"
                  dangerouslySetInnerHTML={{ __html: user.about }}
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-6 flex gap-4 text-xs">
        <a
          href={`https://news.ycombinator.com/submitted?id=${user.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#ff6600] hover:underline"
        >
          submissions →
        </a>
        <a
          href={`https://news.ycombinator.com/threads?id=${user.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#ff6600] hover:underline"
        >
          comments →
        </a>
      </div>
    </div>
  );
}
