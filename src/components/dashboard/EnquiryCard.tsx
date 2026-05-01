'use client'

import { useState } from 'react'
import { Phone, Mail } from 'lucide-react'
import { updateEnquiryStatus } from '@/app/dashboard/actions'

interface Enquiry {
  id: string
  client_name: string
  client_phone: string
  client_email: string | null
  issue_description: string
  status: string
  created_at: string
}

const BADGE: Record<string, string> = {
  new:         'bg-blue-100 text-blue-700',
  contacted:   'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-green-100 text-green-700',
  declined:    'bg-gray-100 text-gray-500',
}

const LABEL: Record<string, string> = {
  new:         'New',
  contacted:   'Contacted',
  in_progress: 'In Progress',
  declined:    'Declined',
}

export default function EnquiryCard({ enquiry }: { enquiry: Enquiry }) {
  const [status, setStatus] = useState(enquiry.status)
  const [loading, setLoading] = useState<string | null>(null)

  const update = async (next: string) => {
    const prev = status
    setLoading(next)
    setStatus(next) // optimistic update
    try {
      await updateEnquiryStatus(enquiry.id, next)
    } catch {
      setStatus(prev) // revert on error
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

      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{enquiry.issue_description}</p>

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

      {/* Action buttons */}
      <div className="mt-3 flex items-center gap-2">
        {status === 'new' && (
          <>
            <button
              onClick={() => update('contacted')}
              disabled={loading !== null}
              className="text-xs px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold transition-colors disabled:opacity-50"
            >
              {loading === 'contacted' ? '…' : 'Mark Contacted'}
            </button>
            <button
              onClick={() => update('declined')}
              disabled={loading !== null}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 font-medium transition-colors disabled:opacity-50"
            >
              {loading === 'declined' ? '…' : 'Decline'}
            </button>
          </>
        )}

        {status === 'contacted' && (
          <>
            <button
              onClick={() => update('in_progress')}
              disabled={loading !== null}
              className="text-xs px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 font-semibold transition-colors disabled:opacity-50"
            >
              {loading === 'in_progress' ? '…' : 'In Progress'}
            </button>
            <button
              onClick={() => update('declined')}
              disabled={loading !== null}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 font-medium transition-colors disabled:opacity-50"
            >
              {loading === 'declined' ? '…' : 'Decline'}
            </button>
          </>
        )}

        {(status === 'in_progress' || status === 'declined') && (
          <button
            onClick={() => update('new')}
            disabled={loading !== null}
            className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors disabled:opacity-50"
          >
            {loading === 'new' ? '…' : 'Reopen'}
          </button>
        )}
      </div>
    </li>
  )
}
