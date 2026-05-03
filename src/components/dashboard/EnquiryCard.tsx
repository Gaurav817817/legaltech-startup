'use client'

import { useState } from 'react'
import { Phone, Mail, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { updateEnquiryStatus } from '@/app/dashboard/actions'

interface Enquiry {
  id: string
  client_name: string
  client_phone: string
  client_email: string | null
  issue_summary: string
  status: string
  created_at: string
}

const BADGE: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  active:  'bg-green-100 text-green-700',
  closed:  'bg-gray-100 text-gray-500',
}

const LABEL: Record<string, string> = {
  pending: 'Awaiting Response',
  active:  'Active',
  closed:  'Closed',
}

export default function EnquiryCard({ enquiry }: { enquiry: Enquiry }) {
  const [status, setStatus] = useState(enquiry.status)
  const [loading, setLoading] = useState<string | null>(null)

  const update = async (next: string) => {
    const prev = status
    setLoading(next)
    setStatus(next)
    try {
      await updateEnquiryStatus(enquiry.id, next)
    } catch {
      setStatus(prev)
    } finally {
      setLoading(null)
    }
  }

  return (
    <li className="p-5 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start gap-2">
        <p className="font-semibold text-gray-900 text-sm">{enquiry.client_name}</p>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${BADGE[status] ?? 'bg-gray-100 text-gray-500'}`}>
          {LABEL[status] ?? status}
        </span>
      </div>

      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{enquiry.issue_summary}</p>

      <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
        <a href={`tel:${enquiry.client_phone}`} className="flex items-center gap-1 text-blue-600 hover:underline font-medium">
          <Phone className="w-3 h-3" /> {enquiry.client_phone}
        </a>
        {enquiry.client_email && (
          <a href={`mailto:${enquiry.client_email}`} className="flex items-center gap-1 text-blue-600 hover:underline font-medium">
            <Mail className="w-3 h-3" /> {enquiry.client_email}
          </a>
        )}
        <span className="text-gray-400">
          {new Date(enquiry.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <Link
          href={`/conversation/${enquiry.id}`}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-400 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all"
        >
          <MessageSquare className="w-3.5 h-3.5" /> Open Chat
        </Link>
        {status === 'pending' && (
          <button
            onClick={() => update('active')}
            disabled={loading !== null}
            className="text-xs px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 font-semibold transition-colors disabled:opacity-50"
          >
            {loading === 'active' ? '…' : 'Mark Active'}
          </button>
        )}

        {status === 'active' && (
          <button
            onClick={() => update('closed')}
            disabled={loading !== null}
            className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 font-semibold transition-colors disabled:opacity-50"
          >
            {loading === 'closed' ? '…' : 'Close'}
          </button>
        )}

        {status === 'closed' && (
          <button
            onClick={() => update('active')}
            disabled={loading !== null}
            className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors disabled:opacity-50"
          >
            {loading === 'active' ? '…' : 'Reopen'}
          </button>
        )}
      </div>
    </li>
  )
}
