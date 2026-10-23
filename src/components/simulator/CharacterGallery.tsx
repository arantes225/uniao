import { useState } from 'react';
import { AnimatedPatient, characters } from './AnimatedPatient';
export function CharacterGallery() {
  const [selected, setSelected] = useState(characters[0].id);
  const [paused, setPaused] = useState(false);
  return <section aria-labelledby="characters-heading" className="mt-8 space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h3 id="characters-heading" className="text-lg font-bold">Personagens da academia</h3>
        <p className="mt-1 text-sm opacity-70">Quatro personagens, nas posições sentada e deitada.</p></div>
      <button type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)} className="rounded-lg border border-emerald-600 px-4 py-2 text-sm font-semibold">
        {paused ? 'Retomar movimentos' : 'Pausar movimentos'}
      </button>
    </div>
    <div className="flex flex-wrap gap-2" role="group" aria-label="Personagem e posição">
      {characters.map(character => <button key={character.id} type="button" aria-pressed={character.id === selected} onClick={() => setSelected(character.id)}
        className={`rounded-lg border px-3 py-2 text-sm transition-colors ${selected === character.id ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-slate-400/40 hover:border-emerald-600'}`}>
        {character.name}
      </button>)}
    </div>
    <AnimatedPatient characterId={selected} paused={paused} />
  </section>;
}
