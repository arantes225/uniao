import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PlayCircle, CheckCircle, Clock, 
  ArrowRight, ShieldCheck, Compass, LogOut
} from 'lucide-react';
import { supabase } from '../../services/supabase/client';

export const StudentDashboard: React.FC = () => {

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Top Header do Aluno */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/aluno/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-uniao-50 border border-uniao-200 flex items-center justify-center p-1">
                <img src="/brand/logo-uniao.png" alt="USM" className="w-full h-full object-contain" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 hidden sm:inline">
                UNIÃO <span className="text-uniao-600 font-semibold text-xs tracking-wider uppercase">LMS</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-800">Aluno Matriculado</div>
              <div className="text-[11px] text-slate-500">Turma: Escola Estadual — Out/2026</div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Encerrar sessão"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Student Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Saudação e Contexto */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Bem-vindo de volta!
            </h1>
            <p className="text-sm text-slate-600">
              Curso ativo: <strong className="text-uniao-800">Atendimento Pré-Hospitalar & Controle de Hemorragias</strong>
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-uniao-50 border border-uniao-200 text-xs font-semibold text-uniao-700">
            <ShieldCheck className="w-4 h-4 text-uniao-600" />
            <span>Matrícula Verificada e Ativa</span>
          </div>
        </div>

        {/* REQUISITO CENTRAL (Seção 9.2 do Prompt Mestre):
            CARD PRINCIPAL DE MÁXIMO DESTAQUE — "CONTINUE SUA JORNADA" */}
        <div className="rounded-3xl bg-gradient-to-r from-uniao-900 via-uniao-800 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-uniao-700/50 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 pointer-events-none">
            <img src="/brand/logo-uniao.png" alt="USM" className="w-96 h-96 object-contain" />
          </div>

          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-uniao-500/20 text-uniao-300 border border-uniao-500/40">
              <Compass className="w-3.5 h-3.5" />
              <span>Próxima atividade da sua trilha</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Módulo 01 — Fundamentos do APH
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Aula 02 — Avaliação e Segurança da Cena
              </h2>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Aprenda a reconhecer riscos ambientais, biossegurança da equipe socorrista e a dinâmica da ocorrência antes de iniciar o contato com a vítima.
            </p>

            {/* Barra de Progresso do Curso */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-slate-300 font-medium">
                <span>Progresso geral do curso</span>
                <span>35% concluído</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div className="bg-uniao-400 h-2.5 rounded-full transition-all duration-500" style={{ width: '35%' }} />
              </div>
            </div>

            {/* BOTÃO PRINCIPAL: ENTRAR DIRETO NA AULA INTEGRADA */}
            <div className="pt-3">
              <Link
                to="/aluno/aula/aph-mod1-aula2"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-slate-900 bg-white hover:bg-uniao-50 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <PlayCircle className="w-5 h-5 text-uniao-600" />
                <span className="text-base">Continuar aula agora</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>

        {/* Indicadores Secundários (Seção 9.3 do Prompt Mestre) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500">Aulas Concluídas</span>
            <div className="text-2xl font-bold text-slate-900">4 / 12</div>
            <div className="text-[11px] text-uniao-700 font-medium">1 em andamento</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500">Questões Respondidas</span>
            <div className="text-2xl font-bold text-slate-900">20</div>
            <div className="text-[11px] text-emerald-600 font-medium">95% de aproveitamento</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500">Simulações Realizadas</span>
            <div className="text-2xl font-bold text-slate-900">1 caso</div>
            <div className="text-[11px] text-slate-500">Debriefing concluído</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold text-slate-500">Situação do Certificado</span>
            <div className="text-2xl font-bold text-slate-900">Em curso</div>
            <div className="text-[11px] text-slate-400">Requer prova final + presença</div>
          </div>
        </div>

        {/* Trilha Resumida do Módulo Atual */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Módulo 1: Fundamentos e Avaliação Inicial
              </h3>
              <p className="text-xs text-slate-500">
                4 aulas • Videoaula + Apostila PDF + 5 Questões por aula
              </p>
            </div>
            <span className="text-xs font-semibold text-uniao-700 bg-uniao-50 px-3 py-1 rounded-full border border-uniao-100">
              Módulo Ativo
            </span>
          </div>

          <div className="space-y-3">
            
            {/* Aula 1 - Concluída */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    Aula 01 — Introdução ao Atendimento Pré-Hospitalar
                  </h4>
                  <p className="text-xs text-slate-500">Concluída • 5/5 questões corretas</p>
                </div>
              </div>
              <Link
                to="/aluno/aula/aph-mod1-aula1"
                className="text-xs font-semibold text-slate-600 hover:text-uniao-700 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white"
              >
                Revisar
              </Link>
            </div>

            {/* Aula 2 - Em andamento */}
            <div className="p-4 rounded-xl border-2 border-uniao-500 bg-uniao-50/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-uniao-600 text-white flex items-center justify-center shrink-0">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">
                      Aula 02 — Avaliação e Segurança da Cena
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-uniao-100 text-uniao-800">
                      EM ANDAMENTO
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Vídeo 12 min • Apostila • 5 Questões pendentes</p>
                </div>
              </div>
              <Link
                to="/aluno/aula/aph-mod1-aula2"
                className="text-xs font-bold text-white bg-uniao-600 hover:bg-uniao-700 px-4 py-2 rounded-lg shadow-sm"
              >
                Continuar
              </Link>
            </div>

            {/* Aula 3 - Próxima */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-4 opacity-80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-700">
                    Aula 03 — Protocolo X-A-B-C-D-E no Trauma
                  </h4>
                  <p className="text-xs text-slate-400">Libera após conclusão da Aula 02</p>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-medium">Bloqueada</span>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
};
