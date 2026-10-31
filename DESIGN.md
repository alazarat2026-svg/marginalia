# DESIGN.md — Marginalia

**Version:** 1.0 (final — after Auth page approval)
**Status:** Source of truth for implementation. The design phase is complete.
**Supersedes:** Any auto-generated token file from Stitch exports (e.g., the Material 3 DESIGN.md that ships inside a Stitch zip). Wherever those files conflict with this document, **this document wins.**

---

## 0. Table of contents

1. Brand & style direction
2. Color tokens
3. Typography tokens
4. Spacing, radii, elevation
5. Layout grammar
6. Components (approved library)
7. Compositions (approved page-level patterns)
8. Content principles
9. Accessibility commitments
10. Anti-drift block (for future generation prompts)
11. Refinement & recomposition protocol
12. Out-of-scope log (v1)
13. Known implementation notes
14. Design lessons (from the build)
15. Approvals record

---

## 1. Brand & style direction

Marginalia is a reading-and-thinking tool for people who work with PDFs. It models the quiet comfort of a physical library desk: warm paper tones, calm serif typography, restrained motion, one accent color used only where interaction needs signal.

**The product is not an "AI app."** It is a document workspace with a chat. Users bring PDFs; they ask questions; they get answers grounded in the documents, with citations to specific pages. The product wins on trust, not on magic.

**Mood references and what to borrow:**
- **Notion** — calm neutral palette, generous vertical rhythm, one accent used sparingly, interface-disappears.
- **Linear** — 100–150ms micro-motion, crisp type, discipline of not decorating where function suffices.
- **Instapaper / Pocket** — serif-on-warm-white reading surface, wide line height, a page meant to be read, not scanned.

**Combine:** Notion's calm + Linear's motion + Instapaper's reading warmth. The result should feel like a tool for reading and thinking, not an AI product.

**Explicitly rejected aesthetics and patterns:**
- Chat-toy aesthetics ("ChatGPT with a file drop").
- "AI" tropes: purple gradients, sparkle icons, iridescent glow, "✨ Ask AI anything!" copy, animated gradient borders.
- Consumer-social patterns: likes, shares, emoji reactions, reaction chips, avatars next to messages.
- Skeuomorphic file cards, paper texture, faux-book covers.
- Dark-mode-only or dark-mode-first identity (light, reading-oriented default).
- Marketing funnels, hero sections, social proof ("Join 10,000 readers"), testimonial quotes.
- Folders, tags, sharing, team workspaces, chat-history sidebars with folders.
- Material 3 shell patterns (left nav rail, `web_dashboard` shell, bottom navigation bars unless specified for mobile).

---

## 2. Color tokens

**These are the only colors that exist in the product.** Every one is named, hex-coded, and purpose-bound. No other color may be introduced without a documented entry here.

| Token | Hex | Usage |
|---|---|---|
| `canvas` | `#F3F1EC` | Ambient workbench background (page background) |
| `reading-surface` | `#FAF8F4` | Reading substrate (conversation column, quiet cards, drop zone) |
| `surface-raised` | `#FFFFFF` | Elevated utility surfaces (cards, source blocks, panels) |
| `ink-strong` | `#1C1B19` | Titles, primary text, heavy display typography |
| `ink-body` | `#2E2C29` | Body reading text, primary UI text |
| `ink-muted` | `#6B6862` | Secondary metadata, labels, muted titles |
| `ink-faint` | `#9C988F` | Placeholder states, dividers, hint text |
| `line` | `#E4E0D8` | Hairline borders (1px) |
| `accent` | `#2F6B4F` | Primary interactive affordances (only green) |
| `accent-hover` | `#25553E` | Hover shade for accent elements |
| `accent-soft` | `#E7F0EA` | Tint for active rows, highlights, selection, completed-step glyphs |
| `focus-ring` | `rgba(47,107,79,0.4)` | Keyboard focus indicator on every interactive element |
| `status-processing` | `#B5761E` | Processing text |
| `status-processing-bg` | `#FBF3E4` | Processing chip background |
| `status-ready` | `#2F6B4F` | Ready text |
| `status-ready-bg` | `#E7F0EA` | Ready chip background |
| `status-failed` | `#A8503C` | Failed text, field-error borders (at 40% opacity), field-error messages |
| `status-failed-bg` | `#F7E9E4` | Failed chip background |

**Rules:**
- The **only green** in the product is `accent`. There are no other greens. `accent-hover` is its hover shade. `accent-soft` is its tint.
- The **only red** in the product is `status-failed` (`#A8503C` — muted clay, not alarm red). There is no error red, no alert red, no Material 3 `#ba1a1a` family. Where a color must signal error, it is `status-failed` at 40% opacity on a border, or `status-failed` on error-message text. Never a filled red surface, never a red banner, never a red icon.
- There is **no secondary or tertiary color** — no third hue. If a design needs to differentiate, it does so with tone, weight, elevation, or the three status colors — not with a new hue.
- `accent` is used **only on interactive affordances** — never for decoration.
- **Primary buttons must include an inline style fallback** (`style="background-color: #2F6B4F; color: #FFFFFF;"`) so they render visibly even if the Tailwind CDN config ordering issue (see §13) hides the class-based background. This is mandatory on every primary button.

