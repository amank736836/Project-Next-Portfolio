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

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: "Aman's professional portfolio showcasing projects, skills, and experience.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteName,
    description: "Aman's professional portfolio showcasing projects, skills, and experience.",
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
    description: "Aman's professional portfolio showcasing projects, skills, and experience.",
    images: ["/assets/profile_v4.png"],
  },
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${poppins.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}