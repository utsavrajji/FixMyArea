import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Bot, X, Send } from "lucide-react";

const SYSTEM_PROMPT = `
You are the official AI Assistant for "FixMyArea". 
FixMyArea is a community-driven platform where citizens can report local civic issues (like broken roads, garbage accumulation, electricity, water supply problems, etc.).
Your job is to guide users on how to use the site, how to report issues, and explain the benefits of the platform.

Here is the essential information about FixMyArea:
- **How to Report an Issue**: Go to the 'Report Issue' page. Upload a clear photo of the problem, select the exact location (using GPS or manual map), choose a category, write a short description, and submit.
- **Benefits**: It brings visibility to ignored problems. Authorities and other citizens can see the reports, upvote them, and track their resolution status.
- **Status meaning**: Pending (just reported), Under Review (authorities checking), In Progress (work started), Resolved (fixed).
- **Features**: Dashboard shows analytics and community feed. Local Issues page has a map of all problems.
- **Tone**: Helpful, friendly, inspiring, and concise. Short paragraphs are better.
- **Language**: You can speak in English, Hindi, or Hinglish depending on how the user asks.

If the user asks something completely unrelated to civic issues, government help, or the website itself, politely decline and steer them back to FixMyArea topics.
`;

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "model", text: "Hello! 👋 I'm the FixMyArea AI Assistant. Need help understanding how to report an issue or use the site?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const location = useLocation();

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Don't show chatbot on admin pages
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setInput("");
    const newMessages = [...messages, { role: "user", text: trimmed }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Missing Gemini API Key in .env file (VITE_GEMINI_API_KEY).");
      }

      // Format history for Gemini API
      const contents = newMessages.map(msg => ({
        role: msg.role === "model" ? "model" : "user",
        parts: [{ text: msg.text }]
      }));

      const payload = {
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: contents
      };

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Something went wrong processing the AI request.");
      }

      const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (botReply) {
        setMessages(prev => [...prev, { role: "model", text: botReply }]);
      } else {
        throw new Error("Got empty response from AI.");
      }
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages(prev => [...prev, { 
        role: "model", 
        text: error.message.includes("VITE_GEMINI_API_KEY") 
          ? "⚠️ FixMyArea Admin: Please add VITE_GEMINI_API_KEY to your .env file to enable the AI Chatbot." 
          : "⚠️ Sorry, I encountered an error. Please try asking again later." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-[#064E3B] to-emerald-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:shadow-emerald-500/30 hover:scale-110 transition-all duration-300 ${isOpen ? "hidden" : "flex"}`}
      >
        <Bot className="w-7 h-7 animate-bounce" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[350px] max-w-[90vw] h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-fade-in-up">
          
          {/* Header */}
          <div className="bg-[#064E3B] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6" />
              <div>
                <h3 className="font-bold text-sm">FixMyArea Assistant</h3>
                <p className="text-[10px] text-emerald-200 uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Online
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === "user" 
                    ? "bg-[#064E3B] text-white rounded-br-none self-end" 
                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-none self-start"
                }`}
              >
                {/* Parse basic markdown like **bold** (optional, keeping it raw for safety but simple replace works) */}
                {msg.text.split('\\n').map((line, i) => (
                  <span key={i}>{line}<br/></span>
                ))}
              </div>
            ))}
            
            {loading && (
              <div className="bg-white text-gray-800 border border-gray-100 max-w-[85%] px-4 py-3 rounded-2xl rounded-bl-none self-start shadow-sm flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-gray-100 border-transparent rounded-xl px-4 py-2 text-sm focus:bg-white focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/20 outline-none transition"
              disabled={loading}
            />
            <button 
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-[#064E3B] text-white w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-[#053d2f] transition"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
