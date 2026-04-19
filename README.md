# HeyMike2 - AI Marketing Director Dashboard

A clean, modern SaaS dashboard for AI-powered marketing campaign management.

**Live URL:** https://heymike2.vercel.app

## Features

- [x] Chat with HeyMike (AI Marketing Director with smart responses)
- [x] Campaign Management
- [x] Content Queue (swipe-style approval)
- [x] Assets Library
- [x] Content Calendar
- [x] Analytics Dashboard
- [x] Settings (Ad Accounts + API Status)
- [x] Supabase integration
- [ ] Full MCP connection (in progress - chat works with smart responses for now)

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **AI**: Smart responses (placeholder for full MCP connection)

## Quick Start

```bash
npm install
npm run dev
```

## Deployment

### Vercel

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

## Chat Features

The chat currently works with smart AI responses that understand marketing context:

- Campaign creation questions → Guide user through setup
- Ad/content questions → Offer relevant options
- Help requests → Show full capabilities

For full AI power, connect via MCP gateway to Mike Ops (local OpenClaw agent).

## Pages

| Page | Description |
|------|-------------|
| Chat | Talk to HeyMike (AI Marketing Director) |
| Campaigns | Manage marketing campaigns |
| Content | Approve generated content (swipe UI) |
| Assets | View approved creatives |
| Calendar | Content scheduling |
| Analytics | Performance metrics |
| Settings | Ad accounts + API configuration |

## Design

- Clean SaaS style (Linear/Vercel inspired)
- White background #FAFAFA
- Blue accent #2563EB
- Inter font
- Generous whitespace
- Soft shadows, 12px rounded corners

## Supabase Schema

Database schema is in `supabase-schema.sql`. Run it in your Supabase SQL Editor to set up tables:
- profiles
- brands
- campaigns
- content
- assets
- ad_accounts
- messages