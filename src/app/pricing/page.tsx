import Link from 'next/link';
import { CheckCircle2, Star } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#4f46e5] text-white py-20 px-4 text-center overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
        <div className="max-w-2xl mx-auto relative z-10">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">Transparent</span> Pricing
          </h1>
          <p className="text-lg text-blue-100">
            For Clients, Amiquz is completely free. For Lawyers, simple and predictable.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Client Box */}
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-200 relative overflow-hidden hover:shadow-lg transition-shadow">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-400" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">For Clients</h2>
            <p className="text-gray-500 mb-6">Find and connect with lawyers.</p>
            <div className="mb-8">
              <span className="text-6xl font-extrabold text-gray-900">$0</span>
              <span className="text-gray-500 font-medium"> / forever</span>
            </div>
            <ul className="space-y-4 mb-8">
              {['Free AI Legal Assistant', 'Unlimited Searches', 'Access to Authentic Reviews', 'Secure Booking Platform'].map(f => (
                <li key={f} className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 className="text-blue-500 w-5 h-5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="block w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30">
              Sign Up Free
            </Link>
          </div>

          {/* Lawyer Box */}
          <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#4f46e5] rounded-3xl p-10 shadow-xl overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-900 text-xs font-extrabold px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
              <Star className="w-3 h-3 fill-current" /> Popular
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">For Lawyers</h2>
            <p className="text-blue-200 mb-6">Grow your practice with qualified leads.</p>
            <div className="mb-8">
              <span className="text-6xl font-extrabold text-white">$199</span>
              <span className="text-blue-200 font-medium"> / month</span>
            </div>
            <ul className="space-y-4 mb-8">
              {['Premium Directory Listing', 'Placement in AI Recommendations', 'Direct Client Messaging', 'Secure Payment Processing (0% fees)'].map(f => (
                <li key={f} className="flex items-center gap-3 text-blue-50">
                  <CheckCircle2 className="text-amber-400 w-5 h-5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="block w-full text-center bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-900 font-bold py-3.5 rounded-full hover:from-amber-300 hover:to-yellow-300 transition-all shadow-lg shadow-amber-500/30">
              Apply to Join
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
