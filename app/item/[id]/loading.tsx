const bar = "rounded bg-stone-200 dark:bg-gray-800";

export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse" aria-busy="true" aria-label="Loading">
      <div className="border-y border-stone-300 dark:border-gray-700 py-2 mb-8">
        <div className={`${bar} h-2.5 w-24`} />
      </div>
      <div className="space-y-3 mb-6">
        <div className={`${bar} h-10 w-11/12`} />
        <div className={`${bar} h-10 w-2/3`} />
        <div className={`${bar} h-4 w-full mt-5`} />
        <div className={`${bar} h-4 w-4/5`} />
      </div>
      <div className="border-y border-stone-300 dark:border-gray-700 py-4 mb-8">
        <div className={`${bar} h-3 w-48`} />
      </div>
      <div className="border-t-4 border-double border-stone-300 dark:border-gray-700 pt-3 mb-4">
        <div className={`${bar} h-7 w-56`} />
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border-t border-stone-300 dark:border-gray-700 py-5 space-y-2">
          <div className={`${bar} h-2.5 w-24`} />
          <div className={`${bar} h-3 w-full`} />
          <div className={`${bar} h-3 w-5/6`} />
        </div>
      ))}
    </div>
  );
}
