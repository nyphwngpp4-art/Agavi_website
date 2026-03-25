import { DIMENSIONS } from "@/data/questions";
import type {
  DimensionRating,
  DimensionScore,
  ReadinessClassification,
  RecommendationItem,
  ScoringResult,
} from "@/lib/types";

// Fallback recommendation templates per pillar (used when Claude is unavailable)
const PILLAR_FALLBACKS: Record<
  string,
  { problem: string; solution: string; impact: string }
> = {
  "Financial Automation": {
    problem: "Revenue capture and financial visibility are inconsistent",
    solution:
      "Automated invoicing, collections tracking, and real-time financial reporting",
    impact:
      "Recover 10–15% of revenue currently slipping through billing gaps and cut monthly close time significantly",
  },
  "CRM Intelligence": {
    problem: "Customer data is fragmented and follow-up is unreliable",
    solution:
      "AI-enhanced CRM with automated follow-up sequences and lead scoring",
    impact:
      "Convert more of your existing pipeline without adding headcount or changing your sales motion",
  },
  "Operations & Logistics": {
    problem:
      "Execution depends too heavily on individual knowledge and founder oversight",
    solution: "Workflow automation and AI-assisted process management",
    impact:
      "Free up 8–12 hours per week of founder-level capacity while maintaining operational consistency",
  },
  "Customer Service AI": {
    problem:
      "Response time and service consistency depend too heavily on staff availability",
    solution:
      "AI-powered service routing, auto-response, and escalation workflows",
    impact:
      "Handle 2–3× the inquiry volume with the same team while improving response time",
  },
  "Sales Enablement": {
    problem:
      "Sales effort is not being directed by data — high-value opportunities get the same attention as low-probability ones",
    solution: "AI-driven outreach prioritization and conversion modeling",
    impact:
      "Increase close rate by focusing effort on the opportunities most likely to convert",
  },
  "Marketing Intelligence": {
    problem:
      "Marketing spend and effort are disconnected from clear performance data",
    solution:
      "Campaign analytics, audience segmentation, and automated reporting",
    impact:
      "Reallocate budget to the 20% of channels driving 80% of results",
  },
};

function getRating(score: number): DimensionRating {
  if (score === 1) return "Urgent";
  if (score === 2) return "Exposed";
  if (score === 3) return "Workable";
  return "Strong";
}

function getReadiness(urgency: number): ReadinessClassification {
  if (urgency >= 8) return "High Priority";
  if (urgency >= 6) return "Qualified Lead";
  if (urgency >= 4) return "Exploring";
  return "Not Ready";
}

export function computeScores(
  answers: Record<string, number>
): ScoringResult {
  const dimensionScores: DimensionScore[] = DIMENSIONS.map((dim) => {
    const score = answers[dim.id] ?? 1;
    return {
      id: dim.id,
      name: dim.name,
      pillar: dim.pillar,
      score,
      rating: getRating(score),
    };
  });

  const avgScore =
    dimensionScores.reduce((sum, d) => sum + d.score, 0) / dimensionScores.length;

  // Urgency: 1 (healthy) → 10 (most opportunity). Inverse of avg score.
  const rawUrgency = ((4 - avgScore) / 3) * 9 + 1;
  const urgency = Math.round(rawUrgency * 10) / 10;

  const readiness = getReadiness(urgency);

  // Top 3 pillars = the 3 lowest-scoring dimensions
  const top3Pillars = [...dimensionScores]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((d) => d.pillar);

  return { dimensionScores, urgency, readiness, top3Pillars };
}

// Fallback recommendations used when Claude output is unavailable
export function getFallbackRecommendations(
  top3Pillars: string[]
): RecommendationItem[] {
  const urgencyOrder: Array<"High" | "Medium" | "Low"> = ["High", "Medium", "Low"];
  return top3Pillars.map((pillar, i) => {
    const fb = PILLAR_FALLBACKS[pillar] ?? PILLAR_FALLBACKS["Operations & Logistics"];
    return {
      pillar,
      problem: fb.problem,
      solution: fb.solution,
      impact: fb.impact,
      urgency: urgencyOrder[i],
    };
  });
}

export function ratingColor(rating: DimensionRating): string {
  switch (rating) {
    case "Urgent":
      return "text-red-400 border-red-400/30 bg-red-400/10";
    case "Exposed":
      return "text-orange-400 border-orange-400/30 bg-orange-400/10";
    case "Workable":
      return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10";
    case "Strong":
      return "text-green-400 border-green-400/30 bg-green-400/10";
  }
}

export function readinessColor(classification: ReadinessClassification): string {
  switch (classification) {
    case "High Priority":
      return "text-red-400";
    case "Qualified Lead":
      return "text-orange-400";
    case "Exploring":
      return "text-yellow-400";
    case "Not Ready":
      return "text-muted";
  }
}

export function readinessBg(classification: ReadinessClassification): string {
  switch (classification) {
    case "High Priority":
      return "bg-red-400/10 border-red-400/30";
    case "Qualified Lead":
      return "bg-orange-400/10 border-orange-400/30";
    case "Exploring":
      return "bg-yellow-400/10 border-yellow-400/30";
    case "Not Ready":
      return "bg-white/5 border-white/10";
  }
}
