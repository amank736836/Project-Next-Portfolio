import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Themes from "@/components/Themes/Themes";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Aman Portfolio",
  description: "Aman's Professional Portfolio built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Navbar />
        <Themes />
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
