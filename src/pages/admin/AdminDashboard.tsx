import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, School, 
  Upload, LogOut 
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  // Controle de Acesso por Dupla Camada (RBAC + PIN de Segurança, Seção 16 do Prompt Mestre)
  const [pinEntered, setPinEntered] = useState('');
  const [pinAuthorized, setPinAuthorized] = useState(false);
  const [pinError, setPinError] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Em produção validado via Edge Function com taxa de limite e salt seguro
    if (pinEntered === '1926') {
      setPinAuthorized(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  if (!pinAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">Confirmação de Segurança Administrativa</h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              O acesso aos módulos de gestão acadêmica e dados de alunos requer autenticação de segundo fator com PIN administrativo.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={6}
                value={pinEntered}
                onChange={(e) => setPinEntered(e.target.value)}
                placeholder="••••"
                className="w-36 text-center tracking-[0.5em] text-2xl font-mono py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-uniao-500"
              />
            </div>

            {pinError && (
              <div className="text-xs text-red-400 font-medium">
                PIN de segurança incorreto. Tente novamente.
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-white bg-uniao-600 hover:bg-uniao-500 text-sm transition-all shadow"
            >
              Validar Acesso Administrativo
            </button>
          </form>

          <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 block">
            ← Retornar ao site público
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-slate-900 text-white h-16 px-6 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white p-1">
            <img src="/brand/logo-uniao.png" alt="USM" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight">Painel de Gestão USM</span>
            <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-uniao-900 text-uniao-300 border border-uniao-700">
              Administrador Autorizado
            </span>
          </div>
        </div>

        <button
          onClick={() => setPinAuthorized(false)}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
        >
          <LogOut className="w-4 h-4" />
          <span>Bloquear Painel</span>
        </button>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto w-full p-6 sm:p-8 space-y-8">
        
        {/* KPI Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500">Total de Alunos</span>
            <div className="text-2xl font-bold text-slate-900">128</div>
            <div className="text-[11px] text-emerald-600 font-medium">100% com matrícula ativa</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500">Turmas em Andamento</span>
            <div className="text-2xl font-bold text-slate-900">6</div>
            <div className="text-[11px] text-uniao-700 font-medium">Escolas & Academias</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500">Cursos Ativos</span>
            <div className="text-2xl font-bold text-slate-900">4</div>
            <div className="text-[11px] text-slate-500">Módulos customizáveis</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500">Certificados Emitidos</span>
            <div className="text-2xl font-bold text-slate-900">42</div>
            <div className="text-[11px] text-emerald-600 font-medium">Com QR Code ativo</div>
          </div>
        </div>

        {/* Gestão Rápida: Importação em Lote & Criação de Turmas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card Importação em Lote (Seção 19.2 do Prompt Mestre) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-uniao-50 text-uniao-700 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Importação de Alunos em Lote</h3>
                <p className="text-xs text-slate-500">Importe planilhas CSV/XLSX com validação prévia</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              O fluxo de importação executa conferência de duplicidade, sanitização de CPF conforme a LGPD e disparo automático de convites com link seguro.
            </p>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center space-y-2 hover:border-uniao-400 transition-colors cursor-pointer bg-slate-50/50">
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-xs font-semibold text-slate-700">Clique para selecionar CSV ou XLSX</div>
              <div className="text-[11px] text-slate-400">Colunas esperadas: Nome Completo, CPF, E-mail</div>
            </div>
          </div>

          {/* Card Gestão de Turmas e Customização de Módulos (Seção 20 do Prompt Mestre) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-uniao-50 text-uniao-700 flex items-center justify-center">
                <School className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Montagem de Planos Customizados</h3>
                <p className="text-xs text-slate-500">Personalize a grade curricular de cada instituição</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Vincule módulos específicos para cada cliente (ex: Primeiros Socorros Pediátricos para Escolas; SBV + DEA para Academias) sem duplicar código.
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="font-semibold text-slate-800">Turma Escola Modelo (Lei Lucas)</span>
                  <div className="text-[11px] text-slate-500">3 módulos ativos • 24 alunos</div>
                </div>
                <button className="text-uniao-700 font-bold hover:underline">Configurar</button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="font-semibold text-slate-800">Turma CrossFit Arena (SBV + DEA)</span>
                  <div className="text-[11px] text-slate-500">2 módulos ativos • 15 alunos</div>
                </div>
                <button className="text-uniao-700 font-bold hover:underline">Configurar</button>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};
