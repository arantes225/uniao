import { useState } from 'react';
import { ExternalLink, ShieldAlert, CheckCircle2, AlertTriangle, Play } from 'lucide-react';
import { stopTheBleedCharacters } from '../../data/simulator/stop-the-bleed/characters';

const base = `${import.meta.env.BASE_URL}simulador/personagens/stop-the-bleed/`;

export function StopTheBleedGallery({ onSelectCase }: { onSelectCase?: (index: number) => void }) {
  const [filter, setFilter] = useState<'todos' | 'extremidade' | 'tronco' | 'rosto' | 'juncao'>('todos');

  const filteredCharacters = stopTheBleedCharacters.filter(c => {
    const isJuncao = c.mask === 'junctional';
    const isTronco = c.name.toLowerCase().includes('peito') || c.name.toLowerCase().includes('tórax') || c.name.toLowerCase().includes('abdome');
    const isRosto = c.name.toLowerCase().includes('rosto') || c.name.toLowerCase().includes('pescoço');
    const isExtremidade = !isJuncao && !isTronco && !isRosto;

    if (filter === 'extremidade') return isExtremidade;
    if (filter === 'tronco') return isTronco;
    if (filter === 'rosto') return isRosto;
    if (filter === 'juncao') return isJuncao;
    return true;
  });

  return (
    <section aria-labelledby="stb-gallery-heading" className="mt-8 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/80 p-5 backdrop-blur-md">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Ambiente Stop the Bleed</span>
          <h3 id="stb-gallery-heading" className="text-xl font-bold text-white">Galeria dos 27 Cenários Clínicos</h3>
          <p className="mt-1 text-sm text-slate-300">
            Casos fotográficos reais de estande de tiro e trauma urbano para treino de hemostasia rápida.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href={`${base}simulador-geral.html`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-950 transition-all"
          >
            <Play className="h-4 w-4" />
            Simulador 3D Interativo Completo
            <ExternalLink className="h-3.5 w-3.5 opacity-80" />
          </a>
          <a
            href={`${base}auditoria-tq.html`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-purple-500/40 bg-purple-950/70 hover:bg-purple-900/80 px-4 py-2 text-xs font-bold text-purple-200 transition-all"
          >
            <AlertTriangle className="h-4 w-4" />
            Auditoria de Torniquetes
            <ExternalLink className="h-3.5 w-3.5 opacity-80" />
          </a>
          <a
            href={`${base}todos.html`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-bold text-slate-200 transition-all"
          >
            Mosaico 27 Vítimas
            <ExternalLink className="h-3.5 w-3.5 opacity-80" />
          </a>
        </div>
      </div>

      {/* Filtros de anatomia */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtro anatômico">
        <button
          type="button"
          onClick={() => setFilter('todos')}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${filter === 'todos' ? 'bg-red-600 text-white' : 'border border-white/10 bg-slate-900/60 text-slate-300 hover:bg-white/5'}`}
        >
          Todos (27 casos)
        </button>
        <button
          type="button"
          onClick={() => setFilter('extremidade')}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${filter === 'extremidade' ? 'bg-emerald-600 text-white' : 'border border-white/10 bg-slate-900/60 text-slate-300 hover:bg-white/5'}`}
        >
          Extremidades (17 - Torniquete Indicado)
        </button>
        <button
          type="button"
          onClick={() => setFilter('tronco')}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${filter === 'tronco' ? 'bg-purple-600 text-white' : 'border border-white/10 bg-slate-900/60 text-slate-300 hover:bg-white/5'}`}
        >
          Tórax & Abdome (7 - Selo / Compressão)
        </button>
        <button
          type="button"
          onClick={() => setFilter('rosto')}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${filter === 'rosto' ? 'bg-rose-600 text-white' : 'border border-white/10 bg-slate-900/60 text-slate-300 hover:bg-white/5'}`}
        >
          Rosto & Cervical (2 - Compressão Direta)
        </button>
        <button
          type="button"
          onClick={() => setFilter('juncao')}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${filter === 'juncao' ? 'bg-amber-600 text-white' : 'border border-white/10 bg-slate-900/60 text-slate-300 hover:bg-white/5'}`}
        >
          Axila (1 - Wound Packing)
        </button>
      </div>

      {/* Grid com os 27 personagens */}
      <div className="grid gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredCharacters.map((c, i) => {
          const isJuncao = c.mask === 'junctional';
          const isTronco = c.name.toLowerCase().includes('peito') || c.name.toLowerCase().includes('tórax') || c.name.toLowerCase().includes('abdome');
          const isRosto = c.name.toLowerCase().includes('rosto') || c.name.toLowerCase().includes('pescoço');
          const isExtremidade = !isJuncao && !isTronco && !isRosto;

          return (
            <div
              key={c.id}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 shadow-md transition-all hover:border-red-500/50 hover:shadow-xl"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                <img
                  src={`${base}${c.file}`}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  {isExtremidade && (
                    <span className="flex items-center gap-1 rounded-md bg-emerald-950/90 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-200">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" /> TQ Indicado
                    </span>
                  )}
                  {isTronco && (
                    <span className="flex items-center gap-1 rounded-md bg-purple-950/90 border border-purple-500/40 px-2 py-0.5 text-[10px] font-bold text-purple-200">
                      <ShieldAlert className="h-3 w-3 text-purple-400" /> Tronco (Sem TQ)
                    </span>
                  )}
                  {isRosto && (
                    <span className="flex items-center gap-1 rounded-md bg-rose-950/90 border border-rose-500/40 px-2 py-0.5 text-[10px] font-bold text-rose-200">
                      <AlertTriangle className="h-3 w-3 text-rose-400" /> Face (Sem TQ)
                    </span>
                  )}
                  {isJuncao && (
                    <span className="flex items-center gap-1 rounded-md bg-amber-950/90 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-200">
                      <AlertTriangle className="h-3 w-3 text-amber-400" /> Packing
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <span>{c.context}</span>
                  <span>Foco: ({c.focus.x}%, {c.focus.y}%)</span>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-2">{c.name}</h4>
                {onSelectCase && (
                  <button
                    type="button"
                    onClick={() => onSelectCase(i)}
                    className="mt-2 w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-1.5 text-center text-xs font-bold text-slate-200 transition-colors"
                  >
                    Iniciar Caso →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
