'use client';
import Link from "next/link";
import { Sparkles, Menu, X, LogOut, LayoutDashboard, User } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, usePathname } from "next/navigation";

const NAV_BASE = "relative font-semibold text-[16px] transition-colors " +
  "after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2px] " +
  "after:bg-gradient-to-r after:from-amber-400 after:to-amber-600 " +
  "after:transition-transform after:duration-200 after:origin-left after:rounded-full";
const NAV_LINK = NAV_BASE + " text-[#422c10] hover:text-amber-700 after:scale-x-0 hover:after:scale-x-100";
const NAV_LINK_ACTIVE = NAV_BASE + " text-[#b45309] after:scale-x-100";

export default function Navbar() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const supabase = createClient()
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

  const pathname = usePathname()
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'User'
  const role = user?.user_metadata?.role || 'client'

  return (
    <header className="sticky top-0 z-50 relative" style={{ background: '#fefdf8', borderBottom: '1px solid #f1ead4' }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <svg width="52" height="52" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="amiquz-tarazu-gold" x1="20%" y1="0%" x2="80%" y2="100%">
                    <stop offset="0%" stopColor="#FCD34D"/>
                    <stop offset="55%" stopColor="#F59E0B"/>
                    <stop offset="100%" stopColor="#B45309"/>
                  </linearGradient>
                </defs>
                <rect x="31" y="6" width="2" height="4.5" rx="1" fill="url(#amiquz-tarazu-gold)"/>
                <rect x="10" y="14.4" width="44" height="3.6" rx="1.8" fill="url(#amiquz-tarazu-gold)"/>
                <circle cx="11" cy="16.2" r="2.2" fill="url(#amiquz-tarazu-gold)"/>
                <circle cx="53" cy="16.2" r="2.2" fill="url(#amiquz-tarazu-gold)"/>
                <rect x="30.6" y="9.5" width="2.8" height="45" rx="1.4" fill="url(#amiquz-tarazu-gold)"/>
                <rect x="22" y="52.6" width="20" height="3" rx="1.5" fill="url(#amiquz-tarazu-gold)"/>
                <rect x="10.3" y="18.4" width="1.4" height="10.6" rx="0.7" fill="url(#amiquz-tarazu-gold)"/>
                <rect x="52.3" y="18.4" width="1.4" height="10.6" rx="0.7" fill="url(#amiquz-tarazu-gold)"/>
                <path d="M 2 29 Q 11 42 20 29" fill="none" stroke="url(#amiquz-tarazu-gold)" strokeWidth="3" strokeLinecap="round"/>
                <path d="M 44 29 Q 53 42 62 29" fill="none" stroke="url(#amiquz-tarazu-gold)" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              <div className="flex flex-col">
                <span
                  className="font-extrabold text-[26px] text-[#0f172a] leading-none tracking-tight"
                  style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                >
                  Amiquz
                </span>
                <span className="text-[10px] font-medium mt-0.5 hidden sm:block italic" style={{ color: '#92725a' }}>
                  find legal help. powered by ai.
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="/search" className={isActive('/search') ? NAV_LINK_ACTIVE : NAV_LINK}>Find Lawyers</Link>
            <Link href="/practice-areas" className={isActive('/practice-areas') ? NAV_LINK_ACTIVE : NAV_LINK}>Practice Areas</Link>
            <Link href="/about" className={isActive('/about') ? NAV_LINK_ACTIVE : NAV_LINK}>About</Link>
            <Link
              href="/intake"
              className={
                (isActive('/intake') ? NAV_LINK_ACTIVE : NAV_LINK) +
                " flex items-center gap-1.5 !text-amber-700 hover:!text-amber-800"
              }
            >
              <Sparkles className="w-4 h-4" /> AI Chat
            </Link>
          </nav>

          {/* Auth area */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors"
                  style={{ background: '#fff', border: '1.5px solid #e9d8a8', color: '#422c10' }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: '#fef3c7' }}
                  >
                    <span className="font-bold text-sm" style={{ color: '#92400e' }}>{firstName[0]?.toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-semibold">{firstName}</span>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border py-2 z-50" style={{ borderColor: '#e9d8a8' }}>
                    <div className="px-4 py-2 border-b" style={{ borderColor: '#f1ead4' }}>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      <p className="text-xs font-semibold capitalize" style={{ color: '#92725a' }}>{role}</p>
                    </div>
                    <Link href="/dashboard" onClick={() => setShowDropdown(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-amber-50 transition-colors" style={{ color: '#422c10' }}>
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    {role === 'lawyer' && (
                      <Link href="/lawyer-profile-setup" onClick={() => setShowDropdown(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-amber-50 transition-colors" style={{ color: '#422c10' }}>
                        <User className="w-4 h-4" /> Edit Profile
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="font-semibold text-[15px] transition-colors hover:text-amber-700" style={{ color: '#422c10' }}>Log In</Link>
                <Link
                  href="/signup"
                  className="px-5 py-2.5 rounded-full font-semibold text-[15px] transition-colors shadow-sm text-white"
                  style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)' }}
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2" style={{ color: '#422c10' }}>
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute w-full left-0 top-20 flex flex-col p-4 space-y-4 shadow-lg z-40" style={{ background: '#fefdf8', borderBottom: '1px solid #f1ead4' }}>
          <Link href="/search" onClick={() => setIsMobileMenuOpen(false)} className="font-semibold text-lg px-2 py-1" style={{ color: '#422c10' }}>Find Lawyers</Link>
          <Link href="/practice-areas" onClick={() => setIsMobileMenuOpen(false)} className="font-semibold text-lg px-2 py-1" style={{ color: '#422c10' }}>Practice Areas</Link>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="font-semibold text-lg px-2 py-1" style={{ color: '#422c10' }}>About</Link>
          <Link href="/intake" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-lg px-2 py-1 flex items-center gap-2" style={{ color: '#b45309' }}>
            <Sparkles className="w-5 h-5" /> AI Chat
          </Link>
          <div className="pt-4 mt-2 flex flex-col gap-3" style={{ borderTop: '1px solid #f1ead4' }}>
            {user ? (
              <>
                <div className="px-2 text-sm" style={{ color: '#92725a' }}>Signed in as <strong style={{ color: '#422c10' }}>{firstName}</strong> ({role})</div>
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-center font-semibold px-2 w-full py-2.5 rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)' }}>Dashboard</Link>
                {role === 'lawyer' && (
                  <Link href="/lawyer-profile-setup" onClick={() => setIsMobileMenuOpen(false)} className="text-center font-semibold px-2 w-full py-2.5 rounded-lg" style={{ color: '#422c10', border: '1.5px solid #e9d8a8' }}>Edit Profile</Link>
                )}
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="flex items-center justify-center gap-2 text-red-600 font-semibold px-2 w-full py-2.5 rounded-lg border border-red-200">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="font-semibold text-lg px-2 text-center w-full py-2 rounded-lg" style={{ color: '#422c10', border: '1.5px solid #e9d8a8' }}>Log In</Link>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="font-semibold text-lg px-2 text-center w-full py-2 rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)' }}>Sign Up Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
