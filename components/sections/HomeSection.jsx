import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import Typewriter from "@/components/ui/Typewriter";
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
            <Typewriter
              texts={[
                "Passionate Full Stack Developer with Expertise in MERN Stack",
                "Building Scalable Web Applications with React & Node.js",
                "Creating Clean, Maintainable Code & Beautiful UIs"
              ]}
              speed={80}
              deleteSpeed={40}
              pauseTime={2000}
              loop={true}
            />
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