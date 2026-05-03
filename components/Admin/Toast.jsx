'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX, FiAlertTriangle } from 'react-icons/fi';
import { createPortal } from 'react-dom';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration + 300); // Extra time for exit animation
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {mounted && createPortal(
        <div className="toast-container">
          {toasts.map((toast, index) => (
            <ToastItem 
              key={toast.id} 
              {...toast} 
              onRemove={removeToast}
              index={index}
            />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

function ToastItem({ id, message, type, duration, onRemove, index }) {
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  const icons = {
    success: <FiCheckCircle className="text-emerald-400" size={20} />,
    error: <FiAlertCircle className="text-rose-400" size={20} />,
    warning: <FiAlertTriangle className="text-amber-400" size={20} />,
    info: <FiInfo className="text-indigo-400" size={20} />,
  };

  const colors = {
    success: 'border-emerald-500/30 shadow-emerald-500/10',
    error: 'border-rose-500/30 shadow-rose-500/10',
    warning: 'border-amber-500/30 shadow-amber-500/10',
    info: 'border-indigo-500/30 shadow-indigo-500/10',
  };

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      
      if (remaining === 0) {
        clearInterval(interval);
        handleClose();
      }
    }, 16);

    return () => clearInterval(interval);
  }, [duration]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => onRemove(id), 300);
  };

  return (
    <div 
      className={`toast-item ${exiting ? 'toast-exit' : 'toast-enter'} ${colors[type]}`}
      style={{ 
        '--toast-index': index,
        bottom: `${20 + index * 80}px`
      }}
    >
      <div className="toast-glow" />
      <div className="toast-content">
        <div className="toast-icon">
          {icons[type]}
        </div>
        <p className="toast-message">{message}</p>
        <button 
          onClick={handleClose}
          className="toast-close"
          aria-label="Close notification"
        >
          <FiX size={16} />
        </button>
      </div>
      <div 
        className="toast-progress"
        style={{ 
          width: `${progress}%`,
          background: type === 'success' ? '#10b981' : 
                      type === 'error' ? '#f43f5e' : 
                      type === 'warning' ? '#f59e0b' : '#6366f1'
        }}
      />
    </div>
  );
}

// Helper hooks for common toast patterns
export function useSuccessToast() {
  const { addToast } = useToast();
  return useCallback((message) => addToast(message, 'success'), [addToast]);
}

export function useErrorToast() {
  const { addToast } = useToast();
  return useCallback((message) => addToast(message, 'error'), [addToast]);
}

export function useInfoToast() {
  const { addToast } = useToast();
  return useCallback((message) => addToast(message, 'info'), [addToast]);
}

export function useWarningToast() {
  const { addToast } = useToast();
  return useCallback((message) => addToast(message, 'warning'), [addToast]);
}
