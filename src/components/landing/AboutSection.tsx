import React from 'react';
import { BookOpen, Target, Settings2, Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const pillars = [
    {
      icon: BookOpen,
      title: 'Conhecimento Técnico',
      description: 'Treinamento embasado em diretrizes, evidências científicas e práticas clínicas rigorosamente atualizadas.',
    },
    {
      icon: Target,
      title: 'Aprendizagem Prática',
      description: 'Desenvolvimento de habilidades manuais e comportamentais diretamente aplicáveis a cenários reais de emergência.',
    },
    {
      icon: Settings2,
      title: 'Personalização Operacional',
      description: 'Programas educacionais customizados para atender as particularidades e riscos específicos de cada instituição.',
    },
  ];

  return (
    <section id="sobre" className="py-24 lg:py-32 bg-slate-950 text-white relative border-y border-white/5 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-uniao-600/10 rounded-full blur-[160px] pointer-events-none animate-pulse-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div data-reveal="fade-down" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-uniao-500/10 border border-uniao-500/30 text-uniao-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-uniao-400" />
            <span>Sobre a União Serviços Médicos</span>
          </div>

          <h2 data-reveal="fade-up" className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans">
            Compromisso ético e técnico com a <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-uniao-400 to-emerald-300">
              preservação da vida
            </span>
          </h2>

          <p data-reveal="fade-up" className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
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
                data-reveal="fade-up"
                data-reveal-delay={`${idx * 150}`}
                className="relative rounded-3xl p-8 bg-slate-900/80 border border-white/10 hover:border-uniao-500/60 hover:bg-slate-900 shadow-2xl hover:shadow-[0_0_35px_rgba(20,184,166,0.2)] transition-all duration-300 transform hover:-translate-y-2 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-uniao-500/15 border border-uniao-500/30 text-uniao-400 flex items-center justify-center mb-6 group-hover:bg-uniao-400 group-hover:text-slate-950 transition-all duration-300 shadow-lg shadow-uniao-500/10">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-uniao-300 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-semibold text-uniao-400/80 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-uniao-400 animate-ping" />
                  <span>Pilar Institucional USM</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
