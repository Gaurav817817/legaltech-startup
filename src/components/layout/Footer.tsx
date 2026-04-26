import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] border-t border-gray-800 text-gray-300 mt-auto relative z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <span className="font-extrabold text-2xl text-white tracking-tight">
                Lex<span className="text-blue-500">Connect</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connecting individuals and businesses with top-tier, verified legal professionals.
            </p>
          </div>
          
          {/* For Clients */}
          <div>
            <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">For Clients</h3>
            <ul className="space-y-4">
              <li><Link href="/search" className="text-gray-400 hover:text-white text-sm transition-colors">Find a Lawyer</Link></li>
              <li><Link href="/how-it-works" className="text-gray-400 hover:text-white text-sm transition-colors">How It Works</Link></li>
              <li><Link href="/trust-safety" className="text-gray-400 hover:text-white text-sm transition-colors">Trust & Safety</Link></li>
            </ul>
          </div>
          
          {/* For Lawyers */}
          <div>
            <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">For Lawyers</h3>
            <ul className="space-y-4">
              <li><Link href="/for-lawyers" className="text-gray-400 hover:text-white text-sm transition-colors">Join LexConnect</Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-white text-sm transition-colors">Pricing</Link></li>
              <li><Link href="/legal-resources" className="text-gray-400 hover:text-white text-sm transition-colors">Lawyer Resources</Link></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Legal</h3>
            <ul className="space-y-4">
              <li><Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">Contact Us</Link></li>
            </ul>
          </div>

        </div>
        
        {/* Bottom Strip */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} LexConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
