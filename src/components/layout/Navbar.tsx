'use client';
import Link from "next/link";
import { Sparkles, Menu, X, LogOut, LayoutDashboard, User } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const supabase = createClient()
    // getSession reads from cookie instantly — no network round-trip
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => { listener.subscription.unsubscribe() }
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setShowDropdown(false)
    router.push('/')
    router.refresh()
  }

  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'User'
  const role = user?.user_metadata?.role || 'client'

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <svg width="44" height="44" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="amiquz-tarazu-gold" x1="20%" y1="0%" x2="80%" y2="100%">
                    <stop offset="0%" stopColor="#FCD34D"/>
                    <stop offset="55%" stopColor="#F59E0B"/>
                    <stop offset="100%" stopColor="#B45309"/>
                  </linearGradient>
                </defs>
                {/* Top finial */}
                <rect x="31" y="6" width="2" height="4.5" rx="1" fill="url(#amiquz-tarazu-gold)"/>
                {/* Balance beam */}
                <rect x="10" y="14.4" width="44" height="3.6" rx="1.8" fill="url(#amiquz-tarazu-gold)"/>
                {/* Beam end caps */}
                <circle cx="11" cy="16.2" r="2.2" fill="url(#amiquz-tarazu-gold)"/>
                <circle cx="53" cy="16.2" r="2.2" fill="url(#amiquz-tarazu-gold)"/>
                {/* Central post */}
                <rect x="30.6" y="9.5" width="2.8" height="45" rx="1.4" fill="url(#amiquz-tarazu-gold)"/>
                {/* Base */}
                <rect x="22" y="52.6" width="20" height="3" rx="1.5" fill="url(#amiquz-tarazu-gold)"/>
                {/* Hanging chains */}
                <rect x="10.3" y="18.4" width="1.4" height="10.6" rx="0.7" fill="url(#amiquz-tarazu-gold)"/>
                <rect x="52.3" y="18.4" width="1.4" height="10.6" rx="0.7" fill="url(#amiquz-tarazu-gold)"/>
                {/* Pans */}
                <path d="M 2 29 Q 11 42 20 29" fill="none" stroke="url(#amiquz-tarazu-gold)" strokeWidth="3" strokeLinecap="round"/>
                <path d="M 44 29 Q 53 42 62 29" fill="none" stroke="url(#amiquz-tarazu-gold)" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-[#0f172a] leading-none tracking-tight">Amiquz</span>
                <span className="text-[10px] text-gray-400 font-medium hidden sm:block mt-0.5">find legal help. powered by ai.</span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="/search" className="text-gray-500 hover:text-gray-900 font-medium text-[15px] transition-colors">Find Lawyers</Link>
            <Link href="/practice-areas" className="text-gray-500 hover:text-gray-900 font-medium text-[15px] transition-colors">Practice Areas</Link>
            <Link href="/about" className="text-gray-500 hover:text-gray-900 font-medium text-[15px] transition-colors">About</Link>
            <Link href="/intake" className="text-blue-600 hover:text-blue-700 font-medium text-[15px] transition-colors flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> AI Chat
            </Link>
          </nav>

          {/* Auth area */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 font-bold text-sm">{firstName[0]?.toUpperCase()}</span>
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{firstName}</span>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      <p className="text-xs text-blue-600 font-semibold capitalize">{role}</p>
                    </div>
                    <Link href="/dashboard" onClick={() => setShowDropdown(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    {role === 'lawyer' && (
                      <Link href="/lawyer-profile-setup" onClick={() => setShowDropdown(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <User className="w-4 h-4" /> Edit Profile
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium text-[15px]">Log In</Link>
                <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium text-[15px] transition-colors shadow-md">Sign Up Free</Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 p-2">
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-lg absolute w-full left-0 top-20 flex flex-col p-4 space-y-4">
          <Link href="/search" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 font-medium text-lg px-2 py-1">Find Lawyers</Link>
          <Link href="/practice-areas" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 font-medium text-lg px-2 py-1">Practice Areas</Link>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 font-medium text-lg px-2 py-1">About</Link>
          <Link href="/intake" onClick={() => setIsMobileMenuOpen(false)} className="text-blue-600 font-bold text-lg px-2 py-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> AI Chat
          </Link>
          <div className="border-t border-gray-100 pt-4 mt-2 flex flex-col gap-3">
            {user ? (
              <>
                <div className="px-2 text-sm text-gray-500">Signed in as <strong className="text-gray-900">{firstName}</strong> ({role})</div>
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-center bg-blue-600 text-white font-medium px-2 w-full py-2.5 rounded-lg">Dashboard</Link>
                {role === 'lawyer' && (
                  <Link href="/lawyer-profile-setup" onClick={() => setIsMobileMenuOpen(false)} className="text-center text-gray-700 font-medium px-2 w-full py-2.5 border border-gray-200 rounded-lg">Edit Profile</Link>
                )}
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="flex items-center justify-center gap-2 text-red-600 font-medium px-2 w-full py-2.5 border border-red-200 rounded-lg">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 font-medium text-lg px-2 text-center w-full py-2 border border-gray-200 rounded-lg">Log In</Link>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="bg-blue-600 text-white font-medium text-lg px-2 text-center w-full py-2 rounded-lg">Sign Up Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
