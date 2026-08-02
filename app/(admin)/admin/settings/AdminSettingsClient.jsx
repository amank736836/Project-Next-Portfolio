'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  FiLinkedin, FiGithub, FiTwitter, FiMail, FiGlobe, FiFileText, FiUpload, FiCheck, FiX, FiEdit3, FiTrash2, FiExternalLink, FiPlus, FiGrid, FiLayout, FiColumns, FiToggleRight, FiToggleLeft, FiImage, FiStar, FiTrash, FiEdit2, FiFacebook, FiInstagram, FiMessageSquare, FiSend, FiEye, FiEyeOff, FiDownload, FiHeart, FiActivity, FiSettings, FiLayers, FiCode, FiDatabase, FiServer, FiGlobe as FiGlobe2
} from 'react-icons/fi';
import { Ghost, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast, useSuccessToast, useErrorToast } from '@/components/Admin/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import ResumesTab from '@/components/Admin/ResumesTab';

const SOCIAL_PLATFORMS = [
  { key: 'linkedin', label: 'LinkedIn', icon: FiLinkedin, placeholder: 'username or full URL', urlPrefix: 'https://linkedin.com/in/', brandColor: '#0A66C2', brandGlow: 'rgba(10, 102, 194, 0.3)' },
  { key: 'github', label: 'GitHub', icon: FiGithub, placeholder: 'username or full URL', urlPrefix: 'https://github.com/', brandColor: '#24292E', brandGlow: 'rgba(36, 41, 46, 0.3)' },
  { key: 'twitter', label: 'Twitter / X', icon: FiTwitter, placeholder: 'username or full URL', urlPrefix: 'https://x.com/', brandColor: '#000000', brandGlow: 'rgba(0, 0, 0, 0.3)' },
  { key: 'facebook', label: 'Facebook', icon: FiFacebook, placeholder: 'username or full URL', urlPrefix: 'https://facebook.com/', brandColor: '#1877F2', brandGlow: 'rgba(24, 119, 242, 0.3)' },
  { key: 'instagram', label: 'Instagram', icon: FiInstagram, placeholder: 'username or full URL', urlPrefix: 'https://instagram.com/', brandColor: '#E4405F', brandGlow: 'rgba(228, 64, 95, 0.3)' },
  { key: 'threads', label: 'Threads', icon: FiMessageSquare, placeholder: 'username or full URL', urlPrefix: 'https://threads.net/@', brandColor: '#000000', brandGlow: 'rgba(0, 0, 0, 0.3)' },
  { key: 'snapchat', label: 'Snapchat', icon: Ghost, placeholder: 'username or full URL', urlPrefix: 'https://snapchat.com/add/', brandColor: '#FFFC00', brandGlow: 'rgba(255, 252, 0, 0.3)' },
  { key: 'telegram', label: 'Telegram', icon: Send, placeholder: 'username or full URL', urlPrefix: 'https://t.me/', brandColor: '#0088CC', brandGlow: 'rgba(0, 136, 204, 0.3)' },
  { key: 'email', label: 'Email', icon: FiMail, placeholder: 'email@example.com', urlPrefix: 'mailto:', brandColor: '#EA4335', brandGlow: 'rgba(234, 67, 53, 0.3)' },
  { key: 'website', label: 'Website', icon: FiGlobe, placeholder: 'https://example.com', urlPrefix: '', brandColor: '#6366F1', brandGlow: 'rgba(99, 102, 241, 0.3)' },
];

const PORTFOLIO_LAYOUTS = [
  { key: 'masonry', label: 'Masonry (Pinterest-style)', desc: 'Images keep original aspect ratios, brick wall layout', icon: FiGrid },
  { key: 'fixed', label: 'Fixed Ratio (Grid)', desc: 'All images same 5:2 ratio, uniform grid', icon: FiLayout },
];

const SITE_MODES = [
  { key: 'multi', label: 'Multi-Page', desc: 'Separate pages for each section (default)', icon: FiLayout },
  { key: 'single', label: 'Single Page', desc: 'All sections on one continuous page', icon: FiColumns },
];

