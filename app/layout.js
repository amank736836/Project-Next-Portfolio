import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Outfit, Poppins } from 'next/font/google';

import { getSiteUrl } from "@/lib/config";

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300','400','600','800'],
  variable: '--body-font'
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300','400','600','800'],
  variable: '--second-font'
});

const siteUrl = getSiteUrl();
const siteName = "Aman Portfolio";
const siteDescription = "Aman Kumar is a full-stack developer specializing in React, Node.js, Java, and scalable web applications.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: ["Aman Kumar", "full-stack developer", "React developer", "Node.js developer", "Java developer", "portfolio"],
  authors: [{ name: "Aman Kumar", url: siteUrl }],
  creator: "Aman Kumar",
  publisher: "Aman Kumar",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    siteName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/assets/profile_v4.png",
        width: 1200,
        height: 630,
        alt: "Aman Kumar Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: ["/assets/profile_v4.png"],
  },
};

export default async function RootLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Aman Kumar",
    url: siteUrl,
    jobTitle: "Full Stack Developer",
    description: siteDescription,
    image: `${siteUrl}/assets/profile_v4.png`,
    sameAs: [
      "https://www.linkedin.com/in/amank736836",
      "https://github.com/amank736836",
      "https://codolio.com/profile/amank736836",
    ],
    knowsAbout: ["React", "Node.js", "Java", "JavaScript", "PostgreSQL", "MongoDB"],
  };

  return (
    // suppressHydrationWarning: the theme + motion classes are applied to <html>
      // before hydration (inline script / ThemeController), which React would flag.
    <html lang="en" className={`${outfit.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
