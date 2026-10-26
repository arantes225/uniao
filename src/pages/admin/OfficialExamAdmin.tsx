import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase/client';

type Course = { id: string; title: string };
type Assessment = { id: string; course_id: string; title: string; passing_score: number; published: boolean };
type Question = { id: string; assessment_id: string; stem: string; explanation: string; position: number };
type Option = { id: string; question_id: string; label: string; is_correct: boolean; position: number };
const emptyOptions = () => ['', '', '', '', ''];

export const OfficialExamAdmin: React.FC<{ courses: Course[] }> = ({ courses }) => {
  const [courseId, setCourseId] = useState('');
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [title, setTitle] = useState('');
  const [passingScore, setPassingScore] = useState(70);
  const [stem, setStem] = useState('');
  const [explanation, setExplanation] = useState('');
  const [alternatives, setAlternatives] = useState(emptyOptions());
  const [correct, setCorrect] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const chosen = assessments.find(item => item.id === selectedId);

  useEffect(() => {
    setCourseId(previous => courses.some(item => item.id === previous) ? previous : courses[0]?.id || '');
  }, [courses]);

  const loadAssessments = async (cid: string, desired?: string) => {
    if (!cid) { setAssessments([]);setSelectedId('');return; }
    const { data, error: loadError } = await supabase.from('assessments')
      .select('id,course_id,title,passing_score,published').eq('course_id',cid).order('title');
    if (loadError) { setError('Não foi possível consultar provas oficiais.'); return; }
    const list = (data || []) as Assessment[];
    setAssessments(list);
    setSelectedId(desired && list.some(x => x.id === desired) ? desired : list[0]?.id || '');
  };

  useEffect(() => { void loadAssessments(courseId); }, [courseId]);

  const loadQuestions = async (assessmentId: string) => {
    if (!assessmentId) { setQuestions([]);setOptions([]);return; }
    const {data: qs,error: questionError}=await supabase.from('assessment_questions')
      .select('id,assessment_id,stem,explanation,position').eq('assessment_id',assessmentId).order('position');
    if (questionError) {setError('Não foi possível consultar questões.');return;}
    const rows=(qs||[]) as Question[];
    setQuestions(rows);
    if(!rows.length){setOptions([]);return;}
    const {data: os,error: optionsError}=await supabase.from('question_options')
      .select('id,question_id,label,is_correct,position').in('question_id',rows.map(x=>x.id)).order('position');
    if(optionsError){setError('Não foi possível consultar alternativas.');return;}
    setOptions((os||[]) as Option[]);
  };
  useEffect(() => { void loadQuestions(selectedId); }, [selectedId]);

  const createAssessment = async () => {
    setError('');setNotice('');
    if (!courseId || title.trim().length<8 || !Number.isFinite(passingScore) || passingScore<0 || passingScore>100) {
      setError('Escolha o curso, informe um título de pelo menos 8 caracteres e uma nota mínima de 0 a 100%.');
      return;
    }
    setBusy(true);
    const {data,error: createError}=await supabase.from('assessments')
      .insert({course_id:courseId,title:title.trim(),passing_score:passingScore,published:false})
      .select('id').single();
    setBusy(false);
    if(createError||!data?.id){setError(createError?.message||'Falha ao criar prova.');return;}
    setTitle('');
    await loadAssessments(courseId,data.id);
    setNotice('Rascunho criado. Adicione pelo menos cinco questões revisadas antes de publicar.');
  };

  const addQuestion = async () => {
    setError('');setNotice('');
    if (!selectedId || chosen?.published) return;
    const clean = alternatives.map(x=>x.trim()).filter(Boolean);
    const filled = alternatives.map((x,i)=>({label:x.trim(),position:i,is_correct:i===correct})).filter(x=>x.label);
    if (stem.trim().length<15 || clean.length<4 || filled.length>5 || !alternatives[correct]?.trim()
        || filled.some(x=>x.label.length<2) || !explanation.trim()) {
      setError('Informe enunciado, explicação, pelo menos quatro alternativas completas e um gabarito.');
      return;
    }
    setBusy(true);
    const {data,error: questionError}=await supabase.from('assessment_questions')
      .insert({assessment_id:selectedId,stem:stem.trim(),explanation:explanation.trim(),position:questions.length+1})
      .select('id').single();
    if(questionError||!data?.id){setBusy(false);setError(questionError?.message||'Falha ao adicionar questão.');return;}
    const {error: optionError}=await supabase.from('question_options').insert(
      filled.map(x=>({...x,question_id:data.id}))
    );
    setBusy(false);
    if(optionError){setError('Questão salva sem todas as alternativas. Remova o rascunho e tente novamente.');await loadQuestions(selectedId);return;}
    setStem('');setExplanation('');setAlternatives(emptyOptions());setCorrect(0);
    setNotice('Questão salva no rascunho.');
    await loadQuestions(selectedId);
  };

  const deleteQuestion = async (id: string) => {
    if(!selectedId||chosen?.published || !window.confirm('Excluir esta questão e suas alternativas do rascunho?'))return;
    setBusy(true);setError('');
    const {error: optionError}=await supabase.from('question_options').delete().eq('question_id',id);
    const {error: questionError}=optionError?{error:optionError}:await supabase.from('assessment_questions').delete().eq('id',id);
    setBusy(false);
    if(questionError){setError(questionError.message);return;}
    await loadQuestions(selectedId);
  };

  const publish = async () => {
    setError('');setNotice('');
    if (!selectedId || chosen?.published) return;
    if (!window.confirm('Confirma revisão científica, editorial e do gabarito? A prova ficará disponível aos alunos e será bloqueada contra edições.')) return;
    setBusy(true);
    const {error: publishError}=await supabase.from('assessments').update({published:true}).eq('id',selectedId);
    setBusy(false);
    if(publishError){setError(publishError.message);return;}
    setNotice('Prova publicada. Alterações futuras exigem nova versão para preservar a integridade das notas.');
    await loadAssessments(courseId,selectedId);
  };

  return <section className="space-y-6">
    <div className="rounded-2xl bg-slate-900 border border-white/10 p-6 space-y-2">
      <h2 className="text-xl font-bold text-white">Provas oficiais e gabaritos</h2>
      <p className="text-sm text-slate-300">Somente avaliações revisadas são publicadas. Os gabaritos ficam protegidos no Supabase e as notas são corrigidas no servidor. Provas publicadas não podem ter o conteúdo alterado.</p>
      <label className="text-sm text-slate-300 block">Curso
        <select value={courseId} onChange={e=>setCourseId(e.target.value)}
          className="block w-full mt-2 bg-slate-950 border border-slate-700 rounded-xl text-white p-3">
          {!courses.length&&<option value="">Nenhum curso cadastrado</option>}
          {courses.map(item=><option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
      </label>
    </div>

    {error&&<p role="alert" className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-red-300 text-sm">{error}</p>}
    {notice&&<p role="status" className="rounded-xl bg-teal-500/10 border border-teal-500/30 p-4 text-teal-300 text-sm">{notice}</p>}

    <div className="rounded-2xl bg-slate-900 border border-white/10 p-6 space-y-4">
      <h3 className="text-white font-bold">Criar nova prova</h3>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Título da avaliação" maxLength={160}
        className="w-full bg-slate-950 border border-slate-700 rounded-xl text-white p-3"/>
      <label className="block text-slate-300 text-sm">Nota mínima (%)
        <input type="number" min={0} max={100} value={passingScore} onChange={e=>setPassingScore(Number(e.target.value))}
          className="block w-full mt-2 bg-slate-950 border border-slate-700 rounded-xl text-white p-3"/>
      </label>
      <button type="button" disabled={busy||!courseId} onClick={()=>void createAssessment()}
        className="rounded-xl bg-teal-400 text-slate-950 font-bold p-3 disabled:opacity-40">Criar rascunho</button>
    </div>

    <div className="rounded-2xl bg-slate-900 border border-white/10 p-6 space-y-4">
      <h3 className="text-white font-bold">Avaliações do curso</h3>
      <select value={selectedId} onChange={e=>setSelectedId(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl text-white p-3">
        {!assessments.length && <option value="">Sem avaliações</option>}
        {assessments.map(item=><option key={item.id} value={item.id}>{item.title} — {item.published?'Publicada':'Rascunho'}</option>)}
      </select>
      {chosen&&<>
        <p className="text-sm text-slate-300">{questions.length} questões · Nota mínima: {chosen.passing_score}% · Estado: <strong>{chosen.published?'Publicada (imutável)':'Rascunho'}</strong></p>
        {questions.map((q,index)=><article key={q.id} className="rounded-xl bg-slate-950 border border-white/10 p-4 space-y-2 text-sm text-slate-200">
          <h4 className="font-bold">{index+1}. {q.stem}</h4>
          {(options.filter(x=>x.question_id===q.id)).map(o=>
            <p key={o.id} className={o.is_correct?'text-emerald-300':'text-slate-400'}>{o.position+1}. {o.label} {o.is_correct?'(Gabarito)':''}</p>
          )}
          <p className="text-xs text-slate-400">{q.explanation}</p>
          {!chosen.published && <button type="button" disabled={busy} onClick={()=>void deleteQuestion(q.id)} className="text-red-300 underline text-xs">Excluir questão</button>}
        </article>)}
        {!chosen.published&&<div className="border-t border-slate-700 pt-5 space-y-3">
          <h4 className="text-white font-bold">Adicionar questão</h4>
          <textarea value={stem} onChange={e=>setStem(e.target.value)} rows={3} placeholder="Enunciado clínico completo" className="w-full rounded-xl bg-slate-950 border border-slate-700 p-3 text-white"/>
          {alternatives.map((answer,index)=><label key={index} className="flex items-start gap-3 text-sm text-slate-300">
            <input type="radio" name="official-correct" aria-label={`Alternativa correta ${index+1}`} checked={correct===index} onChange={()=>setCorrect(index)} className="mt-4 accent-teal-400"/>
            <input value={answer} onChange={e=>setAlternatives(old=>old.map((v,i)=>i===index?e.target.value:v))}
              placeholder={`Alternativa ${index+1}`} className="w-full rounded-xl bg-slate-950 border border-slate-700 p-3 text-white"/>
          </label>)}
          <textarea value={explanation} onChange={e=>setExplanation(e.target.value)} rows={2} placeholder="Justificativa científica e referência, para uso interno" className="w-full rounded-xl bg-slate-950 border border-slate-700 p-3 text-white"/>
          <div className="flex flex-wrap gap-3">
            <button type="button" disabled={busy} onClick={()=>void addQuestion()} className="rounded-xl bg-teal-400 text-slate-950 font-bold px-4 py-3 disabled:opacity-40">Adicionar ao rascunho</button>
            <button type="button" disabled={busy || questions.length<5} onClick={()=>void publish()} className="rounded-xl border border-amber-500 text-amber-300 font-bold px-4 py-3 disabled:opacity-40">Publicar avaliação revisada</button>
          </div>
          <p className="text-xs text-slate-400">São necessárias pelo menos cinco questões, quatro ou cinco alternativas em cada uma e exatamente um gabarito. O banco valida isso antes da publicação.</p>
        </div>}
      </>}
    </div>
  </section>;
};
