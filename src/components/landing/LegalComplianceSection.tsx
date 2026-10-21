import React from 'react';
import { 
  Building2, School, Dumbbell, 
  ArrowRight, AlertTriangle
} from 'lucide-react';

export const LegalComplianceSection: React.FC = () => {
  const cards = [
    {
      icon: School,
      target: 'Para Escolas, Colégios e Creches',
      highlight: 'Obrigatoriedade Federal — Lei Lucas (13.722/18)',
      risk: 'A omissão de capacitação em primeiros socorros acarreta multas, cassação de alvará e responsabilização penal direta dos gestores em caso de incidentes.',
      solution: 'Treinamento completo para 100% dos professores e funcionários com simulação prática de desengasgo, convulsão e PCR infantil.',
      action: 'Adequar Minha Escola Agora',
      badge: 'Exigência Legal'
    },
    {
      icon: Dumbbell,
      target: 'Para Academias e Centros Esportivos',
      highlight: 'Proteção contra Morte Súbita e Parada Cardíaca',
      risk: 'Exercícios de alta intensidade aumentam o risco de arritmias súbitas. Sem RCP imediata e DEA nos primeiros 3 minutos, a chance de sobrevida cai para menos de 10%.',
      solution: 'Instrutores habilitados para operar o Desfibrilador (DEA), início fulminante de compressões e controle de fraturas e luxações.',
      action: 'Capacitar Minha Academia',
      badge: 'Tempo Crítico'
    },
    {
      icon: Building2,
      target: 'Para Empresas, Indústrias e Logística',
      highlight: 'Conformidade com NR-07 e Controle de Hemorragias',
      risk: 'Acidentes de trabalho com máquinas e cortes profundos causam choque hipovolêmico letal antes da chegada do SAMU se a brigada não souber usar torniquete.',
      solution: 'Brigadas treinadas no protocolo Stop the Bleed e APH tático para estancar hemorragias e evacuar com segurança.',
      action: 'Treinar Brigada Corporativa',
      badge: 'Risco Operacional'
    }
  ];

  return (
    <section id="urgencia" className="py-24 lg:py-32 bg-slate-950 text-white relative border-t border-white/5 overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header de Alto Impacto Comercial */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>Responsabilidade Jurídica & Preservação da Vida</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-sans">
            Sua instituição está <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-uniao-400">
              realmente protegida ou correndo riscos?
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed font-light">
            Não é apenas uma questão de segurança humana: é conformidade jurídica, reputação e tranquilidade operacional para diretores e proprietários.
          </p>
        </div>

        {/* 3 Cards de Conversão Direta por Segmento */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            const link = `https://wa.me/5561999638011?text=${encodeURIComponent(`Olá! Gostaria de uma proposta de adequação de treinamento para: ${card.target}`)}`;

            return (
              <div 
                key={idx}
                className="group relative rounded-3xl p-8 bg-slate-900/90 border border-white/10 hover:border-uniao-500/60 shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-2"
              >
                <div className="space-y-6">
                  
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-uniao-500/10 border border-uniao-500/30 text-uniao-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-uniao-400 uppercase tracking-widest block mb-1">
                      {card.target}
                    </span>
                    <h3 className="text-xl font-black text-white leading-snug">
                      {card.highlight}
                    </h3>
                  </div>

                  {/* O Perigo Real */}
                  <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/20 text-xs text-red-200/90 leading-relaxed space-y-1">
                    <span className="font-bold text-red-400 uppercase text-[10px] tracking-wider block">
                      ⚠️ O Risco Real Sem Treinamento:
                    </span>
                    <p>{card.risk}</p>
                  </div>

                  {/* A Solução da União */}
                  <div className="space-y-1 text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider block">
                      ✓ A Resposta da União Serviços Médicos:
                    </span>
                    <p>{card.solution}</p>
                  </div>

                </div>

                <div className="pt-8 mt-6 border-t border-white/10">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-uniao-400 via-teal-300 to-emerald-300 hover:brightness-110 shadow-lg shadow-uniao-500/20 transition-all"
                  >
                    <span>{card.action}</span>
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
