# Taste-Skill: Frontend Design & Anti-Slop Guidelines (tasteskill.dev)

This project adopts the **Taste-Skill** design system (https://www.tasteskill.dev / https://github.com/Leonxlnx/taste-skill).
All UI/UX development, components, and styling generated or modified by AI coding agents must strictly adhere to these design principles.

---

## 1. The Core Taste Philosophy

AI models by default generate "AI Slop": generic, cookie-cutter interfaces featuring predictable 3-column card layouts, generic purple/cyan glowing gradients, cluttered hero eyebrows, oversized unreadable cards, and monotonous padding.

**Taste-Skill mandates:**
- **Intentionality over randomness**: Every color token, font choice, border radius, and spacing value must have an optical and structural justification.
- **Editorial & Distinctive Visual Identity**: Avoid generic SaaS templates. Tailor the atmosphere (minimalist, editorial, tactile, high-density, or luxury dark) specifically to the domain.
- **Content-Driven Layouts**: The layout adapts to the content and hierarchy, not the other way around.

---

## 2. Anti-Slop Banned UI Patterns (NEVER Output These)

1. **No Cliché Gradients**: Ban purple-to-blue gradients, glowing neon dropshadows on dark backgrounds, and gradient text fills.
2. **No Nested Cards**: Do not put cards inside cards. Flatten depth using subtle dividers, background tone differences, or whitespace.
3. **No Cookie-Cutter 3-Column Grids**: Avoid repetitive identical cards with generic top icons and 2 lines of filler text. Use asymmetrical layouts, bento arrangements, or varied rhythm.
4. **No Hero Eyebrows**: Ban tiny, tracked-out uppercase badge labels floating uselessly above hero headings (e.g. `✦ INTRODUCING THE FUTURE OF X ✦`).
5. **No Artificial Metric Blocks**: Ban fake stat boxes (e.g., `99.9% / 10k+ / 24/7`) placed without real domain relevance.
6. **No Arbitrary Radii**: Cap standard container radii at 12–16px. Reserve full pill shapes (`rounded-full`) solely for buttons, tags, or small chips.
7. **No Wrapped Labels**: Labels in buttons, tabs, pills, and badges must fit on ONE line (`whitespace-nowrap`).

---

## 3. Typography & Hierarchy

- **Pairing**: Pair a distinctive display/heading typeface (editorial serif, high-character grotesque, or display geometric) with a clean, highly legible body font.
- **Step Scale**: Maintain at least a 1.25 step ratio between heading levels. Never skip heading levels (e.g., H1 straight to H3).
- **Line Length & Heights**:
  - Body text line width constrained to 65–75 characters (`max-w-prose` / `max-w-2xl`).
  - Body line-height: 1.5 to 1.7.
  - Headings line-height: tight (1.1 to 1.25) with subtle tracking adjustments (`tracking-tight`).

---

## 4. Color, Contrast & Neutrals

- **Sophisticated Neutrals**: Never use pure `#000000` or `#FFFFFF`. Inject subtle warm or cool undertones (<5% saturation).
- **Restrained Accents**: Use one dominant accent color family for primary interactive states, supported by intentional semantic neutrals.
- **Accessibility**: All text and critical UI elements must pass WCAG AA contrast (≥4.5:1 for body text, ≥3:1 for large display text).
- **Surface Elevation**: Closer elements (Z-axis) get lighter, with subtle 1px border highlights (`border-slate-200/80` or `border-white/10`).

---

## 5. Spacing Math & Rhythm

- **Padding Rule**: Container outer padding must always equal or exceed the gap between internal child elements.
- **Button Proportion**: Button horizontal padding must be approximately 2x vertical padding (e.g., `py-2.5 px-5`).
- **Concentric Corner Radii**: Inner Radius = Outer Radius - Padding.

---

## 6. Micro-Interactions & Motion

- Use smooth, purposeful micro-animations with `motion/react` (or CSS transitions) with easing curves (`cubic-bezier(0.16, 1, 0.3, 1)`).
- Provide immediate visual feedback for hover, focus-visible, and active/pressed states.
- Respect `prefers-reduced-motion`.
