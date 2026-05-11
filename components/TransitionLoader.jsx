"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

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
    <div className={`transition-overlay ${loading ? "active" : "exit"}`}>
      <div className="loader-content">
        <div className="cyber-circle"></div>
        <div className="cyber-scanner"></div>
        <div className="loader-text">INITIALIZING...</div>
        <div className="loader-bar">
          <div className="loader-progress"></div>
        </div>
      </div>
      
      <style jsx>{`
        .transition-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(10, 10, 15, 0.9);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.5s ease;
          pointer-events: none;
          opacity: 0;
        }

        .transition-overlay.active {
          opacity: 1;
          pointer-events: all;
        }

        .transition-overlay.exit {
          opacity: 0;
        }

        .loader-content {
          text-align: center;
          position: relative;
        }

        .cyber-circle {
          width: 120px;
          height: 120px;
          border: 2px solid rgba(108, 99, 255, 0.2);
          border-top: 2px solid #6c63ff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 30px;
          box-shadow: 0 0 20px rgba(108, 99, 255, 0.2);
        }

        .cyber-scanner {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 140px;
          height: 140px;
          border: 1px solid rgba(108, 99, 255, 0.1);
          border-radius: 50%;
        }

        .cyber-scanner::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(transparent, rgba(108, 99, 255, 0.4), transparent);
          animation: scan 2s ease-in-out infinite;
          border-radius: 50%;
        }

        .loader-text {
          color: #6c63ff;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          letter-spacing: 4px;
          margin-bottom: 20px;
          text-shadow: 0 0 10px rgba(108, 99, 255, 0.5);
          animation: pulse 1.5s infinite;
        }

        .loader-bar {
          width: 200px;
          height: 2px;
          background: var(--glass-edge, rgba(255, 255, 255, 0.05));
          border-radius: 2px;
          overflow: hidden;
          margin: 0 auto;
        }

        .loader-progress {
          width: 100%;
          height: 100%;
          background: #6c63ff;
          animation: progress 1s ease-in-out forwards;
          transform-origin: left;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes scan {
          0%, 100% { transform: translateY(-50%) scaleY(0.1); opacity: 0; }
          50% { transform: translateY(0%) scaleY(1); opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
};

export default TransitionLoader;
