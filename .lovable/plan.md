

# Enhanced Player Management Module

## What's Being Added

The player management already has CRUD, search/filter, detail pages, documents, and development notes. This plan adds the **missing fields** (NIK, Nama Ibu) and **improves the existing form with input validation using zod**.

## Changes

### 1. Add NIK & motherName fields to Player type (`src/types/index.ts`)
- Add `nik: string` (16-digit national ID) to `Player` interface
- Add `motherName: string` to `Player` interface

### 2. Update mock data (`src/data/mock.ts`)
- Add `nik` and `motherName` to all 8 mock players

### 3. Update i18n strings (`src/i18n/en.ts`, `src/i18n/id.ts`)
- Add keys: `nik` ("NIK (National ID)" / "NIK (ID Nasional)"), `motherName` ("Mother's Name" / "Nama Ibu"), `nikValidation` ("NIK must be 16 digits" / "NIK harus 16 digit")

### 4. Update PlayerForm (`src/components/ssb/PlayerForm.tsx`)
- Add NIK field with 16-digit numeric validation (zod schema)
- Add Mother's Name field (required)
- Add zod validation for all required fields: name (min 2 chars), dob (required), parentName (required), motherName (required), nik (exactly 16 digits, numeric), email (valid format if provided), phone (numeric if provided)
- Show validation errors inline

### 5. Update Player Detail page (`src/pages/ssb/PlayerDetail.tsx`)
- Display NIK in profile tab
- Display Mother's Name in parent info card

### 6. Update Player List (`src/pages/ssb/Players.tsx`)
- Show Mother's Name in player card subtitle (replace current parentName display with "Ibu: {motherName}")

## Validation Rules (zod)
- `name`: string, min 2, max 100, required
- `nik`: string, regex `/^\d{16}$/`, required
- `dateOfBirth`: string, required (must be valid date)
- `position`: enum of Position values
- `parentName`: string, min 2, required
- `motherName`: string, min 2, required
- `parentPhone`: string, optional, numeric only if provided
- `parentEmail`: string, optional, valid email if provided
- `address`: string, optional, max 500

## Files Modified
1. `src/types/index.ts` — add `nik`, `motherName` to Player
2. `src/data/mock.ts` — add fields to mock players
3. `src/i18n/en.ts` — add translation keys
4. `src/i18n/id.ts` — add translation keys
5. `src/components/ssb/PlayerForm.tsx` — add fields + zod validation
6. `src/pages/ssb/PlayerDetail.tsx` — display NIK & motherName
7. `src/pages/ssb/Players.tsx` — show motherName in card

