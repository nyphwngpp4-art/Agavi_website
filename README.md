# Agavi AI — agaviai.com

Production website. Three static pages. No build step, no Pages Functions, no
backend.

## Files

- `index.html` — homepage (hero, Beatitude Engine, results, services,
  principles, founders, FAQ, final CTA)
- `pricing.html` — pricing page (Discovery / Foundation / Retainer)
- `intake.html` — client intake form

## Form integration

The intake form posts directly to **Web3Forms** via `fetch`. No server-side
code. Submissions email a registered inbox; the file-upload widget stores
attachments on **Uploadcare** and includes the group CDN URL in the email
body.

| Service     | Account / key                             | Purpose                            |
| ----------- | ----------------------------------------- | ---------------------------------- |
| Web3Forms   | access key `b3e011f6-9f04-4d9f-90eb-85258a559823` | Receives submissions, sends email |
| Uploadcare  | public key `aed0dbc7547927dc0cdb`         | Multi-file upload (images + PDFs) |

Hidden fields the form sends to Web3Forms:

- `access_key` — auth
- `subject` — `New Agavi AI Client Intake` (sets the email subject)
- `from_name` — `Agavi AI Intake Form`
- `botcheck` — honeypot for spam protection
- `uploaded_files` — Uploadcare group CDN URL (populated by widget on file
  upload)

On success, the page swaps to an editorial confirmation card with a generated
reference number (`AGV-YYMMDD-XXXX`). Failure shows an inline error and
falls back to `hello@agavi.ai`.

To change the destination email: log into Web3Forms with the account that
owns the access key above and update the registered email there. The HTML
doesn't need to change.

## Cloudflare Pages deployment

1. Connect this directory's git repo to Cloudflare Pages
2. Framework preset: **None**
3. Build command: *(blank)*
4. Build output directory: `/`
5. Custom domain: `agaviai.com` and `www.agaviai.com`

No environment variables needed. The intake form runs entirely client-side.

URL routing on Cloudflare Pages:

- `/` → `index.html`
- `/pricing` → `pricing.html`
- `/intake` → `intake.html`

## Editing content

Each page is a single self-contained HTML file with inlined CSS and (for
homepage + intake) a small JavaScript block at the bottom. Open the file,
edit, commit, push — Cloudflare auto-deploys.

Design tokens (palette, typography) are inlined in each file's `<style>`
block under `:root`. Changing a color in one place doesn't propagate; if you
change the palette, change it in all three files.

## Pre-launch checklist

- [ ] Send a real intake submission and confirm the email lands in the
      Web3Forms inbox
- [ ] Confirm Uploadcare files in the email render (the group URL should
      open a viewable bundle)
- [ ] Click through every CTA on the homepage and pricing page → all should
      land on `/intake`
- [ ] Spot-check on mobile (375 px wide)
