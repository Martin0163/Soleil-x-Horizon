# Soleil x Horizon — 7-Level Migration System

## LEVEL 1 — SUPERFICIAL CLEANUP ✅ COMPLETE
- [x] All 13 CSS files cleaned (comments, dead code, Spanish→English, header normalization)

## LEVEL 2 — DEEP CLEANUP ✅ COMPLETE

### Phase 1: Fix Level 1 Leftovers ✅
- [x] `soleil-theme-styles.css` — Spanish placeholder comments already removed during L1

### Phase 2: Remove Within-File Redundancies ✅
- [x] `soleil-theme.css` — Removed 38-line duplicate `.site-header`/`.sticky-header` block from `@media (max-width: 768px)`
- [x] `base.css` — Removed duplicate `.mobile-menu-wrapper { display: none }` and duplicate `.mobile-menu-wrapper { display: block }`
- [x] `base.css` — `.nav-dropdown` duplication deferred to Level 3 (different contexts)

### Phase 3: Fix Invalid CSS ✅
- [x] `product-grid.css` — Replaced `@media (max-width: var(--breakpoint-sm))` with `@media (max-width: 749px)`

### Phase 4: Remove Exact Duplicate @keyframes ✅
- [x] `soleil-theme.css` — Removed duplicate `@keyframes fadeIn` (lines 1305-1308)
- [x] `soleil-theme.css` — Removed duplicate `@keyframes spin` (lines 1340-1343)

### Phase 5: Fix Performance Anti-Patterns ✅
- [x] Fix 1: `microinteractions.css` — Universal `*` selector → scoped `a, button, input, select, textarea, [role="button"]`
- [x] Fix 2: `microinteractions.css` — `transform: none !important` → safe `animation-duration: 0.01ms` pattern
- [x] Fix 3: `soleil-theme.css` `.btn` — `transition: all` → specific properties (background-color, box-shadow, transform, color, border-color)
- [x] Fix 4: `soleil-theme-styles.css` `.soleil-button-secondary` — `transition: all` → specific properties (background-color, color, transform)
- [x] Fix 5: `base.css` `.btn` — `transition: all` → specific properties (background-color, color, border-color)

### Phase 6: Consolidate prefers-reduced-motion ✅
- [x] `microinteractions.css` — Replaced `transform: none !important` with safe near-zero duration pattern (done in Phase 5 Fix 2)
- [x] `soleil-theme-styles.css` — Removed duplicate `*, *::before, *::after` universal block (already in `base.css`); kept Soleil-specific `.soleil-animate-*` overrides

### Deferred to Level 3+
- Cross-file token conflicts (design decision needed): `--color-success/error/warning/info`, `--shadow-sm/md/lg`, `--radius-md/lg`, `--line-height-tight`
- Duplicate component styles (.btn, .container, .product-grid, .quantity-selector, h1-h6) across base.css and soleil-theme.css
- Duplicate reveal patterns (.reveal vs .reveal-on-scroll)
- Conflicting @keyframes pulse (scale in microinteractions vs opacity in soleil-theme) and fadeInUp (10px vs 30px)
- Multiple :root blocks in tokens-soleil.css (4 separate blocks)
- Z-index scale conflicts across 3 files
- 5 component files duplicated inside base.css

## LEVEL 3 — BLOCK CLASSIFICATION ✅ COMPLETE

### Small Files (6)
- [x] `fly-to-cart.css` — FILE header + 3 BLOCKs
- [x] `product-grid.css` — FILE header + 4 BLOCKs
- [x] `overflow-list.css` — FILE header + 7 BLOCKs
- [x] `announcement-bar.css` — FILE header + 5 BLOCKs
- [x] `slideshow.css` — FILE header + 7 BLOCKs
- [x] `mega-menu.css` — FILE header + 7 BLOCKs

### Medium Files (3)
- [x] `template-giftcard.css` — FILE header + 10 BLOCKs
- [x] `microinteractions.css` — FILE header + 9 BLOCKs
- [x] `tokens-soleil.css` — FILE header + 20 BLOCKs

### Large Files (4)
- [x] `soleil-theme-styles.css` — FILE header + 31 BLOCKs
- [x] `custom-sections.css` — FILE header + 36 BLOCKs
- [x] `soleil-theme.css` — FILE header + 34 BLOCKs
- [x] `base.css` — FILE header + ~70 BLOCKs (5 batches)

