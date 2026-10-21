import React from 'react';
import { School, Dumbbell, Building2, Users2, Sparkles } from 'lucide-react';

export const AudienceSection: React.FC = () => {
  const audiences = [
    {
      icon: School,
      title: 'Escolas e Instituições de Ensino',
      subtitle: 'Conformidade com a Lei Lucas e segurança escolar',
      description: 'Capacitamos professores e colaboradores para lidar com engasgos, quedas, crises convulsivas e acidentes com alunos de todas as faixas etárias.'
    },
    {
      icon: Dumbbell,
      title: 'Academias e Centros Esportivos',
      subtitle: 'Resposta imediata a eventos cardiovasculares',
      description: 'Treinamento de instrutores para início imediato de RCP de alta qualidade, desfibrilação precoce (DEA) e controle de fraturas e contusões.'
    },
    {
      icon: Building2,
      title: 'Empresas e Indústrias',
      subtitle: 'Brigadas de emergência e segurança ocupacional',
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
    <section id="publico" className="py-24 lg:py-32 bg-slate-950 text-white relative border-t border-white/5 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-uniao-600/10 rounded-full blur-[160px] pointer-events-none animate-pulse-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div data-reveal="fade-down" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-uniao-500/10 border border-uniao-500/30 text-uniao-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-uniao-400" />
            <span>Público-Alvo</span>
          </div>

          <h2 data-reveal="fade-up" className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans">
            Treinamentos adaptados à <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-uniao-400 to-emerald-300">
              realidade da sua equipe
            </span>
          </h2>

          <p data-reveal="fade-up" className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
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
                data-reveal="fade-up"
                data-reveal-delay={`${idx * 150}`}
                className="rounded-3xl p-7 bg-slate-900/80 border border-white/10 hover:border-uniao-500/60 hover:bg-slate-900 shadow-2xl hover:shadow-[0_0_35px_rgba(20,184,166,0.2)] transition-all duration-300 transform hover:-translate-y-2 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-uniao-500/15 border border-uniao-500/30 text-uniao-400 flex items-center justify-center mb-6 group-hover:bg-uniao-400 group-hover:text-slate-950 transition-all duration-300">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-uniao-300 transition-colors">
                    {aud.title}
                  </h3>

                  <span className="text-xs font-bold text-uniao-400 block mb-3">
                    {aud.subtitle}
                  </span>

                  <p className="text-slate-400 text-xs leading-relaxed">
                    {aud.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  USM Capacitação
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
