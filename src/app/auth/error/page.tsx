import Link from 'next/link'
import { Scale, XCircle } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#4f46e5] flex flex-col justify-center py-12 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg">
            <Scale className="w-8 h-8 text-gray-900" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl border border-white/20 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Confirmation link expired</h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            This link is invalid or has already been used. Confirmation links expire after 24 hours.
          </p>
          <Link
            href="/login"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm text-center transition-colors mb-3"
          >
            Back to Sign In
          </Link>
          <Link
            href="/signup"
            className="block text-sm text-blue-600 hover:underline font-medium"
          >
            Create a new account →
          </Link>
        </div>
      </div>
    </div>
  )
}
