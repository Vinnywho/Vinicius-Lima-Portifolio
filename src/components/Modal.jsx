import React, { useEffect } from "react";
import aos from "aos";
import "aos/dist/aos.css";

const Modal = ({ projeto, onClose }) => {
  useEffect(() => {
    if (projeto) {
      aos.refreshHard();
    }
  }, [projeto]);

  if (!projeto) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        data-aos="zoom-in"
        data-aos-duration="400"
      >
        <button className="close-btn" onClick={onClose}>&times;</button>
        <img className="modal-img" src={projeto.bgImage} alt={projeto.title} />
        <h2>{projeto.title}</h2>
        <p>{projeto.fullDesc}</p>
        <div className="modal-techs">
          {projeto.icons.map((icon, i) => <img key={i} src={icon} alt="tech" />)}
        </div>
        {projeto.link && (
          <a href={projeto.link} target="_blank" rel="noreferrer">
            <button id="saibamais-comedoria">Saiba mais</button>
          </a>
        )}
      </div>
    </div>
  );
};

export default Modal;