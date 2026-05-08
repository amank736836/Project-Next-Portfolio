"use client";

import { useState, useEffect } from "react";
import { links } from "@/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
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
        const currentUser = await getCurrentUser();
        setUser(currentUser);
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
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
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
          {!user ? (
            <li key="login" className="nav__item">
              <Button
                variant="outline"
                size="icon"
                onClick={handleLogin}
                className="nav__link"
              >
                <span className="nav__icon">🔐</span>
                <span className="nav__name">Login</span>
              </Button>
            </li>
          ) : (
            <>
              <li key="user" className="nav__item">
                <span className="nav__link">
                  <span className="nav__icon">👤</span>
                  <h3 className="nav__name">{user?.name || 'User'}</h3>
                </span>
              </li>
              <li key="logout" className="nav__item">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleLogout}
                  className="nav__link"
                >
                  <span className="nav__icon">🚪</span>
                  <h3 className="nav__name">Logout</span>
                </Button>
              </li>
            </>
          )}
        </ul>
      </div>

      <div
        className={`${showMenu ? "nav__menu animate-toggle" : "nav__menu"}`}
        onClick={() => setShowMenu(!showMenu)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};

export default Navbar;