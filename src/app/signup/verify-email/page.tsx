import Link from 'next/link'
import { Scale, Mail, ArrowRight } from 'lucide-react'

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#4f46e5] flex flex-col justify-center py-12 px-4"
      style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Scale className="w-8 h-8 text-gray-900" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl border border-white/20 text-center">

          {/* Icon */}
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>

          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Check your inbox</h2>

          {email ? (
            <p className="text-sm text-gray-500 mb-2 leading-relaxed">
              We sent a confirmation link to{' '}
              <span className="font-semibold text-gray-800">{email}</span>.
            </p>
          ) : (
            <p className="text-sm text-gray-500 mb-2 leading-relaxed">
              We sent a confirmation link to your email address.
            </p>
          )}

          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Click the link in that email to activate your account and get started.
          </p>

          {/* Steps */}
          <div className="bg-gray-50 rounded-xl p-4 text-left space-y-3 mb-6">
            {[
              'Open the email from Amiquz',
              'Click "Confirm your account"',
              "You'll be signed in automatically",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <p className="text-sm text-gray-700">{step}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 mb-5">
            Can&apos;t find it? Check your spam or junk folder.
          </p>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            Back to Sign In <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  )
}
