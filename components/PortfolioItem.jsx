"use client";

import { useState } from "react";
import Image from "next/image";

const PortfolioItem = ({ img, title, details }) => {
  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    setModal(!modal);
  };

  return (
    <div className="portfolio__item" onClick={toggleModal}>
      <Image 
        src={img} 
        alt={title} 
        className="portfolio__img" 
        width={500} 
        height={300} 
      />
      <div className="portfolio__hover" onClick={toggleModal}>
        <h3 className="portfolio__title">{title}</h3>
      </div>
      {modal && (
        <div className="portfolio__modal">
          <div className="portfolio__modal-content">
            <Image
              src="/assets/close.svg"
              alt="Close"
              className="modal__close"
              width={40}
              height={40}
              onClick={(e) => {
                e.stopPropagation();
                toggleModal();
              }}
            />
            <h3 className="modal__title">{title}</h3>
            <ul className="modal__list grid">
              {details.map((detail, index) => {
                return (
                  <li className="modal__item" key={index}>
                    <span className="item__icon">{detail.icon}</span>
                    <div>
                      <span className="item__title">{detail.title}</span>
                      <span className="item__details">{detail.desc}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <Image 
              src={img} 
              alt={title} 
              className="modal__img" 
              width={800} 
              height={500} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioItem;
