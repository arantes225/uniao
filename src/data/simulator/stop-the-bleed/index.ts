import type { SimulationCase, BleedingFocus, SimulationStep } from '../types';

type CaseSpec = {
  id: string;
  caseTitle: string;
  description: string;
  characterId: string;
  focus: Omit<BleedingFocus, 'title' | 'appearance' | 'action'>;
  focusTitle: string;
  pattern: string;
  location: string;
  action: string;
  escalation: string;
};

const buildCase = (spec: CaseSpec): SimulationCase => {
  const focusOne: BleedingFocus = {
    ...spec.focus,
    title: spec.focusTitle,
    appearance: `Observe o foco marcado: ${spec.pattern} em ${spec.location}. A máscara separa a área da lesão do restante da cena para facilitar a leitura.`,
    action: spec.action,
  };
  const focusTwo: BleedingFocus = {
    ...spec.focus,
    title: `${spec.focusTitle} após a primeira intervenção`,
    appearance: 'O foco permanece visível e deve ser reavaliado sem retirar o material que está controlando o fluxo.',
    action: spec.escalation,
  };
  const step = (id: number, phase: string, scenarioText: string, bleeding: string, focus: BleedingFocus, options: SimulationStep['options']): SimulationStep => ({
    id, phase, scenarioText,
    vitalSigns: {
      consciousness: id === 1 ? 'Consciente e ansioso' : 'Pálido, responde adequadamente',
      breathing: id === 1 ? '22 rpm' : '25 rpm',
      circulation: id === 1 ? 'Pulso rápido' : 'Pulso fino e acelerado',
      bleeding,
    },
    bleedingFocus: focus,
    options,
  });

  return {
    id: spec.id,
    title: spec.caseTitle,
    description: spec.description,
    characterId: spec.characterId,
    patientKind: 'stop-the-bleed',
    steps: [
      step(1, 'Etapa 1: reconhecer o foco', spec.location, spec.pattern, focusOne, [
        { id: `${spec.id}-a`, text: 'Verificar a segurança, pedir ajuda e aplicar pressão imediata no foco marcado.', type: 'essential', feedback: 'A sequência prioriza a segurança da cena, o acionamento do socorro e o controle da perda de sangue.', score: 35 },
        { id: `${spec.id}-b`, text: 'Aguardar para observar se o sangramento diminui sozinho.', type: 'critical_error', feedback: 'Uma hemorragia grave não deve ser observada passivamente.', score: -35 },
        { id: `${spec.id}-c`, text: 'Lavar a lesão antes de iniciar a compressão.', type: 'incorrect', feedback: 'O controle da hemorragia vem antes da limpeza.', score: -15 },
      ]),
      step(2, 'Etapa 2: manter o controle', `A pressão inicial foi iniciada. ${spec.escalation}`, 'Ativo, sob pressão', focusTwo, [
        { id: `${spec.id}-d`, text: 'Manter pressão firme, preparar o recurso adequado e informar o horário ao socorro.', type: 'essential', feedback: 'Mantenha o controle sem interromper para conferir o foco e faça a passagem clara do caso.', score: 40 },
        { id: `${spec.id}-e`, text: 'Retirar o material para verificar a ferida a cada poucos segundos.', type: 'critical_error', feedback: 'Interromper a pressão pode desfazer o coágulo e reiniciar a hemorragia.', score: -30 },
        { id: `${spec.id}-f`, text: 'Deixar a vítima sozinha para buscar materiais.', type: 'incorrect', feedback: 'Peça que outra pessoa busque materiais enquanto você mantém a pressão.', score: -15 },
      ]),
    ],
  };
};

