'use client';
import Link from "next/link";
import { Scale, User, Briefcase, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { signup } from "./actions";
import { useState, use } from "react";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'At least 8 characters', ok: password.length >= 8 },
    { label: 'One uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'One number', ok: /[0-9]/.test(password) },
  ]
  if (!password) return null
  return (
    <div className="mt-2 space-y-1">
      {checks.map(c => (
        <div key={c.label} className="flex items-center gap-1.5 text-xs">
          {c.ok
            ? <CheckCircle className="w-3.5 h-3.5 text-green-500" />
            : <XCircle className="w-3.5 h-3.5 text-red-400" />}
          <span className={c.ok ? 'text-green-600' : 'text-gray-400'}>{c.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const params = use(searchParams);
  const [accountType, setAccountType] = useState('client');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [clientError, setClientError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    if (password !== confirmPassword) {
      e.preventDefault()
      setClientError('Passwords do not match.')
      return
    }
    const checks = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password)]
    if (!checks.every(Boolean)) {
      e.preventDefault()
      setClientError('Please make sure your password meets all requirements.')
      return
    }
    setClientError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#4f46e5] flex flex-col justify-center py-12 sm:px-6 lg:px-8" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Scale className="w-8 h-8 text-gray-900" />
          </div>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-white">Join Amiquz</h2>
        <p className="mt-2 text-sm text-blue-200">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-amber-300 hover:text-amber-200">Sign in →</Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="bg-white/95 backdrop-blur-md py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/20">

          {(params?.error || clientError) && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {clientError || params?.error}
            </div>
          )}

          {/* Role selector */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">How do you want to use Amiquz?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { type: 'client', icon: User, title: 'I am a Client', desc: 'Looking to find a lawyer and book consultations.' },
                { type: 'lawyer', icon: Briefcase, title: 'I am a Lawyer', desc: 'Looking to offer legal services and get leads.' },
              ].map(({ type, icon: Icon, title, desc }) => (
                <button key={type} type="button"
                  onClick={() => setAccountType(type)}
                  className={`flex cursor-pointer rounded-xl border p-4 shadow-sm text-left transition-all ${accountType === type ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50/30' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
                  <span className="flex flex-col">
                    <span className={`flex items-center gap-2 text-sm font-bold ${accountType === type ? 'text-blue-700' : 'text-gray-900'}`}>
                      <Icon className={`w-5 h-5 ${accountType === type ? 'text-blue-600' : 'text-gray-400'}`} />
                      {title}
                    </span>
                    <span className="mt-1 text-sm text-gray-500">{desc}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <form className="space-y-5" action={signup} onSubmit={handleSubmit}>
            <input type="hidden" name="account-type" value={accountType} />
            {params.next && <input type="hidden" name="next" value={params.next} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="first-name" className="block text-sm font-semibold text-gray-700 mb-1">First name</label>
                <input id="first-name" name="first-name" type="text" required
                  className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-gray-900" />
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-semibold text-gray-700 mb-1">Last name</label>
                <input id="last-name" name="last-name" type="text" required
                  className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-gray-900" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email address</label>
              <input id="email" name="email" type="email" required
                className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-gray-900" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} required
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-gray-900 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrength password={password} />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <input id="confirm-password" type={showConfirm ? 'text' : 'password'} required
                  value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className={`appearance-none block w-full px-3 py-2.5 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm text-gray-900 pr-10 ${confirmPassword && confirmPassword !== password ? 'border-red-400' : 'border-gray-300'}`} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== password && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
              {confirmPassword && confirmPassword === password && (
                <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Passwords match</p>
              )}
            </div>

            <button type="submit"
              className="w-full flex justify-center py-3 px-4 rounded-full text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/40">
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
