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