import React from 'react';
import { CertificateQR, certificateVerificationUrl } from '../admin/CertificateQR';
import { FittedCertificate, printCertificate } from '../admin/CertificateComponents';

export type IssuedCertificate = {
  id: string;
  title: string;
  workload_hours: number;
  issued_at: string;
  verification_code: string;
  revoked_at: string | null;
  student_name_snapshot: string;
  template_snapshot?: {
    instructor_name?: string | null;
    instructor_role?: string | null;
    technical_director?: string | null;
    legal_framework?: string | null;
    validity_months?: number | null;
    syllabus?: string | null;
  } | null;
};

/** Reproducible print view. The verification code is authoritative; this is not an ICP-Brasil signature. */
export const StudentCertificate: React.FC<{ certificate: IssuedCertificate; studentName: string }> = ({certificate,studentName}) => {
  const cert=certificate;
  const valid=!cert.revoked_at && /^USM-[A-F0-9]{32}$/.test(cert.verification_code);
  const verify=valid?certificateVerificationUrl(cert.verification_code):'';
  const issuedDate=new Date(cert.issued_at).toLocaleDateString('pt-BR');
  const snapshot=cert.template_snapshot||{};
  const printableId='student-certificate-'+cert.id;
  return <section className="space-y-3 rounded-2xl border border-slate-700 bg-slate-900 p-4 sm:p-6">
    <div className="flex flex-wrap justify-between items-center gap-3">
      <div>
        <h2 className="text-lg font-bold text-white">{cert.title}</h2>
        <p className="text-xs text-slate-300">Emitido em {issuedDate} · {cert.workload_hours} horas</p>
      </div>
      <button type="button" disabled={!valid || !studentName.trim()} onClick={()=>void printCertificate(printableId)}
        className="rounded-xl bg-teal-400 px-4 py-3 font-bold text-slate-950 text-sm disabled:opacity-40">
        Imprimir / Salvar PDF
      </button>
    </div>
    {cert.revoked_at && <p role="status" className="text-red-300">Certificado revogado. A impressão de um certificado válido está indisponível.</p>}
    <FittedCertificate>
      <article id={printableId}
        className="relative flex flex-col justify-between w-[1123px] h-[794px] bg-slate-950 text-white border-[12px] border-teal-500 p-12 font-sans overflow-hidden">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-teal-500/10 pointer-events-none" />
        <div className="text-center space-y-4 relative">
          <p className="text-xl font-black text-teal-400 tracking-[0.4em]">UNIÃO SERVIÇOS MÉDICOS</p>
          <p className="text-sm uppercase tracking-widest text-slate-400">Certificado de capacitação</p>
          <h2 className="text-3xl leading-tight font-extrabold mt-6">{cert.title}</h2>
        </div>
        <div className="text-center max-w-4xl mx-auto space-y-5 relative">
          <p className="text-sm text-slate-300">Certificamos que</p>
          <p className="text-3xl font-extrabold underline decoration-teal-400 underline-offset-8">{studentName || 'NOME NÃO DISPONÍVEL'}</p>
          <p className="text-lg leading-relaxed text-slate-200">
            concluiu a capacitação acima indicada, com carga horária de <strong>{cert.workload_hours} horas</strong>,
            conforme registros de presença, aproveitamento e conclusão mantidos pela União Serviços Médicos.
          </p>
          <p className="text-sm text-slate-300">Data de emissão: <strong>{issuedDate}</strong></p>
        </div>
        <div className="relative flex gap-6 items-end justify-between">
          <div className="flex-1 space-y-5">
            <div className="flex gap-10 text-sm">
              <div className="border-t border-slate-500 pt-2 min-w-[210px] text-center">
                <strong>{snapshot.instructor_name || 'Instrutor responsável'}</strong>
                <p className="text-xs text-slate-400">{snapshot.instructor_role || 'Instrutor'}</p>
              </div>
              <div className="border-t border-slate-500 pt-2 min-w-[210px] text-center">
                <strong>{snapshot.technical_director || 'Diretor técnico'}</strong>
                <p className="text-xs text-slate-400">Direção técnica</p>
              </div>
            </div>
            <p className="font-mono text-sm text-teal-300 break-all">Código: {cert.verification_code}</p>
            <p className="text-[11px] text-slate-400">Autenticidade verificável no portal. Este documento não contém assinatura digital ICP-Brasil.</p>
            {snapshot.legal_framework && <p className="text-[10px] text-slate-400 max-w-[690px]">{snapshot.legal_framework}</p>}
          </div>
          <div className="flex flex-col gap-1 items-center">
            <CertificateQR size={128} code={valid?cert.verification_code:null}/>
            {valid && <span className="text-[10px] font-semibold text-teal-300">Consulte o registro oficial</span>}
          </div>
        </div>
      </article>
    </FittedCertificate>
    {valid && <a href={verify} target="_blank" rel="noopener noreferrer" className="block text-sm text-teal-300 underline break-all">Abrir validação pública deste certificado</a>}
  </section>;
};
