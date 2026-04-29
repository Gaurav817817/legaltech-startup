import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] border-t border-gray-800 text-gray-300 mt-auto relative z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
            <svg width="200" height="46" viewBox="0 0 220 50" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="48" height="48" rx="10" fill="#1d4ed8"/>
  <line x1="24" y1="11" x2="24" y2="36" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  <line x1="15" y1="36" x2="33" y2="36" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  <line x1="6" y1="15" x2="42" y2="19" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  <line x1="6" y1="15" x2="3" y2="24" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
  <path d="M0 24 Q5 28 10 24" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
  <line x1="42" y1="19" x2="45" y2="29" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
  <path d="M39 29 Q44 34 49 29" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
  <circle cx="45" cy="28" r="2" fill="#93c5fd"/>
  <text x="58" y="28" fontFamily="system-ui, sans-serif" fontSize="22" fontWeight="800" fill="white" letterSpacing="-0.5">Ami<tspan fill="#60a5fa">quz</tspan></text>
  <text x="58" y="43" fontFamily="system-ui, sans-serif" fontSize="8" fontWeight="400" fill="#9ca3af" letterSpacing="1">FIND LEGAL HELP, POWERED BY AI</text>
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
