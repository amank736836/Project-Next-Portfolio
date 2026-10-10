"use client";

import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { 
  FiFileText, 
  FiGithub, 
  FiExternalLink, 
  FiUser, 
  FiCode, 
  FiDatabase, 
  FiServer, 
  FiGlobe,
  FiLayers,
  FiCpu,
  FiX,
  FiImage
} from "react-icons/fi";
import { FaCode, FaMobileAlt } from "react-icons/fa";
import { getDisplayImage, getProductionUrl } from "@/lib/projectPreview";
import TiltCard from "@/components/ui/TiltCard";
import LivePreview from "@/components/LivePreview";

// Map icon NAMES (strings) to components - used by details data
const iconMap = {
  FiFileText,
  FiGithub,
  FiExternalLink,
  FiUser,
  FiCode,
  FiDatabase,
  FiServer,
  FiGlobe,
  FiLayers,
  FiCpu,
  FaCode,
  FaMobileAlt,
};

// Map tech names to icons for hover tags
const techIconMap = {
  react: FiCode,
  node: FiServer,
  nodejs: FiServer,
  javascript: FiCode,
  typescript: FiCode,
  java: FiCpu,
  python: FiCpu,
  mongodb: FiDatabase,
  postgresql: FiDatabase,
  mysql: FiDatabase,
  redis: FiDatabase,
  aws: FiGlobe,
  docker: FiLayers,
  kubernetes: FiLayers,
  tailwind: FaMobileAlt,
  nextjs: FiCode,
  next: FiCode,
  express: FiServer,
  spring: FiCpu,
  html: FiCode,
  css: FiCode,
};

const FIRST_COLOR = "hsl(250, 84%, 60%)"; // Matches --first-color

