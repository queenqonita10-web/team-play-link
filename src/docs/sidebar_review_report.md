# Code Review Report: AppSidebar Component

## 1. Overview
This report documents the findings from a comprehensive review of the `AppSidebar.tsx` component. The focus was on performance, accessibility, responsiveness, and maintainability.

## 2. Identified Issues

| Issue ID | Category | Description | Severity | Proposed Solution |
| :--- | :--- | :--- | :--- | :--- |
| SID-001 | Performance | Navigation items and filtering logic are recalculated on every render. | Low | Memoize filtered items using `useMemo`. |
| SID-002 | Accessibility | Missing `aria-current="page"` on active links and `aria-hidden="true"` on icons. | Medium | Update `NavLink` and icon usage to include proper ARIA attributes. |
| SID-003 | Maintainability | Hardcoded role-based filtering logic inside the component. | Medium | Move navigation configuration and role-based logic to a dedicated hook or constant. |
| SID-004 | Maintainability | Component is becoming a "God Component" handling logic for all portals. | Medium | Split portal item definitions into a separate config file. |
| SID-005 | Accessibility | Screen readers may not identify the sidebar as a navigation landmark. | Medium | Add `role="navigation"` and `aria-label` to the main sidebar container. |

## 3. Refactoring Plan

### Phase 1: Logic Extraction
- Create `src/config/navigation.ts` to store all navigation item definitions.
- Create `src/hooks/use-navigation-items.ts` to handle role-based filtering and portal detection.

### Phase 2: Component Refinement
- Update `AppSidebar.tsx` to use the new hook.
- Implement `useMemo` for all derived states.
- Enhance accessibility attributes.

### Phase 3: Testing
- Add Vitest unit tests for the filtering logic.
- Add Playwright/Cypress integration tests for navigation flow.

## 4. Before/After Metrics
- **Logic Location**: 
  - Before: Mixed within `AppSidebar.tsx` (167 lines).
  - After: Extracted to `useNavigationItems` hook and `navigation.ts` config. `AppSidebar.tsx` reduced to ~100 lines.
- **Maintainability**: High. New portals or roles can be added by updating `navigation.ts` without touching the UI component.
- **Accessibility**: 
  - Added `role="navigation"` and `aria-label`.
  - Icons hidden from screen readers via `aria-hidden="true"`.
  - Added tooltips for collapsed state.
  - Improved focus-visible styles.
- **Performance**: Derived states (portal info, filtered items) are now memoized via `useMemo`.
- **Code Coverage**: Logic for item filtering is now covered by unit tests in `src/test/navigation.test.ts`.

## 5. Migration Guide
No breaking changes for existing routes. The sidebar still uses the same URL structure. To add a new portal:
1. Define the portal in `NAVIGATION_CONFIG` inside `src/config/navigation.ts`.
2. Add the path detection logic in `useNavigationItems.ts`.

## 6. Verification Checklist
- [x] Sidebar displays correct items for SSB Admin.
- [x] Sidebar displays correct items for EO Admin.
- [x] Sidebar displays correct items for Parent.
- [x] Collapsed state shows tooltips on hover.
- [x] Logout functionality works as expected.
- [x] Unit tests pass for all roles and portals.
