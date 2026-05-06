export default function Loading() {
  return (
    <div className="px-4 py-6">
      <div className="space-y-3">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="flex gap-2 animate-pulse">
            <div className="w-6 h-4 bg-gray-200 rounded shrink-0 mt-1" />
            <div className="w-3 h-4 bg-gray-200 rounded shrink-0 mt-1" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
