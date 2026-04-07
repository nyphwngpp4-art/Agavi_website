# Agavi Playbook — Daily Loop

This vault is Jay's compounding consulting brain. The librarian rules live in
[`AGENTS.md`](./AGENTS.md). This file is the human cheat sheet.

## Before your first ingest

1. Pick a backup strategy for `raw/` and `output/` (both are gitignored).
   See the **Backup** section in `AGENTS.md`.
2. Create `.backup` in this directory with one line, e.g. `provider: icloud`.
   Without it, ingest refuses to run.
3. Create `.aliases.json` (also gitignored) — start empty: `{}`.

## The loop

| When | Do | Command |
| --- | --- | --- |
| Throughout the day | Capture sources into `raw/` (Web Clipper or agent-browser). Make sure each file has frontmatter. | — |
| End of day | Promote new sources into the wiki. | `/kb-ingest` |
| Before a sales or discovery call | Pull what you already know. | `/kb-query "<question>"` |
| First of the month | Health check. | `/kb-lint` |

That's it. Don't hand-edit `wiki/`. Don't delete from `raw/`.

## KPIs (track manually until v2)

- Sources ingested per week
- Total wiki pages (sources / entities / concepts / synthesis)
- Queries per week
- Average Beatitude score on synthesis pages, trending

If sources/week stalls or the average Beatitude score drops two months in a
row, the loop has rotted — fix it before adding more.

## What's next (v2)

- Wire `functions/beatitude-check.ts` to Grok and start filling stub scores.
- Expose `/api/kb/query` and `/api/kb/ingest` through Agavi Dispatch in
  `src/app/`.
- Auto-open `*.revision.md` for any synthesis page that scores `revise`.
