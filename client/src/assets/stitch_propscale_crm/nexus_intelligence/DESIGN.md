---
name: Nexus Intelligence
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#adc6ff'
  on-secondary: '#002e6a'
  secondary-container: '#0566d9'
  on-secondary-container: '#e6ecff'
  tertiary: '#4ae176'
  on-tertiary: '#003915'
  tertiary-container: '#00a74b'
  on-tertiary-container: '#003111'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#6bff8f'
  tertiary-fixed-dim: '#4ae176'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005321'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
  gutter: 1.5rem
  margin-mobile: 1rem
  margin-desktop: 2.5rem
---

## Brand & Style
The design system is engineered for high-velocity lead generation and research management within the UK/EU property sector. It prioritizes a **Minimalist-Glassmorphic** aesthetic, evoking the precision of high-end developer tools like Vercel and the administrative clarity of Linear.

The interface is **Dark Mode first**, utilizing deep blacks and subtle translucency to reduce eye strain during prolonged research sessions. The emotional response is one of "Technical Sophistication"—reliable, fast, and intellectually rigorous. Smooth transitions and high-density information layouts ensure the platform feels like a professional instrument rather than a consumer app.

## Colors
This design system utilizes a tiered dark-palette architecture. The foundation is `#09090B`, providing a true-black canvas that allows for infinite depth.

- **Primary (Indigo):** Used for primary actions and active states.
- **Accent (Blue):** Used for research indicators and secondary highlights.
- **Surface (Zinc):** Elevates cards and containers from the background.
- **Success (Emerald):** Denotes positive lead conversions and validated data.

Glassmorphic effects are achieved through `rgba(255, 255, 255, 0.03)` fills coupled with a background blur (12px–20px) to maintain legibility over moving data streams.

## Typography
The typography strategy leverages three distinct typefaces to categorize information types:

1.  **Hanken Grotesk (Headings):** Used for page titles and section headers to provide a sharp, contemporary "SaaS" feel.
2.  **Inter (UI & Body):** The workhorse for all interface elements, input fields, and long-form research notes, chosen for its unparalleled legibility in dark environments.
3.  **JetBrains Mono (Data):** Applied to all numerical data, timestamps, lead counts, and property IDs to ensure vertical alignment and a technical, researched character.

*Note: Satoshi was substituted with Hanken Grotesk as the closest premium available alternative for high-impact headings.*

## Layout & Spacing
The design system employs a **Fixed-Fluid Hybrid** grid. The side navigation and research inspector panels are fixed-width (240px and 360px respectively), while the central work area scales fluidly.

- **Grid:** 12-column system for dashboard layouts.
- **Rhythm:** An 8px linear scale (mapped as `base * 2`) governs all padding and margins.
- **Density:** High density is preferred for data tables, using 8px vertical padding, while marketing or summary views use 24px+ for "breathing room."

## Elevation & Depth
Depth is conveyed through **Tonal Layering** and **Glassmorphism** rather than traditional heavy shadows.

- **Level 0 (Background):** Base `#09090B`.
- **Level 1 (Cards):** `#18181B` with a 1px solid border of `rgba(255, 255, 255, 0.08)`.
- **Level 2 (Modals/Popovers):** Semi-transparent zinc with `backdrop-filter: blur(16px)`.
- **Shadows:** Use extremely soft, long-spread shadows (`0 20px 40px rgba(0,0,0,0.4)`) to simulate elements floating over the dark canvas. 
- **Active State:** Elements should use a subtle outer glow of the Primary Indigo color (`0 0 12px rgba(99, 102, 241, 0.2)`) to indicate focus.

## Shapes
In accordance with the 16px requirement, the system uses a **Rounded** (Level 2) language.

- **Main Containers/Cards:** 16px (`rounded-xl`).
- **Standard UI Elements (Buttons/Inputs):** 8px (`rounded-md`).
- **Chips/Status Tags:** Fully pill-shaped to contrast with the structured grid of the property cards.
- **Selection Brackets:** 4px for focus indicators.

## Components
- **Buttons:** Primary buttons use a solid Indigo fill with a subtle top-light inner shadow. Secondary buttons are "Ghost" style with a 1px border.
- **Input Fields:** Backgrounds are slightly darker than card surfaces. Focus state triggers a 1px Indigo border and a 2px "Indigo-wash" outer glow.
- **Research Chips:** Small, mono-spaced text inside a low-opacity Indigo pill (`rgba(99, 102, 241, 0.1)`).
- **Data Tables:** No vertical borders. Horizontal borders only, using `1px solid rgba(255, 255, 255, 0.04)`.
- **Property Cards:** Feature a 16px corner radius, a subtle gradient hover effect, and high-contrast JetBrains Mono labels for property metrics.
- **Transitions:** All hover and state changes must use `cubic-bezier(0.4, 0, 0.2, 1)` with a 200ms duration for a "snappy" yet fluid feel.