import { Search as SearchIcon, MapPin, Star, Filter } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string, loc?: string }> }) {
  const params = await searchParams;
  const query = params?.q || '';
  const loc = params?.loc || '';

  const supabase = await createClient();
  
  // Fetch real data from Supabase
  let { data: lawyers, error } = await supabase
    .from('lawyer_profiles')
    .select('*');
    
  if (error) {
    console.error("Error fetching lawyers:", error);
    lawyers = [];
  }

  // Basic in-memory filtering for MVP based on query and location
  if ((query || loc) && lawyers) {
    lawyers = lawyers.filter(l => {
      const matchesQuery = !query || 
        l.practice_areas?.some((area: string) => area.toLowerCase().includes(query.toLowerCase())) ||
        l.first_name?.toLowerCase().includes(query.toLowerCase()) ||
        l.last_name?.toLowerCase().includes(query.toLowerCase());
        
      const matchesLoc = !loc || l.location?.toLowerCase().includes(loc.toLowerCase());
      
      return matchesQuery && matchesLoc;
    });
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Header */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Find a Lawyer</h1>
            <p className="text-gray-600 mt-1">Showing results {query ? `for "${query}"` : 'in your area'}</p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" defaultValue={query} placeholder="Search practice area..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 w-full sm:w-64" />
            </div>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center justify-center hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" /> Filters
            </button>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Filters (Desktop) */}
          <div className="hidden md:block col-span-1">
            <div className="bg-white p-5 rounded-lg border border-gray-200 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Practice Area</h3>
              <div className="space-y-2 mb-6">
                {['Corporate Law', 'Family Law', 'Criminal Defense', 'Real Estate'].map(area => (
                  <label key={area} className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    <span className="ml-2 text-sm text-gray-600">{area}</span>
                  </label>
                ))}
              </div>

              <h3 className="font-semibold text-gray-900 mb-4">Location</h3>
              <div className="relative mb-6">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="text" placeholder="Zip code or city" className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md w-full" />
              </div>
            </div>
          </div>

          {/* Lawyer Cards */}
          <div className="col-span-1 md:col-span-3 space-y-4">
            {lawyers?.length === 0 ? (
               <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                 <p className="text-gray-500">No lawyers found matching your criteria.</p>
               </div>
            ) : lawyers?.map(lawyer => (
              <div key={lawyer.id} className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow">
                <img src={lawyer.image_url} alt={lawyer.first_name} className="w-24 h-24 rounded-full object-cover shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{lawyer.first_name} {lawyer.last_name}</h2>
                      <p className="text-gray-600 font-medium text-sm mt-1">{lawyer.practice_areas?.join(' • ')}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 font-bold text-gray-900">{lawyer.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">{lawyer.reviews} Reviews</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 mr-1" /> {lawyer.location}
                  </div>
                  <p className="mt-3 text-gray-600 text-sm line-clamp-2">
                    {lawyer.about}
                  </p>
                  <div className="mt-4 flex gap-3">
                    <Link href={`/lawyers/${lawyer.id}`} className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors">
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
