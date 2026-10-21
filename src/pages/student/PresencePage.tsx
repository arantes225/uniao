import React, { useState } from 'react';
import { 
  CalendarCheck, CheckCircle2, AlertTriangle, 
  MapPin, Clock, ShieldCheck, KeyRound, ArrowRight, UserCheck
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const PresencePage: React.FC = () => {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  // Código digitado pelo aluno
  const [inputCode, setInputCode] = useState('');
  const [feedback, setFeedback] = useState<{
    status: 'idle' | 'success' | 'error';
    message: string;
    timestamp?: string;
  }>({
    status: 'idle',
    message: ''
  });

  // Turma simulada
  const activeTraining = {
    courseName: 'Atendimento Pré-Hospitalar (APH) & Suporte Básico de Vida',
    cohortName: 'Turma de Capacitação APH 2026',
    date: '24/10/2026 (Sábado) — 08h00 às 17h00',
    location: 'Centro de Treinamento USM — Base Central de Simulação Realística',
    instructor: 'Dr. Lucas Arantes (CRM-SP)',
    alreadyCheckedIn: false,
    checkedInAt: '24/10/2026 08:14',
  };

  const handleValidateCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputCode.trim().toUpperCase();

    if (!clean) {
      setFeedback({
        status: 'error',
        message: 'Por favor, digite o código de 6 dígitos fornecido pelo instrutor.'
      });
      return;
    }

    // Código válido configurado no admin ou código mestre de demonstração
    // Ex: USM-926 ou qualquer código com 6 caracteres ou 'PRESENCA26'
    const storedCode = localStorage.getItem('usm_presence_code_aph') || 'APH-2026';

    if (clean === storedCode.toUpperCase() || clean === 'PRESENCA' || clean === 'APH2026' || clean.length >= 6) {
      const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + ' de ' + new Date().toLocaleDateString('pt-BR');
      setFeedback({
        status: 'success',
        message: 'Presença confirmada e registrada com sucesso na estação prática!',
        timestamp: now
      });
      localStorage.setItem('usm_student_presence_validated', 'true');
    } else {
      setFeedback({
        status: 'error',
        message: 'Código de presença inválido ou expirado. Verifique com o instrutor em sala.'
      });
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-5xl mx-auto w-full">
      
      {/* Topo / Cabeçalho */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider">
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Frequência Oficial</span>
        </div>
        <h1 className={`text-2xl sm:text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          Validador de Presença Presencial
        </h1>
        <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
          Confirme sua participação na atividade prática presencial inserindo o código dinâmico gerado pelo instrutor em sala de aula.
        </p>
      </div>

      {/* Card da Sessão Prática */}
      <div className={`p-6 sm:p-8 rounded-3xl border ${
        dark ? 'bg-slate-900/90 border-white/10' : 'bg-white border-slate-200 shadow-sm'
      } space-y-6`}>
        
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 ${dark ? 'border-white/10' : 'border-slate-200'}`}>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-400">Atividade Agendada</span>
            <h2 className={`text-lg sm:text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {activeTraining.courseName}
            </h2>
            <p className={`text-xs mt-0.5 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{activeTraining.cohortName}</p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 font-mono text-xs">
            <Clock className="w-4 h-4 text-teal-400" />
            <span>{activeTraining.date}</span>
          </div>
        </div>

        {/* Detalhes do Local e Instrutor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className={`p-4 rounded-2xl border ${
            dark ? 'bg-slate-950/60 border-white/5 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          } flex items-start gap-3`}>
            <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <strong className={`block font-bold mb-0.5 ${dark ? 'text-white' : 'text-slate-900'}`}>Local do Treinamento:</strong>
              <span>{activeTraining.location}</span>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border ${
            dark ? 'bg-slate-950/60 border-white/5 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          } flex items-start gap-3`}>
            <UserCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <strong className={`block font-bold mb-0.5 ${dark ? 'text-white' : 'text-slate-900'}`}>Instrutor Responsável:</strong>
              <span>{activeTraining.instructor}</span>
            </div>
          </div>
        </div>

        {/* Caixa de Entrada do Código */}
        {feedback.status === 'success' ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 text-center space-y-3 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className={`text-lg font-black ${dark ? 'text-white' : 'text-slate-900'}`}>Presença Homologada com Sucesso!</h3>
            <p className="text-xs text-emerald-300 max-w-md mx-auto">
              {feedback.message}
            </p>
            <div className="text-[11px] font-mono text-slate-400 bg-slate-950/80 px-4 py-2 rounded-xl inline-block border border-white/10">
              Registrado às: <strong className="text-white">{feedback.timestamp}</strong>
            </div>
          </div>
        ) : (
          <form onSubmit={handleValidateCode} className="space-y-4 pt-2">
            <div className="max-w-md mx-auto space-y-2 text-center">
              <label className={`text-xs font-bold uppercase tracking-wider block ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                Insira o Código de Presença da Aula:
              </label>
              
              <div className="relative">
                <input
                  type="text"
                  maxLength={12}
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  placeholder="EX: APH-2026"
                  className={`w-full text-center text-2xl font-black font-mono tracking-[0.3em] uppercase py-3.5 px-4 rounded-2xl border-2 border-teal-500/40 focus:outline-none focus:border-teal-400 shadow-inner ${dark ? 'bg-slate-950 text-teal-300 placeholder:text-slate-600' : 'bg-slate-50 text-teal-700 placeholder:text-slate-400'}`}
                />
              </div>

              <p className="text-[11px] text-slate-400">
                O código é projetado pelo instrutor no projetor ou quadro durante a aula prática.
              </p>
            </div>

            {feedback.status === 'error' && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center justify-center gap-2 max-w-md mx-auto">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{feedback.message}</span>
              </div>
            )}

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-black text-slate-950 bg-gradient-to-r from-teal-400 to-emerald-300 hover:brightness-110 shadow-lg text-xs uppercase tracking-wider transition-all"
              >
                <KeyRound className="w-4 h-4 text-slate-950" />
                <span>Registrar Minha Presença</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </form>
        )}

      </div>

      {/* Regra de Requisito de Certificação */}
      <div className={`p-5 rounded-2xl border flex items-center gap-3 text-xs ${dark ? 'bg-slate-900/50 border-white/5 text-slate-400' : 'bg-white border-slate-200 text-slate-600'}`}>
        <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
        <div>
          <strong className={`block font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Critério Obrigatório para Concessão de Certificado:</strong>
          A presença na atividade presencial com simulação realística de alta fidelidade é pré-requisito indispensável para a liberação da via oficial do certificado digital.
        </div>
      </div>

    </div>
  );
};
