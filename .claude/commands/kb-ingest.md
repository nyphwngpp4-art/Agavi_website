---
description: Ingest new sources from raw/ into the Agavi playbook vault wiki.
---

You are operating against the Agavi consulting-playbook second brain at
`knowledge-bases/agavi-playbook/`. Read
`knowledge-bases/agavi-playbook/AGENTS.md` in full **before doing anything
else** — it is the schema and supersedes any defaults you would otherwise
apply.

Then perform **operation 1: Ingest** exactly as specified there:

1. Confirm `knowledge-bases/agavi-playbook/.backup` exists. If not, stop and
   tell the user to create it (see README).
2. List files in `knowledge-bases/agavi-playbook/raw/` not already referenced
   from `wiki/sources/`.
3. For each new file: validate frontmatter (`source_url`, `captured_at`,
   `source_type` required). Reject invalid files and log them; do not stop
   the run.
4. Read each valid file. Extract summary, entities, concepts, claims,
   evidence.
5. Apply the redaction policy against `.aliases.json`. Add new pseudonyms
   there before writing any wiki page that needs them.
6. Create or update `wiki/sources/<slug>.md`, plus affected
   `wiki/entities/*.md` and `wiki/concepts/*.md`. **Soft target: 10–15
   wiki pages touched per source.** If your count is below 5, re-read the
   source for entities, adjacent concepts, and synthesis implications you
   skipped. Only stop low when the source genuinely is that narrow.
7. Every claim you write on a wiki page must end with a
   `[Source: <raw-filename>.md]` citation per AGENTS.md.
8. When a new claim contradicts an existing wiki page, insert a
   `> CONTRADICTION: [old, with cite] vs [new, with cite]` marker at the
   point of conflict and flip the contradicted page's `status` to
   `needs_update`. Do not silently overwrite.
9. Bump `last_updated` and `source_count` frontmatter fields on every page
   you touched.
10. Create or update `wiki/synthesis/*.md` only when the new material
    meaningfully shifts a synthesis page or warrants a new one. For each
    synthesis page touched, create the matching
    `output/beatitude/<slug>.beatitude.md` stub per the Beatitude hook.
11. Update `wiki/INDEX.md` to match the actual file tree.
12. Append a dated entry to `wiki/log.md` including the page-touch count.
13. **Bake the wiki manifest.** Run the bake step (or invoke `/kb-bake`) to
    regenerate `public/wiki-index.json` so the deployed Worker stays in sync
    with the wiki you just changed. The manifest is gitignored.
14. **Score every new or updated synthesis page.** For each one, call the
    deployed Worker:

    ```bash
    curl -sS -X POST https://agaviai.com/api/beatitude \
      -H "Authorization: Bearer $KB_TOKEN" \
      -H "Content-Type: application/json" \
      -d "$(jq -nc --arg sp wiki/synthesis/<slug>.md \
                   --rawfile body knowledge-bases/agavi-playbook/wiki/synthesis/<slug>.md \
                   '{source_page:$sp, body:$body}')"
    ```

    Read `KB_TOKEN` from the local `.env` (the user sets it once via
    `wrangler secret put KB_TOKEN` for the Worker side and mirrors it in
    `.env` for local use). Write the JSON response into
    `knowledge-bases/agavi-playbook/output/beatitude/<slug>.beatitude.md` —
    overwriting the v1 stub. If the verdict is `revise`, also create
    `knowledge-bases/agavi-playbook/wiki/synthesis/<slug>.revision.md`
    quoting the lowest-scoring beatitudes' notes so the next ingest pass
    can fix them.

    If `KB_TOKEN` is missing or the Worker is unreachable, leave the v1
    stub in place and surface a warning — do not block the commit.
15. Stage and commit: `git add knowledge-bases/agavi-playbook/wiki && git commit -m "ingest: <one-line summary>"`. The ingest is **not done** until the commit lands.

Report back: files ingested, files rejected (with reason), wiki pages
created/updated (with count), contradictions flagged, beatitude stubs
created **with verdicts**, manifest size after bake, and the commit hash.

$ARGUMENTS
