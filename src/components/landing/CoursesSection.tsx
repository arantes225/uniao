import React from 'react';
import { ArrowRight, Stethoscope, Droplet, Heart, Sliders, Check } from 'lucide-react';

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
    <section id="cursos" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold tracking-widest text-uniao-600 uppercase bg-uniao-100/70 px-3.5 py-1.5 rounded-full border border-uniao-200">
            Nossos Treinamentos
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Cursos estruturados para máxima eficiência em campo
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Metodologia teórico-prática desenvolvida para gerar retenção de conhecimento e confiança operacional real.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {courses.map((course, idx) => {
            const Icon = course.icon;
            const link = `https://wa.me/5500000000000?text=${encodeURIComponent(course.whatsappMsg)}`;
            return (
              <div 
                key={idx}
                className="flex flex-col justify-between rounded-2xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-premium hover:border-uniao-300 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-uniao-50 text-uniao-600 flex items-center justify-center border border-uniao-100">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                      {course.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {course.title}
                  </h3>
                  
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {course.description}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      O que está incluído:
                    </span>
                    {course.topics.map((topic, tIdx) => (
                      <div key={tIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <Check className="w-4 h-4 text-uniao-600 shrink-0 mt-0.5" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 mt-6 border-t border-slate-100">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-uniao-800 bg-uniao-50 hover:bg-uniao-600 hover:text-white transition-all border border-uniao-200 hover:border-uniao-600 shadow-sm"
                  >
                    <span>Solicitar informações do curso</span>
                    <ArrowRight className="w-4 h-4" />
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
