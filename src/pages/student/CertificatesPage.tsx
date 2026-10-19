import React from 'react';
import { CheckCircle2, Download, ShieldCheck, Clock } from 'lucide-react';

export const CertificatesPage: React.FC = () => {
  const certificates = [
    {
      id: 'cert-aph-2026',
      title: 'Atendimento Pré-Hospitalar (APH) & Suporte Básico de Vida',
      cohort: 'Turma Presencial Outubro/2026',
      hours: 40,
      code: 'USM-APH-2026-X89A',
      issuedAt: '19/10/2026',
      status: 'ready',
    },
    {
      id: 'cert-stb-2026',
      title: 'Stop the Bleed — Controle Avançado de Hemorragias',
      cohort: 'Turma Corporativa',
      hours: 20,
      status: 'pending',
      requirement: 'Pendente: Simulado Prático Presencial (24/10/2026)'
    }
  ];

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto w-full">
      <div className="space-y-1">
        <span className="text-xs font-bold text-uniao-400 uppercase tracking-wider">
          Certificação Oficial
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Meus Certificados
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Certificados digitais autênticos emitidos com código identificador único e validação por QR Code.
        </p>
      </div>

      <div className="space-y-4">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className={`rounded-3xl border p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all ${
              cert.status === 'ready'
                ? 'bg-slate-900 border-emerald-500/30 shadow-xl'
                : 'bg-slate-900/50 border-white/5 opacity-80'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {cert.status === 'ready' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Certificado Emitido & Autenticado</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Requisitos Pendentes</span>
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{cert.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{cert.cohort} • Carga Horária: {cert.hours} horas</p>
              </div>

              {cert.status === 'ready' && (
                <div className="flex items-center gap-3 text-xs text-slate-300 font-mono">
                  <span className="bg-slate-950 px-3 py-1 rounded-lg border border-white/10">
                    Código: <strong className="text-uniao-400">{cert.code}</strong>
                  </span>
                  <span className="flex items-center gap-1 text-slate-400 font-sans">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Autenticidade Verificada</span>
                  </span>
                </div>
              )}

              {cert.status === 'pending' && (
                <div className="text-xs text-amber-300">
                  {cert.requirement}
                </div>
              )}
            </div>

            <div>
              {cert.status === 'ready' ? (
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-uniao-400 to-teal-300 hover:brightness-110 text-xs shadow">
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>Baixar Certificado em PDF</span>
                </button>
              ) : (
                <span className="text-xs text-slate-500 font-medium">Libera após o presencial</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
