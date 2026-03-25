import { Resend } from "resend";
import type { Submission } from "@/lib/types";

const RATING_COLORS: Record<string, string> = {
  Urgent: "#f87171",
  Exposed: "#fb923c",
  Workable: "#facc15",
  Strong: "#86efac",
};

function buildHtml(sub: Submission): string {
  const { contact, scores, claude } = sub;
  const insights = claude.insights;

  const dimensionRows = scores.dimensionScores
    .map(
      (d) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #0c1b2e;color:#eef6ff;">${d.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #0c1b2e;text-align:center;color:#eef6ff;">${d.score}/4</td>
        <td style="padding:8px 12px;border-bottom:1px solid #0c1b2e;">
          <span style="color:${RATING_COLORS[d.rating]};font-weight:600;">${d.rating}</span>
        </td>
      </tr>`
    )
    .join("");

  const recommendationRows = (
    insights?.top_3_recommendations ?? []
  )
    .map(
      (r, i) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #0c1b2e;color:#5ef6ee;font-weight:600;vertical-align:top;">${i + 1}. ${r.pillar}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #0c1b2e;color:#eef6ff;vertical-align:top;">${r.problem}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #0c1b2e;color:#aab8c8;vertical-align:top;">${r.impact}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#020913;font-family:Inter,system-ui,sans-serif;">
  <div style="max-width:640px;margin:0 auto;padding:32px 16px;">

    <!-- Header -->
    <div style="background:#091627;border:1px solid rgba(94,246,238,.15);border-radius:12px;padding:24px 28px;margin-bottom:20px;">
      <div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#5ef6ee;margin-bottom:6px;">Agavi AI</div>
      <h1 style="margin:0 0 4px;font-size:22px;color:#eef6ff;">New Diagnostic Submission</h1>
      <p style="margin:0;color:#aab8c8;font-size:14px;">${new Date(sub.submittedAt).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}</p>
    </div>

    <!-- Contact -->
    <div style="background:#091627;border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:20px 28px;margin-bottom:20px;">
      <div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#aab8c8;margin-bottom:14px;">Contact</div>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:4px 0;color:#aab8c8;width:120px;">Name</td><td style="color:#eef6ff;font-weight:600;">${contact.firstName}</td></tr>
        <tr><td style="padding:4px 0;color:#aab8c8;">Business</td><td style="color:#eef6ff;font-weight:600;">${contact.businessName}</td></tr>
        <tr><td style="padding:4px 0;color:#aab8c8;">Email</td><td><a href="mailto:${contact.email}" style="color:#57d6ff;">${contact.email}</a></td></tr>
        ${contact.phone ? `<tr><td style="padding:4px 0;color:#aab8c8;">Phone</td><td style="color:#eef6ff;">${contact.phone}</td></tr>` : ""}
      </table>
    </div>

    <!-- Overall Score -->
    <div style="background:#091627;border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:20px 28px;margin-bottom:20px;display:flex;align-items:center;gap:24px;">
      <div>
        <div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#aab8c8;margin-bottom:8px;">Overall Assessment</div>
        <div style="display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;">
          <span style="font-size:36px;font-weight:800;color:#eef6ff;">${scores.urgency}<span style="font-size:18px;color:#aab8c8;">/10</span></span>
          <span style="font-size:14px;font-weight:700;padding:4px 12px;border-radius:999px;background:${scores.readiness === "High Priority" ? "rgba(248,113,113,.15)" : scores.readiness === "Qualified Lead" ? "rgba(251,146,60,.15)" : "rgba(250,204,21,.15)"};color:${scores.readiness === "High Priority" ? "#f87171" : scores.readiness === "Qualified Lead" ? "#fb923c" : "#facc15"};">${scores.readiness}</span>
        </div>
      </div>
    </div>

    <!-- Dimension Scores -->
    <div style="background:#091627;border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:20px 28px;margin-bottom:20px;">
      <div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#aab8c8;margin-bottom:14px;">Diagnostic Results</div>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="font-size:12px;color:#aab8c8;">
            <th style="padding:6px 12px;text-align:left;border-bottom:1px solid #0c1b2e;">Dimension</th>
            <th style="padding:6px 12px;text-align:center;border-bottom:1px solid #0c1b2e;">Score</th>
            <th style="padding:6px 12px;text-align:left;border-bottom:1px solid #0c1b2e;">Rating</th>
          </tr>
        </thead>
        <tbody>${dimensionRows}</tbody>
      </table>
    </div>

    ${
      insights
        ? `
    <!-- Executive Summary -->
    <div style="background:#091627;border:1px solid rgba(94,246,238,.15);border-radius:12px;padding:20px 28px;margin-bottom:20px;">
      <div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#5ef6ee;margin-bottom:10px;">Executive Summary</div>
      <p style="margin:0;color:#eef6ff;font-size:15px;line-height:1.7;">${insights.executive_summary}</p>
    </div>

    <!-- Recommendations -->
    <div style="background:#091627;border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:20px 28px;margin-bottom:20px;">
      <div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#aab8c8;margin-bottom:14px;">Top 3 Recommendations</div>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="font-size:12px;color:#aab8c8;">
            <th style="padding:6px 12px;text-align:left;border-bottom:1px solid #0c1b2e;">Pillar</th>
            <th style="padding:6px 12px;text-align:left;border-bottom:1px solid #0c1b2e;">Problem</th>
            <th style="padding:6px 12px;text-align:left;border-bottom:1px solid #0c1b2e;">Impact</th>
          </tr>
        </thead>
        <tbody>${recommendationRows}</tbody>
      </table>
    </div>

    <!-- Sales Hook -->
    <div style="background:#0c1b2e;border:1px solid rgba(109,145,255,.25);border-radius:12px;padding:20px 28px;margin-bottom:20px;">
      <div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#6d91ff;margin-bottom:10px;">Sales Hook — Use This to Open the Call</div>
      <p style="margin:0;color:#eef6ff;font-size:15px;font-style:italic;line-height:1.7;">"${insights.sales_hook}"</p>
    </div>
    `
        : ""
    }

    <!-- Footer -->
    <div style="text-align:center;padding:16px 0;color:#aab8c8;font-size:12px;">
      Agavi AI &nbsp;·&nbsp; <a href="mailto:jay@agaviai.com" style="color:#5ef6ee;">jay@agaviai.com</a>
    </div>

  </div>
</body>
</html>`;
}

export async function sendLeadEmail(submission: Submission): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { contact, scores } = submission;
  const subject = `New Lead: ${contact.businessName} — ${scores.readiness} (${scores.urgency}/10)`;

  const fromAddress = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  await resend.emails.send({
    from: `Agavi Diagnostic <${fromAddress}>`,
    to: "jay@agaviai.com",
    subject,
    html: buildHtml(submission),
  });
}
