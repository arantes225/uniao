import React from 'react';
import { UserCheck, ShieldCheck } from 'lucide-react';

export const InstructorsSection: React.FC = () => {
  // Conforme o Prompt Mestre: Não inventar nomes, títulos ou fotos fictícias.
  // Exibimos estrutura elegante e placeholders profissionais enquanto os dados são cadastrados no painel admin.
  return (
    <section id="instrutores" className="py-20 lg:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold tracking-widest text-uniao-600 uppercase bg-uniao-50 px-3.5 py-1.5 rounded-full border border-uniao-100">
            Corpo Docente
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Conheça nossos instrutores
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Profissionais dedicados ao treinamento e aperfeiçoamento contínuo em medicina de urgência, resgate e cuidados pré-hospitalares.
          </p>
        </div>

        {/* Instructors Preview Cards (Placeholder elegante administrável) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
          {[1, 2, 3].map((_, idx) => (
            <div 
              key={idx}
              className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col items-center text-center hover:shadow-soft transition-all"
            >
              <div className="w-24 h-24 rounded-full bg-uniao-100/70 border-2 border-uniao-200 flex items-center justify-center text-uniao-700 mb-5">
                <UserCheck className="w-10 h-10" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-200/70 text-slate-700 mb-2">
                Instrutor Habilitado USM
              </span>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Especialista em Urgência e APH
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Atuação em atendimento pré-hospitalar, suporte avançado de vida e condução de simulações realísticas.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-uniao-700 bg-uniao-50 px-3 py-1 rounded-full border border-uniao-100 mt-auto">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Cadastro e Certificação Oficial</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs text-slate-400">
            * Perfis curriculares detalhados gerenciados e validados pelo painel administrativo da União Serviços Médicos.
          </p>
        </div>

      </div>
    </section>
  );
};
