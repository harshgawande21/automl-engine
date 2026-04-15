import { Bot, Send, X, Minimize2, Maximize2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { findAnswer } from '../../data/mlKnowledge';

const SUGGESTIONS = [
  'What is ML?', 'Types of ML', 'What is overfitting?',
  'Explain Random Forest', 'What is SHAP?', 'How to use AutoInsight?'
];

export default function MLChatbot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1, from: 'bot',
      text: "Hi! I'm your ML Assistant 🤖\nAsk me anything about Machine Learning — basics, algorithms, metrics, or how to use AutoInsight!",
      time: new Date()
    }
  ]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open && !minimized) inputRef.current?.focus();
  }, [open, minimized]);

  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');

    const userMsg = { id: Date.now(), from: 'user', text: msg, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);

    setTimeout(() => {
      const answer = findAnswer(msg);
      setTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'bot', text: answer, time: new Date() }]);
    }, 600 + Math.random() * 400);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* Floating Robot Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 group"
          title="ML Assistant"
        >
          <div className="relative">
            {/* Pulse ring */}
            <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-30" />
            {/* Robot body */}
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-pink-500 shadow-2xl shadow-blue-500/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Bot size={28} className="text-white" />
            </div>
            {/* Badge */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          </div>
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Ask ML Assistant
          </div>
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className={`fixed bottom-6 right-6 z-50 w-96 bg-white rounded-2xl shadow-2xl border border-blue-200 flex flex-col transition-all duration-300 ${minimized ? 'h-16' : 'h-[560px]'}`}>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-pink-500 rounded-t-2xl">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Bot size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">ML Assistant</p>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                <p className="text-blue-100 text-xs">Always online</p>
              </div>
            </div>
            <button onClick={() => setMinimized(!minimized)} className="text-white/80 hover:text-white transition-colors p-1">
              {minimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white transition-colors p-1">
              <X size={16} />
            </button>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-blue-50/30 to-white">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                    {msg.from === 'bot' && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot size={14} className="text-white" />
                      </div>
                    )}
                    <div className={`max-w-[78%] ${msg.from === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      <div className={`px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                        msg.from === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-br-sm'
                          : 'bg-white border border-blue-100 text-slate-700 rounded-bl-sm shadow-sm'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-xs text-slate-400 px-1">{formatTime(msg.time)}</span>
                    </div>
                  </div>
                ))}

                {typing && (
                  <div className="flex justify-start gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Bot size={14} className="text-white" />
                    </div>
                    <div className="bg-white border border-blue-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                      <div className="flex gap-1 items-center">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Suggestions */}
              <div className="px-3 py-2 border-t border-blue-100 flex gap-2 overflow-x-auto scrollbar-hide">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="flex-shrink-0 px-3 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full border border-blue-200 transition-colors whitespace-nowrap"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="p-3 border-t border-blue-100">
                <div className="flex gap-2 items-end">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Ask about ML..."
                    rows={1}
                    className="flex-1 px-3 py-2 text-sm border border-blue-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-blue-50/50 text-slate-700 placeholder-slate-400"
                    style={{ maxHeight: '80px' }}
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim()}
                    className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-500 to-pink-500 flex items-center justify-center text-white disabled:opacity-40 hover:shadow-lg hover:scale-105 transition-all flex-shrink-0"
                  >
                    <Send size={15} />
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-1 text-center">Press Enter to send</p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
