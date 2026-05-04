# HackFinder — Complete Build Design

**Date:** 2026-05-04  
**Stack:** Next.js 14, TypeScript, Tailwind, shadcn/ui, NextAuth v5, Prisma, Neon (PostgreSQL)  
**Scope:** Production-ready — all missing pages, rich features, admin panel, nightly scraper

---

## 1. Architecture

```
HackFinder
├── Next.js App (Vercel)
│   ├── Pages: landing, login, hackathons, detail, dashboard, profile, teams, about, admin
│   ├── APIs: bookmarks, teams, notifications, profile, uploadthing, admin CRUD
│   └── Vercel Cron: /api/cron/deadline-notify (daily email digests at 9am UTC)
├── Neon PostgreSQL (via Prisma)
└── GitHub Actions
    └── scripts/scraper.ts (nightly 2am UTC, writes directly to Neon)
```

---

## 2. Database Schema (Prisma)

### Models

**User**
- id, name, email, emailVerified, image
- bio (String?), github (String?), linkedin (String?)
- skills (String[]), experienceLevel (String default "beginner")
- **role: String (default "user") — ADD THIS** (needed for admin access control)
- Relations: accounts, sessions, bookmarks, teamMemberships, notifications, ownedTeams, hackathonsOrganized

> Note: Schema already exists at `prisma/schema.prisma` with latitude/longitude on Hackathon, source/externalId for scraper upserts, HackathonTag model, and organizerId on Hackathon. Only missing field is `role` on User.

**Hackathon**
- id, slug (unique), title, description (markdown)
- bannerUrl (String?)
- startDate, endDate, registrationDeadline (DateTime)
- registrationUrl, websiteUrl (String)
- location (String), isOnline (Boolean)
- prizePool (Int?)
- themes (String[]), technologies (String[])
- difficulty: String (beginner | intermediate | advanced | all)
- status: String (upcoming | open | closed | ended)
- minTeamSize, maxTeamSize (Int)
- createdAt, updatedAt
- Relations: teams, bookmarks

**Team**
- id, name, bio (String?), isOpen (Boolean default true)
- neededSkills (String[])
- hackathonId, ownerId
- createdAt
- Relations: hackathon, owner, members

**TeamMember**
- id, teamId, userId
- role: String (owner | member)
- joinedAt

**Bookmark**
- id, userId, hackathonId, createdAt
- Unique constraint: [userId, hackathonId]

**Notification**
- id, userId, type (String), title, message
- read (Boolean default false)
- hackathonId (String?)
- createdAt

**Account / Session / VerificationToken** — NextAuth standard models via PrismaAdapter

---

## 3. Missing Pages & Core Fixes

### 3.1 Bookmark button on `/hackathons/[slug]`
- Currently a static `<Button>` with no onClick
- Wire to existing `POST /api/bookmarks` and `DELETE /api/bookmarks/[hackathonId]`
- Show filled/unfilled heart based on session bookmark state (pass `isBookmarked` prop from server)

### 3.2 Notifications bell in Navbar
- Add bell icon to `NavbarClient`
- On click: fetch `GET /api/notifications`, show dropdown list
- Unread count badge on bell
- "Mark all read" calls `PATCH /api/notifications`

### 3.3 `/profile/[userId]`
- Public view: name, avatar, bio, skills, github/linkedin links, experience level
- If viewing own profile: show "Edit Profile" button
- Edit form (react-hook-form + zod): name, bio, github, linkedin, skills (tag input), experienceLevel
- Submits to `PATCH /api/profile`
- Avatar upload via Uploadthing

### 3.4 `/dashboard/bookmarks`
- Full paginated list of bookmarked hackathons
- Uses HackathonCard with bookmark toggle
- Empty state with CTA to browse

### 3.5 `/teams`
- Browse all open teams across all hackathons
- Filter by: skill needed, hackathon
- Each TeamCard links to its hackathon detail page
- Fetches from new `GET /api/teams` endpoint (list all open teams with hackathon included)

### 3.6 `/about`
- Static page: mission statement, how HackFinder works (3-step), FAQ section, contact

### 3.7 Mobile menu
- `NavbarClient` gets a hamburger button (visible on mobile only)
- Opens `Sheet` component from right side
- Contains: Browse Hackathons, Teams, About, Sign In / user menu

### 3.8 Dark mode toggle
- `next-themes` already installed
- Add sun/moon toggle button to `NavbarClient`
- Wrap app in `ThemeProvider` in `layout.tsx`

### 3.9 Error & Loading pages
- `app/error.tsx` — generic error boundary with retry button
- `app/not-found.tsx` — 404 page with link home
- `app/loading.tsx` — full-page skeleton
- `app/hackathons/loading.tsx` — grid of HackathonCard skeletons
- `app/dashboard/loading.tsx` — stat cards + grid skeletons

---

## 4. Rich Features

### 4.1 Image Upload (Uploadthing)
- `/api/uploadthing` route with two endpoints:
  - `profileImage` — max 4MB, image only, updates `user.image`
  - `hackathonBanner` — max 8MB, image only, admin only
- Used in: profile edit form, admin hackathon form

