'use client';

import { useEffect, useRef } from 'react';

/**
 * Scroll progress rail — a gradient bar pinned to the top of the viewport that
 * fills as the page is read, with a glowing "head" dot that appears while
 * scrolling. Uses rAF + passive listeners so it never blocks the main thread.
 */
export default function ScrollProgress() {
  const railRef = useRef(null);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let frame = null;
    let idleTimer = null;

    const update = () => {
      frame = null;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

      rail.style.setProperty('--sp-progress', progress.toFixed(4));
      rail.style.setProperty('--sp-dot', '1');

      if (idleTimer) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        rail.style.setProperty('--sp-dot', '0');
      }, 420);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      if (idleTimer) window.clearTimeout(idleTimer);
    };
  }, []);

  return (
    <div ref={railRef} className="sp" aria-hidden="true">
      <div className="sp__bar" />
      <span className="sp__pulse" />
    </div>
  );
}
