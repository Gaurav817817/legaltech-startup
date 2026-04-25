// @ts-nocheck
'use client';
import { useChat } from '@ai-sdk/react';
import { Send, Scale, User, Bot, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function IntakeChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    maxSteps: 5,
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-primary-900 text-white py-6 px-4 shadow-md text-center shrink-0">
        <Scale className="w-8 h-8 mx-auto mb-2 text-primary-200" />
        <h1 className="text-2xl font-bold">LegalLink AI Assistant</h1>
        <p className="text-primary-100 text-sm mt-1 max-w-xl mx-auto">
          Describe your legal issue below. I will help you understand the context and immediately connect you with the right verified lawyers.
        </p>
      </div>

      <div className="flex-1 max-w-3xl w-full mx-auto p-4 flex flex-col gap-4 overflow-y-auto mt-4 mb-32">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Hi! How can I help you with your legal needs today?</p>
            <p className="text-sm mt-2 max-w-md mx-auto">Example: "I am starting a tech company and need to know how to structure it," or "I received a traffic ticket in New York."</p>
          </div>
        )}

        {messages.map(m => (
          <div key={m.id} className="flex flex-col gap-2">
            <div className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-primary-600' : 'bg-gray-200'}`}>
                {m.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-gray-600" />}
              </div>
              <div className={`px-4 py-3 rounded-2xl max-w-[85%] ${m.role === 'user' ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'}`}>
                <div className="whitespace-pre-wrap">{m.content}</div>
                
                {/* Render Tool Invocations (Lawyer Recommendations) */}
                {m.toolInvocations?.map((toolInvocation: any) => {
                  const toolCallId = toolInvocation.toolCallId;
                  
                  if (toolInvocation.toolName === 'recommendLawyers' && toolInvocation.state === 'result') {
                    const result = toolInvocation.result;
                    return (
                      <div key={toolCallId} className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-3 text-primary-800 font-semibold">
                          <Scale className="w-5 h-5" />
                          Recommended Lawyers for {result.practiceArea}
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{result.reasoning}</p>
                        
                        <div className="flex flex-col gap-3">
                          {result.results.map((lawyer: any) => (
                            <div key={lawyer.id} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-4 hover:shadow-md transition-shadow">
                              <img src={lawyer.image} alt={lawyer.name} className="w-12 h-12 rounded-full object-cover" />
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-sm">{lawyer.name}</h4>
                                <p className="text-xs text-gray-500">{lawyer.practiceAreas.join(', ')}</p>
                              </div>
                              <Link href={`/lawyers/${lawyer.id}`} className="bg-primary-50 text-primary-700 p-2 rounded-full hover:bg-primary-100 transition-colors">
                                <ArrowRight className="w-4 h-4" />
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  
                  if (toolInvocation.toolName === 'recommendLawyers' && toolInvocation.state === 'call') {
                     return <div key={toolCallId} className="text-sm text-gray-500 italic flex items-center gap-2 mt-2">
                       <div className="animate-spin w-3 h-3 border-2 border-primary-600 border-t-transparent rounded-full" />
                       Finding the best lawyers for you...
                     </div>
                  }
                })}

              </div>
            </div>
            
            {/* Disclaimer for first AI message */}
            {m.role === 'assistant' && messages.findIndex(msg => msg.role === 'assistant') === messages.indexOf(m) && (
               <div className="text-xs text-gray-400 flex items-center gap-1 ml-12 mb-2">
                 <AlertTriangle className="w-3 h-3" /> AI generated response. Not legal advice.
               </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 p-4 z-10">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Explain your legal situation..."
              className="flex-1 border border-gray-300 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input?.trim()}
              className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center shrink-0 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-colors"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </form>
          <div className="text-center mt-2 text-xs text-gray-400">
            Messages are processed by OpenAI. Do not share highly sensitive PII.
          </div>
        </div>
      </div>
    </div>
  );
}
