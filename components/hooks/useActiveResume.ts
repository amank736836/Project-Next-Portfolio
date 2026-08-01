"use client";

import { useState, useEffect } from "react";

export function useActiveResume() {
  const [resume, setResume] = useState<{
    id: number;
    title: string;
    file_url: string;
    file_name: string;
    file_size: number;
    is_active: boolean;
    is_favorite: boolean;
    uploaded_at: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResume() {
      try {
        const res = await fetch('/api/resume', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setResume(data);
        } else if (res.status === 404) {
          setError('No active resume found');
        } else {
          setError('Failed to fetch resume');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    }
    fetchResume();
  }, []);

  return { resume, loading, error };
}