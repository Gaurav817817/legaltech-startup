'use client';
import Link from "next/link";
import { AlignJustify, Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <AlignJustify className="w-6 h-6 text-blue-600 transition-colors" />
             <div className="flex items-center gap-2">
  <div style={{width:'44px', height:'44px', borderRadius:'10px', background:'#1d4ed8', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="16" y1="7" x2="16" y2="24" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="9" y1="24" x2="23" y2="24" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="4" y1="10" x2="28" y2="13" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="4" y1="10" x2="2" y2="17" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M0 17 Q4 21 8 17" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <line x1="28" y1="13" x2="30" y2="20" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M26 20 Q30 24 34 20" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <circle cx="30" cy="20" r="2" fill="#93c5fd"/>
    </svg>
  </div>
  <span style={{fontWeight:800, fontSize:'22px', color:'#0f172a', letterSpacing:'-0.5px'}}>Ami<span style={{color:'#1d4ed8'}}>quz</span></span>
</div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="/search" className="text-gray-500 hover:text-gray-900 font-medium text-[15px] transition-colors">
              Find Lawyers
            </Link>
            <Link href="/practice-areas" className="text-gray-500 hover:text-gray-900 font-medium text-[15px] transition-colors">
              Practice Areas
            </Link>
            <Link href="/about" className="text-gray-500 hover:text-gray-900 font-medium text-[15px] transition-colors">
              About Us
            </Link>
            <Link href="/legal-resources" className="text-gray-500 hover:text-gray-900 font-medium text-[15px] transition-colors">
              Legal Resources
            </Link>
            <Link href="/intake" className="text-blue-600 hover:text-blue-700 font-medium text-[15px] transition-colors flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Full AI Chat
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium text-[15px] transition-colors">
              Log In
            </Link>
            <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium text-[15px] transition-colors shadow-md shadow-blue-600/20">
              Sign Up Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-lg absolute w-full left-0 top-20 flex flex-col p-4 space-y-4">
          <Link href="/search" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 font-medium text-lg px-2 py-1">Find Lawyers</Link>
          <Link href="/practice-areas" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 font-medium text-lg px-2 py-1">Practice Areas</Link>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 font-medium text-lg px-2 py-1">About Us</Link>
          <Link href="/legal-resources" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 font-medium text-lg px-2 py-1">Legal Resources</Link>
          <Link href="/intake" onClick={() => setIsMobileMenuOpen(false)} className="text-blue-600 font-bold text-lg px-2 py-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> Full AI Chat
          </Link>
          <div className="border-t border-gray-100 pt-4 mt-2 flex flex-col gap-3">
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 font-medium text-lg px-2 text-center w-full py-2 border border-gray-200 rounded-lg">Log In</Link>
            <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="bg-blue-600 text-white font-medium text-lg px-2 text-center w-full py-2 rounded-lg shadow-md">Sign Up Free</Link>
          </div>
        </div>
      )}
    </header>
  );
}
