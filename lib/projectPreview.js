/**
 * Helpers for live preview + auto screenshot fallback.
 *
 * Strategy (zero API key, zero cost):
 * - Live preview = <iframe src={productionUrl}> in admin. Always current.
 * - Card / public image fallback = WordPress mShots screenshot proxy:
 *   https://s.wordpress.com/mshots/v1/{encodedUrl}?w=1280
 *   No key required, returns a live-ish screenshot of the site.
 */

export function normalizeHttpUrl(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
  try {
    const u = new URL(trimmed);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    return u.toString();
  } catch {
    return null;
  }
}

export function getProductionUrlFromDetails(details) {
  if (!Array.isArray(details)) return null;
  const found = details.find(
    (d) =>
      d?.title &&
      /preview|live|link|url|deploy|production/i.test(d.title) &&
      d?.desc &&
      typeof d.desc === 'string' &&
      d.desc.trim().startsWith('http')
  );
  return normalizeHttpUrl(found?.desc || null);
}

export function getProductionUrl(projectOrDetails, fallbackLiveUrl) {
  if (typeof projectOrDetails === 'string') return normalizeHttpUrl(projectOrDetails);
  if (Array.isArray(projectOrDetails)) return getProductionUrlFromDetails(projectOrDetails);
  if (projectOrDetails && typeof projectOrDetails === 'object') {
    const fromDetails = getProductionUrlFromDetails(projectOrDetails.details);
    if (fromDetails) return fromDetails;
    if (fallbackLiveUrl) {
      const n = normalizeHttpUrl(fallbackLiveUrl);
      if (n) return n;
    }
    if (projectOrDetails.liveUrl) {
      const n = normalizeHttpUrl(projectOrDetails.liveUrl);
      if (n) return n;
    }
    if (projectOrDetails.preview) {
      const n = normalizeHttpUrl(projectOrDetails.preview);
      if (n) return n;
    }
  }
  if (fallbackLiveUrl) return normalizeHttpUrl(fallbackLiveUrl);
  return null;
}

/**
 * Free screenshot proxy (WordPress mShots). No API key.
 * mShots caches; width 1280 gives a good card-quality image.
 */
export function getScreenshotUrl(productionUrl, width = 1280) {
  const normalized = normalizeHttpUrl(productionUrl);
  if (!normalized) return null;
  const w = Math.min(Math.max(parseInt(width, 10) || 1280, 320), 1920);
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(normalized)}?w=${w}`;
}

function isValidCustomImage(src) {
  if (!src || typeof src !== 'string') return false;
  const t = src.trim();
  if (!t || t === '/assets/default.png') return false;
  if (t.includes('placeholder')) return false;
  return true;
}

/**
 * Resolve the image to render:
 * 1. custom uploaded image (img / image)
 * 2. live screenshot fallback from production URL
 * 3. placeholder
 */
export function getDisplayImage(project, options = {}) {
  const { width = 1280, placeholder } = options;
  const fallbackPlaceholder =
    placeholder ||
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1280&auto=format&fit=crop';

  if (!project) return fallbackPlaceholder;
  if (typeof project === 'string') {
    if (isValidCustomImage(project)) return project;
    const shot = getScreenshotUrl(project, width);
    return shot || fallbackPlaceholder;
  }

  const custom = project.image || project.img;
  if (isValidCustomImage(custom)) return custom;

  const prodUrl = getProductionUrl(project, project?.liveUrl);
  const shot = prodUrl ? getScreenshotUrl(prodUrl, width) : null;
  return shot || fallbackPlaceholder;
}
