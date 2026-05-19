import { getSiteUrl } from "@/lib/config";

const siteUrl = getSiteUrl();

const publicRoutes = [
  "",
  "/about",
  "/skills",
  "/education",
  "/experience",
  "/portfolio",
  "/contact",
  "/resume",
];

export default function sitemap() {
  const now = new Date();

  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
