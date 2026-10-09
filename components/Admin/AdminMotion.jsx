'use client';

import { useEffect } from 'react';

/**
 * Admin pointer spotlight.
 *
 * Elements marked `data-spotlight` get a soft accent glow that follows the
 * cursor (the CSS lives in admin.css and paints it behind the card's content).
 * Delegated from the document so it also covers cards mounted later, and it
 * does nothing at all when the user prefers reduced motion.
 */
export default function AdminMotion() {
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) return;

    let current = null;

    const stop = () => {
      if (!current) return;
      current.classList.remove('is-spotlit');
      current = null;
    };

    const onMove = (event) => {
      const target = event.target instanceof Element ? event.target.closest('[data-spotlight]') : null;

      if (target !== current) {
        stop();
        current = target;
      }

      if (!current) return;

      const rect = current.getBoundingClientRect();
      current.style.setProperty('--spot-x', `${Math.round(event.clientX - rect.left)}px`);
      current.style.setProperty('--spot-y', `${Math.round(event.clientY - rect.top)}px`);
      current.classList.add('is-spotlit');
    };

    // Coarse pointers never fire a useful pointermove; skip the listeners.
    const coarseQuery = window.matchMedia('(hover: none)');
    if (coarseQuery.matches) return;

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerdown', stop, { passive: true });

    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerdown', stop);
    };
  }, []);

  return null;
}
