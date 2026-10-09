import Link from "next/link";
import { FaArrowRight, FaBriefcase, FaCode, FaMapMarkerAlt } from "react-icons/fa";
import { createAdminClient } from "@/lib/supabase/server";
import HeroPortrait3D from "@/components/ui/HeroPortrait3D";
import SplitText from "@/components/ui/SplitText";
import Marquee from "@/components/ui/Marquee";
import CountUp from "@/components/ui/CountUp";
import Magnetic from "@/components/ui/Magnetic";
import Parallax from "@/components/ui/Parallax";
import "./Home.css";

export default async function Home() {
  const supabase = await createAdminClient();
  const [{ data: infoData }, { data: featuredSkills }, { data: stats }] = await Promise.all([
    supabase.from('personal_info').select('key, description, is_hidden').in('key', ['site_mode', 'address']),
    supabase.from('skills').select('title, icon, color').eq('is_featured', true).eq('is_hidden', false).order('id', { ascending: true }).limit(8),
    // Stat must count only publicly visible skills.
    supabase.from('skills').select('id').eq('is_hidden', false).limit(1000),
  ]);

  const infoByKey = Object.fromEntries((infoData || []).map((item) => [item.key, item.description]));
  const siteMode = infoByKey.site_mode || 'multi';
  // The address is public-facing: respect the admin's is_hidden flag.
  const addressItem = (infoData || []).find((item) => item.key === 'address');
  const location = addressItem && !addressItem.is_hidden ? (addressItem.description?.trim() || null) : null;

  // In single-page mode, the Home section is rendered by SinglePageLayout
  if (siteMode === 'single') {
    return null;
  }

  const stack = (featuredSkills && featuredSkills.length ? featuredSkills : [
    { title: 'React', icon: '⚛', color: '#61DAFB' },
    { title: 'Node.js', icon: '🟢', color: '#339933' },
    { title: 'Java', icon: '☕', color: '#ED8B00' },
    { title: 'MongoDB', icon: '🍃', color: '#47A248' },
    { title: 'TypeScript', icon: '🔷', color: '#3178C6' },
    { title: 'Tailwind', icon: '💨', color: '#06B6D4' },
  ]).map((s) => ({ label: s.title, icon: s.icon, color: s.color }));

  return (
    <>
      <section className="home section grid hero-stage">
        <Parallax speed={0.08} className="home__img-wrapper cursor-pointer reveal-left">
          <span className="hero-ring" aria-hidden="true" />
          <span className="hero-stage__spark" style={{ top: '12%', left: '4%', width: 7, height: 7, animationDelay: '0s' }} aria-hidden="true" />
          <span className="hero-stage__spark" style={{ bottom: '16%', right: '6%', width: 5, height: 5, animationDelay: '1.4s' }} aria-hidden="true" />
          <span className="hero-stage__spark" style={{ top: '42%', right: '-2%', width: 4, height: 4, animationDelay: '2.6s' }} aria-hidden="true" />
          <HeroPortrait3D src="/assets/profile_v4.png" alt="Profile" priority />
        </Parallax>
        <div className="home__content">
          <div className="home__data">
            {location ? (
              <span className="hero-kicker reveal delay-1">
                <FaMapMarkerAlt className="hero-kicker__icon" aria-hidden="true" />
                {location}
              </span>
            ) : null}

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

            <div className="home__description reveal delay-3">
              <p>Passionate Full Stack Developer with expertise in the MERN stack, Java services and interfaces that feel alive.</p>
            </div>

            <div className="hero-stats reveal reveal-stagger delay-4">
              <div className="hero-stats__item">
                <span className="hero-stats__value"><CountUp value={stats?.length || 10} suffix="+" /></span>
                <span className="hero-stats__label">Technologies</span>
              </div>
              <div className="hero-stats__item">
                <span className="hero-stats__value"><CountUp value={6} suffix="+" /></span>
                <span className="hero-stats__label">Projects shipped</span>
              </div>
              <div className="hero-stats__item">
                <span className="hero-stats__value"><CountUp value={2} /></span>
                <span className="hero-stats__label">Years building</span>
              </div>
            </div>

            <div className="home__cta-group reveal delay-5">
              <Magnetic className="hero-magnetic">
                <Link href="/about" className="button">
                  More About Me
                  <span className="button__icon">
                    <FaArrowRight />
                  </span>
                </Link>
              </Magnetic>
              <Magnetic className="hero-magnetic">
                <Link href="/projects" className="button button--secondary">
                  Projects
                  <span className="button__icon">
                    <FaBriefcase />
                  </span>
                </Link>
              </Magnetic>
              <Magnetic className="hero-magnetic">
                <Link href="/contact" className="button button--tertiary">
                  Hire Me
                  <span className="button__icon">
                    <FaCode />
                  </span>
                </Link>
              </Magnetic>
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
      </section>

      <div className="hero-stack-strip reveal delay-2">
        <span className="hero-stack-strip__label">Daily stack</span>
        <Marquee items={stack} speed={34} ariaLabel="Frequently used technologies" />
      </div>
    </>
  );
}
