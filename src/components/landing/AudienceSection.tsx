import React from 'react';
import { School, Dumbbell, Building2, Users2 } from 'lucide-react';

export const AudienceSection: React.FC = () => {
  const audiences = [
    {
      icon: School,
      title: 'Escolas e Instituições de Ensino',
      subtitle: 'Conformidade com a Lei Lucas e segurança do ambiente escolar',
      description: 'Capacitamos professores e colaboradores para lidar com engasgos, quedas, crises convulsivas e acidentes com alunos de todas as faixas etárias.'
    },
    {
      icon: Dumbbell,
      title: 'Academias e Centros Esportivos',
      subtitle: 'Resposta imediata a eventos cardiovasculares e traumas',
      description: 'Treinamento de instrutores para início imediato de RCP de alta qualidade, desfibilação precoce (DEA) e controle de fraturas e contusões.'
    },
    {
      icon: Building2,
      title: 'Empresas e Indústrias',
      subtitle: 'Brigadas de emergência e segurança ocupacional integrada',
      description: 'Treinamentos para SIPAT e brigadistas, com ênfase em controle de hemorragias industriais, queimaduras e evacuação coordenada.'
    },
    {
      icon: Users2,
      title: 'Comunidades e Organizações',
      subtitle: 'Cidadãos preparados para salvar vidas no dia a dia',
      description: 'Formação para condomínios, igrejas e grupos civis que desejam possuir capacidade de resposta até a chegada do serviço médico de emergência.'
    },
  ];

  return (
    <section id="publico" className="py-20 lg:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold tracking-widest text-uniao-600 uppercase bg-uniao-50 px-3.5 py-1.5 rounded-full border border-uniao-100">
            Público-Alvo
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Treinamentos adaptados à sua realidade
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Cada ambiente possui riscos e dinâmicas distintas. Nossos instrutores contextualizam os protocolos à rotina do seu time.
          </p>
        </div>

        {/* Audiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {audiences.map((aud, idx) => {
            const Icon = aud.icon;
            return (
              <div 
                key={idx}
                className="rounded-2xl p-7 bg-slate-50 border border-slate-200/90 hover:border-uniao-300 hover:bg-white hover:shadow-soft transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-uniao-100/70 text-uniao-700 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {aud.title}
                  </h3>
                  <span className="text-xs font-semibold text-uniao-700 block mb-3">
                    {aud.subtitle}
                  </span>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {aud.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
