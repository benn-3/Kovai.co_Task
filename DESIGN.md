# TaskTrac Design System — Obsidian Circuit

> High-Precision Technical Workbench design system for **TaskTrac**.
> Synthesizes **Overmind** (Dark carbon canvas, high contrast, technical copper/amber accents, monospace micro-metadata)
> and **Hex** (Modular bento-grid discipline, structured cards, hairline translucent dividers, minimal visual noise).

- **Product:** TaskTrac — Technical Personal Task Management
- **Stack:** React 19 + Vite, Vanilla CSS Design Tokens, FastAPI, MongoDB Atlas
- **Modes:** Dark (primary visual identity) + Light
- **Layout:** Modular Bento Grid, 3-lane Kanban board, split-panel auth

---

## 1. Design Philosophy

### Overmind + Hex Synthesis

| Source Pattern | TaskTrac Adaptation | Rationale |
|---|---|---|
| **Overmind: Dark-first carbon canvas** (`#0D0E12`) | **Dark as primary visual identity** (`#0D0E12`), with crisp high-contrast light mode (`#F8F9FA`) | Aligns with developer preference; eliminates glare during long task sessions |
| **Overmind: Technical copper/amber** | Primary brand & CTA accent (`#F59E0B` dark / `#D97706` light) | Replaces generic purple/blue with an authoritative, high-visibility engineering tone |
| **Overmind: Monospace metadata** | JetBrains Mono for dates, counters, status pills, and task IDs | Instantly communicates telemetry precision and glanceability |
| **Hex: Structured bento-grid layout** | Flush modular cards for stats, task creator, toolbar, and lanes | Clean cognitive compartmentalization without visual clutter |
| **Hex: Hairline dividers** | `1px solid rgba(..., 0.08)` instead of heavy borders or drop shadows | Maximizes whitespace economy and crispness on high-DPI screens |
| **Both: Restrained micro-interactions** | Instant transitions (`80ms–160ms`), zero decorative drifting blobs | Respects user agency; no distracting motion |

### Core Principles

1. **High-Precision Utility** — The interface feels like an engineered terminal console, not a generic SaaS template.
2. **Luminance-Driven Elevation** — Distinguish layers through distinct surface lightness steps (`#0D0E12` → `#13151B` → `#181A22` → `#232632`), not heavy blur or shadows.
3. **Semantic Color Discipline** — Color denotes state: Slate = Planned, Amber = In Progress, Emerald = Complete, Crimson = Overdue/Danger.
4. **Data Density & Economy** — Clean monospace telemetry, tabular figures, and tight 4px border radii.
5. **No Decorative Fluff** — No ambient gradient blobs, no CRT scanlines, no pixel fonts, no bloated corner radii.

---

## 2. Color System

### Design Tokens — Dark Mode (`[data-theme="dark"]` — Primary)

```css
[data-theme="dark"] {
  /* ── Surfaces ─────────────────────────────────────────────────── */
  --color-background:              #0D0E12; /* Deep Obsidian Charcoal */
  --color-background-secondary:    #13151B; /* Stepped Canvas */
  --color-surface:                 #181A22; /* Elevated Card Tile */
  --color-surface-hover:           #1E212B;
  --color-surface-elevated:        #232632; /* Popovers & Modals */
  --color-surface-alt:             #14161D;

  /* ── Brand Accents ────────────────────────────────────────────── */
  --color-primary:                 #F59E0B; /* Vivid Copper/Amber */
  --color-primary-hover:           #FBBF24;
  --color-primary-contrast:        #0D0E12;
  --color-secondary:               #94A3B8; /* Slate 400 */
  --color-secondary-hover:         #CBD5E1;
  --color-accent:                  #FBBF24;
  --color-accent-soft:             rgba(245, 158, 11, 0.12);
  --color-accent-ring:             rgba(245, 158, 11, 0.28);

  /* ── Typography ───────────────────────────────────────────────── */
  --color-text-primary:            #F8FAFC; /* High Luminescence Crisp White */
  --color-text-secondary:          #CBD5E1; /* Slate 300 */
  --color-text-muted:              #828E9E; /* Balanced Muted Text */
  --color-text-faint:              #525A68;

  /* ── Borders & Dividers ───────────────────────────────────────── */
  --color-border:                  rgba(255, 255, 255, 0.08);
  --color-border-strong:           rgba(255, 255, 255, 0.15);
  --color-focus:                   #FBBF24;

  /* ── Semantics ────────────────────────────────────────────────── */
  --color-success:                 #22C55E; /* Emerald 500 */
  --color-success-bg:              rgba(34, 197, 94, 0.12);
  --color-warning:                 #F59E0B; /* Amber 500 */
  --color-warning-bg:              rgba(245, 158, 11, 0.12);
  --color-error:                   #EF4444; /* Crimson 500 */
  --color-error-bg:                rgba(239, 68, 68, 0.12);
  --color-error-border:            rgba(239, 68, 68, 0.28);
  --color-info:                    #38BDF8; /* Sky 400 */
  --color-info-bg:                 rgba(56, 189, 248, 0.12);

  /* ── Kanban Status ────────────────────────────────────────────── */
  --status-planned:                #94A3B8;
  --status-planned-bg:             rgba(148, 163, 184, 0.10);
  --status-in-progress:            #F59E0B;
  --status-in-progress-bg:         rgba(245, 158, 11, 0.12);
  --status-complete:               #22C55E;
  --status-complete-bg:            rgba(34, 197, 94, 0.12);
}
```

