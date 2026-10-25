import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Award, CheckCircle2, XCircle, Search, ShieldCheck } from 'lucide-react';
import { supabase } from '../../services/supabase/client';

type CertificateResult = {
  valid: boolean;
  student_name: string | null;
  course_title: string | null;
  hours: number | null;
  issued_on: string | null;
  certificate_status: 'valid' | 'revoked' | 'not_found' | 'invalid';
};

/**
 * A certificate is verified only against a server-issued, unguessable registry code.
 * Never recognize client-side prefixes, demo tokens, or locally generated certificates.
 */
export const CertificateValidationPage: React.FC = () => {
  const { code: urlCode } = useParams<{ code?: string }>();
  const [code, setCode] = useState(urlCode || '');
  const [result, setResult] = useState<CertificateResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateCode = async (input: string) => {
    const normalized = input.trim().toUpperCase();
    setSearched(true);
    setResult(null);
    setError(null);
    // Fast local shape validation reduces accidental queries; database is authority.
    if (!/^USM-[0-9A-F]{32}$/.test(normalized)) {
      setResult({ valid: false, student_name: null, course_title: null, hours: null, issued_on: null, certificate_status: 'invalid' });
      return;
    }
    setLoading(true);
    try {
      const { data, error: rpcError } = await supabase.rpc('verify_uniao_certificate', { p_code: normalized });
      if (rpcError) throw rpcError;
      const item = Array.isArray(data) ? data[0] : null;
      setResult(item || { valid: false, student_name: null, course_title: null, hours: null, issued_on: null, certificate_status: 'not_found' });
    } catch {
      setError('Não foi possível consultar o registro oficial agora. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCode(urlCode || '');
    if (urlCode) void validateCode(urlCode);
    else { setResult(null); setSearched(false); setError(null); }
  }, [urlCode]);

  return (
    <div className="landing-dark certificate-page min-h-screen flex flex-col bg-slate-950 text-white">
      <Navbar />
      <main className="flex-1 py-28 sm:py-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-3 mb-10">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-teal-500/15 flex items-center justify-center text-teal-300"><Award className="w-8 h-8" /></div>
            <h1 className="text-3xl sm:text-4xl font-extrabold">Validação de Certificado</h1>
            <p className="text-slate-300">Confirme a emissão de um certificado da União Serviços Médicos por meio do código de verificação.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 sm:p-8 space-y-6">
            <form onSubmit={event => { event.preventDefault(); void validateCode(code); }} className="flex flex-col sm:flex-row gap-3">
              <input aria-label="Código de verificação" autoComplete="off" spellCheck={false} maxLength={36} value={code} onChange={event => setCode(event.target.value)}
                placeholder="USM-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                className="flex-1 min-w-0 rounded-xl border border-white/20 bg-slate-950 px-4 py-3 text-white text-sm uppercase focus:outline-none focus:border-teal-500" />
              <button type="submit" disabled={loading || !code.trim()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-400 px-5 py-3 text-slate-950 font-bold disabled:opacity-50">
                <Search className="w-4 h-4" /> {loading ? 'Consultando…' : 'Verificar'}
              </button>
            </form>
            {error && <div role="alert" className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-4 text-amber-200">{error}</div>}
            {searched && !loading && result && (
              result.valid && result.certificate_status === 'valid' ?
              <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-5 space-y-3">
                <h2 className="flex items-center gap-2 text-emerald-300 font-bold"><CheckCircle2 className="w-5 h-5" /> Certificado registrado e válido</h2>
                <p><strong>Aluno:</strong> {result.student_name}</p>
                <p><strong>Curso:</strong> {result.course_title}</p>
                <p><strong>Carga horária:</strong> {result.hours ?? 0} horas</p>
                <p><strong>Emissão:</strong> {result.issued_on ? new Date(result.issued_on + 'T12:00:00').toLocaleDateString('pt-BR') : '—'}</p>
              </div> :
              <div role="status" className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-5 text-amber-200 flex items-start gap-3">
                <XCircle className="w-5 h-5 shrink-0" />
                <p>{result.certificate_status === 'revoked' ? 'Este certificado foi revogado e não é válido.' : 'Não foi encontrado certificado oficial válido para esse código.'}</p>
              </div>
            )}
            <p className="flex items-center gap-2 text-xs text-slate-400"><ShieldCheck className="w-4 h-4" /> Consulta baseada no registro oficial, não em códigos de demonstração.</p>
          </div>
          <div className="text-center mt-6"><Link to="/" className="text-teal-300 text-sm hover:underline">Voltar ao site</Link></div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
