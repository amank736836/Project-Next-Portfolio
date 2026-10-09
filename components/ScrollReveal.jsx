"use client";

import { useEffect } from "react";

const REVEAL_SELECTOR = [
  ".reveal",
  ".reveal-left",
  ".reveal-right",
  ".reveal-scale",
  ".reveal-blur",
  ".reveal-mask",
  ".reveal-flip",
  ".reveal-zoom",
  ".reveal-stagger",
  // Admin variant (its keyframes end at `transform: none` so a filled
  // animation never leaves a containing block behind inside the tool).
  ".admin-reveal",
  ".section__title",
].join(", ");

const ACTIVE_CLASSES = [
  "active",
  "reveal-blur",
  "reveal-mask",
  "reveal-flip",
  "reveal-zoom",
  "reveal-stagger",
];

/**
 * Scroll reveal engine.
 *
 * - Adds `motion-ready` to <html> so the CSS only hides elements once JS can
 *   re-show them (progressive enhancement for crawlers / script failures).
 * - Observes both the base `.reveal*` variants and the newer motion variants.
 * - Re-scans for nodes added later (filtered project grids, async content).
 * - Applies a stagger index to `.reveal-stagger` children.
 */
export default function ScrollReveal({ enabled = true }) {
  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealAll = () => {
      document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
        el.classList.add("active");
        ACTIVE_CLASSES.forEach((cls) => el.classList.add(cls));
      });
    };

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      revealAll();
      return;
    }

    root.classList.add("motion-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.classList.add("active");

          // Optional per-element delay: <div class="reveal" data-reveal-delay="120">
          const delay = el.getAttribute("data-reveal-delay");
          if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);

          observer.unobserve(el);
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const scan = (scope = document) => {
      scope.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
        if (el.dataset.revealBound === "true") return;
        el.dataset.revealBound = "true";
        observer.observe(el);
      });
    };

    scan();

    // Watch for nodes inserted later (client-side filtering, data fetches).
    const mutationObserver = new MutationObserver((mutations) => {
      let shouldScan = false;
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) shouldScan = true;
      });
      if (shouldScan) window.requestAnimationFrame(() => scan());
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      root.classList.remove("motion-ready");
    };
  }, [enabled]);

  return null;
}
