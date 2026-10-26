import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2,
  XCircle, ChevronRight, RotateCcw,
  Stethoscope, ClipboardList, SearchCheck, PlayCircle, MessageCircle,
  Maximize2, Volume2, Sparkles, HeartPulse
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { SimulationCase } from '../../data/simulator/types';
import { AnimatedPatient } from './AnimatedPatient';
import { BleedingScene } from './BleedingScene';
import { ContextWoundScene } from './ContextWoundScene';
import { ContextPatientScene } from './ContextPatientScene';
import { StopTheBleedScene } from './StopTheBleedScene';

type DecisionMode = 'anamnese' | 'exame-fisico' | 'agir';
type AuxiliaryOption = {
  id: string;
  text: string;
  correct: boolean;
  feedback: string;
};

const auxiliaryOptions: Record<Exclude<DecisionMode, 'agir'>, AuxiliaryOption[]> = {
  anamnese: [
    { id: 'anamnesis-event', text: 'Perguntar o que aconteceu, quando começou e se houve piora dos sintomas.', correct: true, feedback: 'Boa pergunta: mecanismo e evolução ajudam a priorizar a resposta.' },
    { id: 'anamnesis-history', text: 'Confirmar condições de saúde, medicamentos, alergias e plano individual de emergência.', correct: true, feedback: 'Essas informações orientam uma conduta segura e a passagem para a equipe.' },
    { id: 'anamnesis-dismiss', text: 'Assumir que é apenas um mal-estar e evitar perguntas para não deixar a pessoa nervosa.', correct: false, feedback: 'Ignorar a história pode esconder sinais de gravidade e atrasar o acionamento correto.' }
  ],
  'exame-fisico': [
    { id: 'exam-primary', text: 'Avaliar resposta, respiração e sinais imediatos de deterioração antes de continuar.', correct: true, feedback: 'A avaliação inicial deve identificar rapidamente ameaças à vida.' },
    { id: 'exam-reassess', text: 'Observar a evolução dos sinais e reavaliar depois de cada intervenção.', correct: true, feedback: 'Reavaliação contínua mostra se a medida funcionou ou se a pessoa piorou.' },
    { id: 'exam-force', text: 'Forçar movimentos, levantar a pessoa ou testar a região dolorosa repetidamente.', correct: false, feedback: 'Testes forçados podem agravar a condição e não substituem uma avaliação profissional.' }
  ]
};

