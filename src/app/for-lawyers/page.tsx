import Link from 'next/link';
import { Briefcase, Users, TrendingUp } from 'lucide-react';

export default function ForLawyersPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Grow Your Practice with Amiquz</h1>
          <p className="text-lg text-gray-600">
            Connect directly with high-intent clients actively seeking legal representation in your area of expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Targeted Leads</h3>
            <p className="text-gray-600 text-sm">Our AI intake engine pre-qualifies clients before they ever reach your inbox, ensuring you only spend time on relevant cases.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">High Visibility</h3>
            <p className="text-gray-600 text-sm">Get featured prominently when our AI recommends lawyers to clients based on your specific practice areas and location.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Seamless Booking</h3>
            <p className="text-gray-600 text-sm">Sync your calendar and let clients book initial consultations directly through your Amiquz profile.</p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/signup" className="bg-blue-600 text-white font-bold px-10 py-4 rounded-full hover:bg-blue-700 transition-colors inline-block shadow-lg">
            Apply to Join the Network
          </Link>
        </div>

      </div>
    </div>
  );
}
