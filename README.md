# Agavi

Repository for [agaviai.com](https://agaviai.com). Three things live here:

1. **Marketing site** — static HTML in `public/*.html`, served by the Cloudflare
   Worker. Edit those files directly.
2. **Agavi Dispatch** — a Next.js 16 PWA in `src/` that Jay uses as a command
   interface for n8n / OpenClaw workflows. Builds as a static export under
   `/dispatch/` and is gated by Cloudflare Access.
3. **Consulting playbook knowledge base** — flat-markdown "second brain" in
   `knowledge-bases/agavi-playbook/`. See that directory's `AGENTS.md` for the
   librarian rules, Beatitude alignment hook, and baked manifest schema.

The Worker entry point is `worker.js` (hand-written, no bundler). Deploy config
is `wrangler.jsonc`.

## Dispatch: local development

```bash
npm install
npm run dev
```

Opens on `http://localhost:3000/dispatch/`. The API proxy (`/api/dispatch/:id`)
lives in the Worker, not Next, so `npm run dev` alone can't reach real n8n
webhooks. For end-to-end tests, run `npm run build:dispatch` and `wrangler dev`
side-by-side, or hit production behind Access.

## Dispatch: deploy

```bash
npm run build:dispatch    # emits public/dispatch/ (gitignored)
wrangler deploy
```

`build:dispatch` runs `next build` (static export → `out/`) then copies `out/`
into `public/dispatch/` so the existing Workers Assets binding serves it.
`public/dispatch/` is gitignored — it's a regenerated artifact, never checked in.

### Required Worker secrets

Set with `wrangler secret put <NAME>`:

| Secret | Required? | Purpose |
| --- | --- | --- |
| `MAKE_WEBHOOK_URL` | optional | Marketing contact form → Make.com |
| `AGAVI_WEBHOOK_URL` | optional | Marketing contact form → n8n |
| `AGAVI_WEBHOOK_TOKEN` | optional | Bearer for `AGAVI_WEBHOOK_URL` |
| `KB_TOKEN` | for `/api/beatitude`, `/api/kb/query` | Shared bearer gating knowledge-base endpoints |
| `GROK_API_KEY` | for `/api/beatitude` | xAI Grok key used as the Beatitude judge |
| `WEBHOOK_AGAVI_LEAD_INTAKE` | per-workflow | Dispatch → n8n lead intake hook |
| `WEBHOOK_AGAVI_IDEA_CAPTURE` | per-workflow | Dispatch → n8n idea capture hook |
| `WEBHOOK_OPENCLAW_PROSPECT` | per-workflow | Dispatch → OpenClaw prospect agent |
| `WEBHOOK_OPENCLAW_TASK` | per-workflow | Dispatch → OpenClaw task agent |
| `WEBHOOK_OPENCLAW_MEETING` | per-workflow | Dispatch → OpenClaw meeting prep agent |
| `WEBHOOK_TOKEN_<ID>` | optional per-workflow | Bearer for that workflow's webhook |

Naming convention: `WEBHOOK_<ID_UPPERCASE_UNDERSCORED>` — the Worker derives the
key from the path segment. Workflows without a configured secret return 503
gracefully, so it's safe to stand up Dispatch with only the hooks Jay actually
uses today.

Adding a workflow: edit `src/lib/workflows.ts` **and** the
`DISPATCH_WORKFLOWS` map in `worker.js` (the Worker keeps a trimmed copy
because it can't import the TS config).

### Cloudflare Access (protecting `/dispatch`)

Dispatch is Jay-only. Lock it down with Cloudflare Zero Trust (free tier).

1. **Zero Trust dashboard** → Access → Applications → Add an application →
   Self-hosted.
2. **Application domain**: `agaviai.com/dispatch*`.
3. **Add another domain** on the same application:
   `agaviai.com/api/dispatch/*`.
   This is the part that's easy to miss — the SPA lives under `/dispatch/` but
   the proxy it `fetch`es is at `/api/dispatch/:id` on the Worker root. If you
   only protect `/dispatch*`, the HTML loads behind Access but the API
   bypasses it.
4. **Identity**: add Jay's Google / email OTP as the identity provider.
5. **Policy**: Allow → email equals `<jay's email>`. Nothing else.
6. **Session duration**: 24h is comfortable for daily use.
7. Save. First hit to `agaviai.com/dispatch/` should now bounce through the
   Access login.

The marketing site at `/`, `/about`, etc. is deliberately **not** covered by
the Access application — it stays public.

## Knowledge base

See `knowledge-bases/agavi-playbook/AGENTS.md` for vault rules, the
`[Source:]` citation convention, the Beatitude scoring contract, and the
`/kb-bake` → `public/wiki-index.json` manifest pipeline that feeds
`/api/kb/query` and `/api/beatitude`.

## Repo-wide conventions

- Root `AGENTS.md` covers Next.js-version gotchas (Next 16 has breaking
  changes from training data — read `node_modules/next/dist/docs/` before
  touching the Next app).
- When working inside `knowledge-bases/agavi-playbook/`, that directory's
  local `AGENTS.md` takes precedence for vault operations.