### Design Tokens — Light Mode (`:root`)

```css
:root {
  /* ── Surfaces ─────────────────────────────────────────────────── */
  --color-background:              #F8F9FA;
  --color-background-secondary:    #F1F3F5;
  --color-surface:                 #FFFFFF;
  --color-surface-hover:           #F4F5F7;
  --color-surface-elevated:        #FFFFFF;
  --color-surface-alt:             #F1F3F5;

  /* ── Brand Accents ────────────────────────────────────────────── */
  --color-primary:                 #D97706; /* Amber 600 */
  --color-primary-hover:           #B45309; /* Amber 700 */
  --color-primary-contrast:        #FFFFFF;
  --color-secondary:               #475569; /* Slate 600 */
  --color-secondary-hover:         #334155;
  --color-accent:                  #F59E0B; /* Amber 500 */
  --color-accent-soft:             rgba(217, 119, 6, 0.08);
  --color-accent-ring:             rgba(217, 119, 6, 0.22);

  /* ── Typography ───────────────────────────────────────────────── */
  --color-text-primary:            #0F172A; /* Slate 900 */
  --color-text-secondary:          #334155; /* Slate 700 */
  --color-text-muted:              #64748B; /* Slate 500 */
  --color-text-faint:              #94A3B8; /* Slate 400 */

  /* ── Borders & Dividers ───────────────────────────────────────── */
  --color-border:                  rgba(15, 23, 42, 0.08);
  --color-border-strong:           rgba(15, 23, 42, 0.16);
  --color-focus:                   #D97706;

  /* ── Semantics ────────────────────────────────────────────────── */
  --color-success:                 #16A34A; /* Emerald 600 */
  --color-success-bg:              rgba(22, 163, 74, 0.08);
  --color-warning:                 #D97706; /* Amber 600 */
  --color-warning-bg:              rgba(217, 119, 6, 0.08);
  --color-error:                   #DC2626; /* Crimson 600 */
  --color-error-bg:                rgba(220, 38, 38, 0.08);
  --color-error-border:            rgba(220, 38, 38, 0.22);
  --color-info:                    #0284C7; /* Sky 600 */
  --color-info-bg:                 rgba(2, 132, 199, 0.08);

  /* ── Kanban Status ────────────────────────────────────────────── */
  --status-planned:                #64748B;
  --status-planned-bg:             rgba(100, 116, 139, 0.08);
  --status-in-progress:            #D97706;
  --status-in-progress-bg:         rgba(217, 119, 6, 0.08);
  --status-complete:               #16A34A;
  --status-complete-bg:            rgba(22, 163, 74, 0.08);
}
```

### Color Usage Rules

| Context | Token(s) | Never |
|---|---|---|
| **Page background** | `--color-background` | Raw hex in component styles |
| **Card / panel fill** | `--color-surface` | `white` / `#fff` |
| **Primary CTA** | `--color-primary` on bg, contrast text | Primary accent for decorative clutter |
| **Status indication** | `--status-*` + `--status-*-bg` | Using brand accent for task status |
| **Destructive action** | `--color-error` / `--color-error-bg` | Red for non-destructive elements |
| **Borders** | `--color-border` (default), `--color-border-strong` (emphasis) | Solid opaque gray borders |
| **Focus rings** | `--color-focus` outline + `--color-accent-ring` shadow | Removing focus indicators |