## LEVEL 4 — SELECTOR SEGMENTATION ✅ COMPLETE

### No Changes Needed (2)
- [x] `fly-to-cart.css` — Already segmented (base, .is-flying, @media in separate BLOCKs)
- [x] `tokens-soleil.css` — Pure :root tokens, no selectors to segment

### Small Segmentation (5)
- [x] `product-grid.css` — Added sub-headers for base, states (:hover), variants
- [x] `overflow-list.css` — Added sub-headers for base, pseudo-elements, media queries
- [x] `announcement-bar.css` — Added sub-headers for base, states (:hover/:focus-visible), variants (.is-active)
- [x] `slideshow.css` — Added sub-headers for base, variants (--prev/--next), variants (.is-active)
- [x] `mega-menu.css` — Added sub-headers for base, states (:hover/:focus-visible), variants ([open])

### Medium Segmentation (2)
- [x] `template-giftcard.css` — Added sub-headers for base, states (:focus), variants (--expired), pseudo-elements (:has()), media queries
- [x] `microinteractions.css` — Added sub-headers for base, states (:hover, :active), variants (.is-visible, [open]), keyframes

### Large Segmentation (4)
- [x] `soleil-theme-styles.css` — Added sub-headers for base, states (:hover), pseudo-elements (::before, ::after), keyframes
- [x] `custom-sections.css` — Added sub-headers for base, states (:hover, :focus, :checked), variants (.is-active), pseudo-elements, media queries
- [x] `soleil-theme.css` — Added sub-headers for base, states (:hover, :active), variants (.active, .is-scrolled), pseudo-elements (::after), media queries
- [x] `base.css` — Added sub-headers for all blocks (Base, States, Variants, Pseudo-elements, Media queries)
## LEVEL 5 — MODULARIZATION ✅ COMPLETE

### Modular Architecture Created
- [x] Created a modular architecture based on the segmented selectors
- [x] Extracted each BLOCK into its own module file
- [x] Ensured each module has a single responsibility
- [x] Eliminated duplication across modules
- [x] Maintained proper dependencies between modules
- [x] Organized modules by functionality (layout, components, utilities, etc.)

### Directory Structure
- [x] assets/css/tokens/ - Design system variables (colors, typography, spacing, etc.)
- [x] assets/css/base/ - Base styles (reset, typography, forms, etc.)
- [x] assets/css/layout/ - Layout components (grid, sections, flex, drawer, etc.)
- [x] assets/css/components/ - UI components (card, navigation, slideshow, etc.)
- [x] assets/css/utilities/ - Utility classes (spacing, text, display, flex, animations)
- [x] assets/css/main.css - Main import file that brings everything together

### Files Created
- [x] 10 token files (colors, typography, spacing, etc.)
- [x] 7 base files (reset, typography, media, forms, etc.)
- [x] 5 layout files (grid, sections, flex, drawer, sticky)
- [x] 6 component files (card, navigation, slideshow, announcement-bar, fly-to-cart, product)
- [x] 5 utility files (spacing, text, display, flex, animations)
- [x] 5 index files (one for each directory)
- [x] 1 main CSS file
## LEVEL 6 — MIGRATION ✅ COMPLETE

### Plan
- [x] Create import files in assets/ for each module category
  - [x] assets/css-tokens.css - Imports all token files
  - [x] assets/css-base.css - Imports all base files
  - [x] assets/css-layout.css - Imports all layout files
  - [x] assets/css-components.css - Imports all component files
  - [x] assets/css-utilities.css - Imports all utility files
- [x] Create main CSS file that imports all modules
  - [x] assets/soleil-horizon.css - Main CSS file
- [x] Create Shopify theme structure directories if needed (already in place)
- [x] Update import paths in all files (done in the import files)
## LEVEL 7 — FINAL AUDIT ✅ COMPLETE

### Plan
- [x] Verify all legacy CSS removed
- [x] Verify all new modules exist
- [x] Check for duplicates
- [x] Check for empty files
- [x] Verify no JS/SVG/Liquid/JSON modified
- [x] Verify folder structure matches final architecture
- [x] Output complete audit log