### 4.2 Email Notifications (Resend)
- Vercel Cron hits `GET /api/cron/deadline-notify` daily at 9am UTC
- Logic:
  1. Find all bookmarks where `hackathon.registrationDeadline` is within 7 days
  2. Group by userId
  3. For each user with upcoming deadlines: send one email listing their hackathons
- Email template: plain HTML, lists hackathon name + deadline + registration link
- Resend sender: `notifications@hackfinder.app` (configure in Resend dashboard)
- Env vars: `RESEND_API_KEY`

### 4.3 Map (react-leaflet)
- On `/hackathons/[slug]` detail page, Overview tab
- If `hackathon.isOnline === false`:
  - Schema already has `latitude` + `longitude` fields — use directly if set
  - If null, fall back to Nominatim geocoding on the `location` string (no API key needed)
- Hidden entirely for online events
- Dynamic import with `ssr: false` (Leaflet requires browser)

### 4.4 Animations (Framer Motion)
- Hackathon browse page: staggered card grid entry (`staggerChildren: 0.05`)
- HackathonCard: subtle scale + shadow on hover (already partially done with Tailwind, enhance with Framer)
- Page transitions: `AnimatePresence` wrapper in layout for fade between routes
- Dashboard stat cards: count-up animation on numbers

### 4.5 SEO
- `layout.tsx`: default metadata (title template, description, OG image)
- `/hackathons/[slug]`: already has `generateMetadata` — add JSON-LD structured data (`Event` schema)
- `/hackathons`: metadata with description
- `/` landing: full OG tags

---

## 5. Admin Panel

### Routes
```
/admin                        → stats dashboard
/admin/hackathons             → table (search, filter by status, paginated)
/admin/hackathons/new         → create form
/admin/hackathons/[id]/edit   → edit form (pre-filled)
```

### Access Control
- Middleware (`middleware.ts`): check session + `user.role === 'admin'`
- Redirect non-admins to `/`
- First admin: set `role = 'admin'` via Prisma seed or Prisma Studio

### Admin Hackathon Form Fields
- title, slug (auto-generated, editable)
- description (markdown editor — `@uiw/react-md-editor`)
- banner (Uploadthing image upload)
- startDate, endDate, registrationDeadline
- registrationUrl, websiteUrl
- location, isOnline toggle
- prizePool
- themes (comma-separated tag input)
- technologies (comma-separated tag input)
- difficulty (select: beginner | intermediate | advanced | all)
- status (select: upcoming | open | closed | ended)
- minTeamSize, maxTeamSize

### Admin APIs
```
POST   /api/admin/hackathons          → create hackathon
PUT    /api/admin/hackathons/[id]     → update hackathon
DELETE /api/admin/hackathons/[id]     → delete hackathon
GET    /api/admin/stats               → { hackathonCount, userCount, bookmarkCount }
```

All routes verify `session.user.role === 'admin'` server-side.

---

## 6. Scraper (GitHub Actions)

### File: `scripts/scraper.ts`

**Targets:** Devpost (`devpost.com/hackathons`) + MLH (`mlh.io/events`)

**Dependencies (add to devDependencies):** `cheerio`, `node-fetch`, `ts-node`, `@types/cheerio`

**Flow:**
1. Fetch Devpost hackathons listing page (HTML)
2. Parse with cheerio: extract title, URL, deadline, prize, location, themes
3. Fetch MLH events page, parse similarly
4. For each parsed hackathon:
   - Generate slug: `title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')` — append `-<4-char-hash>` on collision
   - `prisma.hackathon.upsert({ where: { slug }, create: {...}, update: { status, registrationDeadline } })`
5. Log: `Created: X | Updated: Y | Errors: Z`

**GitHub Actions workflow:** `.github/workflows/scraper.yml`
```yaml
name: Nightly Hackathon Scraper
on:
  schedule:
    - cron: '0 2 * * *'
  workflow_dispatch:
jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx ts-node scripts/scraper.ts
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

**GitHub Secret required:** `DATABASE_URL` (Neon pooled connection string)

---

## 7. Environment Variables

```env
# Database (Neon requires both)
DATABASE_URL=           # Neon pooled connection string (for runtime queries)
DIRECT_URL=             # Neon direct connection string (for Prisma migrations)

# NextAuth
NEXTAUTH_SECRET=        # random 32-char string
NEXTAUTH_URL=           # https://yourdomain.com (or http://localhost:3000)

# OAuth
GITHUB_ID=
GITHUB_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Uploadthing
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# Resend
RESEND_API_KEY=
```

---

## 8. Implementation Order

1. Prisma schema + Neon setup + seed script
2. `.env.local` setup + `prisma migrate dev`
3. Core fixes: bookmark wire-up, notifications bell, mobile menu, dark mode
4. Missing pages: profile, /dashboard/bookmarks, /teams, /about
5. Error/loading pages
6. Admin panel (routes + APIs + form)
7. Uploadthing integration (profile + admin banner)
8. Resend email digest + Vercel Cron
9. Leaflet map on detail page
10. Framer Motion animations
11. SEO metadata + JSON-LD
12. GitHub Actions scraper
13. Production deploy to Vercel
