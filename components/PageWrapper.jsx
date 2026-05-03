"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const PageWrapper = ({ children }) => {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 800);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div key={pathname} className={isTransitioning ? "page-enter" : ""}>
      {children}
    </div>
  );
};

export default PageWrapper;
