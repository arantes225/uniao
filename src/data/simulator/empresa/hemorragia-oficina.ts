import type { SimulationCase } from '../types';

// Existing scenario preserved verbatim; shared with the school workshop folder.
export const workshopBleeding: SimulationCase = {
  id: 'hemorragia-oficina',
  title: 'Hemorragia exanguinante e choque hipovolêmico',
  description: 'Atendimento de uma pessoa com sangramento intenso em uma oficina.',
  characterId: 'homem-branco-deitado',
  steps: [
    {
      id: 1,
      phase: 'Etapa 1: Segurança da Cena e Reconhecimento Imediato',
      scenarioText: 'Você é acionado para um incidente na oficina da instituição. Há uma pessoa caída ao solo com corte profundo no membro inferior e grande poça de sangue em expansão contínua. Máquinas no local ainda estão energizadas e ferramentas cortantes espalhadas.',
      vitalSigns: {
        consciousness: 'Ansioso, pálido, sudoreico',
        breathing: 'Taquipneico (26 rpm)',
        circulation: 'Pulso radial fino e rápido (120 bpm)',
        bleeding: 'Exanguinante, pulsátil (artéria femoral)'
      },
      options: [
        {
          id: 'opt1',
          text: 'Correr até a vítima sem verificar a energia e aplicar compressa de pano comum.',
          type: 'critical_error',
          feedback: 'ERRO CRÍTICO: Aproximar-se de maquinário energizado sem isolar a cena coloca o socorrista em risco fatal. Além disso, sangramento arterial pulsátil exige torniquete imediato.',
          score: -30
        },
        {
          id: 'opt2',
          text: 'Garantir desligamento da chave de força, calçar luvas/óculos de proteção, acionar o resgate e abordar a vítima com torniquete.',
          type: 'essential',
          feedback: 'CONDUTA ESSENCIAL: Segurança da cena estabelecida, biossegurança adotada, apoio avançado acionado e foco imediato no controle de hemorragia massiva.',
          score: 30
        },
        {
          id: 'opt3',
          text: 'Esperar a chegada dos bombeiros sem realizar qualquer intervenção.',
          type: 'incorrect',
          feedback: 'CONDUTA INCORRETA: Em hemorragias arteriais graves, a vítima pode evoluir para choque hipovolêmico e óbito em menos de 5 minutos antes da chegada do socorro.',
          score: -20
        }
      ]
    },
    {
      id: 2,
      phase: 'Etapa 2: Intervenção — Controle de Hemorragia Exanguinante (X)',
      scenarioText: 'A cena está segura e o socorro avançado foi acionado. A vítima apresenta sangramento arterial maciço e contínuo no terço médio da coxa direita. Você tem à disposição um torniquete de extremidades homologado.',
      vitalSigns: {
        consciousness: 'Sonolência iniciando (hipoperfusão cerebral)',
        breathing: '28 rpm',
        circulation: 'Pulso radial quase imperceptível',
        bleeding: 'Maciço, pulsátil'
      },
      options: [
        {
          id: 'opt4',
          text: 'Posicionar o torniquete 5 a 7 cm acima da lesão (ou raiz do membro se a lesão não for visualizada claramente), ajustar a fita sem folgas e torcer a haste até cessar o sangramento e o pulso distal.',
          type: 'essential',
          feedback: 'CONDUTA ESSENCIAL: Aplicação perfeita do torniquete conforme as diretrizes do Stop the Bleed e TCCC. A rotação da haste até a hemostasia completa estanca o choque hemorrágico.',
          score: 40
        },
        {
          id: 'opt5',
          text: 'Aplicar o torniquete diretamente sobre a articulação do joelho.',
          type: 'critical_error',
          feedback: 'ERRO CRÍTICO: Nunca aplique o torniquete sobre articulações, pois a anatomia óssea impede a oclusão vascular efetiva e pode fraturar estruturas articulares.',
          score: -30
        },
        {
          id: 'opt6',
          text: 'Colocar apenas gaze estéril superficial sem apertar para não doer na vítima.',
          type: 'critical_error',
          feedback: 'ERRO CRÍTICO: Sangramento arterial exanguinante não cessa com curativo superficial sem pressão vigorosa. A hesitação levaria a parada cardiorrespiratória por exsanguinação.',
          score: -30
        }
      ]
    },
    {
      id: 3,
      phase: 'Etapa 3: Reavaliação, Tempo e Prevenção de Hipotermia',
      scenarioText: 'O torniquete foi travado e o sangramento massivo cessou. A vítima começa a tremer de frio e apresenta extremidades arroxeadas.',
      vitalSigns: {
        consciousness: 'Responde a estímulos verbais com confusão',
        breathing: '22 rpm',
        circulation: 'Pulso carotídeo palpável (105 bpm), sangramento contido',
        bleeding: 'Controlado pelo torniquete'
      },
      options: [
        {
          id: 'opt7',
          text: 'Anotar imediatamente o horário exato de aplicação na fita do torniquete, cobrir a vítima com manta térmica/cobertor e monitorar vias aéreas e respiração até a chegada da equipe de suporte avançado.',
          type: 'essential',
          feedback: 'CONDUTA ESSENCIAL: Registrar o horário é mandatório para a equipe cirúrgica. A prevenção de hipotermia combate a tríade letal do trauma (hipotermia, acidose e coagulopatia).',
          score: 30
        },
        {
          id: 'opt8',
          text: 'Afrouxar o torniquete a cada 5 minutos para "circular um pouco de sangue".',
          type: 'critical_error',
          feedback: 'ERRO CRÍTICO GRAVÍSSIMO: NUNCA afrouxe um torniquete no ambiente pré-hospitalar! O alívio de pressão causa retorno do sangramento maciço e choque irreversível.',
          score: -40
        }
      ]
    }
  ],
};
