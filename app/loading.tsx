const bar = "rounded bg-stone-200 dark:bg-gray-800";

export default function Loading() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading">
      {/* Masthead */}
      <div className="border-y border-stone-300 dark:border-gray-700 py-2 mb-4">
        <div className={`${bar} h-2.5 w-1/3 mx-auto`} />
      </div>
      <div className={`${bar} h-14 sm:h-16 w-2/3 sm:w-1/2 mx-auto mb-4`} />
      <div className="border-t-4 border-double border-stone-300 dark:border-gray-700 mb-6" />

      {/* Lead + secondary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 border-b-2 border-stone-300 dark:border-gray-700 pb-6 mb-6">
        <div className="lg:col-span-2 space-y-3">
          <div className={`${bar} h-9 w-11/12`} />
          <div className={`${bar} h-9 w-3/4`} />
          <div className={`${bar} h-3 w-full mt-4`} />
          <div className={`${bar} h-3 w-full`} />
          <div className={`${bar} h-3 w-2/3`} />
        </div>
        <div className="space-y-6 mt-6 lg:mt-0">
          {[0, 1].map((i) => (
            <div key={i} className="space-y-2">
              <div className={`${bar} h-6 w-5/6`} />
              <div className={`${bar} h-3 w-full`} />
              <div className={`${bar} h-3 w-3/4`} />
            </div>
          ))}
        </div>
      </div>

      {/* Columns */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="break-inside-avoid space-y-2 pb-6">
            <div className={`${bar} h-5`} style={{ width: `${65 + ((i * 17) % 30)}%` }} />
            <div className={`${bar} h-2.5 w-full`} />
            <div className={`${bar} h-2.5 w-4/5`} />
          </div>
        ))}
      </div>
    </div>
  );
}
