'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

export function useKeyboardShortcuts(shortcuts) {
  const router = useRouter();
  const shortcutsRef = useRef(shortcuts);

  // Keep shortcuts ref up to date
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const handleKeyDown = useCallback((e) => {
    const { key, ctrlKey, metaKey, altKey, shiftKey, target } = e;
    
    // Don't trigger shortcuts when typing in inputs, textareas, or contenteditable
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.contentEditable === 'true'
    ) {
      return;
    }

    // Check all registered shortcuts
    shortcutsRef.current.forEach(({ 
      key: shortcutKey, 
      ctrl = false, 
      meta = false, 
      alt = false, 
      shift = false,
      action,
      route,
      preventDefault = true 
    }) => {
      const keyMatch = key.toLowerCase() === shortcutKey.toLowerCase();
      const ctrlMatch = ctrl === ctrlKey;
      const metaMatch = meta === metaKey;
      const altMatch = alt === altKey;
      const shiftMatch = shift === shiftKey;

      if (keyMatch && ctrlMatch && metaMatch && altMatch && shiftMatch) {
        if (preventDefault) {
          e.preventDefault();
        }

        if (route) {
          router.push(route);
        } else if (action) {
          action();
        }
      }
    });
  }, [router]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Preset shortcuts for admin dashboard
export function useAdminShortcuts({ 
  onSave, 
  onSearch, 
  onNew,
  onLogout,
  onToggleTheme 
}) {
  const router = useRouter();

  const shortcuts = [
    // Navigation
    { key: '1', action: () => router.push('/admin'), description: 'Go to Dashboard' },
    { key: '2', action: () => router.push('/admin/showcase'), description: 'Go to Showcase' },
    { key: '3', action: () => router.push('/admin/identity'), description: 'Go to Identity' },
    { key: '4', action: () => router.push('/admin/matrix'), description: 'Go to Matrix' },
    { key: '5', action: () => router.push('/admin/academy'), description: 'Go to Academy' },
    { key: '6', action: () => router.push('/admin/logbook'), description: 'Go to Logbook' },
    
    // Actions
    { key: 's', ctrl: true, action: onSave, description: 'Save changes', preventDefault: true },
    { key: 'f', ctrl: true, action: onSearch, description: 'Focus search', preventDefault: true },
    { key: 'n', ctrl: true, action: onNew, description: 'Create new item', preventDefault: true },
    { key: 'k', ctrl: true, action: onSearch, description: 'Command palette', preventDefault: true },
    
    // Other
    { key: 'l', ctrl: true, shift: true, action: onLogout, description: 'Logout', preventDefault: true },
    { key: 't', ctrl: true, shift: true, action: onToggleTheme, description: 'Toggle theme' },
    { key: 'Escape', action: () => document.activeElement?.blur(), description: 'Close/Cancel' },
  ];

  useKeyboardShortcuts(shortcuts);

  return shortcuts;
}

// Hook to show keyboard shortcut help
export function useKeyboardHelp() {
  const shortcuts = [
    { keys: ['Ctrl', '1-6'], description: 'Navigate between sections' },
    { keys: ['Ctrl', 'S'], description: 'Save changes' },
    { keys: ['Ctrl', 'F'], description: 'Focus search' },
    { keys: ['Ctrl', 'N'], description: 'Create new item' },
    { keys: ['Ctrl', 'K'], description: 'Open command palette' },
    { keys: ['Ctrl', 'Shift', 'L'], description: 'Logout' },
    { keys: ['Escape'], description: 'Close modal/cancel' },
  ];

  return shortcuts;
}

// Component to display keyboard shortcuts
export function KeyboardShortcutsHelp({ isOpen, onClose }) {
  const shortcuts = useKeyboardHelp();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[1001] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
      
      <div 
        className="admin-card w-full max-w-lg relative z-10 !p-0 overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div>
            <h3 className="text-xl font-black tracking-tight">Keyboard Shortcuts</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">
              Power User Commands
            </p>
          </div>
          <button onClick={onClose} className="admin-icon-btn hover:!rotate-90">
            <span className="text-lg">×</span>
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {shortcuts.map((shortcut, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <span className="text-sm text-slate-300">{shortcut.description}</span>
                <div className="flex items-center gap-1.5">
                  {shortcut.keys.map((key, keyIdx) => (
                    <span key={keyIdx} className="flex items-center">
                      <kbd className="kbd">{key}</kbd>
                      {keyIdx < shortcut.keys.length - 1 && (
                        <span className="text-slate-600 mx-1">+</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-white/5 bg-white/[0.02]">
          <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest">
            Press <kbd className="kbd mx-1">Escape</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
}