**Rejected Material 3 tokens (do not adopt in any file, any component, any page):**
- `error`, `error-container`, `on-error`, `on-error-container` — any red family. Banned.
- `primary`, `primary-container`, `primary-fixed`, `primary-fixed-dim`, `inverse-primary`, `on-primary`, `on-primary-container`, `on-primary-fixed*` — replaced by our single `accent` family.
- `secondary`, `secondary-container`, `secondary-fixed*`, `on-secondary*` — no second color in our system.
- `tertiary`, `tertiary-container`, `tertiary-fixed*`, `on-tertiary*` — no third color in our system.
- `surface-tint`, `surface-dim`, `surface-bright`, `surface-container-*`, `surface-variant`, `inverse-surface`, `inverse-on-surface` — replaced by our `canvas` / `reading-surface` / `surface-raised` triad.
- `outline`, `outline-variant` — replaced by `line`.
- `on-surface`, `on-surface-variant`, `on-background` — replaced by `ink-strong`, `ink-body`, `ink-muted`, `ink-faint`.

---

## 3. Typography tokens

Two families: **Source Serif 4** for reading content and document titles. **Inter** for utility chrome, controls, labels, buttons.

| Token | Family | Size | Line height | Weight | Notes |
|---|---|---|---|---|---|
| `display` | Source Serif 4 | 34px / 2.125rem | 42px / 2.625rem | 600 | Tracking −0.02em. Page titles. |
| `headline` | Source Serif 4 | 21px / 1.3125rem | 28px / 1.75rem | 600 | Document titles, panel titles, section headlines |
| `body-reading` | Source Serif 4 | 17px / 1.0625rem | 30px / 1.75 | 400 | Answer prose, empty-state body, quiet asides |
| `body-ui` | Inter | 15px / 0.9375rem | 22.5px / 1.4 | 400 | Subtitles, CTA labels, UI prose |
| `label` | Inter | 13px / 0.8125rem | 20px / 1.25rem | 500 | Metadata rows, buttons, chip labels, input labels |
| `caption` | Inter | 12px / 0.75rem | 16px / 1rem | 400 | Small captions, chip text, error messages, pipeline subtitles |
| `micro` | Inter | 11px / 0.6875rem | 14px / 0.875rem | 500 | Uppercase — section labels, PDF file-type tag, review captions. Tracking +0.06em. |

**Rules:**
- Do not introduce sizes outside these seven. If a size seems needed, use the nearest token.
- `display` and `headline` stay at their sizes across all breakpoints (one token, all breakpoints). Do not add `display-mobile` or `headline-mobile`.
- Reading blocks (`body-reading`) maintain a line measure of 60–75 characters.
- `micro` is always uppercased when used.
- Negative tracking (−0.02em) on `display`. Neutral tracking on body and UI.
- Wide line height (1.75) on `body-reading`. Neutral (1.4–1.5) on `body-ui`.

**Rejected type tokens (do not adopt):** `display-mobile`, `headline-mobile` — Stitch adds these by default; they are not part of our system. If a smaller display is ever deliberately needed it becomes a **named** `display-sm` token, added as an explicit decision — not a silent default.

---

## 4. Spacing, radii, elevation

**Spacing scale (px):** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64. Uses named tokens in code (`space-1`, `space-2`, etc.). Generous vertical rhythm — sections breath at 32–48px gaps, not 16px.

**Radii:**
- `sm` — **6px** — chips, micro-badges, small controls
- `btn` — **8px** — primary and secondary buttons, form inputs
- `md` — **10px** — cards, source blocks, panels, popovers
- `lg` — **14px** — the drop zone, large panels, modals if any

**Elevation:**
- `elevation-1` — `0 1px 2px rgba(28,27,25,0.05)` — used on cards, source blocks, panels. Light only.
- Reading surfaces (conversation column, drop zone, quiet asides, empty states, success states) stay **flat** — no elevation.

**Rules:**
- Reading surface is **always flat** — no elevation, no border beyond structural hairlines.
- Utility surfaces (cards, source blocks, panels) get `surface-raised` + `line` border + `elevation-1`.
- No glow, no colored shadows, no layered depth stacks.
- Mobile form panels are **flat on canvas** — no card chrome. Cards are a desktop/tablet affordance for the form; at 375px they waste width.

**Rejected radii:** Material 3's radii semantics (`md = 0.375rem` etc.). Our `md` is 10px, not 6px. Ignore Stitch's radius token values; use ours.

---

## 5. Layout grammar

**Two layout modes**, chosen by page type — not one-size:

- **Reading columns** (conversation on Q&A page, empty-state body prose, quiet asides): `max-w-[68ch]` — narrow by design, Instapaper measure. Optimized for reading line length.
- **List columns** (Documents List, source lists, form action areas): `max-w-3xl` (~768px) inside a `max-w-4xl` (~896px) shell — enough width for a list to breathe without becoming a data table.
- **Auth columns** (form panels): `max-w-md` (~448px) inside a `max-w-4xl` shell — narrowest by design, single action.

**Never carry a reading-column width onto a page that isn't a reading column.** This was a real defect caught during the Documents List build.

