'use client';

import { useState, useEffect } from 'react';
import { FiLinkedin, FiGithub, FiTwitter, FiMail, FiGlobe, FiFileText, FiUpload, FiCheck, FiX, FiEdit3, FiTrash2, FiExternalLink, FiPlus, FiGrid, FiLayout, FiColumns, FiToggleRight, FiToggleLeft, FiImage, FiStar, FiTrash, FiEdit2, FiFacebook, FiInstagram, FiMessageSquare, FiSend } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useToast, useSuccessToast, useErrorToast } from '@/components/Admin/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

const SOCIAL_PLATFORMS = [
  { key: 'linkedin', label: 'LinkedIn', icon: FiLinkedin, placeholder: 'username or full URL', urlPrefix: 'https://linkedin.com/in/' },
  { key: 'github', label: 'GitHub', icon: FiGithub, placeholder: 'username or full URL', urlPrefix: 'https://github.com/' },
  { key: 'twitter', label: 'Twitter / X', icon: FiTwitter, placeholder: 'username or full URL', urlPrefix: 'https://x.com/' },
  { key: 'facebook', label: 'Facebook', icon: FiFacebook, placeholder: 'username or full URL', urlPrefix: 'https://facebook.com/' },
  { key: 'instagram', label: 'Instagram', icon: FiInstagram, placeholder: 'username or full URL', urlPrefix: 'https://instagram.com/' },
  { key: 'threads', label: 'Threads', icon: FiMessageSquare, placeholder: 'username or full URL', urlPrefix: 'https://threads.net/@' },
  { key: 'snapchat', label: 'Snapchat', icon: FiSend, placeholder: 'username or full URL', urlPrefix: 'https://snapchat.com/add/' },
  { key: 'telegram', label: 'Telegram', icon: FiSend, placeholder: 'username or full URL', urlPrefix: 'https://t.me/' },
  { key: 'email', label: 'Email', icon: FiMail, placeholder: 'email@example.com', urlPrefix: 'mailto:' },
  { key: 'website', label: 'Website', icon: FiGlobe, placeholder: 'https://example.com', urlPrefix: '' },
];

const PORTFOLIO_LAYOUTS = [
  { key: 'masonry', label: 'Masonry (Pinterest-style)', icon: FiGrid, desc: 'Images keep original aspect ratios, brick wall layout' },
  { key: 'fixed', label: 'Fixed Ratio (Grid)', icon: FiLayout, desc: 'All images same 5:2 ratio, uniform grid' },
];

const SITE_MODES = [
  { key: 'multi', label: 'Multi-Page', icon: FiLayout, desc: 'Separate pages for each section (default)' },
  { key: 'single', label: 'Single Page', icon: FiColumns, desc: 'All sections on one continuous page' },
];

