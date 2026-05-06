export default function Loading() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 animate-pulse"
        >
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-1.5 w-9 shrink-0 pt-1">
              <div className="w-4 h-4 bg-orange-100 rounded" />
              <div className="w-7 h-3 bg-orange-100 rounded" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex gap-2 items-start">
                <div
                  className="h-5 bg-gray-200 rounded-lg"
                  style={{ width: `${60 + ((i * 17) % 35)}%` }}
                />
              </div>
              <div className="flex gap-2">
                <div className="h-4 w-20 bg-orange-50 rounded-full" />
                <div className="h-4 w-16 bg-gray-100 rounded" />
                <div className="h-4 w-14 bg-gray-100 rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
