import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/products";

// Initialize the Google GenAI SDK on the server side.
// The key is automatically injected by the environment into GEMINI_API_KEY.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request payload. 'messages' array is required." },
        { status: 400 }
      );
    }

    // Format the conversation history for the Gemini API
    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const systemInstruction = `You are the "ApnaBazaar AI Assistant" (अपनाबाजार एआई सहायक) for "ApnaBazaar", an Indian premium e-commerce application inspired by Amazon & Flipkart. 

Your goal is to help users find the best products, make smart buying recommendations, compare specifications, and answer general shopping questions.

Here is the COMPLETE and REAL product catalog of ApnaBazaar:
${JSON.stringify(products, null, 2)}

CRITICAL INSTRUCTIONS FOR CORRESPONDENCE:
1. Always suggest products that exist in our catalog. Mention their exact name, price in INR (e.g. ₹1,499), ratings, and key reasons why they are a perfect match.
2. If the user asks for a category or specific item we DO NOT have (e.g., iPhone, Smart TV, Fridge), politely state that we don't have that specific model in stock right now, and suggest the nearest alternative from our available catalog (e.g. recommend Redmi Note 13 Pro if they ask for a smartphone).
3. TRICK FOR THE SYSTEM: When you mention or recommend any product from our catalog in your text, ALWAYS append the exact marker "[PRODUCT_ID: <id>]" (for example, "[PRODUCT_ID: prod-1]") right next to or after mentioning it. Our frontend system automatically scans for this marker and turns it into a high-visibility, clickable, interactive product card where users can add the item to their cart immediately!
4. LANGUAGE COHERENCE: Speak in the language or script the user uses.
   - If they write in Hindi (Devanagari): Speak in polite, rich Devanagari Hindi.
   - If they write in Hinglish (Hindi written in Roman letters, e.g., "Mera budget 2000 hai, watch batao"): Speak in natural, warm Hinglish or simple easy Hindi.
   - If they write in English: Speak in clear, professional, warm English.
5. Tone must be exceptionally warm, welcoming, polite, and helpful. Always greet them with "Namaste!" (नमस्ते!) or "Swagat hai!" (स्वागत है!) if it is the start of the chat.
6. Keep recommendations short, engaging, and easy to read. Use bullet points for comparisons or specifications.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I am sorry, I couldn't process that. Please try again.";

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json(
      { error: "Failed to communicate with the AI assistant. " + (error?.message || "") },
      { status: 500 }
    );
  }
}
