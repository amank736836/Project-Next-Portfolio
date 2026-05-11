import React from 'react';
import { FiX } from 'react-icons/fi';
import { cn } from '@/lib/utils';

const Modal = ({ isOpen, onClose, title, children, className = "" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" 
        onClick={onClose}
      />
      <div className={cn(
        "w-full max-w-2xl relative z-10 p-0 overflow-hidden animate-slide-up shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5 bg-background rounded-3xl",
        className
      )}>
        <div className="p-10 border-b border-border/50 flex items-center justify-between bg-background/50">
          <div>
            <h3 className="text-xl font-bold tracking-tight">{title}</h3>
          </div>
          <button 
            onClick={onClose} 
            type="button"
            aria-label="Close modal"
            className="hover:rotate-90 transition-transform p-2 rounded-xl hover:bg-white/5"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="p-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export { Modal };