export const ClinicalScenario: React.FC<{ scenario: SimulationCase; onBack: () => void }> = ({ scenario, onBack }) => {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const steps = scenario.steps;
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [decisionMode, setDecisionMode] = useState<DecisionMode>('agir');
  const [auxiliaryFeedback, setAuxiliaryFeedback] = useState<{ option: AuxiliaryOption; mode: Exclude<DecisionMode, 'agir'> } | null>(null);
  const [investigationHistory, setInvestigationHistory] = useState<string[]>([]);
  const [decisionHistory, setDecisionHistory] = useState<any[]>([]);
  const [simulationCompleted, setSimulationCompleted] = useState(false);

  const currentStep = steps[currentStepIdx];

  const handleSelectOption = (opt: any) => {
    setSelectedOptionId(opt.id);
  };

  const handleAuxiliaryOption = (option: AuxiliaryOption, mode: Exclude<DecisionMode, 'agir'>) => {
    setAuxiliaryFeedback({ option, mode });
    if (option.correct) setInvestigationHistory(history => [...history, option.text]);
  };

  const handleConfirmDecision = () => {
    if (!selectedOptionId) return;

    const chosenOption = currentStep.options.find(o => o.id === selectedOptionId);
    if (!chosenOption) return;

    const newHistory = [
      ...decisionHistory,
      {
        step: currentStep.phase,
        category: 'agir',
        chosen: chosenOption.text,
        type: chosenOption.type,
        feedback: chosenOption.feedback,
        score: chosenOption.score
      }
    ];

    setDecisionHistory(newHistory);
    setSelectedOptionId(null);

    if (currentStepIdx + 1 < steps.length) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      setSimulationCompleted(true);
    }
  };

  const totalScore = decisionHistory.reduce((acc, curr) => acc + curr.score, 0);
  const hasCriticalError = decisionHistory.some(d => d.type === 'critical_error');
  const isApproved = !hasCriticalError && totalScore >= 70;

  const handleRestart = () => {
    setCurrentStepIdx(0);
    setSelectedOptionId(null);
    setDecisionHistory([]);
    setDecisionMode('agir');
    setAuxiliaryFeedback(null);
    setInvestigationHistory([]);
    setSimulationCompleted(false);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans select-none overflow-x-hidden ${dark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>

      {/* 1. TOP BAR COMPACTA DO SIMULADOR (ESTILO LURIA OS / SIMULATOR VIEW) */}
      <header className={`${dark ? 'bg-slate-950/90 border-white/10' : 'bg-white/95 border-slate-200'} backdrop-blur-md border-b px-4 sm:px-6 h-14 flex items-center justify-between sticky top-0 z-50`}>
        <div className="flex items-center gap-3">
          <button
            type="button" onClick={onBack}
            className="p-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar aos casos</span>
          </button>
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 tracking-wider">
              Simulador Clínico
            </span>
            {scenario.patientKind === 'stop-the-bleed' && (
              <span className="text-[10px] font-black uppercase tracking-wider text-red-300 hidden sm:inline">
                Stop the Bleed
              </span>
            )}
            <span className="text-xs font-bold text-white hidden md:inline truncate max-w-md">
              {scenario.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Indicador de Etapas / Estilo Luria */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1 rounded-full border border-white/10 text-xs font-mono">
            <span className="text-slate-400">Etapa</span>
            <strong className="text-teal-400 font-bold">{currentStepIdx + 1}</strong>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">{steps.length}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Áudio da Cena"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Expandir Tela"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. ÁREA PRINCIPAL DO SIMULADOR (LAYOUT LURIA COM SUPORTE A IMAGEM DE FUNDO) */}
      <main className="flex-1 flex flex-col relative min-h-[calc(100vh-3.5rem)]">

        {/* Placeholder para a Imagem de Fundo Imersiva (Cenário 3D / Real) */}
        <div className={`absolute inset-0 z-0 pointer-events-none ${dark ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-b from-slate-50 via-white to-slate-100'}`}>
          {/* Grid tecnológico e luz de emergência sutil de fundo */}
          <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-600/10 blur-[140px] pointer-events-none" />
        </div>

        {!simulationCompleted ? (
          <div className="relative z-10 flex-1 flex flex-col max-w-6xl w-full mx-auto p-4 sm:p-6 justify-between gap-6">

            {scenario.patientKind === 'stop-the-bleed' && <StopTheBleedScene characterId={scenario.characterId} focus={currentStep.bleedingFocus} />}
            {scenario.patientKind !== 'stop-the-bleed' && <>
            {/* TOPO: PAINEL DE MONITORAMENTO CLÍNICO / TELEMETRIA DO PACIENTE */}
            <div className="rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-white/10 shadow-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <HeartPulse className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-black tracking-wider uppercase text-white">
                    Telemetria da Vítima • Condição Atual
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                    Emergência Nível 1
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-teal-400/15 bg-teal-950/20 px-3 py-2 text-xs leading-relaxed text-slate-200">
                <strong className="text-teal-300">{scenario.title}.</strong> Paciente {scenario.patientAgeRange ?? 'com faixa etária não informada'}, sexo {scenario.patientSex ?? 'não especificado'}. {scenario.description}
              </div>

              {/* Grid dos 4 Sinais Vitais em Cards HUD */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                <div className="bg-slate-950/70 p-3 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Consciência</span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-200 block truncate">
                    {currentStep.vitalSigns.consciousness}
                  </span>
                </div>
                <div className="bg-slate-950/70 p-3 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Respiração</span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-200 block truncate">
                    {currentStep.vitalSigns.breathing}
                  </span>
                </div>
                <div className="bg-slate-950/70 p-3 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Circulação / Pulso</span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-200 block truncate">
                    {currentStep.vitalSigns.circulation}
                  </span>
                </div>
                <div className={`p-3 rounded-xl border space-y-1 ${currentStep.vitalSigns.status ? 'border-amber-500/30 bg-amber-950/10' : 'border-red-500/30 bg-red-950/10'}`}>
                  <span className={`text-[10px] uppercase font-bold block ${currentStep.vitalSigns.status ? 'text-amber-400' : 'text-red-400'}`}>{currentStep.vitalSigns.status ? 'Condição atual' : 'Sangramento Ativo'}</span>
                  <span className={`text-xs sm:text-sm font-bold block truncate ${currentStep.vitalSigns.status ? 'text-amber-200' : 'text-red-300'}`}>
                    {currentStep.vitalSigns.status ?? currentStep.vitalSigns.bleeding}
                  </span>
                </div>
              </div>

              {/* Caixa Narrativa da Ocorrência */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-400">
                    {currentStep.phase}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                  {currentStep.scenarioText}
                </p>
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(360px,0.8fr)_minmax(0,1.2fr)] xl:items-start">
            {/* PAINEL DE DECISÃO: botões à esquerda e lista à direita */}
            <div className="grid grid-cols-[110px_minmax(0,1fr)] gap-x-3 gap-y-3 rounded-2xl border border-white/10 bg-slate-950/45 p-3">
              <div className="col-span-2 flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-teal-400" />
                  <span>Painel de decisão clínica:</span>
                </span>
                <span className="text-[11px] text-slate-500">
                  {decisionMode === 'agir' ? `${currentStep.options.length} ações disponíveis` : 'investigue antes de agir'}
                </span>
              </div>

              <div className="row-span-3 flex flex-col gap-2" role="tablist" aria-label="Etapas de decisão">
                {([
                  { id: 'anamnese' as const, label: 'Anamnese', hint: 'Perguntar', icon: MessageCircle },
                  { id: 'exame-fisico' as const, label: 'Exame físico', hint: 'Observar', icon: SearchCheck },
                  { id: 'agir' as const, label: 'Agir', hint: 'Executar', icon: PlayCircle }
                ]).map(tab => {
                  const Icon = tab.icon;
                  const active = decisionMode === tab.id;
                  return <button key={tab.id} type="button" role="tab" aria-selected={active} onClick={() => { setDecisionMode(tab.id); setAuxiliaryFeedback(null); setSelectedOptionId(null); }} className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl border px-1 py-2 text-center transition-all ${active ? 'border-teal-400 bg-teal-500/15 text-teal-200 shadow-[0_0_18px_rgba(20,184,166,0.15)]' : 'border-transparent text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-slate-200'}`}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span className="text-[11px] font-black uppercase tracking-wide">{tab.label}</span>
                    <span className="text-[10px] opacity-70">{tab.hint}</span>
                  </button>;
                })}
              </div>

              {decisionMode === 'agir' ? <div className="grid grid-cols-1 gap-2.5" role="tabpanel" aria-label="Ações disponíveis">
                {currentStep.options.map((opt, oIdx) => {
                  const isSelected = selectedOptionId === opt.id;
                  return <button key={opt.id} type="button" onClick={() => handleSelectOption(opt)} className={`w-full text-left p-4 rounded-xl border transition-all text-xs sm:text-sm flex items-center gap-3.5 ${isSelected ? 'bg-teal-950/80 border-teal-400 text-white shadow-[0_0_20px_rgba(20,184,166,0.25)] ring-1 ring-teal-400' : 'bg-slate-900/80 backdrop-blur-md border-white/10 text-slate-300 hover:bg-slate-800/90 hover:border-white/20'}`}>
                    <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 font-bold text-xs ${isSelected ? 'border-teal-400 bg-teal-500 text-slate-950' : 'border-white/20 bg-slate-800 text-slate-400'}`}>{String.fromCharCode(65 + oIdx)}</div>
                    <span className="leading-relaxed flex-1">{opt.text}</span>
                  </button>;
                })}
              </div> : <div className="space-y-2.5" role="tabpanel" aria-label={decisionMode === 'anamnese' ? 'Perguntas de anamnese' : 'Exame físico'}>
                {auxiliaryOptions[decisionMode].map((option, index) => <button key={option.id} type="button" onClick={() => handleAuxiliaryOption(option, decisionMode)} className="flex w-full items-start gap-3 rounded-xl border border-white/10 bg-slate-900/80 p-4 text-left text-xs text-slate-300 transition-all hover:border-teal-400/60 hover:bg-slate-800/90 sm:text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-slate-800 text-xs font-bold text-slate-400">{index + 1}</span>
                  <span className="leading-relaxed">{option.text}</span>
                </button>)}
                {auxiliaryFeedback && <div className={`rounded-xl border p-3 text-xs leading-relaxed ${auxiliaryFeedback.option.correct ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-100' : 'border-red-500/40 bg-red-950/30 text-red-100'}`} role="status">
                  <strong>{auxiliaryFeedback.option.correct ? 'Achado útil registrado.' : 'Reveja esta abordagem.'}</strong> {auxiliaryFeedback.option.feedback}
                </div>}
              </div>}

              {investigationHistory.length > 0 && <div className="col-start-2 flex flex-wrap items-center gap-2 rounded-xl border border-teal-500/20 bg-teal-950/20 p-3 text-[11px] text-teal-100"><ClipboardList className="h-4 w-4 shrink-0 text-teal-300" aria-hidden="true" /><span className="font-bold uppercase tracking-wide text-teal-300">Achados registrados:</span><span>{investigationHistory.length} investigação(ões) útil(eis)</span></div>}

              {/* Barra de Ação Inferior */}
              <div className="col-start-2 pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  {decisionMode === 'agir' ? 'As ações corretas e erradas ficam misturadas: leia o cenário antes de executar.' : 'Use a investigação para organizar o raciocínio; a etapa avança quando uma ação for executada.'}
                </span>
                {decisionMode === 'agir' && <button type="button" disabled={!selectedOptionId} onClick={handleConfirmDecision} className="w-full sm:w-auto ml-auto px-8 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-teal-300 hover:brightness-110 disabled:opacity-40 transition-all text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2"><span>Executar ação</span><ChevronRight className="w-4 h-4" /></button>}
              </div>
            </div>

            {scenario.patientKind === 'escola' || scenario.patientKind === 'academia'
              ? currentStep.bleedingFocus
                ? <ContextWoundScene characterId={scenario.characterId} patientKind={scenario.patientKind} respiratoryRate={Number(currentStep.vitalSigns.breathing.match(/\d+/)?.[0] || 0)} focus={currentStep.bleedingFocus} />
                : <ContextPatientScene characterId={scenario.characterId} patientKind={scenario.patientKind} respiratoryRate={Number(currentStep.vitalSigns.breathing.match(/\d+/)?.[0] || 0)} />
              : currentStep.bleedingFocus
                ? <BleedingScene characterId={scenario.characterId} respiratoryRate={Number(currentStep.vitalSigns.breathing.match(/\d+/)?.[0] || 0)} focus={currentStep.bleedingFocus} />
                : <AnimatedPatient characterId={scenario.characterId} respiratoryRate={Number(currentStep.vitalSigns.breathing.match(/\d+/)?.[0] || 0)} />}
            </div>
            </>}

          </div>
        ) : (
          /* DEBRIEFING CLÍNICO FINAL (ESTILO LURIA RESULT HUD) */
          <div className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8">
            <div className="max-w-3xl w-full rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-white/10 p-6 sm:p-10 space-y-6 shadow-2xl">

              <div className="text-center space-y-3 border-b border-white/10 pb-6">
                {isApproved ? (
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-3xl bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center mx-auto shadow-lg shadow-red-500/20">
                    <XCircle className="w-9 h-9" />
                  </div>
                )}

                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 tracking-wider">
                  Debriefing Clínico da Simulação
                </span>

                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {isApproved ? 'Cenário Concluído com Êxito' : 'Cenário Clínico Comprometido'}
                </h2>

                <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                  {isApproved
                    ? 'Excelente tomada de decisão! Você garantiu a segurança da cena, conteve a exsanguinação e preveniu a tríade letal do trauma.'
                    : 'A simulação registrou condutas de risco que causariam desfecho fatal na vítima ou perigo à equipe. É obrigatório refazer para liberação presencial.'}
                </p>

                <div className="inline-flex items-center gap-3 pt-2">
                  <span className="text-xs font-bold text-slate-400">Pontuação Obtida:</span>
                  <span className={`text-xl font-black font-mono ${isApproved ? 'text-emerald-400' : 'text-red-400'}`}>
                    {totalScore} pts
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    isApproved ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-red-950 text-red-300 border border-red-500/40'
                  }`}>
                    {isApproved ? 'APROVADO PARA ETAPA PRESENCIAL' : 'REQUER REVISÃO'}
                  </span>
                </div>
              </div>

              {/* Histórico das Decisões do Aluno */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Avaliação Detalhada das Condutas:
                </h3>

                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {decisionHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                        item.type === 'essential'
                          ? 'bg-emerald-950/20 border-emerald-500/40'
                          : item.type === 'critical_error'
                          ? 'bg-red-950/30 border-red-500/50'
                          : 'bg-slate-950 border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-teal-400 uppercase text-[10px] tracking-wider">{item.step}</span>
                        <span className={`font-mono text-xs ${item.score > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {item.score > 0 ? `+${item.score}` : item.score} pts
                        </span>
                      </div>

                      <div className="text-slate-200">
                        <strong>Conduta:</strong> {item.chosen}
                      </div>

                      <div className="text-slate-400 leading-relaxed text-[11px] pt-1 border-t border-white/5">
                        <strong>Parecer do Instrutor:</strong> {item.feedback}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botões Finais */}
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Refazer Simulação</span>
                </button>

                {isApproved ? (
                  <Link
                    to="/aluno/dashboard"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-teal-300 hover:brightness-110 text-xs shadow transition-all"
                  >
                    <span>Voltar ao Dashboard</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <div className="text-xs text-red-400 font-semibold text-center sm:text-right">
                    Refaça o simulador para desbloquear a liberação presencial.
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </main>

    </div>
  );
};


