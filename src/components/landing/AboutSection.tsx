import React from 'react';
import { BookOpen, Target, Settings2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const pillars = [
    {
      icon: BookOpen,
      title: 'Conhecimento técnico',
      description: 'Treinamento embasado em diretrizes, evidências científicas e práticas clínicas rigorosamente atualizadas.',
    },
    {
      icon: Target,
      title: 'Aprendizagem prática',
      description: 'Desenvolvimento de habilidades manuais e comportamentais diretamente aplicáveis a cenários reais de emergência.',
    },
    {
      icon: Settings2,
      title: 'Personalização',
      description: 'Programas educacionais customizados para atender as particularidades e riscos específicos de cada instituição.',
    },
  ];

  return (
    <section id="sobre" className="py-20 lg:py-28 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold tracking-widest text-uniao-600 uppercase bg-uniao-50 px-3.5 py-1.5 rounded-full border border-uniao-100">
            Sobre a União Serviços Médicos
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Compromisso ético e técnico com a preservação da vida
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Nossa missão é qualificar pessoas e instituições para agirem com segurança, rapidez e assertividade nos primeiros minutos de uma ocorrência, momento crucial em que decisões corretas evitam sequelas e salvam vidas.
          </p>
        </div>

        {/* 3 Pilares */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={idx}
                className="relative rounded-2xl p-8 bg-slate-50/70 border border-slate-200 hover:border-uniao-400 hover:bg-white hover:shadow-premium transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-uniao-100/80 text-uniao-700 flex items-center justify-center mb-6 group-hover:bg-uniao-600 group-hover:text-white transition-colors">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-uniao-900 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
