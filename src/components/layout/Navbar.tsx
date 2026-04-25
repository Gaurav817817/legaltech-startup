import Link from "next/link";
import { AlignJustify, Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <AlignJustify className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
              <span className="font-extrabold text-xl text-[#0f172a] tracking-tight">
                Lex<span className="text-blue-600">Connect</span>
              </span>
            </Link>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="#" className="text-gray-500 hover:text-gray-900 font-medium text-[15px] transition-colors">
              How It Works
            </Link>
            <Link href="/practice-areas" className="text-gray-500 hover:text-gray-900 font-medium text-[15px] transition-colors">
              Practice Areas
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-900 font-medium text-[15px] transition-colors">
              For Lawyers
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-900 font-medium text-[15px] transition-colors">
              Pricing
            </Link>
            <Link href="/intake" className="text-blue-600 hover:text-blue-700 font-medium text-[15px] transition-colors flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> AI Legal Chat
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-6">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium text-[15px] transition-colors">
              Log In
            </Link>
            <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium text-[15px] transition-colors shadow-md shadow-blue-600/20">
              Sign Up Free
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
