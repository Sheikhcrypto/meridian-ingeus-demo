import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const payloadSchema = z.object({
  kind: z.enum([
    "support-plan",
    "session-notes",
    "caseload-brief",
    "cv-rewrite",
    "interview",
    "job-why",
    "ops-briefing",
  ]),
  context: z.string().max(8000),
});

export type AiKind = z.infer<typeof payloadSchema>["kind"];

const SYSTEM = `You are Meridian, an AI assistant inside a UK employment services platform used by providers such as Ingeus on DWP-commissioned programmes (Restart-style / Future Employment Support).

Tone: plain English, warm, precise, never patronising. British spelling. No emoji. No marketing fluff.

Rules:
- AI drafts; a human advisor always decides.
- Respect barriers (health, caring, housing, justice, neurodiversity) without stereotyping.
- Use the four-pillar frame: My Life, My Skills, My Work, My Aspirations.
- Prefer concrete next actions with owners and timeboxes.
- Never invent DWP policy, benefit amounts, or medical advice.
- Do not mention that you are Grok or an xAI model.
- Do not use markdown. No asterisks, hashes, or backticks. Plain text with short headings and dash bullets.`;

const INSTRUCTIONS: Record<AiKind, string> = {
  "support-plan":
    "Write a personalised support plan the advisor can accept. Use short sections: Focus, 4-week actions (bullets with owner), interventions, risks to watch, what good looks like. 180-280 words.",
  "session-notes":
    "Turn the advisor's rough bullets into a clean case note: what was discussed, agreed actions, risk, next contact. 90-140 words. Past tense. Professional.",
  "caseload-brief":
    "Write a start-of-day briefing for one advisor. Group by: act now, keep moving, watch. Name people. 140-200 words.",
  "cv-rewrite":
    "Rewrite the professional summary only (not a full CV). 70-110 words, first person, honest, ATS-friendly, no exaggeration. Match the job goal and hours they can actually work.",
  interview:
    "You are running a realistic job interview for the role they want. If there is no answer yet, ask ONE opening question. If there is an answer, give 3 short sentences of feedback (what worked, what to tighten, a better phrasing) then ask the next question. Stay in a UK competency style (situation, action, result).",
  "job-why":
    "Explain why this vacancy is or isn't a fit, in 90-130 words. Be honest about hours, location, adjustments, and skill gaps. End with one suggested next step.",
  "ops-briefing":
    "Write a weekly programme performance narrative for a contract manager. Cover starts, sustainment, DNA, at-risk, and one recommendation. 150-200 words. No hype.",
};

export const runMeridianAi = createServerFn({ method: "POST" })
  .validator((input: unknown) => payloadSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI is not available in this environment." };
    }

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 700,
        temperature: 0.5,
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: `${INSTRUCTIONS[data.kind]}\n\nContext:\n${data.context}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      return { ok: false as const, error: `The assistant could not respond (${res.status}).` };
    }

    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = body.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) return { ok: false as const, error: "The assistant returned an empty draft." };
    return { ok: true as const, text };
  });
