"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaDownload } from "react-icons/fa";
import "@/app/(public)/resume/page.css";

export default function Resume() {
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
      <div className="resume-page">
        <div className="resume-page__container">
          <div className="resume-page__skeleton" aria-label="Loading resume">
            <span className="resume-page__skeleton-bar" />
            <span className="resume-page__skeleton-bar resume-page__skeleton-bar--short" />
            <span className="resume-page__skeleton-block" />
            <span className="resume-page__skeleton-bar" />
            <span className="resume-page__skeleton-bar resume-page__skeleton-bar--short" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-page page-enter">
      <div className="resume-page__container reveal-scale">
        {resumeUrl ? (
          <iframe
            className="resume-page__iframe"
            src={resumeUrl}
            title="Resume"
          ></iframe>
        ) : (
          <div className="resume-page__unavailable">
            <p>Resume not available right now.</p>
            <Link href="/contact" className="button">
              Get in touch
              <span className="button__icon">
                <FaDownload />
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
