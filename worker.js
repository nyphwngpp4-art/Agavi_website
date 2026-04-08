// Worker entry point.
//
// Routes:
//   POST /api/contact         lead intake → Make.com / Agavi webhook
//   POST /api/dispatch/:id    Agavi Dispatch proxy → n8n / OpenClaw webhooks
//   POST /api/beatitude       Grok-based alignment scoring of a wiki page
//   POST /api/kb/query        full-text search over the baked wiki manifest
//
// Static assets (index.html, about.html, public/dispatch/*, public/wiki-index.json, …)
// are served automatically from public/ before reaching this Worker. The wiki
// manifest is baked locally by the /kb-bake slash command and gitignored — see
// knowledge-bases/agavi-playbook/AGENTS.md for the schema. The Dispatch SPA is
// built by `npm run build:dispatch` into public/dispatch/ and deployed behind
// Cloudflare Access.

const KB_ROUTES = new Set(["/api/beatitude", "/api/kb/query"]);
const DISPATCH_ROUTE = /^\/api\/dispatch\/([a-z0-9-]+)\/?$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      if (request.method === "OPTIONS") return cors();
      if (request.method === "POST") return handleContact(request, env);
    }

    const dispatchMatch = url.pathname.match(DISPATCH_ROUTE);
    if (dispatchMatch) {
      if (request.method === "OPTIONS") return cors();
      if (request.method !== "POST") {
        return json({ error: "Method not allowed" }, 405);
      }
      return handleDispatch(request, env, dispatchMatch[1]);
    }

    if (KB_ROUTES.has(url.pathname)) {
      if (request.method === "OPTIONS") return cors();
      if (request.method !== "POST") {
        return json({ error: "Method not allowed" }, 405);
      }
      const auth = checkKbAuth(request, env);
      if (auth) return auth;

      if (url.pathname === "/api/beatitude") {
        return handleBeatitude(request, env);
      }
      if (url.pathname === "/api/kb/query") {
        return handleKbQuery(request, env);
      }
    }

    return new Response("Not Found", { status: 404 });
  },
};

// ----- /api/contact ---------------------------------------------------------

async function handleContact(request, env) {
  try {
    const body = await request.json();
    const required = ["name", "company", "email", "message"];
    for (const field of required) {
      if (!body[field] || !String(body[field]).trim()) {
        return json({ error: `Missing required field: ${field}` }, 400);
      }
    }

    const lead = {
      ...body,
      name: String(body.name).trim(),
      company: String(body.company).trim(),
      email: String(body.email).trim(),
      phone: String(body.phone || "").trim(),
      message: String(body.message).trim(),
      receivedAt: new Date().toISOString(),
      website: "agaviai.com",
    };

    const events = [];

    if (env.MAKE_WEBHOOK_URL) {
      const makeResponse = await fetch(env.MAKE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pipeline: "agavi_lead_intake", lead }),
      });
      events.push({ target: "make", ok: makeResponse.ok, status: makeResponse.status });
    }

    if (env.AGAVI_WEBHOOK_URL) {
      const headers = { "Content-Type": "application/json" };
      if (env.AGAVI_WEBHOOK_TOKEN) {
        headers["Authorization"] = `Bearer ${env.AGAVI_WEBHOOK_TOKEN}`;
      }
      const agaviResponse = await fetch(env.AGAVI_WEBHOOK_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ type: "lead_intake", assistant: "Agavi", lead }),
      });
      events.push({ target: "agavi", ok: agaviResponse.ok, status: agaviResponse.status });
    }

    return json({ ok: true, message: "Lead submitted successfully.", events });
  } catch (error) {
    return json(
      { error: "Invalid request.", detail: error instanceof Error ? error.message : "Unknown error" },
      400
    );
  }
}

// ----- /api/dispatch/:id ----------------------------------------------------
//
// Proxies dispatched commands from the Agavi Dispatch SPA (served at
// /dispatch/*) to the corresponding n8n / OpenClaw webhook. This route was
// ported from src/app/api/dispatch/[id]/route.ts when Dispatch was flipped
// to a static export (Next can only emit GET route handlers under
// `output: "export"`).
//
// Trust boundary: server-side Zod validation is intentionally skipped. The
// Dispatch client already validates every form with Zod before the fetch
// lands here, and this Worker is gated behind Cloudflare Access on the
// /dispatch/* SPA. Bundling Zod + lib/workflows.ts into a hand-written
// Worker is overkill; we trust the post-validation payload and forward it.
// If this route is ever exposed to untrusted callers, reintroduce schema
// validation (either by running wrangler's bundler or by hand-porting the
// schemas).
//
// Webhook URLs + optional bearer tokens are resolved from env vars by
// convention:
//   WEBHOOK_<ID_UPPERCASE_UNDERSCORED>        → webhook URL (required)
//   WEBHOOK_TOKEN_<ID_UPPERCASE_UNDERSCORED>  → bearer token (optional)
// e.g. workflow id `agavi-lead-intake` → WEBHOOK_AGAVI_LEAD_INTAKE.
//
// Response shape matches the original Next route for client compatibility:
//   { success, status, workflowId, target, response }

