import { useState } from 'react';
import { Maximize2, RotateCcw, ShieldCheck, Activity } from 'lucide-react';
import type { BleedingFocus } from '../../data/simulator/types';
import { stopTheBleedCharacterById } from '../../data/simulator/stop-the-bleed/characters';

const base = `${import.meta.env.BASE_URL}simulador/personagens/stop-the-bleed/`;

export function StopTheBleedScene({ characterId, focus }: { characterId: string; focus: BleedingFocus }) {
  const match = characterId.match(/\d+/);
  const caseNum = match ? parseInt(match[0], 10) : 1;
  const character = stopTheBleedCharacterById[characterId];
  const [iframeKey, setIframeKey] = useState(0);

  const iframeSrc = `${base}simulador-geral.html?caso=${caseNum}&embed=1`;
  const fullSimulatorUrl = `${base}simulador-geral.html?caso=${caseNum}`;

  return (
    <div className="space-y-3">
      {/* Cabeçalho da Simulação */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
            Simulador Stop the Bleed
          </span>
          <span className="text-xs text-slate-300 font-medium">
            · {character?.context || 'Cenário'} · {character?.name || focus.title || `Caso #${caseNum}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIframeKey(k => k + 1)}
            title="Reiniciar Simulação Interativa"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reiniciar Cena
          </button>
          <a
            href={fullSimulatorUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir Simulador em Tela Cheia com ferramentas de precisão"
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/80 hover:bg-emerald-800 px-3 py-1.5 text-xs font-bold text-emerald-300 shadow-md transition-colors"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            Tela Cheia ↗
          </a>
        </div>
      </div>

      {/* Janela do Simulador Real em Canvas (com física de sangramento arterial e feridas calibradas) */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/15 bg-slate-950 shadow-2xl">
        <iframe
          key={`${caseNum}-${iframeKey}`}
          src={iframeSrc}
          title={`Simulador Clínico - Caso ${caseNum}`}
          className="h-full w-full border-0"
          allow="autoplay"
        />
      </div>

      {/* Barra de orientações e ações clínicas */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-2.5 text-xs text-slate-300">
        <span className="flex items-center gap-2 font-medium">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          Ferimento anatômico hiper-realista com dinâmica de perda volêmica ativa.
        </span>
        <span className="text-[11px] text-slate-400">
          Ações na cena: <strong>Torniquete</strong>, <strong>Preencher (Packing)</strong>, <strong>Enfaixar</strong> e <strong>Comprimir</strong>.
        </span>
      </div>
    </div>
  );
}
