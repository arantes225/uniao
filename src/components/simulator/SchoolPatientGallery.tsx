import { type CSSProperties, useState } from 'react';

type Pose = 'sentada' | 'deitada';
type MotionRegion = { x: number; y: number; rx: number; ry: number };
type EyeRegion = { left: { x: number; y: number }; right: { x: number; y: number }; rx: number; ry: number };
type PatientPose = { open: string; closed: string; chest: MotionRegion; eyes: EyeRegion };

const schoolPatients = [
  {
    id: 'professora',
    label: 'Professora',
    detail: 'Equipe pedagógica',
    color: 'teal',
    poses: {
      sentada: {
        open: '/simulador/personagens/escola-horizontal-v20261023/professora-sentada.png',
        closed: '/simulador/personagens/escola-horizontal-v20261023/blink/professora-sentada-olhos-fechados.png',
        chest: { x: 49, y: 48, rx: 12, ry: 10 }, eyes: { left: { x: 48.7, y: 25.4 }, right: { x: 51.7, y: 25.7 }, rx: 2.5, ry: 2.4 }
      },
      deitada: {
        open: '/simulador/personagens/escola-horizontal-v20261023/professora-deitada.png',
        closed: '/simulador/personagens/escola-horizontal-v20261023/blink/professora-deitada-olhos-fechados.png',
        chest: { x: 47, y: 40, rx: 14, ry: 9 }, eyes: { left: { x: 42.5, y: 21.8 }, right: { x: 45.5, y: 20 }, rx: 2.6, ry: 2.5 }
      }
    }
  },
  {
    id: 'zelador',
    label: 'Zelador',
    detail: 'Equipe de apoio',
    color: 'amber',
    poses: {
      sentada: {
        open: '/simulador/personagens/escola-horizontal-v20261023/zelador-sentado.png',
        closed: '/simulador/personagens/escola-horizontal-v20261023/blink/zelador-sentado-olhos-fechados.png',
        chest: { x: 49, y: 43, rx: 13, ry: 10 }, eyes: { left: { x: 46.3, y: 21 }, right: { x: 49, y: 20.7 }, rx: 2.5, ry: 2.5 }
      },
      deitada: {
        open: '/simulador/personagens/escola-horizontal-v20261023/zelador-deitado.png',
        closed: '/simulador/personagens/escola-horizontal-v20261023/blink/zelador-deitado-olhos-fechados.png',
        chest: { x: 49, y: 41, rx: 14, ry: 9 }, eyes: { left: { x: 44.2, y: 22.8 }, right: { x: 47.1, y: 21.8 }, rx: 3.5, ry: 3.2 }
      }
    }
  },
  {
    id: 'menina',
    label: 'Criança menina',
    detail: 'Idade escolar',
    color: 'violet',
    poses: {
      sentada: {
        open: '/simulador/personagens/escola-horizontal-v20261023/crianca-menina-sentada.png',
        closed: '/simulador/personagens/escola-horizontal-v20261023/blink/crianca-menina-sentada-olhos-fechados.png',
        chest: { x: 50, y: 48, rx: 10, ry: 9 }, eyes: { left: { x: 48.3, y: 29.6 }, right: { x: 52, y: 29 }, rx: 2.5, ry: 2.5 }
      },
      deitada: {
        open: '/simulador/personagens/escola-horizontal-v20261023/crianca-menina-deitada.png',
        closed: '/simulador/personagens/escola-horizontal-v20261023/blink/crianca-menina-deitada-olhos-fechados.png',
        chest: { x: 50, y: 49, rx: 12, ry: 8 }, eyes: { left: { x: 45.9, y: 38.4 }, right: { x: 49.1, y: 36.5 }, rx: 2.6, ry: 2.6 }
      }
    }
  },
  {
    id: 'menino',
    label: 'Criança menino',
    detail: 'Idade escolar',
    color: 'blue',
    poses: {
      sentada: {
        open: '/simulador/personagens/escola-horizontal-v20261023/crianca-menino-sentado.png',
        closed: '/simulador/personagens/escola-horizontal-v20261023/blink/crianca-menino-sentado-olhos-fechados.png',
        chest: { x: 49, y: 49, rx: 11, ry: 9 }, eyes: { left: { x: 48.7, y: 32.1 }, right: { x: 52.1, y: 32.4 }, rx: 2.5, ry: 2.4 }
      },
      deitada: {
        open: '/simulador/personagens/escola-horizontal-v20261023/crianca-menino-deitado.png',
        closed: '/simulador/personagens/escola-horizontal-v20261023/blink/crianca-menino-deitado-olhos-fechados.png',
        chest: { x: 46, y: 49, rx: 14, ry: 9 }, eyes: { left: { x: 39.9, y: 33.8 }, right: { x: 42.8, y: 32.3 }, rx: 2.6, ry: 2.5 }
      }
    }
  },
  {
    id: 'bebe',
    label: 'Bebê',
    detail: 'Lactente',
    color: 'rose',
    poses: {
      sentada: {
        open: '/simulador/personagens/escola-horizontal-v20261023/bebe-sentado.png',
        closed: '/simulador/personagens/escola-horizontal-v20261023/blink/bebe-sentado-olhos-fechados.png',
        chest: { x: 50, y: 52, rx: 11, ry: 10 }, eyes: { left: { x: 45.4, y: 30.1 }, right: { x: 50, y: 29.2 }, rx: 2.9, ry: 2.7 }
      },
      deitada: {
        open: '/simulador/personagens/escola-horizontal-v20261023/bebe-deitado.png',
        closed: '/simulador/personagens/escola-horizontal-v20261023/blink/bebe-deitado-olhos-fechados.png',
        chest: { x: 50, y: 58, rx: 14, ry: 9 }, eyes: { left: { x: 44.3, y: 41.4 }, right: { x: 47.5, y: 39.8 }, rx: 2.9, ry: 2.7 }
      }
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

function AnimatedPatientPhoto({
  pose,
  label,
  delay,
}: {
  pose: PatientPose;
  label: string;
  delay: number;
}) {
  const style = {
    '--school-patient-blink-delay': `${delay}s`,
    '--school-chest-x': `${pose.chest.x}%`, '--school-chest-y': `${pose.chest.y}%`,
    '--school-chest-rx': `${pose.chest.rx}%`, '--school-chest-ry': `${pose.chest.ry}%`,
    '--school-eye-left-x': `${pose.eyes.left.x}%`, '--school-eye-left-y': `${pose.eyes.left.y}%`,
    '--school-eye-right-x': `${pose.eyes.right.x}%`, '--school-eye-right-y': `${pose.eyes.right.y}%`,
    '--school-eye-rx': `${pose.eyes.rx}%`, '--school-eye-ry': `${pose.eyes.ry}%`
  } as CSSProperties;

  return (
    <div
      className="school-patient-photo"
      data-animation="respiracao-e-piscar"
      data-patient="individual"
      style={style}
    >
      <img
        src={pose.open}
        alt={`${label}, animação individual de respiração`}
        className="school-patient-photo__image school-patient-photo__image--base"
      />
      <img src={pose.open} alt="" aria-hidden="true" className="school-patient-photo__image school-patient-photo__image--chest" />
      <img
        src={pose.closed}
        alt=""
        aria-hidden="true"
        className="school-patient-photo__image school-patient-photo__image--closed"
      />
    </div>
  );
}

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
        <a
          href="/uniao/simulador/personagens/escola-horizontal-v20261023/todos.html"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-emerald-600/40 px-3 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300"
        >
          Abrir todos em HTML ↗
        </a>
      </div>

      <div className="space-y-4">
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

        <article className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-300/30 bg-slate-950 shadow-xl" data-patient-card={selected.id}>
          <div className="aspect-[1672/941] bg-slate-950">
            <AnimatedPatientPhoto
              key={`${selected.id}-${pose}`}
              pose={selected.poses[pose]}
              label={`${selected.label}, posição ${pose}`}
              delay={schoolPatients.findIndex(patient => patient.id === selected.id) * 0.65}
            />
          </div>
          <div className="space-y-3 border-t border-white/10 p-4 text-white">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Paciente selecionado</p>
              <p className="mt-1 text-base font-bold">{selected.label}</p>
              <p className="text-xs text-slate-400">{selected.detail}</p>
              <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-emerald-300">
                <span className="school-patient-breath-dot" aria-hidden="true" />
                Respiração visível e piscar natural
              </p>
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
            <a
              href={selected.poses[pose].open.replace(/\.png$/, '.html')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-lg border border-emerald-400/50 px-3 py-2 text-xs font-bold text-emerald-200 hover:bg-emerald-400/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
            >
              Abrir este paciente em HTML ↗
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
