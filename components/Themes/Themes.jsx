"use client";

import { FaCog } from "react-icons/fa";
import { themes } from "@/data";
import ThemeItem from "./ThemeItem";
import { BsMoon, BsSun } from "react-icons/bs";
import "./Themes.css";
import { useEffect, useState, useRef } from "react";

const Themes = () => {
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [color, setColor] = useState("Blue");
  const [theme, setTheme] = useState("dark-theme");
  const switcherRef = useRef(null);

  const changeColor = (color) => {
    setColor(color);
  };

  const toggleTheme = () => {
    if (theme === "light-theme") {
      setTheme("dark-theme");
    } else {
      setTheme("light-theme");
    }
  };

  // Close switcher when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target)) {
        setShowSwitcher(false);
      }
    };

    if (showSwitcher) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSwitcher]);

  useEffect(() => {
    const savedColor = localStorage.getItem("color") || "Blue";
    const savedTheme = localStorage.getItem("theme") || "dark-theme";
    setColor(savedColor);
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--first-color", color);
    localStorage.setItem("color", color);
  }, [color]);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div ref={switcherRef}>
      <div className={`${showSwitcher ? "show-switcher" : ""} style__switcher`}>
        <div
          className="style__switcher-toggler"
          onClick={() => {
            setShowSwitcher(!showSwitcher);
          }}
        >
          <FaCog />
        </div>
        <div className="theme__toggler" onClick={toggleTheme}>
          {theme === "light-theme" ? <BsMoon /> : <BsSun />}
        </div>
        <h3 className="style__switcher-title">Style Switcher</h3>
        <div className="style__switcher-items">
          {themes.map((theme, index) => {
            return (
              <ThemeItem key={index} {...theme} changeColor={changeColor} />
            );
          })}
        </div>

        <div
          className="style__switcher-close"
          onClick={() => setShowSwitcher(!showSwitcher)}
        >
          &times;
        </div>
      </div>
    </div>
  );
};

export default Themes;
