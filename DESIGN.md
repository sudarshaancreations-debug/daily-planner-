# NIMORA Design System & Token Reference (`DESIGN.md`)
**Product:** NIMORA — Your Day. Intelligently Organized.  
**Platform:** Android Native (TWA) & Progressive Web App  
**Philosophy:** 80% Utilitarian Restraint, 20% Purposeful Delight

---

## 🎨 1. Color Palette & Theming Tokens

### Night Mode (Default Executive Obsidian)
| Token Name | Hex Code | Usage |
| :--- | :--- | :--- |
| `--bg-base` | `#0e0b1f` | Root canvas ground, deep obsidian night |
| `--bg-surface` | `#141815` / `#161a17` | Card ground, inner modals, drawer backgrounds |
| `--accent-lime` | `#bef264` | Primary call-to-actions, completion ticks, active states |
| `--accent-lavender` | `#c084fc` | Secondary status badges, AI voice visualizer accents |
| `--text-primary` | `#f8fafc` | Crisp high-contrast headlines and primary task titles |
| `--text-secondary` | `#94a3b8` / `#8a938e` | Metadata, timestamps, subordinate labels |
| `--glass-border` | `rgba(255, 255, 255, 0.08)` | Minimal hairline card borders and dividers |

### Day Mode (High-Contrast Outdoor Sunlight)
| Token Name | Hex Code | Usage |
| :--- | :--- | :--- |
| `--bg-day-base` | `#f8fafc` | Clean bright canvas ground |
| `--bg-day-surface` | `#ffffff` | Elevated cards with subtle diffuse shadows |
| `--text-day-primary` | `#0f172a` | Deep charcoal for maximum sunlight legibility |
| `--text-day-secondary`| `#475569` | Secondary descriptive text and timestamps |
| `--accent-day-cta` | `#0f172a` | Primary CTA buttons (white text on charcoal) |
| `--border-day` | `rgba(203, 213, 225, 0.9)` | Hairline structural borders |

---

## 🔤 2. Typography Hierarchy

| Role | Font Family | Weight | Size | Letter Spacing |
| :--- | :--- | :---: | :---: | :---: |
| **App Title / Brand** | `Space Grotesk` | 700 | 20px – 24px | `tracking-wider` |
| **Section Headings** | `Space Grotesk` | 600 / 700 | 14px – 16px | `tracking-wide` |
| **Task Titles / Body** | `Plus Jakarta Sans` | 500 / 600 | 13px – 14px | Normal |
| **Timestamps / Badges**| `JetBrains Mono` / Monospace | 700 | 9px – 11px | `tracking-widest` (Uppercase) |
| **Input Fields** | `Plus Jakarta Sans` | 400 / 500 | 13px | Normal |

---

## 🎬 3. Motion & Animation Standards

* **Deceleration Curve:** Use exponential ease-out `cubic-bezier(0.16, 1, 0.3, 1)` for all slide and scale transitions.
* **Duration:**
  * Micro-interactions (button press, checkbox tick): `120ms – 150ms`
  * Modal and drawer entrances: `200ms – 240ms`
  * Tab sliding capsule: `280ms cubic-bezier(0.16, 1, 0.3, 1)`
* **Banned Patterns:**
  * ❌ No continuous rubber-band `animate-bounce` on static text or notifications.
  * ❌ No overshoot cubic-bezier curves exceeding `1.0` (e.g. `1.275`).
  * ❌ No gratuitous floating animated background blobs that distract from focus blocks.

---

## 📱 4. Mobile Ergonomics & Safe Areas

* **Minimum Interactive Touch Target:** `44 × 44px` (Web) / `48 × 48dp` (Android).
* **Bottom Inset Protection:** All fixed bottom elements (Thumb Slider, Action Drawers) must incorporate:
  ```css
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
  ```
* **Top Header Inset:**
  ```css
  padding-top: max(0.75rem, env(safe-area-inset-top));
  ```
