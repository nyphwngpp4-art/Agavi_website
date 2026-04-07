# Beatitude Rubric

The scoring rubric used by the downstream **Beatitude** alignment check
(Grok-as-judge) when evaluating any page in [[../synthesis]] or any
client-facing draft in `output/`. Each of the eight Beatitudes from
Matthew 5:3–10 is mapped to a concrete evaluation question and scored
0–3. Total of 24. This page is the single source of truth — when the
rubric changes, change it here, not in the function.

## Scoring scale

| Score | Meaning |
| --- | --- |
| 0 | Actively contradicts this Beatitude. |
| 1 | Indifferent or shallow alignment. |
| 2 | Clearly aligned in intent and language. |
| 3 | Demonstrably aligned in intent, language, and likely effect on the reader/client. |

## The eight questions

| # | Beatitude | Evaluation question |
| --- | --- | --- |
| 1 | Poor in spirit | Does the content acknowledge limits, dependence, and the reader's dignity rather than posturing as omniscient? |
| 2 | Mourn | Does it sit honestly with real costs, losses, and tradeoffs the work imposes — not just the upside? |
| 3 | Meek | Is the tone confident without coercion or hype? Does it leave the client room to disagree? |
| 4 | Hunger and thirst for righteousness | Does it pursue what is *right* for the client's situation, not merely what is profitable for Agavi? |
| 5 | Merciful | Where the client (or a vendor, or a person in the story) failed, is the framing generous and restorative rather than blaming? |
| 6 | Pure in heart | Is the motive transparent? Are conflicts of interest, assumptions, and uncertainty disclosed? |
| 7 | Peacemakers | Does it reduce conflict between stakeholders, teams, or systems — or does it inflame them for effect? |
| 8 | Persecuted for righteousness | When a hard truth is needed, is it stated plainly even if it costs the deal? |

## Verdict thresholds

| Total | Verdict |
| --- | --- |
| 20–24 | **pass** — ship it |
| 14–19 | **revise** — open a `*.revision.md`, address the lowest-scoring beatitudes, re-check |
| 0–13 | **revise** — material problem; rewrite from the source, do not patch |

## Notes for the judge

- Score the **page as written**, not what it could become with one more pass.
- A blank or N/A field is a 0. The rubric does not allow abstention.
- If the page contains no client-facing claims at all (e.g., a pure
  vocabulary page in [[../concepts]]), skip Beatitude checking entirely
  and write `verdict: n/a` in the stub.
