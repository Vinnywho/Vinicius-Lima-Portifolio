import ExperienceItem from './ExperienceItem';

const ExperienceSection = () => {
  const experiences = [
    { year: "2026", items: [{ title: "Freelancer" }] },
    { 
      year: "2025", 
      items: [
        { title: "Freelancer - H&L", description: "Configuração da plataforma de CRM, organização e\nautomação de planilhas." },
        { title: "Freelancer - Volcano", description: "Alterações de embalagens de produtos.\nDesenvolvimento de catalogos de venda." }
      ] 
    },
    {
      year: "2024",
      items: [
        { title: "Ingresso na FECAP", description: "Ingressei no curso de Análise e Desenvolvimento de Sistemas\ncom 100% de bolsa pelo Prouni." },
        { title: "Conclusão do curso de Administração" },
        { title: "Final do contrato Hapvida", description: "Finalizei meu contrato com tempo pré-determinado na Hapvida." }
      ]
    },
    {
      year: "2023",
      items: [
        { title: "Inicio do curso de Administração", description: "Ingressei no curso técnico de Administração pela ETEC.\n(Duração de 3 semestres)" },
        { title: "Jovem Aprendiz - Hapvida", description: "Ingressei como jovem aprendiz administrativo na Hapvida." }
      ]
    }
  ];

  return (
    <section id="experiencias">
      <h1>Experiências</h1>
      <div className="timeline">
        {experiences.map((group, idx) => (
          <div key={idx} style={{ display: 'contents' }}>
            <h2 className="ano">{group.year}</h2>
            {group.items.map((exp, i) => (
              <ExperienceItem key={i} title={exp.title} description={exp.description} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;