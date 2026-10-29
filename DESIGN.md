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
