import { AnimatedPatient } from './AnimatedPatient';
import { getSchoolPatient, SchoolPatientPhoto } from './SchoolPatientGallery';

export function ContextPatientScene({ characterId, patientKind, respiratoryRate }: {
  characterId: string;
  patientKind: 'academia' | 'escola';
  respiratoryRate?: number;
}) {
  if (patientKind === 'academia') {
    return <div className="space-y-2"><p className="px-1 text-xs font-bold uppercase tracking-wider text-teal-300">Personagem da academia · condição clínica sem ferimento externo</p><AnimatedPatient characterId={characterId} respiratoryRate={respiratoryRate} /></div>;
  }

  const selection = getSchoolPatient(characterId);
  const pose = selection?.patient.poses[selection.pose];
  if (!selection || !pose) return <p role="alert">Personagem escolar indisponível.</p>;
  return <figure className="space-y-2 overflow-hidden rounded-2xl border border-slate-300/30 bg-slate-950">
    <div className="relative aspect-[1672/941]"><SchoolPatientPhoto pose={pose} label={`${selection.patient.label}, posição ${selection.pose}`} delay={selection.index * 0.65} /></div>
    <figcaption className="px-4 py-2 text-xs text-slate-300">{selection.patient.label} · Personagem escolar · condição clínica sem ferimento externo</figcaption>
  </figure>;
}
