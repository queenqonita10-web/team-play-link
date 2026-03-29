# Architecture & Ecosystem Documentation: Football Grassroots Ecosystem Platform

## 1. Overview
Platform ini mengintegrasikan manajemen akademi sepakbola (SSB) dan manajemen kompetisi (EO) ke dalam satu ekosistem terpadu. Fokus utama adalah **Single Player Identity**, di mana satu ID pemain dapat digunakan lintas organisasi dan kompetisi.

---

## 2. Database Schema & ERD (Entity Relationship Diagram)

### Core & Integration Module
#### `users`
- id (UUID, PK)
- email (unique)
- password_hash
- role (enum: super_admin, ssb_admin, coach, parent, eo_admin, operator)
- organization_id (UUID, FK - can be SSB or EO)

#### `players` (Single Player Identity)
- id (UUID, PK)
- global_id (unique string, e.g., P-2026-XXXX)
- name
- nik (unique)
- date_of_birth
- gender
- photo_url
- parent_id (UUID, FK -> users)

---

### Module 1: SSB System
#### `ssb_organizations`
- id (UUID, PK)
- name, address, logo, contact_info

#### `ssb_players` (Pivot for SSB enrollment)
- ssb_id (UUID, FK)
- player_id (UUID, FK)
- status (active, inactive)
- position (GK, CB, etc.)

#### `training_schedules`, `attendance`, `skill_ratings`, `coach_evaluations`, `invoices`
*(Sudah terdokumentasi di file DOCS_TRAINING_SCHEDULE.md dan DOCS_ATTENDANCE_SYSTEM.md)*

---

### Module 2: EO System
#### `eo_organizations`
- id (UUID, PK)
- name, contact_info

#### `tournaments`
- id (UUID, PK)
- eo_id (UUID, FK)
- name, format, age_categories[], start_date, end_date, venue

#### `tournament_teams`
- id (UUID, PK)
- tournament_id (UUID, FK)
- ssb_id (UUID, FK)
- team_name, status (registered, verified, rejected)

#### `matches`
- id (UUID, PK)
- tournament_id (UUID, FK)
- home_team_id, away_team_id
- score_home, score_away, status, match_time, venue

---

## 3. API Endpoints (Restful JSON:API)

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`

### SSB Module
- `GET /api/ssb/players` - List players in SSB
- `POST /api/ssb/training-schedules` - Create schedule
- `POST /api/ssb/attendance/qr-scan` - QR attendance scan
- `GET /api/ssb/finance/invoices` - Billing list

### EO Module
- `GET /api/eo/tournaments` - List tournaments
- `POST /api/eo/tournaments/{id}/register-team` - SSB registers team
- `PATCH /api/eo/matches/{id}/result` - Update match score

### Integration Layer
- `GET /api/global/players/{nik}` - Find player by NIK for registration
- `GET /api/global/players/{id}/stats` - Combined stats (SSB Training + EO Matches)

---

## 4. Folder Structure (Next.js / Modular Frontend)

```text
src/
├── app/                  # Next.js App Router
│   ├── (auth)/           # Login, Register
│   ├── (ssb)/            # SSB Admin & Coach Dashboard
│   ├── (eo)/             # EO Admin & Operator Dashboard
│   ├── (parent)/         # Parent Portal
│   └── api/              # Route Handlers
├── components/
│   ├── shared/           # Reusable UI (Button, Table, etc.)
│   ├── ssb/              # SSB Specific Components
│   ├── eo/               # EO Specific Components
│   └── charts/           # Visualization (Radar, Line, Bar)
├── lib/
│   ├── api-client.ts     # Axios/Fetch setup
│   ├── utils.ts          # Helpers
│   └── validation/       # Zod/Yup schemas
├── hooks/                # Custom React Hooks
├── types/                # TypeScript Interfaces
└── store/                # State Management (Zustand/Redux)
```

---

## 5. System Scalability & Mobile Readiness
- **Backend**: Microservices ready or Modular Monolith.
- **Frontend**: Responsive Web (Shadcn UI) + Capacitor/React Native compatibility.
- **Cache**: Redis for high-frequency attendance & live match scores.
- **Storage**: S3/Supabase Storage for player documents & photos.
