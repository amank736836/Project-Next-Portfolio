'use client';

import { useState, useCallback } from 'react';
import { FiImage, FiUpload, FiStar, FiEdit2, FiTrash, FiCheck, FiX } from 'react-icons/fi';
import { useSuccessToast, useErrorToast } from '@/components/Admin/Toast';
import { Button } from '@/components/ui/Button';

export default function HeroImagesTab({ 
  heroImages, 
  setHeroImages, 
  uploadingHeroImage, 
  setUploadingHeroImage 
}) {
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const [dragActive, setDragActive] = useState(false);
  const [editingHeroImageId, setEditingHeroImageId] = useState(null);
  const [editHeroAltText, setEditHeroAltText] = useState('');

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
  }, [setHeroImages, successToast, errorToast, setUploadingHeroImage]);

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
  }, [setHeroImages, successToast, errorToast]);

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
  }, [setHeroImages, successToast, errorToast]);

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
  }, [editHeroAltText, setHeroImages, successToast, errorToast]);

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
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const event = { target: { files: e.dataTransfer.files } };
      handleHeroImageUpload(event);
    }
  }, [handleHeroImageUpload]);

  return (
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
  );
}