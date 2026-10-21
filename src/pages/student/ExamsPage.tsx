import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, Clock, Award, CheckCircle2, ChevronRight, AlertTriangle, RotateCcw, XCircle, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { INITIAL_40_MODULES } from '../../data/curriculumData';

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
  },
  {
    id: 11,
    stem: 'Ao suspeitar de pneumotórax hipertensivo em paciente traumatizado com instabilidade hemodinâmica, qual o procedimento de alívio emergencial indicado?',
    options: [
      'Toracocentese descompressiva com agulha/cateter calibroso no 2º espaço intercostal na linha hemiclavicular ou 4º/5º espaço na linha axilar anterior',
      'Intubação orotraqueal imediata com pressão positiva sem descompressão',
      'Aplicação de torniquete torácico',
      'Administração exclusiva de broncodilatador inalatório'
    ],
    correct: 0,
    explanation: 'O pneumotórax hipertensivo é emergência clínica extrema resolvida com descompressão torácica imediata por agulha calibrosa para aliviar o colapso hemodinâmico.'
  },
  {
    id: 12,
    stem: 'Qual a conduta indicada para o curativo de ferimento torácico aspirante (pneumotórax aberto) no APH?',
    options: [
      'Oclusão total e hermética dos quatro lados sem válvula',
      'Curativo oclusivo de 3 pontas (três lados fixados, funcionando como válvula unidirecional)',
      'Manter a ferida totalmente aberta sem curativo',
      'Tamponamento profundo com algodão seco'
    ],
    correct: 1,
    explanation: 'O curativo de 3 pontas permite a saída de ar acumulado durante a expiração e impede a entrada de ar atmosférico durante a inspiração, prevenindo a hipertensão pleural.'
  },
  {
    id: 13,
    stem: 'Qual o ritmo cardíaco de parada que NÃO responde a choque elétrico no Desfibrilador Externo Automático (DEA)?',
    options: [
      'Fibrilação Ventricular (FV)',
      'Taquicardia Ventricular sem Pulso (TVSP)',
      'Assistolia e Atividade Elétrica Sem Pulso (AESP)',
      'Taquicardia Ventricular Polimórfica (Torsades)'
    ],
    correct: 2,
    explanation: 'Assistolia e AESP são ritmos não chocáveis. A conduta é RCP imediata contínua, identificação e tratamento rápido das causas reversíveis (5H e 5T) e adrenalina precoce.'
  },
  {
    id: 14,
    stem: 'Em um quadro suspeito de Acidente Vascular Cerebral (AVC), qual escala de triagem rápida é amplamente empregada no APH avaliando fraqueza facial, debilidade nos braços e alteração na fala?',
    options: [
      'Escala Pré-Hospitalar de Cincinnati',
      'Escala de Aldrete e Kroulik',
      'Escala de Ramsay',
      'Escore de Apgar'
    ],
    correct: 0,
    explanation: 'A Escala de Cincinnati avalia assimetria facial, queda do membro superior e fala anormal. A positividade de 1 sinal confere alta probabilidade de AVC isquêmico agudo.'
  },
  {
    id: 15,
    stem: 'Qual o tempo máximo recomendado (Golden Hour / Janela Terapêutica) para condução de um paciente com infarto agudo do miocárdio com supra de ST (IAMCSST) ou AVC isquêmico até um centro de referência hemodinâmica/trombólise?',
    options: [
      'O mais breve possível, respeitando a janela crítica de até 60 minutos porta-balão e até 4.5 horas para trombólise venosa no AVC',
      'Dentro de 24 horas sem urgência',
      'Apenas após o término de todos os exames laboratoriais no domicílio',
      'Até 48 horas após o início dos sintomas'
    ],
    correct: 0,
    explanation: 'Tempo é músculo cardíaco e tempo é cérebro. O transporte ágil com aviso prévio ao hospital salva vidas e viabiliza a desobstrução arterial em tempo hábil.'
  },
  {
    id: 16,
    stem: 'Qual conduta é CONTRAINDICADA no atendimento inicial à vítima de convulsão tônico-clônica generalizada em ambiente extra-hospitalar?',
    options: [
      'Afastar objetos cortantes e proteger a cabeça da vítima com superfície acolchoada',
      'Introduzir os dedos, colher ou panos na boca da vítima para segurar a língua',
      'Lateralizar a cabeça da vítima após a crise para evitar broncoaspiração de saliva/vômito',
      'Cronometrar o tempo de duração da crise epiléptica'
    ],
    correct: 1,
    explanation: 'Nunca se deve colocar nada na boca do paciente durante uma convulsão. Isso gera risco grave de quebra dentária, lesão nas mãos do socorrista e obstrução de via aérea.'
  },
  {
    id: 17,
    stem: 'No afogamento, qual a prioridade primordial na ressuscitação cardiopulmonar quando a vítima está em parada cardiorrespiratória?',
    options: [
      'Ventilações de resgate precoces (5 ventilações iniciais), pois a causa primária da parada é a hipóxia/asfixia',
      'Compressões contínuas isoladas sem ventilação',
      'Compressão abdominal para retirar a água do pulmão',
      'Torniquete em membros'
    ],
    correct: 0,
    explanation: 'Diferente da PCR por etiologia cardíaca, o afogamento é causado por hipóxia pura. A reanimação exige ventilações de resgate precoces associadas a compressões.'
  },
  {
    id: 18,
    stem: 'Ao encontrar um objeto empalado (transfixado) no abdômen de uma vítima consciente, qual o manejo correto?',
    options: [
      'Remover o objeto imediatamente no local',
      'Estabilizar o objeto no lugar com compressas e ataduras sem removê-lo, prevenindo hemorragia maciça adicional',
      'Empurrar o objeto para dentro da cavidade para evitar exposição',
      'Girar o objeto em 360 graus para descompressão'
    ],
    correct: 1,
    explanation: 'Objetos empalados tamponam grandes vasos. A sua remoção só pode ser realizada em centro cirúrgico hospitalar estruturado; no APH, apenas estabiliza-se o objeto.'
  },
  {
    id: 19,
    stem: 'Qual a técnica recomendada de abertura de via aérea em vítimas de trauma com suspeita de lesão da coluna cervical?',
    options: [
      'Hiperextensão forçada da cabeça (Head-tilt)',
      'Tração da mandíbula (Jaw-thrust) com alinhamento e estabilização cervical manual neutra',
      'Flexão anterior máxima do queixo contra o esterno',
      'Rotação lateral da cabeça em 90 graus'
    ],
    correct: 1,
    explanation: 'A manobra de Jaw-thrust (anteriorização mandibular) abre as vias aéreas sem exigir hiperextensão da coluna cervical, preservando a medula espinhal.'
  },
  {
    id: 20,
    stem: 'Em um acidente com múltiplas vítimas (Método START), como deve ser classificada uma vítima que não respira após uma tentativa simples de abertura de vias aéreas?',
    options: [
      'Verde (leve / deambula)',
      'Amarela (urgente / aguarda transporte)',
      'Preta (óbito / inviável no método START)',
      'Vermelha (imediata prioritária)'
    ],
    correct: 2,
    explanation: 'No método START de triagem para catástrofes, se a vítima permanece sem respirar mesmo após o alinhamento da via aérea, é classificada com a lona/cartão preto (óbito).'
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

  // Regras de Tempo (45 min = 2700 seg) e Segurança (Anti-cola: inatividade 45s ou troca de aba)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(45 * 60);
  const [securityAlert, setSecurityAlert] = useState<string | null>(null);
  const lastActiveTimestamp = useRef<number>(Date.now());

  const maxAttempts = 3;
  const minPassingScore = 70; // 70% de acertos para ser aprovado (14 de 20 questões)
  const isApproved = bestScore !== null && bestScore >= minPassingScore;
  const attemptsRemaining = Math.max(0, maxAttempts - attemptsUsed);
  // Regra Atualizada: Mesmo aprovado de primeira, o aluno pode utilizar as tentativas restantes
  // para tentar uma nota maior (prevalecendo sempre a maior nota obtida).
  const canAttempt = attemptsRemaining > 0;
  const watchedLessons = (() => {
    try { return JSON.parse(localStorage.getItem('uniao:watched-lessons') || '[]') as string[]; } catch { return []; }
  })();
  const allLessonsViewed = INITIAL_40_MODULES.length === 0 || watchedLessons.length >= INITIAL_40_MODULES.length;

  // Temporizador Geral de 45 minutos da Prova
  useEffect(() => {
    let timer: any = null;
    if (isExamRunning && !examFinished) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer!);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isExamRunning, examFinished]);

  // Monitoramento de Inatividade (45s) e Troca de Aba/Tela (Visibilitychange / Blur)
  // Regra Atualizada: Em caso de troca de tela ou inatividade acima de 45 segundos,
  // a tentativa de prova é automaticamente atribuída nota 0 e encerrada.
  useEffect(() => {
    if (!isExamRunning || examFinished) return;

    const resetActivity = () => {
      lastActiveTimestamp.current = Date.now();
    };

    // Ação: Anular a tentativa com Nota 0 por violação de segurança
    const triggerZeroScore = (reason: string) => {
      setAnswers({});
      setLastScore(0);
      const newAttemptNumber = attemptsUsed + 1;
      setAttemptsUsed(newAttemptNumber);
      setBestScore((prev) => (prev === null ? 0 : Math.max(prev, 0)));
      setHistory((prev) => [
        ...prev,
        {
          attempt: newAttemptNumber,
          score: 0,
          passed: false,
          date: `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Anulada)`
        }
      ]);
      setExamFinished(true);
      setSecurityAlert(reason);
    };

    // 1. Troca de aba ou perda de foco da janela
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerZeroScore('⚠️ Atenção: Troca de tela/aba detectada! Conforme a regra de segurança, a tentativa de prova foi automaticamente encerrada com nota 0.');
      }
    };

    const handleWindowBlur = () => {
      triggerZeroScore('⚠️ Atenção: Perda de foco da janela da prova detectada! Conforme a regra de segurança, a tentativa de prova foi automaticamente encerrada com nota 0.');
    };

    // 2. Verificação de Inatividade a cada 2 segundos
    const inactivityInterval = setInterval(() => {
      const elapsedInactiveMs = Date.now() - lastActiveTimestamp.current;
      if (elapsedInactiveMs >= 45000) { // 45 segundos inativo
        triggerZeroScore('⚠️ Atenção: Inatividade superior a 45 segundos detectada! A tentativa de prova foi automaticamente encerrada com nota 0.');
        lastActiveTimestamp.current = Date.now();
      }
    }, 2000);

    // Eventos de rastreamento de presença/atividade
    window.addEventListener('mousemove', resetActivity);
    window.addEventListener('keydown', resetActivity);
    window.addEventListener('click', resetActivity);
    window.addEventListener('scroll', resetActivity);
    window.addEventListener('touchstart', resetActivity);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      clearInterval(inactivityInterval);
      window.removeEventListener('mousemove', resetActivity);
      window.removeEventListener('keydown', resetActivity);
      window.removeEventListener('click', resetActivity);
      window.removeEventListener('scroll', resetActivity);
      window.removeEventListener('touchstart', resetActivity);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isExamRunning, examFinished, attemptsUsed]);

  const handleStartExam = () => {
    if (!canAttempt || !allLessonsViewed) return;
    setAnswers({});
    setExamFinished(false);
    setSecondsRemaining(45 * 60); // 45 minutos cravados
    lastActiveTimestamp.current = Date.now();
    setSecurityAlert(null);
    setIsExamRunning(true);
  };

  const handleSelectOption = (qId: number, oIdx: number) => {
    if (examFinished) return;
    lastActiveTimestamp.current = Date.now();
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

  // Formatação do tempo restante (mm:ss)
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
          Avaliação formal composta por <strong>20 questões de múltipla escolha</strong>. Tempo máximo de <strong>45 minutos</strong> por tentativa. Você terá <strong>3 chances</strong> para acertar pelo menos <strong>70% da prova</strong> para ser aprovado.
        </p>
      </div>

      {/* TELA DE REALIZAÇÃO DA PROVA (QUANDO EM EXECUÇÃO) */}
      {isExamRunning ? (
        <div className="space-y-6">
          {/* Barra Superior Fixa da Prova com Temporizador e Contador */}
          <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-16 z-20 backdrop-blur-md shadow-lg ${
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
                <h2 className="text-base font-bold">Prova Geral de Certificação Pré-Hospitalar (20 Questões)</h2>
                <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Tentativa {examFinished ? attemptsUsed : attemptsUsed + 1} de {maxAttempts} • Meta de aprovação: {minPassingScore}% (14 acertos)
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
              {/* Temporizador de 45 minutos */}
              {!examFinished && (
                <div className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border ${
                  secondsRemaining < 300
                    ? 'bg-red-500/10 border-red-500/40 text-red-500 animate-pulse'
                    : theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-amber-400'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span className="font-mono text-sm tracking-wider">{formatTime(secondsRemaining)}</span>
                </div>
              )}

              <span className={`px-3 py-2 rounded-xl border ${
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

          {/* Alerta de Segurança Anti-fraude (Inatividade ou Troca de Tela) */}
          {securityAlert && (
            <div className="p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500 text-amber-900 dark:text-amber-200 flex items-center gap-3 animate-bounce">
              <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0" />
              <div className="text-xs font-bold">
                {securityAlert}
              </div>
            </div>
          )}

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

          {/* Lista das 20 Questões da Prova */}
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
                      {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
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
                  Prova Teórica Geral de Certificação Pré-Hospitalar (20 Questões)
                </h2>
              </div>

              {/* Regras Críticas em Destaque */}
              <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                <span className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  <HelpCircle className="w-4 h-4 text-uniao-600 dark:text-uniao-400" />
                  <span><strong>20 questões</strong> objetivas</span>
                </span>
                <span className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  <Clock className="w-4 h-4 text-uniao-600 dark:text-uniao-400" />
                  <span>Máximo <strong>45 minutos</strong></span>
                </span>
                <span className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  <Award className="w-4 h-4 text-uniao-600 dark:text-uniao-400" />
                  <span>Aprovação: <strong>mínimo 70%</strong> (14 acertos)</span>
                </span>
                <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Atenção: em caso de troca de tela ou inatividade acima de 45 segundos, a tentativa de prova é automaticamente atribuída nota 0</span>
                </span>
              </div>
            </div>

            {/* Ação de Iniciar Prova */}
            <div className="w-full md:w-auto shrink-0 flex flex-col gap-2">
              {attemptsRemaining === 0 ? (
                <div className="space-y-2 text-center md:text-right">
                  {isApproved && (
                    <div className="px-5 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                      ✓ Aprovado com {bestScore}% de aproveitamento
                    </div>
                  )}
                  <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs space-y-1">
                    <strong>Limite de 3 tentativas concluído.</strong>
                    <p className="text-[11px] opacity-80">Maior nota registrada: {bestScore}%</p>
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
              ) : isApproved ? (
                <div className="text-center md:text-right space-y-2">
                  <div className="px-5 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    ✓ Aprovado com {bestScore}% (Maior Nota Registrada)
                  </div>
                  <button
                    onClick={handleStartExam}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-uniao-400 to-teal-300 hover:brightness-110 text-xs shadow-md transition-all"
                  >
                    <span>Fazer Nova Tentativa (Chance {attemptsUsed + 1}/3)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <p className="text-[10px] text-slate-500">
                    A maior nota obtida sempre prevalece no seu histórico.
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleStartExam}
                  disabled={!allLessonsViewed}
                  title={!allLessonsViewed ? 'Assista a todas as aulas antes de iniciar a prova.' : undefined}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-uniao-400 to-teal-300 hover:brightness-110 text-sm shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100"
                >
                  <span>{attemptsUsed === 0 ? 'Iniciar Prova Agora (45 min)' : `Tentar Novamente (Chance ${attemptsUsed + 1}/3)`}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
              {!allLessonsViewed && attemptsRemaining > 0 && !isApproved && (
                <p className="text-[11px] text-amber-600 dark:text-amber-300 text-center md:text-right max-w-xs">Assista a todas as {INITIAL_40_MODULES.length} aulas para liberar o início da prova.</p>
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
                  Para aprovação é necessário atingir 70% ou mais (14 acertos em 20 questões). A maior nota obtida entre as tentativas é a que fica oficialmente registrada.
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

          {/* Informativo de Segurança & Pré-Requisito Presencial */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`rounded-2xl p-4 sm:p-5 border flex items-center gap-4 ${
              theme === 'dark'
                ? 'bg-slate-900/50 border-slate-700 text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                theme === 'dark' ? 'bg-slate-800 border-slate-700 text-uniao-400' : 'bg-white border-slate-200 text-teal-700 shadow-xs'
              }`}>
                <ShieldAlert className="w-5 h-5 text-amber-500" />
                </div>
              <div className="text-xs space-y-0.5">
                <strong className={`block text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Diretrizes de Integridade e Foco
                </strong>
                <p>
                  Caso troque de tela, minimize a janela ou permaneça inativo por mais de <strong>45 segundos</strong>, a alternativa selecionada será <strong>automaticamente cancelada</strong>.
                </p>
              </div>
            </div>

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
                  Atingir pelo menos 70% (14 de 20 acertos) dentro dos 45 minutos valida a fundamentação técnica para a liberação da aula prática presencial.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


