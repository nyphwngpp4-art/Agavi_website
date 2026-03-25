"use client";

import { useState } from "react";
import type { Submission } from "@/lib/types";
import { ratingColor, readinessColor, readinessBg } from "@/lib/scoring";

function urgencyBadge(readiness: string) {
  switch (readiness) {
    case "High Priority":
      return "bg-red-400/10 border-red-400/30 text-red-400";
    case "Qualified Lead":
      return "bg-orange-400/10 border-orange-400/30 text-orange-400";
    case "Exploring":
      return "bg-yellow-400/10 border-yellow-400/30 text-yellow-400";
    default:
      return "bg-white/5 border-white/10 text-muted";
  }
}

function ExpandedRow({ sub }: { sub: Submission }) {
  const recs =
    sub.claude.insights?.top_3_recommendations ?? [];

  return (
    <div className="p-6 space-y-6">
      {/* Contact */}
      <div>
        <div className="text-muted text-xs uppercase tracking-wider font-semibold mb-3">Contact</div>
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          <div>
            <span className="text-muted">Name: </span>
            <span className="text-surface">{sub.contact.firstName}</span>
          </div>
          <div>
            <span className="text-muted">Email: </span>
            <a href={`mailto:${sub.contact.email}`} className="text-cyan hover:underline">
              {sub.contact.email}
            </a>
          </div>
          {sub.contact.phone && (
            <div>
              <span className="text-muted">Phone: </span>
              <span className="text-surface">{sub.contact.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Dimension scores */}
      <div>
        <div className="text-muted text-xs uppercase tracking-wider font-semibold mb-3">Dimension Scores</div>
        <div className="grid sm:grid-cols-2 gap-2">
          {sub.scores.dimensionScores.map((d) => {
            const colorClass = ratingColor(d.rating);
            return (
              <div key={d.id} className="flex items-center justify-between py-1.5 px-3 rounded-lg" style={{ background: "rgba(255,255,255,.03)" }}>
                <span className="text-muted text-sm">{d.name}</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="w-4 h-1 rounded-full"
                        style={{
                          background: n <= d.score
                            ? d.rating === "Urgent" ? "#f87171"
                            : d.rating === "Exposed" ? "#fb923c"
                            : d.rating === "Workable" ? "#facc15"
                            : "#86efac"
                            : "rgba(255,255,255,0.08)",
                        }}
                      />
                    ))}
                  </div>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${colorClass}`}>
                    {d.rating}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Executive summary */}
      {sub.claude.insights?.executive_summary && (
        <div>
          <div className="text-muted text-xs uppercase tracking-wider font-semibold mb-2">Executive Summary</div>
          <p className="text-surface text-sm leading-relaxed panel-card p-4">
            {sub.claude.insights.executive_summary}
          </p>
        </div>
      )}

      {/* Top recommendations */}
      {recs.length > 0 && (
        <div>
          <div className="text-muted text-xs uppercase tracking-wider font-semibold mb-3">Top Recommendations</div>
          <div className="space-y-3">
            {recs.map((r, i) => (
              <div key={i} className="panel-card p-4 text-sm">
                <div className="eyebrow mb-1">{r.pillar}</div>
                <p className="text-muted mb-1"><strong className="text-surface">Problem:</strong> {r.problem}</p>
                <p className="text-muted mb-1"><strong className="text-surface">Solution:</strong> {r.solution}</p>
                <p style={{ color: "#9be784" }}><strong>Impact:</strong> {r.impact}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sales hook */}
      {sub.claude.insights?.sales_hook && (
        <div
          className="rounded-xl p-4"
          style={{ background: "rgba(109,145,255,.06)", border: "1px solid rgba(109,145,255,.2)" }}
        >
          <div className="text-xs font-semibold mb-1" style={{ color: "#6d91ff" }}>
            Sales Hook
          </div>
          <p className="text-surface text-sm italic">"{sub.claude.insights.sales_hook}"</p>
        </div>
      )}

      {/* View full report link */}
      <div className="pt-2">
        <a
          href={`/results/${sub.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan text-sm hover:underline"
        >
          View full report →
        </a>
      </div>
    </div>
  );
}

export default function AdminTable({
  submissions,
}: {
  submissions: Submission[];
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [contactedMap, setContactedMap] = useState<Record<string, boolean>>(
    Object.fromEntries(submissions.map((s) => [s.id, s.contacted]))
  );

  const toggleContacted = async (id: string) => {
    const newVal = !contactedMap[id];
    setContactedMap((prev) => ({ ...prev, [id]: newVal }));
    await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contacted: newVal }),
    });
  };

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email).catch(() => {});
  };

  return (
    <div className="panel-card overflow-hidden">
      {/* Table header */}
      <div
        className="grid text-xs font-semibold uppercase tracking-wider text-muted px-4 py-3"
        style={{
          gridTemplateColumns: "1fr 1fr 1fr auto auto auto",
          borderBottom: "1px solid rgba(255,255,255,.06)",
        }}
      >
        <span>Business</span>
        <span>Contact</span>
        <span className="hidden md:block">Submitted</span>
        <span>Score</span>
        <span>Status</span>
        <span></span>
      </div>

      {submissions.map((sub, i) => (
        <div key={sub.id}>
          {/* Row */}
          <div
            className="grid items-center px-4 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
            style={{
              gridTemplateColumns: "1fr 1fr 1fr auto auto auto",
              borderBottom: i < submissions.length - 1 || expanded === sub.id
                ? "1px solid rgba(255,255,255,.05)"
                : "none",
            }}
            onClick={() => setExpanded(expanded === sub.id ? null : sub.id)}
          >
            <div>
              <div className="text-surface text-sm font-semibold">
                {sub.contact.businessName}
              </div>
              <div className="text-muted text-xs mt-0.5">
                {contactedMap[sub.id] && (
                  <span className="text-green-400 mr-1">✓ Contacted</span>
                )}
              </div>
            </div>

            <div>
              <div className="text-surface text-sm">{sub.contact.firstName}</div>
              <div className="text-muted text-xs mt-0.5 truncate max-w-[160px]">
                {sub.contact.email}
              </div>
            </div>

            <div className="hidden md:block text-muted text-xs">
              {new Date(sub.submittedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>

            <div className="flex items-center gap-2 mr-2">
              <span className="text-surface font-bold text-sm font-heading">
                {sub.scores.urgency}
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full border ${urgencyBadge(sub.scores.readiness)}`}
              >
                {sub.scores.readiness}
              </span>
            </div>

            {/* Contacted toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleContacted(sub.id);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors mr-2 ${
                contactedMap[sub.id]
                  ? "bg-green-400/10 border-green-400/30 text-green-400"
                  : "bg-white/5 border-white/10 text-muted hover:text-surface"
              }`}
              title="Toggle contacted status"
            >
              {contactedMap[sub.id] ? "✓ Done" : "Mark contacted"}
            </button>

            {/* Copy email */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyEmail(sub.contact.email);
              }}
              className="text-muted hover:text-cyan transition-colors p-1.5 rounded-lg hover:bg-white/5"
              title="Copy email"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="4" y="1" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M1 5v8h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Expanded */}
          {expanded === sub.id && (
            <div style={{ borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(255,255,255,.01)" }}>
              <ExpandedRow sub={sub} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
