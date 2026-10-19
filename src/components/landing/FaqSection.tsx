import React, { useState } from 'react';
import { ChevronDown, HelpCircle, PhoneCall } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'O treinamento da União Serviços Médicos atende 100% às exigências da Lei Lucas (Lei 13.722/18)?',
      a: 'Sim, integralmente. Nosso programa para escolas e creches emite certificado reconhecido em todo o território nacional, com carga horária compatível, instrutores de saúde habilitados e conteúdo prático com manequins de desengasgo infantil e RCP.'
    },
    {
      q: 'Como funciona o acesso à etapa online antes do treinamento presencial?',
      a: 'Ao contratar a turma, a diretoria ou RH nos envia a lista de colaboradores. Cada participante recebe um convite seguro por e-mail, assiste às videoaulas, estuda as apostilas e realiza os simulados clínicos no site. Apenas após aprovação no ambiente digital, o aluno é liberado para a imersão prática presencial.'
    },
    {
      q: 'O treinamento presencial pode ser realizado no próprio espaço da nossa instituição?',
      a: 'Com certeza. Nossos instrutores levam todos os equipamentos de simulação (desfibriladores de treino DEA, manequins com feedback de compressão torácica, torniquetes de extremidade e curativos compressivos) até a sua escola, academia ou empresa, adaptando o cenário à sua planta física real.'
    },
    {
      q: 'Qual é a validade dos certificados emitidos?',
      a: 'Os certificados têm validade legal de 1 a 2 anos (conforme a norma regulamentadora aplicável) e contam com chave criptográfica única e QR Code para validação pública instantânea de autenticidade no nosso portal.'
    },
    {
      q: 'Quem são os profissionais que ministram os treinamentos presenciais?',
      a: 'Nossa equipe é formada exclusivamente por profissionais da área da saúde com atuação prática comprovada em Atendimento Pré-Hospitalar (APH), resgate e emergências médicas.'
    }
  ];

  return (
    <section className="py-24 lg:py-32 bg-slate-950 text-white relative border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-uniao-500/10 border border-uniao-500/30 text-uniao-400 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Perguntas Frequentes</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-sans">
            Tire suas dúvidas antes de contratar
          </h2>

          <p className="text-sm sm:text-base text-slate-400 font-light">
            Transparência total para você tomar a decisão certa para a segurança da sua equipe.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-slate-900/80 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-white">
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-uniao-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Floating Call to Action */}
        <div className="mt-12 text-center">
          <a
            href="https://wa.me/5500000000000?text=Ol%C3%A1!%20Ainda%20tenho%20d%C3%BAvidas%20sobre%20a%20capacita%C3%A7%C3%A3o%20da%20Uni%C3%A3o."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-uniao-400 hover:text-uniao-300 underline"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Possui uma dúvida específica? Fale agora mesmo com nossa equipe no WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
