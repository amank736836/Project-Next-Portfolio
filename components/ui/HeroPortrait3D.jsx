"use client";

import Image from "next/image";
import { useRef } from "react";
import "./HeroPortrait3D.css";

export default function HeroPortrait3D({ src, alt = "Profile", priority = false }) {
  const sceneRef = useRef(null);

  function handlePointerMove(event) {
    if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;

    const scene = sceneRef.current;
    const bounds = scene?.getBoundingClientRect();
    if (!scene || !bounds) return;

    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    scene.style.setProperty("--portrait-rotate-x", `${(0.5 - y) * 11}deg`);
    scene.style.setProperty("--portrait-rotate-y", `${(x - 0.5) * 13}deg`);
  }

  function resetTilt() {
    const scene = sceneRef.current;
    if (!scene) return;
    scene.style.setProperty("--portrait-rotate-x", "0deg");
    scene.style.setProperty("--portrait-rotate-y", "0deg");
  }

  return (
    <div
      ref={sceneRef}
      className="hero-portrait-3d"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <span className="hero-portrait-3d__glow" aria-hidden="true" />
      <span className="hero-portrait-3d__orbit hero-portrait-3d__orbit--outer" aria-hidden="true" />
      <span className="hero-portrait-3d__orbit hero-portrait-3d__orbit--inner" aria-hidden="true" />
      <div className="hero-portrait-3d__frame">
        <span className="hero-portrait-3d__depth" aria-hidden="true" />
        <Image
          src={src}
          alt={alt}
          className="home__img hero-portrait-3d__image"
          width={600}
          height={600}
          sizes="(max-width: 640px) 82vw, (max-width: 1024px) 400px, 480px"
          quality={85}
          priority={priority}
        />
        <span className="hero-portrait-3d__edge" aria-hidden="true" />
      </div>
    </div>
  );
}
