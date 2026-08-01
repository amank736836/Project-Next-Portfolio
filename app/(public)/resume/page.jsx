"use client";

import { useEffect, useState } from "react";

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
      <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "var(--body-color)" }}>
        Loading resume...
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "var(--body-color)" }}>
      <div className="resumeFile" style={{ width: "100vw", height: "100vh", position: "absolute", top: "0", left: "0", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {resumeUrl && (
          <iframe src={resumeUrl} style={{ width: "100vw", height: "100vh" }}></iframe>
        )}
        {!resumeUrl && (
          <div style={{ color: "var(--text-color)", textAlign: "center" }}>
            Resume not available
          </div>
        )}
      </div>
    </div>
  );
}
