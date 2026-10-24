import type { SimulationCase } from '../types';

const caseOne: SimulationCase = {
  id: 'stb-coxa-pulsatil',
  title: 'Sangramento pulsátil na coxa',
  description: 'Identifique o sangramento grave em uma extremidade e escolha o controle imediato.',
  characterId: 'homem-branco-deitado',
  steps: [
    {
      id: 1,
      phase: 'Etapa 1: localizar o sangramento',
      scenarioText: 'A cena está segura. A vítima está consciente e há sangue se acumulando rapidamente próximo à coxa direita.',
      vitalSigns: { consciousness: 'Consciente e ansioso', breathing: '24 rpm', circulation: 'Pulso rápido', bleeding: 'Ativo e pulsátil' },
      bleedingFocus: {
        x: 78, y: 83, size: 11, kind: 'arterial', title: 'Sangramento arterial pulsátil',
        appearance: 'O sangue aparece em jatos ou pulsos, com grande volume e progressão rápida.',
        action: 'Acione o socorro, aplique pressão imediata e prepare um torniquete para a extremidade se o sangramento não ceder.'
      },
      options: [
        { id: 'stb1-a', text: 'Verificar a segurança, pedir ajuda e pressionar diretamente a ferida.', type: 'essential', feedback: 'Boa sequência: segurança, acionamento do socorro e pressão imediata reduzem a perda de sangue.', score: 30 },
        { id: 'stb1-b', text: 'Afastar-se e aguardar porque o sangramento parece muito intenso.', type: 'critical_error', feedback: 'Em hemorragia grave, esperar sem intervir permite perda rápida de sangue.', score: -30 },
        { id: 'stb1-c', text: 'Lavar a ferida antes de fazer qualquer compressão.', type: 'incorrect', feedback: 'A prioridade é controlar a hemorragia; a limpeza pode esperar a equipe treinada.', score: -15 }
      ]
    },
    {
      id: 2,
      phase: 'Etapa 2: controle da extremidade',
      scenarioText: 'A pressão inicial não controla o fluxo. O kit possui um torniquete comercial e gaze.',
      vitalSigns: { consciousness: 'Pálido, responde adequadamente', breathing: '26 rpm', circulation: 'Pulso radial fino', bleeding: 'Pulsátil, não controlado' },
      bleedingFocus: {
        x: 78, y: 83, size: 11, kind: 'arterial', title: 'Foco arterial ainda ativo',
        appearance: 'O fluxo continua apesar da pressão inicial, sinal de hemorragia que exige escalada rápida.',
        action: 'Aplique o torniquete na extremidade, acima da lesão e fora de articulações, até o sangramento cessar.'
      },
      options: [
        { id: 'stb1-d', text: 'Aplicar o torniquete acima da lesão, apertar até cessar o sangramento e anotar o horário.', type: 'essential', feedback: 'Conduta adequada: o torniquete deve permanecer apertado e o horário deve ser informado ao socorro.', score: 40 },
        { id: 'stb1-e', text: 'Colocar o torniquete frouxo diretamente sobre o joelho.', type: 'critical_error', feedback: 'Não coloque o torniquete sobre articulações nem o deixe frouxo.', score: -35 },
        { id: 'stb1-f', text: 'Retirar a pressão para observar melhor a ferida.', type: 'incorrect', feedback: 'Interromper o controle sem uma alternativa pronta aumenta a perda de sangue.', score: -20 }
      ]
    }
  ]
};

