export interface CreditCard {
  bank: string;
  card_name: string;
  url: string;
  annual_percentage_rate: string;
  joining_fee: string;
  annual_fee: string;
  benefits: string[];
  summary: string;
  advantages: string[];
  disadvantages: string[];
  ratings: {
    [key: string]: number;
  };
}
