import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Themes from "@/components/Themes/Themes";
import ScrollHandler from "@/components/ScrollHandler";
import TransitionLoader from "@/components/TransitionLoader";
import { Analytics } from "@vercel/analytics/react";
import RootShell from "@/components/RootShell";

export const metadata = {
  title: "Aman Portfolio",
  description: "Aman's Professional Portfolio built with Next.js",
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
