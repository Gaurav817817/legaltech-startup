'use client'

import { useState } from 'react'
import { setLawyerApproval } from './actions'

export default function ApprovalButton({ lawyerId, approved }: { lawyerId: string; approved: boolean }) {
  const [loading, setLoading] = useState(false)

  const toggle = async (next: boolean) => {
    setLoading(true)
    try {
      await setLawyerApproval(lawyerId, next)
    } finally {
      setLoading(false)
    }
  }

  if (approved) {
    return (
      <button
        onClick={() => toggle(false)}
        disabled={loading}
        className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 font-medium transition-colors disabled:opacity-50"
      >
        {loading ? '…' : 'Revoke'}
      </button>
    )
  }

  return (
    <button
      onClick={() => toggle(true)}
      disabled={loading}
      className="text-xs px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 font-semibold transition-colors disabled:opacity-50"
    >
      {loading ? '…' : 'Approve'}
    </button>
  )
}
