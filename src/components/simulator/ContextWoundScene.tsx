import { useEffect, useState } from 'react';
import { Info, Search, X } from 'lucide-react';
import { AnimatedPatient, characterAssets, characters } from './AnimatedPatient';
import { getSchoolPatient, SchoolPatientPhoto } from './SchoolPatientGallery';
import type { BleedingFocus } from '../../data/simulator/types';

const kindLabels: Record<BleedingFocus['kind'], string> = {
  arterial: 'Padrão arterial',
  venous: 'Padrão venoso',
  junctional: 'Região de junção',
  controlled: 'Sangramento controlado'
};

const kindColors: Record<BleedingFocus['kind'], string> = {
  arterial: 'border-red-400 bg-red-500/20 text-red-100',
  venous: 'border-rose-300 bg-rose-500/20 text-rose-100',
  junctional: 'border-orange-300 bg-orange-500/20 text-orange-100',
  controlled: 'border-emerald-300 bg-emerald-500/20 text-emerald-100'
};

function WoundMarker({ focus, centered = false }: { focus: BleedingFocus; centered?: boolean }) {
  const size = Math.max(8, focus.size * 1.35);
  return (
    <span aria-hidden="true" className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: centered ? '50%' : `${focus.x}%`, top: centered ? '50%' : `${focus.y}%`, width: `${size}%`, height: `${size}%` }}>
      {focus.kind === 'controlled' || focus.woundShape === 'controlled' ? (
        <span className="absolute inset-[12%] rotate-[-8deg] rounded-md border-2 border-emerald-100/90 bg-emerald-100/45 shadow-[0_0_18px_rgba(16,185,129,0.55)]" />
      ) : focus.woundShape === 'puncture' ? (
        <>
          <span className="absolute left-1/2 top-1/2 h-[44%] w-[44%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-red-100 bg-red-950/90 shadow-[0_0_18px_rgba(239,68,68,0.9)]" />
          <span className="absolute left-[55%] top-[72%] h-[35%] w-[10%] rounded-full bg-red-900/85" />
        </>
      ) : (
        <>
          <span className="absolute left-[10%] top-1/2 h-[13%] w-[80%] rotate-[-12deg] rounded-full border border-red-100/90 bg-gradient-to-r from-red-950 via-red-700 to-red-950 shadow-[0_0_18px_rgba(239,68,68,0.85)]" />
          <span className="absolute left-[54%] top-[58%] h-[42%] w-[9%] rounded-full bg-red-900/85" />
          <span className="absolute left-[69%] top-[55%] h-[26%] w-[6%] rounded-full bg-red-800/70" />
        </>
      )}
    </span>
  );
}

export function ContextWoundScene({ characterId, patientKind, respiratoryRate, focus }: {
  characterId: string;
  patientKind: 'academia' | 'escola';
  respiratoryRate?: number;
  focus: BleedingFocus;
}) {
  const [open, setOpen] = useState(false);
  const character = characters.find(item => item.id === characterId);
  const schoolSelection = patientKind === 'escola' ? getSchoolPatient(characterId) : null;
  const schoolPose = schoolSelection?.patient.poses[schoolSelection.pose];
  const patientImage = schoolPose?.open ?? (character ? `${characterAssets}${character.file}` : '');

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  if (!character && !schoolPose) return <p role="alert">Personagem de ambiente indisponível.</p>;

  const hotspot = (
    <>
      <WoundMarker focus={focus} />
      <button type="button" aria-label={`Abrir detalhe: ${focus.title}`} onClick={() => setOpen(true)} className="group absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-white" style={{ left: `${focus.x}%`, top: `${focus.y}%`, width: `${focus.size}%`, height: `${focus.size}%` }}>
        <span className={`absolute inset-0 rounded-full border-2 ${focus.kind === 'controlled' ? 'border-emerald-300 bg-emerald-500/20' : 'border-red-200/80 bg-red-600/10'} shadow-[0_0_24px_rgba(239,68,68,0.45)]`} />
        {focus.kind !== 'controlled' && <span className="absolute inset-[-12%] animate-ping rounded-full border border-red-300/70" />}
        <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/85 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"><Search className="h-3 w-3" aria-hidden="true" /></span>
      </button>
    </>
  );

  const patientView = schoolPose ? (
    <figure className="overflow-hidden rounded-2xl border border-slate-300/30 bg-slate-950">
      <div className="relative aspect-[1672/941]"><SchoolPatientPhoto pose={schoolPose} label={`${schoolSelection?.patient.label}, posição ${schoolSelection?.pose}`} delay={(schoolSelection?.index ?? 0) * 0.65} />{hotspot}</div>
      <figcaption className="px-4 py-2 text-xs text-slate-300">{schoolSelection?.patient.label} · Personagem escolar · ferimento em pele exposta</figcaption>
    </figure>
  ) : <AnimatedPatient characterId={characterId} respiratoryRate={respiratoryRate} overlay={hotspot} />;

  return <>
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 px-1"><span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-300"><Info className="h-4 w-4" aria-hidden="true" /> Clique no ferimento para ampliar</span><span className="text-[11px] text-slate-400">{patientKind === 'escola' ? 'Personagem escolar' : 'Personagem da academia'} · {focus.visibleRegion ?? 'pele exposta'}</span></div>
      {patientView}
    </div>

    {open && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setOpen(false); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="context-wound-title" className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/15 bg-slate-900 p-5 text-white shadow-2xl sm:p-7">
        <div className="mb-5 flex items-start justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-300">Ferimento visível ampliado</p><h2 id="context-wound-title" className="mt-1 text-xl font-black sm:text-2xl">{focus.title}</h2></div><button type="button" aria-label="Fechar detalhe do ferimento" onClick={() => setOpen(false)} className="rounded-xl border border-white/10 p-2 text-slate-300 hover:bg-white/10 hover:text-white"><X className="h-5 w-5" aria-hidden="true" /></button></div>
        <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-slate-950"><div className="absolute inset-0 bg-cover" style={{ backgroundImage: `url(${patientImage})`, backgroundPosition: `${focus.x}% ${focus.y}%`, backgroundSize: '300% auto' }} /><WoundMarker focus={focus} centered />{focus.kind !== 'controlled' && <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border-2 border-red-300/50" />}<span className="absolute bottom-3 left-3 rounded-full bg-slate-950/80 px-3 py-1 text-[11px] font-bold text-slate-200">Pele exposta · sem roupa cobrindo</span></div>
          <div className="space-y-4"><span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${kindColors[focus.kind]}`}>{kindLabels[focus.kind]}</span><div><h3 className="text-xs font-black uppercase tracking-wider text-slate-400">O que observar</h3><p className="mt-1 text-sm leading-relaxed text-slate-200">{focus.appearance}</p></div><div className="rounded-2xl border border-red-400/30 bg-red-950/30 p-4"><h3 className="text-xs font-black uppercase tracking-wider text-red-200">Próxima ação</h3><p className="mt-1 text-sm leading-relaxed text-red-50">{focus.action}</p></div><p className="text-[11px] leading-relaxed text-slate-400">O padrão visual do ferimento segue a lógica de reconhecimento do Stop the Bleed, mas este caso pertence exclusivamente ao ambiente {patientKind === 'escola' ? 'escolar' : 'da academia'}.</p></div>
        </div>
      </section>
    </div>}
  </>;
}
