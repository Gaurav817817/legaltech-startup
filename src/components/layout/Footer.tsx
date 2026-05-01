import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] border-t border-gray-800 text-gray-300 mt-auto relative z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-6 group">
              <svg width="44" height="44" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="amiquz-tarazu-gold-footer" x1="20%" y1="0%" x2="80%" y2="100%">
                    <stop offset="0%" stopColor="#FCD34D"/>
                    <stop offset="55%" stopColor="#F59E0B"/>
                    <stop offset="100%" stopColor="#B45309"/>
                  </linearGradient>
                </defs>
                <rect x="31" y="6" width="2" height="4.5" rx="1" fill="url(#amiquz-tarazu-gold-footer)"/>
                <rect x="10" y="14.4" width="44" height="3.6" rx="1.8" fill="url(#amiquz-tarazu-gold-footer)"/>
                <circle cx="11" cy="16.2" r="2.2" fill="url(#amiquz-tarazu-gold-footer)"/>
                <circle cx="53" cy="16.2" r="2.2" fill="url(#amiquz-tarazu-gold-footer)"/>
                <rect x="30.6" y="9.5" width="2.8" height="45" rx="1.4" fill="url(#amiquz-tarazu-gold-footer)"/>
                <rect x="22" y="52.6" width="20" height="3" rx="1.5" fill="url(#amiquz-tarazu-gold-footer)"/>
                <rect x="10.3" y="18.4" width="1.4" height="10.6" rx="0.7" fill="url(#amiquz-tarazu-gold-footer)"/>
                <rect x="52.3" y="18.4" width="1.4" height="10.6" rx="0.7" fill="url(#amiquz-tarazu-gold-footer)"/>
                <path d="M 2 29 Q 11 42 20 29" fill="none" stroke="url(#amiquz-tarazu-gold-footer)" strokeWidth="3" strokeLinecap="round"/>
                <path d="M 44 29 Q 53 42 62 29" fill="none" stroke="url(#amiquz-tarazu-gold-footer)" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-white leading-none tracking-tight">Amiquz</span>
                <span className="text-[10px] text-gray-400 font-medium mt-0.5">find legal help. powered by ai.</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Find legal help, powered by AI.
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
              <li><Link href="/for-lawyers" className="text-gray-400 hover:text-white text-sm transition-colors">Join Amiquz</Link>              </li>
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
