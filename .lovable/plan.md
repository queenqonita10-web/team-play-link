# Football Grassroots Ecosystem Platform — MVP Plan

## Overview

Build the complete UI (no database yet) for both SSB and EO pillars, with bilingual support (ID/EN). All data will use mock/static data for now — Supabase integration comes later.

## Phase 1: Foundation & Layout

**1. Bilingual system (i18n)**

- Create a simple context-based language switcher (ID/EN)
- Translation files for all UI strings in `src/i18n/`

**2. Landing page**

- Hero section explaining the platform
- Two CTA paths: "SSB (Akademi)" and "Event Organizer"
- Feature highlights, footer

**3. Auth pages (UI only)**

- Login page with role selection (Admin SSB, Pelatih, Orang Tua, Admin EO)
- Register page
- No real auth — just navigation mock

**4. App shell / layout**

- Sidebar navigation (collapsible)
- Top bar with user info, language toggle
- Role-based menu items

## Phase 2: SSB (Academy) Module - Mobile View

**5. Dashboard SSB**

- Summary cards: total pemain, kehadiran hari ini, tagihan tertunggak
- Quick actions

**6. Manajemen Pemain**

- Player list with search/filter by age category (U8–U17)
- Player detail page: profile, position, parent info, documents
- Add/edit player form

**7. Jadwal & Latihan**

- Calendar view for training schedules
- Training group assignment

**8. Absensi**

- Attendance list per session
- Attendance statistics per player

**9. Keuangan (simplified)**

- Monthly fee list per player
- Payment status tracking (paid/unpaid)

## Phase 3: EO (Competition) Module

**10. Dashboard EO**

- Summary: active tournaments, registered teams, upcoming matches

**11. Manajemen Kompetisi**

- Create tournament form (name, format: group/knockout/festival, age categories)
- Tournament list

**12. Registrasi Tim**

- Team registration list per tournament
- Squad list view

**13. Jadwal & Hasil Pertandingan**

- Fixture list (mock auto-generated)
- Match result input form (score, scorers, cards)

**14. Klasemen**

- Standings table
- Top scorer table

## Phase 4: Shared / Integration UI

**15. Parent portal view**

- Child's schedule, attendance, payment status (read-only)

**16. Player profile (unified)**

- Single player ID showing both academy data and competition history

## Technical Approach

- **Routing**: React Router with nested routes (`/ssb/*`, `/eo/*`, `/parent/*`)
- **State**: React Context for auth mock + language; local state for forms
- **Components**: shadcn/ui components already in project
- **Data**: Mock data in `src/data/` as TypeScript constants
- **Types**: Shared types in `src/types/` (Player, Team, Tournament, Match, etc.)
- **i18n**: Simple context + JSON translation files, no heavy library

## File structure (new)

```
src/
  i18n/           — translations (id.ts, en.ts), LanguageContext
  types/          — Player, Team, Tournament, Match, etc.
  data/           — mock data
  layouts/        — SSBLayout, EOLayout, ParentLayout
  pages/
    Landing.tsx
    Login.tsx
    Register.tsx
    ssb/          — Dashboard, Players, Schedule, Attendance, Finance
    eo/           — Dashboard, Tournaments, Teams, Fixtures, Standings
    parent/       — ParentDashboard
  components/
    ssb/          — player cards, attendance forms, etc.
    eo/           — match cards, standings table, etc.
    shared/       — LanguageToggle, RoleGuard, etc.
```

## Build order

Steps 1–4 first (foundation), then 5–9 (SSB), then 10–14 (EO), then 15–16 (integration). Each step produces visible, navigable UI.

This is a large build — I will implement it incrementally across multiple messages, starting with the foundation (i18n, landing page, auth UI, app shell).