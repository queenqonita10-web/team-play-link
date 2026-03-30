

# Review & Fix Sidebar Navigation for All Roles

## Current Issues Found

1. **`UserRole` type mismatch**: `types/index.ts` defines roles as `super_admin`, `ssb_admin`, `eo_admin`, `eo_operator`, `coach`, `parent`, `scout` — but Login.tsx uses old role names `admin_ssb` and `admin_eo` which don't exist in the type. Login also imports `UserRole` from `AuthContext` which doesn't export it.
2. **`super_admin` unreachable in navigation hook**: Line 34 checks `user.role === "super_admin"` but the `UserRole` type doesn't include it — the comparison is flagged as impossible by TS.
3. **No routes for admin, scout, or parent sub-pages**: Only `/parent` index exists. No `/admin/*`, `/scout/*`, `/parent/schedule`, `/parent/progress`, `/parent/finance` routes.
4. **Login role selector incomplete**: Missing `super_admin`, `eo_operator`, `scout` roles. Post-login redirect only handles old role names.
5. **i18n missing role labels** for `super_admin`, `eo_operator`, `scout`.
6. **Navigation config** references `t.ssb.profile` and `t.common.settings` in COMMON_GROUPS — need to verify these exist.
7. **Build errors**: Multiple unrelated TS errors (MatchStatus, AgeCategory, Position enums changed) need fixing too.

## Plan

### 1. Fix `UserRole` and add `super_admin` back (`src/types/index.ts`)
- Add `"super_admin"` to `UserRole` union type

### 2. Fix Login & Register (`src/pages/Login.tsx`, `src/pages/Register.tsx`)
- Import `UserRole` from `@/types` instead of `@/contexts/AuthContext`
- Update role options to use correct values: `ssb_admin`, `coach`, `parent`, `eo_admin`, `eo_operator`, `scout`, `super_admin`
- Fix post-login redirect: `ssb_admin`/`coach` → `/ssb`, `eo_admin`/`eo_operator` → `/eo`, `parent` → `/parent`, `scout` → `/scout`, `super_admin` → `/admin`

### 3. Add i18n role labels (`src/i18n/en.ts`, `src/i18n/id.ts`)
- Add: `roleSSBAdmin`, `roleEOOperator`, `roleScout`, `roleSuperAdmin`

### 4. Add placeholder pages for missing routes
- `src/pages/admin/AdminDashboard.tsx` — placeholder
- `src/pages/scout/ScoutDashboard.tsx` — placeholder
- `src/pages/parent/ParentSchedule.tsx` — placeholder
- `src/pages/parent/ParentProgress.tsx` — placeholder
- `src/pages/parent/ParentFinance.tsx` — placeholder

### 5. Add routes to `src/App.tsx`
- `/admin` layout with `AdminDashboard` index
- `/scout` layout with `ScoutDashboard` index
- `/parent/schedule`, `/parent/progress`, `/parent/finance` routes

### 6. Fix all build errors in parallel
- **`src/types/index.ts`**: Add back `"U8" | "U10" | "U12" | "U14"` to `AgeCategory`, add `"GK" | "ST" | "CM" | "LW" | "RB"` as aliases to `Position`, add `MatchStatus` export, add `competitionHistory` as optional on `Player`, add `statistics` to `TournamentMatch`, add `officialId` as optional on `TournamentTeam`, add `registrationFee` to `CompetitionCategory`
- **`src/data/mock.ts`**: Fix mock players missing `competitionHistory`
- **`src/components/eo/MatchOperator.tsx`**: Import `MatchStatus`
- **`src/components/ssb/EvaluationForm.tsx`**: Import `Badge`
- **`src/components/ssb/TrainingScheduleForm.tsx`**: Fix AgeCategory compatibility
- **`src/pages/ssb/Finance.tsx`**: Use `player.parent.contactNumber` / `player.parent.email` instead of `parentPhone`/`parentEmail`
- **`src/pages/ssb/PlayerDetail.tsx`**: Use `player.parent.motherName`, `player.parent.contactNumber`, `player.parent.email` and add `parentName` from mock
- **`src/test/navigation.test.ts`**: Update to use `groups` instead of `items`

### 7. Update navigation hook (`src/hooks/use-navigation-items.ts`)
- Remove the dead `super_admin` comparison now that the type includes it again

## Files Modified/Created (~15 files)
1. `src/types/index.ts` — fix UserRole, AgeCategory, Position, add missing fields
2. `src/pages/Login.tsx` — fix imports, roles, redirects
3. `src/pages/Register.tsx` — fix imports
4. `src/i18n/en.ts` — add role labels
5. `src/i18n/id.ts` — add role labels
6. `src/App.tsx` — add admin/scout/parent sub-routes
7. `src/pages/admin/AdminDashboard.tsx` — new placeholder
8. `src/pages/scout/ScoutDashboard.tsx` — new placeholder
9. `src/pages/parent/ParentSchedule.tsx` — new placeholder
10. `src/pages/parent/ParentProgress.tsx` — new placeholder
11. `src/pages/parent/ParentFinance.tsx` — new placeholder
12. `src/data/mock.ts` — fix type errors
13. `src/components/eo/MatchOperator.tsx` — import MatchStatus
14. `src/components/ssb/EvaluationForm.tsx` — import Badge
15. `src/pages/ssb/Finance.tsx` — fix property access
16. `src/pages/ssb/PlayerDetail.tsx` — fix property access
17. `src/test/navigation.test.ts` — fix to use groups

