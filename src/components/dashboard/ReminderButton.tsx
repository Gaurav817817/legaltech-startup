'use client'

import { useState } from 'react'
import { Bell, BellOff, Loader2 } from 'lucide-react'
import { sendReminder } from '@/app/dashboard/actions'

export default function ReminderButton({ requestId, canSend }: { requestId: string; canSend: boolean }) {
  const [state, setState] = useState<'idle' | 'loading' | 'sent'>(canSend ? 'idle' : 'sent')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('loading')
    const formData = new FormData(e.currentTarget)
    const result = await sendReminder(formData)
    setState(result.success ? 'sent' : 'idle')
  }

  if (state === 'sent') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
        <BellOff className="w-3.5 h-3.5" /> Reminder sent
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="request_id" value={requestId} />
      <button
        type="submit"
        disabled={state === 'loading'}
        className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 border border-amber-200 hover:border-amber-400 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
      >
        {state === 'loading'
          ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending…</>
          : <><Bell className="w-3.5 h-3.5" /> Send Reminder</>
        }
      </button>
    </form>
  )
}