* **Viewport Config:** Always configure `viewportFit: "cover"` to extend dark immersion behind translucent status and navigation bars.

---

## 🛡️ 5. Semantic vs. Brand Tokens (The "Payment Failed" Rule)

> [!CAUTION]
> **The Classic Rebrand Anti-Pattern:**
> Never bind functional/semantic states (`error`, `danger`, `warning`, `success`) to brand color tokens (`primary`, `accent`). If a brand rebrands to lime/green and uses brand tokens for status messages, "Payment Failed" accidentally renders in green!

| Intent | Semantic Token | Color Family | Strict Usage |
| :--- | :--- | :--- | :--- |
| **Error / Failed** | `--color-danger` | Rose / Red (`#f43f5e` / `#ef4444`) | Payment failure, card authentication errors, input validation alerts, account deletion. |
| **Warning / Collision** | `--color-warning` | Amber (`#f59e0b`) | Schedule overlap conflicts, destructive confirmation warnings. |
| **Success / Approved** | `--color-success` | Emerald (`#10b981`) | Verified payments, completed sync, task completion checks. |
| **Brand Accent** | `--brand-accent` | Solar Lime (`#bef264`) | Interactive buttons, thumb slider capsule, focal UI elements ONLY. |

---

## 💻 6. Viewport Adaptability (The "1366px Laptop" Rule)

> [!TIP]
> **The 1920px vs 1366px Trap:**
> Designing solely for 1920px desktop monitors breaks when clients open the app on standard 1366×768 laptops or mobile devices.

* **Mobile-First Core Container:**
  * Native Phone Viewports (360px – 430px): 100% full-width immersive immersion.
  * Desktop & Laptop Viewports (1366px, 1440px, 1920px): Centered ergonomic viewport capsule (`max-w-md mx-auto`) with ambient deep obsidian canvas. Eliminates horizontal scrolling and prevents UI stretching.
* **Fluid Legal & Web Pages:**
  * Document pages (`/privacy`, `/terms`, `/delete-account`) use responsive max-widths (`max-w-3xl mx-auto px-4 md:px-8`) so content reflows naturally from 320px to 4K displays.
* **Overflow Protection:**
  * Zero fixed-width overflows; all flex containers use `min-w-0` and text truncation (`truncate`, `break-words`).

---

## 🔘 7. Button Integrity & Text-Wrap Safeguard (The "Do Tukde" Rule)

> [!WARNING]
> **The Split Button Anti-Pattern:**
> Client: *"Bhai, ye Save button ke do tukde kyun hain?"*  
> When flex parents shrink or button containers lack `whitespace-nowrap`, button labels or icon-text pairs awkwardly split across multiple lines on smaller viewports.

* **Enforced `whitespace-nowrap`:** All interactive buttons (`.minimal-btn-primary`, `.minimal-btn-secondary`, `.btn-accent-cta`) strictly enforce `white-space: nowrap;` and `display: inline-flex;`.
* **Icon & Text Cohesion:** Action icons and text labels are grouped with `flex items-center gap-1.5` so icons never detach from their labels.
* **Touch Target Buffer:** Interactive height maintains a minimum of `40px` (or `44px` on mobile) to ensure comfortable finger landing without accidental double-clicks.

---

## ⏳ 8. Contextual Loading Hierarchy (The "No Generic Spinners" Rule)

> [!TIP]
> **Not Every Loading State Needs a Spinner:**
> Generic full-screen spinning wheels cause cognitive fatigue, feel unresponsive, and induce anxiety. Loading states must match the context of the user action.

