export type StopTheBleedCharacter = {
  id: string;
  name: string;
  context: 'Rua' | 'Clube de tiro';
  patientSex?: 'F' | 'M';
  patientAgeRange?: string;
  file: string;
  focus: { x: number; y: number; size: number };
  mask: 'arterial' | 'venous' | 'junctional' | 'controlled';
};

import { stopTheBleedCaseMetadata } from './caseMetadata';

const baseStopTheBleedCharacters: StopTheBleedCharacter[] = [
  { id: 'stb-caso-1', name: 'Caso 01 · Estande de Tiro (PAF) - Estande de Tiro · Disparo Acidental (ABDOME)', context: 'Clube de tiro', file: 'casos/Imagem do ChatGPT 24 de out. de 2026, 15_20_00.png', focus: { x: 43, y: 59, size: 11 }, mask: 'venous' },
  { id: 'stb-caso-2', name: 'Caso 02 · Estande de Tiro (PAF) - Estande de Tiro · Disparo Acidental (COXA)', context: 'Clube de tiro', file: 'casos/Imagem do ChatGPT 24 de out. de 2026, 15_20_15.png', focus: { x: 59, y: 67, size: 11 }, mask: 'arterial' },
  { id: 'stb-caso-3', name: 'Caso 03 · Trauma Urbano - Cena Urbana · Acidente Lacerante (AXILA / JUNÇÃO)', context: 'Rua', file: 'casos/Imagem do ChatGPT 24 de out. de 2026, 15_20_46.png', focus: { x: 35, y: 44, size: 11 }, mask: 'junctional' },
  { id: 'stb-caso-4', name: 'Caso 04 · Estande de Tiro (PAF) - Estande de Tiro · Disparo Acidental (PERNA)', context: 'Clube de tiro', file: 'casos/Imagem do ChatGPT 24 de out. de 2026, 15_20_54.png', focus: { x: 69, y: 64, size: 11 }, mask: 'arterial' },
  { id: 'stb-caso-5', name: 'Caso 05 · Trauma Urbano - Estande de Tiro · Disparo Acidental (BRAÇO)', context: 'Rua', file: 'casos/Imagem do ChatGPT 24 de out. de 2026, 15_21_11.png', focus: { x: 33, y: 41, size: 11 }, mask: 'arterial' },
  { id: 'stb-caso-6', name: 'Caso 06 · Trauma Urbano - Cena Urbana · Ferimento Contuso (COXA)', context: 'Rua', file: 'casos/Imagem do ChatGPT 24 de out. de 2026, 15_21_17.png', focus: { x: 60, y: 32, size: 11 }, mask: 'arterial' },
  { id: 'stb-caso-7', name: 'Caso 07 · Trauma Urbano - Cena Urbana · Trauma Penetrante (PEITO / TÓRAX)', context: 'Rua', file: 'casos/Imagem do ChatGPT 24 de out. de 2026, 15_21_28.png', focus: { x: 69, y: 44, size: 11 }, mask: 'venous' },
  { id: 'stb-caso-8', name: 'Caso 08 · Trauma Urbano - Cena Urbana · Acidente Lacerante (ANTEBRAÇO)', context: 'Rua', file: 'casos/Imagem do ChatGPT 24 de out. de 2026, 15_21_35.png', focus: { x: 67, y: 69, size: 11 }, mask: 'arterial' },
  { id: 'stb-caso-9', name: 'Caso 09 · Estande de Tiro (PAF) - Cena Urbana · Trauma Penetrante (ABDOME)', context: 'Clube de tiro', file: 'casos/Imagem do ChatGPT 24 de out. de 2026, 15_21_42.png', focus: { x: 52, y: 54, size: 11 }, mask: 'venous' },
  { id: 'stb-caso-10', name: 'Caso 10 · Estande de Tiro (PAF) - Cena Urbana · Acidente Traumático (PERNA)', context: 'Clube de tiro', file: 'casos/Imagem do ChatGPT 24 de out. de 2026, 15_22_00.png', focus: { x: 68, y: 74, size: 11 }, mask: 'arterial' },
  { id: 'stb-caso-11', name: 'Caso 11 · Trauma Urbano - Estande de Tiro · Disparo / Ferimento (ROSTO / TESTA)', context: 'Rua', file: 'casos/Imagem do ChatGPT 24 de out. de 2026, 15_22_07.png', focus: { x: 43, y: 13, size: 11 }, mask: 'venous' },
  { id: 'stb-caso-12', name: 'Caso 12 · Trauma Urbano - Cena Urbana · Trauma Penetrante (PEITO / TÓRAX SUPERIOR)', context: 'Rua', file: 'casos/Imagem do ChatGPT 24 de out. de 2026, 15_22_14.png', focus: { x: 51, y: 43, size: 11 }, mask: 'venous' },
  { id: 'stb-caso-13', name: 'Caso 13 · Estande de Tiro (PAF) - Cena Urbana · Trauma Penetrante (ABDOME)', context: 'Clube de tiro', file: 'casos/Imagem do ChatGPT 24 de out. de 2026, 15_22_21.png', focus: { x: 43, y: 61, size: 11 }, mask: 'venous' },
  { id: 'stb-caso-14', name: 'Caso 14 · Trauma Urbano - Cena Urbana · Trauma Penetrante (ABDOME / EPIGÁSTRIO)', context: 'Rua', file: 'casos/Imagem do ChatGPT 24 de out. de 2026, 15_22_27.png', focus: { x: 53, y: 45, size: 11 }, mask: 'venous' },
  { id: 'stb-caso-15', name: 'Caso 15 · Estande de Tiro (PAF) - Cena Urbana · Acidente Lacerante (PUNHO / ANTEBRAÇO)', context: 'Clube de tiro', file: 'casos/Imagem do ChatGPT 24 de out. de 2026, 15_22_34.png', focus: { x: 77, y: 86, size: 11 }, mask: 'arterial' },
  { id: 'stb-caso-16', name: 'Caso 16 · Trauma Urbano - Cena Urbana · Acidente Lacerante (PERNA)', context: 'Rua', file: 'casos/Imagem do ChatGPT 24 de out. de 2026, 15_23_47.png', focus: { x: 68, y: 77, size: 11 }, mask: 'arterial' },
  { id: 'stb-caso-17', name: 'Caso 17 · Trauma Urbano - Cena Urbana · Ferimento Lacerante (ANTEBRAÇO)', context: 'Rua', file: 'casos/Imagem do ChatGPT 24 de out. de 2026, 15_23_57.png', focus: { x: 70, y: 75, size: 11 }, mask: 'arterial' },
  { id: 'stb-caso-18', name: 'Caso 18 · Trauma Urbano - Cena Urbana · Trauma Penetrante (BRAÇO)', context: 'Rua', file: 'casos/Imagem do ChatGPT 24 de out. de 2026, 15_24_05.png', focus: { x: 68, y: 55, size: 11 }, mask: 'arterial' },
  { id: 'stb-caso-19', name: 'Caso 19 · Estande de Tiro (PAF) - Cena Urbana · Trauma Penetrante (ROSTO / PESCOÇO LATERAL)', context: 'Clube de tiro', file: 'casos/Imagem do ChatGPT 24 de out. de 2026, 15_24_13.png', focus: { x: 47, y: 23, size: 11 }, mask: 'venous' },
  { id: 'stb-caso-20', name: 'Caso 20 · Estande de Tiro (PAF) - Cena Urbana · Trauma Penetrante (COXA)', context: 'Clube de tiro', file: 'casos/Imagem do ChatGPT 24 de out. de 2026, 15_24_20.png', focus: { x: 52, y: 62, size: 11 }, mask: 'arterial' },
  { id: 'stb-caso-21', name: 'Caso 21 · Estande de Tiro (PAF) - Cena Urbana · Trauma Penetrante (PERNA)', context: 'Clube de tiro', file: 'casos/Imagem do ChatGPT 24 de out. de 2026, 15_24_27.png', focus: { x: 62, y: 69, size: 11 }, mask: 'arterial' },
  { id: 'stb-caso-22', name: 'Caso 22 · Trauma Urbano - Cena Urbana · Ferimento Lacerante (ANTEBRAÇO)', context: 'Rua', file: 'casos/Imagem do ChatGPT 24 de out. de 2026, 15_24_34.png', focus: { x: 61, y: 60, size: 11 }, mask: 'arterial' },
  { id: 'stb-caso-23', name: 'Caso 23 · Trauma Urbano - Cena Urbana · Trauma Penetrante (BRAÇO)', context: 'Rua', file: 'casos/Imagem do ChatGPT 24 de out. de 2026, 15_24_43.png', focus: { x: 66, y: 64, size: 11 }, mask: 'arterial' },
  { id: 'stb-caso-24', name: 'Caso 24 · Trauma Urbano - Cena Urbana · Acidente Traumático (PERNA / TORNOZELO)', context: 'Rua', file: 'casos/Imagem do ChatGPT 24 de out. de 2026, 15_24_49.png', focus: { x: 73, y: 78, size: 11 }, mask: 'arterial' },
  { id: 'stb-caso-25', name: 'Caso 25 · Estande de Tiro (PAF) - Cena Urbana · Acidente Lacerante (ANTEBRAÇO)', context: 'Clube de tiro', file: 'casos/Imagem do ChatGPT 24 de out. de 2026, 15_24_55.png', focus: { x: 33, y: 68, size: 11 }, mask: 'arterial' },
  { id: 'stb-caso-26', name: 'Caso 26 · Estande de Tiro (PAF) - Cena Urbana · Trauma Penetrante (COXA)', context: 'Clube de tiro', file: 'casos/Imagem do ChatGPT 24 de out. de 2026, 15_25_02.png', focus: { x: 52, y: 62, size: 11 }, mask: 'arterial' },
  { id: 'stb-caso-27', name: 'Caso 27 · Estande de Tiro (PAF) - Cena Urbana · Trauma Penetrante (ABDOME)', context: 'Clube de tiro', file: 'casos/Imagem do ChatGPT 24 de out. de 2026, 15_25_08.png', focus: { x: 47, y: 65, size: 11 }, mask: 'venous' },
];

