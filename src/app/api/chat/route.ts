import { creditCardData } from "@/lib/data";
import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod.js";
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: process.env.GEMINI_BASE_URL,
});

const systemPrompt = `You are an expert financial assistant specializing in credit card recommendations and comparisons.
Your job is to understand a user's preferences and needs — such as reward points, cashback, travel benefits, annual fees, or interest rates — 
and suggest the most suitable credit cards available. Always ask relevant follow-up questions when necessary to better personalize your suggestions.
Keep your tone helpful, clear, and friendly.

For tables, please use the basic GFM table syntax and do NOT include any extra whitespace or tabs for alignment.
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

interface ChatRequest {
  messages?: ChatCompletionMessageParam[];
  userMessage: string;
}

export async function POST(request: Request) {
  try {
    const { messages, userMessage }: ChatRequest = await request.json();

    if (!userMessage || typeof userMessage !== "string") {
      return jsonResponse(400, { error: "Missing or invalid user message" });
    }

    const chatContext: ChatCompletionMessageParam[] = messages?.length
      ? [...messages]
      : [{ role: "system", content: systemPrompt }];

    chatContext.push({ role: "user", content: userMessage });

    const tools: ChatCompletionTool[] = [
      {
        type: "function",
        function: {
          name: "get_credit_cards_info",
          description:
            "Compare available credit cards or get info about individual credit cards. Use this if some one needs info about a credit card such as fees, benefits etc.",
          parameters: { type: "object", properties: {} },
        },
      },
    ];

    console.log(chatContext);
    const completion = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: chatContext,
      tools,
      tool_choice: "auto",
    });

    const choice = completion.choices[0];
    const assistantReply = choice.message.content;

    if (choice.message.tool_calls) {
      const toolCall = choice.message.tool_calls[0];

      chatContext.push({
        role: "assistant",
        content: choice.message.content,
        tool_calls: choice.message.tool_calls,
      });

      const toolResult = await creditCardDetailsTool(chatContext);

      if (!toolResult.textMessage) {
        return jsonResponse(400, {
          error: "Couldn't complete the chat completion",
        });
      }

      chatContext.push({
        role: "tool",
        content: JSON.stringify(toolResult),
        tool_call_id: toolCall.id,
      });

      return jsonResponse(200, { messages: chatContext });
    }

    if (!assistantReply) {
      return jsonResponse(500, { error: "Failed to generate response" });
    }

    chatContext.push({ role: "assistant", content: assistantReply });

    return jsonResponse(200, { messages: chatContext });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return jsonResponse(500, { error: "Failed to fetch completion" });
  }
}

function jsonResponse(status: number, body: object) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function creditCardDetailsTool(context: ChatCompletionMessageParam[]) {
  const chatContext = JSON.parse(JSON.stringify(context));

  for (let i = chatContext.length - 1; i >= 0; i--) {
    if (chatContext[i].role === "user" && chatContext[i].content) {
      chatContext[
        i
      ].content += `\n\nFollowing is the Credit Card data you can use to find the best options:\n\n${JSON.stringify(
        creditCardData,
        null,
        2
      )}`;
      break;
    }
  }

  const textCompletion = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: chatContext,
  });

  const textMessage = textCompletion.choices[0].message.content;

  if (!textMessage) return {};

  const jsonCompletion = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
      {
        role: "system",
        content: `Your job is to return the relevant credit cards mentioned in the user's message in JSON format.
Here are the available credit cards:\n\n${JSON.stringify(
          creditCardData,
          null,
          2
        )}`,
      },
      { role: "user", content: textMessage },
    ],
    response_format: zodResponseFormat(
      z.object({ cards: creditCardsArraySchema }),
      "credit_card_data"
    ),
  });

  const jsonContent = jsonCompletion.choices[0].message.content;

  if (!jsonContent) return {};

  const creditCards = JSON.parse(jsonContent);

  return { textMessage, creditCards };
}
