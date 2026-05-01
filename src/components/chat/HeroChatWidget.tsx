'use client';
import { Send, Scale, User, ArrowRight, Sparkles, Shield, CheckCircle, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

interface Lawyer {
  id: string
  name: string
  practiceAreas: string[]
  rating: number
  location: string
  fee: string
  image: string | null
}

interface Message {
  id: string
  role: 'user' | 'model'
  content: string
  lawyers?: Lawyer[]
}

const QUICK_PROMPTS = [
  { emoji: '🏢', label: 'Register a startup' },
  { emoji: '📄', label: 'Got a legal notice' },
  { emoji: '🏠', label: 'Property dispute' },
  { emoji: '👨‍👩‍👧', label: 'Family / divorce' },
]

export default function HeroChatWidget() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isDiscovery = messages.length === 0;

  useEffect(() => {
    if (!isDiscovery) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages, isLoading, isDiscovery]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setIsLoading(true)
    setText('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages.map(m => ({ role: m.role, content: m.content })) }),
      })
      const { reply, ready_to_match, lawyers } = await res.json()
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'model',
        content: reply,
        lawyers: ready_to_match && lawyers?.length ? lawyers : undefined,
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'model',
        content: 'Something went wrong. Please try again.',
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-[28px] shadow-2xl w-full lg:w-[400px] flex flex-col overflow-hidden" style={{ height: '500px' }}>

      {/* ── DISCOVERY MODE ── */}
      {isDiscovery && (
        <>
          {/* Header */}
          <div className="px-5 pt-5 pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-200">
                  <Scale className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 leading-none">Amiquz AI</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Legal Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Online
              </div>
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 leading-snug">
              What&apos;s your legal situation?
            </h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Describe it and we&apos;ll find the right verified lawyer for you.
            </p>
          </div>

          {/* Input area */}
          <div className="px-4 pt-4">
            <div className="border-2 border-gray-200 rounded-xl focus-within:border-blue-500 focus-within:shadow-sm transition-all bg-gray-50 focus-within:bg-white">
              <textarea
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(text);
                  }
                }}
                placeholder="e.g. My landlord won't return my security deposit…"
                rows={3}
                className="w-full px-3 pt-3 pb-2 outline-none text-sm text-gray-900 placeholder-gray-400 resize-none bg-transparent leading-relaxed"
              />
              <div className="flex items-center justify-end px-3 pb-3">
                <button
                  onClick={() => sendMessage(text)}
                  disabled={!text.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm shadow-blue-200"
                >
                  Find Lawyer <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick prompts */}
          <div className="px-4 pt-3">
            <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wide font-medium">Common situations</p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => sendMessage(p.label)}
                  className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-all"
                >
                  {p.emoji} {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Trust signals */}
          <div className="px-4 pt-4 flex items-center gap-4">
            <div className="flex items-center gap-1 text-[11px] text-gray-400">
              <Shield className="w-3 h-3 text-green-500" /> Confidential
            </div>
            <div className="flex items-center gap-1 text-[11px] text-gray-400">
              <CheckCircle className="w-3 h-3 text-blue-500" /> Verified
            </div>
            <div className="flex items-center gap-1 text-[11px] text-gray-400">
              <Zap className="w-3 h-3 text-amber-500" /> Free AI
            </div>
          </div>

          {/* Full page CTA */}
          <div className="mt-auto px-4 py-3 border-t border-gray-100">
            <Link
              href="/intake"
              className="flex items-center justify-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Open full chat experience <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </>
      )}

      {/* ── CHAT MODE ── */}
      {!isDiscovery && (
        <>
          {/* Chat header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 leading-none">Amiquz AI</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Finding your lawyer</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setMessages([])}
                className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
              >
                Reset
              </button>
              <Link href="/intake" className="text-[11px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-0.5">
                Full chat <ArrowRight className="w-2.5 h-2.5" />
              </Link>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col custom-scrollbar">
            <div className="flex-1" />
            <div className="flex flex-col gap-2.5">
              {messages.map(m => (
                <div key={m.id} className={`flex items-end gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mb-0.5 ${m.role === 'user' ? 'bg-blue-600' : 'bg-gray-100 border border-gray-200'}`}>
                    {m.role === 'user'
                      ? <User className="w-3 h-3 text-white" />
                      : <Sparkles className="w-3 h-3 text-blue-600" />
                    }
                  </div>
                  <div className={`px-3 py-2 rounded-2xl max-w-[82%] text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}>
                    <div className="whitespace-pre-wrap">{m.content}</div>

                    {m.lawyers && m.lawyers.length > 0 && (
                      <div className="mt-2 bg-white border border-gray-200 rounded-xl p-2.5 shadow-sm">
                        <p className="text-[10px] font-semibold text-blue-700 mb-1.5 flex items-center gap-1">
                          <Scale className="w-3 h-3" /> Matched Lawyers
                        </p>
                        <div className="flex flex-col gap-1.5">
                          {m.lawyers.slice(0, 2).map((lawyer) => (
                            <div key={lawyer.id} className="bg-gray-50 rounded-lg p-2 flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                                <span className="text-white font-bold text-[10px]">{lawyer.name?.[0]}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-[11px] truncate">{lawyer.name}</p>
                                <p className="text-[10px] text-gray-500 truncate">{lawyer.practiceAreas?.[0]}</p>
                              </div>
                              <Link href={`/lawyers/${lawyer.id}`} className="bg-blue-600 text-white text-[10px] font-semibold px-2 py-1 rounded-md hover:bg-blue-700 shrink-0">
                                View
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-end gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 mb-0.5">
                    <Sparkles className="w-3 h-3 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-3 py-2">
                    <div className="flex gap-1 items-center h-3">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}} />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}} />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="px-3 py-2.5 border-t border-gray-100 shrink-0">
            <div className="flex gap-2 items-center bg-gray-100 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400 focus-within:bg-white transition-all border-2 border-transparent focus-within:border-blue-200">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); sendMessage(text); }
                }}
                placeholder="Reply…"
                disabled={isLoading}
                className="flex-1 bg-transparent outline-none text-gray-900 text-xs placeholder-gray-400"
              />
              <button
                onClick={() => sendMessage(text)}
                disabled={isLoading || !text.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg w-7 h-7 flex items-center justify-center shrink-0 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
      `}</style>
    </div>
  );
}
