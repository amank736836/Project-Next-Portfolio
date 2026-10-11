'use client';

import { useCallback } from 'react';
import { FiFileText, FiGrid, FiColumns, FiSettings, FiActivity, FiCode, FiHeart, FiCheck, FiUpload, FiTrash2, FiExternalLink, FiStar } from 'react-icons/fi';
import { useSuccessToast, useErrorToast } from '@/components/Admin/Toast';
import { useToast } from '@/components/Admin/Toast';
import { Button } from '@/components/ui/Button';
import { PORTFOLIO_LAYOUTS, SITE_MODES, UI_FEATURES } from './settings-config';
import ResumesTab from '@/components/Admin/ResumesTab';

export default function LayoutTab({ 
  resumeUrl, 
  setResumeUrl, 
  portfolioLayout, 
  setPortfolioLayout, 
  siteMode, 
  setSiteMode, 
  uiFeatures, 
  setUiFeatures,
  uploadingResume,
  setUploadingResume,
  resumesCount 
}) {
  const addToast = useToast();
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const handleResumeUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { errorToast('Only PDF files allowed'); return; }
    if (file.size > 5 * 1024 * 1024) { errorToast('File too large (max 5MB)'); return; }

    setUploadingResume(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        await fetch('/api/admin/info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'resume_url', title: 'Resume URL', description: data.url }),
        });
        setResumeUrl(data.url);
        successToast('Resume uploaded');
      } else {
        errorToast(data.error || 'Upload failed');
      }
    } catch (e) {
      errorToast('Upload failed');
    } finally {
      setUploadingResume(false);
      e.target.value = '';
    }
  }, [successToast, errorToast, setResumeUrl, setUploadingResume]);

  const handleResumeDelete = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/info?key=resume_url', { method: 'DELETE' });
      if (res.ok) {
        setResumeUrl('');
        successToast('Resume removed');
      } else {
        errorToast('Failed to remove');
      }
    } catch (e) {
      errorToast('Network error');
    }
  }, [successToast, errorToast, setResumeUrl]);

  const openResume = useCallback(() => {
    if (resumeUrl) window.open(resumeUrl, '_blank', 'noopener,noreferrer');
  }, [resumeUrl]);

  const savePortfolioLayout = useCallback(async (layout) => {
    try {
      const res = await fetch('/api/admin/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'portfolio_layout', title: 'Portfolio Layout', description: layout }),
      });
      if (res.ok) {
        setPortfolioLayout(layout);
        successToast(`Portfolio layout set to ${layout === 'masonry' ? 'Masonry' : 'Fixed Ratio'}`);
      } else {
        errorToast('Failed to save layout');
      }
    } catch (e) {
      errorToast('Network error');
    }
  }, [setPortfolioLayout, successToast, errorToast]);

  const saveSiteMode = useCallback(async (mode) => {
    try {
      const res = await fetch('/api/admin/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'site_mode', title: 'Site Mode', description: mode }),
      });
      if (res.ok) {
        setSiteMode(mode);
        successToast(`Site mode set to ${mode === 'single' ? 'Single Page' : 'Multi-Page'}`);
      } else {
        errorToast('Failed to save site mode');
      }
    } catch (e) {
      errorToast('Network error');
    }
  }, [setSiteMode, successToast, errorToast]);

  const saveUIFeature = useCallback(async (key, value) => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, description: value }),
      });
      if (res.ok) {
        setUiFeatures(prev => ({ ...prev, [key]: value }));
        successToast('UI feature updated');
      } else {
        errorToast('Failed to save');
      }
    } catch (e) {
      errorToast('Network error');
    }
  }, [setUiFeatures, successToast, errorToast]);

  const toggleUIFeature = useCallback((key) => {
    const current = uiFeatures[key] !== 'false';
    saveUIFeature(key, (!current).toString());
  }, [uiFeatures, saveUIFeature]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const event = { target: { files: e.dataTransfer.files } };
      handleResumeUpload(event);
    }
  }, [handleResumeUpload]);

  return (
    <>
      <section className="admin-settings__section animate-slide-up" style={{ animationDelay: '0ms' }}>
        <div className="section-header">
          <FiFileText className="section-icon" />
          <div>
            <h2>Resume / CV</h2>
            <p className="section-desc">Upload your resume (PDF, max 5MB). Visitors can download it from your portfolio.</p>
          </div>
        </div>

        <div className="resume-card layout-option-card">
          {resumeUrl ? (
            <div className="resume-uploaded">
              <div className="resume-info">
                <div className="resume-icon-wrapper">
                  <FiFileText className="resume-icon" size={32} />
                </div>
                <div>
                  <p className="resume-filename">resume.pdf</p>
                  <p className="resume-url">Stored on Supabase Storage</p>
                </div>
              </div>
              <div className="resume-actions">
                <Button variant="secondary" onClick={openResume}><FiExternalLink size={16} /> View</Button>
                <Button variant="ghost" destructive onClick={handleResumeDelete}><FiTrash2 size={16} /> Remove</Button>
              </div>
            </div>
          ) : (
            <div className="resume-upload">
              <div
                className="upload-zone"
                onClick={e => e.currentTarget.querySelector('input').click()}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <div className="upload-icon-wrapper">
                  <FiUpload className="upload-icon" size={48} />
                </div>
                <p>Drag & drop or click to upload PDF</p>
                <span className="upload-hint">Max 5MB • PDF only</span>
                <input type="file" accept=".pdf" onChange={handleResumeUpload} disabled={uploadingResume} className="file-input" />
              </div>
            </div>
          )}
          {uploadingResume && <div className="upload-progress">Uploading...</div>}
        </div>
      </section>

      <section className="admin-settings__section animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="section-header">
          <FiGrid className="section-icon" />
          <div>
            <h2>Portfolio Layout</h2>
            <p className="section-desc">Choose how projects are displayed on the public portfolio page.</p>
          </div>
        </div>

        <div className="layout-options-grid">
          {PORTFOLIO_LAYOUTS.map(layout => (
            <button
              key={layout.key}
              type="button"
              className={`layout-option-card ${portfolioLayout === layout.key ? 'active' : ''}`}
              onClick={() => savePortfolioLayout(layout.key)}
              disabled={portfolioLayout === layout.key}
            >
              <div className="layout-option-preview">
                <layout.icon size={28} />
              </div>
              <div className="layout-option-info">
                <span className="layout-option-label">{layout.label}</span>
                <span className="layout-option-desc">{layout.desc}</span>
              </div>
              {portfolioLayout === layout.key && (
                <FiCheck className="layout-option-check" size={20} />
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="admin-settings__section animate-slide-up" style={{ animationDelay: '200ms' }}>
        <div className="section-header">
          <FiColumns className="section-icon" />
          <div>
            <h2>Site Mode</h2>
            <p className="section-desc">Choose between multi-page navigation or single-page scroll.</p>
          </div>
        </div>

        <div className="layout-options-grid">
          {SITE_MODES.map(mode => (
            <button
              key={mode.key}
              type="button"
              className={`layout-option-card ${siteMode === mode.key ? 'active' : ''}`}
              onClick={() => saveSiteMode(mode.key)}
              disabled={siteMode === mode.key}
            >
              <div className="layout-option-preview">
                <mode.icon size={28} />
              </div>
              <div className="layout-option-info">
                <span className="layout-option-label">{mode.label}</span>
                <span className="layout-option-desc">{mode.desc}</span>
              </div>
              {siteMode === mode.key && (
                <FiCheck className="layout-option-check" size={20} />
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="admin-settings__section animate-slide-up" style={{ animationDelay: '300ms' }}>
        <div className="section-header">
          <FiSettings className="section-icon" />
          <div>
            <h2>UI Features</h2>
            <p className="section-desc">Toggle visual effects and animations on your portfolio.</p>
          </div>
        </div>

        <div className="ui-features-grid">
          {UI_FEATURES.map(feature => {
            const isEnabled = uiFeatures[feature.key] !== 'false';
            return (
              <div key={feature.key} className="ui-feature-card">
                <div className="ui-feature-info">
                  <div className="ui-feature-icon-wrapper">
                    <feature.icon className="ui-feature-icon" size={24} />
                  </div>
                  <div>
                    <span className="ui-feature-label">{feature.label}</span>
                    <span className="ui-feature-desc">{feature.desc}</span>
                  </div>
                </div>
                <div className="ui-feature-toggle-wrapper">
                  <label className={`cyber-toggle ${isEnabled ? 'active' : ''}`} onClick={() => toggleUIFeature(feature.key)}>
                    <span className="cyber-toggle-track">
                      <span className="cyber-toggle-thumb"></span>
                      <span className="cyber-toggle-glow" />
                    </span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}