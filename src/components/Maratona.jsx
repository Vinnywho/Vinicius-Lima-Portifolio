import React from 'react'
import revistas from '../assets/images/revistas.png';

function Maratona() {
  return (
    <section id="maratona">
        <img id="revistas" src={revistas} alt="" />
        <div id="descricao_maratona">
          <h2>Maratona SBC 2025</h2>
          <p>
            Participei da Maratona SBC de Programação em 2025 como competidor na
            primeira fase, me encantei pelo projeto, e a convite da Diretora de
            patrocínios, Lucy Mary Tabutti, me tornei o
            <b> designer oficial da edição</b>. Desenvolvi o design da logo,
            mascotes, camisetas, cartazes, crachás, revista e álbum de
            figurinhas, todos eles sendo usados no dia da competição sediada
            pela FECAP.
          </p>
          <a href="https://maratona.institutocriativo.org.br" target="_blank"
            ><button id="saibamais-maratona">Saiba Mais</button></a
          >
        </div>
      </section>
  )
}

export default Maratona
