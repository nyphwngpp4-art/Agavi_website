import Anthropic from "@anthropic-ai/sdk";
import { DIMENSIONS } from "@/data/questions";
import type { ClaudeInsights, ScoringResult } from "@/lib/types";

const PILLAR_LIST = [
  "CRM Intelligence",
  "Financial Automation",
  "Customer Service AI",
  "Sales Enablement",
  "Operations & Logistics",
  "Marketing Intelligence",
];

function buildPrompt(
  answers: Record<string, number>,
  scores: ScoringResult,
  businessName: string
): string {
  const dimensionLines = scores.dimensionScores
    .map((d) => `  ${d.name}: ${d.score}/4 (${d.rating})`)
    .join("\n");

  const top3Lines = scores.top3Pillars
    .map((p, i) => `  ${i + 1}. ${p}`)
    .join("\n");

  const answerLines = DIMENSIONS.map((dim) => {
    const score = answers[dim.id] ?? 1;
    const answer = dim.answers.find((a) => a.score === score);
    return `  ${dim.name}: "${answer?.text ?? "not answered"}"`;
  }).join("\n");

  return `You are a senior advisor at Agavi AI, a boutique AI integration consultancy serving founder-led small businesses (1–50 employees, $150K–$5M revenue).

A prospect named "${businessName}" has completed the Agavi Operational Diagnostic.

THEIR ANSWERS:
${answerLines}

DIMENSION SCORES:
${dimensionLines}

OVERALL:
  Urgency Score: ${scores.urgency}/10
  Readiness: ${scores.readiness}

HIGHEST-OPPORTUNITY AREAS (lowest scores):
${top3Lines}

Based on this diagnostic, return ONLY a valid JSON object with no markdown, no explanation, no wrapper text — just the raw JSON:

{
  "executive_summary": "2–3 sentences. Plain language. No buzzwords. Speak directly to the founder. Name their actual operational risk, not abstract categories. Make it specific enough that they recognize their own business.",
  "top_3_recommendations": [
    {
      "pillar": "one of: ${PILLAR_LIST.join(", ")}",
      "problem": "The specific problem this business has, in one clear sentence.",
      "solution": "The specific Agavi service track that addresses it, in one sentence.",
      "impact": "Expected business impact in plain, specific language. Include a rough metric if honest.",
      "urgency": "High"
    },
    {
      "pillar": "...",
      "problem": "...",
      "solution": "...",
      "impact": "...",
      "urgency": "Medium"
    },
    {
      "pillar": "...",
      "problem": "...",
      "solution": "...",
      "impact": "...",
      "urgency": "Low"
    }
  ],
  "sales_hook": "One sentence Jay can use to open the follow-up call. Reference something specific from their answers. Sound like someone who has solved this problem before, not a pitch. Start with the problem, not the solution."
}`;
}

export async function generateInsights(
  answers: Record<string, number>,
  scores: ScoringResult,
  businessName: string
): Promise<ClaudeInsights | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  try {
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: buildPrompt(answers, scores, businessName),
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Strip any accidental markdown code fences
    const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    const parsed = JSON.parse(cleaned) as ClaudeInsights;

    // Basic validation
    if (
      typeof parsed.executive_summary !== "string" ||
      !Array.isArray(parsed.top_3_recommendations) ||
      typeof parsed.sales_hook !== "string"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}
