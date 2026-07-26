"use client";

import { useEffect, useRef, memo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { links } from "@/data";

const ScrollHandler = ({ siteMode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const lastScrollTime = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    // Disable scroll navigation in single-page mode
    if (siteMode === 'single') return;

    const handleNavigation = (direction) => {
      const now = Date.now();
      if (now - lastScrollTime.current < 1500) return; // Prevent rapid firing

      // Only navigate between sections when the page actually scrolls.
      // On short pages (no overflow) every scroll would otherwise trigger an
      // unexpected navigation away from the current page.
      const isScrollable = document.documentElement.scrollHeight > window.innerHeight + 10;
      if (!isScrollable) return;

      const currentIndex = links.findIndex((link) => link.path === pathname);
      if (currentIndex === -1) return;

      if (direction === "up" && currentIndex > 0) {
        // Only navigate up if at the top of the page
        if (window.scrollY <= 10) {
          lastScrollTime.current = now;
          router.push(links[currentIndex - 1].path);
        }
      } else if (direction === "down" && currentIndex < links.length - 1) {
        // Only navigate down if at the bottom of the page
        const scrollBottom = window.innerHeight + window.scrollY;
        if (scrollBottom >= document.documentElement.scrollHeight - 10) {
          lastScrollTime.current = now;
          router.push(links[currentIndex + 1].path);
        }
      }
    };

    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) < 50) return; // Ignore small scrolls
      if (e.deltaY < 0) handleNavigation("up");
      else handleNavigation("down");
    };

    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchEndY - touchStartY.current;
      if (Math.abs(deltaY) < 50) return;
      if (deltaY > 0) handleNavigation("up");
      else handleNavigation("down");
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pathname, router, siteMode]);

  return null;
};

export default memo(ScrollHandler);
