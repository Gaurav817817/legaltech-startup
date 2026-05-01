'use client';
import { Send, Scale, User, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
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
  '🏢 Register a startup',
  '📄 Got a legal notice',
  '🏠 Property dispute',
  '👨‍👩‍👧 Family / divorce matter',
]

export default function IntakeChatPage() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
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
        content: 'Sorry, something went wrong. Please try again.',
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    const clean = prompt.replace(/^[\p{Emoji}\s]+/u, '').trim();
    sendMessage(clean)
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(text);
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-gray-50 overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-4 py-3 shadow-md shrink-0">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight">Amiquz AI Assistant</h1>
            <p className="text-blue-200 text-xs">Finds you the right lawyer</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 shrink-0">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-blue-200">Online</span>
          </div>
        </div>
      </div>

      {/* Messages — flex-1 scrollable, messages anchor to bottom */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-2xl mx-auto flex flex-col min-h-full px-4">

          {/* Spacer pushes messages to bottom when chat is short */}
          <div className="flex-1" />

          {/* Empty state */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center text-center py-8">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                <Scale className="w-7 h-7 text-blue-600" />
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 leading-tight">
                Talk to our AI.<br/>Get the right lawyer.
              </h2>
              <p className="text-gray-500 text-sm mt-2 max-w-xs leading-relaxed">
                Describe your legal problem in plain English. Our AI will find the best verified lawyer for you.
              </p>
              <div className="mt-5 w-full max-w-sm">
                <p className="text-xs text-gray-400 mb-2">Common situations:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleQuickPrompt(prompt)}
                      className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-blue-400 hover:text-blue-700 transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-5 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> AI guidance only — not a substitute for legal advice.
              </p>
            </div>
          )}

          {/* Messages */}
          <div className="flex flex-col gap-3 pb-4 pt-2">
            {messages.map(m => (
              <div key={m.id} className={`flex items-end gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-0.5 ${m.role === 'user' ? 'bg-blue-600' : 'bg-blue-100'}`}>
                  {m.role === 'user'
                    ? <User className="w-3.5 h-3.5 text-white" />
                    : <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  }
                </div>
                <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'}`}>
                  <div className="whitespace-pre-wrap">{m.content}</div>

                  {m.lawyers && m.lawyers.length > 0 && (
                    <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 mb-2 text-blue-800 font-semibold text-xs">
                        <Scale className="w-3.5 h-3.5" /> Recommended Lawyers
                      </div>
                      <div className="flex flex-col gap-2">
                        {m.lawyers.map((lawyer) => (
                          <div key={lawyer.id} className="bg-white border border-gray-200 rounded-lg p-2.5 flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                              <span className="text-blue-700 font-bold text-xs">{lawyer.name?.[0]}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-900 text-xs truncate">{lawyer.name}</p>
                              <p className="text-[11px] text-gray-500 truncate">{lawyer.practiceAreas?.join(', ')}</p>
                              {lawyer.location && <p className="text-[11px] text-gray-400 truncate">{lawyer.location}</p>}
                            </div>
                            <Link href={`/lawyers/${lawyer.id}`} className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-blue-700 shrink-0 flex items-center gap-1">
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
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mb-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm">
                  <div className="flex gap-1 items-center h-4">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}}></div>
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}></div>
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar — always at bottom */}
      <div className="shrink-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 items-end bg-gray-100 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all border border-transparent focus-within:border-blue-200">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your legal issue…"
              rows={1}
              disabled={isLoading}
              className="flex-1 bg-transparent border-none outline-none text-gray-900 text-sm placeholder-gray-400 resize-none leading-relaxed py-1 max-h-[120px]"
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
