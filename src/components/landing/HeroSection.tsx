import React from 'react';
import { ArrowRight, ShieldAlert, PhoneCall, Zap, HeartPulse, Clock, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const whatsappUrl = "https://wa.me/5561999638011?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20informa%C3%A7%C3%B5es%20urgentes%20sobre%20capacita%C3%A7%C3%B5es%20da%20Uni%C3%A3o%20Servi%C3%A7os%20M%C3%A9dicos.";

  return (
    <section id="inicio" className="relative pt-32 pb-24 lg:pt-40 lg:pb-36 bg-slate-950 text-white overflow-hidden">
      
      {/* Background Animated Gradients & Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-uniao-600/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[130px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(20,184,166,0.15)_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Dynamic Sales Urgency Capsule */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-slate-900/90 border border-uniao-500/40 text-uniao-300 shadow-[0_0_25px_rgba(20,184,166,0.25)] hover:border-uniao-400 transition-all">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-xs font-black tracking-wide uppercase">
              Plantão de Agendamento Aberto para Turmas Institucionais
            </span>
          </div>
        </div>

        {/* Impactful Heading */}
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] font-sans">
            Quando cada segundo importa, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-uniao-400 to-emerald-400 drop-shadow-[0_0_35px_rgba(20,184,166,0.4)]">
              sua equipe sabe exatamente o que fazer?
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Uma hemorragia grave mata em <strong>3 a 5 minutos</strong>. Uma parada cardíaca causa danos cerebrais irreversíveis em <strong>4 minutos</strong>. A <strong className="text-white font-semibold">União Serviços Médicos</strong> transforma professores, instrutores e colaboradores em socorristas preparados para intervir com maestria.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-extrabold text-slate-950 bg-gradient-to-r from-uniao-400 via-teal-300 to-emerald-300 hover:brightness-110 shadow-[0_0_30px_rgba(20,184,166,0.4)] transition-all transform hover:-translate-y-1"
            >
              <PhoneCall className="w-5 h-5 text-slate-950" />
              <span>Solicitar Treinamento Agora</span>
            </a>

            <button
              type="button"
              onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all"
            >
              <Sparkles className="w-4 h-4 text-uniao-400" />
              <span>Solicitar orçamento</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

        </div>

        {false && (<>
        {/* Hero Interactive Proof Display (com a Cruz Oficial Fluida) */}
        <div className="mt-16 lg:mt-24 max-w-5xl mx-auto">
          <div className="relative rounded-3xl p-1 bg-gradient-to-b from-uniao-500/40 via-slate-800/60 to-transparent shadow-2xl">
            <div className="rounded-[23px] bg-slate-900/95 backdrop-blur-2xl p-6 sm:p-10 border border-white/5">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Lado Esquerdo: Aplicação Inteligente e Minimalista do Ícone Branco em Maior Escala */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center text-center p-8 sm:p-10 rounded-2xl bg-slate-950/40 border border-white/5 relative overflow-hidden group">
                  
                  {/* Ícone Branco Puro em Destaque Imponente */}
                  <div className="relative w-48 h-48 sm:w-60 sm:h-60 flex items-center justify-center">
                    <img 
                      src="./brand/simbolo-cruz-uniao.png" 
                      alt="Cruz União Serviços Médicos" 
                      className="w-full h-full object-contain filter group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
                    />
                  </div>

                  <span className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase mt-5">
                    União Serviços Médicos
                  </span>
                  <div className="text-sm font-semibold text-white mt-0.5">
                    Capacitação & Prontidão Operacional
                  </div>
                </div>

                {/* Lado Direito: Por que você precisa agora? (Números Incontestáveis) */}
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6 text-uniao-400" />
                    <span>A diferença entre o desespero e o salvamento</span>
                  </h3>

                  <div className="space-y-3 pt-2">
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">A Janela de Ouro do Primeiro Socorrista</h4>
                        <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                          Quem está presente no local é quem decide se a vítima sobrevive. Nossos cursos eliminam o pânico e treinam reflexos automáticos.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-lg bg-uniao-500/20 text-uniao-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                        <HeartPulse className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Treinamento 100% Prático e Realístico</h4>
                        <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                          Torniquetes reais, manequins com feedback de compressão e DEA com cenários imersivos no próprio ambiente da sua instituição.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Em Conformidade com a Lei Lucas</h4>
                        <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                          Certificação oficial válida para escolas e creches, resguardando legalmente a sua diretoria e salvaguardando seus alunos.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </div>
        </>)}

      </div>
    </section>
  );
};

