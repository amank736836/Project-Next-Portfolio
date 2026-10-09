'use client';

import { useEffect, useRef } from 'react';

/**
 * Custom cursor FX — a solid dot tracked 1:1 and a dashed ring that eases
 * behind it, expanding over interactive elements. Fine pointers only; the
 * native cursor stays visible underneath so the UI is never unusable.
 */
export default function CursorGlow() {
  const glowRef = useRef(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(pointer: fine)');
    if (motionQuery.matches || !pointerQuery.matches) return;

    const dot = glow.querySelector('.cg__dot');
    const ring = glow.querySelector('.cg__ring');
    if (!dot || !ring) return;

    let target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let ringPos = { ...target };
    let frame = null;
    let visible = false;

    const render = () => {
      ringPos.x += (target.x - ringPos.x) * 0.16;
      ringPos.y += (target.y - ringPos.y) * 0.16;

      dot.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;

      frame = window.requestAnimationFrame(render);
    };

    const onMove = (event) => {
      target = { x: event.clientX, y: event.clientY };
      if (!visible) {
        visible = true;
        glow.style.opacity = '1';
        ringPos = { ...target };
      }
      const interactive = event.target?.closest?.('a, button, [role="button"], input, textarea, select, .portfolio__item, .skills__item');
      glow.classList.toggle('is-active', Boolean(interactive));
    };

    const onLeave = () => {
      visible = false;
      glow.style.opacity = '0';
    };

    glow.style.opacity = '0';
    frame = window.requestAnimationFrame(render);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={glowRef} className="cg" aria-hidden="true">
      <span className="cg__ring" />
      <span className="cg__dot" />
    </div>
  );
}
