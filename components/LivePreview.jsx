"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Live project preview with graceful degradation.
 *
 * Renders the deployed project inside a sandboxed iframe on top of the static
 * screenshot. The screenshot stays visible until the frame reports `load`, then
 * the live site fades in — even on slow mobile connections the frame stays
 * mounted and appears whenever it is ready (no give-up timer).
 *
 * - The iframe is only mounted once the surface nears the viewport so a grid of
 *   project cards doesn't boot every live site at once.
 * - `interactive` is off for grid cards (the card owns hover + click) and on
 *   inside the details modal where the visitor can actually use the site.
 */
const PREVIEW_SANDBOX = [
  "allow-forms",
  "allow-modals",
  "allow-popups",
  "allow-presentation",
  "allow-same-origin",
  "allow-scripts",
].join(" ");
const PREVIEW_ALLOW = "clipboard-read; clipboard-write; fullscreen; accelerometer; gyroscope";

export default function LivePreview({
  liveUrl,
  img,
  title = "Project",
  interactive = false,
  sizes = "(max-width: 640px) 92vw, (max-width: 1024px) 48vw, 500px",
  quality = 80,
  className = "",
}) {
  const wrapperRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | ready | failed

  // Defer mounting the iframe until the surface is near the viewport.
  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // No give-up timer: on slow connections (mobile data, cold starts) the frame
  // is kept mounted and simply fades in whenever `load` finally fires. The
  // screenshot underlay covers the whole waiting period. Only a genuine load
  // error falls back permanently.
  const canShowFrame = Boolean(liveUrl) && inView && status !== "failed";

  return (
    <div ref={wrapperRef} className={`live-preview${className ? ` ${className}` : ""}`.trim()}>
      {img && (
        <Image
          src={img}
          alt={`${title} screenshot`}
          className="portfolio__img live-preview__img"
          fill
          loading="lazy"
          sizes={sizes}
          quality={quality}
        />
      )}

      {canShowFrame && (
        <iframe
          src={liveUrl}
          title={`${title} live preview`}
          className={[
            "live-preview__frame",
            status === "ready" ? "is-ready" : "",
            interactive ? "is-interactive" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          loading="lazy"
          sandbox={PREVIEW_SANDBOX}
          allow={PREVIEW_ALLOW}
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setStatus((current) => (current === "failed" ? current : "ready"))}
          onError={() => setStatus("failed")}
        />
      )}

      {liveUrl && status !== "failed" && (
        <span className="live-preview__badge" aria-hidden="true">
          <span className="live-preview__dot" />
          Live
        </span>
      )}
    </div>
  );
}
