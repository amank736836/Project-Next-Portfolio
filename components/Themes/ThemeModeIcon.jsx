"use client";

import { memo } from "react";

/**
 * ThemeModeIcon — the sun/moon glyph on the theme toggler.
 *
 * Both shapes live in one SVG and cross-animate (scale + rotate + fade, with
 * twinkling stars around the moon), so a mode flip morphs the icon instead of
 * hard-cutting between two react-icons glyphs.
 *
 * `target` is the mode a click would switch to, matching the original
 * behaviour: light mode shows a moon (switch to dark), dark mode shows a sun.
 */
const ThemeModeIcon = ({ target = "dark" }) => {
  const toMoon = target === "dark";

  return (
    <svg
      className={`tt-icon ${toMoon ? "tt-icon--to-moon" : "tt-icon--to-sun"}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {/* Sun: core + 8 rays that gently flare while the button is hovered */}
      <g className="tt-icon__sun">
        <circle className="tt-icon__sun-core" cx="12" cy="12" r="4.1" />
        <g className="tt-icon__rays">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              className="tt-icon__ray"
              x1="12"
              y1="2.9"
              x2="12"
              y2="5.4"
              transform={`rotate(${angle} 12 12)`}
            />
          ))}
        </g>
      </g>

      {/* Moon: crescent + two tiny stars that twinkle in dark mode */}
      <g className="tt-icon__moon">
        <path
          className="tt-icon__moon-body"
          d="M20.2 14.6A8.6 8.6 0 0 1 9.4 3.8 7.3 7.3 0 1 0 20.2 14.6Z"
        />
        <circle className="tt-icon__star" cx="18" cy="5.6" r="0.75" />
        <circle className="tt-icon__star tt-icon__star--2" cx="20.8" cy="9.2" r="0.55" />
      </g>
    </svg>
  );
};

export default memo(ThemeModeIcon);
