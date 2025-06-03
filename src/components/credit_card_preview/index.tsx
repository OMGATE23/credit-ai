import { CreditCard } from "@/lib/types";
import React from "react";

interface CreditCardPreviewProps {
  card: CreditCard;
  onMoreDetails: (card: CreditCard) => void;
}

export default function CreditCardPreview({
  card,
  onMoreDetails,
}: CreditCardPreviewProps) {
  const displayBenefits = card.benefits.slice(0, 3);

  return (
    <div className="rounded-xl p-5 shadow-md bg-white border border-gray-100 hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-xl text-gray-900 mb-1">
          {card.card_name}
        </h3>
        <p className="text-sm text-gray-600 mb-3">{card.bank}</p>

        <div className="text-xs text-gray-700 space-y-1 mb-4">
          <p>
            <strong>Joining Fee:</strong> {card.joining_fee}
          </p>
          <p>
            <strong>Annual Fee:</strong> {card.annual_fee}
          </p>
        </div>

        {displayBenefits.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 text-sm mb-1">
              Key Benefits:
            </h4>
            <ul className="list-disc pl-5 text-xs text-gray-700 space-y-0.5">
              {displayBenefits.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
              {card.benefits.length > 3 && (
                <li className="font-semibold text-gray-500">...and more</li>
              )}
            </ul>
          </div>
        )}
      </div>
      <button
        onClick={() => onMoreDetails(card)}
        className="mt-4 w-full cursor-pointer bg-gray-800 text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-700 transition-colors duration-200"
      >
        More Details
      </button>
    </div>
  );
}
