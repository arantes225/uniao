export type StopTheBleedCharacter = {
  id: string;
  name: string;
  context: 'Rua' | 'Clube de tiro';
  file: string;
  focus: { x: number; y: number; size: number };
  mask: 'arterial' | 'venous' | 'junctional' | 'controlled';
};

export const stopTheBleedCharacters: StopTheBleedCharacter[] = [
  { id: 'stb-rua-ciclista-coxa', name: 'Ciclista na faixa', context: 'Rua', file: 'stb-rua-ciclista-coxa.jpg', focus: { x: 63, y: 75, size: 12 }, mask: 'arterial' },
  { id: 'stb-rua-vidro-antebraco', name: 'Pedestre no ponto de ônibus', context: 'Rua', file: 'stb-rua-vidro-antebraco.jpg', focus: { x: 47, y: 52, size: 10 }, mask: 'venous' },
  { id: 'stb-rua-juncao-virilha', name: 'Trabalhador da obra', context: 'Rua', file: 'stb-rua-juncao-virilha.jpg', focus: { x: 64, y: 63, size: 12 }, mask: 'junctional' },
  { id: 'stb-clube-braco', name: 'Participante do estande', context: 'Clube de tiro', file: 'stb-clube-braco.jpg', focus: { x: 40, y: 42, size: 10 }, mask: 'arterial' },
  { id: 'stb-clube-perna', name: 'Aluno no piso de segurança', context: 'Clube de tiro', file: 'stb-clube-perna.jpg', focus: { x: 53, y: 72, size: 11 }, mask: 'venous' },
  { id: 'stb-clube-axila', name: 'Instrutora em apoio', context: 'Clube de tiro', file: 'stb-clube-axila.jpg', focus: { x: 31, y: 38, size: 11 }, mask: 'junctional' },
];

export const stopTheBleedCharacterById = Object.fromEntries(
  stopTheBleedCharacters.map(character => [character.id, character])
) as Record<string, StopTheBleedCharacter>;


