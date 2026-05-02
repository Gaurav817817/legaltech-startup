'use client'

import { useState } from 'react'
import { deleteLawyer } from './actions'

export default function DeleteButton({ lawyerId, name }: { lawyerId: string; name: string }) {
  const [confirm, setConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  if (confirm) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={async () => {
            setLoading(true)
            try { await deleteLawyer(lawyerId) }
            catch (e: any) { alert('Delete failed: ' + e.message); setLoading(false); setConfirm(false) }
          }}
          disabled={loading}
          className="text-xs px-2.5 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? '…' : 'Yes, delete'}
        </button>
        <button
          onClick={() => setConfirm(false)}
          disabled={loading}
          className="text-xs px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-colors"
    >
      Delete
    </button>
  )
}
