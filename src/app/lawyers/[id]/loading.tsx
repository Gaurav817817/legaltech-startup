export default function LawyerLoading() {
  return (
    <div className="bg-gray-50 min-h-screen animate-pulse">
      {/* Hero skeleton — matches the dark gradient hero */}
      <div className="bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#312e81]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 pb-8">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-white/10 shrink-0" />
            {/* Name + meta */}
            <div className="flex-1 space-y-3 pb-1">
              <div className="h-8 bg-white/10 rounded-lg w-56" />
              <div className="h-4 bg-white/10 rounded w-40" />
              <div className="flex gap-4 mt-2">
                <div className="h-3 bg-white/10 rounded w-28" />
                <div className="h-3 bg-white/10 rounded w-24" />
              </div>
            </div>
          </div>
          {/* Stats strip */}
          <div className="border-t border-white/10 grid grid-cols-3 divide-x divide-white/10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-4 py-4 text-center space-y-2">
                <div className="h-6 bg-white/10 rounded w-12 mx-auto" />
                <div className="h-3 bg-white/10 rounded w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            {/* About card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-36 mb-4" />
              <div className="h-3 bg-gray-100 rounded" />
              <div className="h-3 bg-gray-100 rounded w-11/12" />
              <div className="h-3 bg-gray-100 rounded w-4/5" />
              <div className="h-3 bg-gray-100 rounded w-10/12" />
            </div>

            {/* Expertise card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
              <div className="h-5 bg-gray-200 rounded w-24 mb-4" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-7 bg-amber-50 border border-amber-100 rounded-full w-28" />
                ))}
              </div>
            </div>

            {/* Fees card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
              <div className="h-5 bg-gray-200 rounded w-32 mb-5" />
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-2 text-center">
                    <div className="h-3 bg-gray-100 rounded w-16 mx-auto" />
                    <div className="h-6 bg-gray-200 rounded w-20 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Booking widget */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
              <div className="h-5 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
              <div className="h-10 bg-gray-200 rounded-xl mt-2" />
              <div className="h-10 bg-gray-100 rounded-xl" />
            </div>
            {/* Enquiry form */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-10 bg-gray-100 rounded-xl" />
              <div className="h-20 bg-gray-100 rounded-xl" />
              <div className="h-10 bg-gray-200 rounded-xl" />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
