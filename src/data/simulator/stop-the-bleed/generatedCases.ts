import type { BleedingFocus, SimulationCase, SimulationStep } from '../types';
import { SHARED_ACTIONS, sharedOptions, type SharedActionKey } from '../sharedActions';
import { stopTheBleedCharacters } from './characters';

const members = ['coxa', 'perna', 'braco', 'antebraco', 'juncao', 'peito', 'abdome', 'rosto'] as const;
type StbMember = (typeof members)[number];
const labels: Record<StbMember, string> = { coxa: 'coxa', perna: 'perna', braco: 'braço', antebraco: 'antebraço', juncao: 'junção axila/virilha', peito: 'tórax', abdome: 'abdome', rosto: 'face/cervical' };

function primaryFor(member: StbMember): SharedActionKey {
  if (['coxa', 'perna', 'braco', 'antebraco'].includes(member)) return 'tourniquet-limb';
  if (member === 'juncao') return 'packing-junction';
  return 'cover-trunk';
}

function distractorsFor(member: StbMember): SharedActionKey[] {
  if (['coxa', 'perna', 'braco', 'antebraco'].includes(member)) return ['do-not-elevate', 'do-not-wash-first', 'improvise-wire'];
  if (member === 'juncao') return ['do-not-tourniquet-trunk', 'do-not-use-powder', 'do-not-elevate'];
  return ['do-not-tourniquet-trunk', 'do-not-probe', 'do-not-use-powder'];
}

function focusFor(number: number, member: StbMember, phase = ''): BleedingFocus {
  const kind: BleedingFocus['kind'] = ['coxa', 'perna', 'braco', 'antebraco'].includes(member) ? 'arterial' : member === 'juncao' ? 'junctional' : 'venous';
  return {
    x: 28 + ((number * 17) % 46), y: 25 + ((number * 13) % 48), size: 10, kind,
    title: `Stop the Bleed · Caso ${String(number).padStart(2, '0')} · ${labels[member]}${phase}`,
    appearance: `Variação fotográfica de treino com foco em ${labels[member]}. Observe padrão do fluxo, roupas encharcadas, poça em expansão e sinais de choque; não decida pela cor do sangue isoladamente.`,
    action: SHARED_ACTIONS[primaryFor(member)].text,
    mask: kind
  };
}

function makeStep(id: number, phase: string, scenarioText: string, bleeding: string, focus: BleedingFocus, correct: SharedActionKey, distractors: SharedActionKey[]): SimulationStep {
  return {
    id, phase, scenarioText,
    vitalSigns: { consciousness: id === 1 ? 'Consciente, ansioso e orientado' : 'Pálido, orientado, sob observação', breathing: id === 1 ? '24 rpm' : '20 rpm', circulation: id === 1 ? 'Taquicárdico, pulso periférico fino' : 'Pulso palpável após contenção; reavaliar', bleeding },
    bleedingFocus: focus,
    options: sharedOptions(correct, distractors, focus.title)
  };
}

function makeGeneratedCase(number: number): SimulationCase {
  const member = members[(number - 1) % members.length];
  const primary = primaryFor(member);
  const firstFocus = focusFor(number, member);
  const secondCorrect: SharedActionKey = member === 'juncao' || primary === 'cover-trunk' ? 'continue-pressure' : 'pressure-dressing';
  const secondFocus = { ...focusFor(number, member, ' · manutenção'), kind: 'controlled' as const, action: SHARED_ACTIONS[secondCorrect].text };
  const thirdFocus = { ...focusFor(number, member, ' · transferência'), kind: 'controlled' as const, action: SHARED_ACTIONS['warm-monitor'].text };
  const character = stopTheBleedCharacters[(number - 1) % stopTheBleedCharacters.length];
  return {
    id: `stb-caso-${number}`,
    title: `Caso ${String(number).padStart(2, '0')} · ${number % 2 === 0 ? 'Estande de Tiro / PAF' : 'Trauma Urbano'} · ${labels[member]}`,
    description: `Variação fotográfica ${number} para treino de reconhecimento anatômico e escolha de ação no Stop the Bleed. Personagem-base: ${character.name}.`,
    characterId: `stb-caso-${((number - 1) % stopTheBleedCharacters.length) + 1}`,
    patientKind: 'stop-the-bleed',
    steps: [
      makeStep(1, 'Etapa 1: Segurança, reconhecimento e primeira ação', `A cena está ${number % 3 === 0 ? 'em uma via urbana após colisão' : number % 2 === 0 ? 'em um estande de tiro após disparo acidental' : 'em uma área urbana após acidente'}. Há sangramento ativo em ${labels[member]}.`, `Sangramento ${member === 'juncao' ? 'juncional' : 'ameaçador à vida'}; risco de choque`, firstFocus, primary, distractorsFor(member)),
      makeStep(2, 'Etapa 2: Hemostasia sustentada', 'A primeira conduta foi iniciada. O sangramento diminui, mas retorna quando a contenção é interrompida. Escolha a ação de manutenção.', 'Fluxo reduzido, com risco de recorrência', secondFocus, secondCorrect, ['do-not-loosen', 'do-not-use-powder', 'do-not-wash-first']),
      makeStep(3, 'Etapa 3: Reavaliação e transferência', 'A equipe de emergência está a caminho. Preserve o que funcionou, mantenha a vítima aquecida e faça uma passagem estruturada do caso.', 'Controlado sob observação', thirdFocus, 'warm-monitor', ['do-not-loosen', 'do-not-use-powder', 'do-not-ice-directly'])
    ]
  };
}

export const generatedStopTheBleedCases: SimulationCase[] = Array.from({ length: 53 }, (_, index) => makeGeneratedCase(index + 28));
