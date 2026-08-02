"use client";

import { useState, useEffect, useCallback } from "react";
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
  FiX
} from "react-icons/fi";
import { FaCode, FaMobileAlt } from "react-icons/fa";

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

  useEffect(() => {
    if (modal) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    }
    return () => { 
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [modal]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setModal(false);
    }
  }, []);

  const toggleModal = () => setModal(!modal);

  const handleCardKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleModal();
    }
  };

  const parsedDetails = typeof details === 'string' ? JSON.parse(details) : details;
  const parsedTechStack = typeof techStack === 'string' ? JSON.parse(techStack) : techStack || [];

  const delayClass = `delay-${((index || 0) % 6) + 1}`;

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
        <div className="modal__img-wrapper">
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
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`portfolio__item reveal-scale ${delayClass}`}
      onClick={toggleModal}
      role="button"
      tabIndex={0}
      aria-label={`Open project details for ${title}`}
      onKeyDown={handleCardKeyDown}
      suppressHydrationWarning
    >
<div className="portfolio__media">
        <Image 
          src={img} 
          alt={title} 
          className="portfolio__img" 
          fill
          loading="lazy"
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 48vw, 500px"
          quality={80}
        />
      </div>
      <div className="portfolio__hover">
        <h3 className="portfolio__title">{title}</h3>
        {category && <span className="portfolio__category">{category}</span>}
        {shortDescription && <p className="portfolio__description">{shortDescription}</p>}
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
          {liveUrl && (
            <a 
              href={liveUrl} 
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
    </div>
  );
};

export default PortfolioItem;
