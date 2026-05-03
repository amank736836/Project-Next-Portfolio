"use client";

import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import Typewriter from "typewriter-effect";
import "./Home.css";

export default function Home() {
  return (
    <section className="home section grid">
      <Image 
        src="/assets/profile_v4.png" 
        alt="Profile" 
        className="home__img" 
        width={600} 
        height={600} 
        quality={100}
        priority
      />
      <div className="home__content">
        <div className="home__data">
          <h1 className="home__title">
            <div>I&apos;m Aman Kumar. </div>
            <span>Full Stack Developer</span>
          </h1>
          <div className="home__description">
            <Typewriter
              options={{
                strings: [
                  "Passionate Full Stack Developer with Expertise in MERN Stack",
                  "Crafting Dynamic Web Applications with React, Node.js, and Tailwind CSS",
                  "Top Performer in Hackathons and Skilled in Solving Complex Algorithms",
                  "Dedicated to Building Innovative Solutions and Enhancing User Experiences"
                ],
                autoStart: true,
                loop: true,
                delay: 50,
                deleteSpeed: 30,
              }}
            />
          </div>
          <Link href="/about" className="button">
            More About Me
            <span className="button__icon">
              <FaArrowRight />
            </span>
          </Link>
        </div>
      </div>

      <div className="color__block"></div>
    </section>
  );
}