---

## 3. Typography

### Font Stack

```css
/* Primary UI / Body Typography */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;

/* Technical Metadata / Telemetry */
font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
```

> **Why Inter + JetBrains Mono?**
> - **Inter** provides exceptional clarity, x-height, and neutral precision for long reading sessions and task descriptions.
> - **JetBrains Mono** is used selectively for dates, counters, status pills, compact statistics, and task IDs, giving the application an authentic, high-speed engineering feel without sacrificing body readability.

### Type Scale

| Role | Size | Weight | Font | Line-height | Letter-spacing | Usage |
|---|---|---|---|---|---|---|
| **Display** | 28px | 700 | Inter | 1.15 | -0.03em | Auth brand name, hero text |
| **H1** | 22px | 600 | Inter | 1.25 | -0.025em | Dashboard greeting |
| **H2** | 12px | 600 | Inter | 1.4 | 0.06em | Lane titles, uppercase section headers |
| **Body** | 14px | 400 | Inter | 1.5 | -0.005em | Default paragraph text |
| **UI Label** | 13px | 500 | Inter | 1.4 | -0.005em | Button text, input labels |
| **Mono Metric** | 24px | 600 | JetBrains Mono | 1.1 | -0.02em | Stat card numeric counters |
| **Mono Meta** | 11px | 400–500 | JetBrains Mono | 1.2 | 0.02em | Task timestamps, lane counts, status pills |
| **Micro Badge**| 10px | 600 | JetBrains Mono | 1 | 0.04em | Overdue tag, tiny indicators |

### Typography Rules

- **Negative letter-spacing** at display/heading sizes creates the "engineered" feel inspired by Linear.
- **Body text stays neutral** (near-zero letter-spacing) for comfortable reading.
- **Weight 500** is the workhorse for interactive labels — between regular and semibold.
- Never use font weights below 400 in the interface.
- Maximum line length for body text: **65ch** (auth panels, descriptions).

---

## 4. Spacing System

### Base Grid: 4px

All spacing values are multiples of 4px. This creates a consistent vertical and horizontal rhythm.

```
--sp-0:   0px
--sp-1:   4px     Tight internal padding (icon gaps)
--sp-2:   8px     Default gap between related elements
--sp-3:  12px     Form group internal spacing
--sp-4:  16px     Standard component padding
--sp-5:  20px     Medium breathing room
--sp-6:  24px     Section padding, container gutters
--sp-8:  32px     Between major sections
--sp-10: 40px     Large separation
--sp-12: 48px     Page-level vertical padding
--sp-16: 64px     Maximum section separation
--sp-20: 80px     Hero/auth panel padding
```

### Spacing Application Guide

| Context | Token | Value |
|---|---|---|
| Button icon-to-label gap | `--sp-1` + 2px | 6px |
| Card internal padding | `--sp-4` | 16px |
| Board lane gap | `--sp-2` | 8px |
| Navbar height | — | 60px (15 × 4) |
| Container max-width | — | 1200px |
| Container horizontal padding | `--sp-6` | 24px |
| Dashboard body padding | `--sp-8` top, `--sp-6` sides | 32px / 24px |
| Auth panel padding | `--sp-12` | 48px |

---

## 5. Border & Radius

### Border Conventions

| Pattern | Style | When |
|---|---|---|
| **Hairline divider** | `1px solid var(--border)` | Navbar bottom, panel separators |
| **Input / card border** | `1.5px solid var(--border)` | Form inputs, user chip, outline buttons |
| **Emphasized border** | `1.5px solid var(--border-strong)` | Hover states on inputs/cards |
| **Focus ring** | `0 0 0 3px var(--accent-ring)` + border change | `:focus` on form controls |
| **Status accent** | `3px solid var(--status-*)` via `::before` | Task card top bar |

> **Inspired by Linear:** Use semi-transparent borders (`rgba`) instead of opaque grays.
> This ensures borders adapt naturally to both light and dark backgrounds without
> requiring separate border color tokens per theme.

### Border Radius Scale

```
--radius-xs:    2px     Micro tags, dots, small badges
--radius-sm:    4px     Buttons, inputs, cards, status pills
--radius-md:    6px     Containers, dialogs, create panel
--radius-lg:    8px     Auth card
--radius-full: 9999px   Avatars, user chips
```

