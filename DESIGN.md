---
name: Pixel Port
description: Honest, one-click Windows game compatibility for Apple Silicon Macs.
colors:
  ink: "#0A0816"
  base-top: "#0D0A1C"
  base-bottom: "#060410"
  surface: "#16122A"
  surface-2: "#1F1838"
  line: "#FFFFFF14"
  amethyst: "#9268FF"
  signal-teal: "#3FD6CE"
  verified: "#4AD991"
  playable: "#F0B43E"
  attention: "#F0894E"
  blocked: "#E0556B"
  foreground: "#F5F5F7"
  muted: "#9AA3B5"
typography:
  display:
    fontFamily: "Geologica Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.25rem, 8vw, 6rem)"
    fontWeight: 650
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Geologica Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 4.5rem)"
    fontWeight: 650
    lineHeight: 1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Geologica Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "normal"
  subhead:
    fontFamily: "Geologica Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 650
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  lead:
    fontFamily: "Geologica Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1rem, 1.6vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  body:
    fontFamily: "Geologica Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  small:
    fontFamily: "Geologica Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.58
    letterSpacing: "normal"
  meta:
    fontFamily: "Geologica Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 550
    lineHeight: 1.45
    letterSpacing: "normal"
  control:
    fontFamily: "Geologica Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "normal"
  label:
    fontFamily: "Geologica Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "normal"
rounded:
  control: "12px"
  surface: "16px"
  pill: "999px"
spacing:
  xs: "0.45rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  wrap-gutter: "clamp(1.25rem, 3vw, 2.5rem)"
  scene: "clamp(5rem, 10vw, 10rem)"
components:
  button-primary:
    backgroundColor: "{colors.signal-teal}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0.78rem 1.35rem"
    height: "48px"
  button-secondary:
    backgroundColor: "#100D21"
    textColor: "{colors.foreground}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0.78rem 1.35rem"
    height: "48px"
  filter-default:
    backgroundColor: "#FFFFFF06"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.55rem 0.75rem"
    height: "2.75rem"
  filter-selected:
    backgroundColor: "#9268FF26"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.55rem 0.75rem"
    height: "2.75rem"
  search-field:
    backgroundColor: "#FFFFFF08"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.6rem 0.8rem 0.6rem 2.35rem"
    height: "2.75rem"
  status-verified:
    backgroundColor: "#4AD99126"
    textColor: "{colors.verified}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.24rem 0.48rem"
  status-playable:
    backgroundColor: "#F0B43E26"
    textColor: "{colors.playable}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.24rem 0.48rem"
---

# Design System: Pixel Port

## 1. Overview

**Creative North Star: "The Verified Portal"**

Pixel Port is a cinematic passage from uncertain Windows-game compatibility to a clear, evidence-backed Mac launch. Its violet-black environment feels focused rather than gloomy: real game artwork, compatibility grades, and launch data remain the subject while amethyst and teal describe the route through the product.

The visual voice is cinematic, precise, and reassuring. Generous scenes create drama, compact controls keep decisions direct, and the portal motif gives technical transformation a physical form without exposing terminal-heavy complexity. Dark tonal layers, fine spectral lines, and limited ambient glows provide depth; the interface does not depend on decorative glass or constant neon.

Layouts are fluid and content-led. The core wrapper tops out at 80rem with `clamp(1.25rem, 3vw, 2.5rem)` gutters, display copy stays balanced and short, and body copy is capped near 65–75 characters. Motion uses a fast 160ms cut for control feedback and a 520–900ms cinematic cadence for meaningful transitions, with an instant reduced-motion path.

**Key Characteristics:**

- Violet-black tonal depth with amethyst-to-teal portal energy
- Real game artwork and evidence before decoration
- Compact, tactile, confidence-first controls
- Large, balanced Geologica display type with calm supporting copy
- Device-aware conversion and responsive layouts from 20rem upward
- Explicit status language that never relies on color alone

## 2. Colors

The Deep Amethyst palette combines a near-black violet environment with one structural energy color, one action color, and four evidence colors whose meanings remain stable everywhere.

### Primary

- **Deep Amethyst** (`#9268FF`): Marks portal energy, focus, selected controls, and structural emphasis. It is a directional current, not a fill applied to every surface.
- **Signal Teal** (`#3FD6CE`): Carries primary actions, actionable links, and the completing edge of the portal transition. On bright teal fills, use Port Black text.

### Secondary

