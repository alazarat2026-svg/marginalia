## Summary of Changes

Four targeted fixes were applied to the Documents List page:

### Fix 1 — Duplicate Breadcrumb (page.tsx)
Removed `currentPage="Documents"` from the TopAppBar component in `app/(app)/documents/page.tsx`. The TopAppBar default `breadcrumbRoot` is "Documents", so without `currentPage` being passed, the breadcrumb now correctly reads "Marginalia / Documents" with no duplication.

### Fix 2 — Alternate Sections Contained (page.tsx)
Wrapped both alternate sections in `max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12` containers:
- "ALTERNATE: EMPTY STATE" section (label + EmptyState component) now contained
- "ALTERNATE: UPLOAD-IN-PROGRESS" section (label + two DocumentRow instances) now contained
- The hairline separators (border-t) are now inside the wrapper with `w-full`, spanning the container width rather than the viewport

### Fix 3 — DocumentRow Title Truncation (ui.tsx)
Removed the `truncate` class from the DocumentRow title h3 in `components/ui.tsx` (line 183). Titles now wrap naturally instead of being forced to one line with ellipsis. On mobile, long titles like "Master Services Agreement — Northwind / Halcyon Systems" wrap to two lines.

### Fix 4 — Q&A Page Breadcrumb Verification
The Q&A page at `app/(app)/documents/[id]/page.tsx` still passes `currentPage="Master Services Agreement"` and `breadcrumbRoot="Documents"`, so its breadcrumb correctly renders "Marginalia / Documents / Master Services Agreement" without duplication or breakage.

### UI Kit Addendum (Fix 5)
Removed `truncate` from DocumentRow's title in components/ui.tsx — this is the Phase B addendum that only affects the Documents List, not Q&A.

### Verification Results
| # | Result | Details |
|---|--------|---------|
| 1 | PASS | Top bar shows "Marginalia / Documents" — no duplication |
| 2 | PASS | "ALTERNATE: EMPTY STATE" contained in max-width container |
| 3 | PASS | "ALTERNATE: UPLOAD-IN-PROGRESS" contained in max-width container |
| 4 | PASS | DocumentRow title wraps on mobile (no ellipsis) |
| 5 | PASS | Chip position unchanged below meta line on mobile |
| 6 | PASS | Q&A page breadcrumb: "Marginalia / Documents / Master Services Agreement" |
| 7 | PASS | No JS-based responsive detection (CLEAN) |
| 8 | PASS | npm run build passes |
| 9 | PASS | Browser console clean |

### Deviations
None — all instructions were applied as specified. Only the three files were modified:
- `app/(app)/documents/page.tsx` — Fix 1 (breadcrumb) and Fix 2 (container wrapping)
- `components/ui.tsx` — Fix 3 (removed `truncate` from DocumentRow title)