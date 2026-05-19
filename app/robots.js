import { getSiteUrl } from "@/lib/config";

const siteUrl = getSiteUrl();

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/admin", "/api/auth"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
