# FEAT-027 — Motion UI (kinetic typography, ambient, micro-interactions)

```text
Feature:        FEAT-027 — Motion UI
Purpose:        Provide a polished visual experience with ambient backgrounds,
                kinetic typography, self-drawing lines, scroll feedback, hover
                surfaces, micro-interactions, route transitions, and a UI
                playground for visual review.
User:           Public visitor and admin.
Entry Point:    GET /test-ui (visual playground); every public page consumes
                the primitives.
Dependencies:   app/motion.css, components/ui/* primitives.
Inputs:         None (driven by user interaction + prefers-reduced-motion).
Outputs:        Visual effects.
Business Rules: BR-015 (reduced motion).
Expected Behavior:
  - AuroraBackground, SplitText, TiltCard, Magnetic, CountUp, Marquee,
    ScrollProgress, CursorGlow, PageTransition, Parallax, SectionHeading
    all render without runtime errors.
  - All animations are disabled when prefers-reduced-motion: reduce or
    <html class="no-motion">.
  - /test-ui shows each primitive in isolation.
Error Handling: Components are pure (no error path).
Permissions:    None.
Related APIs:   None.
Related Database Tables: None.
Related UI:     components/ui/*
Existing Tests: None.
Missing Tests:
  - Reduced-motion CSS rules
  - /test-ui returns 200
Known Issues:   None.
```