export const stopTheBleedCharacters: StopTheBleedCharacter[] = [
  ...baseStopTheBleedCharacters.map((character) => {
    const caseId = Number(character.id.replace(/\D/g, ''));
    const metadata = stopTheBleedCaseMetadata[caseId];
    return metadata
      ? { ...character, name: `${metadata.titulo} - ${metadata.subtitulo}`, context: (metadata.isStandDeTiro ? 'Clube de tiro' : 'Rua') as 'Rua' | 'Clube de tiro', patientSex: metadata.patientSex, patientAgeRange: metadata.patientAgeRange }
      : character;
  }),
  ...Array.from({ length: 53 }, (_, index) => {
    const number = index + 28;
    const base = baseStopTheBleedCharacters[index % baseStopTheBleedCharacters.length];
    return {
      ...base,
      id: `stb-caso-${number}`,
      name: `Caso ${String(number).padStart(2, '0')} · ${number % 2 === 0 ? 'Estande de Tiro (PAF)' : 'Trauma Urbano'} · Variação de treino ${base.name.slice(base.name.lastIndexOf('('))}`,
      focus: { x: 28 + ((number * 17) % 46), y: 25 + ((number * 13) % 48), size: 11 }
    };
  })
];

export const stopTheBleedCharacterById = Object.fromEntries(
  stopTheBleedCharacters.map(character => [character.id, character])
) as Record<string, StopTheBleedCharacter>;

