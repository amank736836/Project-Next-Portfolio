'use client';

import { useState, useCallback } from 'react';
import { FiEdit3, FiTrash2, FiPlus, FiExternalLink, FiCheck, FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import { useSuccessToast, useErrorToast } from '@/components/Admin/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SOCIAL_PLATFORMS, normalizeSocialValue, extractDisplayValue } from './settings-config';

export default function SocialLinksTab({ 
  socialLinks, 
  setSocialLinks, 
  socialLinksData, 
  setSocialLinksData,
  savingSocial,
  setSavingSocial 
}) {
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState('');

  const saveSocialLink = useCallback(async (key, value) => {
    const platform = SOCIAL_PLATFORMS.find(p => p.key === key);
    const normalized = normalizeSocialValue(value, platform);
    setSavingSocial(true);
    try {
      const existing = socialLinksData.find(s => s.platform === key);
      const payload = {
        platform: key,
        url: normalized,
        label: platform.label,
        icon: platform.key,
        is_hidden: existing?.is_hidden || false,
      };
      const url = existing ? `/api/admin/social-links/${existing.id}` : '/api/admin/social-links';
      const method = existing ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setSocialLinks(prev => ({ ...prev, [key]: normalized }));
        if (!existing) {
          setSocialLinksData(prev => [...prev, data.data]);
        } else {
          setSocialLinksData(prev => prev.map(s => s.platform === key ? data.data : s));
        }
        successToast(`${platform.label} saved`);
      } else {
        errorToast('Failed to save');
      }
    } catch (e) {
      errorToast('Network error');
    } finally {
      setSavingSocial(false);
      setEditingKey(null);
      setEditValue('');
    }
  }, [socialLinksData, setSocialLinks, setSocialLinksData, successToast, errorToast, setSavingSocial]);

  const deleteSocialLink = useCallback(async (key) => {
    const platform = SOCIAL_PLATFORMS.find(p => p.key === key);
    const existing = socialLinksData.find(s => s.platform === key);
    if (!existing) return;
    setSavingSocial(true);
    try {
      const res = await fetch(`/api/admin/social-links/${existing.id}`, { method: 'DELETE' });
      if (res.ok) {
        setSocialLinks(prev => { const next = { ...prev }; delete next[key]; return next; });
        setSocialLinksData(prev => prev.filter(s => s.platform !== key));
        successToast(`${platform.label} removed`);
      } else {
        errorToast('Failed to delete');
      }
    } catch (e) {
      errorToast('Network error');
    } finally {
      setSavingSocial(false);
    }
  }, [socialLinksData, setSocialLinks, setSocialLinksData, successToast, errorToast, setSavingSocial]);

  const toggleSocialVisibility = useCallback(async (key, currentStatus) => {
    const existing = socialLinksData.find(s => s.platform === key);
    if (!existing) return;
    try {
      const res = await fetch(`/api/admin/social-links/${existing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_hidden: !currentStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setSocialLinksData(prev => prev.map(s => s.platform === key ? data.data : s));
        successToast(currentStatus ? 'Link is now visible' : 'Link is now hidden');
      } else {
        errorToast('Failed to update visibility');
      }
    } catch (e) {
      errorToast('Network error');
    }
  }, [socialLinksData, setSocialLinksData, successToast, errorToast]);

  const handleEditClick = useCallback((key) => {
    const platform = SOCIAL_PLATFORMS.find(p => p.key === key);
    const value = socialLinks[key] || '';
    setEditingKey(key);
    setEditValue(extractDisplayValue(value, platform));
  }, [socialLinks]);

  const handleSaveClick = useCallback((key) => {
    saveSocialLink(key, editValue);
  }, [saveSocialLink, editValue]);

  const handleKeyDown = useCallback((e, key) => {
    if (e.key === 'Enter') handleSaveClick(key);
    if (e.key === 'Escape') { setEditingKey(null); setEditValue(''); }
  }, [handleSaveClick]);

  return (
    <section className="admin-settings__section animate-slide-up" style={{ animationDelay: '0ms' }}>
      <div className="section-header">
        <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
        <div>
          <h2>Social Links</h2>
          <p className="section-desc">Manage public profile links displayed on your portfolio.</p>
        </div>
      </div>

      <div className="social-links-grid">
        {SOCIAL_PLATFORMS.map(platform => {
          const value = socialLinks[platform.key] || '';
          const isEditing = editingKey === platform.key;
          const hasValue = Boolean(value);
          const platformData = socialLinksData.find(s => s.platform === platform.key);
          const isHidden = platformData?.is_hidden || false;
          const platformInfo = SOCIAL_PLATFORMS.find(p => p.key === platform.key);

          return (
            <div
              key={platform.key}
              className={`social-card ${isEditing ? 'editing' : ''} ${hasValue ? 'has-value' : ''}`}
            >
              <div className="social-card__top">
                <div className="social-card__brand">
                  <div className={`social-brand-icon ${platform.key}`}>
                    <platform.icon />
                  </div>
                  <span className="social-brand-label">{platform.label}</span>
                </div>

                <div className="platform-actions">
                  {!isEditing && hasValue && (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => handleEditClick(platform.key)}>
                        <FiEdit3 size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" destructive onClick={() => deleteSocialLink(platform.key)}>
                        <FiTrash2 size={16} />
                      </Button>
                    </>
                  )}
                  {!isEditing && !hasValue && (
                    <Button variant="primary" size="sm" onClick={() => handleEditClick(platform.key)}>
                      <FiPlus size={16} /> Add
                    </Button>
                  )}
                </div>
              </div>

              <div className="social-card__body">
                {isEditing ? (
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onKeyDown={e => handleKeyDown(e, platform.key)}
                      onBlur={() => handleSaveClick(platform.key)}
                      placeholder={platform.placeholder}
                      autoFocus
                      className="edit-input"
                    />
                    <Button variant="ghost" size="sm" onClick={() => { setEditingKey(null); setEditValue(''); }}>
                      <FiX size={16} />
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => handleSaveClick(platform.key)} disabled={savingSocial}>
                      <FiCheck size={16} />
                    </Button>
                  </div>
                ) : hasValue ? (
                  <a href={normalizeSocialValue(value, platformInfo)} target="_blank" rel="noopener noreferrer">
                    {extractDisplayValue(value, platformInfo)}
                    <FiExternalLink size={12} />
                  </a>
                ) : (
                  <span className="text-slate-500 text-xs italic">Not configured</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}