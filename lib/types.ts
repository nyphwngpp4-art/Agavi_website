export type DimensionRating = "Strong" | "Workable" | "Exposed" | "Urgent";
export type ReadinessClassification =
  | "Not Ready"
  | "Exploring"
  | "Qualified Lead"
  | "High Priority";
export type RecommendationUrgency = "High" | "Medium" | "Low";

export interface DimensionScore {
  id: string;
  name: string;
  pillar: string;
  score: number; // 1–4
  rating: DimensionRating;
}

export interface RecommendationItem {
  pillar: string;
  problem: string;
  solution: string;
  impact: string;
  urgency: RecommendationUrgency;
}

export interface ClaudeInsights {
  executive_summary: string;
  top_3_recommendations: RecommendationItem[];
  sales_hook: string;
}

export interface ScoringResult {
  dimensionScores: DimensionScore[];
  urgency: number; // 1–10, one decimal
  readiness: ReadinessClassification;
  top3Pillars: string[]; // pillar names of 3 lowest-scoring dimensions
}

export interface ContactInfo {
  firstName: string;
  businessName: string;
  email: string;
  phone?: string;
}

export interface Submission {
  id: string;
  submittedAt: string; // ISO
  contact: ContactInfo;
  answers: Record<string, number>; // dimensionId → score (1–4)
  scores: ScoringResult;
  claude: {
    insights: ClaudeInsights | null;
    generated: boolean;
  };
  contacted: boolean;
}

export interface SubmissionIndexEntry {
  id: string;
  submittedAt: string;
  businessName: string;
  readiness: ReadinessClassification;
  urgency: number;
}
