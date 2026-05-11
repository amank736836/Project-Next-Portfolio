import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function calculateAge(dob) {
  if (!dob || typeof dob !== 'string' || !dob.includes('/')) return dob;
  const [day, month, year] = dob.split("/").map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return dob;
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
  };
  return `${Math.round(f(0) * 255)}, ${Math.round(f(8) * 255)}, ${Math.round(f(4) * 255)}`;
}

export function syncThemeCssVars(hslString) {
  const match = hslString.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return;
  const h = parseInt(match[1]);
  const s = parseInt(match[2]);
  const l = parseInt(match[3]);

  document.documentElement.style.setProperty("--first-color", hslString);
  document.documentElement.style.setProperty("--first-color-hsl", `${h}, ${s}%, ${l}%`);
  document.documentElement.style.setProperty("--admin-accent-rgb", hslToRgb(h, s, l));
}