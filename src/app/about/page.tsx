import { Scale, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#4f46e5] text-white py-28 px-4 text-center overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6 text-sm text-blue-100">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Our Mission
          </div>
          <Scale className="w-14 h-14 mx-auto mb-6 text-amber-400" />
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">
            Democratizing Access{' '}
            <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">to Justice</span>
          </h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            Amiquz is bridging the gap between individuals seeking legal help and qualified attorneys. We believe finding a lawyer should be transparent, fast, and stress-free.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Why We Built Amiquz</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-amber-400 rounded-full mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center group">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Trust</h3>
            <p className="text-gray-600 leading-relaxed">
              Every lawyer on our platform goes through a strict verification process. You only connect with certified, highly-rated legal professionals.
            </p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Scale className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Transparent Pricing</h3>
            <p className="text-gray-600 leading-relaxed">
              No hidden fees. You see upfront consultation rates and book securely through our platform before you even step foot in an office.
            </p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-50 to-purple-100 border border-indigo-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Clock className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Speed</h3>
            <p className="text-gray-600 leading-relaxed">
              Don't know what kind of lawyer you need? Our AI intake assistant analyzes your problem and points you in the right direction in seconds.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#4f46e5] py-20 px-4 overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-extrabold text-white mb-3">Ready to find your legal partner?</h2>
          <p className="text-blue-200 mb-8">Join thousands of clients who found the right lawyer through Amiquz.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search" className="bg-gradient-to-r from-amber-400 to-yellow-400 text-gray-900 px-8 py-4 rounded-full font-bold hover:from-amber-300 hover:to-yellow-300 transition-all shadow-lg shadow-amber-500/30">
              Browse Lawyers
            </Link>
            <Link href="/intake" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all">
              Talk to AI Assistant
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
