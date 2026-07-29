'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);

  const startLoading = useCallback(() => {
    setCount(c => {
      const next = c + 1;
      if (next === 1) setVisible(true);
      return next;
    });
  }, []);

  const stopLoading = useCallback(() => {
    setCount(c => {
      const next = Math.max(0, c - 1);
      if (next === 0) setVisible(false);
      return next;
    });
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading: visible, startLoading, stopLoading }}>
      {children}
      {visible && <GlobalLoader />}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error('useLoading must be used within LoadingProvider');
  return ctx;
}

function GlobalLoader() {
  return (
    <div 
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--admin-accent)] via-[var(--first-color)] to-[var(--admin-accent)] z-[100] animate-pulse"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading"
    />
  );
}