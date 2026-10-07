'use client';

import { useEffect, useRef } from 'react';

/**
 * Ambient background motion — three drifting gradient orbs, a slowly panning
 * grid, film grain and a soft spotlight that follows the pointer.
 * Purely decorative: fixed, `pointer-events: none`, honours reduced motion.
 */
export default function AuroraBackground() {
  const layerRef = useRef(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(pointer: fine)');

    if (motionQuery.matches || !pointerQuery.matches) return;

    let frame = null;

    const move = (event) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        layer.style.setProperty('--amb-x', `${event.clientX}px`);
        layer.style.setProperty('--amb-y', `${event.clientY}px`);
        layer.classList.add('is-live');
      });
    };

    const leave = () => layer.classList.remove('is-live');

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerleave', leave);

    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerleave', leave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={layerRef} className="amb" aria-hidden="true">
      <span className="amb__orb amb__orb--a" />
      <span className="amb__orb amb__orb--b" />
      <span className="amb__orb amb__orb--c" />
      <span className="amb__grid" />
      <span className="amb__spotlight" />
      <span className="amb__noise" />
    </div>
  );
}
