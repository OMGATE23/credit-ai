import React from "react";
import CreditCardCard from "../credit_card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type CreditCard = {
  bank: string;
  card_name: string;
  url: string;
  annual_percentage_rate: string;
  joining_fee: string;
  annual_fee: string;
  benefits: string[];
};

type CreditCardResponse = {
  cards: CreditCard[];
};

interface ToolResultProps {
  textMessage: string;
  creditCards?: CreditCardResponse;
}

export default function ToolResult({
  textMessage,
  creditCards,
}: ToolResultProps) {
  return (
    <div className="my-4 p-4 rounded-2xl bg-white space-y-4 shadow-sm">
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
            <p className="text-gray-800 text-sm mb-2">{props.children}</p>
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
        {textMessage}
      </ReactMarkdown>

      {creditCards && creditCards.cards.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {creditCards.cards.map((card, i) => (
            <CreditCardCard key={i} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}
