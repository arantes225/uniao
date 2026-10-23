import { useEffect, useRef, useState } from 'react';
import characters from '../../data/simulator/characters.json';

export const characterAssets = `${import.meta.env.BASE_URL}simulador/personagens/academia-v20261022/`;
type Character = (typeof characters)[number];
type PatientOptions = { assetRoot?: string; rr?: number; amplitude?: number; eyes?: string; paused?: boolean };
type Patient = { set: (options: PatientOptions) => void; destroy: () => void };
declare global {
  interface Window {
    AcademiaPatient: new (canvas: HTMLCanvasElement, character: Character, options: PatientOptions) => Patient;
  }
}
let rendererPromise: Promise<void> | undefined;
function loadRenderer() {
  if (window.AcademiaPatient) return Promise.resolve();
  if (!rendererPromise) {
    rendererPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${characterAssets}academia-motion.js`;
      script.onload = () => resolve();
      script.onerror = () => { script.remove(); rendererPromise = undefined; reject(new Error('renderer')); };
      document.head.appendChild(script);
    });
  }
  return rendererPromise;
}

export function AnimatedPatient({ characterId, respiratoryRate = 17, paused = false }: {
  characterId: string; respiratoryRate?: number; paused?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const patientRef = useRef<Patient>();
  const latestOptions = useRef({ rr: respiratoryRate, paused });
  latestOptions.current = { rr: respiratoryRate, paused };
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  const character = characters.find(item => item.id === characterId);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !character) return;
    let disposed = false;
    let patient: Patient | undefined;
    setError(false);
    setLoading(true);
    canvas.width = 1672;
    canvas.height = 941;
    const fail = () => { if (!disposed) { setError(true); setLoading(false); } };
    canvas.addEventListener('patienterror', fail);
    const decode = (file: string) => new Promise<void>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve();
      image.onerror = reject;
      image.src = characterAssets + file;
    });
    Promise.all([loadRenderer(), decode(character.file), decode(character.closedFile)])
      .then(() => {
        if (disposed) return;
        patient = new window.AcademiaPatient(canvas, character, {
          assetRoot: characterAssets, amplitude: 1, eyes: 'auto', ...latestOptions.current,
        });
        patientRef.current = patient;
        setLoading(false);
      }).catch(fail);
    return () => {
      disposed = true;
      canvas.removeEventListener('patienterror', fail);
      patient?.destroy();
      if (patientRef.current === patient) patientRef.current = undefined;
    };
  }, [character, retry]);
  useEffect(() => { patientRef.current?.set({ rr: respiratoryRate, paused }); }, [respiratoryRate, paused]);
  if (!character) return <p role="alert">Personagem indisponível.</p>;
  return (
    <figure className="overflow-hidden rounded-2xl border border-slate-300/30 bg-slate-950">
      <div className="relative aspect-[1672/941]">
        <canvas ref={canvasRef} role="img" aria-label={`${character.name}, com piscada e respiração`} className="block h-full w-full" />
        {loading && <p role="status" className="absolute inset-0 flex items-center justify-center bg-slate-950 text-sm text-slate-200">Carregando personagem…</p>}
        {error && <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950 p-4 text-center text-white">
          <p>Não foi possível carregar o personagem.</p>
          <button type="button" onClick={() => setRetry(value => value + 1)} className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold">Tentar novamente</button>
        </div>}
      </div>
      <figcaption className="px-4 py-2 text-xs text-slate-300">{character.name} · Personagem de referência</figcaption>
    </figure>
  );
}
export { characters };
