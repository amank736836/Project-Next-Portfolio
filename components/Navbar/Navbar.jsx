"use client";

import { useState } from "react";
import { links } from "@/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./Navbar.css";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const pathname = usePathname();

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

export default Navbar;
