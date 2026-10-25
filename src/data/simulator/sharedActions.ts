import type { SimulationStep } from './types';

/**
 * Banco único de ações usado pelos três ambientes de treino.
 *
 * O texto de cada botão é deliberadamente compartilhado entre os casos: o
 * aluno precisa reconhecer a conduta a partir do cenário, e não decorar uma
 * alternativa criada sob medida para uma única vítima.
 */
export type SharedActionKey =
  | 'secure-call'
  | 'direct-pressure'
  | 'tourniquet-limb'
  | 'packing-junction'
  | 'cover-trunk'
  | 'pressure-dressing'
  | 'continue-pressure'
  | 'warm-monitor'
  | 'do-not-loosen'
  | 'do-not-wash-first'
  | 'do-not-elevate'
  | 'do-not-use-powder'
  | 'do-not-probe'
  | 'do-not-remove'
  | 'do-not-tourniquet-trunk'
  | 'do-not-ice-directly'
  | 'improvise-wire';

type ActionTemplate = {
  text: string;
  type: SimulationStep['options'][number]['type'];
  score: number;
  feedback: string;
};

export const SHARED_ACTIONS: Record<SharedActionKey, ActionTemplate> = {
  'secure-call': {
    text: 'Garantir segurança da cena, usar barreira de proteção e acionar o serviço de emergência, pedindo que outra pessoa traga o kit de controle de sangramento.',
    type: 'essential', score: 30,
    feedback: 'A segurança vem antes do contato e o acionamento precoce mantém a vítima dentro da cadeia de sobrevivência.'
  },
  'direct-pressure': {
    text: 'Aplicar pressão direta firme e contínua exatamente sobre a fonte do sangramento, sem levantar a compressa para “olhar”.',
    type: 'essential', score: 35,
    feedback: 'Pressão direta sustentada é a primeira medida para o sangramento externo e não deve ser interrompida para inspeções repetidas.'
  },
  'tourniquet-limb': {
    text: 'Em hemorragia ameaçadora à vida de braço ou perna, aplicar torniquete comercial proximal à lesão, fora de articulação, apertando até cessar o sangramento.',
    type: 'essential', score: 40,
    feedback: 'O torniquete é reservado para sangramento grave de extremidade. Deve ser bem ajustado, ter o horário registrado e não ser afrouxado pelo socorrista.'
  },
  'packing-junction': {
    text: 'Em ferida profunda de axila ou virilha, preencher a cavidade até a fonte e manter compressão contínua — somente dentro do treinamento e protocolo disponíveis.',
    type: 'essential', score: 40,
    feedback: 'Lesões juncionais não aceitam torniquete de membro. Packing e pressão são técnicas que exigem treinamento prático e indicação anatômica.'
  },
  'cover-trunk': {
    text: 'Cobrir/proteger a lesão de tronco com curativo apropriado, manter pressão superficial quando indicada e organizar transporte urgente; não explorar a cavidade.',
    type: 'essential', score: 35,
    feedback: 'Tórax e abdome exigem proteção, controle externo possível e evacuação. Não se introduz gaze profundamente em cavidades do tronco.'
  },
  'pressure-dressing': {
    text: 'Depois de controlar o fluxo, fixar uma cobertura compressiva sem retirar o material que está em contato com a ferida e reavaliar se voltou a sangrar.',
    type: 'adequate', score: 25,
    feedback: 'A cobertura compressiva mantém a hemostasia e permite transporte. Se encharcar, reforça-se por cima sem remover a primeira camada.'
  },
  'continue-pressure': {
    text: 'Manter a pressão pelo tempo necessário, pedir revezamento a outro socorrista e observar consciência, respiração e retorno do sangramento.',
    type: 'essential', score: 30,
    feedback: 'A compressão precisa ser contínua. Revezar as mãos é melhor do que aliviar a pressão e perder o coágulo em formação.'
  },
  'warm-monitor': {
    text: 'Manter a vítima aquecida, em posição segura, monitorar vias aéreas e respiração e passar ao resgate o mecanismo, o horário e as medidas realizadas.',
    type: 'essential', score: 30,
    feedback: 'Aquecimento, vigilância e passagem estruturada reduzem deterioração e ajudam a equipe a continuar o cuidado sem perder informação crítica.'
  },
  'do-not-loosen': {
    text: 'Afrouxar o torniquete ou levantar a compressa a cada poucos minutos para conferir se o sangramento “já parou”.',
    type: 'critical_error', score: -35,
    feedback: 'Erro crítico: afrouxar o torniquete ou interromper a pressão pode remover o coágulo e reiniciar uma hemorragia potencialmente fatal.'
  },
  'do-not-wash-first': {
    text: 'Lavar, esfregar ou irrigar a ferida antes de controlar o sangramento, para deixá-la “bem limpa”.',
    type: 'incorrect', score: -20,
    feedback: 'A limpeza é secundária. Em sangramento importante, perder tempo lavando aumenta a perda de sangue e atrasa a hemostasia.'
  },
  'do-not-elevate': {
    text: 'Elevar o membro e aguardar que a gravidade resolva o sangramento, sem fazer pressão direta ou torniquete quando indicado.',
    type: 'incorrect', score: -20,
    feedback: 'Elevação isolada não substitui pressão direta nem torniquete indicado. O foco é comprimir a fonte do sangramento.'
  },
  'do-not-use-powder': {
    text: 'Colocar café, açúcar, farinha, pasta de dente ou pó antisséptico dentro da ferida para “puxar” o sangue.',
    type: 'critical_error', score: -30,
    feedback: 'Erro popular e perigoso: esses produtos contaminam a ferida e não substituem uma ação mecânica de hemostasia.'
  },
  'do-not-probe': {
    text: 'Introduzir o dedo, pinça ou objeto na ferida para procurar o vaso ou retirar coágulos antes de comprimir.',
    type: 'critical_error', score: -30,
    feedback: 'Não se sonda uma ferida no atendimento inicial. Explorar pode ampliar a lesão, deslocar coágulos e introduzir contaminação.'
  },
  'do-not-remove': {
    text: 'Puxar um objeto que ficou cravado para conseguir enxergar melhor a lesão e depois fazer o curativo.',
    type: 'critical_error', score: -35,
    feedback: 'Objeto empalado pode estar tamponando o sangramento. Estabilize-o, cubra ao redor e aguarde atendimento especializado.'
  },
  'do-not-tourniquet-trunk': {
    text: 'Colocar torniquete no pescoço, tórax, abdome, face ou sobre uma articulação para tentar “parar tudo”.',
    type: 'critical_error', score: -40,
    feedback: 'Torniquete de extremidade não controla tronco, face ou junção e pode causar dano grave. A anatomia determina a técnica.'
  },
  'do-not-ice-directly': {
    text: 'Colocar gelo diretamente sobre a ferida aberta ou sobre o segmento amputado para “congelar” o sangramento.',
    type: 'incorrect', score: -20,
    feedback: 'Gelo direto lesiona tecidos e não substitui pressão. Em amputação, o segmento deve ser protegido e resfriado indiretamente conforme orientação especializada.'
  },
  'improvise-wire': {
    text: 'Improvisar um torniquete estreito com arame, fio, cadarço fino ou cabo rígido sem treinamento, apertando até a pele mudar de cor.',
    type: 'critical_error', score: -35,
    feedback: 'Improvisos estreitos podem cortar tecidos sem controlar o vaso. Priorize pressão direta e um dispositivo comercial quando disponível.'
  }
};

export function sharedOptions(
  correct: SharedActionKey,
  distractors: SharedActionKey[],
  context = 'neste cenário'
): SimulationStep['options'] {
  const keys = [correct, ...distractors].filter((key, index, all) => all.indexOf(key) === index);
  return keys.map(key => {
    const action = SHARED_ACTIONS[key];
    const isCorrect = key === correct;
    return {
      id: `shared-${key}`,
      text: action.text,
      type: isCorrect ? action.type : (action.type === 'essential' || action.type === 'adequate' ? 'incorrect' : action.type),
      score: isCorrect ? action.score : action.score,
      feedback: isCorrect ? `Correto para ${context}: ${action.feedback}` : action.feedback
    };
  });
}

export const actionBankLabel = 'Ações compartilhadas · reconheça a conduta pelo cenário';
