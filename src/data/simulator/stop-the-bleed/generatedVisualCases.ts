import { stopTheBleedCharacters } from './characters';
import type { CasoStopTheBleed } from './casosConfig';

const members: CasoStopTheBleed['membro'][] = ['coxa', 'perna', 'braco', 'antebraco', 'juncao', 'peito', 'abdome', 'rosto'];

function generatedVisualCase(number: number): CasoStopTheBleed {
  const character = stopTheBleedCharacters[(number - 1) % stopTheBleedCharacters.length];
  const membro = members[(number - 1) % members.length];
  const limb = ['coxa', 'perna', 'braco', 'antebraco'].includes(membro);
  const junction = membro === 'juncao';
  const trunk = ['peito', 'abdome'].includes(membro);
  const x = Math.max(120, Math.min(1000, 300 + ((number * 97) % 600)));
  const y = Math.max(100, Math.min(560, 170 + ((number * 53) % 330)));
  const titleMember = membro === 'juncao' ? 'JUNÇÃO' : membro.toUpperCase();
  return {
    id: number,
    file: character.file.replace(/^casos\//, ''),
    url: `casos/${character.file.replace(/^casos\//, '')}`,
    isStandDeTiro: number % 2 === 0,
    woundShape: number % 3 === 0 ? 'longitudinal' : 'round',
    membro,
    titulo: `Caso ${String(number).padStart(2, '0')} · ${number % 2 === 0 ? 'Estande de Tiro (PAF)' : 'Trauma Urbano'}`,
    subtitulo: `Treino fotográfico · lesão em ${titleMember}`,
    ferida: { x, y, raio: 5.2, raioY: 5.2, rotacao: (number % 11) * 0.08 - 0.4, escalaManual: 0.75 + ((number % 5) * 0.12) },
    tqSite: { x: Math.max(130, x - 90), y: Math.max(90, y - 35), angle: ((number % 12) - 6) * 0.2, widthManual: 80 + ((number % 6) * 10) },
    tqIndicado: limb,
    tqStatus: limb ? 'BEM_APLICADO' : junction ? 'CONTRAINDICADO_JUNCAO' : trunk ? `CONTRAINDICADO_${membro.toUpperCase()}` : 'CONTRAINDICADO_ROSTO',
    justificativaClinica: limb
      ? `Hemorragia grave em ${titleMember}. No simulador, o torniquete deve ser colocado proximalmente à lesão, fora de articulações, e apertado até cessar o fluxo.`
      : junction
        ? 'Lesão juncional: torniquete de membro não alcança a fonte. Exige pressão direta e packing somente por pessoa treinada, com evacuação urgente.'
        : 'Lesão de tronco ou face: torniquete de membro é ineficaz e não deve ser aplicado. Proteja a ferida, controle o sangramento externo possível e acione resgate.'
  };
}

export const generatedStopTheBleedVisualCases: CasoStopTheBleed[] = Array.from({ length: 53 }, (_, index) => generatedVisualCase(index + 28));
