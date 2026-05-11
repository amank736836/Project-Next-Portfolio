import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Themes from "@/components/Themes/Themes";
import ScrollHandler from "@/components/ScrollHandler";
import TransitionLoader from "@/components/TransitionLoader";
import { Analytics } from "@vercel/analytics/react";
import RootShell from "@/components/RootShell";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Portfolio-level chrome: hidden on /admin routes */}
        <RootShell>
          <Navbar />
          <Themes />
          <ScrollHandler />
          <TransitionLoader />
        </RootShell>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
