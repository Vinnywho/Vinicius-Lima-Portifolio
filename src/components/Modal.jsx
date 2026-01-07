const Modal = ({ projeto, onClose }) => {
  if (!projeto) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <img className="modal-img" src={projeto.bgImage} alt={projeto.title} />
        <h2>{projeto.title}</h2>
        <p>{projeto.fullDesc}</p>
        <div className="modal-techs">
          {projeto.icons.map((icon, i) => <img key={i} src={icon} />)}
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