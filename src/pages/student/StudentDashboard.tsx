import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { PlayCircle, CheckCircle, Clock, ArrowRight, ShieldCheck, Compass } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { INITIAL_40_MODULES } from '../../data/curriculumData';
import { StudentOutletContext } from '../../services/studentCurriculum';

export const StudentDashboard: React.FC = () => {
  const { theme } = useTheme();
  const { studentName, cohorts, activeCohortId, setActiveCohortId,
    curriculumLoading, curriculumError } = useOutletContext<StudentOutletContext>();
  const watched: string[] = (() => {
    try { return JSON.parse(localStorage.getItem('uniao:watched-lessons') || '[]'); }
    catch { return []; }
  })();
  const studentCohorts = cohorts.map(cohort => {
    const modules = INITIAL_40_MODULES.filter(mod => cohort.moduleIds.includes(mod.id));
    const nextLesson = modules.find(module => !watched.includes(module.code)) || modules[0];
    const completed = modules.filter(module => watched.includes(module.code)).length;
    return {
      id: cohort.id,
      name: cohort.name,
      cohortCode: cohort.name,
      modules,
      currentModule: nextLesson ? `${nextLesson.code} — ${nextLesson.title}` : 'Sem aulas liberadas',
      currentLesson: nextLesson?.title || 'Nenhuma aula disponível',
      lessonUrl: nextLesson ? `/aluno/aula/${nextLesson.code}` : '/aluno/dashboard',
      progress: modules.length ? Math.round(completed / modules.length * 100) : 0,
      daysRemaining: cohort.daysRemaining,
    };
  });
  const activeCohort = studentCohorts.find(cohort => cohort.id === activeCohortId) || studentCohorts[0];
  if (curriculumLoading) return <div className="p-8 text-sm text-slate-400">Carregando suas turmas e aulas...</div>;
  if (curriculumError) return <div role="alert" className="p-8 text-sm text-red-400">Falha ao carregar sua trilha: {curriculumError}</div>;
  if (!activeCohort) return <div className="p-8 text-sm text-slate-500">Nenhuma turma ativa com acesso disponível foi encontrada para sua conta.</div>;

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
                Olá, {studentName}
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
            <img src="./brand/simbolo-cruz-uniao.png" alt="USM" className="w-96 h-96 object-contain" />
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
              Videoaula completa + Apostila de leitura + 5 questões obrigatórias para responder.
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

        {/* Trilha real: apenas os módulos autorizados para a turma ativa. */}
        <section className="space-y-5">
          <div>
            <h3 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Trilha do Curso: Módulos & Aulas
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Conteúdo autorizado para {activeCohort.name}. O progresso é individual.
            </p>
          </div>
          {activeCohort.modules.length === 0 ? (
            <p className="text-sm text-amber-400">Esta turma ainda não tem aulas liberadas.</p>
          ) : activeCohort.modules.map((module, index) => {
            const completed = watched.includes(module.code);
            return (
              <article key={module.code} className={`rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between ${theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${completed ? 'bg-emerald-500/15 text-emerald-400' : 'bg-teal-500/15 text-teal-400'}`}>
                    {completed ? <CheckCircle className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-teal-500">Etapa {String(index + 1).padStart(2, '0')} · {module.code}</span>
                    <h4 className={`font-bold text-sm sm:text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{module.title}</h4>
                    <p className="text-xs text-slate-500">{completed ? 'Videoaula visualizada' : 'Videoaula, apostila e questões'}</p>
                  </div>
                </div>
                <Link to={`/aluno/aula/${module.code}`} className="px-4 py-2 rounded-xl text-xs font-bold bg-uniao-600 text-white text-center hover:bg-uniao-500 shrink-0">
                  {completed ? 'Revisar aula' : 'Iniciar aula'}
                </Link>
              </article>
            );
          })}
        </section>

    </div>
  );
};

