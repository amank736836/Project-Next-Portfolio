'use client';

import { useState, useEffect, useCallback } from 'react';
import { FiGlobe, FiFileText, FiLayout, FiImage, FiList, FiGrid } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useToast, useSuccessToast, useErrorToast } from '@/components/Admin/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import ResumesTab from '@/components/Admin/ResumesTab';
import SocialLinksTab from './components/SocialLinksTab';
import LayoutTab from './components/LayoutTab';
import HeroImagesTab from './components/HeroImagesTab';

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

  const [activeTab, setActiveTab] = useState('social');

  const TABS = [
    { id: 'social', label: 'Social Links', icon: FiGlobe, count: Object.keys(socialLinks).length },
    { id: 'resumes', label: 'Resumes', icon: FiFileText, count: resumesCount },
    { id: 'layout', label: 'Layout & UI', icon: FiLayout, count: 4 },
    { id: 'hero', label: 'Hero Images', icon: FiImage, count: heroImages.length },
  ];

  return (
    <div className="admin-settings admin-reveal">
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
          <SocialLinksTab
            socialLinks={socialLinks}
            setSocialLinks={setSocialLinks}
            socialLinksData={socialLinksData}
            setSocialLinksData={setSocialLinksData}
            savingSocial={savingSocial}
            setSavingSocial={setSavingSocial}
          />
        )}

        {activeTab === 'resumes' && (
          <ResumesTab />
        )}

        {activeTab === 'layout' && (
          <LayoutTab
            resumeUrl={resumeUrl}
            setResumeUrl={setResumeUrl}
            portfolioLayout={portfolioLayout}
            setPortfolioLayout={setPortfolioLayout}
            siteMode={siteMode}
            setSiteMode={setSiteMode}
            uiFeatures={uiFeatures}
            setUiFeatures={setUiFeatures}
            uploadingResume={uploadingResume}
            setUploadingResume={setUploadingResume}
            resumesCount={resumesCount}
          />
        )}

        {activeTab === 'hero' && (
          <HeroImagesTab
            heroImages={heroImages}
            setHeroImages={setHeroImages}
            uploadingHeroImage={uploadingHeroImage}
            setUploadingHeroImage={setUploadingHeroImage}
          />
        )}

      </div>
    </div>
  );
}