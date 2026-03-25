import { notFound } from "next/navigation";
import Link from "next/link";
import { getSubmission } from "@/lib/kv";
import { PrintButton } from "@/components/PrintButton";
import {
  getFallbackRecommendations,
  ratingColor,
  readinessBg,
  readinessColor,
} from "@/lib/scoring";
import type { RecommendationItem } from "@/lib/types";

interface Props {
  params: Promise<{ id: string }>;
}

function ScoreTile({
  name,
  score,
  rating,
}: {
  name: string;
  score: number;
  rating: string;
}) {
  const colorClass = ratingColor(rating as Parameters<typeof ratingColor>[0]);
  return (
    <div className={`rounded-xl p-4 border ${colorClass.split(" ").slice(1).join(" ")}`}>
      <div className="text-muted text-xs font-semibold uppercase tracking-wider mb-2">
        {name}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex gap-1 flex-1">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="flex-1 h-1.5 rounded-full"
              style={{
                background:
                  n <= score
                    ? rating === "Urgent"
                      ? "#f87171"
                      : rating === "Exposed"
                      ? "#fb923c"
                      : rating === "Workable"
                      ? "#facc15"
                      : "#86efac"
                    : "rgba(255,255,255,0.1)",
              }}
            />
          ))}
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${colorClass}`}>
          {rating}
        </span>
      </div>
    </div>
  );
}

function RecommendationCard({
  rec,
  index,
}: {
  rec: RecommendationItem;
  index: number;
}) {
  const urgencyColor =
    rec.urgency === "High"
      ? "text-red-400 bg-red-400/10 border-red-400/30"
      : rec.urgency === "Medium"
      ? "text-orange-400 bg-orange-400/10 border-orange-400/30"
      : "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";

  return (
    <div className="panel-card p-6">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="eyebrow mb-1">{rec.pillar}</div>
          <div className="text-surface font-bold text-base font-heading">
            #{index + 1} Opportunity
          </div>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${urgencyColor}`}>
          {rec.urgency}
        </span>
      </div>
      <p className="text-muted text-sm mb-3 leading-relaxed">
        <strong className="text-surface">Problem:</strong> {rec.problem}
      </p>
      <p className="text-muted text-sm mb-3 leading-relaxed">
        <strong className="text-surface">Solution:</strong> {rec.solution}
      </p>
      <p className="text-sm leading-relaxed" style={{ color: "#9be784" }}>
        <strong>Impact:</strong> {rec.impact}
      </p>
    </div>
  );
}

