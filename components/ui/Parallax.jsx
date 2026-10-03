'use client';

import { useEffect, useRef } from 'react';

/**
 * Scroll parallax (scrollytelling).
 *
 * Shifts its children as the element travels through the viewport. Only ticks
 * while the element is on screen, and does nothing when motion is reduced.
 */
export default function Parallax({
  children,
  speed = 0.12,
  axis = 'y',
  className = '',
  as: Tag = 'div',
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = null;
    let visible = false;

    const apply = () => {
      frame = null;
      const bounds = node.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      // -1 (below the fold) → 1 (above the fold)
      const progress = (bounds.top + bounds.height / 2 - viewport / 2) / viewport;
      const offset = (-progress * speed * 100).toFixed(2);
      node.style.setProperty('--px', axis === 'x' ? '0px' : `${offset}px`);
      node.style.setProperty('--py', axis === 'x' ? `${offset}px` : '0px');
    };

    const onScroll = () => {
      if (!visible || frame) return;
      frame = window.requestAnimationFrame(apply);
    };

    let observer;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            visible = entry.isIntersecting;
            if (visible) onScroll();
          });
        },
        { rootMargin: '120px 0px' }
      );
      observer.observe(node);
    } else {
      visible = true;
    }

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      observer?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [speed, axis]);

  return (
    <Tag
      ref={ref}
      className={`parallax ${className}`}
      style={{ transform: 'translate3d(var(--px, 0px), var(--py, 0px), 0)' }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