const UI_FEATURES = [
  { key: 'enable_scroll_reveal', label: 'Scroll Reveal Animations', desc: 'Fade/slide animations when sections enter viewport', icon: FiActivity },
  { key: 'enable_typewriter', label: 'Typewriter Effect', desc: 'Animated typing text in hero section', icon: FiCode },
  { key: 'enable_open_to_work', label: 'Open to Opportunities Badge', desc: 'Show availability badge in hero section', icon: FiHeart },
];

function normalizeSocialValue(value, platform) {
  if (!value) return '';
  const trimmed = value.trim();
  if (platform.key === 'email' && !trimmed.includes('@')) return '';
  if (platform.key === 'email' && !trimmed.startsWith('mailto:')) return `mailto:${trimmed}`;
  if (['linkedin', 'github', 'twitter', 'facebook', 'instagram', 'threads', 'snapchat', 'telegram', 'website'].includes(platform.key)) {
    if (trimmed.startsWith('http')) return trimmed;
    if (trimmed.includes('.')) return `https://${trimmed}`;
    return `${platform.urlPrefix}${trimmed}`;
  }
  return trimmed;
}

function extractDisplayValue(storedValue, platform) {
  if (!storedValue) return '';
  if (platform.key === 'email') return storedValue.replace('mailto:', '');
  if (['linkedin', 'github', 'twitter', 'facebook', 'instagram', 'threads', 'snapchat', 'telegram', 'website'].includes(platform.key)) {
    if (storedValue.startsWith(platform.urlPrefix)) {
      return storedValue.replace(platform.urlPrefix, '');
    }
    if (storedValue.startsWith('https://') || storedValue.startsWith('http://')) {
      return storedValue;
    }
  }
  return storedValue;
}

