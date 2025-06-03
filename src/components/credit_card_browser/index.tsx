"use client";

import React, { useState } from "react";
import CreditCardPreview from "../credit_card_preview";
import CreditCardDetailModal from "../credit_card_detail_modal";
import { creditCardData } from "@/lib/data";
import { CreditCard } from "@/lib/types";

export default function CreditCardBrowser() {
  const creditCards = creditCardData;
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);

  const handleOpenModal = (card: CreditCard) => {
    setSelectedCard(card);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  return (
    <div className="flex-grow overflow-y-auto pr-2 pb-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Explore Credit Cards
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creditCards.map((card) => (
          <CreditCardPreview
            key={card.card_name}
            card={card}
            onMoreDetails={handleOpenModal}
          />
        ))}
      </div>

      {selectedCard && (
        <CreditCardDetailModal card={selectedCard} onClose={handleCloseModal} />
      )}
    </div>
  );
}
