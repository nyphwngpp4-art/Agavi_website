# Agavi Playbook — Librarian Contract

You are operating inside a dedicated **second-brain vault** for Agavi AI's
consulting practice. This file is the schema. Read it in full before any
ingest, query, or lint operation. These rules supersede any general defaults.

## Purpose

This vault compounds Jay Messamore's consulting IP across discovery calls,
vendor evaluations, engagement notes, and research. It is also the substrate
that downstream **Beatitude** alignment checks (Grok-as-judge) score against.
Quality of synthesis here directly drives the quality of client deliverables.

## Folder rules — read carefully

| Folder | Status | Who writes | Notes |
| --- | --- | --- | --- |
| `raw/` | gitignored | Human only | Source material. **Never AI-edited, never deleted by an agent.** |
| `wiki/` | committed | AI (you) | Fully maintained by the librarian. Never hand-edited by humans. |
| `output/` | gitignored | AI (you) | Generated reports, query answers, drafts. |
| `output/beatitude/` | gitignored (folder committed) | AI + Grok | Alignment scores. See "Beatitude hook" below. |
| `.aliases.json` | gitignored | Human | Real-name → pseudonym map for redaction. |

If a file in `raw/` is missing required frontmatter (see below), **do not
ingest it**. Surface the problem in the operation log instead.

## Source intake (`raw/`)

Two supported capture routes:

1. **Obsidian Web Clipper** configured to write Markdown into
   `knowledge-bases/agavi-playbook/raw/`.
2. **agent-browser** for JS-heavy or gated pages.

Every file in `raw/` must begin with YAML frontmatter:

```yaml
---
source_url: https://example.com/article
captured_at: 2026-04-07
source_type: article | call-notes | vendor-doc | internal-memo | transcript
client: client-alpha   # OPTIONAL, must be a pseudonym from .aliases.json
tags: [crm, smb, rollout]
---
```

Ingest rejects files without `source_url`, `captured_at`, and `source_type`.

## Redaction policy (non-negotiable)

`raw/` may contain real client names; **committed `wiki/` must not.**

- Maintain `knowledge-bases/agavi-playbook/.aliases.json` (gitignored) mapping
  real identifiers to stable pseudonyms (`client-alpha`, `client-bravo`,
  `vendor-gamma`, …).
- When promoting content from `raw/` into `wiki/`, replace every real
  identifier with its pseudonym. If no alias exists yet, create one and add
  it to `.aliases.json` before writing the wiki page.
- The lint operation flags any committed wiki page containing a known real
  identifier as a P0 violation.

## Wiki conventions (`wiki/`)

- One topic per `.md` file under the appropriate subdir:
  - `sources/` — one page per `raw/` file you've ingested. Summarizes,
    extracts entities/concepts, links back to the raw filename.
  - `entities/` — clients (pseudonymous), vendors, tools, people, products.
  - `concepts/` — automation patterns, ROI heuristics, frameworks, rubrics.
  - `synthesis/` — cross-source comparisons, opinionated playbook pages,
    decision guides. **These are the pages prospects would pay for.**
- Every wiki page begins with YAML frontmatter:

  ```yaml
  ---
  title: SMB CRM Rollout Patterns
  created: 2026-04-07
  last_updated: 2026-04-07
  source_count: 0          # number of distinct raw/ files cited
  status: draft            # draft | reviewed | needs_update
  tags: [crm, smb]
  ---
  ```

  Lint enforces presence and freshness of these fields.
- After the frontmatter, every page opens with a one-paragraph summary
  (2–4 sentences).
- **Citation rule (non-negotiable).** Every factual claim — every number,
  quote, vendor capability, client outcome, dated event — must end with an
  inline citation in the form `[Source: <raw-filename>.md]`. Multiple
  sources: `[Source: a.md, b.md]`. Claims without a source citation are a
  P1 lint violation. Opinion / synthesis sentences are exempt **only** when
  the page's `status` is `draft`; once promoted to `reviewed`, every
  sentence with a verifiable claim must cite.
