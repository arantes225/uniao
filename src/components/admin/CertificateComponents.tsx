import React, { useEffect, useRef, useState } from 'react';

export interface CertificateSignatory {
  id: string;
  name: string;
  role: string;
  registration: string;
  isInstructor: boolean;
  isTechnicalDirector: boolean;
  enabled: boolean;
  signaturePath: string | null;
}

export interface CertificateSignerPreset {
  instructorName: string;
  instructorRole: string;
  technicalDirector: string;
}

export const defaultCertificateSigners = (preset: CertificateSignerPreset): CertificateSignatory[] => {
  const directorName = preset.technicalDirector.split(/\s+-\s+/)[0].trim();
  const samePerson = directorName.toLocaleLowerCase('pt-BR') === preset.instructorName.trim().toLocaleLowerCase('pt-BR');
  return [
    {
      id: crypto.randomUUID(),
      name: preset.instructorName,
      role: preset.instructorRole,
      registration: '',
      isInstructor: true,
      isTechnicalDirector: samePerson,
      enabled: true,
      signaturePath: null,
    },
    ...(!samePerson ? [{
      id: crypto.randomUUID(),
      name: directorName,
      role: 'Direção técnica',
      registration: '',
      isInstructor: false,
      isTechnicalDirector: true,
      enabled: true,
      signaturePath: null,
    }] : []),
  ];
};

interface CertificateSignaturesProps {
  signers: CertificateSignatory[];
  imageUrls: Record<string, string>;
  compact?: boolean;
}

export const CertificateSignatures: React.FC<CertificateSignaturesProps> = ({ signers, imageUrls, compact = false }) => {
  // Nunca identificar pessoas somente por nome: cada cadastro tem seu próprio ID.
  const visible = signers.filter(person => person.enabled && person.name.trim());
  if (!visible.length) {
    return <div className="py-5 text-center text-xs text-amber-300">Nenhum responsável selecionado para assinar.</div>;
  }
  const columns = Math.min(visible.length, 4);
  return (
    <div className={`flex flex-wrap items-end justify-center gap-x-4 ${compact ? 'gap-y-2 py-2' : 'gap-y-3 py-3'}`}>
      {visible.map(person => {
        const title = [
          person.isInstructor && 'Instrutor',
          person.isTechnicalDirector && 'Diretor Técnico',
        ].filter(Boolean).join(' e ');
        return (
          <div key={person.id} className="min-w-0 max-w-[340px] text-center flex flex-col items-center justify-end" style={{ width: `calc(${100 / columns}% - ${(columns - 1) * 16 / columns}px)` }}>
            <div className={`flex w-full items-end justify-center ${compact ? 'h-9' : 'h-12'}`}>
              {person.signaturePath && imageUrls[person.id] ? (
                <img
                  src={imageUrls[person.id]}
                  alt={`Assinatura de ${person.name}`}
                  className="block max-w-full object-contain"
                  style={{ height: compact ? 34 : 46, maxWidth: compact ? 155 : 190 }}
                  crossOrigin="anonymous"
                />
              ) : null}
            </div>
            <div className="w-full max-w-52 border-b border-white/30" />
            <div className={`w-full mt-1 px-1 font-bold text-white break-words leading-tight ${compact ? 'text-[10px]' : 'text-xs'}`}>{person.name}</div>
            <div className={`w-full mt-0.5 px-1 text-slate-400 break-words leading-tight ${compact ? 'text-[8px]' : 'text-[10px]'}`}>{title}{person.role ? ` • ${person.role}` : ''}</div>
            {person.registration ? <div className={`text-teal-300 ${compact ? 'text-[8px]' : 'text-[10px]'}`}>{person.registration}</div> : null}
          </div>
        );
      })}
    </div>
  );
};

const PAGE_WIDTH = 1123;
const PAGE_HEIGHT = 794;

/** Escala o A4 completo sem alterar proporções, cortar assinatura ou depender do viewport. */
export const FittedCertificate: React.FC<{ children: React.ReactNode; zoom?: number }> = ({ children, zoom = 1 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [availableWidth, setAvailableWidth] = useState(0);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const update = () => setAvailableWidth(element.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const fitScale = Math.min(1, (availableWidth || PAGE_WIDTH) / PAGE_WIDTH);
  const scale = fitScale * zoom;
  const height = PAGE_HEIGHT * scale;
  return (
    <div ref={containerRef} className="w-full min-w-0 relative overflow-visible" style={{ height: `${height}px` }}>
      <div
        className="absolute top-0"
        style={{
          left: `calc(50% - ${PAGE_WIDTH * scale / 2}px)`,
          width: PAGE_WIDTH,
          height: PAGE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          visibility: availableWidth ? 'visible' : 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Usa o mesmo certificado visto na tela para impressão em A4 horizontal/Salvar como PDF. */
export const printCertificate = async (elementId: string) => {
  const source = document.getElementById(elementId);
  if (!source) return;
  const popup = window.open('', '_blank', 'width=1200,height=900');
  if (!popup) {
    window.alert('Permita a janela de impressão para salvar o certificado em PDF.');
    return;
  }
  const styles = Array.from(document.head.querySelectorAll('style,link[rel="stylesheet"]'))
    .map(style => style.outerHTML).join('\n');
  popup.document.open();
  popup.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8" /><base href="${document.baseURI}" /><title>Certificado - União Serviços Médicos</title>${styles}
    <style>
      @page { size: A4 landscape; margin: 0; }
      html, body { margin: 0; padding: 0; width: 297mm; height: 210mm; background: #020617; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      #print-root { width: 297mm; height: 210mm; overflow: hidden; }
      #print-root > * { width: 297mm !important; height: 210mm !important; max-width: none !important; aspect-ratio: auto !important; box-shadow: none !important; border-radius: 0 !important; }
    </style></head><body><div id="print-root">${source.outerHTML}</div></body></html>`);
  popup.document.close();
  await Promise.all(Array.from(popup.document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')).map(link =>
    link.sheet ? Promise.resolve() : new Promise<void>(resolve => {
      link.onload = () => resolve(); link.onerror = () => resolve();
    })
  ));
  await popup.document.fonts.ready;
  await Promise.all(Array.from(popup.document.images).map(img => img.complete
    ? Promise.resolve()
    : new Promise<void>(resolve => { img.onload = () => resolve(); img.onerror = () => resolve(); })));
  popup.focus();
  popup.print();
};
