// Centralized application configuration helper

export const isProd = process.env.NODE_ENV === 'production';

export function getSiteUrl() {
  const isProd = process.env.NODE_ENV === 'production';
  return isProd
    ? (process.env.NEXT_PUBLIC_APP_URL_PROD || process.env.NEXT_PUBLIC_APP_URL || "https://amank.co.in")
    : (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
}
