import { Scale, ShieldCheck, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-primary-900 text-white py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <Scale className="w-16 h-16 mx-auto mb-6 text-primary-200" />
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">Democratizing Access to Justice</h1>
          <p className="text-xl text-primary-100 leading-relaxed">
            LegalLink is bridging the gap between individuals seeking legal help and qualified attorneys. We believe finding a lawyer should be transparent, fast, and stress-free.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-24 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Why We Built LegalLink</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-primary-50 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Trust</h3>
            <p className="text-gray-600 leading-relaxed">
              Every lawyer on our platform goes through a strict verification process. You only connect with certified, highly-rated legal professionals.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-primary-50 rounded-full flex items-center justify-center mb-6">
              <Scale className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Transparent Pricing</h3>
            <p className="text-gray-600 leading-relaxed">
              No hidden fees. You see upfront consultation rates and book securely through our platform before you even step foot in an office.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-primary-50 rounded-full flex items-center justify-center mb-6">
              <Clock className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Speed</h3>
            <p className="text-gray-600 leading-relaxed">
              Don't know what kind of lawyer you need? Our AI intake assistant analyzes your problem and points you in the right direction in seconds.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-50 py-20 px-4 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to find your legal partner?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search" className="bg-primary-600 text-white px-8 py-4 rounded-full font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/30">
              Browse Lawyers
            </Link>
            <Link href="/intake" className="bg-white text-primary-600 border-2 border-primary-100 px-8 py-4 rounded-full font-bold hover:border-primary-200 hover:bg-primary-50 transition-colors">
              Talk to AI Assistant
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
