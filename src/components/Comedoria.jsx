import React from 'react'
import dispositivos_comedoria from '../assets/images/dispositivos_comedoria.png';

function Comedoria() {
  return (
    <section id="comedoria">
        <div id="descricao_comedoria">
          <h2>Comedoria da tia app</h2>
          <p>
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
        <img
          id="dispositivos_comedoria"
          src={dispositivos_comedoria}
          alt=""
        />
      </section>
  )
}

export default Comedoria
