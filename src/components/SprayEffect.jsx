import { useEffect, useRef } from 'react';

const SprayEffect = () => {
  const sprayInterval = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const createParticle = (x, y) => {
      const container = document.getElementById('particle-container');
      if (!container) return;

      for (let i = 0; i < 12; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 100;
        const dx = Math.cos(angle) * velocity;
        const dy = Math.sin(angle) * velocity;
        
        p.style.setProperty('--dx', `${dx}px`);
        p.style.setProperty('--dy', `${dy}px`);

        container.appendChild(p);
        setTimeout(() => p.remove(), 400);
      }
    };

    const handleMouseDown = (e) => {
      // Limpa qualquer intervalo existente antes de começar um novo
      if (sprayInterval.current) clearInterval(sprayInterval.current);
      
      mousePos.current = { x: e.clientX, y: e.clientY };
      createParticle(mousePos.current.x, mousePos.current.y);

      sprayInterval.current = setInterval(() => {
        createParticle(mousePos.current.x, mousePos.current.y);
      }, 40);
    };

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const stopSpray = () => {
      if (sprayInterval.current) {
        clearInterval(sprayInterval.current);
        sprayInterval.current = null;
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopSpray);
    window.addEventListener('mouseleave', stopSpray);

    return () => {
      stopSpray();
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopSpray);
      window.removeEventListener('mouseleave', stopSpray);
    };
  }, []);

  return <div id="particle-container" />;
};

export default SprayEffect;