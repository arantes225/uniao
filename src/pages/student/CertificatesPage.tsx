import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase/client';
import { StudentCertificate, IssuedCertificate } from '../../components/student/StudentCertificate';

export const CertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<IssuedCertificate[]>([]);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      const {data:{user},error:authError}=await supabase.auth.getUser();
      if (!active) return;
      if (authError||!user) { setError('Faça login para consultar seus certificados.');setLoading(false);return; }

      const [{data:profile,error:nameError},{data:issuances,error:certError}] = await Promise.all([
        supabase.from('profiles').select('full_name').eq('id',user.id).maybeSingle(),
        supabase.from('certificate_issuances')
          .select('id,title,workload_hours,issued_at,verification_code,revoked_at,template_snapshot')
          .order('issued_at',{ascending:false}),
      ]);
      if (!active) return;
      if (certError) setError('Não foi possível consultar certificados oficiais.');
      else setCertificates((issuances||[]) as IssuedCertificate[]);
      if (nameError||!profile?.full_name?.trim()) setError(previous=>previous || 'Seu nome cadastrado não está disponível. Peça à equipe que corrija o cadastro antes de imprimir.');
      else setFullName(profile.full_name.trim());
      setLoading(false);
    })();
    return () => {active=false;};
  },[]);

  return <main className="mx-auto w-full max-w-6xl p-6 space-y-6">
    <header className="rounded-2xl bg-slate-900 p-6 border border-white/10">
      <h1 className="text-2xl font-bold text-white">Meus certificados</h1>
      <p className="text-sm text-slate-400 mt-2">Certificados efetivamente emitidos com código de validação. Abra a impressão e escolha «Salvar como PDF».</p>
    </header>
    {loading && <p className="text-slate-400">Consultando os registros oficiais…</p>}
    {error && <p role="alert" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-300">{error}</p>}
    {!loading&&!certificates.length&&!error && <p className="rounded-xl bg-slate-900 p-6 text-slate-400">Nenhum certificado oficial foi emitido para esta conta.</p>}
    {!loading && certificates.map(certificate=>
      <StudentCertificate key={certificate.id} studentName={fullName} certificate={certificate}/>
    )}
  </main>;
};
