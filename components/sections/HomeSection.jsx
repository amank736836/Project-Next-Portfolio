"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaDownload, FaBriefcase, FaCode } from "react-icons/fa";
import Typewriter from "@/components/ui/Typewriter";
import HeroPortrait3D from "@/components/ui/HeroPortrait3D";
import SplitText from "@/components/ui/SplitText";
import Marquee from "@/components/ui/Marquee";
import CountUp from "@/components/ui/CountUp";
import Magnetic from "@/components/ui/Magnetic";
import Parallax from "@/components/ui/Parallax";

function ResumeDownloadButton() {
  const [resumeUrl, setResumeUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResume() {
      try {
        const res = await fetch('/api/resume', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setResumeUrl(data.file_url);
        }
      } catch (err) {
        console.error('Failed to fetch resume:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchResume();
  }, []);

  if (loading) {
    return (
      <a href="#" className="button button--loading">
        Loading...
        <span className="button__icon"><FaDownload /></span>
      </a>
    );
  }

  return (
    <a href="/api/resume/download" target="_blank" rel="noopener noreferrer" className={`button ${resumeUrl ? '' : 'button--disabled'}`}>
      Download Resume
      <span className="button__icon"><FaDownload /></span>
    </a>
  );
}

export default function HomeSection({ enableTypewriter = true, enableOpenToWork = true, featuredSkills = [], heroImage = null }) {
  const imageSrc = heroImage?.url || "https://res.cloudinary.com/amank736836/image/upload/v1785565567/portfolio/portfolio/profile_v4.png";
  const imageAlt = heroImage?.alt_text || "Profile";

  const stack = (featuredSkills.length ? featuredSkills : [
    { title: 'React', icon: '⚛', color: '#61DAFB' },
    { title: 'Node.js', icon: '🟢', color: '#339933' },
    { title: 'Java', icon: '☕', color: '#ED8B00' },
    { title: 'MongoDB', icon: '🍃', color: '#47A248' },
    { title: 'Tailwind', icon: '💨', color: '#06B6D4' },
    { title: 'TypeScript', icon: '🔷', color: '#3178C6' },
  ]).map((s) => ({ label: s.title, icon: s.icon, color: s.color }));

  return (
    <section className="home section grid hero-stage reveal">
      <Parallax speed={0.08} className="home__img-wrapper cursor-pointer reveal-left delay-1">
        <span className="hero-ring" aria-hidden="true" />
        <span className="hero-stage__spark" style={{ top: '12%', left: '4%', width: 7, height: 7, animationDelay: '0s' }} aria-hidden="true" />
        <span className="hero-stage__spark" style={{ bottom: '16%', right: '6%', width: 5, height: 5, animationDelay: '1.4s' }} aria-hidden="true" />
        <span className="hero-stage__spark" style={{ top: '42%', right: '-2%', width: 4, height: 4, animationDelay: '2.6s' }} aria-hidden="true" />
        <HeroPortrait3D src={imageSrc} alt={imageAlt} priority />
      </Parallax>
      <div className="home__content reveal-right delay-2">
        <div className="home__data">
          <span className="hero-kicker reveal delay-2">
            <span className="hero-kicker__dot" aria-hidden="true" />
            {enableOpenToWork ? 'Open to opportunities' : 'Full stack developer'}
          </span>

          <h1 className="home__title hero-title">
            <SplitText as="span" className="hero-title__lead" text="I'm Aman Kumar." mode="char" />
            <SplitText
              as="span"
              className="hero-title__role"
              text="Full Stack Developer"
              mode="char"
              gradient
              delay={280}
              stagger={22}
            />
          </h1>

          <p className="home__subtitle reveal delay-3 home__subtitle--delayed">
            Specializing in React, Node.js, Java &amp; scalable web applications
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

          <div className="hero-stats reveal reveal-stagger delay-5">
            <div className="hero-stats__item">
              <span className="hero-stats__value"><CountUp value={18} suffix="+" /></span>
              <span className="hero-stats__label">Technologies</span>
            </div>
            <div className="hero-stats__item">
              <span className="hero-stats__value"><CountUp value={25} suffix="+" /></span>
              <span className="hero-stats__label">Projects shipped</span>
            </div>
            <div className="hero-stats__item">
              <span className="hero-stats__value"><CountUp value={4} /></span>
              <span className="hero-stats__label">Years coding</span>
            </div>
          </div>

          <div className="home__cta-group reveal delay-6">
            <Magnetic className="hero-magnetic">
              <ResumeDownloadButton />
            </Magnetic>
            <Magnetic className="hero-magnetic">
              <Link href="#projects" className="button">
                View Projects
                <span className="button__icon"><FaBriefcase /></span>
              </Link>
            </Magnetic>
            <Magnetic className="hero-magnetic">
              <Link href="#contact" className="button button--secondary">
                Hire Me
                <span className="button__icon"><FaCode /></span>
              </Link>
            </Magnetic>
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
                  <span key={skill.title} className="badge badge--tech badge--tech--animated" style={{animationDelay: `${i * 50}ms`}}>
                    <span className="badge__icon" aria-hidden="true" style={{color: skill.color}}>{skill.icon}</span>
                    {skill.title}
                  </span>
                ))
              ) : (
                <>
                  <span className="badge badge--tech badge--tech--animated" style={{animationDelay: '0ms'}}>
                    <span className="badge__icon" aria-hidden="true" style={{color: '#61DAFB'}}>⚛</span>
                    React
                  </span>
                  <span className="badge badge--tech badge--tech--animated" style={{animationDelay: '50ms'}}>
                    <span className="badge__icon" aria-hidden="true" style={{color: '#339933'}}>🟢</span>
                    Node.js
                  </span>
                  <span className="badge badge--tech badge--tech--animated" style={{animationDelay: '100ms'}}>
                    <span className="badge__icon" aria-hidden="true" style={{color: '#ED8B00'}}>☕</span>
                    Java
                  </span>
                  <span className="badge badge--tech badge--tech--animated" style={{animationDelay: '150ms'}}>
                    <span className="badge__icon" aria-hidden="true" style={{color: '#47A248'}}>🍃</span>
                    MongoDB
                  </span>
                  <span className="badge badge--tech badge--tech--animated" style={{animationDelay: '200ms'}}>
                    <span className="badge__icon" aria-hidden="true" style={{color: '#06B6D4'}}>💨</span>
                    Tailwind
                  </span>
                  <span className="badge badge--tech badge--tech--animated" style={{animationDelay: '250ms'}}>
                    <span className="badge__icon" aria-hidden="true" style={{color: '#3178C6'}}>🔷</span>
                    TypeScript
                  </span>
                </>
              )}
            </div>
          </div>

          <Link href="#about" className="hero-scroll-cue reveal delay-6">
            <span className="hero-scroll-cue__track" aria-hidden="true">
              <span className="hero-scroll-cue__dot" />
            </span>
            Scroll to explore
          </Link>
        </div>
      </div>

      <div className="color__block"></div>

      <div className="hero-stack-strip reveal delay-3">
        <span className="hero-stack-strip__label">Daily stack</span>
        <Marquee items={stack} speed={34} ariaLabel="Frequently used technologies" />
      </div>
    </section>
  );
}
