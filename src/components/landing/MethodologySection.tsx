import React from 'react';
import { Video, FileText, HelpCircle, Activity, Award, UserCheck } from 'lucide-react';

export const MethodologySection: React.FC = () => {
  const steps = [
    {
      icon: Video,
      title: '1. Videoaulas Diretas',
      description: 'Aulas objetivas e focadas na fundamentação técnica dos procedimentos essenciais.'
    },
    {
      icon: FileText,
      title: '2. Apostilas Completas',
      description: 'Material didático em PDF integrado para consulta rápida e reforço dos conceitos.'
    },
    {
      icon: HelpCircle,
      title: '3. 5 Questões de Fixação',
      description: 'Avaliação imediata ao término de cada aula para assegurar a retenção do conteúdo.'
    },
    {
      icon: Activity,
      title: '4. Prática e Simulação',
      description: 'Treinamento presencial intensivo ou simulações guiadas de cenários de emergência.'
    },
    {
      icon: Award,
      title: '5. Certificação Autêntica',
      description: 'Emissão de certificado digital com QR Code e validação pública de autenticidade.'
    },
    {
      icon: UserCheck,
      title: '6. Instrutores de Saúde',
      description: 'Supervisão contínua por profissionais habilitados com experiência em campo.'
    },
  ];

  return (
    <section id="metodologia" className="py-20 lg:py-28 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold tracking-widest text-uniao-400 uppercase bg-uniao-950/80 px-3.5 py-1.5 rounded-full border border-uniao-500/30">
            Metodologia Educacional
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Como funciona a jornada de aprendizado
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Unimos o melhor do ensino digital estruturado com a prática presencial indispensável na área da saúde.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className="rounded-2xl p-7 bg-slate-800/60 border border-slate-700/80 hover:border-uniao-500/50 hover:bg-slate-800 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-uniao-500/20 text-uniao-400 flex items-center justify-center mb-5 border border-uniao-500/30">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
