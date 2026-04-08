#!/usr/bin/env node
/*
 * Missed Call Audit — generates a one-page HTML report from a VoIP call log CSV.
 *
 * Usage:
 *   node missed-call-audit.js <input.csv> <output.html> [--shop "Shop Name"] [--ticket 1400]
 *
 * Example:
 *   node missed-call-audit.js sample-call-log.csv report.html --shop "Monster Air" --ticket 1400
 *
 * Input CSV format (flexible — column names matched case-insensitively):
 *   Required: a direction column ("direction" / "type") and a status column
 *             ("status" / "disposition" / "result")
 *   Optional: date, from, to, duration
 *
 * A call is counted as "missed" if:
 *   - direction is "inbound" (or "in"), AND
 *   - status contains "missed", "voicemail", "no answer", "abandoned", or "unanswered"
 *
 * The report is a single self-contained HTML file. Open it in a browser and
 * print to PDF to hand off to the prospect.
 *
 * No dependencies. Pure Node built-ins.
 */

const fs = require('fs');
const path = require('path');

// --- Config -----------------------------------------------------------------

const DEFAULT_AVG_TICKET = 1400;          // Avg HVAC emergency ticket ($)
const DEFAULT_CLOSE_RATE = 0.45;          // % of missed calls that would have closed
const AFTER_HOURS_MULTIPLIER = 1.25;      // After-hours emergency premium

// --- CLI parsing ------------------------------------------------------------

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node missed-call-audit.js <input.csv> <output.html> [--shop "Name"] [--ticket 1400]');
  process.exit(1);
}

const inputPath = args[0];
const outputPath = args[1];
let shopName = 'Your Shop';
let avgTicket = DEFAULT_AVG_TICKET;

for (let i = 2; i < args.length; i++) {
  if (args[i] === '--shop') shopName = args[++i];
  else if (args[i] === '--ticket') avgTicket = Number(args[++i]);
}

