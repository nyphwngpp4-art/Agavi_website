---
description: Bake the Agavi playbook wiki into public/wiki-index.json for the Cloudflare Worker.
---

You are operating against the Agavi consulting-playbook second brain at
`knowledge-bases/agavi-playbook/`. Read
`knowledge-bases/agavi-playbook/AGENTS.md` first.

Your job is the **bake step**: compile the wiki into a single JSON manifest
that the Cloudflare Worker (`worker.js`) can fetch via its static-asset
binding to answer `/api/beatitude` and `/api/kb/query` requests at the edge.
The manifest is gitignored — it is regenerated locally by this command and
again at deploy time.

Output path: `public/wiki-index.json`

Steps:

1. Walk every file under `knowledge-bases/agavi-playbook/wiki/` matching
   `*.md` (skip `.gitkeep`).
2. For each file, parse the YAML frontmatter (`title`, `created`,
   `last_updated`, `source_count`, `status`, `tags`) and capture the
   markdown body separately. Reject and log any file missing required
   frontmatter — do not bake a partial manifest.
3. Locate `wiki/concepts/beatitude-rubric.md` and capture its full body
   separately as `rubric` in the manifest. The Worker injects this body
   into the Grok prompt verbatim, so it must always be present.
4. Build the manifest:

   ```json
   {
     "version": 1,
     "generated_at": "<ISO-8601 timestamp>",
     "rubric": "<full markdown body of beatitude-rubric.md>",
     "pages": [
       {
         "path": "concepts/beatitude-rubric.md",
         "slug": "beatitude-rubric",
         "subdir": "concepts",
         "title": "Beatitude Rubric",
         "tags": ["beatitude","alignment","rubric"],
         "status": "reviewed",
         "source_count": 0,
         "last_updated": "2026-04-07",
         "body": "..."
       }
     ]
   }
   ```

5. Write the manifest to `public/wiki-index.json` with two-space indent.
6. Append a dated entry to `wiki/log.md` of the form
   `## YYYY-MM-DD — bake — N pages, M bytes`.
7. **Do not commit.** The manifest is gitignored.

Report back: page count, total byte size, and any files rejected.

$ARGUMENTS
