"use client";

import { useEffect, useState } from "react";
import "@/app/(public)/resume/page.css";


export default function Resume() {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
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
      <div className="resume-page__loading">
        Loading resume...
      </div>
    );
  }

  return (
    <div className="resume-page">
      <div className="resume-page__container">
        {resumeUrl && (
          <iframe 
            className="resume-page__iframe"
            src={resumeUrl} 
            title="Resume"
          ></iframe>
        )}
        {!resumeUrl && (
          <div className="resume-page__unavailable">
            Resume not available
          </div>
        )}
      </div>
    </div>
  );
}
