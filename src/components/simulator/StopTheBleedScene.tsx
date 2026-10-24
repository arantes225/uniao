import { useEffect, useState } from 'react';
import { Info, Search, X } from 'lucide-react';
import type { BleedingFocus } from '../../data/simulator/types';
import { stopTheBleedCharacterById } from '../../data/simulator/stop-the-bleed/characters';

const base = `${import.meta.env.BASE_URL}simulador/personagens/stop-the-bleed/`;

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

export function StopTheBleedScene({ characterId, focus }: { characterId: string; focus: BleedingFocus }) {
  const [open, setOpen] = useState(false);
  const character = stopTheBleedCharacterById[characterId];
  const mask = `${base}masks/${focus.mask || character?.mask || focus.kind}.svg`;

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  if (!character) return null;

  const hotspot = (
    <button
      type="button"
      aria-label={`Abrir detalhe: ${focus.title}`}
      onClick={() => setOpen(true)}
      className="group absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      style={{ left: `${focus.x}%`, top: `${focus.y}%`, width: `${focus.size}%`, height: `${focus.size}%` }}
    >
      <span className="absolute inset-0 rounded-full border-2 border-red-100 bg-red-600/45 shadow-[0_0_24px_rgba(239,68,68,0.65)]" />
      <span className="absolute inset-[-18%] animate-ping rounded-full border border-red-300/80" />
      <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/85 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        <Search className="h-3 w-3" aria-hidden="true" />
      </span>
    </button>
  );

  return <>
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 px-1">
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-300"><Info className="h-4 w-4" aria-hidden="true" /> Clique na máscara de corte para ampliar</span>
        <span className="text-[11px] text-slate-400">{character.context} · {character.name}</span>
      </div>
      <div className="relative aspect-[1672/941] overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl">
        <img src={`${base}${character.file}`} alt={`${character.name}, cenário de ${character.context}`} className="absolute inset-0 h-full w-full object-cover" />
        <img src={mask} alt="Máscara educativa da lesão" className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_0_18px_rgba(248,113,113,0.55)]" style={{ left: `${focus.x}%`, top: `${focus.y}%`, width: `${Math.max(focus.size * 2.4, 16)}%`, height: `${Math.max(focus.size * 2.4, 16)}%` }} />
        {hotspot}
        <div className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-slate-950/80 px-3 py-1 text-[11px] font-semibold text-slate-100">Lesão marcada para leitura visual</div>
      </div>
    </div>

    {open && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setOpen(false); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="stb-focus-title" className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-white/15 bg-slate-900 p-5 text-white shadow-2xl sm:p-7">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-300">Máscara de corte · foco ampliado</p><h2 id="stb-focus-title" className="mt-1 text-xl font-black sm:text-2xl">{focus.title}</h2></div>
          <button type="button" aria-label="Fechar detalhe da lesão" onClick={() => setOpen(false)} className="rounded-xl border border-white/10 p-2 text-slate-300 hover:bg-white/10 hover:text-white"><X className="h-5 w-5" aria-hidden="true" /></button>
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
            <div className="absolute inset-0 bg-cover" style={{ backgroundImage: `url(${base}${character.file})`, backgroundPosition: `${focus.x}% ${focus.y}%`, backgroundSize: '300% auto' }} />
            <img src={mask} alt="Máscara ampliada da lesão" className="absolute left-1/2 top-1/2 h-44 w-56 -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_0_22px_rgba(248,113,113,0.7)]" />
            <div className="absolute inset-0 ring-1 ring-inset ring-red-300/60" />
            <span className="absolute bottom-3 left-3 rounded-full bg-slate-950/85 px-3 py-1 text-[11px] font-bold text-slate-200">Máscara sobre a área clicada</span>
          </div>
          <div className="space-y-4">
            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${kindColors[focus.kind]}`}>{kindLabels[focus.kind]}</span>
            <div><h3 className="text-xs font-black uppercase tracking-wider text-slate-400">O que observar</h3><p className="mt-1 text-sm leading-relaxed text-slate-200">{focus.appearance}</p></div>
            <div className="rounded-2xl border border-red-400/30 bg-red-950/30 p-4"><h3 className="text-xs font-black uppercase tracking-wider text-red-200">Próxima ação</h3><p className="mt-1 text-sm leading-relaxed text-red-50">{focus.action}</p></div>
            <p className="text-[11px] leading-relaxed text-slate-400">A máscara é uma camada educativa para reconhecer o padrão do sangramento. Siga o treinamento oficial e acione o serviço de emergência local.</p>
          </div>
        </div>
      </section>
    </div>}
  </>;
}
