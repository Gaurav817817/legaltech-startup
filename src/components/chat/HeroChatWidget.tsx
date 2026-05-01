'use client';
import { Send, Scale, User, Bot, ArrowRight } from 'lucide-react';
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

export default function HeroChatWidget() {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
        content: 'Something went wrong. Please try again.',
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-[32px] p-4 sm:p-5 w-full lg:w-[380px] shadow-2xl flex flex-col h-[480px]">

      {/* Widget Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg relative">
          <Bot className="w-5 h-5 text-white" />
          <div className="absolute inset-0 border-2 border-white rounded-full animate-ping opacity-20"></div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Personal Assistant</h3>
          <p className="text-xs text-blue-200">Online & Ready to help</p>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto pr-2 mb-3 custom-scrollbar flex flex-col">
        <div className="flex-1" />
        {messages.length === 0 && (
          <div className="text-center mt-4">
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 inline-block text-left relative">
              <Bot className="w-8 h-8 mb-2 text-yellow-400" />
              <p className="text-sm text-blue-50 leading-relaxed font-medium">
                👋 Hi there! I&apos;m your personal legal assistant. <br/><br/>
                Tell me briefly what&apos;s going on, and I&apos;ll find the perfect lawyer to help you right now.
              </p>
              <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white/10 border-r border-b border-white/20 transform rotate-45"></div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
        {messages.map(m => (
          <div key={m.id} className="flex flex-col gap-2">
            <div className={`flex items-start gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-blue-600' : 'bg-white text-blue-900'}`}>
                {m.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-[85%] ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none shadow-md'}`}>
                <div className="whitespace-pre-wrap">{m.content}</div>

                {m.lawyers && m.lawyers.length > 0 && (
                  <div className="mt-3 bg-gray-50 border border-gray-100 rounded-xl p-3 shadow-inner">
                    <div className="flex items-center gap-1.5 mb-2 text-blue-800 font-semibold text-xs">
                      <Scale className="w-4 h-4" /> Top Matches
                    </div>
                    <div className="flex flex-col gap-2">
                      {m.lawyers.slice(0, 2).map((lawyer) => (
                        <div key={lawyer.id} className="bg-white border border-gray-200 rounded-lg p-2.5 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <span className="text-blue-700 font-bold text-sm">{lawyer.name?.[0]}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 text-xs truncate">{lawyer.name}</h4>
                            <p className="text-[10px] text-gray-500 truncate">{lawyer.practiceAreas?.[0]}</p>
                          </div>
                          <Link href={`/lawyers/${lawyer.id}`} className="bg-blue-50 text-blue-700 p-1.5 rounded-full hover:bg-blue-100 shrink-0">
                            <ArrowRight className="w-3.5 h-3.5" />
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
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-full bg-white text-blue-900 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white text-gray-800 rounded-2xl rounded-tl-none shadow-md px-4 py-2.5">
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

      {/* Input Area */}
      <div className="mt-auto pt-2 relative z-20">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          sendMessage(text);
          setText('');
        }} className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your legal issue..."
            className="flex-1 bg-white/10 border border-white/20 text-white placeholder-blue-200 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all shadow-inner text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !text.trim()}
            className="bg-white text-blue-900 rounded-full w-11 h-11 flex items-center justify-center shrink-0 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </form>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
      `}</style>
    </div>
  );
}
