import Info from "@/components/Info";
import { FaDownload } from "react-icons/fa";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import "../about.css";
import { FaEye } from "react-icons/fa6";
import Link from "next/link";

export default function About() {
  return (
    <main className="section container">
      <section className="about">
        <h2>
          <div className="section__title">
            About <span>Me</span>
          </div>
        </h2>
        <div className="about__container grid">
          <div className="about__info">
            <h3 className="section__subtitle">Personal Infos</h3>
            <ul className="info__list grid">
              <Info />
            </ul>
            <center>
              <a href="/assets/Aman_Resume.pdf" download="" className="button">
                Download Cv
                <span className="button__icon">
                  <FaDownload />
                </span>
              </a>
              <Link
                href="/resume"
                className="view"
                style={{
                  paddingLeft: "10rem",
                }}
              >
                <div className="button">
                  View Cv
                  <span className="button__icon">
                    <FaEye />
                  </span>
                </div>
              </Link>
            </center>
          </div>
        </div>
      </section>

      <div className="separator"></div>

      <section className="skills">
        <h3 className="section__subtitle subtitle__center">My Skills</h3>
        <div className="skills__container grid">
          <Skills />
        </div>
      </section>

      <div className="separator"></div>

      <section className="resume">
        <h3 className="section__subtitle subtitle__center">Education</h3>
        <div className="resume__container grid">
          <div className="resume__data">
            <Education />
          </div>
        </div>
      </section>
    </main>
  );
}
