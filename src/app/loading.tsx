export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f7f9fc] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="rounded-[28px] border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="skeleton-shimmer h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <div className="skeleton-shimmer h-4 w-28 rounded-full" />
                <div className="skeleton-shimmer h-3 w-20 rounded-full" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="skeleton-shimmer hidden h-10 w-24 rounded-full sm:block" />
              <div className="skeleton-shimmer h-10 w-10 rounded-full" />
            </div>
          </div>

          <div className="mb-6 space-y-3">
            <div className="skeleton-shimmer h-5 w-36 rounded-full" />
            <div className="skeleton-shimmer h-4 w-72 rounded-full" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="skeleton-shimmer mb-4 h-32 rounded-2xl" />
                <div className="skeleton-shimmer mb-3 h-4 w-24 rounded-full" />
                <div className="mb-2 space-y-2">
                  <div className="skeleton-shimmer h-3 w-full rounded-full" />
                  <div className="skeleton-shimmer h-3 w-4/5 rounded-full" />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="skeleton-shimmer h-4 w-16 rounded-full" />
                  <div className="skeleton-shimmer h-9 w-24 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