- **Contradiction marker.** When ingest finds a new source contradicting an
  existing wiki page, do **not** silently overwrite. Insert a blockquote
  at the point of conflict in the form:

  ```
  > CONTRADICTION: [old claim, with citation] vs [new claim, with citation]
  ```

  Lint surfaces every `CONTRADICTION:` marker as a P1 requiring human
  resolution. The contradicted page's `status` flips to `needs_update`
  until a human resolves it on the next ingest.
- Cross-link with `[[wiki-link]]` syntax. Every entity and concept reference
  must be a link, not bare text.
- Keep pages short and additive. If a page exceeds ~400 lines, split it.
- `INDEX.md` lists every page with a one-line description, grouped by subdir.
  Update it on every ingest.
- `log.md` appends a dated entry for every ingest, query, and lint operation:
  `## YYYY-MM-DD — <op> — <summary>`.

## The four operations

### 1. Ingest

Trigger: new file(s) in `raw/`, or `/kb-ingest`.

1. List files in `raw/` not yet referenced from `wiki/sources/`.
2. For each, validate frontmatter. Reject and log if invalid.
3. Read the file. Extract: summary, entities, concepts, claims, evidence.
4. Apply redaction policy.
5. Create/update `wiki/sources/<slug>.md`, plus any
   `wiki/entities/*.md` and `wiki/concepts/*.md` pages affected. **Soft
   target: a single new source should touch 10–15 wiki pages.** If you
   only touched 1–3, you are being lazy — re-read the source for entities,
   adjacent concepts, and synthesis implications you skipped. Note the
   final count in the log entry.
6. For every claim that contradicts an existing page, insert the
   `> CONTRADICTION:` marker per the wiki conventions and flip the
   contradicted page's `status` to `needs_update`. Do **not** auto-resolve.
7. If the new material meaningfully changes a synthesis page (or warrants a
   new one), create/update it in `wiki/synthesis/` — and follow the
   **Beatitude hook** below.
8. Bump `last_updated` and `source_count` on every page touched.
9. Update `wiki/INDEX.md`.
10. Append a `log.md` entry including the page-touch count.
11. **Stage and commit:** `git add knowledge-bases/agavi-playbook/wiki && git commit -m "ingest: <source>"`. The ingest is not complete until the commit lands.

### 2. Query

Trigger: `/kb-query "<question>"`.

1. Grep `wiki/` for relevant pages.
2. Read the matches and any pages they link to (one hop).
3. Answer in Markdown, citing wiki pages by relative path.
4. Write the answer to `output/<YYYY-MM-DD>-<slug>.md`.
5. Append a `log.md` entry.
6. If the answer required composing material that doesn't exist yet as a
   synthesis page, propose creating one in the response (do not auto-write).

### 3. Lint

Trigger: `/kb-lint` (also scheduled monthly).

Checks:
- Every `wiki/sources/` page references a file that exists in `raw/`.
- **P0:** No committed wiki page contains any real identifier from
  `.aliases.json`.
- Every `[[wiki-link]]` resolves to an existing page.
- `INDEX.md` matches the actual file tree.
- Every `wiki/synthesis/` page has a corresponding
  `output/beatitude/<slug>.beatitude.md` (stub or scored).
- No `wiki/` page exceeds 400 lines.
- **P1:** Every wiki page has valid frontmatter (`title`, `created`,
  `last_updated`, `source_count`, `status`). Pages whose `last_updated` is
  more than 90 days stale and whose `status` is still `draft` are flagged.
- **P1:** Every factual claim on a `status: reviewed` page has a
  `[Source: …]` citation. List uncited claim lines with file and line
  number.
- **P1:** Every `> CONTRADICTION:` marker is surfaced — these block
  promotion of the host page from `needs_update` back to `reviewed`.

Write the report to `output/lint/<YYYY-MM-DD>.md` and append a `log.md` entry.

### 4. Onboarding

This file is the onboarding. New agents read it top to bottom before acting.

## Beatitude hook (the differentiator)

Any page written into `wiki/synthesis/`, and any client-facing draft written
into `output/`, **must** trigger creation of a sibling stub at
`output/beatitude/<slug>.beatitude.md` with this shape:

