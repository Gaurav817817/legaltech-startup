import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-800 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">LegalLink</span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="/intake" className="text-primary-600 hover:text-primary-800 font-bold text-sm transition-colors flex items-center gap-1 bg-primary-50 px-3 py-1.5 rounded-full">
              ✨ AI Intake Chat
            </Link>
            <Link href="/lawyers" className="text-gray-600 hover:text-primary-800 font-medium text-sm transition-colors">
              Find Lawyers
            </Link>
            <Link href="/practice-areas" className="text-gray-600 hover:text-primary-800 font-medium text-sm transition-colors">
              Practice Areas
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-primary-800 font-medium text-sm transition-colors">
              About Us
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-primary-800 font-medium text-sm transition-colors">
              Log In
            </Link>
            <Link href="/signup" className="bg-primary-800 hover:bg-primary-900 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
