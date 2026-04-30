'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Scale, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setSent(true)
    setLoading(false)
  }

  if (sent) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
        <p className="text-gray-500 mt-2">We sent a password reset link to <strong>{email}</strong>. Click the link in the email to reset your password.</p>
        <Link href="/login" className="mt-6 inline-block text-blue-600 font-semibold hover:underline">← Back to login</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-md flex items-center justify-center shadow-lg">
            <Scale className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Reset your password</h2>
        <p className="mt-2 text-sm text-gray-600">Enter your email and we'll send you a reset link.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl sm:rounded-2xl border border-gray-100">
          {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-gray-900" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex justify-center py-3 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          <p className="text-center mt-4 text-sm text-gray-500">
            Remember your password? <Link href="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
