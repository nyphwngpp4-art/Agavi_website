# Agavi CRM — Peptides Business PWA

A mobile-first Progressive Web App for managing leads, tracking activity, and handling orders. Built with React, Tailwind CSS, and Supabase.

## Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Once created, go to **SQL Editor** and paste the contents of `supabase-schema.sql`. Run it to create all tables and RLS policies.
3. Go to **Settings > API** and copy your **Project URL** and **anon/public key**.

### 2. Configure Magic Link Auth

1. In Supabase, go to **Authentication > Providers** and ensure **Email** is enabled with **Magic Link** turned on.
2. Go to **Authentication > URL Configuration** and add your deployment URL (e.g., `https://your-app.vercel.app`) to **Redirect URLs**.
3. Optionally, go to **Authentication > Email Templates** to customize the magic link email.
4. To restrict to a single user, go to **Authentication > Users** and invite your email address, then disable new signups under **Authentication > Settings > User Signups** (toggle off "Enable email signup").

### 3. Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Install & Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173` on your phone (same network) or in a mobile browser simulator.

### 5. Deploy to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com), import the repository.
3. Set the **Root Directory** to `crm` (if this folder is inside a larger repo).
4. Add environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel project settings.
5. Deploy. Vercel will auto-detect Vite and build accordingly.
6. After deploying, add the Vercel URL to Supabase **Authentication > URL Configuration > Redirect URLs**.

### 6. Install as PWA on iPhone

1. Open the deployed URL in Safari.
2. Tap the **Share** button (square with arrow).
3. Tap **Add to Home Screen**.
4. The app will open in standalone mode — no browser chrome.

## App Icons

The `public/icons/` folder contains SVG placeholder icons. For best results on iOS, replace them with proper 192x192 and 512x512 PNG icons.

## Tech Stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3** — dark theme, mobile-first
- **Supabase** — Postgres, Auth (magic link), Row Level Security
- **vite-plugin-pwa** — Service worker, manifest, installability
- **Vercel** — Deployment with SPA rewrites
