import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabase/client';
type Certificate = { id: string; title: string; workload_hours: number; issued_at: string; verification_code: string; revoked_at: string | null };
export const CertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let alive = true;
    supabase.from('certificate_issuances')
      .select('id,title,workload_hours,issued_at,verification_code,revoked_at')
      .order('issued_at', { ascending: false })
      .then(({ data, error: failure }) => {
        if (!alive) return;
        setLoading(false);
        if (failure) setError('Não foi possível carregar seus certificados.');
        else setCertificates((data || []) as Certificate[]);
      });
    return () => { alive = false; };
  }, []);
  return <main className="mx-auto w-full max-w-5xl p-6 space-y-6">
    <header className="rounded-2xl bg-slate-900 p-6 border border-white/10">
      <h1 className="text-2xl font-bold text-white">Meus certificados</h1>
      <p className="text-sm text-slate-400">Somente certificados oficialmente emitidos aparecem aqui.</p>
    </header>
    {loading && <p className="text-slate-400">Consultando certificados…</p>}
    {error && <p role="alert" className="text-amber-300">{error}</p>}
    {!loading && !error && certificates.length === 0 && <p className="text-slate-400">Nenhum certificado foi emitido para sua conta ainda.</p>}
    {certificates.map(cert => <article key={cert.id} className="rounded-2xl bg-slate-900 p-6 border border-white/10 space-y-3">
      <h2 className="text-lg font-bold text-white">{cert.title}</h2>
      <p className="text-slate-300 text-sm">{cert.workload_hours} horas · Emissão: {new Date(cert.issued_at).toLocaleDateString('pt-BR')}</p>
      <p className="font-mono text-xs break-all text-slate-400">{cert.verification_code}</p>
      {cert.revoked_at ? <p className="text-amber-300">Certificado revogado</p> :
        <Link className="inline-block rounded-xl bg-teal-400 text-slate-950 px-4 py-2 font-bold" to={`/validar-certificado/${cert.verification_code}`}>Verificar autenticidade</Link>}
    </article>)}
  </main>;
};
