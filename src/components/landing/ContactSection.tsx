import React, { useState } from 'react';
import { PhoneCall, Mail, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { supabase } from '../../services/supabase/client';

export const ContactSection: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    institution: '',
    audience: 'Escola / Colégio',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const whatsappUrl = "https://wa.me/5561999638011?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20uma%20proposta%20de%20capacita%C3%A7%C3%A3o%20para%20minha%20institui%C3%A7%C3%A3o.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Salva o lead diretamente no Supabase União
      const { error: insertError } = await supabase.from('contact_leads').insert([
        {
          contact_name: form.name,
          email: form.email,
          institution_name: form.institution,
          audience: form.audience,
          message: form.message,
        }
      ]);

      if (insertError) throw insertError;
      setSuccess(true);
      setForm({ name: '', email: '', institution: '', audience: 'Escola / Colégio', message: '' });
    } catch (err: any) {
      console.error('Erro ao enviar contato:', err);
      setError('Recebemos sua mensagem! Se preferir retorno imediato, fale conosco diretamente pelo WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contato" className="py-24 lg:py-32 bg-slate-950 text-white relative border-t border-white/5 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-uniao-600/10 rounded-full blur-[180px] pointer-events-none animate-pulse-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Banner CTA */}
        <div data-reveal="fade-up" className="rounded-3xl bg-gradient-to-br from-slate-900 via-uniao-950/80 to-slate-900 border border-uniao-500/30 text-white p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden mb-16 shadow-[0_0_50px_rgba(20,184,166,0.15)]">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-uniao-500/10 border border-uniao-500/30 text-uniao-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-uniao-400" />
              <span>Prontidão e Resposta Rápida</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-sans">
              Prepare sua equipe para agir quando <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-uniao-400 to-emerald-300">
                cada segundo importa.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light pt-1">
              Solicite uma proposta detalhada para capacitar os colaboradores ou alunos da sua instituição com a equipe da União Serviços Médicos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-extrabold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-uniao-400 via-teal-300 to-emerald-300 hover:brightness-110 shadow-lg shadow-uniao-500/20 transition-all transform hover:-translate-y-0.5"
              >
                <PhoneCall className="w-4 h-4 text-slate-950" />
                <span>Falar pelo WhatsApp</span>
              </a>

              <a
                href="mailto:uniaoservicosmedicos@gmail.com"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur-md transition-all"
              >
                <Mail className="w-4 h-4 text-uniao-400" />
                <span>Enviar um E-mail</span>
              </a>
            </div>
          </div>
        </div>

        {/* Formulário de Proposta */}
        <div data-reveal="fade-up" data-reveal-delay="150" className="max-w-2xl mx-auto bg-slate-900/90 rounded-3xl border border-white/10 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 text-center">
            Solicite um orçamento institucional
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 text-center mb-8">
            Preencha os dados abaixo e nossa coordenação pedagógica entrará em contato.
          </p>

          {success ? (
            <div className="p-8 rounded-2xl bg-uniao-500/10 border border-uniao-500/30 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-uniao-400 mx-auto" />
              <h4 className="text-xl font-bold text-white">Solicitação enviada com sucesso!</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Nossa equipe entrará em contato em breve com a proposta personalizada.
              </p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="mt-2 text-xs font-bold text-uniao-400 hover:text-uniao-300 underline"
              >
                Enviar nova mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Seu nome"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-uniao-400/50 focus:border-uniao-400 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    E-mail Institucional
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="seu@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-uniao-400/50 focus:border-uniao-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Nome da Instituição
                  </label>
                  <input
                    type="text"
                    value={form.institution}
                    onChange={(e) => setForm({ ...form, institution: e.target.value })}
                    placeholder="Escola, Empresa, Academia..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-uniao-400/50 focus:border-uniao-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Tipo de Instituição
                </label>
                <select
                  value={form.audience}
                  onChange={(e) => setForm({ ...form, audience: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-uniao-400/50 focus:border-uniao-400 transition-all"
                >
                  <option value="Escola / Colégio">Escola / Colégio</option>
                  <option value="Academia / Centro Esportivo">Academia / Centro Esportivo</option>
                  <option value="Empresa / Indústria">Empresa / Indústria</option>
                  <option value="Profissional Autônomo">Profissional Autônomo</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Mensagem / Necessidade do Treinamento
                </label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Ex: Treinamento de primeiros socorros para 30 professores em conformidade com a Lei Lucas..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-uniao-400/50 focus:border-uniao-400 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-black text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-uniao-400 via-teal-300 to-emerald-300 hover:brightness-110 shadow-xl shadow-uniao-500/20 transition-all disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <span>Enviando solicitação...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar solicitação de proposta</span>
                  </>
                )}
              </button>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
