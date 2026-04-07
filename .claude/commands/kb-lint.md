---
description: Health-check the Agavi playbook vault and write a dated lint report.
---

You are operating against the Agavi consulting-playbook second brain at
`knowledge-bases/agavi-playbook/`. Read
`knowledge-bases/agavi-playbook/AGENTS.md` first — its rules supersede
defaults.

Then perform **operation 3: Lint** exactly as specified there. Run all
checks; do not stop on the first failure.

Checks (each becomes a section in the report):

1. **Source backlinks.** Every `wiki/sources/*.md` references a file that
   exists in `raw/`. Flag stale entries.
2. **Redaction.** No committed wiki page contains any real identifier listed
   in `.aliases.json`. This is **P0** — list every offending page and the
   leaked identifier.
3. **Link integrity.** Every `[[wiki-link]]` resolves to an existing page.
4. **Index drift.** `wiki/INDEX.md` matches the actual file tree under
   `wiki/`. List missing or extra entries.
5. **Beatitude coverage.** Every `wiki/synthesis/*.md` has a corresponding
   `output/beatitude/<slug>.beatitude.md` (stub or scored).
6. **Page size.** No `wiki/` page exceeds 400 lines.

Write the report to
`knowledge-bases/agavi-playbook/output/lint/<YYYY-MM-DD>.md` (create
`output/lint/` if missing). Append a dated entry to `wiki/log.md`
summarizing pass/fail counts.

Report back: total issues by severity, the report path, and the top three
things to fix first.

$ARGUMENTS
