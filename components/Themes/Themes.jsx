"use client";

import { FaCog } from "react-icons/fa";
import { themes } from "@/data";
import ThemeItem from "./ThemeItem";
import ThemeModeIcon from "./ThemeModeIcon";
import "./Themes.css";
import { useEffect, useState, useRef, memo } from "react";
import { flushSync } from "react-dom";
import { syncThemeCssVars } from "@/lib/utils";
import {
  runThemeTransition,
  applyThemeMode,
  burstRing,
} from "@/lib/themeTransition";

const Themes = () => {
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [color, setColor] = useState("Blue");
  const [theme, setTheme] = useState("dark-theme");
  const switcherRef = useRef(null);
  const togglerRef = useRef(null);

  const changeColor = (newColor, originEl) => {
    setColor(newColor);
    localStorage.setItem("color", newColor);
    window.dispatchEvent(new Event("themeChange"));
    // Quick ring pulse at the swatch; the accent itself morphs smoothly via
    // the registered --first-color property (see motion.css §16).
    burstRing(originEl || togglerRef.current, { scale: 5 });
  };

  const toggleTheme = (originEl) => {
    const newTheme = theme === "light-theme" ? "dark-theme" : "light-theme";

    // The circular reveal captures the DOM state inside this callback, so the
    // class swap + React update must happen here (flushSync keeps the icon
    // morph inside the same snapshot).
    runThemeTransition(
      () => {
        applyThemeMode(newTheme);
        localStorage.setItem("theme", newTheme);
        window.dispatchEvent(new Event("themeChange"));
        flushSync(() => setTheme(newTheme));
      },
      originEl || togglerRef.current,
      { incomingClass: newTheme }
    );
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
    syncThemeCssVars(color);
  }, [color]);

  useEffect(() => {
    // Add/remove theme class without removing font CSS variables. Guarded so
    // it never re-shuffles <html> mid-wipe (toggleTheme already applied it
    // inside the view-transition callback).
    const root = document.documentElement;
    if (!root.classList.contains(theme)) {
      applyThemeMode(theme);
    }
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
        <div
          ref={togglerRef}
          className="theme__toggler"
          role="switch"
          aria-checked={theme === "dark-theme"}
          aria-label={theme === "light-theme" ? "Switch to dark mode" : "Switch to light mode"}
          title={theme === "light-theme" ? "Switch to dark mode" : "Switch to light mode"}
          tabIndex={0}
          onClick={(e) => toggleTheme(e.currentTarget)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleTheme(e.currentTarget);
            }
          }}
        >
          <ThemeModeIcon target={theme === "light-theme" ? "dark" : "light"} />
        </div>
        <h3 className="style__switcher-title">Style Switcher</h3>
        <div className="style__switcher-items">
          {themes.map((theme) => {
            return (
              <ThemeItem key={theme.id} {...theme} changeColor={changeColor} />
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

export default memo(Themes);
