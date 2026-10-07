'use client';

import { useCallback, useRef } from 'react';

/**
 * Magnetic hover — the child gently follows the pointer while it is inside the
 * element's bounds, then springs back. A classic microinteraction (SVGator #12).
 */
export default function Magnetic({ children, className = '', strength = 0.28, as: Tag = 'span', ...rest }) {
  const ref = useRef(null);

  const handleMove = useCallback(
    (event) => {
      const node = ref.current;
      if (!node) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches) return;

      const bounds = node.getBoundingClientRect();
      const offsetX = (event.clientX - (bounds.left + bounds.width / 2)) * strength;
      const offsetY = (event.clientY - (bounds.top + bounds.height / 2)) * strength;

      node.style.transform = `translate3d(${offsetX.toFixed(2)}px, ${offsetY.toFixed(2)}px, 0)`;
    },
    [strength]
  );

  const handleLeave = useCallback(() => {
    const node = ref.current;
    if (!node) return;
    node.style.transform = 'translate3d(0, 0, 0)';
  }, []);

  return (
    <Tag
      ref={ref}
      className={`magnetic ${className}`}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onBlur={handleLeave}
      {...rest}
    >
      {children}
    </Tag>
  );
}
