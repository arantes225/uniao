import React from 'react';
import { ArrowRight, Stethoscope, Droplet, Heart, Sliders, Check, Sparkles } from 'lucide-react';

export const CoursesSection: React.FC = () => {
  const courses = [
    {
      icon: Stethoscope,
      badge: 'Essencial em Urgência',
      title: 'Atendimento Pré-Hospitalar (APH)',
      description: 'Fundamentos de avaliação primária e secundária, segurança e reconhecimento de situações graves com resposta rápida e organizada.',
      topics: [
        'Avaliação da segurança da cena e biossegurança',
        'Protocolo X-A-B-C-D-E no trauma pré-hospitalar',
        'Imobilizações alinhadas e pranchamento seguro',
        'Comunicação efetiva com equipes de socorro avançado'
      ],
      whatsappMsg: 'Olá! Gostaria de mais informações sobre o curso de Atendimento Pré-Hospitalar (APH).'
    },
    {
      icon: Droplet,
      badge: 'Controle de Sangramento',
      title: 'Stop the Bleed — Controle de Hemorragias',
      description: 'Treinamento intensivo de identificação e intervenção em hemorragias exanguinantes graves, conforme o escopo e nível de capacitação.',
      topics: [
        'Diferenciação e identificação de hemorragias exanguinantes',
        'Aplicação técnica de torniquetes de extremidades',
        'Empacotamento de feridas e curativos de pressão',
        'Condutas imediatas até a chegada do resgate'
      ],
      whatsappMsg: 'Olá! Gostaria de mais informações sobre o treinamento de Stop the Bleed (Controle de Hemorragias).'
    },
    {
      icon: Heart,
      badge: 'Suporte Básico',
      title: 'Primeiros Socorros e SBV',
      description: 'Reconhecimento de emergências clínicas e traumáticas, acionamento imediato do socorro, ressuscitação cardiopulmonar (RCP) e uso do DEA.',
      topics: [
        'Reconhecimento da PCR no adulto, criança e lactente',
        'Compressões torácicas de alta qualidade e ventilações',
        'Manuseio seguro do Desfibrilador Externo Automático (DEA)',
        'Desobstrução de vias aéreas por corpo estranho (OVACE)'
      ],
      whatsappMsg: 'Olá! Gostaria de mais informações sobre o curso de Primeiros Socorros e Suporte Básico de Vida (SBV).'
    },
    {
      icon: Sliders,
      badge: 'Sob Medida',
      title: 'Treinamentos Personalizados',
      description: 'Capacitações elaboradas para atender normas regulamentadoras (como a Lei Lucas) e particularidades operacionais da sua instituição.',
      topics: [
        'Adequação completa à rotina escolar ou corporativa',
        'Simulações no próprio ambiente de trabalho do cliente',
        'Carga horária e módulos flexíveis por turma',
        'Relatório de prontidão e certificação da equipe'
      ],
      whatsappMsg: 'Olá! Gostaria de solicitar uma proposta de Treinamento Personalizado para minha instituição.'
    },
  ];

  return (
    <section id="cursos" className="py-24 lg:py-32 bg-slate-950 text-white relative border-t border-white/5 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[160px] pointer-events-none animate-pulse-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div data-reveal="fade-down" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-uniao-500/10 border border-uniao-500/30 text-uniao-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-uniao-400" />
            <span>Nossos Treinamentos</span>
          </div>

          <h2 data-reveal="fade-up" className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans">
            Cursos estruturados para <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-uniao-400 to-emerald-300">
              máxima eficiência em campo
            </span>
          </h2>

          <p data-reveal="fade-up" className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
            Metodologia teórico-prática desenvolvida para gerar retenção de conhecimento e confiança operacional real.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {courses.map((course, idx) => {
            const Icon = course.icon;
            const link = `https://wa.me/5561999638011?text=${encodeURIComponent(course.whatsappMsg)}`;
            return (
              <div 
                key={idx}
                data-reveal="fade-up"
                data-reveal-delay={`${idx * 150}`}
                className="flex flex-col justify-between rounded-3xl bg-slate-900/80 border border-white/10 p-8 hover:border-uniao-500/60 hover:bg-slate-900 shadow-2xl hover:shadow-[0_0_35px_rgba(20,184,166,0.2)] transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-uniao-500/15 border border-uniao-500/30 text-uniao-400 flex items-center justify-center group-hover:bg-uniao-400 group-hover:text-slate-950 transition-all duration-300">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                      {course.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-3 group-hover:text-uniao-300 transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {course.description}
                  </p>

                  <div className="space-y-3 pt-6 border-t border-white/10">
                    <span className="text-xs font-bold text-uniao-400/90 uppercase tracking-wider block">
                      Conteúdo e Habilidades Técnicas:
                    </span>
                    {course.topics.map((topic, tIdx) => (
                      <div key={tIdx} className="flex items-start gap-3 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-white/10">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl text-xs font-bold text-uniao-300 bg-uniao-500/10 hover:bg-gradient-to-r hover:from-uniao-400 hover:via-teal-300 hover:to-emerald-300 hover:text-slate-950 transition-all duration-300 border border-uniao-500/30 hover:border-uniao-300 shadow-lg group/btn"
                  >
                    <span>Solicitar Informações do Curso</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
