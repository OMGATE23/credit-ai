import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageBubbleProps {
  message: string;
  sender: "user" | "assistant";
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  sender,
}) => {
  return (
    <div
      className={`my-2 flex ${
        sender === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`rounded-2xl prose px-6 py-3 max-w-lg text-sm leading-relaxed shadow-sm ${
          sender === "user"
            ? "bg-gray-200 text-gray-900 flex items-center"
            : "bg-white text-gray-800"
        }`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            table: ({ ...props }) => (
              <table className="w-full border border-gray-300 my-4 text-left text-sm">
                {props.children}
              </table>
            ),
            thead: ({ ...props }) => (
              <thead className="bg-gray-100">{props.children}</thead>
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
            p: ({ ...props }) => (
              <p className="text-gray-800 text-sm">{props.children}</p>
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
              <a href={props.href} className="text-blue-600 underline">
                {props.children}
              </a>
            ),
          }}
        >
          {message}
        </ReactMarkdown>
      </div>
    </div>
  );
};
