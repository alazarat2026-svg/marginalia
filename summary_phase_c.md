## Phase C Summary — Marginalia (4 Pages: Documents List + Upload + Auth)

All four Phase C pages are complete and verified. Here's what was delivered:

### 1. Documents List Fixes (app/(app)/documents/page.tsx)
- **Fix 1**: Removed `currentPage="Documents"` from TopAppBar — breadcrumb now shows "Marginalia / Documents" (no duplication)
- **Fix 2**: Wrapped both alternate sections (Empty State + Upload-in-Progress) in `max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12` containers with `border-t` inside
- **Fix 3**: Removed `truncate` class from DocumentRow title h3 — titles now wrap naturally to two lines on mobile
- **Fix 4**: Verified Q&A page breadcrumb "Marginalia / Documents / Master Services Agreement" unchanged

### 2. Upload Page (app/(app)/upload/page.tsx)
- **Six states**: Signup idle, Login idle, Signup submitting, Signup with field errors, Signup success, Login with wrong credentials
- **Asymmetric width**: Drop zone in `max-w-3xl`, panels in `max-w-2xl`
- **Responsive**: Mobile form panel flat (no card chrome), desktop with card chrome (`sm:` breakpoints)
- **No JS responsive detection**, no file handling, no "Forgot password", all CSS-only

### 3. Auth Page (app/(auth)/page.tsx)
- **TopAppBarReduced**: Wordmark "Marginalia" left only, nothing on right — verified correct
- **Six labeled states**: Signup idle, Login idle, Signup submitting, Signup with field errors, Signup success, Login with wrong credentials
- **Quiet prose form-level error**: plain serif, no border/no red/no icon
- **EmptyState reuse**: success state uses EmptyState component (quiet zone, no card chrome)
- **FormField error states**: muted-clay border + error message, handled by component

### Cross-Cutting Verification Results (all pages)
| Check | Result |
|-------|--------|
| `npm run build` | PASS (all 3 pages) |
| No JS-based responsive detection | CLEAN |
| No "Forgot?" affordance | CLEAN |
| No "ARCHIVE WORKSPACE" | CLEAN |
| No file handling (onDragEnter/onDrop/FileReader/setFile) | CLEAN |
| Required component imports | ALL PRESENT |
| No `truncate` in PipelineStep/ProcessingPanel | PASS |
| Desktop layout containment | PASS |
| Mobile layout (flat panel, no horiz scroll) | PASS |
| Browser console clean at breakpoints | PASS |

### Files Modified/Created
- **Modified**: `app/(app)/documents/page.tsx` (breadcrumb fix, container wrapping, truncation removal)
- **Modified**: `components/ui.tsx` (removed `truncate` from DocumentRow title)
- **Created**: `app/(app)/upload/page.tsx` (Upload page with 7 states)
- **Created**: `app/auth/page.tsx` (Auth page at `/auth`)

Total: 2 files modified, 2 files created. Zero modifications to UI Kit components, Tailwind config, globals, or any restricted files.