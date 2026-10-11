'use client';

import { useCallback, useRef } from 'react';

/**
 * 3D tilt surface with a pointer-tracked glare.
 *
 * Wraps any block-level content. Disabled for coarse pointers and for visitors
 * who prefer reduced motion, in which case it renders a plain wrapper.
 */
export default function TiltCard({
  children,
  className = '',
  max = 8,
  scale = 1.015,
  glare = true,
  as: Tag = 'div',
  ...rest
}) {
  const ref = useRef(null);
  const rafRef = useRef(0);

  const applyTilt = useCallback(
    (clientX, clientY) => {
      const node = ref.current;
      if (!node) return;
      const bounds = node.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      // Clamp to 0..1 so fast pointer moves, scroll, pen or touch slipping
      // outside the card can never produce extreme rotate angles.
      const clamp01 = (v) => Math.min(1, Math.max(0, v));
      const x = clamp01((clientX - bounds.left) / bounds.width);
      const y = clamp01((clientY - bounds.top) / bounds.height);

      node.style.setProperty('--tilt-y', `${(x - 0.5) * max * 2}deg`);
      node.style.setProperty('--tilt-x', `${(0.5 - y) * max * 2}deg`);
      node.style.setProperty('--tilt-mx', `${x * 100}%`);
      node.style.setProperty('--tilt-my', `${y * 100}%`);
      node.style.setProperty('--card-x', `${x * 100}%`);
      node.style.setProperty('--card-y', `${y * 100}%`);
      node.style.setProperty('--tile-x', `${x * 100}%`);
      node.style.setProperty('--tile-y', `${y * 100}%`);
    },
    [max]
  );

  const handleMove = useCallback(
    (event) => {
      if (event.pointerType === 'touch') return;
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches) return;
      const { clientX, clientY } = event;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => applyTilt(clientX, clientY));
    },
    [applyTilt]
  );

  const handleLeave = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    node.style.setProperty('--tilt-x', '0deg');
    node.style.setProperty('--tilt-y', '0deg');
  }, []);

  return (
    <Tag
      ref={ref}
      className={`tilt ${className}`}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onPointerCancel={handleLeave}
      onBlur={handleLeave}
      style={{ '--tilt-scale': scale }}
      {...rest}
    >
      {children}
      {glare ? <span className="tilt__glare" aria-hidden="true" /> : null}
    </Tag>
  );
}
