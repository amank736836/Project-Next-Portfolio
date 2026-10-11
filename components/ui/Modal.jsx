"use client";

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';
import { cn } from '@/lib/utils';

const Modal = ({ isOpen, onClose, title, children, className = "", triggerRef }) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement;
    const triggerElement = triggerRef?.current;
    document.body.style.overflow = 'hidden';

    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusableElements?.[0]?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        trapFocus(e, focusableElements);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);

      if (triggerElement) {
        triggerElement.focus();
      } else if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose, triggerRef]);
 
  const trapFocus = (e, focusableElements) => {
    if (!focusableElements || focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        ref={modalRef}
        className={cn(
          "w-full max-w-4xl relative z-10 p-0 overflow-hidden animate-slide-up shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5 bg-background rounded-3xl max-h-[90vh]",
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-background/50">
          <div>
            <h3 id="modal-title" className="text-xl font-bold tracking-tight">{title}</h3>
          </div>
          <button 
            onClick={onClose} 
            type="button"
            aria-label="Close modal"
            className="hover:rotate-90 transition-transform p-2 rounded-xl hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-background"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export { Modal };
