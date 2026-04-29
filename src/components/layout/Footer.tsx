import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] border-t border-gray-800 text-gray-300 mt-auto relative z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
           <Link href="/" className="flex items-center gap-2 mb-6 group">
  <svg width="44" height="44" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="54" height="54" rx="11" fill="#1d4ed8"/>
    <line x1="27" y1="12" x2="27" y2="40" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="17" y1="40" x2="37" y2="40" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="7" y1="17" x2="47" y2="21" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="7" y1="17" x2="4" y2="27" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M1 27 Q6 32 11 27" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <line x1="47" y1="21" x2="50" y2="32" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M44 32 Q50 37 56 32" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <circle cx="50" cy="31" r="2" fill="#93c5fd"/>
  </svg>
  <div className="flex flex-col">
    <span className="font-extrabold text-xl text-white leading-tight tracking-tight">Ami<span className="text-blue-400">quz</span></span>
    <span className="text-[9px] text-gray-400 tracking-widest font-medium">FIND LEGAL HELP, POWERED BY AI</span>
  </div>
</Link>
</svg>
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
              <li><Link href="/for-lawyers" className="text-gray-400 hover:text-white text-sm transition-colors">Join Amiquz</Link></li>
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
            &copy; {new Date().getFullYear()} Amiquz. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
