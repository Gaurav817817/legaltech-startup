import Link from 'next/link';
import { Sparkles } from 'lucide-react';

const steps = [
  { n: '1', title: 'Tell us what\'s going on', desc: 'Use our AI Legal Assistant or standard search bar to describe your legal issue. You don\'t need to know complicated legal jargon.' },
  { n: '2', title: 'Get Matched with Top Lawyers', desc: 'Our algorithm instantly identifies the best-fit verified attorneys in your local area specializing in your exact case type.' },
  { n: '3', title: 'Review and Compare', desc: 'View detailed profiles, upfront consultation pricing, experience levels, and authentic reviews from past clients.' },
  { n: '4', title: 'Book Instantly', desc: 'Secure your consultation time immediately through our platform using our 256-bit encrypted checkout. No endless phone calls required.' },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#4f46e5] text-white py-20 px-4 text-center overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6 text-sm text-blue-100">
            <Sparkles className="w-4 h-4 text-amber-400" /> Simple 4-step process
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">
            How <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">Amiquz</span> Works
          </h1>
          <p className="text-lg text-blue-100">Finding the right legal help shouldn't be complicated. We've streamlined the entire process.</p>
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="space-y-8 relative">
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-amber-400 via-blue-400 to-indigo-400 hidden sm:block" />
          {steps.map((step) => (
            <div key={step.n} className="flex gap-6 relative group">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-full flex items-center justify-center shrink-0 text-gray-900 font-extrabold text-lg relative z-10 hidden sm:flex shadow-lg shadow-amber-400/30 group-hover:scale-110 transition-transform">
                {step.n}
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h2>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/search" className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-10 py-4 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/40">
            Start Finding Your Lawyer
          </Link>
        </div>
      </div>
    </div>
  );
}