**App shell:** slim top app bar (56px tall). No left nav rail. No `web_dashboard` shell. Mobile bottom bar is allowed **only** where specified (Q&A page uses a slim status bar). Do not add sidebars, left nav, or persistent drawer navigation in v1.

**Top app bar variants:**
- **Full** (Q&A, Documents List, Upload): wordmark left, breadcrumb (`Marginalia / Documents / <page>` or `Marginalia / <page>`), user identity + MO avatar right.
- **Reduced** (Auth): wordmark "Marginalia" left, nothing right. No breadcrumb. No user identity. No avatar. The user is not authenticated yet.

---

## 6. Components (approved library)

Every component below is approved and reused across pages. New components are added only by documented decision (a Page Brief and a Generation Prompt that names them). Nothing is invented inline.

### 6.1 Status chip
- Height 22px. Radius `sm` (6px). Padding 2px 8px. Typography `caption`.
- Three states: **Ready** / **Processing** / **Failed**. Each uses `status-{state}` text on `status-{state}-bg`. Each has a 6px dot in `status-{state}`.
- `Processing` state may pulse the dot (`animate-pulse`). `Ready` and `Failed` dots are static.
- Used in: Q&A context band, Documents List rows, Upload processing panel.

### 6.2 Primary button
- `bg-accent`, `text-white`, radius `btn` (8px), `label` typography, `min-h-[40px]` desktop / `min-h-[44px]` mobile.
- Hover: `bg-accent-hover`. Focus: `focus-ring`. Active: `scale-[0.985]`.
- **Must include inline style fallback:** `style="background-color: #2F6B4F; color: #FFFFFF;"` (mandatory, per §2).
- Full-width on mobile for primary CTAs (submit, Choose file, Try again, Open document).
- Used in: Q&A Send, Documents List Upload, Upload drop zone / processing / failed / success, Auth submit.

### 6.3 Ghost button (secondary)
- Transparent background, `ink-muted` text, `line` border, `btn` (8px) radius, `label` typography, `min-h-[44px]`.
- Hover: `ink-strong` text. Focus: `focus-ring`. Active: `scale-[0.985]`.
- Used in: Upload "Cancel upload", "Back to documents", "Upload another", "Try again" (secondary position), Auth "Resend verification email".

### 6.4 Inline citation link
- `accent` color, underline (offset 3px, thickness 1px), `font-serif`, hover background `accent-soft`, 120ms transition.
- Minimum **44px tap target on mobile** (`min-h-[44px] sm:min-h-0`), focus-ring.
- Clickable anchor/button — not a static badge.
- Used in: Q&A answers (inline `[p. 14]`), Documents List rail citations (same grammar — no weaker variant).

### 6.5 Source block
- **Collapsed state**: affordance showing "N sources" with an icon, `label` typography, `ink-muted`. Tap toggles expanded.
- **Expanded state**: `surface-raised` panel, `line` border, `elevation-1`, radius `md` (10px). Each source row: title in `label` sans semibold `ink-strong`, page label in `serif accent`, snippet in `serif italic body-ui ink-body`.
- When expanded-to a specific citation, that row gets `accent-soft` background + `accent/20` border.
- Used in: Q&A page (per-answer). Not on Documents List, Upload, or Auth.

### 6.6 Not-found composition (Q&A)
- **Not a card, not elevated, no red, no warning icon.**
- Reading-surface aside with `border-l-2 border-accent-soft` left rule + `pl-4 sm:pl-5` padding. No background tint on the container.
- Content order: headline (serif `headline` `ink-strong`) → bridge (serif `body-reading` `ink-body`) → suggestions (sans `body-ui` `ink-muted`) → quiet affordance "Ask a different question →" (accent sans `body-ui`).
- Used in: Q&A "insufficient context" fallback.

### 6.7 Document row (list item)
- `surface-raised` background, `line` border, `elevation-1`, radius `md` (10px), `p-4 sm:p-5` padding.
- Title: serif `headline` `ink-strong`. Meta line below: sans `label` `ink-muted` with `micro` uppercase PDF tag.
- Status chip right-aligned (desktop/tablet) or below meta line (mobile <640px).
- **Card state grammar by state:**
  - **Ready:** `surface-raised` bg, `ink-strong` title. Hover: `reading-surface` bg, `accent/40` border, `accent-hover` title. Card is `role="link"`, keyboard-operable (Enter/Space).
  - **Processing:** `reading-surface` bg, `ink-muted` title. Not a link. Status hint line "Processing — extracting text" in `status-processing`. No spinner — the chip's pulsing dot is the only motion.
  - **Failed:** `surface-raised` bg, `ink-strong` title. Not a link. Hint line "Couldn't process this file." + accent "Re-upload" link with 44px mobile tap target.
- Used in: Documents List, upload-in-progress alternate.

### 6.8 Empty state
- **Quiet zone, not a card.** No border, no shadow, no background tint. Sits directly on canvas.
- Generous vertical air: `py-16 sm:py-20`.
- Headline in serif `headline`. Body in serif `body-reading` (`max-w-xl`). Primary CTA. Three-step hint (desktop horizontal row → mobile `<ol>` stack) with numbered `accent-soft` badges.
- Used in: Documents List empty state, Auth signup success state.

