'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Section heading with a self-drawing underline (SVG line animation), a small
 * uppercase eyebrow and an optional gradient highlight word.
 *
 * Usage: <SectionHeading title="My" highlight="Skills" eyebrow="What I do" />
 */
export default function SectionHeading({
  title = '',
  highlight = '',
  eyebrow = '',
  id,
  className = '',
  align = 'center',
}) {
  const ref = useRef(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setDrawn(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setDrawn(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`sh ${drawn ? 'is-drawn' : ''} ${align === 'start' ? 'sh--start' : ''} ${className}`}
      style={align === 'start' ? { alignItems: 'flex-start', textAlign: 'left' } : undefined}
    >
      {eyebrow ? <span className="sh__eyebrow">{eyebrow}</span> : null}

      <h2 id={id} className="sh__title">
        {title} {highlight ? <span>{highlight}</span> : null}
      </h2>

      <svg className="sh__rule" viewBox="0 0 220 12" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="mx-rule-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="35%" stopColor="currentColor" />
            <stop offset="65%" stopColor="currentColor" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path d="M4 8 C 60 1, 160 1, 216 8" />
        <path d="M40 11 C 90 6, 130 6, 180 11" opacity="0.45" />
        <circle cx="110" cy="4.5" r="3.2" />
      </svg>
    </div>
  );
}
