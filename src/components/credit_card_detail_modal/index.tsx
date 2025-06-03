import { CreditCard } from "@/lib/types";
import { Cross1Icon, Link1Icon, InfoCircledIcon } from "@radix-ui/react-icons"; // Added InfoCircledIcon
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface CreditCardDetailModalProps {
  card: CreditCard;
  onClose: () => void;
}

export default function CreditCardDetailModal({
  card,
  onClose,
}: CreditCardDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors duration-200"
          aria-label="Close"
        >
          <Cross1Icon className="w-5 h-5" />
        </button>

        <h2 className="font-extrabold text-3xl text-gray-900 mb-2">
          {card.card_name}
        </h2>
        <p className="text-md text-gray-700 mb-4">{card.bank}</p>

        <a
          href={card.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 text-sm mb-6"
        >
          Learn More at {card.bank}
          <Link1Icon className="w-4 h-4 ml-1" />
        </a>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-800 mb-6 border-b border-gray-200 pb-6">
          <div>
            <p className="font-semibold">Annual Percentage Rate:</p>
            <p>{card.annual_percentage_rate}</p>
          </div>
          <div>
            <p className="font-semibold">Joining Fee:</p>
            <p>{card.joining_fee}</p>
          </div>
          <div>
            <p className="font-semibold">Annual Fee:</p>
            <p>{card.annual_fee}</p>
          </div>
        </div>

        <div className="space-y-6 text-gray-800">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-xl mb-2 text-blue-800 flex items-center">
              Summary
              <span className="ml-2 flex items-center text-sm text-blue-600 font-normal">
                <InfoCircledIcon className="w-4 h-4 mr-1" /> AI Generated
              </span>
            </h3>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {card.summary}
            </ReactMarkdown>
          </div>

          {card.benefits && card.benefits.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Benefits:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {card.benefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          )}

          {card.advantages && card.advantages.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 text-green-700 flex items-center">
                Advantages
                <span className="ml-2 flex items-center text-sm text-green-600 font-normal">
                  <InfoCircledIcon className="w-4 h-4 mr-1" /> AI Generated
                </span>
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-green-800">
                {card.advantages.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          {card.disadvantages && card.disadvantages.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 text-red-700 flex items-center">
                Disadvantages
                <span className="ml-2 flex items-center text-sm text-red-600 font-normal">
                  <InfoCircledIcon className="w-4 h-4 mr-1" /> AI Generated
                </span>
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-red-800">
                {card.disadvantages.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          )}

          {card.ratings && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2 text-purple-800 flex items-center">
                Ratings (out of 10)
                <span className="ml-2 flex items-center text-sm text-purple-600 font-normal">
                  <InfoCircledIcon className="w-4 h-4 mr-1" /> AI Generated
                </span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                {Object.entries(card.ratings).map(([key, value]) => (
                  <div key={key} className="bg-purple-100 p-2 rounded-lg">
                    <p className="capitalize font-medium text-gray-700">
                      {key.replace(/_/g, " ")}:
                    </p>
                    <div className="flex items-center">
                      <span className="font-bold text-gray-900 mr-2">
                        {value}
                      </span>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-purple-600 h-1.5 rounded-full"
                          style={{ width: `${(value / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-8 text-center border-t border-gray-100 pt-4">
          The Summary, Advantages, Disadvantages, and Ratings sections are
          generated by an AI model and should be used for informational purposes
          only. Always verify details with official sources.
        </p>
      </div>
    </div>
  );
}
