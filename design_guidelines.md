# Design Guidelines - Landing Page

## Design Approach
**Reference-Based + Modern Landing Page Best Practices**
- Primary inspiration: Stripe's clean sophistication + Linear's bold typography + Vercel's technical elegance
- Focus: Professional, conversion-optimized landing page with visual impact
- Principle: Clarity over complexity, impact through strategic restraint

## Typography Hierarchy
**Font Stack:**
- Primary: Inter (headings, body) - via Google Fonts CDN
- Accent: Space Grotesk (hero headline only)

**Scale:**
- Hero: text-6xl/text-7xl (bold, tracking-tight)
- Section Headers: text-4xl/text-5xl (semibold)
- Subheadings: text-xl/text-2xl (medium)
- Body: text-base/text-lg
- Small: text-sm

## Layout System
**Spacing Primitives:** Use Tailwind units of 4, 8, 12, 16, 20, 24, 32
- Section padding: py-16 md:py-24 lg:py-32
- Component gaps: gap-8 to gap-12
- Container: max-w-7xl mx-auto px-6

**Grid Strategy:**
- Hero: Full-width asymmetric (60/40 text-image split)
- Features: 3-column grid on desktop (grid-cols-1 md:grid-cols-3)
- Benefits: 2-column alternating layout
- Testimonials: 2-column cards
- CTA: Centered single column max-w-4xl

## Component Library

**Navigation:**
- Transparent header, sticky on scroll
- Logo left, CTA button right
- Simple horizontal menu (desktop), hamburger (mobile)

**Hero Section:**
- Large headline with gradient accent on key words
- Concise subheadline (max-w-2xl)
- Primary + Secondary CTA buttons (gap-4)
- Hero image: Modern product screenshot or abstract illustration (right side)
- Buttons on images: backdrop-blur-md bg-white/20

**Feature Cards:**
- Icon (Heroicons) + Title + Short description
- Subtle border (border border-gray-200/50)
- Hover: subtle lift (hover:-translate-y-1 transition-transform)

**Social Proof:**
- Customer logos grid (grayscale with hover color)
- Stats counter section (large numbers, small labels)
- Testimonial cards with avatar + name + role

**CTA Sections:**
- Bold headline + supporting text + large button
- Full-width with subtle background treatment

**Footer:**
- 4-column layout (Product, Company, Resources, Legal)
- Newsletter signup in separate section above
- Social icons + copyright

## Images

**Required Images:**
1. **Hero Image** (right side, 60% viewport width on desktop)
   - Modern SaaS dashboard screenshot or abstract tech illustration
   - Should have depth/perspective
   - Clean, professional, high-contrast

2. **Feature Icons** (via Heroicons CDN)
   - Use outline style, 24x24 or 32x32
   - Consistent stroke width

3. **Customer Logos** (5-8 logos)
   - Brand logos in social proof section
   - Display in grayscale, color on hover

4. **Testimonial Avatars** (3-4 circular images)
   - Professional headshots
   - 48x48 or 64x64

## Page Structure (7 Sections)
1. Hero (100vh with image)
2. Social Proof / Logo Bar (py-16)
3. Features Grid (py-24)
4. Benefits Alternating (py-24)
5. Testimonials (py-24)
6. Stats/Metrics (py-16, full-width background)
7. Final CTA (py-32)
8. Footer (py-12)

## Interactions
**Minimal Animations:**
- Smooth scroll behavior
- Fade-in on scroll for section headers only
- Button hover states (built-in Tailwind)
- Card hover lift
- NO complex scroll-triggered animations

## Accessibility
- Semantic HTML throughout
- ARIA labels on interactive elements
- Focus states visible (ring-2 ring-offset-2)
- Contrast ratio minimum 4.5:1