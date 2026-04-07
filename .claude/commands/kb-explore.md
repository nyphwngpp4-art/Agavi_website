---
description: Surface unexplored connections in the Agavi playbook vault.
---

You are operating against the Agavi consulting-playbook second brain at
`knowledge-bases/agavi-playbook/`. Read
`knowledge-bases/agavi-playbook/AGENTS.md` first — its rules supersede
defaults.

Perform an **EXPLORE** pass: surface things Jay didn't know to ask about.
The point is not to answer a question — it's to find connections in the
existing wiki that have not yet been written into a synthesis page.

Optional focus area from the user: **$ARGUMENTS** (if blank, scan the whole
vault).

Steps:

1. List every page under `wiki/entities/` and `wiki/concepts/` (filter by
   tag if a focus area was given).
2. For each, identify which other entities/concepts it co-occurs with
   across `wiki/sources/` pages but does **not** yet share a
   `wiki/synthesis/` page with.
3. Pick the **5 most interesting unexplored connections** — interesting
   meaning: high co-occurrence, meaningful contrast, or a pattern that
   would change a sales conversation.
4. For each, write a 3–5 sentence pitch: what the connection is, which
   sources support it, why it matters for an Agavi engagement, and what
   the proposed synthesis page would be titled.
5. Write the full report to
   `knowledge-bases/agavi-playbook/output/<YYYY-MM-DD>-explore.md`.
6. Append a dated entry to `wiki/log.md`.

**Do not write any synthesis page yourself.** EXPLORE only proposes; the
human picks which ones get promoted on the next ingest.

Report back: the report path and a one-line teaser for each of the 5
connections.