export default async function ResultsPage({ params }: Props) {
  const { id } = await params;
  const submission = await getSubmission(id);

  if (!submission) notFound();

  const { contact, scores, claude } = submission;
  const insights = claude.insights;
  const recommendations: RecommendationItem[] =
    insights?.top_3_recommendations?.length
      ? insights.top_3_recommendations
      : getFallbackRecommendations(scores.top3Pillars);

  const calendlyUrl = process.env.CALENDLY_URL ?? "#";

  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-bg/70 border-b border-white/[0.05] no-print">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-muted hover:text-surface transition-colors text-sm flex items-center gap-1"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Agavi AI
          </Link>
          <span className="text-muted text-sm font-semibold font-heading hidden sm:block">
            Operational Diagnostic Report
          </span>
          <button
            onClick={undefined}
            className="text-muted hover:text-surface transition-colors text-sm no-print"
          >
            {/* Client-side print button injected below */}
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">

        {/* Print-only header */}
        <div className="print-only mb-8">
          <h1 className="text-2xl font-bold">Agavi Operational Diagnostic Report</h1>
          <p className="text-sm text-muted mt-1">
            {contact.businessName} · {contact.email} ·{" "}
            {new Date(submission.submittedAt).toLocaleDateString("en-US", {
              dateStyle: "long",
            })}
          </p>
        </div>

        {/* Score header */}
        <div
          className="rounded-panel p-8"
          style={{
            background: "linear-gradient(135deg, rgba(9,22,39,.9), rgba(12,27,46,.9))",
            border: "1px solid rgba(255,255,255,.08)",
          }}
        >
          <div className="eyebrow mb-2">
            {contact.businessName} — Agavi Operational Diagnostic
          </div>
          <div className="flex flex-wrap items-end gap-6 mb-5">
            <div>
              <div className="text-muted text-sm mb-1">Urgency Score</div>
              <div
                className="font-heading font-bold text-surface"
                style={{ fontSize: "clamp(3rem, 10vw, 5rem)", lineHeight: 1, letterSpacing: "-0.03em" }}
              >
                {scores.urgency}
                <span className="text-muted font-normal" style={{ fontSize: "1.5rem" }}>/10</span>
              </div>
            </div>
            <div>
              <div className="text-muted text-sm mb-2">Classification</div>
              <span
                className={`text-sm font-bold px-4 py-1.5 rounded-full border ${readinessBg(scores.readiness)} ${readinessColor(scores.readiness)}`}
              >
                {scores.readiness}
              </span>
            </div>
          </div>

          {/* Executive summary — Claude or fallback */}
          {insights?.executive_summary ? (
            <p className="text-surface text-base leading-relaxed">
              {insights.executive_summary}
            </p>
          ) : (
            <p className="text-muted text-sm leading-relaxed">
              {scores.urgency >= 8
                ? "Your diagnostic shows significant operational gaps where AI can create immediate leverage."
                : scores.urgency >= 6
                ? "There are clear opportunities here. Your operations have a solid foundation but meaningful gaps that AI can address."
                : "Your business is reasonably well-run. AI integration would add efficiency in a few focused areas."}
            </p>
          )}
        </div>

        {/* Dimension breakdown */}
        <div>
          <div className="eyebrow mb-4">Dimension Breakdown</div>
          <div className="grid sm:grid-cols-2 gap-3">
            {scores.dimensionScores.map((d) => (
              <ScoreTile key={d.id} name={d.name} score={d.score} rating={d.rating} />
            ))}
          </div>
        </div>

        {/* Top 3 recommendations */}
        <div>
          <div className="eyebrow mb-2">
            {insights ? "Recommended Service Tracks" : "Where AI Can Move the Needle"}
          </div>
          <p className="text-muted text-sm mb-5">
            Based on your three highest-opportunity dimensions.
          </p>
          <div className="space-y-4">
            {recommendations.map((rec, i) => (
              <RecommendationCard key={i} rec={rec} index={i} />
            ))}
          </div>
        </div>

        {/* Sales hook — only if Claude generated it */}
        {insights?.sales_hook && (
          <div
            className="rounded-xl p-6"
            style={{
              background: "rgba(109,145,255,.06)",
              border: "1px solid rgba(109,145,255,.2)",
            }}
          >
            <div className="text-sm font-semibold mb-2" style={{ color: "#6d91ff" }}>
              What This Means for Your Business
            </div>
            <p className="text-surface text-base italic leading-relaxed">
              "{insights.sales_hook}"
            </p>
          </div>
        )}

        {/* Beatitude Engine */}
        <div
          className="rounded-xl p-5"
          style={{
            background: "rgba(109,145,255,.06)",
            border: "1px solid rgba(109,145,255,.15)",
          }}
        >
          <div className="text-sm font-semibold mb-2" style={{ color: "#6d91ff" }}>
            The Beatitude Engine — Agavi AI's Delivery Framework
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["Assess", "Align", "Architect", "Activate", "Amplify"].map((phase, i) => (
              <span
                key={phase}
                className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(109,145,255,.1)",
                  border: "1px solid rgba(109,145,255,.2)",
                  color: "#6d91ff",
                }}
              >
                {i + 1}. {phase}
              </span>
            ))}
          </div>
          <p className="text-muted text-sm mt-3 leading-relaxed">
            Your diagnostic determines where we start. Most engagements begin
            in Assess or Align and move through implementation within 30–60
            days.
          </p>
        </div>

        {/* CTAs */}
        <div
          className="rounded-panel p-8 text-center no-print"
          style={{
            background: "linear-gradient(135deg, rgba(94,246,238,.07), rgba(109,145,255,.07))",
            border: "1px solid rgba(94,246,238,.2)",
          }}
        >
          <h2 className="font-heading font-bold text-surface text-xl md:text-2xl mb-3">
            Ready to talk specifics?
          </h2>
          <p className="text-muted text-sm mb-6 max-w-md mx-auto">
            Schedule a 30-minute strategy call with Jay. No pitch deck. Just an
            honest conversation about what these results mean for your business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-bg text-sm transition-all hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #5ef6ee, #57d6ff)",
                boxShadow: "0 0 24px rgba(94,246,238,.2)",
              }}
            >
              Schedule a Strategy Call →
            </a>
                <PrintButton />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 text-muted text-sm border-t border-white/[0.05]">
          <p>Agavi AI &nbsp;·&nbsp; AI That Grows With You</p>
          <p className="mt-1">
            <a href="mailto:jay@agaviai.com" className="hover:text-surface transition-colors">
              jay@agaviai.com
            </a>
            &nbsp;·&nbsp;
            <a href="https://agaviai.com" className="hover:text-surface transition-colors">
              agaviai.com
            </a>
          </p>
          <p className="mt-2 text-muted/50 text-xs">
            Generated {new Date(submission.submittedAt).toLocaleString("en-US")}
          </p>
        </div>

      </div>
    </main>
  );
}

