import React from 'react';
import { BookOpen, FileDown, CheckCircle2, ExternalLink } from 'lucide-react';

export const MaterialsPage: React.FC = () => {
  const materials = [
    {
      id: 'mat-1',
      title: 'Apostila 01 — Fundamentos de Atendimento Pré-Hospitalar (APH)',
      module: 'Módulo 01: Fundamentos e Avaliação',
      pages: 24,
      size: '4.2 MB',
      studied: true,
      pdfUrl: '#'
    },
    {
      id: 'mat-2',
      title: 'Apostila 02 — Avaliação de Cena, Cinemática do Trauma e Biossegurança',
      module: 'Módulo 01: Fundamentos e Avaliação',
      pages: 18,
      size: '3.1 MB',
      studied: true,
      pdfUrl: '#'
    },
    {
      id: 'mat-3',
      title: 'Apostila 03 — Stop the Bleed: Protocolo Completo de Torniquetes e Hemostasia',
      module: 'Módulo 02: Controle de Hemorragias',
      pages: 32,
      size: '6.8 MB',
      studied: false,
      pdfUrl: '#'
    },
    {
      id: 'mat-4',
      title: 'Apostila 04 — Suporte Básico de Vida, RCP de Alta Qualidade e Uso do DEA',
      module: 'Módulo 03: Emergências Cardiovasculares',
      pages: 28,
      size: '5.5 MB',
      studied: false,
      pdfUrl: '#'
    }
  ];

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto w-full">
      <div className="space-y-1">
        <span className="text-xs font-bold text-uniao-400 uppercase tracking-wider">
          Biblioteca Acadêmica
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Materiais Didáticos & Apostilas (PDF)
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Apostilas digitais oficiais da União Serviços Médicos para estudo e consulta rápida.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {materials.map((mat) => (
          <div
            key={mat.id}
            className="rounded-3xl bg-slate-900 border border-white/10 p-6 flex flex-col justify-between space-y-4 hover:border-uniao-500/40 transition-all shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-uniao-500/10 text-uniao-400 flex items-center justify-center border border-uniao-500/30">
                  <BookOpen className="w-5 h-5" />
                </div>
                {mat.studied ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Estudado</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 text-slate-400">
                    Disponível
                  </span>
                )}
              </div>

              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                {mat.module}
              </span>
              <h3 className="text-base font-bold text-white mt-1">
                {mat.title}
              </h3>
              <div className="text-xs text-slate-400 mt-2">
                {mat.pages} páginas • Formato PDF • Tamanho: {mat.size}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button className="text-xs font-bold text-uniao-400 hover:text-uniao-300 flex items-center gap-1">
                <ExternalLink className="w-4 h-4" />
                <span>Ler no Navegador</span>
              </button>
              <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-uniao-400 hover:bg-uniao-300 transition-all shadow">
                <FileDown className="w-4 h-4" />
                <span>Baixar PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
