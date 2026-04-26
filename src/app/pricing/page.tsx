import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Transparent Pricing</h1>
          <p className="text-lg text-gray-600">
            For Clients, LexConnect is completely free to use. For Lawyers, we offer simple, predictable subscription tiers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Client Box */}
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-200 relative overflow-hidden">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">For Clients</h2>
            <p className="text-gray-500 mb-6">Find and connect with lawyers.</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold text-gray-900">$0</span>
              <span className="text-gray-500 font-medium"> / forever</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-gray-700"><CheckCircle2 className="text-blue-500 w-5 h-5 shrink-0" /> Free AI Legal Assistant</li>
              <li className="flex items-center gap-3 text-gray-700"><CheckCircle2 className="text-blue-500 w-5 h-5 shrink-0" /> Unlimited Searches</li>
              <li className="flex items-center gap-3 text-gray-700"><CheckCircle2 className="text-blue-500 w-5 h-5 shrink-0" /> Access to Authentic Reviews</li>
              <li className="flex items-center gap-3 text-gray-700"><CheckCircle2 className="text-blue-500 w-5 h-5 shrink-0" /> Secure Booking Platform</li>
            </ul>
            <Link href="/signup" className="block w-full text-center bg-blue-50 text-blue-700 font-bold py-3 rounded-xl hover:bg-blue-100 transition-colors">
              Sign Up Free
            </Link>
          </div>

          {/* Lawyer Box */}
          <div className="bg-blue-900 rounded-3xl p-10 shadow-xl border border-blue-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wide">Popular</div>
            <h2 className="text-2xl font-bold text-white mb-2">For Lawyers</h2>
            <p className="text-blue-200 mb-6">Grow your practice with qualified leads.</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold text-white">$199</span>
              <span className="text-blue-200 font-medium"> / month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-blue-50"><CheckCircle2 className="text-blue-400 w-5 h-5 shrink-0" /> Premium Directory Listing</li>
              <li className="flex items-center gap-3 text-blue-50"><CheckCircle2 className="text-blue-400 w-5 h-5 shrink-0" /> Placement in AI Recommendations</li>
              <li className="flex items-center gap-3 text-blue-50"><CheckCircle2 className="text-blue-400 w-5 h-5 shrink-0" /> Direct Client Messaging</li>
              <li className="flex items-center gap-3 text-blue-50"><CheckCircle2 className="text-blue-400 w-5 h-5 shrink-0" /> Secure Payment Processing (0% fees)</li>
            </ul>
            <Link href="/signup" className="block w-full text-center bg-white text-blue-900 font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors">
              Apply to Join
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
