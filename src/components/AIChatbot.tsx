import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, User, Bot, AlertCircle, RefreshCcw, Maximize2, X, ChevronRight } from 'lucide-react';
import { chatWithAI } from '../services/geminiService';
import { cn } from '../lib/utils';
import Markdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export default function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: "Hello! I'm EstraVelle, your virtual health companion. ✨ How are you feeling in your body and mind today? I'm here to listen and support you with anything related to PCOD, your cycle, or just navigating your health journey. 🌿",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedMessage, setExpandedMessage] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await chatWithAI(userMessage.text, history);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm so sorry, I encountered a little hiccup. Could you please try again? 💜",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col space-y-4 md:space-y-6 overflow-hidden">
      <header className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-700 italic">Ask EstraVelle</h2>
          <p className="text-slate-500 mt-1 italic text-base md:text-lg">A safe, empathetic space for your health & hormonal well-being. ✨</p>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])}
          className="p-3 md:p-4 text-slate-400 hover:text-serenity-purple hover:bg-white rounded-2xl transition-all border border-transparent hover:border-soft-pink/20 shadow-sm"
          title="Reset conversation"
        >
          <RefreshCcw size={20} />
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 bg-white/40 backdrop-blur-md rounded-[2rem] md:rounded-[3rem] border border-soft-pink/10 shadow-2xl overflow-hidden flex flex-col relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 md:space-y-8 scrollbar-hide">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex items-start gap-3 md:gap-6 max-w-[95%] md:max-w-[85%] relative",
                  message.role === 'user' ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-inner",
                  message.role === 'user' ? "bg-serenity-purple text-white shadow-lg shadow-serenity-purple/20" : "bg-white text-cura-purple border border-soft-pink/20 shadow-sm"
                )}>
                  {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={cn(
                  "relative group flex flex-col min-w-0 transition-all",
                  message.role === 'user' ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] text-sm md:text-base leading-relaxed shadow-md transition-all group-hover:shadow-lg",
                    message.role === 'user' 
                      ? "bg-serenity-purple text-white rounded-tr-none" 
                      : "bg-white text-slate-700 rounded-tl-none border border-soft-pink/5"
                  )}>
                    <div className="prose prose-slate prose-sm md:prose-base max-w-none prose-p:leading-relaxed prose-headings:font-serif prose-headings:italic prose-p:text-current">
                      <Markdown>{message.text}</Markdown>
                    </div>
                    
                    <div className={cn(
                      "flex items-center justify-between mt-4 md:mt-6 gap-6",
                      message.role === 'user' ? "text-white/60" : "text-slate-400"
                    )}>
                      <span className="text-xs transition-opacity group-hover:opacity-100 italic">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.role === 'model' && message.text.length > 200 && (
                        <button 
                          onClick={() => setExpandedMessage(message)}
                          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest hover:text-serenity-purple transition-colors bg-slate-50/50 px-3 py-1 rounded-full border border-soft-pink/10"
                        >
                          <Maximize2 size={12} />
                          Full View
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex items-center gap-3 text-slate-400 italic text-sm ml-12 md:ml-16"
            >
              <div className="flex gap-1.5 p-2 bg-white rounded-full border border-soft-pink/10 shadow-sm">
                <span className="w-2 h-2 bg-lavender rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-lavender rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-lavender rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              EstraVelle is weaving words...
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Advisory */}
        <div className="px-6 md:px-10 py-3 md:py-4 bg-soft-pink/5 border-t border-soft-pink/10 flex items-center justify-center gap-3">
          <AlertCircle size={14} className="text-serenity-purple/40 shrink-0" />
          <p className="text-[10px] md:text-xs text-serenity-purple/40 font-medium italic text-center">
            EstraVelle is your supportive health companion. ✨ For clinical concerns, always reach out to a healthcare professional.
          </p>
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-8 bg-white/60 border-t border-soft-pink/10">
          <div className="relative max-w-5xl mx-auto flex items-center gap-4">
            <div className="relative flex-1 group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="How are you feeling today?..."
                className="w-full bg-white border border-soft-pink/20 rounded-[1.5rem] md:rounded-[2.5rem] px-5 md:px-10 py-3 md:py-5 pr-14 md:pr-20 text-base md:text-lg focus:outline-none focus:ring-4 focus:ring-lavender/10 transition-all shadow-inner placeholder:italic group-focus-within:border-soft-pink/40"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 md:p-4 bg-serenity-purple text-white rounded-xl md:rounded-[1.75rem] shadow-xl shadow-serenity-purple/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
              >
                <Send size={20} className="md:w-7 md:h-7" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded View Modal */}
      <AnimatePresence>
        {expandedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpandedMessage(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-lavender/20"
            >
              <div className="absolute top-6 right-6 z-10">
                <button 
                  onClick={() => setExpandedMessage(null)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-all shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-hide">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-lavender/20 rounded-2xl flex items-center justify-center text-cura-purple shadow-inner">
                    <Bot size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-slate-700 italic">EstraVelle's Support</h3>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Thoughtful Response</p>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none prose-slate prose-p:leading-relaxed prose-headings:font-serif prose-headings:italic prose-headings:text-slate-700">
                  <Markdown>{expandedMessage.text}</Markdown>
                </div>
                
                <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Sparkles size={14} className="text-lavender" />
                    <span>Holistic Guidance</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {expandedMessage.timestamp.toLocaleDateString()} at {expandedMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