```yaml
---
source_page: wiki/synthesis/<slug>.md
checked_at: null
model: null
score: null
---

## Beatitude alignment

| Beatitude | Question | Score (0–3) | Notes |
| --- | --- | --- | --- |
| Poor in spirit | … | | |
| Mourn | … | | |
| Meek | … | | |
| Hunger for righteousness | … | | |
| Merciful | … | | |
| Pure in heart | … | | |
| Peacemakers | … | | |
| Persecuted for righteousness | … | | |

**Total:** _ / 24
**Verdict:** pass | revise
```

The questions and scoring scale come from
[[wiki/concepts/beatitude-rubric]]. The actual Grok call is wired into the
deployed Cloudflare Worker (`worker.js`) at `POST /api/beatitude` — see
"Worker API surface" below. Until you have run `/kb-bake` at least once and
`KB_TOKEN`/`GROK_API_KEY` are configured, leave stubs unscored, but
**always create them**, so the contract holds.

When a Beatitude verdict is `revise`, the next ingest pass must open a
`wiki/synthesis/<slug>.revision.md` quoting the flagged passages so the
material gets corrected on the next loop. The `/kb-ingest` slash command
does this automatically once scoring is wired.

## Worker API surface

**Important deployment fact:** the production runtime is the hand-written
Cloudflare Worker at repo root (`worker.js`), not Next.js. `wrangler.jsonc`
deploys `worker.js` plus everything in `public/` as static assets. The
`src/app/` Next.js app is not currently part of the production build —
Dispatch UI integration with the brain waits for a separate adapter
migration branch (`claude/nextjs-cloudflare-adapter`, future).

The Worker exposes two brain endpoints:

### `POST /api/beatitude`

Body: `{ "source_page": "wiki/synthesis/<slug>.md", "body": "<full markdown>" }`

Auth: `Authorization: Bearer ${KB_TOKEN}`

Loads the rubric from `public/wiki-index.json` (the baked manifest), sends
it plus the page body to Grok, and returns:

```json
{
  "source_page": "wiki/synthesis/<slug>.md",
  "beatitude_alignment": [
    { "name": "Poor in spirit", "score": 0, "notes": "..." },
    ...
  ],
  "total": 0,
  "verdict": "pass" | "revise" | "n/a",
  "summary": "...",
  "model": "grok-2-latest",
  "checked_at": "<ISO-8601>"
}
```

The local `/kb-ingest` slash command writes this verbatim into
`output/beatitude/<slug>.beatitude.md`.

### `POST /api/kb/query`

Body: `{ "question": "...", "limit": 5 }`

Auth: `Authorization: Bearer ${KB_TOKEN}`

Returns the top matching pages from the baked manifest, with snippets and
relevance scores. **Search-only — does not generate answers.** Generative
answers are still produced locally by the `/kb-query` slash command (which
has direct filesystem access). This endpoint exists for external callers
(future Dispatch UI, curl from anywhere) that need to discover what the
wiki covers.

## Worker secrets and the bake step

The Worker depends on three things being in place:

1. **`public/wiki-index.json`** — the baked manifest. Regenerated by
   `/kb-bake`; gitignored. `/kb-ingest` chains a bake at the end. Without
   it, `/api/beatitude` and `/api/kb/query` return 503.
2. **`KB_TOKEN`** — bearer token gating both brain endpoints. Set with
   `wrangler secret put KB_TOKEN` and mirrored in your local `.env` so
   slash commands can call the Worker.
3. **`GROK_API_KEY`** — xAI API key used by `/api/beatitude`. Set with
   `wrangler secret put GROK_API_KEY`.

If any of the three is missing, the affected endpoint returns 503 with a
descriptive error rather than failing silently.

## Backup (do this before your first real ingest)

`raw/` and `output/` are gitignored, which means **they have zero backup by
default**. Pick one before relying on this vault:

- iCloud / Dropbox sync the parent directory, OR
- A separate private git repo just for `raw/`, OR
- Encrypted S3 / Backblaze rsync on a cron.

The librarian refuses to ingest if `knowledge-bases/agavi-playbook/.backup`
is missing. That file is a one-line marker (`provider: icloud` etc.) the
human creates after choosing.

## Focus areas (refine over time)

Agavi's public positioning covers: CRM, Finance, Customer Service, Sales,
Operations, Marketing. Tag wiki pages accordingly. New focus areas are added
as Jay's engagements expand.
