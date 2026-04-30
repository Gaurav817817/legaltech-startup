'use client'

import { useState } from 'react'
import { submitEnquiry } from '@/app/lawyers/[id]/actions'
import { MessageSquare, CheckCircle, Loader2 } from 'lucide-react'

export default function EnquiryForm({ lawyerId, lawyerName }: { lawyerId: string; lawyerName: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    const formData = new FormData(e.currentTarget)
    formData.set('lawyer_id', lawyerId)
    const result = await submitEnquiry(formData)
    setMessage(result.message)
    setState(result.success ? 'success' : 'error')
  }

  if (state === 'success') {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
        <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
        <p className="font-semibold text-gray-900">Enquiry Sent!</p>
        <p className="text-sm text-gray-500 mt-1">{lawyerName} will contact you shortly on the number you provided.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-blue-500" /> Free Enquiry
      </h3>
      <p className="text-xs text-gray-500 mb-4">Describe your issue and {lawyerName} will reach out to you.</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            name="client_name"
            type="text"
            required
            placeholder="Your full name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <input
            name="client_phone"
            type="tel"
            required
            placeholder="Phone number"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <input
            name="client_email"
            type="email"
            placeholder="Email (optional)"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <textarea
            name="issue_description"
            required
            rows={3}
            placeholder="Briefly describe your legal issue..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          />
        </div>

        {state === 'error' && (
          <p className="text-xs text-red-600">{message}</p>
        )}

        <button
          type="submit"
          disabled={state === 'loading'}
          className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {state === 'loading' ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
          ) : 'Send Enquiry'}
        </button>
        <p className="text-xs text-gray-400 text-center">Free • No commitment • Response within 24 hrs</p>
      </form>
    </div>
  )
}
