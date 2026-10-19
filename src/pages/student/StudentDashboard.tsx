import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlayCircle, CheckCircle, Clock, 
  ArrowRight, ShieldCheck, Compass, Stethoscope
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

        {/* Card de Alerta do Modelo: Pré-Requisito Presencial */}
        <div className={`rounded-2xl p-4 sm:p-5 border flex items-center gap-4 ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-uniao-950/60 to-slate-900/60 border-uniao-500/30 text-white'
            : 'bg-gradient-to-r from-teal-50 to-slate-50 border-teal-200/90 text-slate-800 shadow-xs'
        }`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
            theme === 'dark'
              ? 'bg-uniao-500/20 text-uniao-400 border-uniao-500/30'
              : 'bg-white text-teal-600 border-teal-200 shadow-xs'
          }`}>
            <Stethoscope className="w-5 h-5" />
          </div>
          <div className="text-xs space-y-0.5">
            <strong className={`block text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-950 font-bold'}`}>
              Regra da Turma: Pré-Requisito para o Simulado Presencial
            </strong>
            <p className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>
              Conclua as videoaulas, provas e o simulador clínico online para ter a presença presencial autorizada pelo instrutor.
            </p>
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
              Videoaula completa + Apostila em PDF + 5 Questões objetivas com correção instantânea e comentários do instrutor.
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
                to="/aluno/simulador"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition-all"
              >
                <Stethoscope className="w-4 h-4 text-uniao-400" />
                <span>Abrir Simulador Online</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Indicadores Secundários */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-5 rounded-2xl border shadow-sm space-y-1 ${
            theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'
          }`}>
            <span className="text-xs font-semibold text-slate-400">Aulas Concluídas</span>
            <div className="text-2xl font-black">{activeCohort.lessonsCompleted} / {activeCohort.totalLessons}</div>
            <div className="text-[11px] text-uniao-400 font-medium">1 em andamento</div>
          </div>

          <div className={`p-5 rounded-2xl border shadow-sm space-y-1 ${
            theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'
          }`}>
            <span className="text-xs font-semibold text-slate-400">Questões Respondidas</span>
            <div className="text-2xl font-black">20 / 20</div>
            <div className="text-[11px] text-emerald-400 font-medium">{activeCohort.score}% de aproveitamento</div>
          </div>

          <div className={`p-5 rounded-2xl border shadow-sm space-y-1 ${
            theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'
          }`}>
            <span className="text-xs font-semibold text-slate-400">Simulador Clínico</span>
            <div className="text-2xl font-black text-uniao-400">{activeCohort.simReady ? 'Disponível' : 'Bloqueado'}</div>
            <div className="text-[11px] text-slate-400">Casos Clínicos Reais</div>
          </div>

          <div className={`p-5 rounded-2xl border shadow-sm space-y-1 ${
            theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'
          }`}>
            <span className="text-xs font-semibold text-slate-400">Prática Presencial</span>
            <div className={`text-2xl font-black ${activeCohort.practicalReady ? 'text-emerald-400' : 'text-amber-400'}`}>
              {activeCohort.practicalReady ? 'Autorizada' : 'Pendente'}
            </div>
            <div className="text-[11px] text-slate-400">{activeCohort.practicalReady ? 'Presença confirmada' : 'Libera após simulador'}</div>
          </div>
        </div>

        {/* Trilha Resumida do Módulo Atual */}
        <div className={`rounded-3xl border p-6 sm:p-8 space-y-6 shadow-sm ${
          theme === 'dark' 
            ? 'bg-slate-900 border-white/10' 
            : 'bg-white border-slate-200/90 shadow-slate-100'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Módulo 1: Fundamentos e Avaliação Inicial
              </h3>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                4 aulas • Videoaula + Apostila PDF + 5 Questões por aula
              </p>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
              theme === 'dark'
                ? 'text-uniao-400 bg-uniao-500/10 border-uniao-500/30'
                : 'text-teal-800 bg-teal-50 border-teal-200'
            }`}>
              Módulo Ativo
            </span>
          </div>

          <div className="space-y-3">
            
            {/* Aula 1 - Concluída */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
              theme === 'dark' ? 'bg-slate-950/60 border-white/5' : 'bg-slate-50/80 border-slate-200/80'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Aula 01 — Introdução ao Atendimento Pré-Hospitalar
                  </h4>
                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
                    Concluída • 5/5 questões corretas
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

            {/* Aula 2 - Em andamento */}
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
                    <h4 className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-950'}`}>
                      Aula 02 — Avaliação e Segurança da Cena
                    </h4>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                      theme === 'dark'
                        ? 'bg-uniao-500/20 text-uniao-300 border-uniao-500/40'
                        : 'bg-teal-100 text-teal-800 border-teal-300'
                    }`}>
                      EM ANDAMENTO
                    </span>
                  </div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    Vídeo 12 min • Apostila • 5 Questões pendentes
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

            {/* Aula 3 - Bloqueada */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 opacity-75 ${
              theme === 'dark' ? 'bg-slate-950/30 border-white/5' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  theme === 'dark' ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-400'
                }`}>
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-sm font-semibold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    Aula 03 — Protocolo X-A-B-C-D-E no Trauma
                  </h4>
                  <p className="text-xs text-slate-400">Libera após conclusão da Aula 02</p>
                </div>
              </div>
              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                Bloqueada
              </span>
            </div>

          </div>

        </div>

    </div>
  );
};
