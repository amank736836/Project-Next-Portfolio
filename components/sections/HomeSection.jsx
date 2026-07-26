import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import "../Home.css";

export default function HomeSection() {
  return (
    <section className="home section grid">
      <div className="home__img-wrapper cursor-pointer">
        <Image 
          src="/assets/profile_v4.png" 
          alt="Profile" 
          className="home__img" 
          width={600} 
          height={600} 
          quality={85}
          priority
        />
      </div>
      <div className="home__content">
        <div className="home__data">
          <h1 className="home__title">
            <div>I&apos;m Aman Kumar. </div>
            <span>Full Stack Developer</span>
          </h1>
          <div className="home__description">
            <p>Passionate Full Stack Developer with Expertise in MERN Stack</p>
          </div>
          <Link href="#about" className="button">
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