export default function AdminSettingsClient({
  initialSocialLinks = {},
  initialSocialLinksData = [],
  initialResumeUrl = '',
  initialResumesCount = 0,
  initialPortfolioLayout = 'masonry',
  initialSiteMode = 'multi',
  initialUIFeatures = {},
  initialHeroImages = []
}) {
  const router = useRouter();
  const addToast = useToast();
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();

  const [socialLinks, setSocialLinks] = useState(initialSocialLinks);
  const [socialLinksData, setSocialLinksData] = useState(initialSocialLinksData);
  const [resumeUrl, setResumeUrl] = useState(initialResumeUrl);
  const [portfolioLayout, setPortfolioLayout] = useState(initialPortfolioLayout);
  const [siteMode, setSiteMode] = useState(initialSiteMode);
  const [uiFeatures, setUiFeatures] = useState(initialUIFeatures);
  const [heroImages, setHeroImages] = useState(initialHeroImages);
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [savingSocial, setSavingSocial] = useState(false);
  const [savingLayout, setSavingLayout] = useState(false);
  const [savingSiteMode, setSavingSiteMode] = useState(false);
  const [savingUIFeature, setSavingUIFeature] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [editingHeroImageId, setEditingHeroImageId] = useState(null);
  const [editHeroAltText, setEditHeroAltText] = useState('');
  const [resumesCount, setResumesCount] = useState(initialResumesCount);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    setSocialLinks(initialSocialLinks);
  }, [initialSocialLinks]);

  useEffect(() => {
    setSocialLinksData(initialSocialLinksData);
  }, [initialSocialLinksData]);

  useEffect(() => {
    setResumeUrl(initialResumeUrl);
  }, [initialResumeUrl]);

  useEffect(() => {
    setUiFeatures(initialUIFeatures);
  }, [initialUIFeatures]);

  useEffect(() => {
    setResumesCount(initialResumesCount);
  }, [initialResumesCount]);

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
  }, [socialLinksData, successToast, errorToast]);

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
  }, [socialLinksData, successToast, errorToast]);

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
  }, [socialLinksData, successToast, errorToast]);

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
  }, [successToast, errorToast]);

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
  }, [successToast, errorToast]);

  const openResume = useCallback(() => {
    if (resumeUrl) window.open(resumeUrl, '_blank', 'noopener,noreferrer');
  }, [resumeUrl]);

  const savePortfolioLayout = useCallback(async (layout) => {
    setSavingLayout(true);
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
    } finally {
      setSavingLayout(false);
    }
  }, [successToast, errorToast]);

  const saveSiteMode = useCallback(async (mode) => {
    setSavingSiteMode(true);
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
    } finally {
      setSavingSiteMode(false);
    }
  }, [successToast, errorToast]);

  const saveUIFeature = useCallback(async (key, value) => {
    setSavingUIFeature(key);
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
    } finally {
      setSavingUIFeature(null);
    }
  }, [successToast, errorToast]);

  const toggleUIFeature = useCallback((key) => {
    const current = uiFeatures[key] !== 'false';
    saveUIFeature(key, (!current).toString());
  }, [uiFeatures, saveUIFeature]);

  const handleHeroImageUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      errorToast('Only JPEG, PNG, WebP allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      errorToast('File too large (max 5MB)');
      return;
    }

    setUploadingHeroImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('altText', file.name);
      formData.append('isHero', 'false');

      const res = await fetch('/api/admin/hero-images', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.data) {
        setHeroImages(prev => [...prev, data.data]);
        successToast('Hero image uploaded');
      } else {
        errorToast(data.error || 'Upload failed');
      }
    } catch (e) {
      errorToast('Upload failed');
    } finally {
      setUploadingHeroImage(false);
      e.target.value = '';
    }
  }, [successToast, errorToast]);

  const handleHeroImageDelete = useCallback(async (id) => {
    if (!confirm('Delete this hero image?')) return;
    try {
      const res = await fetch(`/api/admin/hero-images/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHeroImages(prev => prev.filter(img => img.id !== id));
        successToast('Hero image deleted');
      } else {
        errorToast('Failed to delete');
      }
    } catch (e) {
      errorToast('Network error');
    }
  }, [successToast, errorToast]);

  const handleHeroImageSetHero = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/admin/hero-images/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_hero: true })
      });
      if (res.ok) {
        setHeroImages(prev => prev.map(img => ({ ...img, is_hero: img.id === id })));
        successToast('Hero image updated');
      } else {
        errorToast('Failed to set as hero');
      }
    } catch (e) {
      errorToast('Network error');
    }
  }, [successToast, errorToast]);

  const handleHeroImageEditAlt = useCallback((id) => {
    const img = heroImages.find(i => i.id === id);
    if (img) {
      setEditingHeroImageId(id);
      setEditHeroAltText(img.alt_text || '');
    }
  }, [heroImages]);

  const handleHeroImageSaveAlt = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/admin/hero-images/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alt_text: editHeroAltText })
      });
      if (res.ok) {
        setHeroImages(prev => prev.map(img => img.id === id ? { ...img, alt_text: editHeroAltText } : img));
        setEditingHeroImageId(null);
        setEditHeroAltText('');
        successToast('Alt text updated');
      } else {
        errorToast('Failed to update');
      }
    } catch (e) {
      errorToast('Network error');
    }
  }, [editHeroAltText, successToast, errorToast]);

  const handleHeroImageCancelEdit = useCallback(() => {
    setEditingHeroImageId(null);
    setEditHeroAltText('');
  }, []);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, [setDragActive]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const event = { target: { files: e.dataTransfer.files } };
      handleHeroImageUpload(event);
    }
  }, [handleHeroImageUpload, setDragActive]);

  const [activeTab, setActiveTab] = useState('social');

  const TABS = [
    { id: 'social', label: 'Social Links', icon: FiGlobe, count: Object.keys(socialLinks).length },
    { id: 'resumes', label: 'Resumes', icon: FiFileText, count: resumesCount },
    { id: 'layout', label: 'Layout & UI', icon: FiLayout, count: 4 },
    { id: 'hero', label: 'Hero Images', icon: FiImage, count: heroImages.length },
  ];

  return (
    <div className="admin-settings animate-fade-in">
      <div className="admin-settings__header">
        <h1 className="admin-settings__title">Settings</h1>
        <p className="admin-settings__subtitle">Operator-only configuration and system settings.</p>
      </div>

      <div className="admin-settings__tabs" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`admin-settings__tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
            <span className="tab-count-badge">{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="admin-settings__grid">
        {activeTab === 'social' && (
          <section className="admin-settings__section animate-slide-up" style={{ animationDelay: '0ms' }}>
            <div className="section-header">
              <FiGlobe className="section-icon" />
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
        )}

        {activeTab === 'resumes' && (
          <ResumesTab />
        )}

        {activeTab === 'layout' && (
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
                    disabled={savingLayout || portfolioLayout === layout.key}
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
                    {savingLayout && portfolioLayout === layout.key && (
                      <span className="layout-saving">Saving...</span>
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
                    disabled={savingSiteMode || siteMode === mode.key}
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
                    {savingSiteMode && siteMode === mode.key && (
                      <span className="layout-saving">Saving...</span>
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
        )}

        {activeTab === 'hero' && (
          <section className="admin-settings__section animate-slide-up" style={{ animationDelay: '0ms' }}>
            <div className="section-header">
              <FiImage className="section-icon" />
              <div>
                <h2>Hero Images</h2>
                <p className="section-desc">Manage hero section images. Mark one as hero for the main page, others appear in gallery.</p>
              </div>
            </div>

            <div
              className={`hero-studio-upload ${dragActive ? 'drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <label className="hero-upload-zone" htmlFor="hero-image-upload">
                <div className="hero-upload-icon-wrapper">
                  <FiUpload className="hero-upload-icon" size={32} />
                </div>
                <p>Drag & drop or click to upload hero image</p>
                <span className="upload-hint">Max 5MB • JPEG, PNG, WebP</span>
                <input
                  id="hero-image-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleHeroImageUpload}
                  disabled={uploadingHeroImage}
                  className="file-input"
                />
              </label>
              {uploadingHeroImage && <div className="upload-progress">Uploading...</div>}
            </div>

            {heroImages.length > 0 && (
              <div className="hero-studio-grid">
                {heroImages.map(image => (
                  <div key={image.id} className={`hero-studio-card ${image.is_hero ? 'is-hero' : ''}`}>
                    <div className="hero-studio-card-preview">
                      <img src={image.url} alt={image.alt_text} loading="lazy" />
                      {image.is_hero && (
                        <span className="hero-studio-badge">
                          <FiStar size={14} /> Hero
                        </span>
                      )}
                      {editingHeroImageId === image.id && (
                        <div className="hero-studio-edit-overlay">
                          <input
                            type="text"
                            value={editHeroAltText}
                            onChange={e => setEditHeroAltText(e.target.value)}
                            placeholder="Alt text"
                            className="hero-alt-input"
                            onKeyDown={e => e.key === 'Enter' && handleHeroImageSaveAlt(image.id)}
                            autoFocus
                          />
                        </div>
                      )}
                    </div>
                    <div className="hero-studio-card-actions">
                      {editingHeroImageId === image.id ? (
                        <>
                          <Button variant="primary" size="sm" onClick={() => handleHeroImageSaveAlt(image.id)}>
                            <FiCheck size={14} />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={handleHeroImageCancelEdit}>
                            <FiX size={14} />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleHeroImageEditAlt(image.id)}
                            title="Edit alt text"
                          >
                            <FiEdit2 size={14} />
                          </Button>
                          {!image.is_hero && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleHeroImageSetHero(image.id)}
                              title="Set as hero image"
                            >
                              <FiStar size={14} /> Set Hero
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            destructive
                            onClick={() => handleHeroImageDelete(image.id)}
                            title="Delete"
                          >
                            <FiTrash size={14} />
                          </Button>
                        </>
                      )}
                    </div>
                    <div className="hero-studio-card-info">
                      <span className="hero-studio-card-alt">{image.alt_text || 'No alt text'}</span>
                      {image.is_hero && <span className="hero-studio-card-current">Current Hero</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {heroImages.length === 0 && (
              <div className="hero-studio-empty">
                <FiImage size={48} className="hero-studio-empty-icon" />
                <p className="hero-studio-empty-text">No hero images uploaded yet.</p>
                <p className="hero-studio-empty-hint">Upload your first hero image above</p>
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  );
}