> **Obsidian Circuit** uses **tight, precision-engineered radii** (4–6px) rather than soft bulbous curves.
> This produces an authentic technical workbench aesthetic aligned with terminal and IDE surfaces.

---

## 6. Shadow System

Shadows are **layered** (two declarations per level) to create realistic depth:

```css
--shadow-xs:  0 1px 2px rgba(0,0,0,0.04);
--shadow-sm:  0 1px 2px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04);
--shadow-md:  0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06);
--shadow-lg:  0 4px 8px rgba(0,0,0,0.04), 0 16px 48px rgba(0,0,0,0.08);
```

**Dark mode** uses stronger shadows (higher opacity) to compensate for the dark canvas.

| Shadow Level | Usage |
|---|---|
| `--shadow-xs` | Primary buttons at rest |
| `--shadow-sm` | Cards, buttons on hover, brand mark |
| `--shadow-md` | Floating panels, toast notifications |
| `--shadow-lg` | Confirmation dialogs, command menus |

---

## 7. Motion & Animation

### Timing Tokens

```css
--dur-fast:   120ms     /* Button press, icon micro-feedback */
--dur:        180ms     /* Standard transitions (hover, focus) */
--dur-slow:   280ms     /* Theme toggles, panel opens */
```

### Easing Curves

```css
--ease:        cubic-bezier(0.25, 0.1, 0.25, 1);     /* Standard ease (near-linear) */
--ease-out:    cubic-bezier(0, 0, 0.2, 1);            /* Decelerate (element arriving) */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);    /* Overshoot (playful micro-animations) */
```

### Motion Principles

1. **All interactive elements** transition `background-color`, `color`, `border-color`, and `box-shadow` with `var(--dur) var(--ease)`.
2. **Button press** uses `transform: scale(0.97)` with `var(--dur-fast)` — subtle, immediate feedback.
3. **Theme toggle** icon rotates on `:active` with `var(--ease-spring)` for a moment of delight.
4. **Gradient mesh blobs** drift slowly (30–35s cycles, ±25px translate) for ambient life.
5. **`prefers-reduced-motion: reduce`** disables all animations globally. No exceptions.

---

## 8. Information Hierarchy

### Adapted from Linear's Structural Layers

Linear organizes: **Workspace → Team → Project → Cycle → Issue**

TaskTrac simplifies to: **User → Board → Lane → Task**

```
┌─────────────────────────────────────────────────────────────────┐
│  NAVBAR (sticky, z-50)                                          │
│  ┌─ Brand ──── User Chip ──── Theme Toggle ──── Sign Out ────┐ │
│  └────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  DASHBOARD HEADER                                               │
│  ┌─ Greeting + subtitle ─────────────────────────────────────┐ │
│  └───────────────────────────────────────────────────────────┘ │
│  STATS GRID (4 cards)                                          │
│  ┌─ Total ─┐ ┌─ Planned ┐ ┌─ Progress ┐ ┌─ Complete ─┐      │
│  └─────────┘ └──────────┘ └───────────┘ └────────────┘      │
│  CREATE PANEL (collapsible)                                     │
│  ┌─ + New Task ──── Title ──── Description ──── Due ──── ✓ ─┐ │
│  └───────────────────────────────────────────────────────────┘ │
│  TOOLBAR (search + sort)                                        │
│  ┌─ 🔍 Search ──────────────── ↕ Sort ───────────────────────┐ │
│  └───────────────────────────────────────────────────────────┘ │
│  BOARD (3-lane Kanban)                                          │
│  ┌─ Planned ──────┐ ┌─ In Progress ──┐ ┌─ Complete ─────────┐ │
│  │  • Lane header  │ │  • Lane header  │ │  • Lane header     │ │
│  │  • TaskCard     │ │  • TaskCard     │ │  • TaskCard        │ │
│  │  • TaskCard     │ │  • TaskCard     │ │  • TaskCard        │ │
│  │  • (empty state)│ │                 │ │                    │ │
│  └─────────────────┘ └─────────────────┘ └────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Density Guidelines

| Element | Visual Weight | Why |
|---|---|---|
| **Navbar** | Minimal — no background pattern, just hairline bottom border | Always visible; must not compete with content |
| **Stats cards** | Low — `--surface-alt` background, muted label, bold number | Glanceable summary, not primary content |
| **Create panel** | Medium — `--surface` background, clear label, compact form | Frequently used; needs to be findable without dominating |
| **Board lanes** | Primary — largest vertical space, task cards are the hero content | This is what the user came for |
| **Task cards** | High — border, status accent, actionable footer | Each card must be scannable and self-contained |

---

## 9. Component Patterns

### Buttons

| Variant | Background | Border | Text Color | Use Case |
|---|---|---|---|---|
| **Primary** | `--accent` | none | `#FFFFFF` | Main CTA: "Sign in", "Save" |
| **Outline** | `--surface` | `--border` | `--text-secondary` | Secondary: "Cancel", "Sign out" |
| **Ghost** | transparent | none | `--text-muted` | Tertiary: sort toggle, filter actions |
| **Danger (confirm)** | `--danger` | none | `#FFFFFF` | Destructive: "Delete" in confirmation |