- **Verified Green** (`#4AD991`): Verified end-to-end compatibility.
- **Playable Amber** (`#F0B43E`): Playable results that still carry caveats.
- **Attention Orange** (`#F0894E`): Results that need intervention or careful reading.
- **Blocked Rose** (`#E0556B`): Unsupported or blocked results.

### Neutral

- **Port Black** (`#0A0816`): Dark ink for text on bright actions and the anchor for glass-like overlays.
- **Violet Night** (`#0D0A1C`): The upper page atmosphere and sticky-control base.
- **Abyss Violet** (`#060410`): The deepest page background and footer edge.
- **Deep Violet Surface** (`#16122A`): Standard panel and menu surface.
- **Raised Violet** (`#1F1838`): Hovered or more prominent tonal surface.
- **Cool White** (`#F5F5F7`): Primary text and high-emphasis labels.
- **Steel Mist** (`#9AA3B5`): Supporting copy and metadata; keep it at the committed token value so readability does not fade.
- **Spectral Line** (`#FFFFFF14`): Fine dividers and quiet control borders.

### Named Rules

**The Evidence Color Rule.** Compatibility colors are reserved for compatibility meaning and always travel with a label, icon, or both.

**The Two-Energy Rule.** Deep Amethyst explains structure and passage; Signal Teal identifies the clearest next action. Do not make both colors compete for the same role.

## 3. Typography

**Display Font:** Geologica Variable (with `ui-sans-serif`, `system-ui`, and sans-serif fallbacks)
**Body Font:** Geologica Variable (with `ui-sans-serif`, `system-ui`, and sans-serif fallbacks)
**Label/Mono Font:** Geologica Variable; monospace is limited to rare machine-readable captions and never becomes the brand voice.

**Character:** Geologica’s shaped geometry feels capable and technical without looking like developer tooling. One family creates cohesion; clear changes in scale, weight, and spacing provide the contrast.

### Hierarchy

- **Display** (650, `clamp(3.25rem, 8vw, 6rem)`, 0.98): One dominant proposition per scene. Balance the wrap, cap it near 10–12 characters per line, and never tighten beyond `-0.04em`.
- **Headline** (650, `clamp(2.5rem, 5vw, 4.5rem)`, 1): Section-level ideas and catalogue introductions.
- **Title** (650, `1rem`, 1.2): Game names, component titles, and short decision labels.
- **Lead** (400, `clamp(1rem, 1.6vw, 1.25rem)`, 1.65): Explanatory copy directly supporting display or headline text.
- **Body** (400, `1rem`, 1.65): Reading copy, capped around 65–75 characters and set with `text-wrap: pretty`.
- **Label** (600, `0.75rem`, normal tracking, sentence case): Metadata, compatibility details, and control context. Uppercase tracking is reserved for genuinely machine-like micro-labels, never repeated above every section.

### Named Rules

**The One Family, Many Gears Rule.** Use Geologica’s variable weight and decisive scale changes before introducing another typeface.

**The Plain Technical Language Rule.** Technical credibility comes from precise words and observable evidence, not monospace costumes or strings of uppercase metadata.

## 4. Elevation

The system is layered and ambient. Violet-black tonal shifts and fine borders establish most depth at rest; shadows are reserved for portal energy, floating navigation, image-cover atmosphere, and short interaction responses. Generic content containers stay visually grounded.

### Shadow Vocabulary

- **Brand Glow** (`0 18px 50px -12px rgba(146, 104, 255, 0.45)`): A rare amethyst halo for signature portal or launch moments.
- **Glass Ambient** (`0 28px 80px -44px rgba(146, 104, 255, 0.58), inset 0 1px 0 rgba(255, 255, 255, 0.035)`): Restricted to overlays that must visually separate from the page while retaining the violet atmosphere.
- **Interactive Lift** (`0 18px 40px -14px rgba(146, 104, 255, 0.35)`): A two-pixel hover response for an image-led interactive surface, paired with a subtle cover zoom.
- **Cover Atmosphere** (`0 1rem 2.6rem -2rem rgba(146, 104, 255, 0.5)`): A close amethyst shadow around game artwork, not around surrounding copy.

### Named Rules

**The Grounded-by-Default Rule.** Surfaces are separated by tone and one-pixel lines first. A glow or shadow must explain portal energy, hierarchy, or interaction state.

## 5. Components

Components are compact, tactile, and confidence-first. They use clear labels, minimum 44–48px targets, restrained 12–16px surfaces, and small motion responses that never obscure status or copy.

