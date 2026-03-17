# Agavi AI Production Bundle

This bundle gives you a live-path setup for:

- hosting the site on Cloudflare Pages
- capturing real contact form submissions
- forwarding leads to Make.com / Zapier
- optionally pushing leads into your local OpenClaw assistant named Agavi

## Files

- `index.html`
  - Production website
  - Form posts to `/api/contact`
- `functions/api/contact.js`
  - Cloudflare Pages Function
  - Validates form data
  - Forwards leads to Make and optionally to Agavi
- `.env.example`
  - Environment variables to configure
- `openclaw/agavi_receiver_example.py`
  - Example FastAPI receiver for local/OpenClaw intake
- `openclaw/agavi_lead_prompt.md`
  - Lead analysis prompt for Agavi

## Recommended Architecture

Visitor → agaviai.com → Cloudflare Pages → `/api/contact`
→ Make.com webhook
→ Email + CRM + Google Sheets / Airtable
→ Optional direct webhook to Agavi / OpenClaw

## Best Setup

### Cloudflare Pages
Use Cloudflare Pages for hosting and Pages Functions for the form endpoint.

### Make.com scenario
Create a scenario with this sequence:

1. **Custom Webhook**
   - Receives the JSON from `functions/api/contact.js`

2. **Google Sheets** or **Airtable**
   - Save the lead

3. **Email**
   - Notify `jay@agaviai.com`

4. **Optional CRM**
   - HubSpot / Pipedrive / Airtable / Notion / etc.

5. **Optional HTTP module**
   - POST the lead to your Agavi endpoint if you prefer Make to handle that hop

## Cloudflare Pages Deployment

1. Create a GitHub repo
2. Upload the contents of this bundle
3. In Cloudflare Pages:
   - Create project
   - Connect the GitHub repo
   - Framework preset: **None**
   - Build command: leave blank
   - Build output directory: `/`

4. Add environment variables:
   - `MAKE_WEBHOOK_URL`
   - `AGAVI_WEBHOOK_URL` (optional)
   - `AGAVI_WEBHOOK_TOKEN` (optional)

5. Add your custom domain:
   - `agaviai.com`
   - `www.agaviai.com`

## Important Note About OpenClaw / Local Agavi

A website cannot reach your local OpenClaw machine unless you expose it securely.

Best options:
- **Cloudflare Tunnel**
- **Tailscale Funnel**
- reverse proxy on a cloud VM

The safest path:
- Website sends to Cloudflare
- Cloudflare sends to Make
- Make sends to your Agavi endpoint through a secure tunnel

## Suggested Lead Tables

Minimum fields:
- submitted_at
- name
- company
- email
- phone
- message
- source
- ai_summary
- ai_priority
- next_action
- status
- owner

## Recommended First Production Rollout

### Phase 1
- Deploy site on Cloudflare Pages
- Connect form to Make
- Email yourself every lead
- Save every lead in Airtable or Google Sheets

### Phase 2
- Expose Agavi endpoint securely
- Send leads to Agavi for analysis
- Write AI summary back to Airtable / Sheets

### Phase 3
- Auto-generate first-response draft
- Add lead scoring
- Add Beatitude Engine fit recommendation
- Add a diagnostic workflow instead of a simple contact form

## What to do next

1. Publish the site
2. Create the Make webhook
3. Set env vars in Cloudflare
4. Decide whether you want Airtable or Google Sheets as the main lead log
5. Expose Agavi through Cloudflare Tunnel if you want direct AI intake