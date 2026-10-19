import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlayCircle, CheckCircle, Clock, 
  ArrowRight, ShieldCheck, Compass
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const StudentDashboard: React.FC = () => {
  const { theme } = useTheme();

  // Suporte a múltiplas turmas por aluno com switch
  const studentCohorts = [
    {
      id: 'aph-2026',
      name: 'Atendimento Pré-Hospitalar (APH) & Controle de Hemorragias',
      cohortCode: 'Turma de Capacitação APH 2026',
      currentModule: 'Módulo 01 — Fundamentos do APH',
      currentLesson: 'Aula 02 — Avaliação e Segurança da Cena',
      lessonUrl: '/aluno/aula/aph-mod1-aula2',
      progress: 40,
      daysRemaining: 89,
      lessonsCompleted: 4,
      totalLessons: 12,
      score: 95,
      simReady: true,
      practicalReady: false,
    },
    {
      id: 'stb-tatico',
      name: 'Stop the Bleed — Controle Tático de Grandes Hemorragias',
      cohortCode: 'Turma Stop the Bleed Tático',
      currentModule: 'Módulo 02 — Torniquetes e Curativos Hemostáticos',
      currentLesson: 'Aula 01 — Aplicação Rápida de Torniquetes em Extremidades',
      lessonUrl: '/aluno/aula/aph-mod1-aula2',
      progress: 70,
      daysRemaining: 45,
      lessonsCompleted: 7,
      totalLessons: 10,
      score: 98,
      simReady: true,
      practicalReady: true,
    },
  ];

  const [activeCohortId, setActiveCohortId] = useState('aph-2026');
  const activeCohort = studentCohorts.find(c => c.id === activeCohortId) || studentCohorts[0];

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto w-full">
        
        {/* Saudação e Seletor/Switch de Turma Ativa */}
        <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 rounded-3xl border shadow-lg ${
          theme === 'dark' 
            ? 'bg-slate-900/60 border-white/10' 
            : 'bg-white border-slate-200/90 shadow-slate-100'
        }`}>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Olá, Dr. Lucas Arantes
              </h1>
              {studentCohorts.length > 1 && (
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                  theme === 'dark'
                    ? 'bg-uniao-500/20 text-uniao-300 border-uniao-500/30'
                    : 'bg-teal-50 text-teal-800 border-teal-200'
                }`}>
                  {studentCohorts.length} Turmas Matriculadas
                </span>
              )}
            </div>
            
            {/* SWITCH DE TURMA */}
            <div className="flex flex-wrap items-center gap-3">
              <span className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Visualizando Conteúdo da Turma:
              </span>
              <div className={`inline-flex items-center gap-1.5 p-1 rounded-xl border ${
                theme === 'dark' ? 'bg-slate-950 border-white/10 shadow-inner' : 'bg-slate-100 border-slate-200'
              }`}>
                {studentCohorts.map((coh) => (
                  <button
                    key={coh.id}
                    type="button"
                    onClick={() => setActiveCohortId(coh.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeCohortId === coh.id
                        ? 'bg-uniao-600 text-white shadow-md'
                        : theme === 'dark'
                        ? 'text-slate-400 hover:text-white hover:bg-white/5'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-white'
                    }`}
                  >
                    {coh.cohortCode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Countdown de Dias Restantes de Acesso da Turma Ativa */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold border shadow ${
              theme === 'dark'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <Clock className={`w-4 h-4 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`} />
              <span>Acesso a esta turma: <strong className={`font-mono text-sm ${theme === 'dark' ? 'text-white' : 'text-amber-950'}`}>{activeCohort.daysRemaining} dias restantes</strong></span>
            </div>

            <div className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold border ${
              theme === 'dark'
                ? 'bg-uniao-500/10 border-uniao-500/30 text-uniao-400'
                : 'bg-teal-50 border-teal-200 text-teal-800'
            }`}>
              <ShieldCheck className={`w-4 h-4 ${theme === 'dark' ? 'text-uniao-400' : 'text-teal-600'}`} />
              <span>Etapa Online em Andamento</span>
            </div>
          </div>
        </div>

        {/* REQUISITO CENTRAL: CARD PRINCIPAL DE MÁXIMO DESTAQUE — "CONTINUE SUA JORNADA" */}
        <div className={`rounded-3xl p-6 sm:p-10 shadow-2xl border relative overflow-hidden ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-uniao-950 via-slate-900 to-slate-900 text-white border-uniao-500/30'
            : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-slate-700 shadow-slate-300/40'
        }`}>
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 pointer-events-none">
            <img src="/brand/simbolo-cruz-uniao.png" alt="USM" className="w-96 h-96 object-contain" />
          </div>

          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-uniao-500/20 text-uniao-300 border border-uniao-500/40">
              <Compass className="w-3.5 h-3.5" />
              <span>Próxima atividade da sua jornada</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                {activeCohort.currentModule}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {activeCohort.currentLesson}
              </h2>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-light">
              Videoaula completa + Apostila em PDF + 5 Questões objetivas (mínimo de 2 acertos para avançar).
            </p>

            {/* Barra de Progresso do Curso */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-slate-300 font-medium">
                <span>Progresso das etapas online</span>
                <span className="text-uniao-400 font-bold">{activeCohort.progress}% concluído</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-uniao-500 to-teal-300 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${activeCohort.progress}%` }} 
                />
              </div>
            </div>

            {/* Ações */}
            <div className="pt-3 flex flex-wrap gap-3">
              <Link
                to={activeCohort.lessonUrl}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-uniao-400 to-teal-300 hover:brightness-110 shadow-[0_0_25px_rgba(20,184,166,0.3)] transition-all transform hover:-translate-y-0.5 text-sm"
              >
                <PlayCircle className="w-5 h-5 text-slate-950" />
                <span>Continuar Aula Integrada</span>
                <ArrowRight className="w-4 h-4 text-slate-800" />
              </Link>

              <Link
                to="/aluno/provas"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition-all"
              >
                <span>Acessar Prova</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Trilha Pedagógica Completa com Bloqueio Sequencial de Módulos */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Trilha do Curso: Módulos & Aulas
              </h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Cada módulo requer a conclusão prévia do anterior (mínimo de 2 de 5 acertos nas atividades).
              </p>
            </div>
          </div>

          {/* MÓDULO 1 — CONCLUÍDO / EM ANDAMENTO */}
          <div className={`rounded-3xl border p-6 sm:p-8 space-y-5 shadow-sm transition-colors ${
            theme === 'dark' 
              ? 'bg-slate-900 border-white/10' 
              : 'bg-white border-slate-200/90 shadow-slate-100'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                  theme === 'dark' ? 'text-teal-400' : 'text-teal-700'
                }`}>
                  Etapa 01
                </span>
                <h4 className={`text-base sm:text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Módulo 01: Fundamentos do APH & Biossegurança
                </h4>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                theme === 'dark'
                  ? 'text-uniao-400 bg-uniao-500/10 border-uniao-500/30'
                  : 'text-teal-800 bg-teal-50 border-teal-200'
              }`}>
                Módulo Liberado
              </span>
            </div>

            <div className="space-y-3">
              {/* Aula 1 */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                theme === 'dark' ? 'bg-slate-950/60 border-white/5' : 'bg-slate-50/80 border-slate-200/80'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      Aula 01 — Introdução ao Atendimento Pré-Hospitalar
                    </h5>
                    <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
                      Concluída • 5/5 questões corretas (Mínimo: 2)
                    </p>
                  </div>
                </div>
                <Link
                  to="/aluno/aula/aph-mod1-aula1"
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                    theme === 'dark'
                      ? 'text-slate-400 hover:text-white border-white/10 hover:bg-white/5'
                      : 'text-slate-600 hover:text-slate-900 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Revisar
                </Link>
              </div>

              {/* Aula 2 */}
              <div className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-4 ${
                theme === 'dark'
                  ? 'border-uniao-500 bg-uniao-950/20'
                  : 'border-teal-500 bg-teal-50/50 shadow-xs'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 font-black shadow-xs">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>
                        Aula 02 — Avaliação e Segurança da Cena
                      </h5>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                        theme === 'dark'
                          ? 'bg-uniao-500/20 text-uniao-300 border-uniao-500/40'
                          : 'bg-teal-100 text-teal-800 border-teal-300'
                      }`}>
                        EM CURSO
                      </span>
                    </div>
                    <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      Videoaula • Apostila PDF • 5 Questões (acerte 2 para avançar)
                    </p>
                  </div>
                </div>
                <Link
                  to="/aluno/aula/aph-mod1-aula2"
                  className="text-xs font-bold text-slate-950 bg-gradient-to-r from-uniao-400 to-teal-300 px-4 py-2 rounded-xl shadow hover:brightness-105 transition-all"
                >
                  Continuar
                </Link>
              </div>
            </div>
          </div>

          {/* MÓDULO 2 — BLOQUEADO ATÉ CONCLUSÃO DO MÓDULO 01 */}
          <div className={`rounded-3xl border p-6 sm:p-8 space-y-4 opacity-70 transition-colors ${
            theme === 'dark' 
              ? 'bg-slate-900/40 border-white/5' 
              : 'bg-slate-100/70 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-500">
                  Etapa 02 • Bloqueada
                </span>
                <h4 className={`text-base sm:text-lg font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700'}`}>
                  Módulo 02: Hemorragias Exsanguinantes & Protocolo XABCDE
                </h4>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full border ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700 text-slate-400'
                  : 'bg-slate-200 border-slate-300 text-slate-600'
              }`}>
                Requer Módulo 01 Completo
              </span>
            </div>

            <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between ${
              theme === 'dark' ? 'bg-slate-950/30 border-white/5 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
            }`}>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Liberação automática após obter pelo menos 2 acertos em cada atividade do Módulo 01.</span>
              </div>
              <span className="font-bold text-slate-400">Bloqueado</span>
            </div>
          </div>

          {/* MÓDULO 3 — BLOQUEADO */}
          <div className={`rounded-3xl border p-6 sm:p-8 space-y-4 opacity-50 transition-colors ${
            theme === 'dark' 
              ? 'bg-slate-900/30 border-white/5' 
              : 'bg-slate-100/50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-500">
                  Etapa 03 • Bloqueada
                </span>
                <h4 className={`text-base sm:text-lg font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700'}`}>
                  Módulo 03: PCR no APH e Desfibrilação com DEA
                </h4>
              </div>
              <span className="text-xs text-slate-400">Requer Módulos 01 e 02</span>
            </div>
          </div>

        </div>

    </div>
  );
};
