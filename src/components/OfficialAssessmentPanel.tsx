import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase/client';

type Assessment = { id: string; title: string; passing_score: number };
type Option = { id: string; label: string; position: number };
type Question = { id: string; stem: string; position: number; options: Option[] };
type Exam = { id: string; title: string; passingScore: number; questions: Question[] };
type Attempt = { id: string; status: string; score: number | null; started_at: string };

export const OfficialAssessmentPanel: React.FC<{ cohortId: string }> = ({ cohortId }) => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [history, setHistory] = useState<Attempt[]>([]);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);
  const [now, setNow] = useState(Date.now());
  const selected = assessments.find(a => a.id === selectedId);
  const secondsLeft = attempt ? Math.max(0, 2700 - Math.floor((now - new Date(attempt.started_at).getTime()) / 1000)) : 0;
  const timeLabel = Math.floor(secondsLeft/60).toString().padStart(2,'0')+':'+(secondsLeft%60).toString().padStart(2,'0');

  useEffect(() => {
    let active = true;
    setAssessments([]);
    setSelectedId('');
    setChecking(true);
    setError('');
    if (!cohortId) { setChecking(false); return; }
    (async () => {
      const { data: cohort, error: cohortError } = await supabase.from('cohorts')
        .select('course_id').eq('id',cohortId).maybeSingle();
      if (!active) return;
      if (cohortError || !cohort?.course_id) { setError('Não foi possível consultar o curso desta turma.'); setChecking(false); return; }
      const { data, error: examError } = await supabase.from('assessments')
        .select('id,title,passing_score').eq('course_id',cohort.course_id).eq('published',true);
      if (!active) return;
      if (examError) setError('Não foi possível carregar as avaliações oficiais.');
      else {
        const list=(data||[]) as Assessment[];
        setAssessments(list);
        setSelectedId(list[0]?.id||'');
      }
      setChecking(false);
    })();
    return () => { active=false; };
  }, [cohortId]);

  useEffect(() => {
    let active = true;
    setAttempt(null);
    setExam(null);
    setAnswers({});
    setScore(null);
    setHistory([]);
    if (!selectedId) return;
    supabase.from('assessment_attempts').select('id,status,score,started_at')
      .eq('assessment_id',selectedId).order('started_at',{ascending:false})
      .then(async ({data, error: queryError}) => {
        if (!active) return;
        if (queryError) { setError('Não foi possível consultar suas tentativas oficiais.'); return; }
        const attempts=(data||[]) as Attempt[];
        setHistory(attempts);
        const resume=attempts.find(a => a.status==='in_progress' && Date.now()-new Date(a.started_at).getTime() < 45*60*1000);
        if (!resume) return;
        setAttempt(resume);
        const {data:examData,error:readError}=await supabase.rpc('get_official_assessment',{p_assessment_id:selectedId});
        if (!active) return;
        if (readError) setError('A tentativa está ativa, mas não foi possível carregar as questões.');
        else setExam(examData as Exam);
      });
    return () => { active=false; };
  }, [selectedId]);

  useEffect(() => {
    if (!attempt || score !== null) return;
    const interval=setInterval(()=>setNow(Date.now()),1000);
    return ()=>clearInterval(interval);
  },[attempt,score]);

  const start = async () => {
    if (!selectedId) return;
    setBusy(true);
    setError('');
    const {data: id, error: startError}=await supabase.rpc('start_official_assessment',{p_assessment_id:selectedId});
    if (startError || !id) { setError(startError?.message || 'Não foi possível iniciar a prova.'); setBusy(false); return; }
    const {data:attemptRows}=await supabase.from('assessment_attempts')
      .select('id,status,score,started_at').eq('id',id).maybeSingle();
    const {data:examData,error:readError}=await supabase.rpc('get_official_assessment',{p_assessment_id:selectedId});
    setBusy(false);
    if (readError || !attemptRows || !examData) {
      setError('A tentativa foi iniciada, mas o conteúdo não pôde ser carregado. Reabra a página para retomar.');
      return;
    }
    setAttempt(attemptRows as Attempt);
    setExam(examData as Exam);
    setAnswers({});
    setScore(null);
    setHistory(old=>[attemptRows as Attempt,...old]);
    setNow(Date.now());
  };

  const submit = async () => {
    if (!attempt || !selectedId || busy) return;
    if (secondsLeft > 0 && !window.confirm('Finalizar a prova oficial? Esta tentativa será registrada permanentemente.')) return;
    setBusy(true);
    setError('');
    const {data, error:submitError}=await supabase.rpc('submit_official_assessment',{
      p_attempt_id:attempt.id, p_answers:answers,
    });
    setBusy(false);
    if (submitError) { setError(submitError.message || 'Não foi possível registrar a prova.'); return; }
    setScore(Number(data));
    setHistory(old=>old.map(row=>row.id===attempt.id?{...row,score:Number(data),status:'submitted'}:row));
    setAttempt(null);
    setExam(null);
  };

  return <section className="rounded-3xl border border-teal-500/30 bg-slate-900 p-5 sm:p-7 text-white space-y-5">
    <header className="space-y-2">
      <span className="text-xs uppercase tracking-widest text-teal-300 font-bold">Avaliação com nota oficial no servidor</span>
      <h2 className="text-xl sm:text-2xl font-bold">Prova oficial da turma</h2>
      <p className="text-xs text-slate-400">A correção e as tentativas são registradas no Supabase, nunca calculadas exclusivamente no navegador. Máximo de três tentativas de 45 minutos por avaliação.</p>
    </header>
    {checking && <p className="text-sm text-slate-400">Consultando avaliações da sua turma…</p>}
    {error && <p role="alert" className="border border-red-500/30 bg-red-500/10 rounded-xl p-3 text-sm text-red-300">{error}</p>}
    {!checking && !assessments.length && !error && <p className="rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 p-4 text-sm">Ainda não existe uma prova oficial publicada para esta turma. O simulado de treinamento abaixo não produz certificado.</p>}
    {assessments.length>0 && <>
      <label className="block text-sm font-bold">Avaliação disponível
        <select disabled={!!attempt||busy} value={selectedId} onChange={e=>setSelectedId(e.target.value)}
          className="block w-full mt-2 rounded-xl border border-slate-600 bg-slate-950 p-3 text-white disabled:opacity-50">
          {assessments.map(a=><option key={a.id} value={a.id}>{a.title}</option>)}
        </select>
      </label>
      {!attempt && score === null && <div className="space-y-3">
        <p className="text-xs text-slate-300">Tentativas utilizadas: {history.length}/3 · Aprovação: {selected?.passing_score ?? 70}%</p>
        <button type="button" onClick={()=>void start()} disabled={busy || history.length>=3 || !selectedId}
          className="rounded-xl bg-teal-400 text-slate-950 font-bold px-5 py-3 disabled:opacity-40">
          {busy?'Iniciando…':'Iniciar prova oficial'}
        </button>
      </div>}
      {attempt && exam && <div className="space-y-5">
        <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-950 p-4 text-sm">
          <strong>{exam.title}</strong><span className="font-mono text-teal-300">Tempo: {timeLabel}</span>
        </div>
        {exam.questions.map((question,index)=><fieldset key={question.id} className="border border-white/10 rounded-xl p-4 space-y-3">
          <legend className="font-semibold text-sm px-2">Questão {index+1}</legend>
          <p className="text-sm text-slate-200">{question.stem}</p>
          {question.options.map(option=><label key={option.id} className="flex items-start gap-3 rounded-lg bg-slate-950/70 p-3 text-sm cursor-pointer">
            <input type="radio" name={question.id} checked={answers[question.id]===option.id}
              onChange={()=>setAnswers(old=>({...old,[question.id]:option.id}))} className="mt-1 accent-teal-400" />
            <span>{option.label}</span>
          </label>)}
        </fieldset>)}
        <button type="button" disabled={busy} onClick={()=>void submit()} className="rounded-xl bg-teal-400 text-slate-950 font-bold px-5 py-3 disabled:opacity-50">
          {busy?'Registrando…':secondsLeft===0?'Encerrar tentativa expirada':'Finalizar e enviar respostas'}
        </button>
      </div>}
      {score !== null && <div className="rounded-xl bg-teal-500/10 border border-teal-400/30 p-5 space-y-3">
        <strong className="text-teal-300 text-lg">Resultado oficial registrado: {score}%</strong>
        <p className="text-sm text-slate-200">{score >= (selected?.passing_score ?? 70)?'Nota mínima alcançada. A emissão do certificado também depende dos demais requisitos.':'Nota abaixo da mínima exigida.'}</p>
        <button onClick={()=>{setScore(null);setAnswers({});}} className="text-sm underline text-teal-300">Voltar às avaliações</button>
      </div>}
    </>}
  </section>;
};
