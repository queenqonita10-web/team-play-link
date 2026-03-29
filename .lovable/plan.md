

# Enhanced Player Management Feature

## What We're Building

A comprehensive player management system replacing the current simple list view. Includes full CRUD operations, player detail pages, document uploads, development notes, status tracking, and enhanced filtering.

## Changes

### 1. Extend Player type (`src/types/index.ts`)
Add new fields to the `Player` interface:
- `parentEmail: string`
- `address: string`
- `status: "active" | "inactive"`
- `documents: { birthCertificate?: string; familyCard?: string; photo?: string }` (URL strings for mock)
- `developmentNotes: { id: string; date: string; type: "training" | "coach"; note: string; author: string }[]`

Add a helper type `PlayerStatus = "active" | "inactive"`.

### 2. Update mock data (`src/data/mock.ts`)
Extend all 8 mock players with the new fields (parentEmail, address, status, documents, developmentNotes). Add a couple of development notes per player.

### 3. Add i18n strings (`src/i18n/en.ts`, `src/i18n/id.ts`)
New keys under `ssb`: parentEmail, address, playerStatus, active, inactive, documents, birthCertificate, familyCard, playerPhoto, developmentNotes, trainingNote, coachNote, addNote, playerDetail, uploadDocument, age, years.

### 4. Revamp Player List page (`src/pages/ssb/Players.tsx`)
- Add status filter (all / active / inactive) alongside existing age filter
- Auto-calculate and display age from dateOfBirth
- Show status badge (green active / gray inactive)
- "Add Player" button opens a dialog/sheet with full form
- Clicking a player card navigates to `/ssb/players/:id`

### 5. Create Player Detail page (`src/pages/ssb/PlayerDetail.tsx`)
Tabbed layout with 3 tabs:
- **Profile**: Full info display (name, DOB, age auto-calculated, position, age category auto-grouped, parent data, address, status toggle). Edit mode via button.
- **Documents**: Cards showing upload status for birth certificate, family card, player photo. Mock upload buttons (no real upload, just UI).
- **Development**: Timeline of training notes and coach notes. "Add Note" form at top with type selector, text area, and save button. All stored in local state.

### 6. Create Add/Edit Player form (`src/components/ssb/PlayerForm.tsx`)
Dialog-based form with fields: name, dateOfBirth (with auto age/category calculation preview), position select, parent name, parent phone, parent email, address. Uses react-hook-form + zod validation. On submit, adds to local state (mock).

### 7. Add route for player detail (`src/App.tsx`)
Add `<Route path="players/:id" element={<PlayerDetail />} />` under `/ssb`.

### 8. Create age calculation utility (`src/lib/utils.ts`)
- `calculateAge(dateOfBirth: string): number` — returns age in years
- `getAgeCategory(dateOfBirth: string): AgeCategory` — auto-determines U8/U10/U12/U14/U17

## Technical Notes
- All data stays in React state (no backend). Players state will be lifted to a context or managed at the Players page level with URL params.
- Document upload is UI-only (file picker opens but files are not persisted).
- Development notes stored in component state, pre-populated from mock data.