| Scenario | Anti-Pattern | Recommended Loading Pattern in NIMORA |
| :--- | :--- | :--- |
| **Initial Content / Schedule Load** | Full-screen modal spinner | **Skeleton Screens / Shimmer Placeholders (`animate-pulse`)** matching timeline card dimensions. Zero Cumulative Layout Shift (CLS). |
| **Instant Action (Check task / Delete)** | Spinner replacing the checkbox | **Optimistic UI:** State updates immediately with tactile haptic tick + Toast with Undo action. |
| **AI Voice & Speech Parsing** | Circular loading spinner | **Pulsing Acoustic Orb:** Organic breathing waveform visualizer showing live voice activity. |
| **Cloud Sync / Background Ops** | Blocking loading overlay | **Ambient Pill Indicator:** Compact status label (e.g. *"Synced 2m ago"*) that never interrupts user flow. |
| **Payment Authorization** | Infinite generic wheel | **Staged Progress Steps:** Transparent steps (*"Contacting Google Play"* ➔ *"Secured"* ➔ Animated green tick). |

---

## 🔗 9. Social Share & WhatsApp Rich Link Previews (The "Plain Blue Link" Rule)

> [!IMPORTANT]
> **The Plain Blue Link Trap (Reel #5: @codingontherocks):**
> When users share your web application link on WhatsApp, iMessage, Twitter/X, Slack, or LinkedIn, and it renders as a naked blue URL without a thumbnail, headline, or summary, click-through rates plunge by over 70%. Rich OpenGraph cards establish immediate brand credibility.

### WhatsApp & OpenGraph Crawler Requirements

1. **Absolute Canonical URLs (`metadataBase`):**
   * WhatsApp and Telegram web crawlers **do not resolve relative URLs**. An `og:image` set to `/og-image.jpg` will fail silently, causing WhatsApp to fall back to a plain blue link.
   * In Next.js App Router, `metadataBase: new URL('https://nimora-ai.vercel.app')` is mandated in `src/app/layout.tsx` so all image and canonical links resolve into valid absolute HTTPS addresses.

2. **The 300KB File Size Ceiling:**
   * WhatsApp's crawler has a strict payload limit: images exceeding **300 KB** are often dropped or rejected by the link parser, resulting in a broken card or plain text URL.
   * NIMORA provides `/og-image.jpg` (1024×500, 121 KB, JPEG Q=85), guaranteeing instant load and 100% preview reliability.

3. **Required Meta Tag Architecture:**
   * `og:title`: High-impact headline ("NIMORA — Your Day. Intelligently Organized.").
   * `og:description`: Concise 1-2 sentence value proposition with key keywords (Voice assistant, focus time-blocking, stakeholder CRM).
   * `og:image`: 1024×500 / 1200×630 image asset under 300KB with explicit `og:image:width`, `og:image:height`, and `og:image:type`.
   * `og:type`: `"website"`.
   * `og:site_name`: `"NIMORA AI Daily Planner"`.
   * `twitter:card`: `"summary_large_image"` for large card rendering across Twitter/X and modern messengers.

---

## 🏛️ 10. The 10 Layout & Aesthetics Design Archetypes Matrix

Modern digital product design is governed by pairing the right **structural layout archetype** with the corresponding **visual aesthetic system**. Below is the canonical industry taxonomy, detailing token rules, layout mechanics, and their architectural application:

| # | Layout Archetype | Visual Aesthetic | Target Industry & Use-Case | CSS & Token Implementation Rules | NIMORA Application |
| :-: | :--- | :--- | :--- | :--- | :--- |
| **01** | **Split Screen** | **Glassmorphism** | Startups & SaaS Mobile Apps | `grid-cols-1 lg:grid-cols-2`, `backdrop-blur-md`, `bg-white/[0.04]`, hairline border `border-white/10` | **Interactive Onboarding & Demo**: Left hero pitch, right interactive live schedule simulator. |
| **02** | **Bento Grid** | **Dark Luxury (Obsidian)** | Portfolios, Executive Dashboards & Premium Tools | Modular CSS grid (`grid-cols-1 md:grid-cols-3 gap-4`), deep obsidian ground (`#0e0b1f`), midnight card surfaces (`#141815`), vibrant Solar Lime focal points (`#bef264`) | **NIMORA Core Dashboard**: Foundation of Today's view — Timeline capsule, priority quadrants, focus timer, and CRM follow-up blocks. |
| **03** | **Full-Screen Hero** | **Aurora Gradient** | Product Launches & AI Announcements | `min-h-screen flex items-center justify-center`, radial mesh blurs (`blur-3xl`), iridescent indigo/emerald gradient shifts | **NIMORA Voice Orb**: Acoustic voice assistant visualizer with breathing radial illumination. |
| **04** | **Card Grid** | **Flat Design** | Online Stores, Food Menus & Catalogs | Uniform multi-column (`grid-cols-2 sm:grid-cols-4 gap-4`), 0px blur, solid high-contrast backgrounds, crisp semantic badges | **Settings & Integrations Shelf**: Clean modular grid for toggling Google Calendar, Outlook, and MCP tools. |
| **05** | **Editorial Layout** | **Skeuomorphism** | Long-form Blogs, Journals & Storytelling | Multi-column fluid serif body, drop caps, tactile paper textures, debossed timestamps, physical notebook margins | **Habit Reflection Log**: Personal retrospective journal entries with tactile timeline markers. |
| **06** | **Big Typography** | **Neo-Brutalism** | Creative Youth Brands & Web3 Platforms | Bold display headers (`text-6xl tracking-tighter`), stark black drop shadows (`shadow-[4px_4px_0px_#000]`), 2px solid borders | **Marketing Banners & Special Campaigns**: High-impact promotional announcements. |
| **07** | **Sidebar Navigation** | **Material Design** | Enterprise Dashboards & Complex B2B SaaS | Fixed/collapsible left nav drawer (`w-64 shrink-0`), standardized 8dp elevation (`shadow-md`), ripple touch feedback | **Desktop Management Console**: Expandable navigation when accessing NIMORA from 1440px+ enterprise workstations. |
| **08** | **Z-Pattern** | **Claymorphism** | Explainer Landing Pages & Service Guides | Alternating left-to-right eye scanning path, 3D inflated pill containers, dual inner shadows (`inset -4px -4px ...`) | **Features Walkthrough**: Illustrating automated schedule rebalancing and conflict resolution to new executives. |
| **09** | **Single-Column Scroll** | **Neumorphism / Soft Emboss** | Focused Landing Pages & Bio Links | Centered narrow container (`max-w-xl mx-auto`), soft monochromatic embossed surfaces (`shadow-[6px_6px_12px_#..._-6px_-6px_12px_#...]`) | **Legal & Privacy Policies**: Frictionless single-column reading on `/privacy`, `/terms`, and `/delete-account`. |
| **10** | **Asymmetric Grid** | **Swiss Minimal** | Design Agencies, Art Studios & Architecture | Strict mathematical baseline grid, intentional whitespace asymmetry, Neue Haas / Grotesque type, zero decorative gradients | **Executive Summary & Analytics Reports**: Utilitarian data density displaying weekly focus hours and output velocity. |

---

### 👑 Why NIMORA Anchors on Archetype #02 (Bento Grid + Dark Luxury)

1. **Information Density without Clutter:** Bento grids allow high-density executive data (Voice Orb, Calendar Timeline, Overdue Alerts, Stakeholder CRM) to live harmoniously in balanced visual hierarchy without overwhelming cognitive load.
2. **Night-Owl Executive Focus:** The Dark Luxury palette (`#0e0b1f` canvas with Solar Lime `#bef264` micro-accents) reduces eye fatigue during early-morning and late-night planning sessions while projecting prestige and precision craftsmanship.
3. **Responsive Modular Reflow:** Bento cells naturally adapt from a 3-column desktop layout to an ergonomic single-column vertical stack on mobile screens (360px–430px) without any layout distortion or horizontal scrollbars.






