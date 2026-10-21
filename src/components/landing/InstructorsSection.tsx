import React from 'react';
import { UserCheck, ShieldCheck, Sparkles } from 'lucide-react';

export const InstructorsSection: React.FC = () => {
  return (
    <section id="instrutores" className="py-24 lg:py-32 bg-slate-950 text-white relative border-t border-white/5 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[160px] pointer-events-none animate-pulse-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div data-reveal="fade-down" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-uniao-500/10 border border-uniao-500/30 text-uniao-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-uniao-400" />
            <span>Corpo Docente</span>
          </div>

          <h2 data-reveal="fade-up" className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans">
            Instrutores qualificados em <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-uniao-400 to-emerald-300">
              medicina de emergência
            </span>
          </h2>

          <p data-reveal="fade-up" className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
            Profissionais dedicados ao treinamento e aperfeiçoamento contínuo em medicina de urgência, resgate e cuidados pré-hospitalares.
          </p>
        </div>

        {/* Instructors Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
          {[1, 2, 3].map((_, idx) => (
            <div 
              key={idx}
              data-reveal="fade-up"
              data-reveal-delay={`${idx * 150}`}
              className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 flex flex-col items-center text-center hover:border-uniao-500/60 hover:bg-slate-900 shadow-2xl hover:shadow-[0_0_35px_rgba(20,184,166,0.2)] transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className="w-24 h-24 rounded-full bg-uniao-500/15 border-2 border-uniao-500/30 flex items-center justify-center text-uniao-400 mb-6 group-hover:bg-uniao-400 group-hover:text-slate-950 transition-all duration-300 shadow-lg shadow-uniao-500/10">
                <UserCheck className="w-10 h-10" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 mb-3">
                Instrutor Habilitado USM
              </span>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-uniao-300 transition-colors">
                Especialista em Urgência e APH
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Atuação comprovada em atendimento pré-hospitalar, suporte avançado de vida e condução de simulações realísticas em campo.
              </p>

              <div className="flex items-center gap-1.5 text-[11px] font-bold text-uniao-300 bg-uniao-500/10 px-4 py-1.5 rounded-full border border-uniao-500/30 mt-auto">
                <ShieldCheck className="w-3.5 h-3.5 text-uniao-400" />
                <span>Cadastro e Certificação Oficial</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs text-slate-500">
            * Perfis curriculares detalhados gerenciados e validados pelo painel administrativo da União Serviços Médicos.
          </p>
        </div>

      </div>
    </section>
  );
};
