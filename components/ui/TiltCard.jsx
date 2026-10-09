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

  const handleMove = useCallback(
    (event) => {
      const node = ref.current;
      if (!node) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches) return;

      const bounds = node.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;

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

  const handleLeave = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty('--tilt-x', '0deg');
    node.style.setProperty('--tilt-y', '0deg');
  }, []);

  return (
    <Tag
      ref={ref}
      className={`tilt ${className}`}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ '--tilt-scale': scale }}
      {...rest}
    >
      {children}
      {glare ? <span className="tilt__glare" aria-hidden="true" /> : null}
    </Tag>
  );
}
