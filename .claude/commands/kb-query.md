---
description: Query the Agavi playbook vault and write a dated answer to output/.
---

You are operating against the Agavi consulting-playbook second brain at
`knowledge-bases/agavi-playbook/`. Read
`knowledge-bases/agavi-playbook/AGENTS.md` first — its rules supersede
defaults.

Then perform **operation 2: Query** exactly as specified there.

The user's question is: **$ARGUMENTS**

Steps:

1. Grep `knowledge-bases/agavi-playbook/wiki/` for pages relevant to the
   question.
2. Read the matches and any pages they `[[wiki-link]]` to (one hop only).
3. Compose a Markdown answer that:
   - Leads with a direct answer in 2–4 sentences.
   - Cites every supporting wiki page by relative path.
   - Flags gaps where the wiki has no coverage — those are ingest targets.
4. Write the answer to
   `knowledge-bases/agavi-playbook/output/<YYYY-MM-DD>-<slug>.md` where
   `<slug>` is a kebab-case version of the question.
5. Append a dated entry to `wiki/log.md`.
6. If the answer required composing material that should become its own
   synthesis page, **propose** creating it in your reply — do not write it.
   The user decides whether to promote it on the next ingest.

Report back: the answer file path, the wiki pages cited, and any proposed
new synthesis pages.
