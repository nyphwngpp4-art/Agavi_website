# Agavi Playbook — Daily Loop

This vault is Jay's compounding consulting brain. The librarian rules live in
[`AGENTS.md`](./AGENTS.md). This file is the human cheat sheet.

## Before your first ingest

1. Pick a backup strategy for `raw/` and `output/` (both are gitignored).
   See the **Backup** section in `AGENTS.md`.
2. Create `.backup` in this directory with one line, e.g. `provider: icloud`.
   Without it, ingest refuses to run.
3. Create `.aliases.json` (also gitignored) — start empty: `{}`.
4. **Configure Worker secrets for Beatitude scoring.** From the repo root:

   ```bash
   wrangler secret put KB_TOKEN       # any random string; mirror in .env
   wrangler secret put GROK_API_KEY   # xAI API key for /api/beatitude
   ```

   Then add the same `KB_TOKEN` to your local `.env` so slash commands can
   call `https://agaviai.com/api/beatitude` from your laptop.
5. **Run `/kb-bake` once.** It writes `public/wiki-index.json` (gitignored)
   so the Worker can serve the rubric and any wiki pages. `/kb-ingest`
   chains a bake automatically going forward.

## The loop

| When | Do | Command |
| --- | --- | --- |
| Throughout the day | Capture sources into `raw/` (Web Clipper or agent-browser). Make sure each file has frontmatter. | — |
| End of day | Promote new sources into the wiki. | `/kb-ingest` |
| Before a sales or discovery call | Pull what you already know. | `/kb-query "<question>"` |
| Before a sales or discovery call | Get a 500-word executive briefing. | `/kb-brief <topic>` |
| Once a week | Surface unexplored connections you didn't know to ask about. | `/kb-explore` |
| First of the month | Health check. | `/kb-lint` |

That's it. Don't hand-edit `wiki/`. Don't delete from `raw/`.

## KPIs (track manually until v2)

- Sources ingested per week
- Total wiki pages (sources / entities / concepts / synthesis)
- Queries per week
- Average Beatitude score on synthesis pages, trending

If sources/week stalls or the average Beatitude score drops two months in a
row, the loop has rotted — fix it before adding more.

## Scaling

This vault is designed to compound up to ~100 wiki pages / ~400K words. Past
that, retrieval quality degrades ("lost in the middle"). **The answer is a
second vault, not a bigger one** — that's why the parent directory is
`knowledge-bases/` (plural). When a focus area gets dense enough to deserve
its own brain (e.g. `knowledge-bases/agavi-crm-rollouts/`), spin it up with
its own `AGENTS.md` and let `/kb-*` commands target it explicitly.

## What's shipped

- **v1:** vault scaffold, `AGENTS.md` librarian contract, redaction policy,
  `[Source: …]` citation rule, contradiction marker, `/kb-ingest`,
  `/kb-query`, `/kb-lint`, `/kb-explore`, `/kb-brief`, Beatitude rubric,
  Beatitude stub contract.
- **v2:** Beatitude scoring wired end-to-end via the Cloudflare Worker
  (`POST /api/beatitude` calls Grok against the rubric), `/api/kb/query`
  search endpoint, `/kb-bake` slash command, `public/wiki-index.json`
  manifest, auto-revision-page creation when verdict is `revise`,
  `KB_TOKEN` + `GROK_API_KEY` Worker secrets.

## What's next (v3)

- Migrate the production deploy from hand-written `worker.js` + static
  `public/*.html` to a real Next.js build via `@opennextjs/cloudflare`.
  Once that lands, the existing Agavi Dispatch UI in `src/app/` gets to
  call `/api/beatitude` and `/api/kb/query` directly, and the brain
  becomes part of the public proof-of-craft surface. Tracked separately
  on `claude/nextjs-cloudflare-adapter` (not yet started).
- Sanitized public read-only slice of `wiki/concepts/` at
  `agaviai.com/playbook` once v3 lands.
- Embedding-based retrieval if the wiki crosses ~100 pages (the soft
  ceiling for prompt-stuffed manifests).
