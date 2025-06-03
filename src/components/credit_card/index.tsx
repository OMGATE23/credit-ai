import React from "react";

interface CreditCard {
  bank: string;
  card_name: string;
  url: string;
  annual_percentage_rate: string;
  joining_fee: string;
  annual_fee: string;
  benefits: string[];
}

export default function CreditCardCard({ card }: { card: CreditCard }) {
  return (
    <div className=" rounded-xl p-3 shadow-sm bg-white w-64">
      <h3 className="font-semibold text-lg">{card.card_name}</h3>
      <p className="text-sm text-gray-600 mb-1">{card.bank}</p>
      <p className="text-xs mb-1">APR: {card.annual_percentage_rate}</p>
      <p className="text-xs mb-1">Joining Fee: {card.joining_fee}</p>
      <p className="text-xs mb-1">Annual Fee: {card.annual_fee}</p>
      <ul className="list-disc pl-4 text-xs mt-2">
        {card.benefits.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  );
}
