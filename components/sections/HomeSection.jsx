"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaDownload, FaBriefcase, FaCode, FaExternalLinkAlt } from "react-icons/fa";
import Typewriter from "@/components/ui/Typewriter";
import "../Home.css";

export default function HomeSection({ enableTypewriter = true, enableOpenToWork = true, featuredSkills = [], heroImage = null }) {
  const imageSrc = heroImage?.url || "/assets/profile_v4.png";
  const imageAlt = heroImage?.alt_text || "Profile";

  return (
    <section className="home section grid reveal">
      <div className="home__img-wrapper cursor-pointer reveal-left delay-1">
        <Image 
          src={imageSrc}
          alt={imageAlt}
          className="home__img" 
          width={600} 
          height={600} 
          quality={85}
          priority
        />
      </div>
      <div className="home__content reveal-right delay-2">
        <div className="home__data">
          <h1 className="home__title reveal delay-3">
            <div>I&apos;m Aman Kumar. </div>
            <span>Full Stack Developer</span>
          </h1>
          <p className="home__subtitle reveal delay-3" style={{animationDelay: '100ms'}}>
            Specializing in React, Node.js, Java & scalable web applications
          </p>
          <div className="home__description reveal delay-4">
            {enableTypewriter ? (
              <Typewriter
                texts={[
                  "Building scalable web applications with React & Node.js",
                  "Creating clean, maintainable code & beautiful UIs",
                  "Passionate Full Stack Developer with MERN Stack expertise"
                ]}
                speed={60}
                deleteSpeed={30}
                pauseTime={2500}
                loop={true}
              />
            ) : (
              "Building scalable web applications with React & Node.js"
            )}
          </div>
          <div className="home__cta-group reveal delay-5">
            <Link href="/assets/Aman_Resume.pdf" download className="button button--primary">
              <FaDownload />
              Download Resume
              <span className="button__icon">
                <FaArrowRight />
              </span>
            </Link>
            <Link href="#projects" className="button button--secondary">
              <FaBriefcase />
              View Projects
            </Link>
            <Link href="#contact" className="button button--tertiary">
              <FaCode />
              Hire Me
            </Link>
          </div>
          <div className="home__badges reveal delay-6">
            {enableOpenToWork && (
              <span className="badge badge--status">
                <span className="badge__dot" aria-hidden="true"></span>
                Open to Opportunities
              </span>
            )}
            <div className="badge__tech-stack" aria-label="Tech Stack">
              {featuredSkills.length > 0 ? (
                featuredSkills.map((skill, i) => (
                  <span key={skill.title} className="badge badge--tech" style={{animationDelay: `${i * 50}ms`}}>
                    <span className="badge__icon" aria-hidden="true" style={{color: skill.color}}>{skill.icon}</span>
                    {skill.title}
                  </span>
                ))
              ) : (
                <>
                  <span className="badge badge--tech" style={{animationDelay: '0ms'}}>
                    <span className="badge__icon" aria-hidden="true" style={{color: '#61DAFB'}}>⚛</span>
                    React
                  </span>
                  <span className="badge badge--tech" style={{animationDelay: '50ms'}}>
                    <span className="badge__icon" aria-hidden="true" style={{color: '#339933'}}>🟢</span>
                    Node.js
                  </span>
                  <span className="badge badge--tech" style={{animationDelay: '100ms'}}>
                    <span className="badge__icon" aria-hidden="true" style={{color: '#ED8B00'}}>☕</span>
                    Java
                  </span>
                  <span className="badge badge--tech" style={{animationDelay: '150ms'}}>
                    <span className="badge__icon" aria-hidden="true" style={{color: '#47A248'}}>🍃</span>
                    MongoDB
                  </span>
                  <span className="badge badge--tech" style={{animationDelay: '200ms'}}>
                    <span className="badge__icon" aria-hidden="true" style={{color: '#06B6D4'}}>💨</span>
                    Tailwind
                  </span>
                  <span className="badge badge--tech" style={{animationDelay: '250ms'}}>
                    <span className="badge__icon" aria-hidden="true" style={{color: '#3178C6'}}>🔷</span>
                    TypeScript
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="color__block"></div>
    </section>
  );
}