All buttons: `border-radius: var(--radius-sm)`, `font-size: 14px`, `font-weight: 500`.
Small variant (`btn-sm`): `padding: 6px 12px`, `font-size: 13px`.

### Form Controls

- **Input height:** ~38px (9px padding × 2 + 14px font + 1.4 line-height)
- **Border:** `1.5px solid var(--border)` → `var(--border-strong)` on hover → `var(--accent)` on focus
- **Focus ring:** `0 0 0 3px var(--accent-ring)` as `box-shadow`
- **Error state:** `border-color: var(--danger)` + `box-shadow: 0 0 0 2px var(--danger-border)`
- **Placeholder color:** `var(--text-faint)`

### Task Cards

```
┌─────────────────────────────────────────┐
│ ▬▬▬ (3px status color bar via ::before) │
│                                         │
│  Task Title                    14px 500 │
│  Description text…             14px 400 │
│                                         │
│  Sep 16, 2026  ·  Due Sep 20   13px     │
│                                         │
│  ┌ Select: Planned ▼ ┐   ✏️  🗑️          │
│  └───────────────────┘                  │
└─────────────────────────────────────────┘
```

- Background: `var(--surface)`, border: `1px solid var(--border)`
- Status bar: `3px` tall `::before` pseudo-element using `--status-*` colors
- Footer: status `<select>` + icon buttons (edit, delete)
- Hover: `border-color: var(--border-strong)`, subtle `translateY(-1px)`

### Toast Notifications

- Position: bottom-right, stacked
- Background: `var(--surface)`, border: `1px solid var(--border)`
- Shadow: `var(--shadow-md)`
- Auto-dismiss: 2500ms
- Animation: slide up + fade in / fade out

### Confirmation Dialog

- Centered overlay with `backdrop-filter: blur(8px)`
- Card: `var(--surface)`, `var(--shadow-lg)`, `var(--radius-md)`
- Two actions: outline "Cancel" + danger "Delete"
- Click outside to dismiss

---

## 10. Responsive Strategy

### Breakpoints

| Name | Width | Behavior |
|---|---|---|
| **Desktop** | ≥ 900px | 3-column board, split-panel auth, full navbar |
| **Tablet** | 720–899px | 3-column board (narrower), single-panel auth |
| **Mobile** | < 720px | Single-column with tab switcher, stacked auth |

### Mobile Adaptations

- **Board:** Switches from 3-column grid to single-column with filter tab bar
- **Auth:** Brand panel hides; form panel fills screen with compact logo
- **Navbar:** User email hides below 600px; only avatar + sign out remain
- **Stats grid:** Wraps to 2×2 grid on narrow screens

---

## 11. Accessibility Commitments

| Requirement | Implementation |
|---|---|
| **WCAG AA contrast** | All text/background pairs meet 4.5:1 minimum ratio |
| **Focus visibility** | `2px solid var(--accent)` outline + `2px` offset on `:focus-visible` |
| **Reduced motion** | `prefers-reduced-motion: reduce` → `animation-duration: 0.01ms` globally |
| **Semantic HTML** | `<nav>`, `<main>`, `<article>`, `role="dialog"`, `aria-label` on all interactive elements |
| **Color independence** | Status is communicated via text labels + position (lane), not color alone |
| **Keyboard navigation** | All interactive elements are focusable; dialogs trap focus |

---

## 12. File Structure

