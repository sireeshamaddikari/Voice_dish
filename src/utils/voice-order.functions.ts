import { createServerFn } from "@tanstack/react-start";

type Msg = { role: "system" | "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are Tara, the friendly AI order-taker for Tandoor.ai, a modern Indian restaurant.

Menu (name — price in INR):
- Butter Chicken — 320
- Hyderabadi Biryani — 280
- Paneer Tikka — 260
- Garlic Naan — 60
- Tandoori Roti — 30
- Masala Dosa — 140
- Mango Lassi — 90
- Gulab Jamun (2 pc) — 80
- Veg Thali — 220
- Chicken Tikka Masala — 340

RULES:
- Keep replies SHORT (1-2 sentences max) — this is spoken aloud.
- Greet warmly on first turn, then guide: ask what they'd like.
- Confirm each item with quantity. Suggest naan/lassi as add-ons.
- When the customer says they're done, summarize the order with total in rupees and ask for their name & phone.
- After they give name+phone, confirm the order is placed and give an ETA of 25-30 minutes.
- Speak in the language the user uses (English, Hindi, or Hinglish).
- Never mention you are an AI model. You are Tara from Tandoor.ai.`;

export const voiceOrderChat = createServerFn({ method: "POST" })
  .inputValidator((input: { messages: Msg[] }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...data.messages],
      }),
    });

    if (res.status === 429) throw new Error("Rate limit hit. Try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Settings → Workspace → Usage.");
    if (!res.ok) throw new Error(`AI error: ${res.status}`);

    const json = await res.json();
    const reply: string = json.choices?.[0]?.message?.content ?? "Sorry, I didn't catch that.";
    return { reply };
  });
