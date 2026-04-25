import Link from 'next/link';
import { Search, MapPin, Sparkles, Star, ShieldCheck, CheckCircle2, Scale, Clock, Users, Shield, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative bg-[#1e3a8a] text-white pt-24 pb-48 px-4 sm:px-6 lg:px-8 overflow-hidden">
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
              Help, <span className="text-blue-300">Faster Than Ever.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-blue-100 mb-8 max-w-xl leading-relaxed">
              Connect with verified lawyers for your personal or business legal needs. Transparent pricing, real reviews, instant booking — all in one place.
            </p>

            {/* Trust Row */}
            <div className="flex items-center gap-6 mb-12 text-sm font-medium text-blue-50">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-300" />
                10,000+ Verified Lawyers
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                4.8 Avg. Rating
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                Bar Verified
              </div>
            </div>

            {/* Search Bar Container */}
            <form action="/search" method="GET" className="bg-white p-2 rounded-full shadow-2xl flex flex-col sm:flex-row items-center gap-2 max-w-2xl">
              
              <div className="flex-1 flex items-center bg-transparent px-4 py-2">
                <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                <select name="q" className="w-full bg-transparent border-none outline-none text-gray-700 cursor-pointer appearance-none">
                  <option value="">All Practice Areas</option>
                  <option value="corporate">Corporate Law</option>
                  <option value="family">Family Law</option>
                  <option value="criminal">Criminal Defense</option>
                  <option value="ip">Intellectual Property</option>
                </select>
              </div>

              <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>

              <div className="flex-1 flex items-center bg-transparent px-4 py-2">
                <MapPin className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                <input 
                  type="text" 
                  name="loc"
                  placeholder="City or ZIP code" 
                  className="w-full bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
                />
              </div>

              <button type="submit" className="bg-[#2563eb] hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-bold transition-colors w-full sm:w-auto text-center">
                Find Lawyers
              </button>
            </form>

            {/* AI Assistant Link */}
            <div className="mt-6 text-sm text-blue-200 flex items-center gap-2">
              Not sure where to start? 
              <Link href="/intake" className="text-white font-bold flex items-center gap-1 hover:text-blue-300 transition-colors">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Try AI Legal Assistant <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Floating Profile Card */}
          <div className="hidden lg:flex justify-center relative">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 w-[500px] shadow-2xl">
              
              {/* Inner Card */}
              <div className="bg-white rounded-[24px] p-6 shadow-xl relative overflow-hidden">
                <div className="flex gap-4 mb-6 relative z-10">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-gray-900">Samantha Reeves</h3>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold">
                        <CheckCircle2 className="w-3 h-3" /> Bar Verified
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Corporate Attorney · NY Bar #2847391</p>
                    <div className="flex items-center gap-1 mt-2">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                      <span className="font-bold text-gray-900 ml-1 text-sm">4.9</span>
                      <span className="text-gray-400 text-sm ml-1">(218 reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Next Available Box */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100 inline-block">
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">Next Available</p>
                  <p className="text-sm font-semibold text-green-600">Today, 3:00 PM EST</p>
                </div>

                <div className="flex items-center justify-between mt-2 pt-6 border-t border-gray-100">
                  <button className="bg-[#2563eb] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
                    Book Consultation <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-medium">Consultation</p>
                    <p className="text-2xl font-black text-gray-900">$175</p>
                  </div>
                </div>
              </div>
            </div>
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
            <h4 className="text-xl font-bold text-gray-900">10,000+</h4>
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
            <h4 className="text-xl font-bold text-gray-900">85,000+</h4>
            <p className="text-sm text-gray-500 mt-1">Clients Served</p>
          </div>

        </div>
      </section>

      <div className="py-32"></div>

    </div>
  );
}