```
frontend/src/
├── index.css              ← All design tokens + component styles (single source of truth)
├── App.css                ← Minimal app-level overrides
├── App.jsx                ← Route config + gradient mesh background
├── main.jsx               ← React root + context providers
├── context/
│   ├── AuthContext.jsx    ← Token/session state
│   ├── ThemeContext.jsx   ← Dark/light toggle, localStorage persistence
│   └── ToastContext.jsx   ← Transient notification queue
├── components/
│   ├── Navbar.jsx         ← Sticky header, brand, user chip, sign out
│   ├── TaskCard.jsx       ← Card with status bar, inline edit, confirm delete
│   ├── TaskFilters.jsx    ← Status tabs, search, sort (mobile-only currently)
│   ├── TaskForm.jsx       ← Compact inline creation form
│   ├── TaskList.jsx       ← Task grid layout
│   └── ThemeToggle.jsx    ← Sun/Moon switcher (Lucide icons)
├── pages/
│   ├── Dashboard.jsx      ← Board layout, stats, toolbar, lanes
│   ├── Login.jsx          ← Split-panel sign-in with Google One-Tap
│   └── Register.jsx       ← Split-panel registration with validation
└── services/
    └── api.js             ← Axios client, JWT interceptor, API calls
```

---

## 13. Quick Reference Card

```
┌──────────────────────────────────────────────────────────────────┐
│  TASKTRAC — OBSIDIAN CIRCUIT QUICK REFERENCE                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PRIMARY    Dark: #F59E0B (Amber)      Light: #D97706 (Amber)    │
│  ACCENT     Dark: #FBBF24 (Ember)      Light: #F59E0B (Amber)    │
│  BG         Dark: #0D0E12 (Carbon)     Light: #F8F9FA (Slate 50) │
│  SURFACE    Dark: #181A22 (Card Tile)  Light: #FFFFFF (White)    │
│  TEXT       Dark: #F8FAFC (White)      Light: #0F172A (Slate 900)│
│                                                                  │
│  STATUS     Planned: Slate  · Progress: Amber  · Complete: Green │
│                                                                  │
│  FONT UI    Inter, -apple-system, system-ui, sans-serif          │
│  FONT MONO  JetBrains Mono, SF Mono, Consolas, monospace         │
│  BODY       14px / 400 / 1.5                                     │
│  HEADING    22px / 600 / 1.25 / -0.025em                         │
│                                                                  │
│  SPACING    4px base grid (4, 8, 12, 16, 20, 24, 32, 40, 48)   │
│  RADIUS     xs:2  sm:4  md:6  lg:8  full:9999                   │
│  CONTAINER  max-width: 1200px, padding: 24px                    │
│                                                                  │
│  MOTION     fast:120ms  default:160ms  slow:220ms                │
│  EASE       cubic-bezier(0.16, 1, 0.3, 1)                       │
│                                                                  │
│  BORDERS    Semi-transparent hairline rgba, 1px                  │
│  SHADOWS    Restrained, layered, elevation via luminance steps   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 14. Implementation Rules

**DESIGN.md is the visual source of truth for TaskTrac.**

Before creating or modifying any UI:

1. Reuse existing design tokens.
2. Do not introduce arbitrary colors.
3. Do not introduce arbitrary spacing values.
4. Do not introduce new border-radius values without updating this document.
5. Do not add gradients unless explicitly specified here.
6. Do not add glassmorphism.
7. Do not add decorative illustrations or floating shapes.
8. Do not turn every section into a card.
9. Prefer hierarchy, whitespace, typography and borders over shadows.
10. New components must follow the existing interaction patterns.
11. Do not redesign unrelated components while implementing a feature.
12. If a design decision is not covered here, choose the simplest solution
    consistent with the existing system.

### Design Priorities

TaskTrac should feel like a mature productivity application,
not an AI-generated SaaS template.

**Prioritize:**
- Information hierarchy
- Typography
- Whitespace
- Subtle borders
- Restrained color
- Useful interaction feedback
- High information density
- Predictable layouts

**Avoid:**
- Gradients
- Glassmorphism
- Excessive cards
- Excessive rounded corners
- Decorative blobs
- Oversized headings
- Excessive shadows
- Colorful dashboards
- Unnecessary animations
- Generic SaaS illustrations
- Visually noisy components

### Guiding Principle

The Kanban board is the primary content.
Everything else should support task management.

**When uncertain, choose the quieter and simpler option.**

---

*This design system is a living document. Update it as the product evolves.*
*Linear's patterns informed the thinking; the implementation is TaskTrac's own.*
