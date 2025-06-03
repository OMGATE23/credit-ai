"use client";

import React, { useState } from "react";
import { MessageBubble } from "@/components/message_bubble";
import ToolResult from "@/components/tool_call";

interface Message {
  role: "user" | "assistant" | "tool";
  content: string;
  tool_call_id?: string;
}

export default function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: messages,
        userMessage: input,
      }),
    });

    const data = await res.json();

    if (data.messages) {
      setMessages(data.messages.filter((msg) => msg.role !== "system"));
    }
  };

  console.log(messages);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <div className="h-[80vh] overflow-y-auto bg-gray-50 rounded-3xl p-6 shadow-sm space-y-3">
        {messages.map((msg, i) =>
          msg.role === "tool" ? (
            <ToolResult key={i} {...JSON.parse(msg.content)} />
          ) : (
            <React.Fragment key={i}>
              {msg.content && (
                <MessageBubble message={msg.content} sender={msg.role} />
              )}
            </React.Fragment>
          )
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 rounded-xl border border-gray-300 bg-white p-3 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-gray-300"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="rounded-xl bg-gray-800 text-white px-4 py-2 text-sm shadow-sm hover:bg-gray-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
