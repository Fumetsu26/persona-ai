"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { SparklesIcon } from "@heroicons/react/24/solid";

const personas = {
  hitesh: {
    name: "Hitesh Choudhary",
    avatar: "https://pbs.twimg.com/profile_images/1724344976715468800/MasktpKz_400x400.jpg",
    color: "bg-orange-500",
    icon: <SparklesIcon className="w-5 h-5 text-orange-500 inline-block mr-1" />,
  },
  piyush: {
    name: "Piyush Garg",
    avatar: "https://pbs.twimg.com/profile_images/1879075502356586496/V9wQzW7V_400x400.jpg",
    color: "bg-blue-500",
    icon: <SparklesIcon className="w-5 h-5 text-blue-500 inline-block mr-1" />,
  },
  user: {
    name: "You",
    avatar: "https://pbs.twimg.com/profile_images/1830309834144751616/2qGzoKBC_400x400.jpg",
    color: "bg-blue-700",
    icon: null,
  },
};

export default function Home() {
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handlePersonaSelection = (persona) => {
    setSelectedPersona(persona);
    setMessages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    setIsLoading(true);
    const userMessage = { role: "user", content: userInput, ts: new Date().toLocaleTimeString() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setUserInput("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, persona: selectedPersona }),
      });
      if (!response.ok) throw new Error("Network error");
      const data = await response.json();
      const aiMessage = { role: "model", content: data.reply, ts: new Date().toLocaleTimeString() };
      setMessages([...newMessages, aiMessage]);
    } catch {
      setMessages([...newMessages, { role: "model", content: "Sorry, something went wrong.", ts: new Date().toLocaleTimeString() }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedPersona) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tl from-gray-900 via-gray-800 to-gray-900 text-white px-4">
        <h1 className="text-5xl font-extrabold mb-12 tracking-tight">Choose a Persona</h1>
        <div className="flex flex-col md:flex-row gap-8 max-w-4xl w-full justify-center">
          {["hitesh", "piyush"].map((key) => (
            <button
              key={key}
              onClick={() => handlePersonaSelection(key)}
              className={`flex flex-col items-center bg-gray-800 rounded-xl p-6 shadow-lg cursor-pointer transition-all hover:scale-105 focus:ring-4 focus:ring-offset-2 focus:ring-${key === "hitesh" ? "orange" : "blue"}-400`}
            >
              <div className="relative mb-3">
                <Image src={personas[key].avatar} alt={personas[key].name} width={100} height={100} className="rounded-full border-4 border-gray-700" />
                <span className="absolute bottom-0 right-0 bg-white rounded-full p-1">
                  {personas[key].icon}
                </span>
              </div>
              <span className="text-lg font-semibold mt-1">{personas[key].name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-900/85 py-4 px-6 flex items-center justify-between shadow-lg sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Image src={personas[selectedPersona].avatar} alt="persona" width={36} height={36} className="rounded-full border-2 border-orange-500" />
          <span className="text-xl font-semibold tracking-tight flex items-center gap-1 text-white">
            {personas[selectedPersona].icon}
            {personas[selectedPersona].name}
          </span>
        </div>
        <button onClick={() => setSelectedPersona(null)} className="bg-gray-800 px-3 py-1 rounded text-gray-300 hover:bg-gray-700 text-sm">
          Change Persona
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-2 sm:px-8 py-8 space-y-6">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 italic pt-16">
            Start the conversation by typing your message below.
          </div>
        )}

        {messages.map((msg, idx) => {
          const isUser = msg.role === "user";
          const pKey = isUser ? "user" : selectedPersona;
          return (
            <div
              key={idx}
              className={`flex ${isUser ? "justify-end" : "justify-start"} ${isUser ? "" : "fade-in"} items-end group`}
            >
              {!isUser && (
                <Image
                  src={personas[pKey].avatar}
                  alt={personas[pKey].name}
                  width={36}
                  height={36}
                  className="rounded-full border-2 border-gray-700 shadow mr-2"
                />
              )}
              <div
                className={`rounded-xl max-w-[80vw] px-5 py-3 shadow-md transition-all duration-300 animate-pop
                  ${isUser ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-100"} `}
                style={{ minWidth: 80 }}
              >
                <div className="whitespace-pre-wrap text-base">{msg.content}</div>
                <div className="text-xs text-gray-400 font-light mt-1">{personas[pKey].name}{msg.ts && <> · <span className="ml-1">{msg.ts}</span></>}</div>
              </div>
              {isUser && (
                <Image
                  src={personas[pKey].avatar}
                  alt="You"
                  width={36}
                  height={36}
                  className="rounded-full border-2 border-gray-700 shadow ml-2"
                />
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 animate-chat">
            <Image src={personas[selectedPersona].avatar} alt="" width={32} height={32} className="rounded-full border-2 border-gray-700" />
            <div className="px-4 py-2 rounded-lg bg-gray-700 text-gray-100 flex gap-1 items-center">
              <span>Typing</span>
              <span className="dot-typing ml-1">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="sticky bottom-0 bg-gray-900/90 w-full pt-3 pb-3 px-2 border-t border-gray-800">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask anything..."
            aria-label="Type your message"
            autoFocus
            disabled={isLoading}
            className="flex-grow rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 h-11 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base transition text-white"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-blue-600 px-6 py-2 text-base font-semibold hover:bg-blue-700 transition disabled:bg-blue-900 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </form>
      </footer>
     
      <style jsx global>{`
        @keyframes chat-fade {
          from { opacity: 0; transform: translateY(24px);}
          to   { opacity: 1; transform: translateY(0);}
        }
        .animate-chat {
          animation: chat-fade 0.5s cubic-bezier(.39,.58,.57,1) !important;
        }
        @keyframes pop {
          0%   { opacity: 0; transform: scale(0.95);}
          100% { opacity: 1; transform: scale(1);}
        }
        .animate-pop {
          animation: pop 0.25s cubic-bezier(.27,.85,.7,1.4);
        }
        .dot-typing span {
          animation: blink 1.4s infinite both;
          font-weight: bold;
          font-size: 1.4em;
        }
        .dot-typing span:nth-child(2) { animation-delay: 0.2s; }
        .dot-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink {
          0%, 100% { opacity: .2 }
          20% { opacity: 1 }
        }
      `}</style>
    </div>
  );
}
