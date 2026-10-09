"use client";

import Info from "@/components/Info";
import { FaDownload } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";
import { useState, useRef } from "react";
import { ResumeViewerModal } from "@/components/sections/ResumeViewerModal";
import SectionHeading from "@/components/ui/SectionHeading";
import "@/app/(public)/about.css";

function ResumeDownloadLink({ resumeUrl }) {
  const className = resumeUrl ? 'button' : 'button button--disabled';
  return (
    <a href="/api/resume/download" target="_blank" rel="noopener noreferrer" className={className}>
      Download CV
      <span className="button__icon"><FaDownload /></span>
    </a>
  );
}

export default function AboutSection({ aboutDescription, personalInfo, resumeUrl }) {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const viewButtonRef = useRef(null);

  const hasResume = !!resumeUrl;
  const viewButtonClassName = hasResume ? 'button' : 'button button--disabled';

  return (
    <section id="about" className="section container reveal" suppressHydrationWarning>
      <section className="about">
        <SectionHeading title="About" highlight="Me" eyebrow="Who I am" className="reveal" />
        <div className="about__container grid">
          <div className="about__info reveal-left delay-2">
            <h3 className="section__subtitle reveal delay-3">Personal Infos</h3>
            {aboutDescription && (
              <p className="about__description mb-8 text-slate-400 leading-relaxed reveal delay-4">
                {aboutDescription}
              </p>
            )}
            <ul className="info__list grid reveal delay-5">
              <Info data={personalInfo} />
            </ul>
            <div className="mt-12 flex flex-row flex-wrap items-center justify-center gap-4 sm:gap-8 reveal delay-6" suppressHydrationWarning>
              <ResumeDownloadLink resumeUrl={resumeUrl} />
              <button
                ref={viewButtonRef}
                onClick={() => setIsViewModalOpen(true)}
                className={viewButtonClassName}
                disabled={!hasResume}
                suppressHydrationWarning
              >
                View CV
                <span className="button__icon"><FaEye /></span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <ResumeViewerModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        resumeUrl={resumeUrl}
        title="View Resume"
        triggerRef={viewButtonRef}
      />
    </section>
  );
}