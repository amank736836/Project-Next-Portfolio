'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { FiAlertTriangle, FiTrash2, FiShield, FiX, FiCheck } from 'react-icons/fi';
import { createPortal } from 'react-dom';

/* ─── Context ─────────────────────────────────────────────────────── */
const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [modal, setModal]     = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const confirm = useCallback(
    (opts) => new Promise((resolve) => setModal({ ...opts, resolve })),
    []
  );
  const handleConfirm = useCallback(() => setModal(p => { p?.resolve(true);  return null; }), []);
  const handleCancel  = useCallback(() => setModal(p => { p?.resolve(false); return null; }), []);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {mounted && modal && createPortal(
        <ConfirmModal {...modal} onConfirm={handleConfirm} onCancel={handleCancel} />,
        document.body
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx.confirm;
}

/* ─── Per-type style tokens (inline — never purged by Tailwind) ───── */
const TYPES = {
  danger: {
    Icon:          FiTrash2,
    iconColor:     '#f87171',
    iconBg:        'rgba(239,68,68,0.12)',
    iconBorder:    'rgba(239,68,68,0.25)',
    cardBorder:    'rgba(239,68,68,0.45)',
    topGlow:       'rgba(239,68,68,0.18)',
    confirmBg:     '#dc2626',
    confirmBgHov:  '#ef4444',
    confirmColor:  '#ffffff',
    confirmShadow: '0 4px 20px rgba(239,68,68,0.45)',
  },
  warning: {
    Icon:          FiAlertTriangle,
    iconColor:     '#fbbf24',
    iconBg:        'rgba(245,158,11,0.12)',
    iconBorder:    'rgba(245,158,11,0.25)',
    cardBorder:    'rgba(245,158,11,0.45)',
    topGlow:       'rgba(245,158,11,0.18)',
    confirmBg:     '#f59e0b',
    confirmBgHov:  '#fbbf24',
    confirmColor:  '#000000',
    confirmShadow: '0 4px 20px rgba(245,158,11,0.45)',
  },
  info: {
    Icon:          FiShield,
    iconColor:     '#818cf8',
    iconBg:        'rgba(99,102,241,0.12)',
    iconBorder:    'rgba(99,102,241,0.25)',
    cardBorder:    'rgba(99,102,241,0.45)',
    topGlow:       'rgba(99,102,241,0.18)',
    confirmBg:     '#4f46e5',
    confirmBgHov:  '#6366f1',
    confirmColor:  '#ffffff',
    confirmShadow: '0 4px 20px rgba(99,102,241,0.45)',
  },
  success: {
    Icon:          FiCheck,
    iconColor:     '#34d399',
    iconBg:        'rgba(16,185,129,0.12)',
    iconBorder:    'rgba(16,185,129,0.25)',
    cardBorder:    'rgba(16,185,129,0.45)',
    topGlow:       'rgba(16,185,129,0.18)',
    confirmBg:     '#059669',
    confirmBgHov:  '#10b981',
    confirmColor:  '#ffffff',
    confirmShadow: '0 4px 20px rgba(16,185,129,0.45)',
  },
};

/* ─── Modal ───────────────────────────────────────────────────────── */
function ConfirmModal({
  title       = 'Confirm Action',
  message     = 'Are you sure?',
  type        = 'warning',
  confirmText = 'Confirm',
  cancelText  = 'Cancel',
  onConfirm,
  onCancel,
}) {
  const cfg = TYPES[type] ?? TYPES.warning;
  const { Icon } = cfg;

  const [confirmHovered, setConfirmHovered] = useState(false);
  const [cancelHovered,  setCancelHovered]  = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter')  onConfirm();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onConfirm, onCancel]);

  /* ── inline style objects ── */
  const backdropStyle = {
    position: 'fixed', inset: 0, zIndex: 9999,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px',
    backgroundColor: 'rgba(0,0,0,0.76)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
  };

  const cardStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: '420px',
    borderRadius: '20px',
    border: `1px solid ${cfg.cardBorder}`,
    backgroundColor: 'rgba(10,14,28,0.96)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: `0 0 0 1px rgba(255,255,255,0.05), 0 40px 80px -12px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.07)`,
    overflow: 'hidden',
    color: '#ffffff',           /* ← Forces white on ALL children */
    fontFamily: 'inherit',
  };

  const topGlowStyle = {
    position: 'absolute', inset: '0', bottom: 'auto',
    height: '120px', borderRadius: '20px 20px 0 0',
    background: `linear-gradient(to bottom, ${cfg.topGlow}, transparent)`,
    pointerEvents: 'none',
  };

  const headerStyle = {
    display: 'flex', alignItems: 'flex-start', gap: '16px',
    padding: '28px 28px 20px',
    position: 'relative',
  };

  const iconWrapStyle = {
    flexShrink: 0, width: '44px', height: '44px',
    borderRadius: '12px', border: `1px solid ${cfg.iconBorder}`,
    backgroundColor: cfg.iconBg,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };

  const titleStyle = {
    fontSize: '17px', fontWeight: 900,
    letterSpacing: '-0.02em', lineHeight: 1.25,
    color: '#ffffff', margin: 0,
  };

  const subtitleStyle = {
    fontSize: '10px', fontWeight: 800,
    textTransform: 'uppercase', letterSpacing: '0.3em',
    color: 'rgba(255,255,255,0.3)', marginTop: '6px',
  };

  const closeBtnStyle = {
    flexShrink: 0, marginLeft: 'auto',
    width: '30px', height: '30px',
    borderRadius: '10px', border: 'none',
    backgroundColor: cancelHovered ? 'rgba(255,255,255,0.08)' : 'transparent',
    color: cancelHovered ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s',
  };

  const dividerStyle = {
    height: '1px', margin: '0 28px',
    backgroundColor: 'rgba(255,255,255,0.06)',
  };

  const bodyStyle = {
    padding: '20px 28px 24px',
    fontSize: '14px', lineHeight: '1.65',
    color: 'rgba(255,255,255,0.75)',
    margin: 0,
  };

  const footerStyle = {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
    padding: '0 28px 28px',
  };

  const cancelBtnStyle = {
    padding: '12px 16px', borderRadius: '14px',
    fontSize: '11px', fontWeight: 800,
    textTransform: 'uppercase', letterSpacing: '0.12em',
    whiteSpace: 'nowrap', cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.12)',
    backgroundColor: cancelHovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
    color: cancelHovered ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)',
    transition: 'all 0.2s',
  };

  const confirmBtnStyle = {
    padding: '12px 16px', borderRadius: '14px',
    fontSize: '11px', fontWeight: 800,
    textTransform: 'uppercase', letterSpacing: '0.12em',
    whiteSpace: 'nowrap', cursor: 'pointer',
    border: 'none',
    backgroundColor: confirmHovered ? cfg.confirmBgHov : cfg.confirmBg,
    color: cfg.confirmColor,
    boxShadow: confirmHovered ? cfg.confirmShadow.replace('0.45', '0.65') : cfg.confirmShadow,
    transform: confirmHovered ? 'translateY(-1px)' : 'translateY(0)',
    transition: 'all 0.2s',
  };

  return (
    <div style={backdropStyle} onClick={onCancel}>
      <div style={cardStyle} onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
        {/* top glow */}
        <div style={topGlowStyle} />

        {/* header */}
        <div style={headerStyle}>
          <div style={iconWrapStyle}>
            <Icon size={20} style={{ color: cfg.iconColor }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={titleStyle}>{title}</p>
            <p style={subtitleStyle}>Security Confirmation Required</p>
          </div>
          <button
            onClick={onCancel}
            style={closeBtnStyle}
            onMouseEnter={() => setCancelHovered(true)}
            onMouseLeave={() => setCancelHovered(false)}
            aria-label="Close"
          >
            <FiX size={14} />
          </button>
        </div>

        {/* divider */}
        <div style={dividerStyle} />

        {/* body */}
        <p style={bodyStyle}>{message}</p>

        {/* footer */}
        <div style={footerStyle}>
          <button
            onClick={onCancel}
            style={cancelBtnStyle}
            onMouseEnter={() => setCancelHovered(true)}
            onMouseLeave={() => setCancelHovered(false)}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            autoFocus
            style={confirmBtnStyle}
            onMouseEnter={() => setConfirmHovered(true)}
            onMouseLeave={() => setConfirmHovered(false)}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Preset hooks ────────────────────────────────────────────────── */

export function useDeleteConfirm() {
  const confirm = useConfirm();
  return useCallback((name = 'this item') => confirm({
    title: 'Delete Confirmation',
    message: `Are you sure you want to delete "${name}"? This action cannot be undone and the data will be permanently removed from the system.`,
    type: 'danger', confirmText: 'Delete', cancelText: 'Cancel',
  }), [confirm]);
}

export function useEjectConfirm() {
  const confirm = useConfirm();
  return useCallback((name = 'this node') => confirm({
    title: 'Node Ejection Protocol',
    message: `Initiating ejection sequence for "${name}". This will permanently remove the node from the matrix. Confirm to proceed with ejection.`,
    type: 'warning', confirmText: 'Eject Node', cancelText: 'Abort',
  }), [confirm]);
}

export function useSaveConfirm() {
  const confirm = useConfirm();
  return useCallback(() => confirm({
    title: 'Commit Changes',
    message: 'You have unsaved changes. Do you want to commit these changes to the matrix?',
    type: 'info', confirmText: 'Commit', cancelText: 'Discard',
  }), [confirm]);
}
