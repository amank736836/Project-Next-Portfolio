'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { FiAlertTriangle, FiTrash2, FiShield, FiX, FiCheck } from 'react-icons/fi';
import { createPortal } from 'react-dom';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [modal, setModal] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setModal({ ...options, resolve });
    });
  }, []);

  const handleConfirm = () => {
    if (modal) {
      modal.resolve(true);
      setModal(null);
    }
  };

  const handleCancel = () => {
    if (modal) {
      modal.resolve(false);
      setModal(null);
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {mounted && modal && createPortal(
        <ConfirmModal 
          {...modal} 
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />,
        document.body
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within ConfirmProvider');
  }
  return context.confirm;
}

function ConfirmModal({ 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}) {
  const [exiting, setExiting] = useState(false);

  const handleClose = (confirmed) => {
    setExiting(true);
    setTimeout(() => {
      if (confirmed) onConfirm();
      else onCancel();
    }, 200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') handleClose(false);
    if (e.key === 'Enter') handleClose(true);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const config = {
    danger: {
      icon: <FiTrash2 className="text-rose-400" size={28} />,
      confirmClass: 'admin-btn-danger',
      borderColor: 'border-rose-500/30',
      glowColor: 'shadow-rose-500/10',
    },
    warning: {
      icon: <FiAlertTriangle className="text-amber-400" size={28} />,
      confirmClass: 'bg-amber-500 hover:bg-amber-400 text-black',
      borderColor: 'border-amber-500/30',
      glowColor: 'shadow-amber-500/10',
    },
    info: {
      icon: <FiShield className="text-indigo-400" size={28} />,
      confirmClass: 'admin-btn-primary',
      borderColor: 'border-indigo-500/30',
      glowColor: 'shadow-indigo-500/10',
    },
    success: {
      icon: <FiCheck className="text-emerald-400" size={28} />,
      confirmClass: 'bg-emerald-500 hover:bg-emerald-400 text-black',
      borderColor: 'border-emerald-500/30',
      glowColor: 'shadow-emerald-500/10',
    },
  };

  const { icon, confirmClass, borderColor, glowColor } = config[type];

  return (
    <div 
      className={`fixed inset-0 z-[1000] flex items-center justify-center p-4 ${exiting ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
      onClick={() => handleClose(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
      
      {/* Modal */}
      <div 
        className={`admin-card w-full max-w-md relative z-10 !p-0 overflow-hidden animate-slide-up ${borderColor} ${glowColor}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center gap-4 bg-white/[0.02]">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight">{title}</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">
              Security Confirmation Required
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-slate-300 text-sm leading-relaxed mb-8">
            {message}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button 
              onClick={() => handleClose(false)}
              className="admin-btn admin-btn-secondary !px-6"
            >
              {cancelText}
            </button>
            <button 
              onClick={() => handleClose(true)}
              className={`admin-btn ${confirmClass} !px-6`}
              autoFocus
            >
              {confirmText}
            </button>
          </div>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/[0.03] to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

// Preset confirm functions for common actions
export function useDeleteConfirm() {
  const confirm = useConfirm();
  return useCallback((itemName = 'this item') => {
    return confirm({
      title: 'Delete Confirmation',
      message: `Are you sure you want to delete ${itemName}? This action cannot be undone and the data will be permanently removed from the system.`,
      type: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });
  }, [confirm]);
}

export function useEjectConfirm() {
  const confirm = useConfirm();
  return useCallback((nodeName = 'this node') => {
    return confirm({
      title: 'Node Ejection Protocol',
      message: `Initiating ejection sequence for ${nodeName}. This will permanently remove the node from the matrix. Confirm to proceed with ejection.`,
      type: 'warning',
      confirmText: 'Eject Node',
      cancelText: 'Abort',
    });
  }, [confirm]);
}

export function useSaveConfirm() {
  const confirm = useConfirm();
  return useCallback(() => {
    return confirm({
      title: 'Commit Changes',
      message: 'You have unsaved changes. Do you want to commit these changes to the matrix?',
      type: 'info',
      confirmText: 'Commit',
      cancelText: 'Discard',
    });
  }, [confirm]);
}