### Buttons

- **Shape:** Full pill (`999px`) for primary and secondary actions; minimum height `48px`.
- **Primary:** Signal Teal background, Port Black text, 700 weight, `0.78rem 1.35rem` padding.
- **Hover / Focus:** Brighten to 108% and lift one pixel on hover; return to rest on active. Use the global two-pixel Deep Amethyst focus ring with a two-pixel offset.
- **Secondary:** `#100D21` tonal fill, Cool White text, and a one-pixel Spectral Line border. Hover shifts the border toward 52% Deep Amethyst.

### Chips

- **Style:** Catalogue filters use a 12px radius rather than a pill, a `2.75rem` minimum height, and compact `0.55rem 0.75rem` padding. Compatibility badges use true pills because their content is a short status.
- **State:** Selected filters use a 15% Deep Amethyst tint, a 50% amethyst border, Cool White text, and a quiet inset teal keyline. Every compatibility badge repeats its meaning in text.

### Cards / Containers

- **Corner Style:** 12px for compact controls and artwork; 16px for portal and content surfaces. Larger radii are exceptional and must belong to a named signature surface.
- **Background:** Deep Violet Surface or a close violet-black literal, with real game artwork carrying visual variety.
- **Shadow Strategy:** Tonal separation at rest; Cover Atmosphere may sit directly behind artwork. Avoid applying broad shadows to generic text containers.
- **Border:** One-pixel Spectral Line or a hue-specific line when the line communicates state.
- **Internal Padding:** Usually `1rem`–`1.5rem`; cinematic portal scenes may use `clamp(1.35rem, 3vw, 2.25rem)`.

### Inputs / Fields

- **Style:** A 12px radius, one-pixel Spectral Line border, 3% white surface tint, Cool White input text, and Steel Mist placeholder text. Search fields are at least `2.75rem` tall.
- **Focus:** The global Deep Amethyst focus ring remains outside the control; do not replace it with color-only border changes.
- **Error / Disabled:** Disabled controls retain their shape and label while reducing opacity. Errors use Blocked Rose with explicit text, never the color alone.

### Navigation

The site header uses a compact brand lockup, quiet Geologica links, a teal pill download action, and a sticky violet-black backdrop on inner pages. Active links receive a tonal surface and a small teal position mark. At 40rem and below, links move into a 12–14px-radius menu with a separate backdrop, 44px rows, Escape support, and focus restoration.

### Portal Frame

The signature portal is a 16px violet-black frame with an amethyst-to-teal threshold, asymmetric radiance, fine edge highlights, and real input/output artifacts. Its motion represents a game crossing from a Steam source to a Mac-ready result; it is not a decorative gradient panel. Use `cubic-bezier(0.16, 1, 0.3, 1)` for cinematic transitions and preserve the static composition when reduced motion is requested.

## 6. Do's and Don'ts

### Do:

- **Do** lead with real game artwork, catalogue counts, compatibility labels, and launch evidence.
- **Do** keep body copy at `#9AA3B5` or brighter on the violet-black background and verify at least 4.5:1 contrast.
- **Do** use `#3FD6CE` with `#0A0816` text for the clearest primary action.
- **Do** pair every compatibility color with plain-language status text and an icon where space permits.
- **Do** use 12px controls, 16px signature surfaces, and full pills only for compact actions or statuses.
- **Do** use `cubic-bezier(0.16, 1, 0.3, 1)` for purposeful cinematic movement and provide an instant reduced-motion alternative.
- **Do** adapt the conversion path to the visitor’s device rather than presenting a desktop-only action as the mobile default.

### Don't:

- **Don't** resemble a terminal-heavy compatibility tool; keep technical detail readable and human.
- **Don't** become a generic neon gamer site; amethyst and teal are directional signals, not constant glow.
- **Don't** become an overpromising utility that hides caveats; preserve grades, limitations, and evidence near decisions.
- **Don't** use compatibility colors decoratively or rely on color alone to convey a grade.
- **Don't** add gradient-filled text, decorative grid overlays, repeated uppercase eyebrows, or numbered section scaffolding.
- **Don't** spread glass panels and broad shadows across generic cards; depth must have a structural purpose.
- **Don't** exceed a 16px card radius without a named signature reason, and never use a pill radius on a content card.
- **Don't** animate content from an invisible default or remove essential context on small screens.
