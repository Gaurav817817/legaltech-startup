import { Search as SearchIcon, MapPin, Star, Filter, UserX } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { unstable_cache } from 'next/cache';
import { createClient as createRawClient } from '@supabase/supabase-js';

const PRACTICE_AREAS = ['Corporate Law', 'Family Law', 'Criminal Defense', 'Intellectual Property', 'Real Estate', 'Employment Law', 'Tax Law', 'Immigration', 'Startups & Tech', 'Divorce']

const fetchLawyers = unstable_cache(
  async (query: string, loc: string) => {
    const supabase = createRawClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    let queryBuilder = supabase
      .from('lawyer_profiles')
      .select('id, first_name, last_name, title, image_url, rating, reviews, practice_areas, location, about, consultation_fee')
      .eq('approved', true)
      .order('rating', { ascending: false });

    if (loc) queryBuilder = queryBuilder.ilike('location', `%${loc}%`);
    if (query) queryBuilder = queryBuilder.or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,practice_areas.cs.{"${query}"}`);

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error fetching lawyers:', error);
      return [];
    }

    let lawyers = data ?? [];

    // Residual JS filter: catches substring-on-array cases DB misses (e.g. "corp" → "Corporate Law")
    if (query) {
      const lq = query.toLowerCase();
      lawyers = lawyers.filter((l: any) =>
        l.first_name?.toLowerCase().includes(lq) ||
        l.last_name?.toLowerCase().includes(lq) ||
        l.practice_areas?.some((a: string) => a.toLowerCase().includes(lq))
      );
    }

    return lawyers;
  },
  ['lawyers-search'],
  { revalidate: 60 }
);

// Streams in after data resolves — contains the count + all cards
async function SearchResults({ query, loc }: { query: string; loc: string }) {
  const lawyers = await fetchLawyers(query, loc);

  return (
    <div className="col-span-1 md:col-span-3 space-y-4">
      <p className="text-sm text-gray-500 mb-2">
        {lawyers?.length === 0 ? 'No lawyers found' : `${lawyers?.length} lawyer${lawyers?.length === 1 ? '' : 's'} available`}
        {query ? ` for "${query}"` : ''}
        {loc ? ` in ${loc}` : ''}
      </p>

      {lawyers?.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <UserX className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No lawyers found matching your search.</p>
          <p className="text-sm text-gray-400 mt-1">Try a different practice area or location.</p>
          <Link href="/search" className="mt-4 inline-block text-blue-600 text-sm hover:underline">Clear search</Link>
        </div>
      ) : lawyers?.map((lawyer: any) => (
        <div key={lawyer.id} className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow">
          {lawyer.image_url ? (
            <Image src={lawyer.image_url} alt={lawyer.first_name ?? 'Lawyer photo'} width={96} height={96} className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover shrink-0 mx-auto sm:mx-0" />
          ) : (
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
              <span className="text-2xl font-bold text-blue-600">
                {lawyer.first_name?.[0]}{lawyer.last_name?.[0]}
              </span>
            </div>
          )}

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900">{lawyer.first_name} {lawyer.last_name}</h2>
                {lawyer.title && <p className="text-gray-500 text-sm">{lawyer.title}</p>}
              </div>
              {lawyer.rating > 0 && (
                <div className="flex items-center justify-center sm:justify-end gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-gray-900 text-sm">{lawyer.rating}</span>
                  {lawyer.reviews > 0 && <span className="text-gray-400 text-xs">({lawyer.reviews})</span>}
                </div>
              )}
            </div>

            <div className="mt-2 flex flex-wrap gap-1.5 justify-center sm:justify-start">
              {lawyer.practice_areas?.slice(0, 3).map((area: string) => (
                <span key={area} className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  {area}
                </span>
              ))}
            </div>

            <div className="mt-2 flex items-center justify-center sm:justify-start gap-1 text-gray-400 text-sm">
              <MapPin className="w-3.5 h-3.5" /> {lawyer.location || 'Location not set'}
            </div>

            {lawyer.about && (
              <p className="mt-2 text-gray-500 text-sm line-clamp-2">{lawyer.about}</p>
            )}

            <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
              {lawyer.consultation_fee && (
                <span className="text-blue-700 font-semibold text-sm">{lawyer.consultation_fee}</span>
              )}
              <Link
                href={`/lawyers/${lawyer.id}`}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/30 text-center"
              >
                View Profile & Book
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Shown while SearchResults is fetching — same col-span so grid stays intact
function CardsSkeleton() {
  return (
    <div className="col-span-1 md:col-span-3 space-y-4 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 flex gap-4">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-3 pt-1">
            <div className="flex justify-between">
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
            <div className="h-9 bg-gray-200 rounded-full w-40 mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string, loc?: string }> }) {
  const params = await searchParams;
  const query = params?.q || '';
  const loc = params?.loc || '';

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header — static, streams to browser immediately */}
      <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#4f46e5] text-white py-12 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl font-extrabold mb-2">Find a <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">Lawyer</span></h1>
          <p className="text-blue-200 text-sm">
            {query ? `Searching for "${query}"` : 'Browse all verified lawyers'}
            {loc ? ` in ${loc}` : ''}
          </p>
        </div>
      </div>

      <div className="py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Mobile search — static, streams immediately */}
          <div className="mb-6 flex flex-col gap-3">
            <form action="/search" method="GET" className="flex flex-col gap-2 md:hidden">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="q"
                  defaultValue={query}
                  placeholder="Practice area or name..."
                  className="pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg w-full text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="loc"
                  defaultValue={loc}
                  placeholder="City e.g. Bengaluru"
                  className="pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg w-full text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
              <button type="submit" className="bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold w-full">
                Search
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {/* Sidebar — static, streams immediately */}
            <div className="hidden md:block col-span-1">
              <form action="/search" method="GET" className="bg-white p-5 rounded-xl border border-gray-200 sticky top-24">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-500" /> Filters
                </h3>

                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4">Practice Area</h4>
                <div className="space-y-1.5 mb-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="q" value="" defaultChecked={!query} className="text-blue-600" />
                    <span className="text-sm text-gray-600">All Areas</span>
                  </label>
                  {PRACTICE_AREAS.map(area => (
                    <label key={area} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="q" value={area} defaultChecked={query === area} className="text-blue-600" />
                      <span className="text-sm text-gray-600">{area}</span>
                    </label>
                  ))}
                </div>

                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">City / Location</h4>
                <div className="relative mb-5">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="loc"
                    defaultValue={loc}
                    placeholder="e.g. Bengaluru"
                    className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Apply Filters
                </button>
                {(query || loc) && (
                  <Link href="/search" className="block text-center text-xs text-gray-400 hover:text-gray-600 mt-3">
                    Clear filters
                  </Link>
                )}
              </form>
            </div>

            {/* Cards — streams in once Supabase responds */}
            <Suspense fallback={<CardsSkeleton />}>
              <SearchResults query={query} loc={loc} />
            </Suspense>

          </div>
        </div>
      </div>
    </div>
  );
}
