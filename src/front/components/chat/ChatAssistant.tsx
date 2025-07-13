import React, { useState, useRef, useEffect } from "react";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";

type Role = "user" | "assistant";

interface Message {
  role: Role;
  content: string;
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (message: string) => {
    const userMessage: Message = { role: "user", content: message };
    const newMessages: Message[] = [...messages, userMessage];
    setMessages(newMessages);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    const botMessage: Message = { role: "assistant", content: data.reply };

    setMessages([...newMessages, botMessage]);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full border rounded-xl shadow bg-gray-50 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <ChatBubble
            key={idx}
            message={msg.content}
            isUser={msg.role === "user"}
          />
        ))}
        <div ref={bottomRef} />
      </div>
      <ChatInput onSend={sendMessage} />
    </div>
  );
}
