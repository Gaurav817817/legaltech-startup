import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">How Amiquz Works</h1>
        <p className="text-lg text-gray-600 mb-12">
          Finding the right legal help shouldn't be complicated. We've streamlined the entire process so you can focus on what matters.
        </p>

        <div className="space-y-12 relative">
          {/* Vertical Line */}
          <div className="absolute left-6 top-6 bottom-6 w-1 bg-blue-100 hidden sm:block"></div>

          <div className="flex gap-6 relative">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xl relative z-10 hidden sm:flex">1</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Tell us what's going on</h2>
              <p className="text-gray-600 leading-relaxed">
                Use our AI Legal Assistant or standard search bar to describe your legal issue. You don't need to know complicated legal jargon.
              </p>
            </div>
          </div>

          <div className="flex gap-6 relative">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xl relative z-10 hidden sm:flex">2</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Get Matched with Top Lawyers</h2>
              <p className="text-gray-600 leading-relaxed">
                Our algorithm instantly identifies the best-fit verified attorneys in your local area specializing in your exact case type.
              </p>
            </div>
          </div>

          <div className="flex gap-6 relative">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xl relative z-10 hidden sm:flex">3</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Review and Compare</h2>
              <p className="text-gray-600 leading-relaxed">
                View detailed profiles, upfront consultation pricing, experience levels, and authentic reviews from past clients.
              </p>
            </div>
          </div>

          <div className="flex gap-6 relative">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xl relative z-10 hidden sm:flex">4</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Book Instantly</h2>
              <p className="text-gray-600 leading-relaxed">
                Secure your consultation time immediately through our platform using our 256-bit encrypted checkout. No endless phone calls required.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link href="/search" className="bg-blue-600 text-white font-bold px-8 py-4 rounded-full hover:bg-blue-700 transition-colors inline-block">
            Start Finding Your Lawyer
          </Link>
        </div>
      </div>
    </div>
  );
}
