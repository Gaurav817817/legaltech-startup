export default function SearchLoading() {
  return (
    <div className="bg-gray-50 min-h-screen animate-pulse">
      {/* Header skeleton — matches the dark gradient header */}
      <div className="bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#4f46e5] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 bg-white/10 rounded-lg w-48 mb-3" />
          <div className="h-4 bg-white/10 rounded w-36" />
        </div>
      </div>

      <div className="py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar skeleton — desktop only */}
            <div className="hidden md:block col-span-1">
              <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-24 mb-5" />
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-3 bg-gray-100 rounded w-full" />
                ))}
                <div className="h-8 bg-gray-200 rounded-lg mt-4" />
              </div>
            </div>

            {/* Cards skeleton */}
            <div className="col-span-1 md:col-span-3 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 flex flex-col sm:flex-row gap-4">
                  {/* Avatar */}
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200 shrink-0 mx-auto sm:mx-0" />
                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-2 flex-1">
                        <div className="h-5 bg-gray-200 rounded w-2/5" />
                        <div className="h-3 bg-gray-100 rounded w-1/3" />
                      </div>
                      <div className="h-4 bg-gray-100 rounded w-16" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-blue-50 rounded-full w-24" />
                      <div className="h-6 bg-blue-50 rounded-full w-20" />
                      <div className="h-6 bg-blue-50 rounded-full w-16" />
                    </div>
                    <div className="h-3 bg-gray-100 rounded w-32" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-5/6" />
                    <div className="flex items-center gap-3 pt-1">
                      <div className="h-4 bg-gray-200 rounded w-20" />
                      <div className="h-9 bg-gray-200 rounded-full w-40" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
