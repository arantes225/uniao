import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CalendarCheck, CheckCircle2, AlertTriangle, KeyRound, ShieldCheck, Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { StudentOutletContext } from '../../services/studentCurriculum';
import { supabase } from '../../services/supabase/client';

export const PresencePage: React.FC = () => {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const { cohorts, activeCohortId, curriculumLoading, curriculumError } = useOutletContext<StudentOutletContext>();
  const [selectedCohortId, setSelectedCohortId] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [checkedInAt, setCheckedInAt] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!cohorts.length) { setSelectedCohortId(''); return; }
    setSelectedCohortId(old => cohorts.some(c => c.id === old) ? old
      : cohorts.some(c => c.id === activeCohortId) ? activeCohortId : cohorts[0].id);
  }, [cohorts, activeCohortId]);

  useEffect(() => {
    let active = true;
    setCheckedInAt(null);
    setError('');
    if (!selectedCohortId) return;
    setLoadingStatus(true);
    supabase.from('verified_attendance').select('checked_in_at')
      .eq('cohort_id', selectedCohortId).maybeSingle().then(({ data, error: queryError }) => {
        if (!active) return;
        setLoadingStatus(false);
        if (queryError) setError('Não foi possível consultar a frequência registrada.');
        else setCheckedInAt(data?.checked_in_at || null);
      });
    return () => { active = false; };
  }, [selectedCohortId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!selectedCohortId || !/^[A-F0-9]{10}$/.test(inputCode.trim().toUpperCase())) {
      setError('Insira o código de dez caracteres fornecido pelo instrutor.');
      return;
    }
    setIsSubmitting(true);
    const { data, error: serverError } = await supabase.rpc('redeem_presence_code', {
      p_cohort_id: selectedCohortId,
      p_code: inputCode.trim().toUpperCase(),
    });
    setIsSubmitting(false);
    if (serverError) {
      setError('Não foi possível registrar presença. Verifique sua matrícula e tente novamente.');
    } else if (typeof data === 'string' && data) {
      setCheckedInAt(data);
      setInputCode('');
    } else {
      setError('Código inválido, expirado ou número máximo de tentativas atingido. Após cinco erros, aguarde 30 minutos.');
    }
  };

  if (curriculumLoading) return <div className="p-8 text-sm text-slate-400">Verificando matrícula…</div>;
  if (curriculumError) return <div role="alert" className="p-8 text-amber-300">{curriculumError}</div>;

  const formatted = checkedInAt ? new Date(checkedInAt).toLocaleString('pt-BR') : '';
  return (
    <main className="mx-auto max-w-5xl p-6 sm:p-10 space-y-6">
      <header className={`rounded-3xl border p-6 ${dark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
        <h1 className={`flex items-center gap-3 text-2xl font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>
          <CalendarCheck className="w-7 h-7 text-teal-400" /> Frequência presencial
        </h1>
        <p className="mt-2 text-sm text-slate-400">Registre a presença com o código temporário exibido pelo instrutor. A confirmação é gravada no sistema, não apenas neste dispositivo.</p>
      </header>

      <section className={`rounded-3xl border p-6 sm:p-8 space-y-6 ${dark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
        <div>
          <label htmlFor="presence-cohort" className="block text-sm font-semibold text-teal-400 mb-2">Turma do treinamento</label>
          <select id="presence-cohort" value={selectedCohortId} onChange={e => setSelectedCohortId(e.target.value)}
            className={`w-full rounded-xl border p-3 ${dark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}>
            {!cohorts.length && <option value="">Nenhuma matrícula ativa</option>}
            {cohorts.map(cohort => <option key={cohort.id} value={cohort.id}>{cohort.name}</option>)}
          </select>
        </div>

        {loadingStatus ? <p className="text-slate-400 flex items-center gap-2"><Clock className="w-4 h-4" /> Consultando registro…</p>
        : checkedInAt ? (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-center p-8 space-y-3">
            <CheckCircle2 className="mx-auto w-10 h-10 text-emerald-400" />
            <h2 className="font-bold text-lg text-emerald-300">Presença confirmada pelo servidor</h2>
            <p className="text-sm text-emerald-200">Registrada em {formatted}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <label htmlFor="presence-code" className="block text-center font-bold text-sm text-teal-400">Código do instrutor</label>
            <input id="presence-code" value={inputCode} onChange={e => setInputCode(e.target.value.toUpperCase().replace(/[^A-F0-9]/g, '').slice(0, 10))}
              autoComplete="off" spellCheck={false} maxLength={10} placeholder="XXXXXXXXXX"
              className={`w-full rounded-xl border-2 border-teal-500/40 px-4 py-4 text-center font-mono tracking-widest text-xl uppercase ${dark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}/>
            {error && <p role="alert" className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-red-300 text-sm flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0" />{error}</p>}
            <button type="submit" disabled={isSubmitting || !selectedCohortId || inputCode.length !== 10}
              className="w-full rounded-xl bg-teal-400 text-slate-950 font-bold px-5 py-3 flex items-center justify-center gap-2 disabled:opacity-40">
              <KeyRound className="w-4 h-4" /> {isSubmitting ? 'Validando…' : 'Registrar minha presença'}
            </button>
            <p className="text-xs text-center text-slate-400">O código vence em 30 minutos. Após cinco tentativas incorretas, novas tentativas ficam bloqueadas por 30 minutos.</p>
          </form>
        )}
        <div className="rounded-xl border border-white/10 p-4 flex items-start gap-3 text-sm text-slate-400">
          <ShieldCheck className="w-5 h-5 shrink-0 text-teal-400" />
          A confirmação da presença é apenas um dos requisitos de certificação. A aprovação em avaliações oficiais também é verificada separadamente.
        </div>
      </section>
    </main>
  );
};
