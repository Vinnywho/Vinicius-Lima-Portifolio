import React from 'react'
import dispositivos_comedoria from '../assets/images/dispositivos_comedoria.png';
import aos from "aos";
import "aos/dist/aos.css";

function Comedoria() {
    React.useEffect(() => {
    aos.init({
      duration: 1000,
    });
  }, []);

  return (
    <section id="comedoria">
        <div id="descricao_comedoria">
          <h2 data-aos="fade-right" data-aos-delay="400">Comedoria da tia app</h2>
          <p data-aos="fade-right" data-aos-delay="500">
            Projeto desenvolvido durante o meu 3º período da universidade. Um
            app mobile integrado com uma plataforma web criados para solucionar
            problemas de demanda do empreendimento dentro do campus, como as
            filas muito longas e falta de informação sobre disponibilidade de
            produtos.
          </p>
          <a href="https://cantina-v2.vercel.app/" target="_blank"
            ><button id="saibamais-comedoria">Saiba Mais</button></a
          >
        </div>
        <div data-aos="zoom-in" data-aos-delay="400">
          <img
          id="dispositivos_comedoria"
          src={dispositivos_comedoria}
          alt=""
        />
        </div>
      </section>
  )
}

export default Comedoria
