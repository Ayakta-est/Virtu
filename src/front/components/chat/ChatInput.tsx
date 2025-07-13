import React, { useState } from "react";
import Button from "../../components/ui/Button";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="flex items-center gap-2 border-t p-3 bg-white">
      <input
        type="text"
        placeholder="Escribe tu duda..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 border rounded-xl px-4 py-2 text-sm"
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <Button onClick={handleSend} className="text-sm">Enviar</Button>
    </div>
  );
}
