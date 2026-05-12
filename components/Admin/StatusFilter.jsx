'use client';

import { FiGrid, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';

export default function StatusFilter({ isOpen, currentStatus, onSelect, onClose }) {
  if (!isOpen) return null;

  const options = [
    { value: 'all', label: 'All Projects', icon: <FiGrid size={14} /> },
    { value: 'online', label: 'Online Only', icon: <FiEye size={14} /> },
    { value: 'offline', label: 'Offline Only', icon: <FiEyeOff size={14} /> },
  ];

  return (
    <div className="absolute top-full left-0 mt-2 w-48 z-50">
      <div className="admin-dropdown-menu">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              onSelect(option.value);
              onClose();
            }}
            className={`admin-dropdown-item text-xs sm:text-sm ${currentStatus === option.value ? 'active' : ''}`}
          >
            <span className="flex-1 flex items-center gap-2 sm:gap-3">
              {option.icon}
              {option.label}
            </span>
            {currentStatus === option.value && <FiCheck size={12} strokeWidth={3} />}
          </button>
        ))}
      </div>
    </div>
  );
}
