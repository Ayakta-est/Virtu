import React, { useState, useRef, useEffect } from "react";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

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

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        throw new Error(`Error del servidor: ${res.status}`);
      }

      const data = await res.json();

      const botMessage: Message = {
        role: "assistant",
        content: data.reply || "No se recibió respuesta del asistente.",
      };

      setMessages([...newMessages, botMessage]);
    } catch (error) {
      console.error("Error en sendMessage:", error);

      const errorMessage: Message = {
        role: "assistant",
        content:
          "⚠️ Hubo un error al contactar con el asistente. Por favor, intenta más tarde.",
      };

      setMessages([...newMessages, errorMessage]);
    }
  };

  const loadWelcomeMessage = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: "saludo_inicial" }),
      });

      if (!res.ok) {
        throw new Error(`Error del servidor: ${res.status}`);
      }

      const data = await res.json();

      const welcomeMessage: Message = {
        role: "assistant",
        content: data.reply || "Hola, ¿en qué puedo ayudarte?",
      };

      setMessages([welcomeMessage]);
    } catch (error) {
      console.error("Error en loadWelcomeMessage:", error);

      const fallbackMessage: Message = {
        role: "assistant",
        content:
          "⚠️ No se pudo cargar el saludo inicial del asistente. Intenta más tarde.",
      };

      setMessages([fallbackMessage]);
    }
  };

  useEffect(() => {
    loadWelcomeMessage();
  }, []);

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
