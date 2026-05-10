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

  const changeColor = (newColor) => {
    setColor(newColor);
    localStorage.setItem("color", newColor);
    window.dispatchEvent(new Event("themeChange"));
  };

  const toggleTheme = () => {
    const newTheme = theme === "light-theme" ? "dark-theme" : "light-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    window.dispatchEvent(new Event("themeChange"));
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
    const fetchDefaultSettings = async () => {
      try {
        const res = await fetch('/api/info');
        const data = await res.json();
        const colorSetting = data.find(item => item.key === 'default_theme_color');
        const modeSetting = data.find(item => item.key === 'default_theme_mode');
        
        const savedColor = localStorage.getItem("color");
        const savedTheme = localStorage.getItem("theme");

        if (savedColor) {
          setColor(savedColor);
        } else if (colorSetting) {
          setColor(colorSetting.description);
        } else {
          setColor("hsl(225, 73%, 57%)");
        }

        if (savedTheme) {
          setTheme(savedTheme);
        } else if (modeSetting) {
          setTheme(modeSetting.description);
        } else {
          setTheme("dark-theme");
        }
      } catch (err) {
        console.error('Failed to fetch default theme:', err);
        // Fallback
        const savedColor = localStorage.getItem("color") || "Blue";
        const savedTheme = localStorage.getItem("theme") || "dark-theme";
        setColor(savedColor);
        setTheme(savedTheme);
      }
    };

    fetchDefaultSettings();

    const handleStorageChange = () => {
      const savedColor = localStorage.getItem("color");
      const savedTheme = localStorage.getItem("theme");
      if (savedColor) setColor(savedColor);
      if (savedTheme) setTheme(savedTheme);
    };

    window.addEventListener("storage", handleStorageChange);
    // Also listen for a custom event for same-window syncing
    window.addEventListener("themeChange", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("themeChange", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--first-color", color);
  }, [color]);

  useEffect(() => {
    document.documentElement.className = theme;
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