const caseTwo: SimulationCase = {
  id: 'stb-ferida-profunda-virilha',
  title: 'Ferida profunda em região de junção',
  description: 'Aprenda a reconhecer quando uma ferida não pode ser tratada com torniquete de extremidade.',
  characterId: 'mulher-negra-deitada',
  steps: [
    {
      id: 1,
      phase: 'Etapa 1: reconhecer a localização',
      scenarioText: 'A vítima tem uma ferida profunda na região da virilha após uma queda. O sangramento é contínuo e não há espaço seguro para colocar um torniquete de extremidade.',
      vitalSigns: { consciousness: 'Consciente, muito assustada', breathing: '23 rpm', circulation: 'Pulso rápido', bleeding: 'Contínuo, profundo' },
      bleedingFocus: {
        x: 52, y: 78, size: 10, kind: 'junctional', title: 'Sangramento de junção',
        appearance: 'A ferida está na transição entre tronco e membro, onde um torniquete comum não consegue envolver a região.',
        action: 'Mantenha pressão e preencha a cavidade com gaze até o atendimento profissional.'
      },
      options: [
        { id: 'stb2-a', text: 'Acionar o socorro, manter pressão firme e preparar gaze para preencher a ferida.', type: 'essential', feedback: 'A localização exige pressão e preenchimento da ferida, além do acionamento imediato do socorro.', score: 35 },
        { id: 'stb2-b', text: 'Tentar colocar um torniquete em volta do abdome.', type: 'critical_error', feedback: 'Um torniquete de extremidade não deve ser improvisado no tronco ou no abdome.', score: -35 },
        { id: 'stb2-c', text: 'Cobrir a ferida com um curativo sem pressionar.', type: 'incorrect', feedback: 'Cobrir sem pressão não controla uma hemorragia profunda.', score: -15 }
      ]
    },
    {
      id: 2,
      phase: 'Etapa 2: preencher e manter pressão',
      scenarioText: 'A gaze está disponível. O sangramento diminui quando você mantém pressão firme no ponto de origem.',
      vitalSigns: { consciousness: 'Consciente e orientada', breathing: '21 rpm', circulation: 'Pulso ainda acelerado', bleeding: 'Reduzido sob pressão' },
      bleedingFocus: {
        x: 52, y: 78, size: 10, kind: 'junctional', title: 'Ferida profunda preenchida',
        appearance: 'O foco permanece coberto e o fluxo está reduzido enquanto a pressão é mantida.',
        action: 'Não retire a gaze para conferir. Mantenha pressão contínua e entregue a informação à equipe de emergência.'
      },
      options: [
        { id: 'stb2-d', text: 'Manter a gaze no local, continuar pressionando e monitorar a vítima.', type: 'essential', feedback: 'A gaze deve permanecer no local enquanto a pressão é mantida até a chegada do socorro.', score: 35 },
        { id: 'stb2-e', text: 'Puxar a gaze para verificar se o sangramento parou.', type: 'critical_error', feedback: 'Remover o material pode desfazer o coágulo e reiniciar a hemorragia.', score: -30 },
        { id: 'stb2-f', text: 'Deixar a vítima sozinha para buscar mais materiais.', type: 'incorrect', feedback: 'Peça que outra pessoa busque materiais enquanto você mantém o controle do sangramento.', score: -15 }
      ]
    }
  ]
};

const caseThree: SimulationCase = {
  id: 'stb-corte-venoso-braco',
  title: 'Corte com sangramento contínuo no braço',
  description: 'Diferencie um fluxo contínuo de menor pressão e pratique a pressão direta sustentada.',
  characterId: 'idoso-negro-sentado',
  steps: [
    {
      id: 1,
      phase: 'Etapa 1: observar o padrão',
      scenarioText: 'Após um acidente com vidro, a vítima apresenta um corte no antebraço. O sangue escorre de maneira contínua, sem jatos, mas molha rapidamente o curativo.',
      vitalSigns: { consciousness: 'Consciente e falando', breathing: '18 rpm', circulation: 'Pulso palpável', bleeding: 'Contínuo, sem pulsos' },
      bleedingFocus: {
        x: 18, y: 64, size: 9, kind: 'venous', title: 'Sangramento venoso contínuo',
        appearance: 'O fluxo é constante e escorre pela superfície, sem o padrão pulsátil de uma artéria.',
        action: 'Aplique pressão direta firme e contínua com gaze ou tecido limpo, sem interromper para conferir.'
      },
      options: [
        { id: 'stb3-a', text: 'Aplicar pressão direta firme e contínua no local.', type: 'essential', feedback: 'Pressão direta sustentada é a primeira resposta para esse padrão de sangramento.', score: 35 },
        { id: 'stb3-b', text: 'Fazer vários curativos leves e trocar sempre que molharem.', type: 'incorrect', feedback: 'Trocar o curativo repetidamente remove o material que está ajudando a formar o coágulo.', score: -15 },
        { id: 'stb3-c', text: 'Usar um torniquete imediatamente em qualquer corte.', type: 'incorrect', feedback: 'A técnica deve ser proporcional ao sangramento; comece com pressão direta quando ela for suficiente.', score: -10 }
      ]
    },
    {
      id: 2,
      phase: 'Etapa 2: reavaliar sem perder o controle',
      scenarioText: 'Depois de alguns minutos de pressão contínua, o curativo está úmido, mas o sangramento desacelerou e a vítima permanece estável.',
      vitalSigns: { consciousness: 'Consciente e cooperativa', breathing: '17 rpm', circulation: 'Pulso estável', bleeding: 'Controlado sob pressão' },
      bleedingFocus: {
        x: 18, y: 64, size: 9, kind: 'controlled', title: 'Sangramento controlado',
        appearance: 'O fluxo deixou de avançar e o curativo permanece no lugar, ainda sob pressão.',
        action: 'Mantenha o curativo, observe a vítima e faça a passagem do caso ao serviço de emergência.'
      },
      options: [
        { id: 'stb3-d', text: 'Manter o curativo no lugar e acompanhar a vítima até a chegada do socorro.', type: 'essential', feedback: 'Continue observando e não remova o curativo que está controlando o fluxo.', score: 30 },
        { id: 'stb3-e', text: 'Retirar tudo assim que o sangue diminuir.', type: 'critical_error', feedback: 'Remover o curativo pode reiniciar o sangramento.', score: -30 },
        { id: 'stb3-f', text: 'Encerrar a ajuda sem informar o que foi feito.', type: 'incorrect', feedback: 'A equipe precisa saber o que aconteceu e quais medidas foram tomadas.', score: -10 }
      ]
    }
  ]
};

export const stopTheBleedCases: SimulationCase[] = [caseOne, caseTwo, caseThree];
