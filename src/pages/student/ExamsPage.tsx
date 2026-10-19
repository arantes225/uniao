import React from 'react';
import { HelpCircle, Clock, Award, CheckCircle2, ChevronRight } from 'lucide-react';

export const ExamsPage: React.FC = () => {
  const exams = [
    {
      id: 'exam-1',
      title: 'Prova de Avaliação Inicial e Segurança da Cena (Módulo 01)',
      questionsCount: 20,
      timeMinutes: 45,
      minScore: 70,
      status: 'completed',
      myScore: 90,
      attempts: '1 de 3',
    },
    {
      id: 'exam-2',
      title: 'Prova Teórica de Controle de Hemorragias — Stop the Bleed (Módulo 02)',
      questionsCount: 25,
      timeMinutes: 50,
      minScore: 80,
      status: 'pending',
      attempts: '0 de 3',
    },
    {
      id: 'exam-3',
      title: 'Exame Geral de Certificação Pré-Hospitalar (Passaporte Presencial)',
      questionsCount: 40,
      timeMinutes: 90,
      minScore: 80,
      status: 'locked',
      attempts: '0 de 2',
    }
  ];

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto w-full">
      <div className="space-y-1">
        <span className="text-xs font-bold text-uniao-400 uppercase tracking-wider">
          Avaliações Formais
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Banco de Provas & Exames
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          As provas formais validam a fundamentação técnica e compõem o critério de liberação do simulado presencial.
        </p>
      </div>

      <div className="space-y-4">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className={`rounded-3xl border p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all ${
              exam.status === 'completed'
                ? 'bg-slate-900 border-emerald-500/30'
                : exam.status === 'pending'
                ? 'bg-slate-900 border-uniao-500/40 shadow-xl'
                : 'bg-slate-900/40 border-white/5 opacity-60'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {exam.status === 'completed' && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Aprovado com {exam.myScore}%</span>
                  </span>
                )}
                {exam.status === 'pending' && (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-uniao-500/20 text-uniao-300 border border-uniao-500/30">
                    Disponível para Realização
                  </span>
                )}
                {exam.status === 'locked' && (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/5 text-slate-500">
                    Bloqueada
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-white">
                {exam.title}
              </h3>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-uniao-400" />
                  <span>{exam.questionsCount} questões</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-uniao-400" />
                  <span>{exam.timeMinutes} minutos</span>
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-uniao-400" />
                  <span>Nota mínima: {exam.minScore}%</span>
                </span>
              </div>
            </div>

            <div>
              {exam.status === 'pending' && (
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-uniao-400 to-teal-300 hover:brightness-110 text-xs shadow">
                  <span>Iniciar Prova Agora</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
              {exam.status === 'completed' && (
                <button className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white border border-white/10 hover:bg-white/5">
                  Ver Gabarito
                </button>
              )}
              {exam.status === 'locked' && (
                <span className="text-xs text-slate-500 font-medium">Requer módulo anterior</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
