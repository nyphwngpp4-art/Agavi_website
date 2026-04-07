---
description: Compose a 500-word executive briefing on a topic from the Agavi playbook vault.
---

You are operating against the Agavi consulting-playbook second brain at
`knowledge-bases/agavi-playbook/`. Read
`knowledge-bases/agavi-playbook/AGENTS.md` first — its rules supersede
defaults.

Compose an **executive briefing** Jay can read in two minutes before a
sales or discovery call.

Topic: **$ARGUMENTS**

Steps:

1. Grep `wiki/` for pages relevant to the topic. Read matches plus
   one-hop links.
2. Write a ~500-word briefing with this structure:
   - **Bottom line** (2 sentences) — what Jay should walk into the room
     believing.
   - **What we know** (3–5 bullets) — the evidenced claims, each with
     `[Source: …]` citations to wiki pages by relative path.
   - **What we don't know yet** (1–3 bullets) — gaps the wiki has not
     covered. These are ingest targets.
   - **Talking points** (3 bullets) — phrasings Jay can use directly.
   - **Risks / things to avoid saying** (1–3 bullets).
3. Write the briefing to
   `knowledge-bases/agavi-playbook/output/<YYYY-MM-DD>-brief-<slug>.md`.
4. Append a dated entry to `wiki/log.md`.

Hard rules:
- Never invent a fact. If the wiki doesn't support a claim, it goes in
  "What we don't know yet."
- Cite every "What we know" bullet.
- Keep the total length under 600 words. Briefings are read at a glance.

Report back: the briefing file path and the bottom-line sentence.
