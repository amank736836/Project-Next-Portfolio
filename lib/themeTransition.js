/**
 * Theme transition engine — animated light/dark (and accent) switches.
 *
 * `runThemeTransition` wraps a theme DOM mutation in a circular "reveal wipe"
 * that expands from the control the user clicked (View Transitions API where
 * available, an overlay-veil fallback elsewhere), so flipping the mode feels
 * like a designed moment instead of a flash of unstyled repaint.
 *
 * Both paths respect `prefers-reduced-motion` and the `html.no-motion`
 * opt-out: with either set, the change is applied instantly.
 *
 * Usage:
 *   runThemeTransition(() => {
 *     applyThemeMode('dark-theme');          // direct DOM truth for the snapshot
 *     localStorage.setItem('theme', 'dark-theme');
 *   }, event.currentTarget, { incomingClass: 'dark-theme' });
 */

const VEIL_EXPAND_MS = 560;
const VEIL_FADE_MS = 320;
const RING_MS = 700;

/** Monotonic token so overlapping wipes don't clobber each other's state. */
let wipeToken = 0;

/** True when the visitor asked for less motion (OS setting or html.no-motion). */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return true;
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.classList.contains('no-motion')
  );
}

/**
 * Swap the theme class on <html> without touching the font-variable classes
 * that next/font sets there (plain `className =` would wipe them).
 */
export function applyThemeMode(mode) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('light-theme', 'dark-theme');
  root.classList.add(mode);
}

/** Center point of the control that triggered the change. */
function originFrom(originEl) {
  if (originEl && typeof originEl.getBoundingClientRect === 'function') {
    const rect = originEl.getBoundingClientRect();
    if (rect.width || rect.height) {
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }
  }
  // Fallback: top-right corner, where the style-switcher lives.
  return { x: (typeof window !== 'undefined' ? window.innerWidth : 1280) - 56, y: 56 };
}

/** Distance from (x, y) to the farthest viewport corner + a small overshoot. */
function radiusFrom(x, y) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const corners = [
    [0, 0],
    [w, 0],
    [0, h],
    [w, h],
  ];
  let max = 0;
  for (const [cx, cy] of corners) {
    const d = Math.hypot(cx - x, cy - y);
    if (d > max) max = d;
  }
  return Math.ceil(max) + 24;
}

/**
 * Resolve a custom property as a given theme class would compute it. The
 * `.light-theme` / `.dark-theme` blocks re-declare `--body-color` etc., so a
 * throwaway probe carrying the class can read the incoming palette before the
 * swap happens (used to tint the fallback veil).
 */
function themeVarFor(modeClass, varName) {
  const probe = document.createElement('div');
  probe.className = modeClass || '';
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;top:-9999px';
  document.body.appendChild(probe);
  const value = getComputedStyle(probe).getPropertyValue(varName).trim();
  probe.remove();
  return value || getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

/**
 * Expanding ring pulse at the origin — small "energy" feedback for toggles
 * and swatch clicks. Purely decorative; safe to call on its own.
 */
export function burstRing(originEl, { scale = 8 } = {}) {
  if (typeof document === 'undefined' || prefersReducedMotion()) return;
  const { x, y } = originFrom(originEl);
  const ring = document.createElement('div');
  ring.className = 'mx-tt-ring';
  ring.style.left = `${x}px`;
  ring.style.top = `${y}px`;
  ring.style.setProperty('--mx-tt-scale', String(scale));
  document.body.appendChild(ring);
  const cleanup = () => ring.remove();
  ring.addEventListener('animationend', cleanup, { once: true });
  // Safety net in case animationend never fires (tab backgrounded, etc.).
  window.setTimeout(cleanup, RING_MS + 500);
}

/**
 * Fallback for browsers without the View Transitions API: a veil filled with
 * the incoming body color expands from the control, the swap happens under
 * cover, then the veil fades away to reveal the new palette.
 */
function veilWipe(mutate, x, y, radius, incomingClass) {
  return new Promise((resolve) => {
    const veil = document.createElement('div');
    veil.className = 'mx-tt-veil';
    veil.style.setProperty('--tt-x', `${x}px`);
    veil.style.setProperty('--tt-y', `${y}px`);
    veil.style.setProperty('--tt-r', `${radius}px`);
    veil.style.backgroundColor = themeVarFor(incomingClass, '--body-color') || 'var(--body-color)';
    document.body.appendChild(veil);

    // Next frame: expand the circle from the origin.
    requestAnimationFrame(() => veil.classList.add('is-open'));

    window.setTimeout(() => {
      mutate();
      veil.classList.add('is-fade');
      window.setTimeout(() => {
        veil.remove();
        resolve();
      }, VEIL_FADE_MS + 40);
    }, Math.round(VEIL_EXPAND_MS * 0.72));
  });
}

/**
 * Run `mutate` (the theme DOM update) behind a circular reveal that expands
 * from `originEl`.
 *
 * @param {() => void} mutate           Synchronous DOM update to animate.
 * @param {Element}   [originEl]        Control to expand the wipe from.
 * @param {{ incomingClass?: string }} [options]
 *        `incomingClass` ('light-theme' | 'dark-theme') lets the fallback
 *        veil use the right incoming palette; optional.
 * @returns {Promise<void>} Resolves once the transition has fully played out.
 */
export async function runThemeTransition(mutate, originEl, options = {}) {
  if (typeof document === 'undefined') {
    mutate();
    return;
  }

  if (prefersReducedMotion()) {
    mutate();
    return;
  }

  const { x, y } = originFrom(originEl);
  const radius = radiusFrom(x, y);
  const root = document.documentElement;

  // Share the geometry with the CSS keyframes (view transition + veil).
  root.style.setProperty('--tt-x', `${x}px`);
  root.style.setProperty('--tt-y', `${y}px`);
  root.style.setProperty('--tt-r', `${radius}px`);

  if (typeof document.startViewTransition === 'function') {
    // `mx-theme-wipe` switches the ::view-transition(root) pseudos from the
    // default cross-fade to the circle reveal (see app/motion.css §16).
    // The token keeps a rapid follow-up toggle from clearing the class (and
    // the shared --tt-* geometry) while its own wipe is still on screen.
    const token = (wipeToken += 1);
    root.classList.add('mx-theme-wipe');
    try {
      const transition = document.startViewTransition(mutate);
      await transition.finished;
    } catch {
      // Transition was skipped (rapid toggles / cross-document) — the
      // mutation itself has still been applied.
    } finally {
      if (token === wipeToken) {
        root.classList.remove('mx-theme-wipe');
      }
    }
    return;
  }

  await veilWipe(mutate, x, y, radius, options.incomingClass);
}
