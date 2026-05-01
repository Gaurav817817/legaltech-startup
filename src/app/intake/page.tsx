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
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setIsLoading(true)

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

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-4 px-4 shadow-md shrink-0">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Amiquz AI Assistant</h1>
            <p className="text-blue-200 text-xs mt-0.5">Finds you the right lawyer</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 shrink-0">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-blue-200">Online</span>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 max-w-3xl w-full mx-auto flex flex-col overflow-y-auto pb-6">

        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center px-4 pt-10 pb-4 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-5">
              <Scale className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
              Talk to our AI.<br/>Get the right lawyer.
            </h2>
            <p className="text-gray-500 text-sm mt-3 max-w-sm leading-relaxed">
              Just describe your legal problem in plain English — like you&apos;re telling a friend. Our AI will understand your situation and recommend the best verified lawyer for you.
            </p>

            <div className="mt-6 w-full max-w-md">
              <p className="text-xs text-gray-400 mb-2">Or pick a common situation:</p>
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

            <p className="text-xs text-gray-400 mt-6 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> AI guidance only — not a substitute for legal advice.
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="px-4 pt-4 flex flex-col gap-4">
          {messages.map(m => (
            <div key={m.id} className="flex flex-col gap-1">
              <div className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-blue-600' : 'bg-blue-100'}`}>
                  {m.role === 'user'
                    ? <User className="w-4 h-4 text-white" />
                    : <Sparkles className="w-4 h-4 text-blue-600" />
                  }
                </div>
                <div className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'}`}>
                  <div className="whitespace-pre-wrap">{m.content}</div>

                  {m.lawyers && m.lawyers.length > 0 && (
                    <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2 text-blue-800 font-semibold text-sm">
                        <Scale className="w-4 h-4" /> Recommended Lawyers
                      </div>
                      <div className="flex flex-col gap-2">
                        {m.lawyers.map((lawyer) => (
                          <div key={lawyer.id} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                              <span className="text-blue-700 font-bold text-sm">{lawyer.name?.[0]}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-900 text-sm truncate">{lawyer.name}</p>
                              <p className="text-xs text-gray-500 truncate">{lawyer.practiceAreas?.join(', ')}</p>
                              {lawyer.location && <p className="text-xs text-gray-400 truncate">{lawyer.location}</p>}
                            </div>
                            <Link href={`/lawyers/${lawyer.id}`} className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-700 shrink-0 flex items-center gap-1">
                              View <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                <div className="flex gap-1 items-center h-5">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="bg-white border-t-2 border-blue-100 shadow-2xl z-20 px-4 py-4 shrink-0">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!text.trim()) return;
              sendMessage(text);
              setText('');
            }}
          >
            <div className="flex gap-3 items-end">
              <div className="flex-1 bg-white border-2 border-blue-400 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100 rounded-2xl px-4 py-4 transition-all shadow-md">
                <textarea
                  ref={inputRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (!text.trim()) return;
                      sendMessage(text);
                      setText('');
                    }
                  }}
                  placeholder="e.g. My landlord is refusing to return my deposit. What can I do?"
                  className="w-full bg-transparent border-none outline-none text-gray-900 text-sm placeholder-gray-400 resize-none leading-relaxed"
                  rows={4}
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !text.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl w-14 h-14 flex items-center justify-center shrink-0 shadow-lg transition-colors"
              >
                <Send className="w-5 h-5 ml-0.5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Describe your situation in plain English · AI will recommend the right lawyer · Not legal advice
            </p>
          </form>
        </div>
      </div>

    </div>
  );
}