const PortfolioItem = ({ 
  img, 
  title, 
  details, 
  category, 
  liveUrl, 
  githubUrl, 
  index,
  shortDescription,
  techStack
}) => {
  const [modal, setModal] = useState(false);
  const [previewTab, setPreviewTab] = useState(null); // null = default (live when available)

  const parsedDetails = useMemo(() => 
    typeof details === 'string' ? JSON.parse(details) : details, 
    [details]
  );
  const parsedTechStack = useMemo(() => 
    typeof techStack === 'string' ? JSON.parse(techStack) : techStack || [], 
    [techStack]
  );

  // Prefer the dedicated live URL column; fall back to the "Preview"/"Link" detail entry.
  const livePreviewUrl = useMemo(() => {
    const isHttpUrl = (value) => typeof value === 'string' && /^https?:\/\//i.test(value.trim());
    if (isHttpUrl(liveUrl)) return liveUrl.trim();
    const detail = Array.isArray(parsedDetails)
      ? parsedDetails.find((d) => d?.title && /(preview|link)/i.test(d.title) && isHttpUrl(d.desc))
      : null;
    return detail ? detail.desc.trim() : null;
  }, [liveUrl, parsedDetails]);

  // Modal preview tab: "live" (embedded site) or "shot" (static screenshot).
  const activePreviewTab = previewTab || (livePreviewUrl ? 'live' : 'shot');

  const delayClass = `delay-${((index || 0) % 6) + 1}`;

  // Prefer the admin-provided summary; fall back to the project detail copy.
  const summary = useMemo(() => {
    if (shortDescription) return shortDescription;
    const detail = Array.isArray(parsedDetails)
      ? parsedDetails.find((d) => d?.title?.toLowerCase().includes('project') && typeof d.desc === 'string')
      : null;
    return detail?.desc || '';
  }, [shortDescription, parsedDetails]);

  const toggleModal = () => setModal(!modal);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setModal(false);
    }
  };

  const handleCardKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleModal();
    }
  };

  const ModalContent = (
    <div className="portfolio__modal" onClick={toggleModal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="portfolio__modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          aria-label={`Close ${title} details`}
          className="modal__close"
          onClick={toggleModal}
        >
          <FiX size={24} color="currentColor" />
        </button>
        <h3 id="modal-title" className="modal__title">{title}</h3>
        <ul className="modal__list grid">
          {parsedDetails.map((detail, idx) => {
            const IconComponent = iconMap[detail.icon] || FiFileText;
            return (
              <li className="modal__item" key={idx}>
                <span className="item__icon"><IconComponent size={20} /></span>
                <div>
                  <span className="item__title">{detail.title}</span>
                  {typeof detail.desc === 'string' && detail.desc.startsWith('http') ? (
                    <a href={detail.desc} target="_blank" rel="noopener noreferrer" className="item__details">
                      {detail.desc}
                    </a>
                  ) : (
                    <span className="item__details">{detail.desc}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        <div className="modal__preview">
          <div className="modal__preview-tabs" role="tablist" aria-label={`${title} preview`}>
            {livePreviewUrl && (
              <button
                type="button"
                role="tab"
                aria-selected={activePreviewTab === 'live'}
                className={`modal__preview-tab ${activePreviewTab === 'live' ? 'active-tab' : ''}`}
                onClick={() => setPreviewTab('live')}
              >
                <FiGlobe size={14} />
                Live Preview
              </button>
            )}
            {img && (
              <button
                type="button"
                role="tab"
                aria-selected={activePreviewTab === 'shot'}
                className={`modal__preview-tab ${activePreviewTab === 'shot' ? 'active-tab' : ''}`}
                onClick={() => setPreviewTab('shot')}
              >
                <FiImage size={14} />
                Screenshot
              </button>
            )}
            {livePreviewUrl && (
              <a
                href={livePreviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="modal__preview-open"
              >
                <FiExternalLink size={14} />
                Open site
              </a>
            )}
          </div>
          <div className="modal__img-wrapper" role="tabpanel">
            {activePreviewTab === 'live' && livePreviewUrl ? (
              <LivePreview
                liveUrl={livePreviewUrl}
                img={img}
                title={title}
                interactive
                sizes="(max-width: 768px) 92vw, 720px"
                quality={85}
              />
            ) : (
              img && (
                <Image 
                  src={img} 
                  alt={title} 
                  className="modal__img" 
                  width={800}
                  height={450}
                  loading="lazy"
                  sizes="(max-width: 768px) 92vw, 800px"
                  quality={85}
                />
              )
            )}
          </div>
          {activePreviewTab === 'live' && livePreviewUrl && (
            <p className="modal__preview-note">
              Interactive preview of the deployed project. If a site blocks embedding, use
              &ldquo;Open site&rdquo; or switch to the screenshot.
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <TiltCard
      className={`portfolio__item reveal-scale ${delayClass}`}
      onClick={toggleModal}
      role="button"
      tabIndex={0}
      aria-label={`Open project details for ${title}`}
      onKeyDown={handleCardKeyDown}
      suppressHydrationWarning
    >
<div className="portfolio__media">
        <LivePreview
          liveUrl={livePreviewUrl}
          img={img}
          title={title}
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 48vw, 500px"
          quality={80}
        />
      </div>
      <div className="portfolio__hover">
        <h3 className="portfolio__title">{title}</h3>
        {category && <span className="portfolio__category">{category}</span>}
        {summary && <p className="portfolio__description">{summary}</p>}
        {parsedTechStack.length > 0 && (
          <div className="portfolio__tech-stack">
            {parsedTechStack.slice(0, 6).map((tech, i) => {
              const techName = typeof tech === 'object' ? tech.name : tech;
              const IconComponent = techIconMap[techName.toLowerCase()] || FiCode;
              return (
                <span key={`${techName}-${i}`} className="portfolio__tech-tag">
                  <IconComponent size={12} color={FIRST_COLOR} />
                  {techName}
                </span>
              );
            })}
          </div>
        )}
        <div className="portfolio__actions">
          {resolvedLiveUrl && (
            <a 
              href={resolvedLiveUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="portfolio__action-btn"
              onClick={(e) => e.stopPropagation()}
            >
              <FiExternalLink size={14} />
              Live
            </a>
          )}
          {githubUrl && (
            <a 
              href={githubUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="portfolio__action-btn"
              onClick={(e) => e.stopPropagation()}
            >
              <FiGithub size={14} />
              Code
            </a>
          )}
        </div>
      </div>
      
      {modal && createPortal(ModalContent, document.body)}
    </TiltCard>
  );
};

export default PortfolioItem;
