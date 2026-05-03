"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { FiFileText, FiGithub, FiExternalLink, FiUser } from "react-icons/fi";
import { FaCode } from "react-icons/fa";

const iconMap = {
  FiFileText: <FiFileText />,
  FiGithub: <FiGithub />,
  FaCode: <FaCode />,
  FiExternalLink: <FiExternalLink />,
  FiUser: <FiUser />
};

const PortfolioItem = ({ img, title, details }) => {
  const [modal, setModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (modal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [modal]);

  const toggleModal = () => setModal(!modal);

  const parsedDetails = typeof details === 'string' ? JSON.parse(details) : details;

  const ModalContent = (
    <div className="portfolio__modal" onClick={toggleModal}>
      <div className="portfolio__modal-content" onClick={(e) => e.stopPropagation()}>
        <Image
          src="/assets/close.svg"
          alt="Close"
          className="modal__close"
          width={40}
          height={40}
          onClick={toggleModal}
        />
        <h3 className="modal__title">{title}</h3>
        <ul className="modal__list grid">
          {parsedDetails.map((detail, index) => (
            <li className="modal__item" key={index}>
              <span className="item__icon">{iconMap[detail.icon] || <FiFileText />}</span>
              <div>
                <span className="item__title">{detail.title}</span>
                {detail.desc.startsWith('http') ? (
                  <a href={detail.desc} target="_blank" rel="noopener noreferrer" className="item__details">
                    {detail.desc}
                  </a>
                ) : (
                  <span className="item__details">{detail.desc}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
        <Image 
          src={img} 
          alt={title} 
          className="modal__img" 
          width={800} 
          height={350} 
        />
      </div>
    </div>
  );

  return (
    <div className="portfolio__item" onClick={toggleModal}>
      <Image 
        src={img} 
        alt={title} 
        className="portfolio__img" 
        width={500} 
        height={200} 
      />
      <div className="portfolio__hover">
        <h3 className="portfolio__title">{title}</h3>
      </div>
      
      {modal && mounted && createPortal(ModalContent, document.body)}
    </div>
  );
};

export default PortfolioItem;
