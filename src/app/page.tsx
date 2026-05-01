import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Search, MapPin, Sparkles, Star, ShieldCheck, CheckCircle2, Scale, Clock, Users, Shield, ArrowRight } from 'lucide-react';

const HeroChatWidget = dynamic(() => import('@/components/chat/HeroChatWidget'), {
  ssr: false,
  loading: () => (
    <div
      className="bg-white rounded-[28px] shadow-2xl w-full lg:w-[400px]"
      style={{ height: '500px' }}
    />
  ),
});

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#4f46e5] text-white pt-24 pb-48 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left Column: Text & Search */}
          <div>
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8 text-sm text-blue-100">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              AI-Powered Legal Matching — Find your lawyer in minutes
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Find Trusted Legal <br />
              Help, <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">Faster Than Ever.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-blue-100 mb-8 max-w-xl leading-relaxed">
              Connect with verified lawyers for your personal or business legal needs. Transparent pricing, real reviews, instant booking — all in one place.
            </p>

            {/* Trust Row */}
            <div className="flex items-center gap-6 mb-12 text-sm font-medium text-blue-50">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-300" />
                Early Access — Join Now
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                AI-Powered Matching
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                Bar Verified
              </div>
            </div>

            {/* Search Bar Container */}
            {/* Desktop: single pill row. Mobile: clean card with stacked fields */}
            <div className="max-w-2xl w-full">
              
              {/* Desktop pill */}
              <form action="/search" method="GET" className="hidden sm:flex bg-white p-2 rounded-full shadow-2xl items-center gap-2">
                <div className="flex-1 flex items-center bg-transparent px-4 py-2">
                  <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <select name="q" className="w-full bg-transparent border-none outline-none text-gray-700 cursor-pointer appearance-none">
                    <option value="">All Practice Areas</option>
                    <option value="Corporate Law">Corporate Law</option>
                    <option value="Family Law">Family Law</option>
                    <option value="Criminal Defense">Criminal Defense</option>
                    <option value="Intellectual Property">Intellectual Property</option>
                  </select>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="flex-1 flex items-center bg-transparent px-4 py-2">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    name="loc"
                    placeholder="City or ZIP code"
                    className="w-full bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
                  />
                </div>
                <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3.5 rounded-full font-bold transition-all shadow-lg shadow-blue-500/40">
                  Find Lawyers
                </button>
              </form>

              {/* Mobile card */}
              <form action="/search" method="GET" className="sm:hidden bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center px-4 py-3.5 border-b border-gray-100">
                  <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <select name="q" className="w-full bg-transparent border-none outline-none text-gray-700 text-sm">
                    <option value="">All Practice Areas</option>
                    <option value="Corporate Law">Corporate Law</option>
                    <option value="Family Law">Family Law</option>
                    <option value="Criminal Defense">Criminal Defense</option>
                    <option value="Intellectual Property">Intellectual Property</option>
                  </select>
                </div>
                <div className="flex items-center px-4 py-3.5">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    name="loc"
                    placeholder="City e.g. Bengaluru"
                    className="w-full bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 text-sm"
                  />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 font-bold transition-all text-sm shadow-lg shadow-blue-500/30">
                  Find Lawyers
                </button>
              </form>

            </div>

            {/* AI Assistant Link */}
            <div className="mt-6 text-sm text-blue-200 flex items-center gap-2">
              Not sure where to start? 
              <Link href="/intake" className="text-white font-bold flex items-center gap-1 hover:text-blue-300 transition-colors">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Try AI Legal Assistant <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Desktop only — widget textarea causes iOS scroll-to-focus on mobile */}
          <div className="hidden lg:flex justify-center relative w-full z-20">
            <HeroChatWidget />
          </div>

          {/* Mobile CTA card — replaces widget to avoid the scroll bug */}
          <div className="lg:hidden mt-2">
            <Link href="/intake" className="block">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-900/40">
                  <Scale className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-white font-extrabold text-xl mb-2 leading-tight">
                  Talk to our AI.<br/>Get the right lawyer.
                </h3>
                <p className="text-blue-200 text-sm mb-5 leading-relaxed">
                  Describe your situation in plain English — our AI finds the right verified lawyer for you in minutes.
                </p>
                <div className="bg-white text-blue-900 rounded-xl py-3.5 px-6 font-bold flex items-center justify-center gap-2 shadow-lg">
                  Start Free AI Consultation <ArrowRight className="w-4 h-4" />
                </div>
                <p className="text-blue-300 text-xs mt-3 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Confidential · Free · No sign-up needed
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Wavy Bottom Separator */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-[120px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,120.22,192,108.41,234.39,100.2,277.6,83.08,321.39,56.44Z" className="fill-white"></path>
          </svg>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-white py-12 px-4 border-b border-gray-100 relative z-20 -mt-16">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">Early Access</h4>
            <p className="text-sm text-gray-500 mt-1">Verified Lawyers</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-orange-500" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">4.8 / 5</h4>
            <p className="text-sm text-gray-500 mt-1">Average Rating</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">256-bit</h4>
            <p className="text-sm text-gray-500 mt-1">Secure Payments</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-4">
              <Scale className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">50+</h4>
            <p className="text-sm text-gray-500 mt-1">Practice Areas</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">&lt; 2 hrs</h4>
            <p className="text-sm text-gray-500 mt-1">Avg. Response Time</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-red-500" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">Growing Fast</h4>
            <p className="text-sm text-gray-500 mt-1">Clients Served</p>
          </div>

        </div>
      </section>

      <div className="py-32"></div>

    </div>
  );
}
