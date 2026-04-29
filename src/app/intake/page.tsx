// @ts-nocheck
'use client';
import { useChat } from '@ai-sdk/react';
import { Send, Scale, User, Bot, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const QUICK_PROMPTS = [
  { icon: '🏢', text: 'I want to register a startup or company' },
  { icon: '📄', text: 'I received a legal notice and need help' },
  { icon: '👨‍👩‍👧', text: 'I need help with a family or divorce matter' },
  { icon: '🏠', text: 'I have a property or rent dispute' },
  { icon: '💼', text: 'My employer is not paying my dues' },
  { icon: '⚖️', text: 'I need help understanding a contract' },
]

export default function IntakeChatPage() {
  const [text, setText] = useState('');
  const { messages, append, isLoading } = useChat({ maxSteps: 5 });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleQuickPrompt = (prompt) => {
    append({ role: 'user', content: prompt });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-6 px-4 shadow-md shrink-0">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Amiquz AI Assistant</h1>
            <p className="text-blue-200 text-sm mt-0.5">Describe your legal issue — I'll help you understand it and find the right lawyer.</p>
          </div>
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-blue-200">Online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 max-w-3xl w-full mx-auto p-4 flex flex-col gap-4 overflow-y-auto mt-2 mb-32">

        {/* Empty state */}
        {messages.length === 0 && (
          <div className="mt-4">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Scale className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">How can I help you today?</h2>
              <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">Tell me your legal situation in plain language — no legal jargon needed. I'll guide you and connect you with the right lawyer.</p>
            </div>

            {/* Quick prompt cards */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 text-center">Quick start — tap any topic</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt.text}
                  onClick={() => handleQuickPrompt(prompt.text)}
                  className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-left hover:border-blue-400 hover:shadow-sm transition-all group"
                >
                  <span className="text-2xl shrink-0">{prompt.icon}</span>
                  <span className="text-sm text-gray-700 font-medium group-hover:text-blue-700">{prompt.text}</span>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 ml-auto shrink-0" />
                </button>
              ))}
            </div>

            <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-1">
              <AlertTriangle className="w-3 h-3" /> AI responses are for guidance only — not legal advice.
            </p>
          </div>
        )}

        {/* Messages */}
        {messages.map(m => (
          <div key={m.id} className="flex flex-col gap-2">
            <div className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-blue-600' : 'bg-blue-100'}`}>
                {m.role === 'user'
                  ? <User className="w-5 h-5 text-white" />
                  : <Sparkles className="w-4 h-4 text-blue-600" />
                }
              </div>
              <div className={`px-4 py-3 rounded-2xl max-w-[85%] ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'}`}>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</div>

                {/* Lawyer recommendations */}
                {m.toolInvocations?.map((toolInvocation) => {
                  const toolCallId = toolInvocation.toolCallId;
                  if (toolInvocation.toolName === 'recommendLawyers' && toolInvocation.state === 'result') {
                    const result = toolInvocation.result;
                    return (
                      <div key={toolCallId} className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3 text-blue-800 font-semibold text-sm">
                          <Scale className="w-4 h-4" />
                          Recommended Lawyers for {result.practiceArea}
                        </div>
                        <p className="text-xs text-gray-500 mb-3">{result.reasoning}</p>
                        <div className="flex flex-col gap-2">
                          {result.results && result.results.length > 0 ? (
                            result.results.map((lawyer) => (
                              <div key={lawyer.id} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3 hover:shadow-sm transition-shadow">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                  <span className="text-blue-700 font-bold text-sm">{lawyer.name?.[0]}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-gray-900 text-sm truncate">{lawyer.name}</h4>
                                  <p className="text-xs text-gray-500 truncate">{lawyer.practiceAreas?.join(', ')}</p>
                                </div>
                                <Link href={`/lawyers/${lawyer.id}`} className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-700 shrink-0">
                                  View
                                </Link>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm italic">No exact match found. <Link href="/contact" className="text-blue-600 underline">Contact us</Link> and we'll help manually.</p>
                          )}
                        </div>
                      </div>
                    );
                  }
                  if (toolInvocation.toolName === 'recommendLawyers' && toolInvocation.state === 'call') {
                    return (
                      <div key={toolCallId} className="text-xs text-gray-500 italic flex items-center gap-2 mt-2">
                        <div className="animate-spin w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full" />
                        Finding the best lawyers for you...
                      </div>
                    );
                  }
                })}
              </div>
            </div>
            {m.role === 'assistant' && messages.findIndex(msg => msg.role === 'assistant') === messages.indexOf(m) && (
              <div className="text-xs text-gray-400 flex items-center gap-1 ml-12">
                <AlertTriangle className="w-3 h-3" /> AI guidance only — not legal advice.
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
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

      {/* Input bar */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 p-3 z-10 shadow-lg">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!text.trim()) return;
              append({ role: 'user', content: text });
              setText('');
            }}
            className="flex gap-2"
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Describe your legal situation..."
              className="flex-1 border border-gray-300 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-gray-900"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !text.trim()}
              className="bg-blue-600 text-white rounded-full w-11 h-11 flex items-center justify-center shrink-0 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-colors"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
          <p className="text-center mt-2 text-xs text-gray-400">
            Powered by Amiquz AI · Not a substitute for legal advice
          </p>
        </div>
      </div>
    </div>
  );
}
