import { getSiteUrl } from "@/lib/config";

const siteUrl = getSiteUrl();

const publicRoutes = [
  "",
  "/about",
  "/skills",
  "/education",
  "/experience",
  "/projects",
  "/contact",
  "/resume",
];

export default function sitemap() {
  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
