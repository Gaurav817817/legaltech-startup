import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-primary-800 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="font-bold text-lg text-gray-900 tracking-tight">LegalLink</span>
            </Link>
            <p className="text-gray-500 text-sm">
              Connecting individuals and businesses with top-tier, verified legal professionals.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">For Clients</h3>
            <ul className="space-y-3">
              <li><Link href="/lawyers" className="text-gray-600 hover:text-primary-800 text-sm transition-colors">Find a Lawyer</Link></li>
              <li><Link href="/how-it-works" className="text-gray-600 hover:text-primary-800 text-sm transition-colors">How It Works</Link></li>
              <li><Link href="/trust-safety" className="text-gray-600 hover:text-primary-800 text-sm transition-colors">Trust & Safety</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">For Lawyers</h3>
            <ul className="space-y-3">
              <li><Link href="/for-lawyers" className="text-gray-600 hover:text-primary-800 text-sm transition-colors">Join LegalLink</Link></li>
              <li><Link href="/pricing" className="text-gray-600 hover:text-primary-800 text-sm transition-colors">Pricing</Link></li>
              <li><Link href="/resources" className="text-gray-600 hover:text-primary-800 text-sm transition-colors">Lawyer Resources</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-gray-600 hover:text-primary-800 text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-600 hover:text-primary-800 text-sm transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-primary-800 text-sm transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} LegalLink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
