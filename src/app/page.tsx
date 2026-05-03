import Link from 'next/link';
import { Search, MapPin, Sparkles, Star, ShieldCheck, CheckCircle2, Scale, Clock, Users, ArrowRight, MessageSquare, CalendarCheck, BadgeCheck } from 'lucide-react';
import HeroChatWidget from '@/components/chat/DynamicChatWidget';
import LegalTicker from '@/components/LegalTicker';

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

      {/* Legal Pulse Ticker */}
      <LegalTicker />

      {/* How It Works */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Get legal help in 3 steps</h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto">No jargon, no waiting rooms. Describe your situation, meet the right lawyer, get real advice — all online.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line — desktop only */}
            <div className="hidden md:block absolute top-10 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-200 z-0" />

            {[
              {
                step: '01',
                icon: <MessageSquare className="w-6 h-6 text-blue-600" />,
                bg: 'bg-blue-50',
                title: 'Describe your issue',
                desc: 'Type your legal problem in plain language or use our AI assistant to figure out what kind of help you need.',
              },
              {
                step: '02',
                icon: <BadgeCheck className="w-6 h-6 text-indigo-600" />,
                bg: 'bg-indigo-50',
                title: 'Get matched instantly',
                desc: 'Our AI surfaces verified lawyers who specialise in exactly your issue, sorted by rating and availability.',
              },
              {
                step: '03',
                icon: <CalendarCheck className="w-6 h-6 text-green-600" />,
                bg: 'bg-green-50',
                title: 'Book & consult',
                desc: 'Pick a slot, pay securely, and meet your lawyer over video or phone — often within 24 hours.',
              },
            ].map(({ step, icon, bg, title, desc }) => (
              <div key={step} className="relative z-10 flex flex-col items-center text-center px-4">
                <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mb-5 shadow-sm`}>
                  {icon}
                </div>
                <span className="text-xs font-bold text-gray-300 tracking-widest mb-2">STEP {step}</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Link
              href="/intake"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-blue-500/30 transition-all"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              Start with AI Assistant
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Practice Areas */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">Expertise on demand</p>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Browse by practice area</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { label: 'Family Law', emoji: '👨‍👩‍👧', q: 'Family Law' },
              { label: 'Criminal Defense', emoji: '⚖️', q: 'Criminal Defense' },
              { label: 'Corporate Law', emoji: '🏢', q: 'Corporate Law' },
              { label: 'Real Estate', emoji: '🏠', q: 'Real Estate' },
              { label: 'Employment Law', emoji: '💼', q: 'Employment Law' },
              { label: 'Intellectual Property', emoji: '💡', q: 'Intellectual Property' },
              { label: 'Immigration', emoji: '🌏', q: 'Immigration' },
              { label: 'Tax Law', emoji: '📊', q: 'Tax Law' },
              { label: 'Startups & Tech', emoji: '🚀', q: 'Startups & Tech' },
              { label: 'Divorce', emoji: '📋', q: 'Divorce' },
              { label: 'Banking & Finance', emoji: '🏦', q: 'Banking & Finance' },
              { label: 'Consumer Rights', emoji: '🛡️', q: 'Consumer Rights' },
            ].map(({ label, emoji, q }) => (
              <Link
                key={label}
                href={`/search?q=${encodeURIComponent(q)}`}
                className="group bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md rounded-xl p-4 flex items-center gap-3 transition-all"
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">{label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-400 ml-auto transition-colors" />
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/search" className="text-blue-600 font-semibold text-sm hover:underline inline-flex items-center gap-1">
              View all practice areas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Lawyer CTA */}
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#312e81] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6 text-sm text-blue-200">
            <BadgeCheck className="w-4 h-4 text-green-400" />
            For Legal Professionals
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-5">
            Grow your practice with Amiquz
          </h2>
          <p className="text-blue-200 text-lg mb-8 leading-relaxed">
            Join verified lawyers already on the platform. Get discovered by clients actively searching for your expertise — no cold calls, no referral fees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup?role=lawyer"
              className="bg-amber-400 hover:bg-amber-300 text-gray-900 px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-amber-400/20 inline-flex items-center justify-center gap-2"
            >
              Join as a Lawyer <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/for-lawyers"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-semibold transition-all inline-flex items-center justify-center gap-2"
            >
              Learn More
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-300">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Free to list</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Bar verification included</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Set your own fees</span>
          </div>
        </div>
      </section>

    </div>
  );
}
