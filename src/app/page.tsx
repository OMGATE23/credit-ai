"use client";

import React, { useState } from "react";
import { MessageBubble } from "@/components/message_bubble";
import ToolResult from "@/components/tool_call";
import CreditCardCard from "@/components/credit_card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CreditCardBrowser from "@/components/credit_card_browser";
import { CreditCard } from "@/lib/types";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast, Toaster } from "sonner";

interface Message {
  role: "user" | "assistant" | "tool" | "system";
  content: string;
  tool_call_id?: string;
}

interface QnaResponse {
  summary: string;
  cards: CreditCard[];
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [qnaResult, setQnaResult] = useState<QnaResponse | null>(null);
  const [input, setInput] = useState("");
  const [userQuestionQna, setUserQuestionQna] = useState<string | null>(null);
  const [mode, setMode] = useState<"chat" | "qna" | "browse">("chat");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() && mode !== "browse") return;
    if (!input.trim() && mode === "qna" && !userQuestionQna) return;

    setLoading(true);
    const userMessageContent = input;
    setInput("");

    if (mode === "chat") {
      const userMessage = {
        role: "user" as const,
        content: userMessageContent,
      };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: messages,
          userMessage: userMessageContent,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: "An unknown error occurred." }));
        if (res.status >= 500) {
          toast.error("Gemini servers are down. Try again later");
        } else {
          toast.error(
            errorData.message || "Something went wrong. Please try again."
          );
        }
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (data.messages) {
        setMessages(
          data.messages.filter((msg: Message) => msg.role !== "system")
        );
      }
    } else if (mode === "qna") {
      if (userQuestionQna === null) {
        setUserQuestionQna(userMessageContent);
        setQnaResult(null);
        const res = await fetch("/api/qna", {
          method: "POST",
          body: JSON.stringify({ message: userMessageContent }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const errorData = await res
            .json()
            .catch(() => ({ message: "An unknown error occurred." }));
          if (res.status >= 500) {
            toast.error("Gemini servers are down. Try again later");
          } else {
            toast.error(
              errorData.message || "Something went wrong. Please try again."
            );
          }
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (data.data) {
          setQnaResult(data.data);
        }
      } else {
        setUserQuestionQna(null);
        setQnaResult(null);
      }
    }
    setLoading(false);
  };

  const handleModeChange = (selectedMode: "chat" | "qna" | "browse") => {
    setMode(selectedMode);
    setMessages([]);
    setQnaResult(null);
    setUserQuestionQna(null);
    setInput("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-xl shadow-sm bg-gray-100 p-1">
          <button
            onClick={() => handleModeChange("chat")}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              mode === "chat"
                ? "bg-gray-800 text-white shadow"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            Chat with CreditAI
          </button>
          <button
            onClick={() => handleModeChange("qna")}
            className={`ml-2 px-5 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              mode === "qna"
                ? "bg-gray-800 text-white shadow"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            Ask CreditAI (One-Shot)
          </button>
          <button
            onClick={() => handleModeChange("browse")}
            className={`ml-2 px-5 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              mode === "browse"
                ? "bg-gray-800 text-white shadow"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            Browse Credit Cards
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-3xl p-6 shadow-sm min-h-[400px] flex flex-col">
        {mode === "qna" && (
          <div className="mb-6">
            {!userQuestionQna ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 rounded-xl border border-gray-300 bg-white p-3 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-gray-300"
                  placeholder="Ask your credit card question..."
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  className="rounded-xl bg-gray-800 text-white px-4 py-2 text-sm shadow-sm hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  Ask
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-4 shadow-sm relative pr-10">
                <p className="font-semibold text-gray-800">Your Question:</p>
                <p className="text-gray-700 mt-1">{userQuestionQna}</p>
                <button
                  onClick={() => {
                    setUserQuestionQna(null);
                    setQnaResult(null);
                    setInput("");
                  }}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                  aria-label="Ask another question"
                >
                  <ReloadIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {mode === "browse" ? (
          <CreditCardBrowser />
        ) : (
          <div className="flex-grow overflow-y-auto pr-2">
            {mode === "chat" ? (
              messages.map((msg, i) =>
                msg.role === "tool" ? (
                  <ToolResult key={i} {...JSON.parse(msg.content)} />
                ) : (
                  <React.Fragment key={i}>
                    {msg.content && msg.role !== "system" && (
                      <MessageBubble message={msg.content} sender={msg.role} />
                    )}
                  </React.Fragment>
                )
              )
            ) : (
              <>
                {loading && (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                )}
                {qnaResult && !loading && (
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                      <h3 className="font-semibold text-gray-800 text-lg mb-3">
                        AI Response:
                      </h3>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ ...props }) => (
                            <p className="text-gray-800 text-sm mb-2">
                              {props.children}
                            </p>
                          ),
                          ul: ({ ...props }) => (
                            <ul className="list-disc pl-5 space-y-1 text-gray-800 text-sm">
                              {props.children}
                            </ul>
                          ),
                          ol: ({ ...props }) => (
                            <ol className="list-decimal pl-5 space-y-1 text-gray-800 text-sm">
                              {props.children}
                            </ol>
                          ),
                          li: ({ ...props }) => (
                            <li className="text-gray-800">{props.children}</li>
                          ),
                          a: ({ ...props }) => (
                            <a
                              href={props.href}
                              className="text-blue-600 underline"
                            >
                              {props.children}
                            </a>
                          ),
                          table: ({ ...props }) => (
                            <table className="w-full border border-gray-300 my-4 text-left text-sm">
                              {props.children}
                            </table>
                          ),
                          thead: ({ ...props }) => (
                            <thead className="bg-gray-100">
                              {props.children}
                            </thead>
                          ),
                          th: ({ ...props }) => (
                            <th className="border border-gray-300 px-3 py-2 font-semibold text-gray-700">
                              {props.children}
                            </th>
                          ),
                          td: ({ ...props }) => (
                            <td className="border border-gray-300 px-3 py-2 text-gray-800">
                              {props.children}
                            </td>
                          ),
                        }}
                      >
                        {qnaResult.summary}
                      </ReactMarkdown>
                    </div>
                    {qnaResult.cards.length > 0 && (
                      <div className="flex flex-wrap gap-4 justify-center">
                        {qnaResult.cards.map((card, i) => (
                          <CreditCardCard key={i} card={card} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
        {mode === "chat" && (
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 rounded-xl border border-gray-300 bg-white p-3 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-gray-300"
              placeholder="Type a message..."
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              className="rounded-xl bg-gray-800 text-white px-4 py-2 text-sm shadow-sm hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Send
            </button>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}
