'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { createClient } from '@/utils/supabase/client'
import { ArrowLeft, Send, MessageSquare } from 'lucide-react'
import Link from 'next/link'

interface Message {
  id: string
  request_id: string
  sender_id: string
  content: string
  created_at: string
}

interface Props {
  requestId: string
  currentUserId: string
  isClient: boolean
  clientName: string
  lawyerName: string
  lawyerId: string
  issueSummary: string
  requestStatus: string
  initialMessages: Message[]
}

export default function ConversationView({
  requestId,
  currentUserId,
  isClient,
  clientName,
  lawyerName,
  issueSummary,
  requestStatus,
  initialMessages,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = useMemo(() => createClient(), [])

  const otherName = isClient ? lawyerName : clientName

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Supabase Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`messages:${requestId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `request_id=eq.${requestId}`,
        },
        (payload) => {
          const incoming = payload.new as Message
          // Avoid duplicates from our own optimistic insert
          setMessages(prev =>
            prev.some(m => m.id === incoming.id) ? prev : [...prev, incoming]
          )
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [requestId, supabase])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = body.trim()
    if (!trimmed || sending) return

    setSending(true)
    setBody('')
    setSendError(null)

    // Optimistic insert
    const optimistic: Message = {
      id: crypto.randomUUID(),
      request_id: requestId,
      sender_id: currentUserId,
      content: trimmed,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, optimistic])

    const { data, error } = await supabase
      .from('messages')
      .insert({ request_id: requestId, sender_id: currentUserId, content: trimmed })
      .select('id, request_id, sender_id, content, created_at')
      .single()

    if (!error && data) {
      // Replace optimistic with real row (has server-generated id)
      setMessages(prev => prev.map(m => m.id === optimistic.id ? data as Message : m))
    } else if (error) {
      // Rollback
      setMessages(prev => prev.filter(m => m.id !== optimistic.id))
      setBody(trimmed)
      setSendError(error.message)
    }

    setSending(false)
  }

  const isClosed = requestStatus === 'closed'

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-3 p-4 flex items-center gap-3 shrink-0">
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
          <span className="text-white text-sm font-bold">{otherName[0]}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm truncate">{otherName}</p>
          <p className="text-xs text-gray-400 truncate">{issueSummary}</p>
        </div>
        {isClosed && (
          <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full shrink-0">
            Closed
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-10">
            <MessageSquare className="w-10 h-10 text-gray-200 mb-3" />
            <p className="text-gray-400 font-medium text-sm">No messages yet.</p>
            <p className="text-xs text-gray-300 mt-1">Send the first message to start the conversation.</p>
          </div>
        ) : (
          messages.map(msg => {
            const isMine = msg.sender_id === currentUserId
            return (
              <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] ${isMine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMine
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[11px] text-gray-400 px-1">
                    {new Date(msg.created_at).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {isClosed ? (
        <div className="mt-3 text-center text-sm text-gray-400 py-3">
          This enquiry is closed. Reopen it from your dashboard to send messages.
        </div>
      ) : (
        <>
        {sendError && (
          <p className="mt-2 text-xs text-red-500 text-center">{sendError}</p>
        )}
        <form onSubmit={handleSend} className="mt-3 flex gap-2 shrink-0">
          <input
            type="text"
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!body.trim() || sending}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl transition-colors disabled:opacity-40 flex items-center gap-1.5 font-semibold text-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        </>
      )}
    </div>
  )
}