### 6.9 Ask-input bar (Q&A)
- Sticky bottom of conversation column. `surface-raised`, `line` border, `elevation-2`, radius `md`. Focus-within: `border-accent`. Send button (primary) right side. Caption below (desktop only) in `caption ink-faint`: "Answers grounded in page-level citations".

### 6.10 Page header band
- Full-width section: title (`display` serif), subtitle (`body-ui` `ink-muted`), primary action right-aligned (desktop) / full-width (mobile). `pt-10 pb-8` air. Hairline separator below.
- Back-link (optional, top-left): "← Back to documents" in accent, `label` typography, 44px tap target.
- Used in: Documents List, Upload. (Q&A page uses the context band instead of the header band.)

### 6.11 Section label (micro)
- Uppercase `micro` `ink-muted`. Used above lists ("All documents"), above form panels ("ACCOUNT"), above upload drop zone ("UPLOAD"), above pipeline sections ("INGESTION PIPELINE"). Also used for review captions ("Alternate: Empty state") in `ink-faint`.

### 6.12 Top app bar
- Fixed 56px tall. Variants per §5 (full or reduced).
- **Full:** wordmark "Marginalia" left (`body-ui` semibold `ink-strong`). Breadcrumb with `/` separators. User identity right: "Maya Okonkwo" (`label` `ink-muted`, hidden mobile) + "MO" avatar (`accent-soft` bg, `accent` text, `caption`, 8×8 circle).
- **Reduced:** wordmark left only. Nothing else.

### 6.13 Drop zone (Upload)
- `reading-surface` bg, 2px dashed border in `line`, `rounded-lg` (14px). `py-12 sm:py-16` interior. **Flat — no elevation.**
- Centered stack: headline "Drop your PDF here" (`headline` serif, hidden mobile) / "Choose a PDF" (`headline` serif, mobile only), "or" (`body-ui` `ink-muted`, hidden mobile), primary "Choose file" button (full-width mobile), caption "PDF only · up to 50 MB" (`caption` `ink-faint`).
- **Drag-over state** (desktop only): border becomes solid 2px `accent`, bg becomes `accent-soft`, headline becomes "Drop to upload" in `accent`, "or" and button fade to ghost-button styling. Labeled alternate; not shipped on mobile.

### 6.14 Processing panel (Upload)
- `surface-raised`, `line` border, `elevation-1`, `rounded-md` (10px), `p-6 sm:p-8`.
- Top row: filename in serif `headline` `ink-strong`, meta line "PDF · uploading" in `label` `ink-muted`, status chip right-aligned.
- Section label "INGESTION PIPELINE" (`micro` uppercase `ink-muted`).
- Four-step pipeline (see 6.15).
- Ghost "Cancel upload" button at bottom-left.

### 6.15 Pipeline step row
- One row per stage. Left: 18×18 glyph. Right: stage label (`label` sans `ink-strong`) + subtitle (`caption` `ink-muted`).
- Four states:
  - **Pending:** glyph is empty `line`-colored circle. Label `ink-muted`. Subtitle `ink-faint`.
  - **Active:** glyph is `accent-soft` bg with pulsing `accent` dot. Label `ink-strong`. Subtitle `ink-muted`.
  - **Done:** glyph is `accent-soft` bg with `accent` checkmark. Label `ink-strong`. Subtitle `ink-muted`.
  - **Failed:** glyph is `status-failed-bg` bg with `status-failed` dot. Label `ink-strong`. Subtitle in `status-failed` color with the specific failure message.
- The four stages (verbatim copy): "Extracting text" / "Reading the PDF pages"; "Chunking" / "Splitting into sentence-aware sections"; "Embedding" / "Generating vectors for retrieval"; "Ready" / "Your document is searchable".
- When a stage fails, subsequent stages are **removed** (not shown as pending).

### 6.16 Form field (Auth)
- Label above input: `label` typography, `ink-strong`, `mb-1.5`.
- Input: `surface-raised` bg, `border border-line`, `rounded-btn` (8px), `px-3 py-2.5`, `min-h-[44px]`, `text-body-ui text-ink-strong placeholder:text-ink-faint`. Focus: `focus:ring-2 focus:ring-accent/40 focus:border-accent`.
- Optional helper below input: `caption` `ink-muted`, `mt-1`.
- **Error state:** input border becomes `status-failed` at 40% opacity (`style="border-color: rgba(168,80,60,0.4);"`), helper below becomes `caption` with `color: #A8503C` and reads the specific error message. **No red icon. No alert triangle. No shake animation.**
- Used in: Auth signup (Email, Password, Confirm password) and login (Email, Password).

### 6.17 Mode toggle link (Auth)
- Quiet toggle between signup and login: "Already have an account? " + "Sign in" (accent link) / "Don't have an account? " + "Sign up".
- `label` typography. Non-link text in `ink-muted`; link in `accent` with `focus-ring` and ≥44px tap target on mobile.
- Centered below the form panel.

