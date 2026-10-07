"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Route loader — a short, centred morphing blob with a progress run.
 * Pairs with the PageTransition curtain: the curtain handles the wipe, this
 * handles the "something is loading" feedback on slower navigations.
 */
const TransitionLoader = () => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Show loader when pathname changes
    const enterTimer = setTimeout(() => {
      setShouldRender(true);
      setLoading(true);
    }, 0);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    // Wait for exit animation to finish
    const exitTimer = setTimeout(() => {
      setShouldRender(false);
    }, 1000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(timer);
      clearTimeout(exitTimer);
    };
  }, [pathname]);

  if (!shouldRender) return null;

  return (
    <div className={`transition-overlay ${loading ? "active" : "exit"}`} aria-hidden="true">
      <div className="loader-content">
        <div className="loader-blob">
          <span className="loader-blob__ring" />
          <span className="loader-blob__core" />
        </div>
        <div className="loader-text">Loading</div>
        <div className="loader-bar">
          <div className="loader-progress"></div>
        </div>
      </div>

      <style jsx>{`
        .transition-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(60% 60% at 50% 50%, rgba(108, 99, 255, 0.16), transparent 70%),
            color-mix(in srgb, var(--body-color) 78%, transparent);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: opacity 0.45s ease, backdrop-filter 0.45s ease;
          pointer-events: none;
          opacity: 0;
        }

        .transition-overlay.active {
          opacity: 1;
        }

        .transition-overlay.exit {
          opacity: 0;
        }

        .loader-content {
          text-align: center;
          position: relative;
        }

        .loader-blob {
          position: relative;
          width: 96px;
          height: 96px;
          margin: 0 auto 24px;
          display: grid;
          place-items: center;
        }

        .loader-blob__ring {
          position: absolute;
          inset: 0;
          border-radius: 42% 58% 62% 38% / 46% 42% 58% 54%;
          border: 2px solid var(--first-color);
          opacity: 0.55;
          animation: blobMorph 3.4s ease-in-out infinite, spin 6s linear infinite;
        }

        .loader-blob__core {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #fff, var(--first-color) 60%, #8b5cf6);
          box-shadow: 0 0 26px 6px rgba(108, 99, 255, 0.45);
          animation: corePulse 1.6s ease-in-out infinite;
        }

        .loader-text {
          color: var(--first-color);
          font-family: var(--body-font);
          font-size: 0.72rem;
          letter-spacing: 0.42em;
          text-transform: uppercase;
          margin-bottom: 18px;
          animation: pulse 1.6s infinite;
        }

        .loader-bar {
          width: 190px;
          height: 3px;
          border-radius: 3px;
          background: color-mix(in srgb, var(--title-color) 12%, transparent);
          overflow: hidden;
          margin: 0 auto;
        }

        .loader-progress {
          width: 100%;
          height: 100%;
          border-radius: 3px;
          background: linear-gradient(90deg, var(--first-color), #22d3ee, #8b5cf6);
          animation: progress 0.95s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: left;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes blobMorph {
          0%, 100% { border-radius: 42% 58% 62% 38% / 46% 42% 58% 54%; transform: scale(1); }
          50% { border-radius: 62% 38% 40% 60% / 58% 62% 38% 42%; transform: scale(1.08); }
        }

        @keyframes corePulse {
          0%, 100% { transform: scale(0.9); opacity: 0.85; }
          50% { transform: scale(1.12); opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }

        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .loader-blob__ring,
          .loader-blob__core,
          .loader-text,
          .loader-progress {
            animation: none;
          }
          .loader-progress { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
};

export default TransitionLoader;
