'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Count-up number — animates from 0 (or `from`) to `value` the first time it
 * scrolls into view. Falls back to the final value when motion is reduced.
 */
export default function CountUp({
  value = 0,
  from = 0,
  duration = 1400,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(from);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches || typeof IntersectionObserver === 'undefined') {
      setDisplay(value);
      return;
    }

    let frame = null;
    let start = null;

    const tick = (timestamp) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(1, elapsed / duration);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(from + (value - from) * eased);
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            frame = window.requestAnimationFrame(tick);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [value, from, duration]);

  const formatted = Number(display).toFixed(decimals);

  return (
    <span ref={ref} className={`cu ${className}`}>
      {prefix}
      {formatted}
      {suffix ? <span className="cu__suffix">{suffix}</span> : null}
    </span>
  );
}
