import { useState } from 'react';

type Pose = 'sentada' | 'deitada';

const schoolPatients = [
  {
    id: 'professora',
    label: 'Professora',
    detail: 'Equipe pedagógica',
    color: 'teal',
    poses: {
      sentada: '/simulador/personagens/escola-v20261022-realista/professora-sentada.png',
      deitada: '/simulador/personagens/escola-v20261022-realista/professora-deitada.png'
    }
  },
  {
    id: 'zelador',
    label: 'Zelador',
    detail: 'Equipe de apoio',
    color: 'amber',
    poses: {
      sentada: '/simulador/personagens/escola-v20261022-realista/zelador-sentado.png',
      deitada: '/simulador/personagens/escola-v20261022-realista/zelador-deitado.png'
    }
  },
  {
    id: 'menina',
    label: 'Criança menina',
    detail: 'Idade escolar',
    color: 'violet',
    poses: {
      sentada: '/simulador/personagens/escola-v20261022-realista/crianca-menina-sentada.png',
      deitada: '/simulador/personagens/escola-v20261022-realista/crianca-menina-deitada.png'
    }
  },
  {
    id: 'menino',
    label: 'Criança menino',
    detail: 'Idade escolar',
    color: 'blue',
    poses: {
      sentada: '/simulador/personagens/escola-v20261022-realista/crianca-menino-sentado.png',
      deitada: '/simulador/personagens/escola-v20261022-realista/crianca-menino-deitado.png'
    }
  },
  {
    id: 'bebe',
    label: 'Bebê',
    detail: 'Lactente',
    color: 'rose',
    poses: {
      sentada: '/simulador/personagens/escola-v20261022-realista/bebe-sentado.png',
      deitada: '/simulador/personagens/escola-v20261022-realista/bebe-deitado.png'
    }
  }
] as const;

const dotClass: Record<typeof schoolPatients[number]['color'], string> = {
  teal: 'bg-teal-400',
  amber: 'bg-amber-400',
  violet: 'bg-violet-400',
  blue: 'bg-blue-400',
  rose: 'bg-rose-400'
};

export function SchoolPatientGallery() {
  const [selectedId, setSelectedId] = useState('professora');
  const [pose, setPose] = useState<Pose>('sentada');
  const selected = schoolPatients.find(patient => patient.id === selectedId) ?? schoolPatients[0];

  return (
    <section aria-labelledby="school-patients-heading" className="mt-8 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Ambiente escolar</p>
          <h3 id="school-patients-heading" className="text-lg font-bold">Pacientes do simulador</h3>
          <p className="mt-1 text-sm opacity-70">Cinco perfis realistas, com expressão neutra ou levemente triste, em posição sentada e deitada.</p>
        </div>
        <div className="rounded-full border border-emerald-600/30 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          10 variações
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5" role="group" aria-label="Paciente escolar">
          {schoolPatients.map(patient => {
            const active = selected.id === patient.id;
            return (
              <button
                key={patient.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedId(patient.id)}
                className={`rounded-xl border p-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 ${
                  active
                    ? 'border-emerald-600 bg-emerald-700 text-white'
                    : 'border-slate-300 bg-white hover:border-emerald-500 dark:border-slate-700 dark:bg-slate-900'
                }`}
              >
                <span className={`mb-2 block h-2.5 w-2.5 rounded-full ${active ? 'bg-white' : dotClass[patient.color]}`} aria-hidden="true" />
                <span className="block text-sm font-bold">{patient.label}</span>
                <span className="mt-1 block text-xs opacity-75">{patient.detail}</span>
              </button>
            );
          })}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-300/30 bg-slate-950 shadow-xl">
          <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 p-3">
            <img
              key={`${selected.id}-${pose}`}
              src={selected.poses[pose]}
              alt={`${selected.label}, posição ${pose}`}
              className="h-full w-full object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.35)]"
            />
          </div>
          <div className="space-y-3 border-t border-white/10 p-4 text-white">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Paciente selecionado</p>
              <p className="mt-1 text-base font-bold">{selected.label}</p>
              <p className="text-xs text-slate-400">{selected.detail}</p>
            </div>
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="Posição do paciente">
              {(['sentada', 'deitada'] as Pose[]).map(option => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={pose === option}
                  onClick={() => setPose(option)}
                  className={`rounded-lg border px-3 py-2 text-xs font-bold capitalize transition-colors ${
                    pose === option
                      ? 'border-emerald-400 bg-emerald-500 text-slate-950'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
