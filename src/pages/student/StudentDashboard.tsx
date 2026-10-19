import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PlayCircle, CheckCircle, Clock, 
  ArrowRight, ShieldCheck, Compass, Stethoscope
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const StudentDashboard: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto w-full">
        
        {/* Saudação e Contexto da Jornada Blended */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Olá, Dr. Lucas Arantes
            </h1>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Trilha ativa: <strong className="text-uniao-400">Atendimento Pré-Hospitalar (APH) & Controle de Hemorragias</strong>
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-uniao-500/10 border border-uniao-500/30 text-uniao-400">
            <ShieldCheck className="w-4 h-4 text-uniao-400" />
            <span>Etapa Online em Andamento</span>
          </div>
        </div>

        {/* Card de Alerta do Modelo: Pré-Requisito Presencial */}
        <div className="rounded-2xl p-4 sm:p-5 border flex items-center gap-4 bg-gradient-to-r from-uniao-950/60 to-slate-900/60 border-uniao-500/30 text-white">
          <div className="w-10 h-10 rounded-xl bg-uniao-500/20 text-uniao-400 flex items-center justify-center shrink-0 border border-uniao-500/30">
            <Stethoscope className="w-5 h-5 text-uniao-400" />
          </div>
          <div className="text-xs space-y-0.5">
            <strong className="text-white block text-sm">Regra da Turma: Pré-Requisito para o Simulado Presencial</strong>
            <p className="text-slate-300">
              Conclua as videoaulas, provas e o simulador clínico online para ter a presença presencial autorizada pelo instrutor.
            </p>
          </div>
        </div>

        {/* REQUISITO CENTRAL: CARD PRINCIPAL DE MÁXIMO DESTAQUE — "CONTINUE SUA JORNADA" */}
        <div className="rounded-3xl bg-gradient-to-r from-uniao-950 via-slate-900 to-slate-900 text-white p-6 sm:p-10 shadow-2xl border border-uniao-500/30 relative overflow-hidden">
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
                Módulo 01 — Fundamentos do APH
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Aula 02 — Avaliação e Segurança da Cena
              </h2>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-light">
              Videoaula completa + Apostila em PDF + 5 Questões objetivas com correção instantânea e comentários do instrutor.
            </p>

            {/* Barra de Progresso do Curso */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-slate-300 font-medium">
                <span>Progresso das etapas online</span>
                <span className="text-uniao-400 font-bold">40% concluído</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-uniao-500 to-teal-300 h-2.5 rounded-full transition-all duration-500" style={{ width: '40%' }} />
              </div>
            </div>

            {/* Ações */}
            <div className="pt-3 flex flex-wrap gap-3">
              <Link
                to="/aluno/aula/aph-mod1-aula2"
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
            <div className="text-2xl font-black">4 / 12</div>
            <div className="text-[11px] text-uniao-400 font-medium">1 em andamento</div>
          </div>

          <div className={`p-5 rounded-2xl border shadow-sm space-y-1 ${
            theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'
          }`}>
            <span className="text-xs font-semibold text-slate-400">Questões Respondidas</span>
            <div className="text-2xl font-black">20 / 20</div>
            <div className="text-[11px] text-emerald-400 font-medium">95% de aproveitamento</div>
          </div>

          <div className={`p-5 rounded-2xl border shadow-sm space-y-1 ${
            theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'
          }`}>
            <span className="text-xs font-semibold text-slate-400">Simulador Clínico</span>
            <div className="text-2xl font-black text-uniao-400">Disponível</div>
            <div className="text-[11px] text-slate-400">Caso 01: Hemorragias</div>
          </div>

          <div className={`p-5 rounded-2xl border shadow-sm space-y-1 ${
            theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'
          }`}>
            <span className="text-xs font-semibold text-slate-400">Prática Presencial</span>
            <div className="text-2xl font-black text-amber-400">Pendente</div>
            <div className="text-[11px] text-slate-400">Libera após simulador</div>
          </div>
        </div>

        {/* Trilha Resumida do Módulo Atual */}
        <div className={`rounded-3xl border p-6 sm:p-8 space-y-6 shadow-sm ${
          theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">
                Módulo 1: Fundamentos e Avaliação Inicial
              </h3>
              <p className="text-xs text-slate-400">
                4 aulas • Videoaula + Apostila PDF + 5 Questões por aula
              </p>
            </div>
            <span className="text-xs font-bold text-uniao-400 bg-uniao-500/10 px-3 py-1 rounded-full border border-uniao-500/30">
              Módulo Ativo
            </span>
          </div>

          <div className="space-y-3">
            
            {/* Aula 1 - Concluída */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
              theme === 'dark' ? 'bg-slate-950/60 border-white/5' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">
                    Aula 01 — Introdução ao Atendimento Pré-Hospitalar
                  </h4>
                  <p className="text-xs text-slate-500">Concluída • 5/5 questões corretas</p>
                </div>
              </div>
              <Link
                to="/aluno/aula/aph-mod1-aula1"
                className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5"
              >
                Revisar
              </Link>
            </div>

            {/* Aula 2 - Em andamento */}
            <div className="p-4 rounded-2xl border-2 border-uniao-500 bg-uniao-950/20 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-uniao-500 text-slate-950 flex items-center justify-center shrink-0 font-black">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold">
                      Aula 02 — Avaliação e Segurança da Cena
                    </h4>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-uniao-500/20 text-uniao-300 border border-uniao-500/40">
                      EM ANDAMENTO
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Vídeo 12 min • Apostila • 5 Questões pendentes</p>
                </div>
              </div>
              <Link
                to="/aluno/aula/aph-mod1-aula2"
                className="text-xs font-bold text-slate-950 bg-gradient-to-r from-uniao-400 to-teal-300 px-4 py-2 rounded-xl shadow"
              >
                Continuar
              </Link>
            </div>

            {/* Aula 3 - Bloqueada */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 opacity-60 ${
              theme === 'dark' ? 'bg-slate-950/30 border-white/5' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-400">
                    Aula 03 — Protocolo X-A-B-C-D-E no Trauma
                  </h4>
                  <p className="text-xs text-slate-500">Libera após conclusão da Aula 02</p>
                </div>
              </div>
              <span className="text-xs text-slate-500 font-medium">Bloqueada</span>
            </div>

          </div>

        </div>

    </div>
  );
};
