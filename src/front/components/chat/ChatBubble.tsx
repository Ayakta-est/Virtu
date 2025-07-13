import React from "react";
import clsx from "clsx";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
}

export default function ChatBubble({ message, isUser }: ChatBubbleProps) {
  return (
    <div className={clsx("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={clsx(
          "max-w-xs rounded-2xl px-4 py-2 m-1 text-sm shadow-md",
          isUser
            ? "bg-teal-500 text-white"
            : "bg-gray-100 text-gray-800"
        )}
      >
        {message}
      </div>
    </div>
  );
}
