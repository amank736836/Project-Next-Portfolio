"use client";

import { useState, useEffect, memo } from "react";
import { links } from "@/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, Avatar } from "@/components/ui";
import "./Navbar.css";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

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

  if (loading) {
    return (
      <nav className="nav">
        <div className="nav__menu">
          <ul className="nav__list">
            <li className="nav__item">
              <span className="nav__link">Loading...</span>
            </li>
          </ul>
        </div>
      </nav>
    );
  }

  return (
    <nav className="nav">
      <div className={`${showMenu ? "nav__menu show-menu" : "nav__menu"}`}>
        <ul className="nav__list">
          {links.map(({ name, icon, path }, index) => {
            const isActive = pathname === path;
            return (
              <li key={index} className="nav__item">
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