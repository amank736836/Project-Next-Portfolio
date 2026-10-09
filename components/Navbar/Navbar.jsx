"use client";

import { useState, useEffect, memo, useRef } from "react";
import { links } from "@/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import "./Navbar.css";

const Navbar = ({ siteMode = 'multi', initialUser = null }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(initialUser);
  const [activeSection, setActiveSection] = useState('home');
  const pathname = usePathname();
  const activeSectionIdRef = useRef('home');

  useEffect(() => {
    if (!pathname?.startsWith('/admin')) return; // Only validate auth on admin routes
    
    const checkUser = async () => {
      try {
        const response = await fetch('/api/auth/validate');
        const data = await response.json();
        if (data.authenticated) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to get current user:', error);
        setUser(null);
      }
    };

    checkUser();
  }, [pathname]);

  // IntersectionObserver for single-page mode active section tracking
  useEffect(() => {
    if (siteMode !== 'single') return;

    // Find section with maximum viewport coverage and update active section
    const updateActiveSection = () => {
      const sections = document.querySelectorAll('section[id]');
      let maxVisibleSection = 'home';
      let maxVisibleRatio = 0;

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate visible portion of section within viewport
        const visibleTop = Math.max(rect.top, 0);
        const visibleBottom = Math.min(rect.bottom, viewportHeight);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const sectionHeight = rect.bottom - rect.top;
        
        // Calculate ratio of section visible in viewport
        const visibleRatio = sectionHeight > 0 ? visibleHeight / sectionHeight : 0;

        if (visibleRatio > maxVisibleRatio) {
          maxVisibleRatio = visibleRatio;
          maxVisibleSection = section.id;
        }
      });

      if (maxVisibleSection !== activeSectionIdRef.current) {
        activeSectionIdRef.current = maxVisibleSection;
        setActiveSection(maxVisibleSection);
      }
    };

    const initialCheckTimeout = window.setTimeout(updateActiveSection, 100);

    // Scroll listener with throttling
    let scrollTimeout = null;
    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateActiveSection, 50);
    };

    updateActiveSection();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('load', updateActiveSection);

    return () => {
      window.clearTimeout(initialCheckTimeout);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('load', updateActiveSection);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [siteMode]);

  const handleLogin = () => {
    window.location.href = '/api/auth/login';
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      const data = await response.json();
      setUser(null);
      window.location.href = data.logoutUrl || '/';
    } catch (error) {
      console.error('Logout failed:', error);
      window.location.href = '/';
    }
  };

  // Generate nav links based on siteMode
  const navLinks = links.map(link => ({
    ...link,
    path: siteMode === 'single' ? `#${link.path === '/' ? 'home' : link.path.replace('/', '')}` : link.path
  }));

  return (
    <nav className="nav">
      <div className={`${showMenu ? "nav__menu show-menu" : "nav__menu"}`}>
        <ul className="nav__list">
          <li className="nav__item nav__item--brand">
            <Link
              href={siteMode === 'single' ? '#home' : '/'}
              className="nav__brand"
              aria-label="Aman Kumar — home"
              onClick={() => setShowMenu(false)}
            >
              <span className="nav__brand-mark" aria-hidden="true">AK</span>
              <span className="nav__brand-ring" aria-hidden="true" />
            </Link>
          </li>
          {navLinks.map(({ name, icon, path }) => {
            const isActive = siteMode === 'single' 
              ? activeSection === (path === '#home' ? 'home' : path.replace('#', ''))
              : pathname === path;
            return (
              <li key={path} className="nav__item">
                {siteMode === 'single' ? (
                  <a
                    href={path}
                    className={isActive ? "nav__link active-nav" : "nav__link"}
                    onClick={() => {
                      const targetId = path.slice(1);
                      activeSectionIdRef.current = targetId;
                      setActiveSection(targetId);
                      setShowMenu(false);
                    }}
                  >
                    {icon}
                    <h3 className="nav__name">{name}</h3>
                  </a>
                ) : (
                  <Link
                    href={path}
                    className={isActive ? "nav__link active-nav" : "nav__link"}
                    onClick={() => {
                      setShowMenu(false);
                    }}
                  >
                    {icon}
                    <h3 className="nav__name">{name}</h3>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div
        className={`${showMenu ? "nav__toggle animate-toggle" : "nav__toggle"}`}
        onClick={() => setShowMenu(!showMenu)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default memo(Navbar);
