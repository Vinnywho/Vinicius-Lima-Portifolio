import { useState } from 'react'; 
import Navbar from './components/Navbar';
import SprayEffect from './components/SprayEffect';
import ProjectCard from './components/ProjectCard';
import Experiencias from './components/ExperienceSection';
import Maratona from './components/Maratona';
import Comedoria from './components/Comedoria';
import Modal from './components/Modal';

import ferramentas_e_habilidades from './assets/images/ferramentas_e_habilidades.png';
import portrait from './assets/images/portrait.png';
import barreira from './assets/images/Projetos/383340179-3af2d9d0-9894-4afb-aace-7c225ca56bab 1.png';
import petshop from './assets/images/Projetos/434983031-1a4a1ce0-cd4f-4084-abc9-3694f2cdb74c 1.png';
import dashboard from './assets/images/Projetos/DASHBOARD.png';
import jogo from './assets/images/Projetos/image 35.png';
import mae from './assets/images/Projetos/image 36.png';

import cpp from './assets/Icons/C++.svg';
import js from './assets/Icons/JS.svg';
import reactIcon from './assets/Icons/react-2.svg';
import html from './assets/Icons/HTML.svg';
import css from './assets/Icons/CSS.svg';
import figma from './assets/Icons/figma-svgrepo-com.svg';
import azure from './assets/Icons/microsoftazure-svgrepo-com.svg';
import csharp from './assets/Icons/Csharp.svg';
import mysql from './assets/Icons/mysql-logo-pure.svg';
import cv from './assets/CV 2025 (Atualizado) - Vinicius C. Lima.pdf';

function App() {
  const [projetoAberto, setProjetoAberto] = useState(null);

  const projetosLista = [
    {
      title: "Barreira Ecológica Automatica - B.E.A.",
      desc: "Barreira mecânica que recolhe lixo flutuante para despoluir rios.",
      fullDesc: "O projeto B.E.A. utiliza sensores infravermelhos e motores de passo para detectar e remover detritos de superfícies aquáticas de forma autônoma, prevenindo o entupimento de bueiros e enchentes urbanas.",
      bgImage: barreira,
      icons: [cpp],
      link:"https://github.com/2024-2-NADS1/Projeto1"
    },
    {
      title: "Pet shop - Projeto estudantil",
      desc: "Plataforma para gestão de pets e agendamento de serviços.",
      fullDesc: "Sistema completo de CRUD desenvolvido para facilitar o fluxo de trabalho de pet shops, permitindo o cadastro de usuários, pets, e agendamento de serviços com histórico fotográfico.",
      bgImage: petshop,
      icons: [js, html, css, mysql, figma],
      link:"https://github.com/Vinnywho/PetShop"
    },
    {
      title: "Instituto Criativo Dashboard",
      desc: "Dashboard que centraliza atividades e gera relatórios em tempo real.",
      fullDesc: "Solução corporativa integrada com Azure e MySQL que oferece visualização de dados estratégicos, controle de presença e métricas de desempenho em tempo real.",
      bgImage: dashboard,
      icons: [html, css, azure, mysql, figma, js, reactIcon, csharp],
      link:"https://github.com/2025-1-NADS2/Projeto3"
    },
    {
      title: "O Acampamento",
      desc: "Jogo de aventura textual com múltiplos finais e sistema de vidas.",
      fullDesc: "Desenvolvido em JavaScript, este jogo foca em narrativa interativa onde cada decisão altera o rumo da história e o estado de sobrevivência do personagem.",
      bgImage: jogo,
      icons: [html, css, js, figma],
      link:"https://github.com/Vinnywho/O-Acampamento"
    },
    {
      title: "Projeto - Dia das Mães",
      desc: "Pequeno projeto desenvolvido para o dia das mães.",
      fullDesc: "Landing page comemorativa com foco em design emocional, utilizando animações suaves e interface responsiva para homenagear as mães.",
      bgImage: mae,
      icons: [html, css, js, figma],
      link:"https://papaya-cascaron-060459.netlify.app/mae"
    }
  ];

  return (
    <>
      <SprayEffect />
      <Navbar />
      
      <main>
        <section id="home">
          <img id="ferramentas_e_habilidades" src={ferramentas_e_habilidades} alt="" />
          <div id="infos">
            <h1>ViNiCiuS LiMa</h1>
            <p>Sou um <b>desenvolvedor</b> front-end, <b>designer gráfico</b> e de UX/UI em formação.</p>
            <a href={cv} target="_blank" rel="noreferrer">
              <button id="curriculo">Currículo</button>
            </a>
          </div>
        </section>

        <section id="sobre">
          <div id="sobre-mim">
            <h2>SOBRE MIM</h2>
            <p>Meu nome é Vinicius Cardoso de Lima, tenho 22 anos e estou atualmente
          no 4º semestre da graduação em <b>Ciência da Computação</b> pela
          FECAP. Sou um profissional em formação com um sólido background
          técnico em <b>Administração</b> desde 2023 pela ETEC, o que me permite
          unir a lógica de programação com uma visão de gestão e processos. Sou
          reconhecido por ser pró-ativo, comunicativo e possuir uma grande
          capacidade de adaptação a diferentes desafios e ambientes de trabalho.</p>
          </div>
          <img id="portrait" src={portrait} alt="Vinicius" />
        </section>
        
        <section id="projetos">
          <h1>PrOjetOs - DEStaQUeS</h1>
          <Maratona />
          <Comedoria />

          <section id="mais-projetos">
            <h1>Mais PrOjetOs</h1>
            <div id="grid-projetos">
              {projetosLista.map((proj, index) => (
                <ProjectCard 
                  key={index}
                  title={proj.title}
                  desc={proj.desc}
                  bgImage={proj.bgImage}
                  icons={proj.icons}
                  onClick={() => setProjetoAberto(proj)}
                />
              ))}
            </div>
          </section>
        </section>
      </main>

      <Experiencias />

      {projetoAberto && (
        <Modal projeto={projetoAberto} onClose={() => setProjetoAberto(null)} />
      )}

      <footer>
        <a href="#home" className="scroll-top">↑</a>
        <div id="contatos">
          <a href="https://instagram.com/vinny.who" target="_blank" rel="noreferrer">Instagram</a>
          <a href="mailto:vivini13235@gmail.com">Email</a>
          <a href="https://linkedin.com/in/vinicius-cardoso-de-lima-a9a918227/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://github.com/Vinnywho" target="_blank" rel="noreferrer">GitHub</a>
        </div>
        <p>&copy; 2025 Vinicius Lima</p>
      </footer>
    </>
  );
}

export default App;
