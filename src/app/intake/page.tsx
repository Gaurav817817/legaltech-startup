'use client';
import {
  Send, Scale, User, ArrowRight, Sparkles,
  Shield, CheckCircle, Zap, ArrowLeft,
} from 'lucide-react';
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
  { emoji: '💼', label: 'Employment issue' },
  { emoji: '🚔', label: 'Criminal matter' },
]

const TRUST_SIGNALS = [
  { icon: Shield, text: 'Confidential', color: 'text-green-600' },
  { icon: CheckCircle, text: 'Verified Lawyers', color: 'text-blue-600' },
  { icon: Zap, text: 'Free AI Matching', color: 'text-amber-500' },
]

export default function IntakeChatPage() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatTextareaRef = useRef<HTMLTextAreaElement>(null);
  const heroTextareaRef = useRef<HTMLTextAreaElement>(null);

  const isDiscovery = messages.length === 0;

  useEffect(() => {
    if (!isDiscovery) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages, isLoading, isDiscovery]);

  // Auto-resize chat textarea
  useEffect(() => {
    const el = chatTextareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }, [text]);

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
        body: JSON.stringify({
          messages: nextMessages.map(m => ({
            role: m.role,
            content: m.role === 'model' && m.lawyers?.length
              ? m.content + `\n[Lawyers shown: ${m.lawyers.map((l: Lawyer) => `${l.name}${l.fee ? ` (₹${l.fee})` : ''}`).join(', ')}]`
              : m.content,
          })),
        }),
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
        content: 'Sorry, something went wrong. Please try again.',
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(text);
    }
  };

  // ─── DISCOVERY MODE ──────────────────────────────────────────────────────────
  if (isDiscovery) {
    return (
      <div className="h-[100dvh] flex flex-col bg-white overflow-hidden">

        {/* Minimal top bar */}
        <header className="shrink-0 px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            AI Online
          </div>
        </header>

        {/* Centered hero content */}
        <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl">

            {/* Icon + heading */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-200">
                <Scale className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                What&apos;s your legal situation?
              </h1>
              <p className="text-gray-500 mt-3 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
                Describe it in plain English. Our AI will find the right verified lawyer for you in seconds.
              </p>
            </div>

            {/* Main input box */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-xl shadow-gray-100 focus-within:border-blue-500 focus-within:shadow-blue-100 transition-all duration-200">
              <textarea
                ref={heroTextareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(text);
                  }
                }}
                placeholder="e.g. My landlord is refusing to return my security deposit and threatening me. What can I do?"
                rows={4}
                className="w-full px-5 pt-5 pb-3 bg-transparent outline-none text-gray-900 placeholder-gray-400 resize-none text-base leading-relaxed rounded-t-2xl"
              />
              <div className="flex items-center justify-between px-4 pb-4 pt-1">
                <span className="text-xs text-gray-400 hidden sm:block">Enter to send · Shift+Enter for new line</span>
                <button
                  onClick={() => sendMessage(text)}
                  disabled={!text.trim()}
                  className="ml-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-colors shadow-md shadow-blue-200"
                >
                  Find My Lawyer <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick prompts */}
            <div className="mt-5">
              <p className="text-xs text-gray-400 text-center mb-3">Common situations — click to start</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => sendMessage(p.label)}
                    className="text-sm bg-gray-50 border border-gray-200 text-gray-600 px-4 py-2 rounded-full hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-all"
                  >
                    {p.emoji} {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust signals */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              {TRUST_SIGNALS.map(({ icon: Icon, text: label, color }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-gray-500">
                  <Icon className={`w-4 h-4 ${color}`} />
                  {label}
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
              AI guidance only — not a substitute for legal advice from a licensed lawyer.
            </p>

          </div>
        </div>
      </div>
    );
  }

  // ─── CHAT MODE ───────────────────────────────────────────────────────────────
  return (
    <div className="h-[100dvh] flex flex-col bg-gray-50 overflow-hidden">

      {/* Chat header */}
      <header className="shrink-0 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => setMessages([])}
            className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100"
            title="Start over"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-none">Amiquz AI Assistant</p>
            <p className="text-xs text-gray-400 mt-0.5">Finding your lawyer</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400">Online</span>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-2xl mx-auto flex flex-col min-h-full px-4">
          <div className="flex-1" />

          <div className="flex flex-col gap-3 py-4">
            {messages.map(m => (
              <div key={m.id} className={`flex items-end gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-0.5 ${m.role === 'user' ? 'bg-blue-600' : 'bg-white border border-gray-200 shadow-sm'}`}>
                  {m.role === 'user'
                    ? <User className="w-3.5 h-3.5 text-white" />
                    : <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  }
                </div>
                <div className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
                }`}>
                  <div className="whitespace-pre-wrap">{m.content}</div>

                  {m.lawyers && m.lawyers.length > 0 && (
                    <div className="mt-3 -mx-1 bg-blue-50 border border-blue-100 rounded-xl p-3">
                      <p className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5" /> Matched Lawyers
                      </p>
                      <div className="flex flex-col gap-2">
                        {m.lawyers.map((lawyer) => (
                          <div key={lawyer.id} className="bg-white border border-gray-200 rounded-lg p-2.5 flex items-center gap-3 shadow-sm">
                            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                              <span className="text-white font-bold text-sm">{lawyer.name?.[0]}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-xs truncate">{lawyer.name}</p>
                              <p className="text-[11px] text-gray-500 truncate">{lawyer.practiceAreas?.join(', ')}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                {lawyer.location && <p className="text-[11px] text-gray-400">{lawyer.location}</p>}
                                {lawyer.fee && <p className="text-[11px] text-blue-600 font-medium">₹{lawyer.fee}</p>}
                              </div>
                            </div>
                            <Link
                              href={`/lawyers/${lawyer.id}`}
                              className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-700 shrink-0 flex items-center gap-1 whitespace-nowrap"
                            >
                              View <ArrowRight className="w-3 h-3" />
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
                <div className="w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center shrink-0 mb-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center h-4">
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
      </div>

      {/* Input bar */}
      <div className="shrink-0 bg-white border-t border-gray-100 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 items-end bg-gray-100 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-400 focus-within:bg-white transition-all border-2 border-transparent focus-within:border-blue-200">
            <textarea
              ref={chatTextareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Reply…"
              rows={1}
              disabled={isLoading}
              className="flex-1 bg-transparent border-none outline-none text-gray-900 text-sm placeholder-gray-400 resize-none leading-relaxed py-1.5 max-h-[120px]"
            />
            <button
              onClick={() => sendMessage(text)}
              disabled={isLoading || !text.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl w-9 h-9 flex items-center justify-center shrink-0 transition-colors mb-0.5"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mt-1.5 text-center">
            Enter to send · Shift+Enter for new line · Not legal advice
          </p>
        </div>
      </div>

    </div>
  );
}
