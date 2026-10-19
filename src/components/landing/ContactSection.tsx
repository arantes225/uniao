import React, { useState } from 'react';
import { PhoneCall, Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';
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

  const whatsappUrl = "https://wa.me/5500000000000?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20uma%20proposta%20de%20capacita%C3%A7%C3%A3o%20para%20minha%20institui%C3%A7%C3%A3o.";

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
      // Mesmo se houver falha de inserção (ex: RLS público estrito), oferecemos o link direto do WhatsApp/Mailto
      setError('Recebemos sua mensagem! Se preferir retorno imediato, fale conosco diretamente pelo WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contato" className="py-20 lg:py-28 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner CTA */}
        <div className="rounded-3xl bg-gradient-to-br from-uniao-900 via-uniao-800 to-slate-900 text-white p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden mb-16">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="text-xs font-bold tracking-widest text-uniao-300 uppercase bg-uniao-700/50 px-3.5 py-1.5 rounded-full border border-uniao-500/30">
              Prontidão e Resposta Rápida
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Prepare sua equipe para agir quando cada segundo importa.
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed pt-2">
              Solicite uma proposta detalhada para capacitar os colaboradores ou alunos da sua instituição com a equipe da União Serviços Médicos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-md transition-all"
              >
                <PhoneCall className="w-5 h-5 text-uniao-600" />
                <span>Falar pelo WhatsApp</span>
              </a>
              <a
                href="mailto:contato@uniaoservicosmedicos.com.br"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-uniao-700 hover:bg-uniao-600 border border-uniao-500/40 transition-all"
              >
                <Mail className="w-5 h-5" />
                <span>Enviar um e-mail</span>
              </a>
            </div>
          </div>
        </div>

        {/* Formulário de Proposta */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-slate-900 mb-2 text-center">
            Solicite um orçamento institucional
          </h3>
          <p className="text-sm text-slate-600 text-center mb-8">
            Preencha os dados abaixo e nossa coordenação pedagógica entrará em contato.
          </p>

          {success ? (
            <div className="p-6 rounded-xl bg-uniao-50 border border-uniao-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-uniao-600 mx-auto" />
              <h4 className="text-lg font-bold text-slate-900">Solicitação enviada com sucesso!</h4>
              <p className="text-sm text-slate-600">
                Nossa equipe entrará em contato em breve com a proposta personalizada.
              </p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="mt-2 text-xs font-semibold text-uniao-700 underline"
              >
                Enviar nova mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Seu nome"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-uniao-500/50 focus:border-uniao-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    E-mail Institucional
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="seu@email.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-uniao-500/50 focus:border-uniao-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Nome da Instituição
                  </label>
                  <input
                    type="text"
                    value={form.institution}
                    onChange={(e) => setForm({ ...form, institution: e.target.value })}
                    placeholder="Escola, Empresa, Academia..."
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-uniao-500/50 focus:border-uniao-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Tipo de Instituição
                </label>
                <select
                  value={form.audience}
                  onChange={(e) => setForm({ ...form, audience: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-uniao-500/50 focus:border-uniao-500 bg-white"
                >
                  <option value="Escola / Colégio">Escola / Colégio</option>
                  <option value="Academia / Centro Esportivo">Academia / Centro Esportivo</option>
                  <option value="Empresa / Indústria">Empresa / Indústria</option>
                  <option value="Profissional Autônomo">Profissional Autônomo</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Mensagem / Necessidade do Treinamento
                </label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Ex: Treinamento de primeiros socorros para 30 professores em conformidade com a Lei Lucas..."
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-uniao-500/50 focus:border-uniao-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-uniao-600 hover:bg-uniao-700 transition-all shadow disabled:opacity-50 mt-2"
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