const UI_FEATURES = [
  { key: 'enable_scroll_reveal', label: 'Scroll Reveal Animations', desc: 'Fade/slide animations when sections enter viewport', icon: FiToggleRight, iconOff: FiToggleLeft },
  { key: 'enable_typewriter', label: 'Typewriter Effect', desc: 'Animated typing text in hero section', icon: FiToggleRight, iconOff: FiToggleLeft },
  { key: 'enable_open_to_work', label: 'Open to Opportunities Badge', desc: 'Show availability badge in hero section', icon: FiToggleRight, iconOff: FiToggleLeft },
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
  initialResumeUrl = '', 
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

  useEffect(() => {
    setSocialLinks(initialSocialLinks);
  }, [initialSocialLinks]);

  useEffect(() => {
    setResumeUrl(initialResumeUrl);
  }, [initialResumeUrl]);

  useEffect(() => {
    setUiFeatures(initialUIFeatures);
  }, [initialUIFeatures]);

  const saveSocialLink = async (key, value) => {
    const normalized = normalizeSocialValue(value, SOCIAL_PLATFORMS.find(p => p.key === key));
    setSavingSocial(true);
    try {
      const res = await fetch('/api/admin/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, title: SOCIAL_PLATFORMS.find(p => p.key === key).label, description: normalized }),
      });
      if (res.ok) {
        setSocialLinks(prev => ({ ...prev, [key]: normalized }));
        successToast(`${SOCIAL_PLATFORMS.find(p => p.key === key).label} saved`);
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
  };

  const deleteSocialLink = async (key) => {
    setSavingSocial(true);
    try {
      const res = await fetch(`/api/admin/info?key=${encodeURIComponent(key)}`, { method: 'DELETE' });
      if (res.ok) {
        setSocialLinks(prev => { const next = { ...prev }; delete next[key]; return next; });
        successToast(`${SOCIAL_PLATFORMS.find(p => p.key === key).label} removed`);
      } else {
        errorToast('Failed to delete');
      }
    } catch (e) {
      errorToast('Network error');
    } finally {
      setSavingSocial(false);
    }
  };

  const handleEditClick = (key) => {
    const platform = SOCIAL_PLATFORMS.find(p => p.key === key);
    setEditingKey(key);
    setEditValue(extractDisplayValue(socialLinks[key], platform));
  };

  const handleSaveClick = (key) => {
    saveSocialLink(key, editValue);
  };

  const handleKeyDown = (e, key) => {
    if (e.key === 'Enter') handleSaveClick(key);
    if (e.key === 'Escape') { setEditingKey(null); setEditValue(''); }
  };

  const handleResumeUpload = async (e) => {
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
  };

  const handleResumeDelete = async () => {
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
  };

  const savePortfolioLayout = async (layout) => {
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
  };

  const saveSiteMode = async (mode) => {
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
  };

  const saveUIFeature = async (key, value) => {
    setSavingUIFeature(key);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, description: value }),
      });
      if (res.ok) {
        setUiFeatures(prev => ({ ...prev, [key]: value }));
        successToast(`UI feature updated`);
      } else {
        errorToast('Failed to save');
      }
    } catch (e) {
      errorToast('Network error');
    } finally {
      setSavingUIFeature(null);
    }
  };

  const toggleUIFeature = (key) => {
    const current = uiFeatures[key] === 'true';
    saveUIFeature(key, (!current).toString());
  };

  const openResume = () => {
    if (resumeUrl) window.open(resumeUrl, '_blank', 'noopener,noreferrer');
  };

  const handleHeroImageUpload = async (e) => {
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
  };

  const handleHeroImageDelete = async (id) => {
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
  };

  const handleHeroImageSetHero = async (id) => {
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
  };

  const handleHeroImageEditAlt = (id) => {
    const img = heroImages.find(i => i.id === id);
    if (img) {
      setEditingHeroImageId(id);
      setEditHeroAltText(img.alt_text || '');
    }
  };

  const handleHeroImageSaveAlt = async (id) => {
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
  };

  const handleHeroImageCancelEdit = () => {
    setEditingHeroImageId(null);
    setEditHeroAltText('');
  };

  return (
    <div className="admin-settings">
      <div className="admin-settings__header">
        <h1 className="admin-settings__title">Settings</h1>
        <p className="admin-settings__subtitle">Operator-only configuration and system settings.</p>
      </div>

      <div className="admin-settings__grid">
        <section className="admin-settings__section">
          <div className="section-header">
            <FiGlobe className="section-icon" />
            <div>
              <h2>Social Links</h2>
              <p className="section-desc">Manage public profile links displayed on your portfolio.</p>
            </div>
          </div>

          <div className="social-links-list">
            {SOCIAL_PLATFORMS.map(platform => {
              const value = socialLinks[platform.key] || '';
              const isEditing = editingKey === platform.key;
              const hasValue = Boolean(value);

              return (
                <div key={platform.key} className={`social-link-row ${isEditing ? 'editing' : ''} ${hasValue ? 'has-value' : ''}`}>
                  <div className="platform-info">
                    <platform.icon className="platform-icon" size={20} />
                    <div>
                      <span className="platform-label">{platform.label}</span>
                      {!isEditing && hasValue && (
                        <a href={normalizeSocialValue(value, platform)} target="_blank" rel="noopener noreferrer" className="platform-value">
                          {extractDisplayValue(value, platform)}
                          <FiExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="platform-actions">
                    {isEditing ? (
                      <>
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
                      </>
                    ) : hasValue ? (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => handleEditClick(platform.key)}>
                          <FiEdit3 size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" destructive onClick={() => deleteSocialLink(platform.key)}>
                          <FiTrash2 size={16} />
                        </Button>
                      </>
                    ) : (
                      <Button variant="primary" size="sm" onClick={() => handleEditClick(platform.key)}>
                        <FiPlus size={16} /> Add
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="admin-settings__section">
          <div className="section-header">
            <FiFileText className="section-icon" />
            <div>
              <h2>Resume / CV</h2>
              <p className="section-desc">Upload your resume (PDF, max 5MB). Visitors can download it from your portfolio.</p>
            </div>
          </div>

          <Card className="resume-card">
            {resumeUrl ? (
              <div className="resume-uploaded">
                <div className="resume-info">
                  <FiFileText className="resume-icon" size={32} />
                  <div>
                    <p className="resume-filename">resume.pdf</p>
                    <p className="resume-url">Stored on Cloudinary</p>
                  </div>
                </div>
                <div className="resume-actions">
                  <Button variant="secondary" onClick={openResume}><FiExternalLink size={16} /> View</Button>
                  <Button variant="ghost" destructive onClick={handleResumeDelete}><FiTrash2 size={16} /> Remove</Button>
                </div>
              </div>
            ) : (
              <div className="resume-upload">
                <div className="upload-zone" onClick={e => e.currentTarget.querySelector('input').click()}>
                  <FiUpload className="upload-icon" size={48} />
                  <p>Drag & drop or click to upload PDF</p>
                  <span className="upload-hint">Max 5MB • PDF only</span>
                  <input type="file" accept=".pdf" onChange={handleResumeUpload} disabled={uploadingResume} className="file-input" />
                </div>
              </div>
            )}
            {uploadingResume && <div className="upload-progress">Uploading...</div>}
          </Card>
        </section>

        <section className="admin-settings__section">
          <div className="section-header">
            <FiGrid className="section-icon" />
            <div>
              <h2>Portfolio Layout</h2>
              <p className="section-desc">Choose how projects are displayed on the public portfolio page.</p>
            </div>
          </div>

          <Card className="layout-card">
            <div className="layout-options">
              {PORTFOLIO_LAYOUTS.map(layout => (
                <button
                  key={layout.key}
                  type="button"
                  className={`layout-option ${portfolioLayout === layout.key ? 'active' : ''}`}
                  onClick={() => savePortfolioLayout(layout.key)}
                  disabled={savingLayout || portfolioLayout === layout.key}
                >
                  <div className="layout-icon">
                    <layout.icon size={28} />
                  </div>
                  <div className="layout-info">
                    <span className="layout-label">{layout.label}</span>
                    <span className="layout-desc">{layout.desc}</span>
                  </div>
                  {portfolioLayout === layout.key && (
                    <FiCheck className="layout-check" size={20} />
                  )}
                  {savingLayout && portfolioLayout === layout.key && (
                    <span className="layout-saving">Saving...</span>
                  )}
                </button>
              ))}
            </div>
          </Card>
        </section>

        <section className="admin-settings__section">
          <div className="section-header">
            <FiColumns className="section-icon" />
            <div>
              <h2>Site Mode</h2>
              <p className="section-desc">Choose between multi-page navigation or single-page scroll.</p>
            </div>
          </div>

          <Card className="layout-card">
            <div className="layout-options">
              {SITE_MODES.map(mode => (
                <button
                  key={mode.key}
                  type="button"
                  className={`layout-option ${siteMode === mode.key ? 'active' : ''}`}
                  onClick={() => saveSiteMode(mode.key)}
                  disabled={savingSiteMode || siteMode === mode.key}
                >
                  <div className="layout-icon">
                    <mode.icon size={28} />
                  </div>
                  <div className="layout-info">
                    <span className="layout-label">{mode.label}</span>
                    <span className="layout-desc">{mode.desc}</span>
                  </div>
                  {siteMode === mode.key && (
                    <FiCheck className="layout-check" size={20} />
                  )}
                  {savingSiteMode && siteMode === mode.key && (
                    <span className="layout-saving">Saving...</span>
                  )}
                </button>
              ))}
            </div>
          </Card>
        </section>

        <section className="admin-settings__section">
          <div className="section-header">
            <FiToggleRight className="section-icon" />
            <div>
              <h2>UI Features</h2>
              <p className="section-desc">Toggle visual effects and animations on your portfolio.</p>
            </div>
          </div>

          <Card className="layout-card">
            <div className="ui-features-list">
              {UI_FEATURES.map(feature => {
                const isEnabled = uiFeatures[feature.key] !== 'false';
                return (
                  <div key={feature.key} className="ui-feature-row">
                    <div className="ui-feature-info">
                      <feature.icon className="ui-feature-icon" size={24} />
                      <div>
                        <span className="ui-feature-label">{feature.label}</span>
                        <span className="ui-feature-desc">{feature.desc}</span>
                      </div>
                    </div>
                    <div className="ui-feature-toggle">
                      <label className={`toggle ${isEnabled ? 'active' : ''}`} onClick={() => toggleUIFeature(feature.key)}>
                        <span className="toggle-track">
                          <span className="toggle-thumb"></span>
                        </span>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </section>

        <section className="admin-settings__section">
          <div className="section-header">
            <FiImage className="section-icon" />
            <div>
              <h2>Hero Images</h2>
              <p className="section-desc">Manage hero section images. Mark one as hero for the main page, others appear in gallery.</p>
            </div>
          </div>

          <Card className="layout-card">
            <div className="hero-images-upload">
              <label className="upload-zone" htmlFor="hero-image-upload">
                <FiUpload className="upload-icon" size={32} />
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
              <div className="hero-images-grid">
                {heroImages.map(image => (
                  <div key={image.id} className={`hero-image-card ${image.is_hero ? 'is-hero' : ''}`}>
                    <div className="hero-image-preview">
                      <img src={image.url} alt={image.alt_text} />
                      {image.is_hero && (
                        <span className="hero-badge">
                          <FiStar size={14} /> Hero
                        </span>
                      )}
                    </div>
                    <div className="hero-image-actions">
                      {editingHeroImageId === image.id ? (
                        <>
                          <input
                            type="text"
                            value={editHeroAltText}
                            onChange={e => setEditHeroAltText(e.target.value)}
                            placeholder="Alt text"
                            className="hero-alt-input"
                            onKeyDown={e => e.key === 'Enter' && handleHeroImageSaveAlt(image.id)}
                            autoFocus
                          />
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
                    <div className="hero-image-info">
                      <span className="hero-image-alt">{image.alt_text || 'No alt text'}</span>
                      {image.is_hero && <span className="hero-image-current">Current Hero</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {heroImages.length === 0 && (
              <p className="empty-state">No hero images uploaded yet.</p>
            )}
          </Card>
        </section>
      </div>
    </div>
  );
}