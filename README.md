# HeyMike2 - AI Marketing Director Dashboard

A clean, modern SaaS dashboard for AI-powered marketing campaign management.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Express (for serverless deployment)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **AI**: OpenClaw/Mike Ops (Marketing Director Agent)

## Features

- [x] Chat with HeyMike (AI Marketing Director)
- [x] Campaign Management
- [x] Content Queue (swipe-style approval)
- [x] Assets Library
- [x] Content Calendar
- [x] Analytics Dashboard
- [x] Settings (Ad Accounts + API Status)
- [x] Supabase integration ready
- [ ] MCP connection to HeyMike (in progress)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

Create a `.env` file:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Run database migrations

Go to your Supabase dashboard > SQL Editor and run the contents of `supabase-schema.sql`

### 4. Run locally

```bash
npm run dev
```

Visit http://localhost:5173

## Deployment

### Vercel

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

### Supabase

1. Create project at supabase.com
2. Run `supabase-schema.sql` in SQL Editor
3. Copy Project URL and anon key to Vercel env vars

## Current Status

**Dashboard UI**: Complete and working
**Backend**: Express server ready
**Database**: Schema ready to deploy
**MCP Connection**: Not yet connected - HeyMike responds with placeholder

## Pages

| Page | Path | Description |
|------|------|-------------|
| Chat | `/` | Talk to HeyMike |
| Campaigns | `/campaigns` | Manage campaigns |
| Content | `/content` | Approve generated content |
| Assets | `/assets` | View approved creatives |
| Calendar | `/calendar` | Content scheduling |
| Analytics | `/reports` | Performance metrics |
| Settings | `/settings` | Ad accounts + API status |

## Design

- Clean SaaS style (Linear/Vercel inspired)
- White background #FAFAFA
- Blue accent #2563EB
- Inter font
- Generous whitespace
- Soft shadows, 12px rounded corners