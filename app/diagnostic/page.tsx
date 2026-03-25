"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DIMENSIONS } from "@/data/questions";
import {
  computeScores,
  getFallbackRecommendations,
  ratingColor,
  readinessBg,
  readinessColor,
} from "@/lib/scoring";
import type { ScoringResult } from "@/lib/types";

type Phase = "intro" | "question" | "analyzing" | "results" | "submitting" | "done";

const LETTER = ["A", "B", "C", "D"];

// ─── Score bar component ──────────────────────────────────
function ScoreTile({
  name,
  score,
  rating,
  delay,
}: {
  name: string;
  score: number;
  rating: string;
  delay: number;
}) {
  const colorClass = ratingColor(rating as Parameters<typeof ratingColor>[0]);
  return (
    <div
      className={`fade-up rounded-xl p-4 border ${colorClass.split(" ").slice(1).join(" ")} fade-up-delay-${delay}`}
      style={{ animationFillMode: "forwards" }}
    >
      <div className="text-muted text-xs font-semibold uppercase tracking-wider mb-2">
        {name}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex gap-1 flex-1">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="flex-1 h-1.5 rounded-full transition-all"
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
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full border ${colorClass}`}
        >
          {rating}
        </span>
      </div>
    </div>
  );
}

// ─── Recommendation card ──────────────────────────────────
function RecommendationCard({
  rec,
  index,
}: {
  rec: {
    pillar: string;
    problem: string;
    solution: string;
    impact: string;
    urgency: string;
  };
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
          <div
            className="text-surface font-bold text-base leading-snug font-heading"
          >
            #{index + 1} Opportunity
          </div>
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${urgencyColor}`}
        >
          {rec.urgency}
        </span>
      </div>
      <p className="text-muted text-sm mb-3 leading-relaxed">
        <strong className="text-surface">Problem:</strong> {rec.problem}
      </p>
      <p className="text-muted text-sm mb-3 leading-relaxed">
        <strong className="text-surface">Solution:</strong> {rec.solution}
      </p>
      <p
        className="text-sm leading-relaxed"
        style={{ color: "#9be784" }}
      >
        <strong>Impact:</strong> {rec.impact}
      </p>
    </div>
  );
}

// ─── Contact form ─────────────────────────────────────────
function ContactForm({
  onSubmit,
  submitting,
}: {
  onSubmit: (data: {
    firstName: string;
    businessName: string;
    email: string;
    phone: string;
  }) => void;
  submitting: boolean;
}) {
  const [firstName, setFirstName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !businessName.trim() || !email.trim()) return;
    onSubmit({ firstName, businessName, email, phone });
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl text-surface placeholder-muted text-sm outline-none focus:border-teal/50 transition-colors";
  const inputStyle = {
    background: "rgba(255,255,255,.04)",
    border: "1px solid rgba(255,255,255,.1)",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-muted text-xs font-semibold uppercase tracking-wider mb-2">
            First Name *
          </label>
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Jay"
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label className="block text-muted text-xs font-semibold uppercase tracking-wider mb-2">
            Business Name *
          </label>
          <input
            type="text"
            required
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Summit Home Services"
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-muted text-xs font-semibold uppercase tracking-wider mb-2">
            Email *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@yourbusiness.com"
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label className="block text-muted text-xs font-semibold uppercase tracking-wider mb-2">
            Phone{" "}
            <span className="text-muted/60 normal-case tracking-normal font-normal">
              (optional)
            </span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(602) 555-0100"
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-bg text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "linear-gradient(135deg, #5ef6ee, #57d6ff)",
          boxShadow: "0 0 24px rgba(94,246,238,.2)",
        }}
      >
        {submitting ? "Sending…" : "Send My Results →"}
      </button>
    </form>
  );
}

