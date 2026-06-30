import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTERS = [
  "I need a full HUD system",
  "How much for a logo?",
  "I want a shop + inventory UI",
  "What's your cheapest option?",
];

export function AIPriceChat() {
  const [open, setOpen]       = useState(false);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey! 👋 Tell me what UI you need for your game and I'll give you a price estimate right away.",
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput("");

    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch("/api/commission-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      let reply = data.reply;
      if (!reply) {
        if (data.error === "quota_exceeded") {
          reply = "The AI estimator is temporarily offline (OpenAI quota reached). For pricing, check the Pricing section above or DM me on Discord: mysticfusion7x";
        } else if (data.error === "invalid_key") {
          reply = "AI service is misconfigured. For pricing, check the Pricing section or reach out on Discord.";
        } else {
          reply = "Something went wrong. For pricing, check the Pricing section above or DM me on Discord.";
        }
      }
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Couldn't reach the server. For pricing, check the Pricing section above or DM on Discord: mysticfusion7x" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        onClick={() => setOpen(o => !o)}
        title="AI Price Estimator"
        className="fixed bottom-6 left-6 z-[200] w-12 h-12 rounded-full flex items-center justify-center border border-white/15 backdrop-blur-md cursor-pointer"
        style={{
          background: open ? "rgba(100,0,255,0.30)" : "rgba(0,0,0,0.55)",
          boxShadow: open ? "0 0 24px var(--c-glow)" : "none",
          transition: "background 0.3s ease, box-shadow 0.3s ease",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="w-5 h-5 text-white" />
            </motion.span>
          ) : (
            <motion.span key="spark" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <Sparkles className="w-5 h-5" style={{ color: "var(--c-primary)" }} />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Pulse ring when closed to draw attention */}
        {!open && (
          <motion.span
            className="absolute inset-0 rounded-full pointer-events-none"
            animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            style={{ border: "1px solid var(--c-primary)" }}
          />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="fixed bottom-24 left-6 z-[199] w-80 rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: "rgba(6,6,18,0.92)",
              border: "1px solid rgba(255,255,255,0.09)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
              maxHeight: "420px",
            }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/7 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--c-glow-soft)", border: "1px solid var(--c-border)" }}>
                <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--c-primary)" }} />
              </div>
              <div>
                <p className="text-xs font-semibold text-white leading-none">Price Estimator</p>
                <p className="text-[10px] text-white/30 mt-0.5">AI-powered · Instant</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ minHeight: 0 }}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed"
                    style={
                      msg.role === "user"
                        ? {
                            background: "linear-gradient(135deg, var(--c-primary), var(--c-primary-dark))",
                            color: "#fff",
                            borderRadius: "12px 12px 2px 12px",
                          }
                        : {
                            background: "rgba(255,255,255,0.06)",
                            color: "rgba(255,255,255,0.75)",
                            borderRadius: "12px 12px 12px 2px",
                          }
                    }
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.06)", borderRadius: "12px 12px 12px 2px" }}>
                    <Loader2 className="w-3.5 h-3.5 text-white/40 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Starter prompts */}
            {messages.length === 1 && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                {STARTERS.map(s => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-[10px] px-2.5 py-1 rounded-full border border-white/10 text-white/45 hover:text-white/70 hover:border-white/25 transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-3 pb-3 pt-1 border-t border-white/7">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && send(input)}
                  placeholder="Describe your project..."
                  className="flex-1 h-9 px-3 rounded-xl text-xs text-white placeholder:text-white/25 focus:outline-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                />
                <button
                  onClick={() => send(input)}
                  disabled={!input.trim() || loading}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all btn-primary disabled:opacity-30"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
