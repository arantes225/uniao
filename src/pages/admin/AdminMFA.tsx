import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase/client';

type AuthState = 'loading' | 'verified' | 'enroll' | 'challenge' | 'unconfigured';

export const AdminMFA: React.FC = () => {
  const [status,setStatus] = useState<AuthState>('loading');
  const [factorId,setFactorId] = useState('');
  const [qr,setQr] = useState('');
  const [code,setCode] = useState('');
  const [error,setError] = useState('');
  const [busy,setBusy] = useState(false);

  const check = async () => {
    setError('');
    const assurance = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (assurance.error) { setError('Não foi possível verificar a autenticação adicional.');setStatus('unconfigured');return; }
    if (assurance.data.currentLevel === 'aal2') {setStatus('verified');return;}
    const factors = await supabase.auth.mfa.listFactors();
    if (factors.error) {setError('Não foi possível listar fatores MFA.');setStatus('unconfigured');return;}
    const existing = factors.data.totp.find(f=>f.status==='verified');
    if (existing) {setFactorId(existing.id);setStatus('challenge');}
    else setStatus('unconfigured');
  };

  useEffect(()=>{void check();},[]);

  const enroll = async () => {
    setBusy(true);setError('');
    const {data,error:enrollmentError}=await supabase.auth.mfa.enroll({factorType:'totp'});
    setBusy(false);
    if (enrollmentError||!data?.totp?.qr_code) {setError('Falha ao iniciar MFA. Tente novamente.');return;}
    setFactorId(data.id);setQr(data.totp.qr_code);setStatus('enroll');setCode('');
  };

  const verify = async () => {
    if (!factorId || !/^[0-9]{6}$/.test(code)) {setError('Digite o código de seis números do aplicativo autenticador.');return;}
    setBusy(true);setError('');
    const {data,error:challengeError}=await supabase.auth.mfa.challenge({factorId});
    if (challengeError||!data?.id){setError('Falha ao iniciar a verificação MFA.');setBusy(false);return;}
    const verification=await supabase.auth.mfa.verify({factorId,challengeId:data.id,code});
    setBusy(false);setCode('');
    if(verification.error){setError('Código incorreto ou expirado. Tente novamente.');return;}
    await check();
  };

  return <section className="rounded-2xl border border-teal-500/30 bg-slate-900 p-5 text-white space-y-3">
    <h2 className="font-bold">Segurança extra do administrador (MFA)</h2>
    {status==='loading' && <p className="text-sm text-slate-400">Verificando autenticação…</p>}
    {status==='verified'&& <p className="text-sm text-emerald-300">Conta autenticada com segundo fator. Emissão e revogação de certificados estão protegidas.</p>}
    {status==='unconfigured'&& <>
      <p className="text-sm text-amber-200">Configure um aplicativo autenticador (TOTP) para proteger a conta administrativa. Guarde os códigos e meios de recuperação em local seguro.</p>
      <button type="button" disabled={busy} onClick={()=>void enroll()} className="rounded-xl bg-teal-400 text-slate-950 px-4 py-2 font-bold disabled:opacity-40">Configurar autenticador</button>
    </>}
    {status==='enroll'&& <>
      <p className="text-sm text-slate-300">Leia este QR no Google Authenticator, Microsoft Authenticator ou outro aplicativo compatível. Nunca compartilhe esse QR.</p>
      {qr && <img src={qr} alt="QR de ativação do autenticador — mantenha privado" className="w-44 h-44 bg-white rounded-xl p-2"/>}
    </>}
    {(status==='enroll'||status==='challenge') && <>
      <p className="text-sm text-slate-300">Digite o código do autenticador para concluir o acesso protegido.</p>
      <form onSubmit={e=>{e.preventDefault();void verify();}} className="flex flex-wrap gap-2 items-end">
        <label className="text-sm">Código de seis dígitos
          <input type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6}
            value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,'').slice(0,6))}
            className="block bg-slate-950 text-white border border-slate-700 p-3 rounded-xl mt-1 font-mono tracking-widest"/>
        </label>
        <button type="submit" disabled={busy || code.length!==6} className="bg-teal-400 text-slate-950 rounded-xl p-3 font-bold disabled:opacity-40">{busy?'Verificando…':'Confirmar MFA'}</button>
      </form>
    </>}
    {error&&<p role="alert" className="text-red-300 text-sm">{error}</p>}
  </section>;
};
