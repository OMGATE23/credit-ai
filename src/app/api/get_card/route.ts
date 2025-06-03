import { creditCardData } from "@/lib/data";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.js";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: process.env.GEMINI_BASE_URL,
});

const SYSTEM_PROMPT = `
You are a credit card suggestor. 
Your job is to suggest the Best Credit card/s based on the user's requirements. 
Also, at the end, if you find more than 1 card which fits the user's needs, make sure
you add some explanation which will tell which card to choose based on certain preferences, conditions, requirements.
Following are the credit card details you will need to consider

${JSON.stringify(creditCardData, null, 2)}
`;

const creditCardSchema = z.object({
  bank: z.string(),
  card_name: z.string(),
  url: z.string(),
  annual_percentage_rate: z.string(),
  joining_fee: z.string(),
  annual_fee: z.string(),
  benefits: z.array(z.string()),
});

const creditCardsArraySchema = z.array(creditCardSchema);

const creditCardSummary = z.object({
  cards: creditCardsArraySchema,
  summary: z.string({ description: "Answer for the user's question" }),
});

export async function POST(request: Request) {
  const { message }: { message: string } = await request.json();

  if (!message) {
    return jsonResponse(500, { message: "No message sent" });
  }

  const response = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: message },
    ],
    response_format: zodResponseFormat(creditCardSummary, "credit_summary"),
  });

  const output = response.choices[0].message.content;
  if (!output) {
    return jsonResponse(500, { message: "Failed to generate output" });
  } else {
    return jsonResponse(200, { data: JSON.parse(output) });
  }
}

function jsonResponse(status: number, body: object) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