### 6.18 Form-level error (Auth)
- **Plain serif prose**, no left rule, no box, no border, no background.
- `font-serif text-body-reading text-ink-body` — same type as answer prose.
- Embedded accent link (e.g., "reset your password") styled with underline, `accent`, focus-ring, ≥44px tap target.
- `mb-6` below the error paragraph.
- Used in: Auth login wrong-credentials state.

### 6.19 Quiet aside (helper text)
- Reading-surface left rule: `border-l-2 border-accent-soft pl-4 py-1`. No card, no shadow.
- Body text in `body-reading` serif `ink-body`.
- Used in: Q&A not-found state, Upload helper text below drop zone, Auth privacy line below form panel.

---

## 7. Compositions (approved page-level patterns)

### 7.1 Document Detail + Q&A page
- **Three zones** in a single shell:
  - **Context band** (top, full-width, `reading-surface` bg, hairline separators): title (`display` serif), meta row (`label` `ink-muted`), status chip.
  - **Conversation column** (center, `max-w-[68ch]`, flat reading surface): user question (quiet sans, "You" label) → answer (serif `body-reading`) with inline citations as clickable affordances → source block (collapsed by default, expandable to specific citation).
  - **Utility rail** (right, sticky, ≈320px): "Sources & Context" section label, source reference cards (reuse card grammar), no outline (outline extraction deferred to v2).
  - **Ask-input bar** sticky at bottom of conversation column.
- **Responsive:** tablet collapses rail below conversation; mobile turns rail into an inline `<details>` disclosure inside the conversation.
- **Not-found composition** for "insufficient context" (see 6.6).

### 7.2 Documents List page
- **Wide shell** (`max-w-4xl`), content column at `max-w-3xl`.
- **Page header band**: title "Documents" (`display` serif), subtitle "Your uploaded PDFs. Open one to ask questions.", primary "Upload PDF" button right-aligned (desktop) / full-width below subtitle (mobile).
- **Section label** "All documents" (micro uppercase `ink-muted`) above the list.
- **Single-column list** of document rows (see 6.7). Never a multi-column card grid. Never a data table.
- **Alternates below the list** (labeled design references, not shipped defaults): empty state, upload-in-progress.

### 7.3 Upload page
- **Wide shell** (`max-w-4xl`), **page header band** with back-link "← Back to documents", title "Upload a PDF", subtitle verbatim.
- **Section label** "UPLOAD" above the drop zone.
- **Drop zone** (`max-w-3xl`, wider than panels) — the primary surface.
- **Quiet aside** below the drop zone with the extraction/embedding explanation.
- **Four labeled alternates** (drag-over, processing, failed, success) each contained in a `max-w-2xl` panel — the asymmetric relationship is intentional (drop zone is the action, panels are the result).

### 7.4 Auth page
- **Wide shell** (`max-w-4xl`), **reduced top app bar** (wordmark only).
- **Centered narrow column** (`max-w-md`) with generous air (`pt-20 sm:pt-24`).
- **Section label** "ACCOUNT" above the form panel.
- **Form panel** on desktop/tablet (`surface-raised` card, `line` border, `elevation-1`, `rounded-md`, `p-8 sm:p-10`).
- **Form panel is FLAT on mobile** — no card chrome, fields directly on canvas.
- **Quiet aside below** the panel with the privacy line: "Your documents are private to your account. We never train on your data."
- **Mode toggle** below the panel ("Already have an account? Sign in" / "Don't have an account? Sign up").
- **Five labeled alternates**: login idle, signup submitting, signup field errors, signup success ("Check your email"), login wrong credentials.

---

## 8. Content principles

**Voice:** first-party, calm, honest. Short sentences. No apology spirals. No "AI" language ("ask the AI", "✨ magic", "let me think..."). No exclamation points. No "Oops!" — ever. Never say "No results found" — say "The document doesn't appear to contain an answer to this question." Never say "Invalid credentials" — say "That email and password don't match an account. Try again, or reset your password."

**Tone attributes:**
- **Truthful over reassuring.** If a document doesn't contain an answer, say so plainly. If a pipeline failed, say what failed and offer a next step. No hiding failures behind cheerful language.
- **Quiet over loud.** The most successful state (upload success) is the quietest state on its page.
- **Specific over generic.** "Processing — extracting text" beats "Working..." "Clause 8.2 — Termination for Cause · p. 14" beats "Source 1."
- **Framed as guidance, not error.** Field errors read as "Enter a valid email address" (guidance), not "Invalid input" (failure).
- **First-party, not system.** "We couldn't finish processing this file" is us speaking, not a system error code.

**Sample data (locked across all pages):**
- **User:** Maya Okonkwo · maya.okonkwo@northwindresearch.org · "Researcher"
- **Documents (5):**
  1. Master Services Agreement — Northwind / Halcyon Systems (Halcyon Legal, 24p, Ready)
  2. Adaptive Thermal Regulation in Low-Power Sensor Networks (R. Ferreira et al., 18p, Ready)
  3. Field Reliability Report: Model XR-200, Q3 (Northwind Engineering, 42p, Processing)
  4. Q4 Vendor Consolidation Proposal (J. Park, 9p, Failed)
  5. Chapter 6 — Distributed Consensus (K. Adeyemi, 31p, Ready)
