import React from 'react';
import { Video, BookOpen, ShieldCheck, Stethoscope, ArrowRight, AlertTriangle, Sparkles } from 'lucide-react';

export const MethodologySection: React.FC = () => {
  const steps = [
    {
      stage: 'ETAPA ONLINE (PRÉ-REQUISITO OBRIGATÓRIO)',
      number: '01',
      icon: Video,
      title: 'Videoaulas + Material Didático',
      description: 'Fundamentação teórica completa com apostilas digitais e videoaulas de procedimentos em alta definição.',
      tag: 'Acesso Imediato'
    },
    {
      stage: 'ETAPA ONLINE (PRÉ-REQUISITO OBRIGATÓRIO)',
      number: '02',
      icon: BookOpen,
      title: 'Provas por Módulo & Avaliação',
      description: 'Avaliações de retenção para comprovar o domínio técnico dos protocolos antes da liberação do simulador.',
      tag: 'Critério de Nota'
    },
    {
      stage: 'ETAPA ONLINE (PRÉ-REQUISITO OBRIGATÓRIO)',
      number: '03',
      icon: ShieldCheck,
      title: 'Simulados Clínicos Online',
      description: 'Tomada de decisão em cenários virtuais de urgência (X-A-B-C-D-E) com debriefing imediato de condutas e erros críticos.',
      tag: 'Passaporte para a Prática'
    },
    {
      stage: 'IMERSÃO PRESENCIAL FINAL',
      number: '04',
      icon: Stethoscope,
      title: 'Simulado Prático em Campo',
      description: 'Nenhum aluno chega à aula presencial sem saber a teoria. O encontro presencial é 100% focado no treinamento de habilidades reais: torniquetes, DEA, compressões torácicas e extração.',
      tag: 'Certificação Oficial',
      highlight: true
    },
  ];

  return (
    <section id="metodologia" className="py-24 lg:py-32 bg-slate-950 text-white relative border-t border-white/5 overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-uniao-600/10 rounded-full blur-[160px] pointer-events-none animate-pulse-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
          <div data-reveal="fade-down" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-uniao-500/10 border border-uniao-500/30 text-uniao-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-uniao-400" />
            <span>O Modelo de Excelência USM</span>
          </div>

          <h2 data-reveal="fade-up" className="text-3xl sm:text-5xl font-black tracking-tight font-sans text-white">
            Teoria e Simulação Online. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-uniao-400 to-emerald-300">
              Prática Realista no Presencial.
            </span>
          </h2>

          <p data-reveal="fade-up" className="text-base sm:text-lg text-slate-400 leading-relaxed font-light">
            Não perdemos tempo presencial com slides teóricos. O aluno estuda no site, faz as provas, vence os simulados online e chega ao treinamento presencial pronto para praticar exaustivamente.
          </p>
        </div>

        {/* Steps Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                data-reveal="fade-up"
                data-reveal-delay={`${idx * 150}`}
                className={`relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 ${
                  step.highlight
                    ? 'bg-gradient-to-b from-uniao-950/90 via-slate-900 to-slate-900 border-2 border-uniao-400 shadow-[0_0_35px_rgba(20,184,166,0.25)]'
                    : 'bg-slate-900/70 border border-white/10 hover:border-uniao-500/40 hover:bg-slate-900'
                }`}
              >
                <div>
                  <span className={`text-[10px] font-bold tracking-wider block mb-4 uppercase ${
                    step.highlight ? 'text-uniao-300' : 'text-slate-500'
                  }`}>
                    {step.stage}
                  </span>

                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      step.highlight 
                        ? 'bg-uniao-500 text-slate-950 shadow-lg shadow-uniao-500/30 font-black' 
                        : 'bg-slate-800 text-uniao-400 border border-white/10'
                    }`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-2xl font-black text-slate-600/40 font-mono">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    step.highlight
                      ? 'bg-uniao-500/20 text-uniao-300 border border-uniao-500/40'
                      : 'bg-white/5 text-slate-400'
                  }`}>
                    {step.tag}
                  </span>
                  {idx < 3 && (
                    <ArrowRight className="w-4 h-4 text-slate-600 hidden lg:block" />
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Callout */}
        <div data-reveal="fade-up" className="mt-12 max-w-4xl mx-auto rounded-2xl bg-gradient-to-r from-uniao-950/80 to-slate-900/90 border border-uniao-500/30 p-6 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-uniao-500/20 text-uniao-400 flex items-center justify-center shrink-0 border border-uniao-500/30">
            <AlertTriangle className="w-6 h-6 text-uniao-400" />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="text-sm font-bold text-white">
              Garantia de Aproveitamento: Pré-requisito de Liberação
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              O aluno só é liberado para o <strong>simulado prático presencial</strong> após concluir os módulos teóricos, atingir a nota mínima na prova e ter o debriefing aprovado no simulador online. Isso assegura turmas presenciais 100% dinâmicas e de alto rendimento.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
