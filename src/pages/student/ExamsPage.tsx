import React, { useState } from 'react';
import { HelpCircle, Clock, Award, CheckCircle2, ChevronRight, AlertTriangle, RotateCcw, XCircle, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Question {
  id: number;
  stem: string;
  options: string[];
  correct: number;
  explanation: string;
}

const mockQuestions: Question[] = [
  {
    id: 1,
    stem: 'Durante a avaliação primária no protocolo XABCDE no trauma grave, qual é a prioridade zero que antecede o manejo das vias aéreas?',
    options: [
      'Abertura e estabilização de via aérea com controle cervical',
      'Controle imediato de hemorragias exsanguinantes externas (torniquete/curativo compressivo)',
      'Avaliação da ventilação e expansibilidade torácica bilateral',
      'Aferição detalhada dos sinais vitais e gasometria'
    ],
    correct: 1,
    explanation: 'A etapa X prioriza o controle estrito de hemorragias exsanguinantes graves, pois o choque hipovolêmico por sangramento maciço pode levar a óbito em minutos.'
  },
  {
    id: 2,
    stem: 'Qual a conduta inicial mandatória diante de uma cena com cabos de alta tensão caídos e vítima dentro do veículo?',
    options: [
      'Aproximar-se rapidamente para verificar pulso carotídeo da vítima',
      'Remover a vítima imediatamente puxando-a pelas pernas',
      'Manter isolamento do perímetro, acionar a concessionária de energia e orientar a vítima a permanecer no veículo se não houver fogo',
      'Jogar água no veículo para evitar combustão'
    ],
    correct: 2,
    explanation: 'A segurança da equipe de socorristas é a regra primária no APH. Jamais ingresse em área energizada até que a concessionária declare o corte de energia.'
  },
  {
    id: 3,
    stem: 'Em um paciente inconsciente com respiração agônica (gasping) e sem pulso carotídeo detectável em até 10 segundos, qual a ação imediata?',
    options: [
      'Iniciar compressões torácicas contínuas de alta qualidade e solicitar o DEA imediatamente',
      'Administrar duas ventilações de resgate antes de qualquer compressão',
      'Aguardar o retorno espontâneo da respiração monitorando o oximetro',
      'Aplicar manobra de Heimlich supondo engasgo mecânico'
    ],
    correct: 0,
    explanation: 'Gasping em paciente sem pulso é sinal inequívoco de parada cardiorrespiratória (PCR). A RCP deve ser iniciada prontamente com compressões torácicas.'
  },
  {
    id: 4,
    stem: 'Qual a profundidade e frequência recomendadas para compressões torácicas em adultos segundo as diretrizes de ressuscitação?',
    options: [
      'Profundidade de 2 a 3 cm, frequência de 60 a 80 compressões/minuto',
      'Profundidade de pelo menos 5 cm (sem exceder 6 cm) e frequência de 100 a 120 compressões/minuto',
      'Profundidade de 7 a 9 cm com frequência de 140 compressões/minuto',
      'Qualquer profundidade desde que contínua e sem interrupções'
    ],
    correct: 1,
    explanation: 'A profundidade ideal em adultos é entre 5 e 6 cm e frequência entre 100 e 120 compressões por minuto, permitindo o retorno completo do tórax.'
  },
  {
    id: 5,
    stem: 'Ao aplicar um torniquete tático para contenção de hemorragia grave de membro inferior, qual é o posicionamento correto quando o local exato da lesão não puder ser visualizado prontamente?',
    options: [
      'Diretamente sobre a articulação do joelho',
      'De 5 a 7 cm abaixo da lesão',
      'Alto e apertado (high and tight) na raiz da coxa, proximalmente',
      'No tornozelo, independentemente de onde for o ferimento'
    ],
    correct: 2,
    explanation: 'Em situações de sangramento catastrófico onde o ponto exato da lesão é incerto, o torniquete deve ser colocado alto e apertado na raiz do membro até a interrupção do sangramento.'
  },
  {
    id: 6,
    stem: 'Na avaliação da circulação (etapa C), quais parâmetros clínicos auxiliam na detecção precoce do choque no trauma?',
    options: [
      'Apenas a pressão arterial sistólica',
      'Tempo de enchimento capilar (> 2s), pulso periférico filiforme/taquicardia, palidez cutânea e sudorese fria',
      'Cor das unhas e tamanho das pupilas apenas',
      'Temperatura axilar elevada e bradicardia'
    ],
    correct: 1,
    explanation: 'A hipotensão é um sinal tardio de choque. Taquicardia, perfusão periférica retardada, extremidades frias e sudorese alertam para hipovolemia antes da queda pressórica.'
  },
  {
    id: 7,
    stem: 'Qual a conduta para imobilização provisória de fratura fechada de fêmur no pré-hospitalar?',
    options: [
      'Alinhamento anatômico com tração suave se tolerado e imobilização abrangendo a articulação acima (quadril) e abaixo (joelho)',
      'Flexão forçada do joelho em 90 graus',
      'Nenhuma imobilização para permitir movimentação livre',
      'Compressão com torniquete no local da fratura'
    ],
    correct: 0,
    explanation: 'A imobilização de ossos longos deve imobilizar obrigatoriamente a articulação proximal e a articulação distal ao foco da fratura.'
  },
  {
    id: 8,
    stem: 'Qual a conduta correta durante a queima de primeiro e segundo grau em ambiente pré-hospitalar?',
    options: [
      'Aplicar manteiga, pomadas caseiras ou pasta de dente sobre a lesão',
      'Romper imediatamente todas as flictenas (bolhas)',
      'Resfriar a área com água corrente em temperatura ambiente (não gelada) por 10-20 min e cobrir com plástico filme estéril ou gaze limpa',
      'Aplicar gelo diretamente sobre a pele por 30 minutos contínuos'
    ],
    correct: 2,
    explanation: 'O resfriamento deve ser realizado com água corrente limpa em temperatura ambiente. Gelo e remédios caseiros agravam a lesão tecidual por vasoconstrição e hipotermia.'
  },
  {
    id: 9,
    stem: 'Na Escala de Coma de Glasgow atualizada com resposta pupilar (Glasgow-P), qual pontuação indica comprometimento neurológico grave que frequentemente exige via aérea definitiva?',
    options: [
      'Pontuação menor ou igual a 8 (≤ 8)',
      'Pontuação igual a 15',
      'Pontuação entre 13 e 14',
      'Pontuação acima de 12'
    ],
    correct: 0,
    explanation: 'Um escore de Glasgow menor ou igual a 8 indica incapacidade de manter proteção de vias aéreas e rebaixamento profundo do nível de consciência.'
  },
  {
    id: 10,
    stem: 'Após a reversão de uma PCR em campo com retorno da circulação espontânea (RCE), qual cuidado pós-PCR imediato é mandatório na ambulância?',
    options: [
      'Interromper a monitorização e desligar o oxigênio',
      'Manter monitorização eletrocardiográfica contínua, oxigenação adequada (SatO2 92-98%), controle da PA e transporte rápido para hospital de referência',
      'Permitir que o paciente levante imediatamente',
      'Administrar sedação em dose máxima sem monitorização de vias aéreas'
    ],
    correct: 1,
    explanation: 'Os cuidados pós-PCR visam prevenir a recorrência da parada, otimizar a hemodinâmica, oxigenação, ventilação e assegurar o encaminhamento imediato para UTI/hemodinâmica.'
  }
];

export const ExamsPage: React.FC = () => {
  const { theme } = useTheme();

  // Estado da Prova Única Oficial (com regra de 3 chances e mínimo 70%)
  const [attemptsUsed, setAttemptsUsed] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [history, setHistory] = useState<Array<{ attempt: number; score: number; passed: boolean; date: string }>>([]);
  const [isExamRunning, setIsExamRunning] = useState<boolean>(false);
  const [answers, setAnswers] = useState<{ [qId: number]: number }>({});
  const [examFinished, setExamFinished] = useState<boolean>(false);
  const [lastScore, setLastScore] = useState<number>(0);

  const maxAttempts = 3;
  const minPassingScore = 70; // 70% de acertos para ser aprovado
  const isApproved = bestScore !== null && bestScore >= minPassingScore;
  const attemptsRemaining = Math.max(0, maxAttempts - attemptsUsed);
  const canAttempt = !isApproved && attemptsRemaining > 0;

  const handleStartExam = () => {
    if (!canAttempt) return;
    setAnswers({});
    setExamFinished(false);
    setIsExamRunning(true);
  };

  const handleSelectOption = (qId: number, oIdx: number) => {
    if (examFinished) return;
    setAnswers((prev) => ({ ...prev, [qId]: oIdx }));
  };

  const handleSubmitExam = () => {
    let correctCount = 0;
    mockQuestions.forEach((q) => {
      if (answers[q.id] === q.correct) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / mockQuestions.length) * 100);
    const passed = scorePercentage >= minPassingScore;
    const newAttemptNumber = attemptsUsed + 1;

    setLastScore(scorePercentage);
    setAttemptsUsed(newAttemptNumber);
    setBestScore((prev) => (prev === null ? scorePercentage : Math.max(prev, scorePercentage)));
    setHistory((prev) => [
      ...prev,
      {
        attempt: newAttemptNumber,
        score: scorePercentage,
        passed,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setExamFinished(true);
  };

  const handleExitExamView = () => {
    setIsExamRunning(false);
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto w-full transition-colors">
      {/* Cabeçalho Oficial */}
      <div className="space-y-1">
        <span className={`text-xs font-bold uppercase tracking-wider ${
          theme === 'dark' ? 'text-uniao-400' : 'text-teal-700'
        }`}>
          Avaliação Teórica Oficial
        </span>
        <h1 className={`text-2xl sm:text-3xl font-black ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          Prova
        </h1>
        <p className={`text-xs sm:text-sm ${
          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Avaliação formal de conhecimentos pré-hospitalares. Você terá <strong>3 chances</strong> para acertar pelo menos <strong>70% da prova</strong> para ser aprovado e liberar a etapa presencial.
        </p>
      </div>

      {/* TELA DE REALIZAÇÃO DA PROVA (QUANDO EM EXECUÇÃO) */}
      {isExamRunning ? (
        <div className="space-y-6">
          {/* Barra Superior da Prova em Andamento */}
          <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-16 z-20 backdrop-blur-md shadow-lg ${
            theme === 'dark'
              ? 'bg-slate-900/95 border-slate-700 text-white'
              : 'bg-white/95 border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExitExamView}
                className={`p-2 rounded-xl border transition-colors ${
                  theme === 'dark'
                    ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                    : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
                title="Voltar ao Painel da Prova"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-base font-bold">Prova Geral de Certificação Pré-Hospitalar</h2>
                <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Chance {examFinished ? attemptsUsed : attemptsUsed + 1} de {maxAttempts} • Meta de aprovação: {minPassingScore}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold">
              <span className={`px-3 py-1.5 rounded-xl border ${
                theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}>
                Respondidas: {Object.keys(answers).length} de {mockQuestions.length}
              </span>

              {!examFinished ? (
                <button
                  onClick={handleSubmitExam}
                  disabled={Object.keys(answers).length < mockQuestions.length}
                  className="px-6 py-2.5 rounded-xl bg-uniao-600 hover:bg-uniao-500 disabled:opacity-40 text-white shadow-md transition-all font-bold"
                >
                  Finalizar e Corrigir Prova
                </button>
              ) : (
                <button
                  onClick={handleExitExamView}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white shadow-sm transition-all"
                >
                  Concluir Revisão
                </button>
              )}
            </div>
          </div>

          {/* Banner de Resultado se Prova Finalizada */}
          {examFinished && (
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 transition-all ${
              lastScore >= minPassingScore
                ? theme === 'dark' ? 'bg-emerald-950/40 border-emerald-500/50 text-white' : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : theme === 'dark' ? 'bg-red-950/40 border-red-500/50 text-white' : 'bg-red-50 border-red-300 text-red-950'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  lastScore >= minPassingScore
                    ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                    : 'bg-red-500/20 text-red-500 border border-red-500/30'
                }`}>
                  {lastScore >= minPassingScore ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                </div>
                <div>
                  <h3 className="text-xl font-black">
                    {lastScore >= minPassingScore ? 'Parabéns! Você foi APROVADO na Prova!' : 'Nota Insuficiente nesta Tentativa'}
                  </h3>
                  <p className="text-xs sm:text-sm opacity-90 mt-1">
                    Aproveitamento: <strong>{lastScore}%</strong> ({Math.round((lastScore / 100) * mockQuestions.length)} de {mockQuestions.length} acertos) • Nota mínima exigida: {minPassingScore}%
                  </p>
                  <p className="text-xs mt-1 font-semibold">
                    {lastScore >= minPassingScore 
                      ? 'Critério pedagógico atingido com sucesso. Sua presença no treinamento presencial está liberada.' 
                      : attemptsRemaining > 0 
                      ? `Você ainda tem ${attemptsRemaining} ${attemptsRemaining === 1 ? 'chance restante' : 'chances restantes'} para atingir 70%.` 
                      : 'Você esgotou as 3 chances desta prova. Procure a coordenação pedagógica da União para liberação de novo ciclo.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {canAttempt && (
                  <button
                    onClick={handleStartExam}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs shadow-md inline-flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Tentar Novamente ({attemptsRemaining} restantes)</span>
                  </button>
                )}
                <button
                  onClick={handleExitExamView}
                  className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs border ${
                    theme === 'dark' ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  Voltar ao Painel
                </button>
              </div>
            </div>
          )}

          {/* Lista de Questões da Prova */}
          <div className="space-y-6">
            {mockQuestions.map((q, idx) => {
              const selectedOpt = answers[q.id];
              const isCorrect = selectedOpt === q.correct;

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl p-6 border transition-all ${
                    examFinished
                      ? isCorrect
                        ? theme === 'dark' ? 'bg-slate-800/80 border-emerald-500/50' : 'bg-emerald-50/70 border-emerald-300'
                        : theme === 'dark' ? 'bg-slate-800/80 border-red-500/50' : 'bg-red-50/70 border-red-300'
                      : theme === 'dark'
                      ? 'bg-slate-800/70 border-slate-700/80'
                      : 'bg-white border-slate-200/90 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                      theme === 'dark'
                        ? 'bg-uniao-500/20 text-uniao-400 border border-uniao-500/30'
                        : 'bg-teal-50 text-teal-700 border border-teal-200'
                    }`}>
                      {idx + 1}
                    </span>
                    <h3 className={`text-sm sm:text-base font-semibold leading-snug ${
                      theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
                    }`}>
                      {q.stem}
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    {q.options.map((opt, oIdx) => {
                      const isChosen = selectedOpt === oIdx;
                      let optionStyle = theme === 'dark'
                        ? 'bg-slate-900/60 border-slate-700/70 text-slate-300 hover:bg-slate-700/60'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';

                      if (examFinished) {
                        if (oIdx === q.correct) {
                          optionStyle = theme === 'dark'
                            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold'
                            : 'bg-emerald-100 border-emerald-500 text-emerald-900 font-semibold';
                        } else if (isChosen && !isCorrect) {
                          optionStyle = theme === 'dark'
                            ? 'bg-red-950/80 border-red-500 text-red-200'
                            : 'bg-red-100 border-red-500 text-red-900 font-semibold';
                        } else {
                          optionStyle = theme === 'dark'
                            ? 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60'
                            : 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-50';
                        }
                      } else if (isChosen) {
                        optionStyle = theme === 'dark'
                          ? 'bg-uniao-950/90 border-uniao-500 text-uniao-200 font-semibold shadow-sm'
                          : 'bg-teal-50 border-teal-600 text-teal-900 font-semibold shadow-xs';
                      }

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          disabled={examFinished}
                          onClick={() => handleSelectOption(q.id, oIdx)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between transition-all ${optionStyle}`}
                        >
                          <span>{opt}</span>
                          {examFinished && oIdx === q.correct && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                          )}
                          {examFinished && isChosen && !isCorrect && (
                            <XCircle className="w-4 h-4 text-red-500 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {examFinished && (
                    <div className={`mt-4 pt-4 border-t text-xs space-y-1 ${
                      theme === 'dark' ? 'border-slate-700/60' : 'border-slate-200'
                    }`}>
                      <span className={`font-bold uppercase tracking-wider block ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Comentário Pedagógico da Banca:
                      </span>
                      <p className={`leading-relaxed ${
                        theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* PAINEL INICIAL DA PROVA */
        <div className="space-y-6">
          {/* Card Principal de Status e Regras da Prova */}
          <div className={`rounded-3xl border p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl transition-all ${
            isApproved
              ? theme === 'dark' ? 'bg-slate-900 border-emerald-500/40' : 'bg-white border-emerald-300 shadow-emerald-50'
              : attemptsRemaining === 0
              ? theme === 'dark' ? 'bg-slate-900 border-red-500/40' : 'bg-white border-red-300 shadow-red-50'
              : theme === 'dark' ? 'bg-slate-900 border-uniao-500/40' : 'bg-white border-slate-200/90 shadow-slate-100'
          }`}>
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                {isApproved ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Aprovado com {bestScore}%</span>
                  </span>
                ) : attemptsRemaining === 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30">
                    <AlertTriangle className="w-4 h-4" />
                    <span>3 Tentativas Esgotadas (Reprovado)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-uniao-500/10 text-uniao-700 dark:text-uniao-300 border border-uniao-500/30">
                    <span>Disponível para Realização</span>
                  </span>
                )}

                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  attemptsRemaining > 1
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                    : attemptsRemaining === 1
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                    : 'bg-slate-500/10 text-slate-500 border-slate-500/30'
                }`}>
                  Chances: {attemptsUsed} de {maxAttempts} utilizadas ({attemptsRemaining} restantes)
                </span>
              </div>

              <div>
                <h2 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Prova Teórica Geral de Certificação Pré-Hospitalar
                </h2>
                <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Contém 10 questões de casos clínicos de urgência e emergência pré-hospitalar. O aluno dispõe de <strong>3 chances</strong> para atingir <strong>pelo menos 70%</strong> de acertos e garantir a aprovação.
                </p>
              </div>

              {/* Métricas e Regras */}
              <div className="flex flex-wrap items-center gap-5 text-xs pt-1">
                <span className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  <HelpCircle className="w-4 h-4 text-uniao-600 dark:text-uniao-400" />
                  <span><strong>{mockQuestions.length} questões</strong> de múltipla escolha</span>
                </span>
                <span className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  <Clock className="w-4 h-4 text-uniao-600 dark:text-uniao-400" />
                  <span><strong>30 minutos</strong> recomendados</span>
                </span>
                <span className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  <Award className="w-4 h-4 text-uniao-600 dark:text-uniao-400" />
                  <span>Aprovação: <strong>mínimo 70%</strong> ({Math.ceil((minPassingScore / 100) * mockQuestions.length)} acertos)</span>
                </span>
              </div>
            </div>

            {/* Ação de Iniciar Prova */}
            <div className="w-full md:w-auto shrink-0 flex flex-col gap-2">
              {isApproved ? (
                <div className="text-center md:text-right space-y-2">
                  <div className="px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    ✓ Aprovado com {bestScore}% de aproveitamento
                  </div>
                  <button
                    onClick={() => { setAnswers({}); setExamFinished(true); setIsExamRunning(true); }}
                    className={`w-full px-5 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
                      theme === 'dark'
                        ? 'text-slate-300 hover:text-white border-white/10 hover:bg-white/5'
                        : 'text-slate-700 hover:text-slate-900 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Revisar Questões
                  </button>
                </div>
              ) : attemptsRemaining === 0 ? (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs space-y-1 text-center md:text-right">
                  <strong>Limite de 3 tentativas atingido.</strong>
                  <p className="text-[11px] opacity-80">Solicite autorização de nova tentativa ao instrutor.</p>
                </div>
              ) : (
                <button
                  onClick={handleStartExam}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-uniao-400 to-teal-300 hover:brightness-110 text-sm shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <span>{attemptsUsed === 0 ? 'Iniciar Prova Agora' : `Tentar Novamente (Chance ${attemptsUsed + 1}/3)`}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Histórico das Tentativas (3 Chances) */}
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-4 ${
            theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200/90'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Suas 3 Chances da Prova
                </h3>
                <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Para aprovação é necessário atingir 70% ou mais em pelo menos uma das três chances.
                </p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}>
                {attemptsUsed} de 3 realizadas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {[1, 2, 3].map((num) => {
                const attemptData = history.find((h) => h.attempt === num);
                const isCurrent = attemptsUsed + 1 === num && !isApproved;

                return (
                  <div
                    key={num}
                    className={`p-5 rounded-2xl border transition-all ${
                      attemptData
                        ? attemptData.passed
                          ? theme === 'dark' ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : theme === 'dark' ? 'bg-red-950/20 border-red-500/40 text-red-300' : 'bg-red-50 border-red-200 text-red-900'
                        : isCurrent
                        ? theme === 'dark' ? 'bg-uniao-950/30 border-uniao-500 text-uniao-300' : 'bg-teal-50/70 border-teal-500 text-teal-900'
                        : theme === 'dark' ? 'bg-slate-950/40 border-white/5 text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                      <span>Tentativa {num}</span>
                      {attemptData ? (
                        attemptData.passed ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40">
                            Aprovado (≥ 70%)
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/40">
                            Reprovado (&lt; 70%)
                          </span>
                        )
                      ) : isCurrent ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/30">
                          Próxima
                        </span>
                      ) : (
                        <span className="text-[10px] opacity-70">Disponível</span>
                      )}
                    </div>

                    <div className="text-2xl font-black">
                      {attemptData ? `${attemptData.score}%` : isCurrent ? 'Pendente' : '—'}
                    </div>

                    <div className="text-[11px] opacity-75 mt-1">
                      {attemptData 
                        ? `Finalizada às ${attemptData.date}` 
                        : isCurrent 
                        ? 'Clique em iniciar prova acima' 
                        : 'Aguardando tentativa'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Informativo de Aprovação & Pré-Requisito Presencial */}
          <div className={`rounded-2xl p-4 sm:p-5 border flex items-center gap-4 ${
            theme === 'dark'
              ? 'bg-slate-900/50 border-slate-700 text-slate-300'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              theme === 'dark' ? 'bg-slate-800 border-slate-700 text-uniao-400' : 'bg-white border-slate-200 text-teal-700 shadow-xs'
            }`}>
              <Award className="w-5 h-5" />
            </div>
            <div className="text-xs space-y-0.5">
              <strong className={`block text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Passaporte para a Etapa Presencial
              </strong>
              <p>
                A nota mínima de 70% na Prova Teórica comprova a fundamentação necessária para os simulados e práticas presenciais com os instrutores.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