if (!fs.existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`);
  process.exit(1);
}

// --- CSV parser (simple, handles quoted fields) -----------------------------

function parseCSV(text) {
  const rows = [];
  let i = 0, field = '', row = [], inQuotes = false;
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i += 2; continue; }
      if (c === '"') { inQuotes = false; i++; continue; }
      field += c; i++;
    } else {
      if (c === '"') { inQuotes = true; i++; continue; }
      if (c === ',') { row.push(field); field = ''; i++; continue; }
      if (c === '\n' || c === '\r') {
        if (field !== '' || row.length > 0) { row.push(field); rows.push(row); row = []; field = ''; }
        if (c === '\r' && text[i + 1] === '\n') i++;
        i++; continue;
      }
      field += c; i++;
    }
  }
  if (field !== '' || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

function rowsToObjects(rows) {
  if (rows.length === 0) return [];
  const headers = rows[0].map(h => h.trim().toLowerCase());
  return rows.slice(1).filter(r => r.length && r.some(c => c && c.trim())).map(r => {
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = (r[idx] || '').trim(); });
    return obj;
  });
}

function pickField(row, candidates) {
  for (const c of candidates) if (row[c] !== undefined) return row[c];
  return '';
}

// --- Analysis ---------------------------------------------------------------

const raw = fs.readFileSync(inputPath, 'utf8');
const records = rowsToObjects(parseCSV(raw));

if (records.length === 0) {
  console.error('No rows found in CSV.');
  process.exit(1);
}

const stats = {
  total: 0,
  inbound: 0,
  missed: 0,
  afterHours: 0,
  byDay: {},
  byHour: new Array(24).fill(0),
};

const MISSED_PATTERNS = ['missed', 'voicemail', 'no answer', 'no-answer', 'noanswer', 'abandoned', 'unanswered'];
const INBOUND_PATTERNS = ['inbound', 'in', 'incoming'];

for (const r of records) {
  stats.total++;
  const direction = pickField(r, ['direction', 'type', 'call type', 'call_type']).toLowerCase();
  const status = pickField(r, ['status', 'disposition', 'result', 'call status', 'call_status']).toLowerCase();
  const dateStr = pickField(r, ['date', 'timestamp', 'start time', 'start_time', 'datetime', 'time']);

  const isInbound = INBOUND_PATTERNS.some(p => direction === p || direction.includes(p));
  if (!isInbound) continue;
  stats.inbound++;

  const isMissed = MISSED_PATTERNS.some(p => status.includes(p));
  if (!isMissed) continue;
  stats.missed++;

  if (dateStr) {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const dayKey = d.toISOString().slice(0, 10);
      stats.byDay[dayKey] = (stats.byDay[dayKey] || 0) + 1;
      const hour = d.getHours();
      stats.byHour[hour]++;
      if (hour < 7 || hour >= 18) stats.afterHours++;
    }
  }
}

const days = Object.keys(stats.byDay).length || 7;
const missRate = stats.inbound > 0 ? stats.missed / stats.inbound : 0;
const afterHoursRate = stats.missed > 0 ? stats.afterHours / stats.missed : 0;

const lostJobs = stats.missed * DEFAULT_CLOSE_RATE;
const lostRevenue = Math.round(lostJobs * avgTicket * (1 + afterHoursRate * (AFTER_HOURS_MULTIPLIER - 1)));
const annualizedLoss = Math.round(lostRevenue * (52 / (days / 7)));

// --- Number formatting ------------------------------------------------------

const usd = n => '$' + Math.round(n).toLocaleString('en-US');
const pct = n => Math.round(n * 100) + '%';

// --- Report HTML ------------------------------------------------------------

const reportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Missed Call Audit — ${shopName}</title>
<style>
  @page { size: letter; margin: 0.6in; }
  body { font-family: -apple-system, "Segoe UI", Roboto, sans-serif; color: #1a1a1a; margin: 0; padding: 40px; max-width: 760px; }
  .brand { color: #ff8a3d; font-size: 11px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; margin-bottom: 8px; }
  h1 { font-size: 28px; margin: 0 0 8px; line-height: 1.15; }
  h2 { font-size: 16px; margin: 28px 0 10px; color: #1a1a1a; border-bottom: 2px solid #ff8a3d; padding-bottom: 6px; }
  .subtitle { color: #666; font-size: 13px; margin-bottom: 24px; }
  .headline { background: linear-gradient(135deg, #ff8a3d, #f0c26e); color: #fff; padding: 28px; border-radius: 12px; margin: 20px 0 28px; }
  .headline .big { font-size: 44px; font-weight: 800; line-height: 1; margin-bottom: 6px; }
  .headline .label { font-size: 13px; opacity: .95; }
  .stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin: 16px 0; }
  .stat { border: 1px solid #e5e5e5; border-radius: 8px; padding: 14px; }
  .stat .num { font-size: 22px; font-weight: 800; color: #ff8a3d; }
  .stat .lbl { font-size: 11px; color: #666; margin-top: 4px; }
  p { line-height: 1.55; font-size: 13px; color: #333; margin: 8px 0; }
  .note { background: #fff8f0; border-left: 3px solid #ff8a3d; padding: 12px 14px; font-size: 12px; color: #5a3a1a; border-radius: 0 6px 6px 0; margin: 14px 0; }
  .cta { background: #1a1a1a; color: #fff; padding: 20px; border-radius: 10px; margin-top: 28px; }
  .cta h3 { margin: 0 0 8px; font-size: 16px; }
  .cta p { color: #ccc; font-size: 12px; margin: 0; }
  .footer { margin-top: 24px; font-size: 10px; color: #999; border-top: 1px solid #eee; padding-top: 12px; }
</style>
</head>
<body>
  <div class="brand">Agavi AI · Missed Call Audit</div>
  <h1>${shopName}</h1>
  <div class="subtitle">Report generated ${reportDate} · ${days}-day sample</div>

  <div class="headline">
    <div class="big">${usd(lostRevenue)}</div>
    <div class="label">Estimated lost revenue over the ${days}-day window analyzed.</div>
  </div>

  <h2>What your phone system actually did</h2>
  <div class="stats">
    <div class="stat"><div class="num">${stats.inbound}</div><div class="lbl">Total inbound calls</div></div>
    <div class="stat"><div class="num">${stats.missed}</div><div class="lbl">Missed calls</div></div>
    <div class="stat"><div class="num">${pct(missRate)}</div><div class="lbl">Miss rate</div></div>
  </div>
  <div class="stats">
    <div class="stat"><div class="num">${stats.afterHours}</div><div class="lbl">Missed after-hours</div></div>
    <div class="stat"><div class="num">${Math.round(lostJobs)}</div><div class="lbl">Est. lost jobs</div></div>
    <div class="stat"><div class="num">${usd(annualizedLoss)}</div><div class="lbl">Annualized loss</div></div>
  </div>

  <h2>How we got to that number</h2>
  <p>
    We pulled your call log for the ${days}-day window, filtered to inbound calls only, and counted every call that ended in voicemail, no-answer, abandoned, or unanswered status. We assumed a ${pct(DEFAULT_CLOSE_RATE)} close rate (industry average for inbound HVAC service calls) and an average ticket of ${usd(avgTicket)}.
  </p>
  <p>
    After-hours calls (${pct(afterHoursRate)} of your misses) are weighted higher because emergency service premiums typically run 25% above standard ticket.
  </p>

  <div class="note">
    <strong>Conservative on purpose.</strong> This report uses industry averages, not your actual ticket size. If your average emergency ticket is higher than ${usd(avgTicket)}, the real number is worse. We'd rather under-promise and show you the upside in person.
  </div>

  <h2>What fixes this</h2>
  <p>
    An AI receptionist that answers every call in under two rings, books the easy ones straight into your existing scheduler, and texts your on-call tech for the real emergencies. It doesn't replace your CSR — it handles the overflow and the after-hours calls she physically can't answer.
  </p>
  <p>
    Install is a flat $1,950 and takes 7 days. Your team gets trained on nothing. Your phone system keeps working the way it already does.
  </p>

  <div class="cta">
    <h3>Ready to see the fix in action?</h3>
    <p>Reply to this email or text Jay at the number on the invoice. We'll set up a 30-minute install walkthrough — no obligation, no pitch deck.</p>
  </div>

  <div class="footer">
    Agavi AI · Phoenix, AZ · jay@agaviai.com · Figures are estimates based on industry data. Your actual numbers may differ.
  </div>
</body>
</html>
`;

fs.writeFileSync(outputPath, html, 'utf8');

console.log(`\nMissed Call Audit generated for ${shopName}`);
console.log(`  Input:        ${path.resolve(inputPath)}`);
console.log(`  Output:       ${path.resolve(outputPath)}`);
console.log(`  Days sampled: ${days}`);
console.log(`  Inbound:      ${stats.inbound}`);
console.log(`  Missed:       ${stats.missed} (${pct(missRate)})`);
console.log(`  After-hours:  ${stats.afterHours}`);
console.log(`  Lost revenue: ${usd(lostRevenue)} over ${days} days`);
console.log(`  Annualized:   ${usd(annualizedLoss)}`);
console.log(`\nOpen ${outputPath} in a browser and print to PDF to deliver.`);
