import { createServerFn } from "@tanstack/react-start";
import { serverEnv } from "./env";

type Msg = { role: "system" | "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are Tara, the friendly AI order-taker for Tandoor.ai.

MENU (id — name — price INR):
1 — Paneer Tikka — 280
2 — Chicken 65 — 320
3 — Veg Manchurian — 240
4 — Butter Chicken — 420
5 — Paneer Butter Masala — 360
6 — Dal Makhani — 280
7 — Hyderabadi Chicken Biryani — 380
8 — Veg Dum Biryani — 320
9 — Garlic Naan — 80
10 — Butter Roti — 40
11 — Gulab Jamun — 140
12 — Mango Lassi — 120
13 — Masala Chai — 60

You MUST reply with STRICT JSON only (no markdown, no prose outside JSON):
{
  "reply": "<short spoken sentence, 1-2 sentences>",
  "actions": [ { "type": "add" | "remove" | "clear", "id": "<menu id>", "qty": <number> } ]
}

Rules:
- "actions" is required (use [] when nothing to change).
- Use "add" with the EXACT menu id whenever the user orders or adds more of an item. qty is how many to add.
- Use "remove" to remove an item entirely. Use "clear" to empty the cart.
- Keep "reply" short, warm, conversational — it will be spoken aloud. Confirm what you added.
- Speak the user's language (English / Hindi / Hinglish).
- Never mention you are an AI or that you output JSON.`;

export const voiceOrderChat = createServerFn({ method: "POST" })
  .inputValidator((input: { messages: Msg[] }) => input)
  .handler(async ({ data }) => {
    const apiKey = serverEnv("GEMINI_API_KEY", "VITE_GEMINI_API_KEY");
    if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

    const contents = data.messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { responseMimeType: "application/json" },
        }),
      },
    );

    if (res.status === 429) throw new Error("Rate limit hit. Try again in a moment.");
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`AI error (${res.status}): ${t.slice(0, 200)}`);
    }

    const json = await res.json();
    const raw: string = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

    let reply = "Sorry, I didn't catch that.";
    let actions: { type: "add" | "remove" | "clear"; id?: string; qty?: number }[] = [];
    try {
      const cleaned = raw.replace(/^```json\s*|\s*```$/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (typeof parsed.reply === "string") reply = parsed.reply;
      if (Array.isArray(parsed.actions)) actions = parsed.actions;
    } catch {
      reply = raw;
    }
    return { reply, actions };
  });
