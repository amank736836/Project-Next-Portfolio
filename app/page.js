import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import "./Home.css";

export default function Home() {
  return (
    <section className="home section grid">
      <Image 
        src="/assets/home.jpg" 
        alt="Profile" 
        className="home__img" 
        width={350} 
        height={350} 
        priority
      />
      <div className="home__content">
        <div className="home__data">
          <h1 className="home__title">
            <div>I&apos;m Aman Kumar. </div>
            Full Stack Developer
          </h1>
          <p className="home__description">
            Passionate Full Stack Developer with Expertise in MERN Stack <br />
            Crafting Dynamic Web Applications with React, Node.js, and Tailwind
            CSS <br /> Top Performer in Hackathons and Skilled in Solving
            Complex Algorithms <br /> Dedicated to Building Innovative Solutions
            and Enhancing User Experiences
          </p>
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
