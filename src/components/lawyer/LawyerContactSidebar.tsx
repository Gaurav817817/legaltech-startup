'use client'

import { useState } from 'react'
import {
  Star, CheckCircle, Loader2, MessageSquare,
  Phone, Calendar, Shield, Lock, LogIn, UserPlus,
} from 'lucide-react'
import Link from 'next/link'
import { submitEnquiry } from '@/app/lawyers/[id]/actions'

type Tab = 'enquiry' | 'book'
type FormState = 'idle' | 'loading' | 'success' | 'error'

interface Props {
  lawyer: {
    id: string
    name: string
    firstName: string
    consultationFee?: string | null
    rating?: number | null
  }
  prefillIssue?: string
  isAuthenticated: boolean
  lawyerPath: string
}

export default function LawyerContactSidebar({ lawyer, prefillIssue, isAuthenticated, lawyerPath }: Props) {
  const [tab, setTab] = useState<Tab>('enquiry')
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const hasRazorpay = !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  const rawFee = lawyer.consultationFee
  const hasFee = rawFee && rawFee !== 'undefined' && rawFee !== 'null'
  const displayFee = hasFee
    ? (rawFee!.startsWith('₹') ? rawFee : `₹${rawFee}`)
    : null

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormState('loading')
    const formData = new FormData(e.currentTarget)
    formData.set('lawyer_id', lawyer.id)
    formData.set('lawyer_name', lawyer.firstName)
    const result = await submitEnquiry(formData)
    if (result.success) {
      setFormState('success')
    } else {
      setErrorMsg(result.message)
      setFormState('error')
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden sticky top-24">

      {/* Fee + rating header */}
      <div className="px-5 pt-5 pb-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 mb-1">Consultation Fee</p>
        <div className="flex items-center justify-between">
          <p className="text-3xl font-extrabold tracking-tight">
            {displayFee ?? <span className="text-xl font-semibold text-blue-200">On request</span>}
          </p>
          {lawyer.rating && lawyer.rating > 0 ? (
            <div className="flex items-center gap-1 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold">{lawyer.rating}</span>
            </div>
          ) : null}
        </div>
        <p className="text-xs text-blue-200 mt-1.5">Free enquiry · No commitment</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 bg-gray-50">
        <button
          onClick={() => setTab('enquiry')}
          className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
            tab === 'enquiry'
              ? 'text-blue-600 bg-white border-b-2 border-blue-600 shadow-sm'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Send Enquiry
        </button>
        <button
          onClick={() => hasRazorpay && setTab('book')}
          className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
            !hasRazorpay
              ? 'text-gray-300 cursor-not-allowed'
              : tab === 'book'
              ? 'text-blue-600 bg-white border-b-2 border-blue-600 shadow-sm'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Book Session
          {!hasRazorpay && (
            <span className="text-[10px] bg-gray-100 text-gray-300 px-1.5 py-0.5 rounded-full ml-0.5">Soon</span>
          )}
        </button>
      </div>

      {/* Auth wall */}
      {!isAuthenticated && (
        <div className="p-6 text-center">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-blue-500" />
          </div>
          <p className="font-bold text-gray-900 mb-1.5">Sign in to send an enquiry</p>
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            A free account keeps your enquiry private and lets {lawyer.firstName} respond directly to you.
          </p>
          <Link
            href={`/login?next=${encodeURIComponent(lawyerPath)}`}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-colors mb-2.5"
          >
            <LogIn className="w-4 h-4" /> Sign In
          </Link>
          <Link
            href={`/signup?next=${encodeURIComponent(lawyerPath)}`}
            className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors"
          >
            <UserPlus className="w-4 h-4" /> Create Free Account
          </Link>
        </div>
      )}

      {/* Enquiry form */}
      {isAuthenticated && tab === 'enquiry' && (
        <div className="p-5">
          {formState === 'success' ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <p className="font-bold text-gray-900 mb-1.5">Enquiry Sent!</p>
              <p className="text-sm text-gray-500 leading-relaxed">
                {lawyer.firstName} will reach out to you shortly on the number you provided.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="client_name"
                type="text"
                required
                placeholder="Your full name"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors"
              />
              <input
                name="client_phone"
                type="tel"
                required
                placeholder="Phone number"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors"
              />
              <input
                name="client_email"
                type="email"
                placeholder="Email (optional)"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors"
              />
              <textarea
                name="issue_description"
                required
                rows={3}
                defaultValue={prefillIssue ?? ''}
                placeholder="Briefly describe your legal issue…"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors resize-none"
              />

              {formState === 'error' && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={formState === 'loading'}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                {formState === 'loading' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                ) : (
                  <><Phone className="w-4 h-4" /> Send Free Enquiry</>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Book session placeholder */}
      {isAuthenticated && tab === 'book' && (
        <div className="p-5 text-center py-10">
          <Calendar className="w-10 h-10 mx-auto mb-3 text-gray-200" />
          <p className="text-sm font-semibold text-gray-500 mb-1">Online booking coming soon</p>
          <p className="text-xs text-gray-400">Send a free enquiry to schedule directly with {lawyer.firstName}.</p>
          <button
            onClick={() => setTab('enquiry')}
            className="mt-4 text-xs text-blue-600 hover:underline font-semibold"
          >
            Send an enquiry instead →
          </button>
        </div>
      )}

      {/* Trust footer */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-5">
        <span className="flex items-center gap-1 text-[11px] text-gray-400">
          <Shield className="w-3 h-3 text-green-500" /> Confidential
        </span>
        <span className="flex items-center gap-1 text-[11px] text-gray-400">
          <Lock className="w-3 h-3 text-blue-400" /> Secure
        </span>
        <span className="flex items-center gap-1 text-[11px] text-gray-400">
          <CheckCircle className="w-3 h-3 text-blue-500" /> Verified Lawyer
        </span>
      </div>
    </div>
  )
}