export const stopTheBleedCases: SimulationCase[] = [
  buildCase({ id: 'stb-rua-ciclista-coxa', caseTitle: 'Ciclista: hemorragia arterial na coxa', description: 'Acidente de trânsito com sangramento grave em uma extremidade.', characterId: 'stb-rua-ciclista-coxa', focus: { x: 63, y: 75, size: 12, kind: 'arterial', mask: 'arterial' }, focusTitle: 'Sangramento arterial na coxa', pattern: 'fluxo vermelho vivo, pulsátil e rápido', location: 'um ciclista caído na faixa após colisão', action: 'Aplique pressão direta e prepare um torniquete comercial acima da lesão se a pressão não controlar o fluxo.', escalation: 'O fluxo continua apesar da pressão. Posicione o torniquete acima da lesão, fora de articulações, até cessar o sangramento.' }),
  buildCase({ id: 'stb-rua-vidro-antebraco', caseTitle: 'Ponto de ônibus: corte venoso no antebraço', description: 'Acidente com vidro e sangramento contínuo em uma extremidade.', characterId: 'stb-rua-vidro-antebraco', focus: { x: 47, y: 52, size: 10, kind: 'venous', mask: 'venous' }, focusTitle: 'Sangramento venoso no antebraço', pattern: 'fluxo contínuo, sem jatos, que encharca o tecido', location: 'o antebraço de um pedestre junto ao abrigo de ônibus', action: 'Aplique pressão direta firme e contínua com gaze ou tecido limpo.', escalation: 'O tecido está úmido, mas o fluxo desacelerou. Reforce a pressão e acrescente material por cima sem retirar a primeira camada.' }),
  buildCase({ id: 'stb-rua-juncao-virilha', caseTitle: 'Obra viária: ferida de junção', description: 'Queda em obra com ferida profunda na transição entre tronco e membro.', characterId: 'stb-rua-juncao-virilha', focus: { x: 64, y: 63, size: 12, kind: 'junctional', mask: 'junctional' }, focusTitle: 'Sangramento de junção na virilha', pattern: 'ferida profunda em região onde o torniquete de extremidade não alcança', location: 'a parte alta da coxa de um trabalhador protegido por roupa', action: 'Mantenha pressão e prepare gaze para preencher a ferida enquanto o socorro é acionado.', escalation: 'A pressão reduz o fluxo. Preencha a cavidade com gaze, mantenha pressão contínua e não remova o material.' }),
  buildCase({ id: 'stb-clube-braco', caseTitle: 'Clube de tiro: hemorragia no braço', description: 'Acidente de equipamento em estande supervisionado com arma descarregada e guardada.', characterId: 'stb-clube-braco', focus: { x: 40, y: 42, size: 10, kind: 'arterial', mask: 'arterial' }, focusTitle: 'Sangramento arterial no braço', pattern: 'fluxo pulsátil na parte superior do braço', location: 'um participante sentado no piso de segurança do estande', action: 'Pressione a ferida e prepare um torniquete comercial acima dela, sem cobrir articulação.', escalation: 'O instrutor confirmou que as armas estão seguras. Aplique o torniquete até controlar o sangramento e registre o horário.' }),
  buildCase({ id: 'stb-clube-perna', caseTitle: 'Clube de tiro: corte na perna', description: 'Acidente com borda metálica junto à linha de tiro, com resposta de segurança já iniciada.', characterId: 'stb-clube-perna', focus: { x: 53, y: 72, size: 11, kind: 'venous', mask: 'venous' }, focusTitle: 'Sangramento venoso na perna', pattern: 'fluxo contínuo pela parte inferior da perna', location: 'um participante deitado no tapete de segurança', action: 'Faça pressão direta firme com gaze e mantenha a perna imóvel.', escalation: 'A pressão está funcionando. Reforce o curativo sem retirar o primeiro material e aguarde a equipe de emergência.' }),
  buildCase({ id: 'stb-clube-axila', caseTitle: 'Clube de tiro: ferida na axila', description: 'Acidente de equipamento em aula segura, com ferida de junção na região axilar.', characterId: 'stb-clube-axila', focus: { x: 31, y: 38, size: 11, kind: 'junctional', mask: 'junctional' }, focusTitle: 'Sangramento de junção na axila', pattern: 'ferida profunda na transição entre tórax e braço', location: 'uma participante apoiada contra a parede acolchoada', action: 'Mantenha pressão firme e preencha a ferida com gaze até a chegada do socorro.', escalation: 'O fluxo diminuiu com a pressão. Não retire a gaze; mantenha o preenchimento e monitore a respiração.' }),
];


