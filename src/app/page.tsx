import Link from 'next/link';
import { Search, MapPin, Star, Shield, Scale, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Find the Right Lawyer for Your Case
          </h1>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Connect with top-tier legal professionals. Trusted, verified, and ready to help you navigate your legal challenges.
          </p>
          
          {/* Search Box */}
          <div className="bg-white p-2 rounded-lg shadow-lg flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
            <div className="flex-1 flex items-center bg-gray-50 rounded-md px-4 py-3 border border-gray-200 focus-within:ring-2 focus-within:ring-primary-500">
              <Search className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="Search by practice area (e.g., Family, Business)" 
                className="w-full bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
              />
            </div>
            <div className="flex-1 flex items-center bg-gray-50 rounded-md px-4 py-3 border border-gray-200 focus-within:ring-2 focus-within:ring-primary-500">
              <MapPin className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="Your Location (e.g., New York, NY)" 
                className="w-full bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
              />
            </div>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-md font-medium transition-colors">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Featured Practice Areas */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Popular Practice Areas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Corporate Law', 'Family Law', 'Real Estate', 'Intellectual Property', 'Immigration', 'Criminal Defense', 'Employment Law', 'Personal Injury'].map((area) => (
              <Link href={`/search?q=${area.toLowerCase().replace(' ', '+')}`} key={area} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow text-center group bg-white">
                <Scale className="w-8 h-8 mx-auto mb-4 text-primary-600 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-gray-900">{area}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <Shield className="w-12 h-12 mx-auto mb-4 text-primary-800" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Professionals</h3>
              <p className="text-gray-600">Every lawyer on our platform undergoes a rigorous verification process to ensure Bar Council credentials.</p>
            </div>
            <div className="p-6">
              <Star className="w-12 h-12 mx-auto mb-4 text-primary-800" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Client Testimonials</h3>
              <p className="text-gray-600">Read genuine reviews and testimonials from past clients to make an informed decision.</p>
            </div>
            <div className="p-6">
              <Clock className="w-12 h-12 mx-auto mb-4 text-primary-800" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Booking</h3>
              <p className="text-gray-600">Schedule consultations instantly through our secure online calendar system.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-800 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Are you a Legal Professional?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Join our network of elite attorneys. Get high-quality leads, manage your cases, and grow your practice.
          </p>
          <Link href="/lawyer/signup" className="bg-white text-primary-900 hover:bg-gray-100 px-8 py-3 rounded-md font-bold transition-colors inline-block">
            Apply to Join
          </Link>
        </div>
      </section>
    </div>
  );
}
