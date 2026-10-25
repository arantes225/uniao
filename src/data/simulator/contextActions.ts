import type { SimulationStep } from './types';

export type ContextActionKey =
  | 'scene-check-call' | 'monitor-reassure' | 'cpr-aed-adult' | 'cpr-aed-pediatric'
  | 'choking-child' | 'choking-infant' | 'asthma-plan' | 'anaphylaxis-plan'
  | 'seizure-protect' | 'fainting-recovery' | 'hypoglycemia-plan' | 'heat-cooling'
  | 'musculoskeletal-support' | 'concussion-remove' | 'water-rescue' | 'electrical-isolate'
  | 'burn-cool' | 'eye-rinse' | 'poison-call' | 'evacuate' | 'handover-monitor'
  | 'give-food-unconscious' | 'force-stand' | 'restrain-seizure' | 'put-object-mouth'
  | 'force-joint' | 'continue-exercise' | 'touch-electric' | 'induce-vomit' | 'ice-burn'
  | 'enter-water' | 'give-medication' | 'delay-call' | 'move-neck';

type ActionTemplate = {
  text: string;
  type: SimulationStep['options'][number]['type'];
  score: number;
  feedback: string;
};

export const CONTEXT_ACTIONS: Record<ContextActionKey, ActionTemplate> = {
  'scene-check-call': { text: 'Interromper a atividade, verificar a segurança do local, avaliar a resposta e acionar o serviço de emergência com informações objetivas.', type: 'essential', score: 30, feedback: 'A cena segura, a avaliação inicial e o acionamento precoce organizam toda a resposta.' },
  'monitor-reassure': { text: 'Manter a pessoa em posição confortável e segura, conversar com calma e acompanhar consciência, respiração e piora dos sinais.', type: 'essential', score: 25, feedback: 'Monitorar e tranquilizar ajuda a reconhecer deterioração sem criar uma nova ameaça.' },
  'cpr-aed-adult': { text: 'Confirmar ausência de resposta e respiração normal, acionar emergência, iniciar RCP conforme treinamento e pedir o DEA imediatamente.', type: 'essential', score: 40, feedback: 'RCP precoce e desfibrilação rápida fazem parte da cadeia de sobrevivência.' },
  'cpr-aed-pediatric': { text: 'Acionar ajuda, iniciar RCP pediátrica conforme treinamento e conectar o DEA assim que chegar, usando atenuador ou pás pediátricas quando disponíveis.', type: 'essential', score: 40, feedback: 'A prioridade é manter compressões de qualidade e usar o DEA o quanto antes, com o equipamento pediátrico disponível.' },
  'choking-child': { text: 'Se a criança não consegue falar ou tossir, alternar 5 golpes nas costas e 5 compressões abdominais até a saída do objeto ou perda de resposta.', type: 'essential', score: 35, feedback: 'A sequência atualizada para obstrução grave infantil alterna golpes nas costas e compressões abdominais.' },
  'choking-infant': { text: 'Se o bebê não consegue emitir som ou respirar, alternar 5 golpes nas costas e 5 compressões torácicas com a técnica pediátrica treinada.', type: 'essential', score: 35, feedback: 'Em lactentes, a sequência usa golpes nas costas e compressões torácicas, sem compressões abdominais.' },
  'asthma-plan': { text: 'Interromper o esforço, manter a pessoa sentada, ajudar no uso do medicamento prescrito conforme o plano individual e acionar atendimento se não melhorar.', type: 'essential', score: 30, feedback: 'A posição confortável e o plano individual ajudam enquanto a resposta é monitorada e o suporte é acionado.' },
  'anaphylaxis-plan': { text: 'Acionar emergência imediatamente e ajudar a usar o autoinjetor de adrenalina prescrito, conforme o plano individual e o treinamento disponível.', type: 'essential', score: 35, feedback: 'Anafilaxia é uma emergência tempo-dependente; o plano individual e o acionamento precoce são decisivos.' },
  'seizure-protect': { text: 'Afastar objetos perigosos, proteger a cabeça, marcar o tempo e observar a respiração; não segurar os movimentos nem colocar nada na boca.', type: 'essential', score: 30, feedback: 'A proteção contra trauma e a observação do tempo são mais seguras do que tentar conter a crise.' },
  'fainting-recovery': { text: 'Deitar a pessoa em local seguro, avaliar resposta e respiração, afrouxar apenas o que estiver apertando e acionar ajuda se não recuperar rapidamente.', type: 'essential', score: 25, feedback: 'A posição segura e a avaliação inicial evitam quedas e permitem reconhecer causas mais graves.' },
  'hypoglycemia-plan': { text: 'Se estiver consciente e conseguir engolir, seguir o plano individual e oferecer a fonte de carboidrato prevista; se estiver confusa ou inconsciente, nada por via oral e emergência.', type: 'essential', score: 35, feedback: 'A capacidade de engolir define a segurança da oferta por via oral; alteração de consciência exige emergência.' },
  'heat-cooling': { text: 'Interromper o exercício, levar para local fresco, retirar excesso de equipamento, iniciar resfriamento e acionar emergência diante de confusão ou piora.', type: 'essential', score: 30, feedback: 'Resfriamento rápido e reconhecimento de alteração mental são prioridades nas emergências pelo calor.' },
  'musculoskeletal-support': { text: 'Parar a atividade, manter a região na posição encontrada, proteger contra novos movimentos e encaminhar para avaliação profissional.', type: 'essential', score: 25, feedback: 'Não forçar a articulação nem testar repetidamente evita piorar uma possível lesão musculoesquelética.' },
  'concussion-remove': { text: 'Retirar da atividade, manter observação responsável, avaliar sinais de alerta e encaminhar para avaliação; não permitir retorno no mesmo treino.', type: 'essential', score: 30, feedback: 'Suspeita de concussão exige retirada do jogo e avaliação, sem retorno imediato à atividade.' },
  'water-rescue': { text: 'Acionar ajuda e fazer resgate sem entrar na água: oferecer alcance ou arremesso seguro, retirar a pessoa e avaliar respiração.', type: 'essential', score: 35, feedback: 'O resgate sem entrada protege o socorrista e inicia a avaliação assim que a pessoa estiver em local seguro.' },
  'electrical-isolate': { text: 'Manter distância, interromper a fonte elétrica por meio seguro e acionar a equipe de emergência antes de tocar na pessoa.', type: 'essential', score: 35, feedback: 'Sem isolamento da fonte, o socorrista também pode se tornar vítima.' },
  'burn-cool': { text: 'Afastar da fonte, resfriar a área com água corrente em temperatura confortável e buscar avaliação conforme extensão e localização.', type: 'essential', score: 25, feedback: 'O resfriamento com água corrente ajuda; produtos caseiros e gelo direto podem agravar a lesão.' },
  'eye-rinse': { text: 'Levar ao lavador de olhos ou usar água corrente abundante, mantendo o olho aberto e retirando lentes de contato se saírem facilmente.', type: 'essential', score: 30, feedback: 'Irrigação imediata reduz o tempo de contato do agente com o olho; não se deve esfregar.' },
  'poison-call': { text: 'Afastar da fonte, preservar a embalagem ou informação do produto e acionar o serviço de emergência ou centro de informação toxicológica.', type: 'essential', score: 30, feedback: 'A identificação do produto orienta a equipe; provocar vômito pode aumentar o dano.' },
  'evacuate': { text: 'Acionar o plano de emergência, orientar a saída pela rota segura e conferir a área sem retornar para buscar objetos.', type: 'essential', score: 30, feedback: 'A evacuação organizada reduz exposição e mantém a equipe informada sobre áreas verificadas.' },
  'handover-monitor': { text: 'Registrar horário, sinais observados e medidas realizadas; manter supervisão até a transferência para a equipe responsável.', type: 'essential', score: 25, feedback: 'Uma passagem objetiva evita perda de informação e permite continuidade segura do atendimento.' },
  'give-food-unconscious': { text: 'Colocar alimento, bebida ou comprimido na boca de uma pessoa sonolenta ou inconsciente para “recuperar” mais rápido.', type: 'critical_error', score: -35, feedback: 'Oferecer algo por via oral com consciência alterada pode causar aspiração.' },
  'force-stand': { text: 'Levantar a pessoa imediatamente e fazê-la caminhar para testar se a tontura passou.', type: 'incorrect', score: -20, feedback: 'Forçar a postura pode provocar queda e não substitui a avaliação inicial.' },
  'restrain-seizure': { text: 'Segurar braços e pernas durante a crise para interromper os movimentos mais rapidamente.', type: 'critical_error', score: -30, feedback: 'Restringir os movimentos pode causar trauma; proteja o entorno e deixe a crise evoluir com segurança.' },
  'put-object-mouth': { text: 'Colocar colher, pano ou dedos na boca durante uma convulsão para impedir que a pessoa morda a língua.', type: 'critical_error', score: -35, feedback: 'Nada deve ser colocado na boca durante a crise.' },
  'force-joint': { text: 'Puxar, estalar ou recolocar a articulação no lugar antes de encaminhar a pessoa.', type: 'critical_error', score: -35, feedback: 'Manipulação forçada pode lesar nervos, vasos e estruturas ao redor.' },
  'continue-exercise': { text: 'Pedir que a pessoa continue o exercício em intensidade menor para observar se o sintoma desaparece.', type: 'critical_error', score: -30, feedback: 'Continuar o esforço pode agravar uma emergência e atrasar o atendimento.' },
  'touch-electric': { text: 'Segurar a pessoa imediatamente e puxá-la do equipamento energizado com as próprias mãos.', type: 'critical_error', score: -40, feedback: 'Sem isolamento elétrico, o contato direto pode provocar uma segunda vítima.' },
  'induce-vomit': { text: 'Dar leite ou provocar vômito para tentar eliminar rapidamente uma substância ingerida.', type: 'critical_error', score: -30, feedback: 'Não provoque vômito nem ofereça soluções caseiras; a orientação depende do produto.' },
  'ice-burn': { text: 'Aplicar gelo, pasta de dente ou pomada caseira diretamente na área aquecida.', type: 'incorrect', score: -20, feedback: 'Gelo direto e produtos caseiros podem ampliar a lesão e dificultar a avaliação.' },
  'enter-water': { text: 'Entrar na água sem equipamento para tentar retirar a vítima, mesmo sem treinamento de resgate aquático.', type: 'critical_error', score: -40, feedback: 'O socorrista pode ser agarrado e se tornar outra vítima; prefira alcance, arremesso e ajuda especializada.' },
  'give-medication': { text: 'Oferecer medicamento de outra pessoa porque os sintomas parecem iguais aos de uma crise anterior.', type: 'incorrect', score: -25, feedback: 'Medicamentos devem seguir prescrição, plano individual ou orientação profissional.' },
  'delay-call': { text: 'Esperar vários minutos para ver se a situação melhora antes de avisar a equipe responsável.', type: 'incorrect', score: -25, feedback: 'Acionar ajuda cedo permite que o plano de resposta seja iniciado antes da deterioração.' },
  'move-neck': { text: 'Girar o pescoço e mudar a posição da pessoa repetidamente para procurar uma postura mais confortável.', type: 'critical_error', score: -30, feedback: 'Movimentos desnecessários podem agravar uma suspeita de trauma; mantenha a posição segura e aguarde orientação.' }
};

export function contextOptions(correct: ContextActionKey, distractors: ContextActionKey[], context: string): SimulationStep['options'] {
  const keys = [correct, ...distractors].filter((key, index, all) => all.indexOf(key) === index);
  return keys.map(key => {
    const action = CONTEXT_ACTIONS[key];
    return {
      id: `context-${key}`,
      text: action.text,
      type: key === correct ? action.type : (action.type === 'essential' || action.type === 'adequate' ? 'incorrect' : action.type),
      score: action.score,
      feedback: key === correct ? `Correto para ${context}: ${action.feedback}` : action.feedback
    };
  });
}