// ─── Main diagnostic page ─────────────────────────────────
export default function DiagnosticPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [scores, setScores] = useState<ScoringResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const dimension = DIMENSIONS[currentStep];
  const progress = currentStep / DIMENSIONS.length;

  // Scroll to results after they appear
  useEffect(() => {
    if (phase === "results" && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [phase]);

  const handleAnswer = (dimensionId: string, score: number, key: string) => {
    if (selectedKey !== null) return; // prevent double-click
    setSelectedKey(key);
    const newAnswers = { ...answers, [dimensionId]: score };
    setAnswers(newAnswers);

    setTimeout(() => {
      setSelectedKey(null);
      if (currentStep < DIMENSIONS.length - 1) {
        setCurrentStep((s) => s + 1);
      } else {
        // Last question answered
        setPhase("analyzing");
        setTimeout(() => {
          const result = computeScores(newAnswers);
          setScores(result);
          setPhase("results");
        }, 1200);
      }
    }, 380);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    } else {
      setPhase("intro");
    }
  };

  const handleContactSubmit = async (contactData: {
    firstName: string;
    businessName: string;
    email: string;
    phone: string;
  }) => {
    if (!scores) return;
    setSubmitting(true);
    setPhase("submitting");

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: contactData,
          answers,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/results/${data.id}`);
      } else {
        // Fallback: stay on page, show a quiet error
        setPhase("results");
        setSubmitting(false);
      }
    } catch {
      setPhase("results");
      setSubmitting(false);
    }
  };

  // ── Intro ──────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <main className="min-h-screen flex flex-col">
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-bg/70 border-b border-white/[0.05]">
          <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-muted hover:text-surface transition-colors text-sm">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </Link>
            <span className="text-muted text-sm font-semibold font-heading">
              Agavi Operational Diagnostic
            </span>
            <div className="w-12" />
          </div>
        </nav>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
          <div className="max-w-2xl w-full text-center">
            <div className="eyebrow mb-6">Agavi Operational Diagnostic</div>
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-surface leading-tight mb-6" style={{ letterSpacing: "-0.02em" }}>
              Honest answers lead to{" "}
              <span style={{ color: "var(--teal)" }}>honest results</span>
            </h1>
            <p className="text-muted text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              This is the same diagnostic framework Agavi AI uses in paid
              engagements. Eight questions. No spin. You'll see exactly where
              your operations are strong — and where AI could change the math.
            </p>

            <div className="panel-card p-6 mb-10 text-left">
              <div className="text-muted text-sm space-y-3">
                {[
                  "One question per dimension — answer what's actually true",
                  "Full results appear immediately, no email required",
                  "No scoring games, no artificial urgency, no locked reports",
                  "If you want a follow-up, you can share your contact info after",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="rgba(94,246,238,.4)" strokeWidth="1.2"/>
                      <path d="M5 8l2 2 4-4" stroke="#5ef6ee" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-surface">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setPhase("question")}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-bg text-base transition-all hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #5ef6ee, #57d6ff)",
                boxShadow: "0 0 32px rgba(94,246,238,.25)",
              }}
            >
              Begin the Diagnostic
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── Analyzing ─────────────────────────────────────────
  if (phase === "analyzing") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="spinner" />
        <p className="text-muted text-sm font-semibold tracking-wider uppercase">
          Reviewing your responses…
        </p>
      </main>
    );
  }

  // ── Submitting ────────────────────────────────────────
  if (phase === "submitting") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="spinner" />
        <p className="text-muted text-sm font-semibold tracking-wider uppercase">
          Generating your report…
        </p>
        <p className="text-muted/60 text-xs">This usually takes 5–10 seconds</p>
      </main>
    );
  }

  // ── Question ──────────────────────────────────────────
  if (phase === "question") {
    return (
      <main className="min-h-screen flex flex-col">
        {/* Nav */}
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-bg/70 border-b border-white/[0.05]">
          <div className="max-w-3xl mx-auto px-6 h-16 flex items-center gap-4">
            <button
              onClick={handleBack}
              className="text-muted hover:text-surface transition-colors text-sm flex items-center gap-1"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>
            <div className="flex-1 progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${((currentStep + 1) / DIMENSIONS.length) * 100}%` }}
              />
            </div>
            <span className="text-muted text-sm shrink-0">
              {currentStep + 1} / {DIMENSIONS.length}
            </span>
          </div>
        </nav>

        {/* Question */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="max-w-2xl w-full">
            {/* Dimension label */}
            <div className="eyebrow mb-3">{dimension.name}</div>
            <p className="text-muted text-sm mb-8">{dimension.description}</p>

            {/* Question */}
            <h2
              className="font-heading font-bold text-surface text-2xl md:text-3xl leading-tight mb-10"
              style={{ letterSpacing: "-0.01em" }}
            >
              {dimension.question}
            </h2>

            {/* Answers */}
            <div className="space-y-3">
              {dimension.answers.map((answer, i) => (
                <button
                  key={answer.key}
                  onClick={() =>
                    handleAnswer(dimension.id, answer.score, answer.key)
                  }
                  className={`answer-card w-full text-left px-5 py-4 rounded-xl border flex items-start gap-4 ${
                    selectedKey === answer.key ? "selected" : ""
                  }`}
                  style={{
                    background:
                      selectedKey === answer.key
                        ? "rgba(94,246,238,.06)"
                        : "rgba(255,255,255,.025)",
                    border:
                      selectedKey === answer.key
                        ? "1px solid rgba(94,246,238,.5)"
                        : "1px solid rgba(255,255,255,.08)",
                  }}
                  disabled={selectedKey !== null}
                >
                  <span
                    className="shrink-0 w-7 h-7 rounded-lg grid place-items-center text-xs font-bold mt-0.5"
                    style={{
                      background:
                        selectedKey === answer.key
                          ? "rgba(94,246,238,.2)"
                          : "rgba(255,255,255,.06)",
                      color:
                        selectedKey === answer.key ? "#5ef6ee" : "#aab8c8",
                    }}
                  >
                    {selectedKey === answer.key ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      LETTER[i]
                    )}
                  </span>
                  <span className="text-surface text-sm leading-relaxed">
                    {answer.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Results ────────────────────────────────────────────
  if (phase === "results" && scores) {
    const recommendations =
      getFallbackRecommendations(scores.top3Pillars);

    return (
      <main className="min-h-screen" ref={resultsRef}>
        {/* Nav */}
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-bg/70 border-b border-white/[0.05] no-print">
          <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="text-muted hover:text-surface transition-colors text-sm flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Start Over
            </Link>
            <span className="text-muted text-sm font-semibold font-heading">
              Your Diagnostic Results
            </span>
            <button
              onClick={() => window.print()}
              className="text-muted hover:text-surface transition-colors text-sm"
            >
              Print / Save PDF
            </button>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
          {/* Score header */}
          <div
            className="rounded-panel p-8 fade-up"
            style={{
              background: "linear-gradient(135deg, rgba(9,22,39,.9), rgba(12,27,46,.9))",
              border: "1px solid rgba(255,255,255,.08)",
            }}
          >
            <div className="eyebrow mb-4">Agavi Operational Diagnostic</div>
            <div className="flex flex-wrap items-end gap-6 mb-6">
              <div>
                <div className="text-muted text-sm mb-1">Urgency Score</div>
                <div className="font-heading font-bold text-surface"
                  style={{ fontSize: "clamp(3rem, 10vw, 5rem)", lineHeight: 1, letterSpacing: "-0.03em" }}>
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
            <p className="text-muted text-sm leading-relaxed">
              {scores.urgency >= 8
                ? "Your diagnostic shows significant operational gaps where AI can create immediate leverage. The specifics are below."
                : scores.urgency >= 6
                ? "There are clear opportunities here. Your operations have a solid foundation but meaningful gaps that AI can address."
                : scores.urgency >= 4
                ? "Your business is reasonably well-run. AI integration would add efficiency in a few focused areas."
                : "Your operations are in strong shape. AI would play an optimization role rather than a rescue role."}
            </p>
          </div>

          {/* Dimension breakdown */}
          <div>
            <div className="eyebrow mb-4">Dimension Breakdown</div>
            <div className="grid sm:grid-cols-2 gap-3">
              {scores.dimensionScores.map((d, i) => (
                <ScoreTile
                  key={d.id}
                  name={d.name}
                  score={d.score}
                  rating={d.rating}
                  delay={Math.min((i % 4) + 1, 4) as 1 | 2 | 3 | 4}
                />
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <div className="eyebrow mb-2">Where AI Can Move the Needle</div>
            <p className="text-muted text-sm mb-5">
              Based on your three lowest-scoring dimensions.
            </p>
            <div className="space-y-4">
              {recommendations.map((rec, i) => (
                <RecommendationCard key={i} rec={rec} index={i} />
              ))}
            </div>
          </div>

          {/* The Beatitude Engine reference */}
          <div
            className="rounded-xl p-5"
            style={{
              background: "rgba(109,145,255,.06)",
              border: "1px solid rgba(109,145,255,.18)",
            }}
          >
            <div className="text-sm font-semibold text-blue mb-2">
              The Beatitude Engine
            </div>
            <p className="text-muted text-sm leading-relaxed">
              Agavi AI's delivery methodology moves through five phases:
              Assess → Align → Architect → Activate → Amplify. The gaps
              identified in your diagnostic determine where we start and how
              fast you can move.
            </p>
          </div>

          {/* Contact section — honest, not gated */}
          <div
            id="contact"
            className="rounded-panel p-8"
            style={{
              background: "rgba(9,22,39,.8)",
              border: "1px solid rgba(94,246,238,.15)",
            }}
          >
            <div className="eyebrow mb-3">Want a personal follow-up?</div>
            <h2 className="font-heading font-bold text-surface text-xl md:text-2xl mb-3">
              These are your results. All of them.
            </h2>
            <p className="text-muted text-sm leading-relaxed mb-6">
              If you'd like Jay to personally review your diagnostic and
              suggest a specific first step — no pitch, no pressure — share
              your contact information below. You'll receive a copy of this
              report and a follow-up within one business day.
            </p>
            <ContactForm
              onSubmit={handleContactSubmit}
              submitting={submitting}
            />
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
          </div>
        </div>
      </main>
    );
  }

  return null;
}
