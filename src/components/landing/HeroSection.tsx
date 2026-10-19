import React from 'react';
import { ArrowRight, ShieldCheck, HeartPulse, Activity, PhoneCall, Award } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const whatsappUrl = "https://wa.me/5500000000000?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20informa%C3%A7%C3%B5es%20sobre%20os%20treinamentos%20da%20Uni%C3%A3o%20Servi%C3%A7os%20M%C3%A9dicos.";

  return (
    <section id="inicio" className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden gradient-hero">
      {/* Background soft glow elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-uniao-200/40 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-uniao-50 border border-uniao-200/80 text-uniao-800 text-xs font-semibold tracking-wide">
              <ShieldCheck className="w-4 h-4 text-uniao-600" />
              <span>Capacitações Médicas e Treinamentos em Emergências</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Conhecimento que prepara. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-uniao-700 via-uniao-600 to-teal-500">
                Treinamento que salva vidas.
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
              A <strong>União Serviços Médicos</strong> promove capacitações especializadas em atendimento pré-hospitalar, primeiros socorros e controle de hemorragias, com treinamentos adaptados às necessidades de escolas, academias, empresas e instituições.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-bold text-white bg-uniao-600 hover:bg-uniao-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <PhoneCall className="w-5 h-5" />
                <span>Solicitar treinamento</span>
              </a>

              <a
                href="#cursos"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all"
              >
                <span>Conhecer nossos cursos</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* Key Value Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200/70 max-w-xl mx-auto lg:mx-0 text-left">
              <div>
                <div className="text-2xl font-bold text-slate-900">100%</div>
                <div className="text-xs text-slate-500 font-medium">Protocolos atualizados</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">Prático</div>
                <div className="text-xs text-slate-500 font-medium">Simulações reais</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">Certificado</div>
                <div className="text-xs text-slate-500 font-medium">Autenticação digital</div>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Component with Brand Identity */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Card Container */}
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-800 p-8 text-white">
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* Brand Cross Icon Overlay */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                  
                  <div className="w-28 h-28 p-4 rounded-2xl bg-slate-800/80 border border-uniao-500/30 shadow-inner flex items-center justify-center">
                    <img 
                      src="/brand/logo-uniao.png" 
                      alt="Símbolo Cruz União" 
                      className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(20,184,166,0.35)]"
                    />
                  </div>

                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-uniao-500/20 text-uniao-300 border border-uniao-500/30 mb-2">
                      Excelência Pedagógica em Saúde
                    </span>
                    <h3 className="text-2xl font-bold text-white">
                      Treinamentos que preparam para o imprevisto
                    </h3>
                    <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                      Equipes capacitadas com tomada de decisão rápida, segurança de cena e procedimentos técnicos eficazes.
                    </p>
                  </div>

                  {/* Micro features list */}
                  <div className="w-full space-y-2.5 text-left text-xs text-slate-300 pt-2">
                    <div className="flex items-center gap-2.5 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                      <HeartPulse className="w-4 h-4 text-uniao-400 shrink-0" />
                      <span>Reconhecimento imediato de emergências cardiorrespiratórias</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                      <Activity className="w-4 h-4 text-uniao-400 shrink-0" />
                      <span>Aplicação correta de torniquetes e curativos compressivos</span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                      <Award className="w-4 h-4 text-uniao-400 shrink-0" />
                      <span>Plataforma educacional com apostilas e certificação</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