- **Sample questions (for doc #2, the MSA):**
  1. "What is the warranty period?" (simple)
  2. "How does the termination clause interact with the liability cap?" (multi-citation — Q2 answer cites p. 14 + p. 22)
  3. "What's the penalty if we miss the Q3 delivery window?" (not answered — drives not-found state)
  4. "What are the notice requirements for termination?" (single-citation — Q4 answer cites p. 16)
- **Sample answers:** see §7 of the Master Design Brief rev. 2 (multi-citation Q2, single-citation Q4). Use verbatim in the design.

**Copy conventions:**
- "Upload PDF" (Documents List CTA) / "Upload your first PDF" (empty state) / "Choose file" (drop zone) / "Upload another" (success panel)
- "Ready" / "Processing" / "Failed" (status chip labels)
- "Processing — extracting text" (Documents List Processing hint)
- "Couldn't process this file." + "Re-upload" (Documents List Failed hint)
- Pipeline stage labels: "Extracting text" / "Chunking" / "Embedding" / "Ready"
- "Check your email" (Auth signup success headline)
- "The document doesn't appear to contain an answer to this question." (not-found headline)
- "That email and password don't match an account. Try again, or reset your password." (Auth login error)

---

## 9. Accessibility commitments

- **Focus ring** on every interactive element: `outline: 2px solid rgba(47,107,79,0.4); outline-offset: 2px` via `*:focus-visible`.
- **Tap targets ≥ 44×44px on mobile** for every button, link, chip, citation, form input, toggle link.
- **Keyboard operability** on cards with `role="link"` — Enter/Space handlers. Document rows, citations, and all buttons must be Tab-reachable.
- **Semantic HTML** — `<button>` for actions, `<a>` for links, `<article>` for document rows, `<section>` for page sections, `<details>` for mobile disclosures, `<input>` with `<label>` (or `aria-label` when visually hidden).
- **ARIA labels** where the visual presentation isn't self-describing: citations (`aria-label="Go to citation page 14"`), cards (`aria-label="Open document: ..."`), icon-only buttons.
- **No color-only state differentiation** — status chips include text ("Ready", "Processing", "Failed") + dot. Error states include both a border tint and a text message.
- **No horizontal scroll at 375px.** Text never clipped or overlapped at any breakpoint.
- **Contrast:** all text against its background meets WCAG AA at minimum (ink-strong and ink-body on reading-surface/canvas; ink-muted on reading-surface; accent on reading-surface).
- **Reduced motion:** any `animate-pulse` respects `prefers-reduced-motion`. Any `120ms` transition respects reduced-motion (transition becomes instant).

---

## 10. Anti-drift block (prepend to every future Stitch Generation Prompt)

Paste this paragraph at the top of every Generation Prompt you send to Stitch, or the equivalent generation AI. It is the single most effective drift-prevention tool in this project.
This is a Marginalia page. Follow DESIGN.md strictly. Do not use Material 3 shell patterns (web_dashboard, left nav rail, bottom navigation bar unless specified for mobile). Do not use any error, secondary, tertiary, *-container, *-fixed, or *-variant M3 tokens. The only greens are accent #2F6B4F, accent-hover #25553E, accent-soft #E7F0EA. No red except status-failed #A8503C (muted clay, and only on field-error indication or failed-status indication). Use only the type/space/radius/elevation tokens in DESIGN.md §3–§4. Primary buttons must include inline style fallback (style="background-color: #2F6B4F; color: #FFFFFF;") so they render visibly. If you cannot apply an instruction, describe exactly what is blocking it — do not silently omit.


---

## 11. Refinement & recomposition protocol

**Refinements are not only subtractive.** A refinement that only removes things produces a wireframe. Every refinement prompt must:

1. **Preserve the composition.** Lead with an explicit "preserve the composition" clause, not just "keep everything else."
2. **Name what to preserve specifically.** "Keep the shell width, keep the header band padding, keep the card hover states" — not "keep as is."
3. **State the ladder levels being preserved.** L3 composition, L4 motion, L5 light elevation.
4. **Distinguish "cleanup" from "recomposition."** Both are legitimate. Do not confuse them.

   - **Cleanup** — targeted fixes to a page whose composition is already correct:
     - Remove out-of-scope elements (sidebars, injected M3 components, "ARCHIVE WORKSPACE" strings).
     - Replace hardcoded token values with token classes (see §3–§4).
     - Swap unapproved colors for named tokens (e.g., `#125238` → `accent-hover`).
     - Remove spinners where label text carries the state.
     - Remove M3 shell-type meta tags.
     - Fix responsive collisions (mobile chip placement, button visibility).
     - Remove deferred affordances ("Forgot?" when forgot-password is v2).
     - Unify button grammars (bare text link → ghost button).

   - **Recomposition** — structural changes to a page whose composition is *wrong* or *too flat*:
     - Widen the shell or narrow the column to match the page type (see §5 layout grammar).
     - Give the page header air (`pt-10 pb-8` vs. tight padding).
     - Add section rhythm (micro labels, hairline separators).
     - Differentiate card grammar by state (Ready loud, Processing quiet, Failed loud-with-action).
     - Quiet the empty state (remove card chrome, generous air).
     - Introduce compositional asymmetry (drop zone wider than result panels).

   **A recomposition pass is not "make it modern."** It names specific structural changes. If a refinement needs recomposition, the prompt must say so, name the changes, and preserve the parts that work.

5. **Never approve a page that fails any lens.** If it's 95% correct, say "95%, here are the three things to fix." The refinement prompt is what closes the gap.

6. **Reference the ladder levels in every prompt.** A refinement that omits "Level 3 composition, Level 4 motion, Level 5 light elevation — preserve all" will drift toward Level 1 without anyone noticing. The ladder is the anti-drift mechanism for composition.

---

## 12. Out-of-scope log (v1 — deferred to v2 or later)

The following items are **explicitly out of scope for v1**. Do not add them, do not design alternates for them, do not leave placeholder affordances for them (unless marked inert-v2 with a note):

**Document surfaces:**
- PDF text viewer / jump-to-page on click (v2). Citation clicks expand the source block in v1; v2 may add PDF-view jump.
- Document outline extraction (v2). Not shown on Q&A page rail.
- Multiple chats per document (v1: one chat per document).
- Chat renaming, chat pinning, chat export.
- Sharing documents with other users, sharing chats, public links.
- Document deletion confirmation flows (out of scope; will be addressed at implementation).
- Re-ordering, pinning, or favoriting documents.

**Organization & navigation:**
- Folders, tags, collections, "smart" groupings.
- Left navigation rail, web_dashboard shell, sidebar with folders.
- Team workspaces, shared documents.
- Search across documents (v1: ask questions per-document).
- Bulk selection, bulk actions, pagination.

**Auth:**
- Forgot password / reset password flow (v2). Note: the copy "reset your password" appears as an inert accent link in the Auth wrong-credentials state — this is intentional as a v2 placeholder, not a shipped feature.
- OAuth (Google, GitHub, etc.).
- Magic link / passwordless auth.
- SSO / SAML.
- Two-factor authentication.
- Account settings page (v2+).
- Email change flow (v2+).
- Email verification resend flow (v1 has "Resend verification email" as a button — the button is present, the actual resend mechanics are implementation-phase work).

**Product features:**
- Streaming responses (v2). Single-response v1.
- Multi-document Q&A (v2). Single-document chat v1.
- Highlights, annotations, margin notes (v2 — the app is named Marginalia; the *product* feature is v2, only the visual reading-surface aesthetic ships in v1).
- Reading queue (v1 has only the Documents list).
- Citations library / saved citations (v2).
- Share-cited-answer, export-answer, copy-with-citations (v2).
- Document summarization pre-asking (v2).
- Related documents / similar documents (v2).

**Design system:**
- Dark mode (v2). Light reading-first default only.
- Display-mobile / headline-mobile type tokens (rejected; one display token across breakpoints).
- Material 3 error / secondary / tertiary tokens (rejected).
- Material 3 shell patterns (left nav rail, web_dashboard, persistent drawer).

---

## 13. Known implementation notes

**For implementation phase:**

- **Review captions must be removed before shipping.** The following labels are design-review artifacts that appear in the approved exports but must NOT be in production:
  - "Alternate: Empty state" (Documents List)
  - "Alternate: Upload-in-progress (top of list)" (Documents List)
  - "Alternate: Drag-over state (desktop only)" (Upload)
  - "Alternate: Processing" (Upload)
  - "Alternate: Failed" (Upload)
  - "Alternate: Success" (Upload)
  - "Alternate: Login (idle)" (Auth)
  - "Alternate: Signup submitting" (Auth)
  - "Alternate: Signup with field errors" (Auth)
  - "Alternate: Signup success — check your email" (Auth)
  - "Alternate: Login with wrong credentials" (Auth)
  - "Alternate: Expanded source block" (Q&A)
  - "Alternate: Context band — Processing / Failed" (Q&A)
  - "Alternate: Helpful 'Not Found' State" (Q&A)

- **Alternates render ONE at a time** based on real data state. A live user sees exactly one of: idle / processing / failed / success on Upload; signup / login / submitting / field-error / success / wrong-credentials on Auth; populated / empty / upload-in-progress on Documents List; answer / not-found on Q&A. Never render multiple alternates simultaneously in production.

- **Primary buttons must include inline style fallback** (`style="background-color: #2F6B4F; color: #FFFFFF;"`) to guarantee visibility under the Tailwind CDN config ordering issue documented below.

- **The Tailwind CDN config ordering bug** — In Stitch-generated exports, `tailwind.config` is set in a `<script>` tag *after* the `cdn.tailwindcss.com` script loads. Under certain conditions, `bg-accent` fails to resolve on primary buttons and they render invisible (white text on transparent/canvas background). The fix is the inline style fallback. If future exports render primary buttons invisible, apply the fallback immediately.

- **`<meta name="shell-type">` tags** — Stitch injects these (`web_dashboard`, `mobile_stack`). Always remove them. They contradict our design (slim top app bar, no sidebar, responsive at all breakpoints).

- **"Forgot?" affordance on password labels** — Do NOT add. Forgot password is deferred to v2. The v1 login form has "Password" label alone, no right-side affordance. The "reset your password" text appears only inside the wrong-credentials error message as an inert v2 placeholder link.

- **"ARCHIVE WORKSPACE" top-bar text** — Stitch may inject a workspace name into the top app bar. Remove it. The Auth page's reduced top bar shows only "Marginalia" left, nothing right.

- **Processing cards** must not be clickable. Only Ready cards are `role="link"` with keyboard handlers. Processing and Failed cards are `<article>` with no role and no tabindex.

- **Failed pipeline stages** remove subsequent stages from the list. Do not show a failed stage 3 with a pending stage 4 — the pipeline stops. Stage 4 "Ready" is not shown when stage 3 "Embedding" fails.

- **Citation expansion in v1** — clicking an inline citation expands the source block and highlights the specific cited row (`accent-soft` background). It does NOT scroll a PDF viewer (v2).

- **Form field error message color** — `#A8503C` (status-failed) for the helper text below the input, and `rgba(168,80,60,0.4)` for the input border. Do not use `#ba1a1a` or any Material 3 error token.

- **Focus rings** are applied via `*:focus-visible` (global CSS), not per-component. Do not rely on `focus:outline-none` alone — the global rule provides the visible ring on keyboard focus.

---

## 14. Design lessons (from the build)

These are the real lessons extracted from refining four pages through Stitch. They're logged here so future pages (v2 features, extensions) don't repeat them.

1. **Subtractive refinements produce wireframes.** A refinement prompt that only says "remove X, remove Y, remove Z" produces a page with no weight. Every refinement must state what to preserve and, if needed, what to add or reinforce. A page that complies with a checklist is not the same as a page that reads.

2. **The narrow-column defect.** `max-w-[68ch]` is correct for reading columns (conversations, prose) but wrong for list pages (Documents List, source lists). Carrying a reading width onto a list page produces a "form on a page" feeling. The layout grammar (§5) now distinguishes three column types (reading, list, auth) explicitly.

3. **The CDN config ordering bug.** Invisible primary buttons (white text on transparent background) occur when `bg-accent` fails to resolve due to Tailwind CDN config ordering. Inline style fallbacks prevent this. See §13.

4. **Errors are prose, not panels.** Field errors get a muted-clay border + text below the input. Form-level errors get plain serif prose with no rule, no box. Never a red banner, never a red icon, never an alert modal. Framed as guidance ("Enter a valid email address"), not as system failure ("Invalid input").

5. **Stitch will inject M3 defaults.** The anti-drift block (§10) is the single most effective tool in the project. Prepend it to every generation prompt — including refinements.

6. **Composition preservation is a prompt-writing discipline.** "Keep everything else" is not enough. Specific preservation lists (shell width, header padding, card hover states, panel structure) are what keeps a refinement from collapsing composition.

7. **The pipeline is the product's trust story.** On the Upload page, the four-step ingestion pipeline ("Extracting text → Chunking → Embedding → Ready") is not decoration — it's the user's window into what's happening with their document. Named step subtitles matter more than named stage labels ("Reading the PDF pages" beats "Extract"). This is what makes a backend process feel honest.

8. **Success should be the quietest state on the page.** The Auth success state ("Check your email") has no card, no big checkmark, no animation. The Upload success panel is composed and calm. Celebratory feedback signals anxiety, not accomplishment — the design chose calm because signing up and uploading are *not big deals*.

9. **The anti-drift block works.** Across the four pages, drift instances fell dramatically after DESIGN.md's anti-drift block was in use (from 6+ issues on page 1 refinements to 4 small items on the last page). Page 4 (Auth) required one refinement round for four small fixes, compared to pages 1–2 which required recomposition passes. The system matures the more specific the drift-prevention is.

10. **Cross-checking screenshots against source catches drift that neither source nor screenshot alone reveals.** In two rounds, buttons rendered invisible in the screenshot but their source looked correct — the comparison was what caught the CDN config issue. In production, this translates to: read the generated HTML, don't just look at the rendered page.

---

## 15. Approvals record

| Page | Design revisions | Final approval | Notes |
|---|---|---|---|
| Document Detail + Q&A | rev. 1 → rev. 2 | rev. 2 | Sidebar removal, not-found as reading-surface peer, ingestion states as real context bands, mobile sources disclosure |
| Documents List | rev. 1 → rev. 2 → rev. 3 → rev. 4 | rev. 4 | Sidebar removal, token replacement, card state grammar, quiet empty state, upload-in-progress, button visibility fix |
| Upload | rev. 1 → rev. 2 | rev. 2 | Breadcrumb fix, drag-over ghost button, cancel-upload ghost button, drop zone widened relative to panels, shell-type meta removal |
| Auth | rev. 1 → rev. 2 | rev. 2 | "ARCHIVE WORKSPACE" removal, "Forgot?" deferral, form-level error as plain prose, mobile vertical rhythm |

**Design phase status:** COMPLETE.

**Next phase:** Implementation (see separate protocol). The source of truth for implementation is this DESIGN.md plus the four approved page exports. Schema, RLS, ingestion pipeline, and RAG mechanics are implementation-phase work, not covered by this document.

---

*End of DESIGN.md v1.0 — final.*