import { useState } from 'react';
import '../style.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDark = () => document.body.classList.toggle('dark-mode');

  return (
    <nav>
      <ul className={isOpen ? 'active' : ''}>
        <li><a href="#home" className="nav-item" onClick={() => setIsOpen(false)}>Home</a></li>
        <li><a href="#sobre" className="nav-item" onClick={() => setIsOpen(false)}>Sobre</a></li>
        <li><a href="#projetos" className="nav-item" onClick={() => setIsOpen(false)}>Projetos</a></li>
        <li><a href="#experiencias" className="nav-item" onClick={() => setIsOpen(false)}>Experiências</a></li>
      </ul>

      <ul className={`nav-burger-menu ${isOpen ? 'active' : ''}`}>
        <div id="nav-burger-contacts">
          <a href="https://instagram.com/vinny.who" target="_blank" rel="noreferrer">Instagram</a>
          <a href="vivini13235@gmail.com">Email</a>
          <a href="https://linkedin.com/in/vinicius-cardoso-de-lima-a9a918227/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://github.com/Vinnywho" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </ul>
      <div className="nav-actions">
        <div onClick={toggleDark} id="lua-btn" style={{cursor: 'pointer'}}>
          <svg
            width="35"
            height="35"
            viewBox="0 0 35 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M32.3928 18.4329C32.124 21.3409 31.0327 24.1121 29.2464 26.4225C27.4602 28.7328 25.0529 30.4866 22.3063 31.4787C19.5596 32.4708 16.5872 32.6602 13.7369 32.0246C10.8866 31.389 8.27622 29.9549 6.21124 27.8899C4.14626 25.8249 2.71209 23.2145 2.07653 20.3642C1.44098 17.5139 1.63033 14.5415 2.62244 11.7949C3.61454 9.04823 5.36836 6.64095 7.67868 4.85469C9.989 3.06844 12.7603 1.97709 15.6682 1.70836C13.9657 4.01165 13.1464 6.84951 13.3594 9.70578C13.5724 12.5621 14.8035 15.247 16.8288 17.2723C18.8541 19.2976 21.5391 20.5287 24.3954 20.7417C27.2516 20.9547 30.0895 20.1354 32.3928 18.4329Z"
              stroke="currentColor"
              stroke-width="3.41667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <button className={`burger ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
