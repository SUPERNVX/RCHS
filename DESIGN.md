---
name: Orange & Ivory
colors:
  surface: '#f9f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f9f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f5'
  surface-container: '#eeeef0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e4'
  on-surface: '#1a1c1d'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3132'
  inverse-on-surface: '#f0f0f2'
  outline: '#747878'
  outline-variant: '#c4c7c8'
  surface-tint: '#5d5f5f'
  primary: '#5d5f5f'
  on-primary: '#ffffff'
  primary-container: '#ffffff'
  on-primary-container: '#747676'
  inverse-primary: '#c6c6c7'
  secondary: '#a04100'
  on-secondary: '#ffffff'
  secondary-container: '#fe6b00'
  on-secondary-container: '#572000'
  tertiary: '#5e5e5e'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffffff'
  on-tertiary-container: '#767676'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#ffdbcc'
  secondary-fixed-dim: '#ffb693'
  on-secondary-fixed: '#351000'
  on-secondary-fixed-variant: '#7a3000'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#f9f9fb'
  on-background: '#1a1c1d'
  surface-variant: '#e2e2e4'
typography:
  display:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  section-gap: 120px
  grid-gutter: 24px
  container-max: 1200px
  margin-mobile: 20px
---

## Brand & Style

The design system is engineered to elevate high school spirit wear into the realm of premium lifestyle apparel. By adopting a **Minimalist / Apple-inspired** aesthetic, the UI shifts the focus away from cluttered e-commerce patterns and onto the product as an object of design.

The target audience consists of students, alumni, and parents who value quality and modern aesthetics. The emotional response should be one of "Affordable Luxury"—feeling prestigious yet accessible. The interface relies on expansive white space, precise alignment, and high-quality photography to communicate a sophisticated school identity.

## Colors

The palette follows a strict **60-30-10 rule** to maintain visual balance and premium feel:

*   **Primary (60%):** `#FFFFFF` (White) and `#F5F5F7` (Off-white). This serves as the canvas, providing the "Apple-esque" clean backdrop that allows product colors to pop.
*   **Secondary (30%):** `#FF6B00` (Tiger Orange). A vibrant, energetic orange used for calls to action, brand highlights, and active states. It represents the school spirit without overwhelming the minimalist foundation.
*   **Accent (10%):** `#000000` (Black). Reserved for high-contrast typography, icons, and structural lines to provide grounding and readability.

## Typography

The typography uses **Inter**, a systematic sans-serif that excels in clarity and modernism. 

*   **Headlines:** Use tight letter-spacing and bold weights to create a "locked-in" editorial look. Large display sizes are intended for product hero sections.
*   **Body Text:** Set with generous line height to ensure maximum readability against the white background.
*   **Labels:** Small caps and increased letter spacing are used for secondary information like product categories or "Coming Soon" badges to maintain a sophisticated hierarchy.

## Layout & Spacing

This design system utilizes a **Fixed Grid** model for desktop to ensure product imagery remains consistent and high-impact.

*   **Grid:** A 12-column system with 24px gutters.
*   **Desktop:** Content is centered in a 1200px container. Section vertical spacing is aggressive (120px) to reinforce the minimalist aesthetic and give elements "room to breathe."
*   **Mobile:** Switches to a 4-column fluid grid with 20px side margins.
*   **Imagery:** Product photos should occupy at least 50% of the viewport width in hero sections, using a 4:5 aspect ratio for a fashion-forward look.

## Elevation & Depth

To maintain the "flat" and "clean" Apple-inspired look, this design system avoids heavy drop shadows.

*   **Layering:** Depth is achieved through **Tonal Layers**. Elements like product cards sit on a `#F5F5F7` background with a white fill to create subtle separation.
*   **Low-contrast Outlines:** For interactive elements like input fields or secondary buttons, use a 1px solid border in a light grey (`#E5E5E7`) instead of a shadow.
*   **Active States:** When an element is lifted (e.g., hovering over a t-shirt card), use a very soft, diffused ambient shadow: `0 10px 30px rgba(0,0,0,0.04)`.

## Shapes

The shape language is **Rounded**, reflecting the soft yet precise industrial design of modern hardware. 

*   Standard components (Buttons, Inputs) use a **0.5rem (8px)** corner radius.
*   Product cards and large containers use **1rem (16px)** to feel approachable and premium.
*   Avoid sharp 0px corners, as they appear too aggressive for a lifestyle brand.

## Components

*   **Buttons:** The Primary button is solid `#FF6B00` with white text. No gradients. Secondary buttons are `#000000` outlines with black text.
*   **Input Fields:** Minimalist design with only a bottom border or a very light 4-sided border in `#E5E5E7`. Focus state shifts the border color to `#FF6B00`.
*   **Product Cards:** Borderless. The image should be the hero, with typography (Product Name, Price) left-aligned underneath in `body-md` and `body-lg`.
*   **Navigation:** A "Ghost" header. It should be transparent on scroll-up and blur the background (glassmorphism) when scrolling down, using a white tint.
*   **Chips/Size Selectors:** Simple circles or rounded rectangles. The "Selected" state is a thick `#000000` border, avoiding the use of color for size selection to keep the UI clean.
*   **Shopping Cart:** A slide-out "drawer" from the right, maintaining the white/minimalist theme with high-contrast black text for totals.