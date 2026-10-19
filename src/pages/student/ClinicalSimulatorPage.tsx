import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, 
  XCircle, ChevronRight, Activity, RotateCcw
} from 'lucide-react';

interface SimulationStep {
  id: number;
  phase: string;
  scenarioText: string;
  vitalSigns: {
    consciousness: string;
    breathing: string;
    circulation: string;
    bleeding: string;
  };
  options: {
    id: string;
    text: string;
    type: 'essential' | 'adequate' | 'incorrect' | 'critical_error';
    feedback: string;
    score: number;
  }[];
}

export const ClinicalSimulatorPage: React.FC = () => {
  // Caso Clínico Oficial: Hemorragia Exanguinante em Acidente Escolar/Trabalho (Stop the Bleed)
  const steps: SimulationStep[] = [
    {
      id: 1,
      phase: 'Etapa 1: Segurança da Cena e Reconhecimento Imediato',
      scenarioText: 'Você é acionado para um incidente na oficina da instituição. Há uma pessoa caída ao solo com corte profundo no membro inferior e grande poça de sangue em expansão contínua. Máquinas no local ainda estão energizadas e ferramentas cortantes espalhadas.',
      vitalSigns: {
        consciousness: 'Ansioso, pálido, sudoreico',
        breathing: 'Taquipneico (26 rpm)',
        circulation: 'Pulso radial fino e rápido (120 bpm)',
        bleeding: 'Exanguinante, pulsátil (artéria femoral)'
      },
      options: [
        {
          id: 'opt1',
          text: 'Correr até a vítima sem verificar a energia e aplicar compressa de pano comum.',
          type: 'critical_error',
          feedback: 'ERRO CRÍTICO: Aproximar-se de maquinário energizado sem isolar a cena coloca o socorrista em risco fatal. Além disso, sangramento arterial pulsátil exige torniquete imediato.',
          score: -30
        },
        {
          id: 'opt2',
          text: 'Garantir desligamento da chave de força, calçar luvas/óculos de proteção, acionar o resgate e abordar a vítima com torniquete.',
          type: 'essential',
          feedback: 'CONDUTA ESSENCIAL: Segurança da cena estabelecida, biossegurança adotada, apoio avançado acionado e foco imediato no controle de hemorragia massiva.',
          score: 30
        },
        {
          id: 'opt3',
          text: 'Esperar a chegada dos bombeiros sem realizar qualquer intervenção.',
          type: 'incorrect',
          feedback: 'CONDUTA INCORRETA: Em hemorragias arteriais graves, a vítima pode evoluir para choque hipovolêmico e óbito em menos de 5 minutos antes da chegada do socorro.',
          score: -20
        }
      ]
    },
    {
      id: 2,
      phase: 'Etapa 2: Intervenção — Controle de Hemorragia Exanguinante (X)',
      scenarioText: 'A cena está segura e o socorro avançado foi acionado. A vítima apresenta sangramento arterial maciço e contínuo no terço médio da coxa direita. Você tem à disposição um torniquete de extremidades homologado.',
      vitalSigns: {
        consciousness: 'Sonolência iniciando (hipoperfusão cerebral)',
        breathing: '28 rpm',
        circulation: 'Pulso radial quase imperceptível',
        bleeding: 'Maciço, pulsátil'
      },
      options: [
        {
          id: 'opt4',
          text: 'Posicionar o torniquete 5 a 7 cm acima da lesão (ou raiz do membro se a lesão não for visualizada claramente), ajustar a fita sem folgas e torcer a haste até cessar o sangramento e o pulso distal.',
          type: 'essential',
          feedback: 'CONDUTA ESSENCIAL: Aplicação perfeita do torniquete conforme as diretrizes do Stop the Bleed e TCCC. A rotação da haste até a hemostasia completa estanca o choque hemorrágico.',
          score: 40
        },
        {
          id: 'opt5',
          text: 'Aplicar o torniquete diretamente sobre a articulação do joelho.',
          type: 'critical_error',
          feedback: 'ERRO CRÍTICO: Nunca aplique o torniquete sobre articulações, pois a anatomia óssea impede a oclusão vascular efetiva e pode fraturar estruturas articulares.',
          score: -30
        },
        {
          id: 'opt6',
          text: 'Colocar apenas gaze estéril superficial sem apertar para não doer na vítima.',
          type: 'critical_error',
          feedback: 'ERRO CRÍTICO: Sangramento arterial exanguinante não cessa com curativo superficial sem pressão vigorosa. A hesitação levaria a parada cardiorrespiratória por exsanguinação.',
          score: -30
        }
      ]
    },
    {
      id: 3,
      phase: 'Etapa 3: Reavaliação, Tempo e Prevenção de Hipotermia',
      scenarioText: 'O torniquete foi travado e o sangramento massivo cessou. A vítima começa a tremer de frio e apresenta extremidades arroxeadas.',
      vitalSigns: {
        consciousness: 'Responde a estímulos verbais com confusão',
        breathing: '22 rpm',
        circulation: 'Pulso carotídeo palpável (105 bpm), sangramento contido',
        bleeding: 'Controlado pelo torniquete'
      },
      options: [
        {
          id: 'opt7',
          text: 'Anotar imediatamente o horário exato de aplicação na fita do torniquete, cobrir a vítima com manta térmica/cobertor e monitorar vias aéreas e respiração até a chegada da equipe de suporte avançado.',
          type: 'essential',
          feedback: 'CONDUTA ESSENCIAL: Registrar o horário é mandatório para a equipe cirúrgica. A prevenção de hipotermia combate a tríade letal do trauma (hipotermia, acidose e coagulopatia).',
          score: 30
        },
        {
          id: 'opt8',
          text: 'Afrouxar o torniquete a cada 5 minutos para "circular um pouco de sangue".',
          type: 'critical_error',
          feedback: 'ERRO CRÍTICO GRAVÍSSIMO: NUNCA afrouxe um torniquete no ambiente pré-hospitalar! O alívio de pressão causa retorno do sangramento maciço e choque irreversível.',
          score: -40
        }
      ]
    }
  ];

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [decisionHistory, setDecisionHistory] = useState<any[]>([]);
  const [simulationCompleted, setSimulationCompleted] = useState(false);

  const currentStep = steps[currentStepIdx];

  const handleSelectOption = (opt: any) => {
    setSelectedOptionId(opt.id);
  };

  const handleConfirmDecision = () => {
    if (!selectedOptionId) return;

    const chosenOption = currentStep.options.find(o => o.id === selectedOptionId);
    if (!chosenOption) return;

    const newHistory = [
      ...decisionHistory,
      {
        step: currentStep.phase,
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
    setSimulationCompleted(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      
      {/* Top Header do Simulador */}
      <header className="bg-slate-900 border-b border-white/10 px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link
            to="/aluno/dashboard"
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Dashboard</span>
          </Link>
          <div className="border-l border-white/10 pl-3">
            <span className="text-[10px] font-bold text-uniao-400 uppercase tracking-widest block">
              Simulador Clínico Online • Pré-Requisito Presencial
            </span>
            <span className="text-xs sm:text-sm font-bold text-white">
              Caso 01: Hemorragia Exanguinante e Choque Hipovolêmico
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-uniao-500/10 border border-uniao-500/30 text-uniao-300 font-bold hidden sm:inline">
            Etapa {currentStepIdx + 1} de {steps.length}
          </span>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 space-y-6">
        
        {!simulationCompleted ? (
          <div className="space-y-6">
            
            {/* Sinais Vitais e Monitor da Vítima */}
            <div className="rounded-3xl bg-slate-900/90 border border-white/10 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Monitor de Cena & Estado da Vítima
                  </span>
                </div>
                <span className="text-[11px] font-mono text-red-400 bg-red-950/80 px-2.5 py-0.5 rounded-full border border-red-500/30 font-bold">
                  EMERGÊNCIA GRAVE (X)
                </span>
              </div>

              {/* Grid de Dados Vitais */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Consciência</span>
                  <span className="text-white font-medium">{currentStep.vitalSigns.consciousness}</span>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Respiração</span>
                  <span className="text-white font-medium">{currentStep.vitalSigns.breathing}</span>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Circulação</span>
                  <span className="text-white font-medium">{currentStep.vitalSigns.circulation}</span>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-white/5">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Sangramento</span>
                  <span className="text-red-400 font-bold">{currentStep.vitalSigns.bleeding}</span>
                </div>
              </div>

              {/* Descrição do Cenário */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-1">
                <span className="text-[10px] font-bold text-uniao-400 uppercase tracking-wider block">
                  {currentStep.phase}
                </span>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {currentStep.scenarioText}
                </p>
              </div>
            </div>

            {/* Opções de Tomada de Decisão */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Qual conduta você adota imediatamente?</span>
              </h3>

              <div className="space-y-3">
                {currentStep.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all text-xs sm:text-sm flex items-start gap-4 ${
                        isSelected
                          ? 'bg-uniao-950/80 border-uniao-400 text-white shadow-[0_0_20px_rgba(20,184,166,0.25)]'
                          : 'bg-slate-900/60 border-white/10 text-slate-300 hover:bg-slate-800/80 hover:border-white/20'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'border-uniao-400 bg-uniao-500 text-slate-950' : 'border-slate-600'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                      </div>
                      <span className="leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Botão de Avanço */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  disabled={!selectedOptionId}
                  onClick={handleConfirmDecision}
                  className="px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-uniao-400 to-teal-300 hover:brightness-110 disabled:opacity-40 transition-all text-sm shadow"
                >
                  Confirmar Conduta Médica →
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* DEBRIEFING CLÍNICO FINAL (Requisito da Seção 14 do Prompt Mestre) */
          <div className="rounded-3xl bg-slate-900 border border-white/10 p-6 sm:p-10 space-y-8 shadow-2xl">
            
            {/* Header do Debriefing */}
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

              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Debriefing da Simulação Clínica
              </h2>

              <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                {isApproved
                  ? 'Excelente raciocínio clínico! Você priorizou a segurança, estancou a hemorragia exanguinante e assegurou o suporte térmico da vítima.'
                  : 'A simulação registrou erros clínicos que comprometeriam a vida da vítima ou a segurança da equipe. É obrigatório refazer para liberar a aula prática.'}
              </p>

              <div className="inline-flex items-center gap-3 pt-2">
                <span className="text-xs font-bold text-slate-400">Pontuação Final:</span>
                <span className={`text-xl font-black font-mono ${isApproved ? 'text-emerald-400' : 'text-red-400'}`}>
                  {totalScore} pts
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  isApproved ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-red-950 text-red-300 border border-red-500/40'
                }`}>
                  {isApproved ? 'PRÉ-REQUISITO APROVADO' : 'REQUER REVISÃO'}
                </span>
              </div>
            </div>

            {/* Análise Passo a Passo das Condutas */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                Histórico de Decisões e Avaliação Técnica:
              </h3>

              <div className="space-y-3">
                {decisionHistory.map((item, idx) => (
                  <div 
                    key={idx}
                    className={`p-4 rounded-2xl border text-xs space-y-2 ${
                      item.type === 'essential'
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : item.type === 'critical_error'
                        ? 'bg-red-950/30 border-red-500/50'
                        : 'bg-slate-950 border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-uniao-400 uppercase text-[10px] tracking-wider">{item.step}</span>
                      <span className={`font-mono text-xs ${item.score > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {item.score > 0 ? `+${item.score}` : item.score} pts
                      </span>
                    </div>

                    <div className="text-slate-200">
                      <strong>Sua Decisão:</strong> {item.chosen}
                    </div>

                    <div className="text-slate-400 leading-relaxed pt-1 border-t border-white/5">
                      <strong>Comentário do Instrutor:</strong> {item.feedback}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ação de Conclusão ou Repetição */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleRestart}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Refazer Simulado</span>
              </button>

              {isApproved ? (
                <Link
                  to="/aluno/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-uniao-400 to-teal-300 hover:brightness-110 text-xs shadow"
                >
                  <span>Liberar Passaporte para Aula Presencial</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <div className="text-xs text-red-400 font-semibold text-center sm:text-right">
                  Corrija as condutas no simulador para desbloquear o treinamento presencial.
                </div>
              )}
            </div>

          </div>
        )}

      </main>

    </div>
  );
};