// Known workflow IDs from src/lib/workflows.ts. Kept in sync by hand.
// `target` is cosmetic — the client surfaces it in dispatch history. If you
// add a workflow in lib/workflows.ts, add its id+target here too.
const DISPATCH_WORKFLOWS = {
  "agavi-lead-intake": "n8n",
  "agavi-idea-capture": "n8n",
  "openclaw-prospect": "openclaw",
  "openclaw-task": "openclaw",
  "openclaw-meeting": "openclaw",
};

async function handleDispatch(request, env, workflowId) {
  const target = DISPATCH_WORKFLOWS[workflowId];
  if (!target) {
    return json({ error: "Unknown workflow" }, 404);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const envKey = `WEBHOOK_${workflowId.replace(/-/g, "_").toUpperCase()}`;
  const webhookUrl = env[envKey];
  if (!webhookUrl) {
    return json(
      { error: `Webhook not configured. Set ${envKey} with \`wrangler secret put ${envKey}\`.` },
      503
    );
  }

  const tokenKey = `WEBHOOK_TOKEN_${workflowId.replace(/-/g, "_").toUpperCase()}`;
  const token = env[tokenKey];

  try {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const responseData = await response.text();

    return json({
      success: response.ok,
      status: response.status,
      workflowId,
      target,
      response: responseData,
    });
  } catch (error) {
    return json(
      { error: "Dispatch failed", message: errorMessage(error) },
      502
    );
  }
}

// ----- /api/beatitude -------------------------------------------------------
//
// Body: { source_page: "wiki/synthesis/<slug>.md", body: "<markdown>" }
//
// Loads the rubric from the baked wiki manifest, asks Grok to score the page
// against the eight Beatitudes, and returns a structured result. The local
// /kb-ingest slash command writes the response into
// output/beatitude/<slug>.beatitude.md.

const GROK_ENDPOINT = "https://api.x.ai/v1/chat/completions";
const GROK_MODEL = "grok-2-latest";

async function handleBeatitude(request, env) {
  if (!env.GROK_API_KEY) {
    return json({ error: "GROK_API_KEY not configured on Worker" }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const sourcePage = String(body.source_page || "").trim();
  const pageBody = String(body.body || "").trim();
  if (!sourcePage || !pageBody) {
    return json({ error: "source_page and body are required" }, 400);
  }

  const manifest = await loadManifest(request, env);
  if (!manifest) {
    return json(
      { error: "wiki manifest missing — run /kb-bake locally and redeploy" },
      503
    );
  }
  if (!manifest.rubric) {
    return json({ error: "manifest missing rubric body" }, 503);
  }

  const prompt = buildBeatitudePrompt(manifest.rubric, sourcePage, pageBody);

  let grokResponse;
  try {
    grokResponse = await fetch(GROK_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROK_MODEL,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a strict alignment judge. You score consulting deliverables against the Beatitudes rubric provided in the user message. You always reply with a single JSON object matching the schema in the user message. You never add prose outside the JSON.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });
  } catch (error) {
    return json(
      { error: "Grok request failed", detail: errorMessage(error) },
      502
    );
  }

  if (!grokResponse.ok) {
    const detail = await grokResponse.text().catch(() => "");
    return json(
      { error: "Grok returned non-2xx", status: grokResponse.status, detail },
      502
    );
  }

  let grokJson;
  try {
    grokJson = await grokResponse.json();
  } catch (error) {
    return json({ error: "Grok response was not JSON", detail: errorMessage(error) }, 502);
  }

  const content = grokJson?.choices?.[0]?.message?.content;
  if (!content) {
    return json({ error: "Grok response missing content", raw: grokJson }, 502);
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (error) {
    return json({ error: "Grok content was not valid JSON", content }, 502);
  }

  const result = normalizeBeatitudeResult(parsed, sourcePage);
  if (result.error) return json(result, 422);

  return json({
    ...result,
    model: GROK_MODEL,
    checked_at: new Date().toISOString(),
  });
}

function buildBeatitudePrompt(rubricBody, sourcePage, pageBody) {
  return [
    "RUBRIC (verbatim from wiki/concepts/beatitude-rubric.md):",
    "",
    rubricBody,
    "",
    "---",
    "",
    `SOURCE PAGE: ${sourcePage}`,
    "",
    "PAGE BODY:",
    pageBody,
    "",
    "---",
    "",
    "Score the page above against the rubric. Reply with a single JSON object",
    "exactly matching this schema:",
    "",
    "{",
    '  "beatitude_alignment": [',
    '    { "name": "Poor in spirit", "score": 0, "notes": "..." },',
    '    { "name": "Mourn", "score": 0, "notes": "..." },',
    '    { "name": "Meek", "score": 0, "notes": "..." },',
    '    { "name": "Hunger for righteousness", "score": 0, "notes": "..." },',
    '    { "name": "Merciful", "score": 0, "notes": "..." },',
    '    { "name": "Pure in heart", "score": 0, "notes": "..." },',
    '    { "name": "Peacemakers", "score": 0, "notes": "..." },',
    '    { "name": "Persecuted for righteousness", "score": 0, "notes": "..." }',
    "  ],",
    '  "total": 0,',
    '  "verdict": "pass" | "revise" | "n/a",',
    '  "summary": "one or two sentences"',
    "}",
    "",
    "Each score is an integer 0–3 per the rubric scale. The total is the sum",
    "(0–24). Use the rubric's verdict thresholds: 20–24 pass, 0–19 revise.",
    "If the page contains no client-facing claims at all (e.g. a pure",
    "vocabulary page), return verdict 'n/a' and zeros for every score.",
  ].join("\n");
}

const BEATITUDE_NAMES = [
  "Poor in spirit",
  "Mourn",
  "Meek",
  "Hunger for righteousness",
  "Merciful",
  "Pure in heart",
  "Peacemakers",
  "Persecuted for righteousness",
];

function normalizeBeatitudeResult(parsed, sourcePage) {
  const alignment = Array.isArray(parsed?.beatitude_alignment)
    ? parsed.beatitude_alignment
    : null;
  if (!alignment || alignment.length !== 8) {
    return { error: "beatitude_alignment must be an array of 8 entries" };
  }

  const normalized = BEATITUDE_NAMES.map((name, i) => {
    const entry = alignment[i] || {};
    const score = Number.isInteger(entry.score) ? entry.score : -1;
    return {
      name,
      score: score >= 0 && score <= 3 ? score : 0,
      notes: String(entry.notes || "").slice(0, 500),
    };
  });

  const total = normalized.reduce((sum, e) => sum + e.score, 0);
  const verdictRaw = String(parsed?.verdict || "").toLowerCase();
  const verdict =
    verdictRaw === "n/a"
      ? "n/a"
      : total >= 20
      ? "pass"
      : "revise";

  return {
    source_page: sourcePage,
    beatitude_alignment: normalized,
    total,
    verdict,
    summary: String(parsed?.summary || "").slice(0, 1000),
  };
}

// ----- /api/kb/query --------------------------------------------------------
//
// Body: { question: "...", limit?: number }
//
// Returns the top matching pages from the baked manifest with snippets.
// This is a search endpoint, not a generative one — generative answers are
// produced locally by the /kb-query slash command (which has direct
// filesystem access). External callers (eventually the Dispatch UI) get
// matches and can decide whether to throw an LLM at them.

async function handleKbQuery(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const question = String(body.question || "").trim();
  if (!question) return json({ error: "question is required" }, 400);
  const limit = Math.min(Math.max(Number(body.limit) || 5, 1), 20);

  const manifest = await loadManifest(request, env);
  if (!manifest) {
    return json(
      { error: "wiki manifest missing — run /kb-bake locally and redeploy" },
      503
    );
  }

  const terms = tokenize(question);
  if (terms.length === 0) return json({ matches: [], question });

  const scored = manifest.pages
    .map((page) => {
      const haystack = `${page.title} ${(page.tags || []).join(" ")} ${page.body}`.toLowerCase();
      let score = 0;
      for (const term of terms) {
        const occurrences = countOccurrences(haystack, term);
        score += occurrences;
        if (page.title.toLowerCase().includes(term)) score += 5;
        if ((page.tags || []).some((t) => t.toLowerCase() === term)) score += 3;
      }
      return { page, score };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ page, score }) => ({
      path: `wiki/${page.path}`,
      title: page.title,
      tags: page.tags || [],
      status: page.status,
      score,
      snippet: snippet(page.body, terms),
    }));

  return json({
    question,
    matches: scored,
    manifest_generated_at: manifest.generated_at,
  });
}

function tokenize(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 3);
}

function countOccurrences(haystack, needle) {
  let count = 0;
  let idx = 0;
  while ((idx = haystack.indexOf(needle, idx)) !== -1) {
    count++;
    idx += needle.length;
  }
  return count;
}

function snippet(body, terms) {
  const lower = body.toLowerCase();
  for (const term of terms) {
    const idx = lower.indexOf(term);
    if (idx !== -1) {
      const start = Math.max(0, idx - 80);
      const end = Math.min(body.length, idx + 160);
      return (start > 0 ? "…" : "") + body.slice(start, end).replace(/\s+/g, " ").trim() + (end < body.length ? "…" : "");
    }
  }
  return body.slice(0, 200).replace(/\s+/g, " ").trim();
}

// ----- shared helpers -------------------------------------------------------

async function loadManifest(request, env) {
  if (!env.ASSETS) return null;
  try {
    const url = new URL("/wiki-index.json", request.url);
    const res = await env.ASSETS.fetch(new Request(url.toString()));
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function checkKbAuth(request, env) {
  if (!env.KB_TOKEN) {
    return json(
      { error: "KB_TOKEN not configured on Worker — set with `wrangler secret put KB_TOKEN`" },
      503
    );
  }
  const header = request.headers.get("Authorization") || "";
  if (header !== `Bearer ${env.KB_TOKEN}`) {
    return json({ error: "Unauthorized" }, 401);
  }
  return null;
}

function cors() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
  });
}

function errorMessage(error) {
  return error instanceof Error ? error.message : "Unknown error";
}
