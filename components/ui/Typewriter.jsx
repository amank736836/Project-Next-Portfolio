"use client";

import { useState, useEffect } from "react";

export default function Typewriter({ 
  texts = ["Passionate Full Stack Developer with Expertise in MERN Stack"],
  speed = 100,
  deleteSpeed = 50,
  pauseTime = 2000,
  loop = true 
}) {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const currentFullText = texts[textIndex];
    
    const type = () => {
      if (isDeleting) {
        setCurrentText(currentFullText.substring(0, charIndex - 1));
      } else {
        setCurrentText(currentFullText.substring(0, charIndex + 1));
      }
    };

    let timeout;
    
    if (isDeleting) {
      timeout = setTimeout(() => {
        if (charIndex === 0) {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
        setCharIndex((prev) => prev - 1);
      }, deleteSpeed);
    } else {
      if (charIndex === currentFullText.length) {
        if (loop) {
          timeout = setTimeout(() => {
            setIsDeleting(true);
          }, pauseTime);
        }
      } else {
        timeout = setTimeout(() => {
          setCharIndex((prev) => prev + 1);
        }, speed);
      }
    }
    
    type();

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, speed, deleteSpeed, pauseTime, loop, mounted]);

  if (!mounted) {
    return <span className="typewriter-text">{texts[0]}</span>;
  }

  return (
    <span className="typewriter-text">
      {currentText}
      <span className="typewriter-cursor" aria-hidden="true">|</span>
    </span>
  );
}