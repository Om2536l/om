import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles, AlertCircle } from "lucide-react";
import { ChatMessage } from "../types";

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      role: "model",
      text: "Hello there! I am Om Lasure's AI research Co-Pilot. I have direct access to Om's technical blueprints, academic history, and engineering aspirations. Ask me anything about him!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const endOfChatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endOfChatRef.current) {
      endOfChatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const messageText = customText || input;
    if (!messageText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Proxy chat payload to Express server `/api/chat`
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          // Extract message text historical log
          history: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const modelMsg: ChatMessage = {
        id: `msg-${Date.now()}-model`,
        role: "model",
        text: data.text || "I was unable to retrieve a response from the central server.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: "model",
        text: "My neural network links are temporarily in offline sandbox mode, but you can review his rich structural portfolio panels right here, or contact Om at omlasure2536@gmail.com!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const SUGGESTED_INQUIRIES = [
    "What are Om's core skills?",
    "Tell me about the Neural Network Visualizer.",
    "Is Om seeking collaborations or jobs?",
    "Explain Om's Geopolitics interest.",
  ];

  return (
    <>
      {/* Absolute Bottom-Right Floating chat bubble trigger */}
      <div className="fixed bottom-6 right-6 z-[100] animate-bounce-slow">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-primary-container transition-all hover:scale-110 relative group border-2 border-white/20"
          aria-label="Open AI Assistant"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500"></span>
              </span>
            </>
          )}

          {/* Hover tooltips */}
          <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-[#0c0d1b] text-white text-[11px] font-mono px-3 py-1.5 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none">
            ⚡ Ask Om's AI Assistant
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-[390px] h-[520px] bg-white rounded-[2rem] border border-outline/15 shadow-2xl flex flex-col overflow-hidden animate-fade-in z-[110] text-[#191c1d]">
          {/* Header */}
          <div className="bg-[#111224] p-4 text-white flex justify-between items-center border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/20">
                <Bot className="w-5 h-5 text-primary-container" />
              </div>
              <div>
                <div className="font-display font-extrabold text-sm flex items-center gap-1.5 leading-none">
                  Core Gemini AI Assistant
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                </div>
                <span className="text-[10px] font-mono text-white/50 block">OM_ASST_CORE_v2.5</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* System sandbox banner */}
          <div className="bg-primary/10 text-primary-container text-[10px] font-mono p-2.5 text-center flex items-center justify-center gap-1 border-b border-primary/10">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Direct grounded neural retrieval concerning Om Lasure
          </div>

          {/* Chats panel messages stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-container-low">
            {messages.map((m) => {
              const isModel = m.role === "model";
              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 max-w-[85%] ${isModel ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${isModel ? "bg-white border-outline/10 text-primary" : "bg-primary border-primary text-white"}`}>
                    {isModel ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1">
                    <div className={`p-3 rounded-2xl text-[12px] font-mono leading-relaxed shadow-sm ${isModel ? "bg-white border border-outline/10 text-on-surface" : "bg-[#5b5ee1] text-white text-left"}`}>
                      {m.text}
                    </div>
                    <span className="text-[9px] font-mono text-outline block text-right">
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-2.5 mr-auto">
                <div className="w-7 h-7 rounded-lg bg-white border border-outline/10 text-primary flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-outline/10 p-3 rounded-2xl text-xs font-mono max-w-[85%] text-on-surface flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                  </span>
                  Compiling retrieval outputs...
                </div>
              </div>
            )}
            <div ref={endOfChatRef} />
          </div>

          {/* Suggestion tags list */}
          <div className="bg-white border-t border-outline/10 p-2 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-thin scrollbar-thumb-rounded">
            {SUGGESTED_INQUIRIES.map((tag) => (
              <button
                key={tag}
                disabled={loading}
                onClick={(e) => handleSendMessage(e, tag)}
                className="px-2.5 py-1 bg-[#edeeef] hover:bg-[#c7c5d6] text-[10px] font-mono rounded-lg border border-outline/5 cursor-pointer text-on-surface transition-all shrink-0"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Footer input form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-outline/10 flex gap-2"
          >
            <input
              type="text"
              required
              disabled={loading}
              placeholder="Ask me anything about Om..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-surface-container-low border border-outline/20 px-4 py-2.5 rounded-xl text-xs font-mono focus:outline-none focus:border-primary focus:bg-white text-on-surface"
            />
            <button
              type="submit"
              disabled={loading}
              className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary-container transition-all flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
