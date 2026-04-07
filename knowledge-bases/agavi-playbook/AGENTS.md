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
- Every page opens with a one-paragraph summary (2–4 sentences).
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
   `wiki/entities/*.md` and `wiki/concepts/*.md` pages affected.
6. If the new material meaningfully changes a synthesis page (or warrants a
   new one), create/update it in `wiki/synthesis/` — and follow the
   **Beatitude hook** below.
7. Update `wiki/INDEX.md`.
8. Append a `log.md` entry.
9. **Stage and commit:** `git add knowledge-bases/agavi-playbook/wiki && git commit -m "ingest: <source>"`. The ingest is not complete until the commit lands.

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
- No committed wiki page contains any real identifier from `.aliases.json`.
- Every `[[wiki-link]]` resolves to an existing page.
- `INDEX.md` matches the actual file tree.
- Every `wiki/synthesis/` page has a corresponding
  `output/beatitude/<slug>.beatitude.md` (stub or scored).
- No `wiki/` page exceeds 400 lines.

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
[[wiki/concepts/beatitude-rubric]]. The actual Grok call is wired in a
follow-up branch (`functions/beatitude-check.ts` Cloudflare Function reading
`GROK_API_KEY` from Workers env). Until then, leave stubs unscored — but
**always create them**, so the contract holds the moment the function ships.

When a Beatitude verdict is `revise`, the next ingest pass must open a
`wiki/synthesis/<slug>.revision.md` quoting the flagged passages so the
material gets corrected on the next loop.

## Reserved API surface (do not refactor against)

A follow-up branch will expose the brain through Agavi Dispatch via:

- `POST /api/kb/ingest` — server-side trigger of operation 1.
- `POST /api/kb/query` — server-side trigger of operation 2, returns the
  answer file path.

Keep file layouts stable enough that those routes can `fs.readdir` /
`fs.readFile` against `wiki/` and `output/` without translation.

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
