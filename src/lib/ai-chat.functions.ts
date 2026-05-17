import { createServerFn } from "@tanstack/react-start";

type Msg = { role: "system" | "user" | "assistant"; content: string };

export const aiChat = createServerFn({ method: "POST" })
  .inputValidator((input: { messages: Msg[] }) => {
    if (!input || !Array.isArray(input.messages)) throw new Error("messages required");
    return input;
  })
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
        messages: [
          {
            role: "system",
            content:
              "You are the Discreetize in-app AI assistant. Help users with 3D mesh processing, STL/CAD workflows, slicing, healing, curvature analysis, and using the Discreetize app. Be concise, friendly, and technical when needed. Use markdown.",
          },
          ...data.messages,
        ],
      }),
    });

    if (res.status === 429) throw new Error("Rate limit exceeded. Try again shortly.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Settings.");
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`AI gateway error: ${res.status} ${t.slice(0, 200)}`);
    }

    const json = await res.json();
    const reply: string = json?.choices?.[0]?.message?.content ?? "";
    return { reply };
  });
