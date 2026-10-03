'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Route transition — a circular curtain wipe plus a thin progress run when the
 * visitor navigates between pages. Renders its own overlay so it never affects
 * layout, and skips entirely when the user prefers reduced motion.
 */
export default function PageTransition({ children }) {
  const pathname = usePathname();
  const [phase, setPhase] = useState('idle');
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) return;

    setPhase('in');
    const outTimer = window.setTimeout(() => setPhase('out'), 520);
    const idleTimer = window.setTimeout(() => setPhase('idle'), 1200);

    return () => {
      window.clearTimeout(outTimer);
      window.clearTimeout(idleTimer);
    };
  }, [pathname]);

  return (
    <>
      <div key={`curtain-${pathname}`} className={`pt-curtain ${phase === 'in' ? 'is-in' : phase === 'out' ? 'is-out' : ''}`} aria-hidden="true" />
      <div key={`bar-${pathname}`} className={`pt-bar ${phase === 'in' ? 'is-in' : ''}`} aria-hidden="true" />
      <div key={`content-${pathname}`} className={phase === 'in' ? 'pt-content is-entering' : 'pt-content'}>
        {children}
      </div>
    </>
  );
}
