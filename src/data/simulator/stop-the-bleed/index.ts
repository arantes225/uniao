import type { SimulationCase, BleedingFocus, SimulationStep } from '../types';
import { generatedStopTheBleedCases } from './generatedCases';
import { stopTheBleedCaseMetadata } from './caseMetadata';

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
  step1Options: SimulationStep['options'];
};

const buildCase = (spec: CaseSpec): SimulationCase => {
  const focusOne: BleedingFocus = {
    ...spec.focus,
    title: spec.focusTitle,
    appearance: `Observe o foco marcado: ${spec.pattern} em ${spec.location}. A máscara visual demarca a lesão para intervenção imediata.`,
    action: spec.action,
  };
  const focusTwo: BleedingFocus = {
    ...spec.focus,
    title: `${spec.focusTitle} pós-intervenção`,
    appearance: 'O foco foi contido pela conduta inicial e deve ser rigorosamente mantido e monitorado até o transporte ao centro de trauma.',
    action: spec.escalation,
  };
  const step = (id: number, phase: string, scenarioText: string, bleeding: string, focus: BleedingFocus, options: SimulationStep['options']): SimulationStep => ({
    id, phase, scenarioText,
    vitalSigns: {
      consciousness: id === 1 ? 'Consciente, ansioso e agitado' : 'Pálido, orientado, choque compensado',
      breathing: id === 1 ? '24 rpm' : '20 rpm',
      circulation: id === 1 ? 'Taquicárdico, pulso periférico fino' : 'Pulso estável após hemostasia',
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
      step(1, 'Etapa 1: Reconhecer a Lesão e Decisão Hemostática', spec.location, spec.pattern, focusOne, spec.step1Options),
      step(2, 'Etapa 2: Manutenção e Transferência ao Suporte Avançado', `Primeira conduta executada. ${spec.escalation}`, 'Estabilizado sob hemostasia', focusTwo, [
        { id: `${spec.id}-d`, text: 'Manter a contenção firme ininterrupta, registrar o horário exato da aplicação e realizar passagem estruturada do caso à equipe de resgate.', type: 'essential', feedback: 'Excelente! Nunca interrompa a pressão nem afrouxe o torniquete; registre o horário para orientar a equipe cirúrgica.', score: 40 },
        { id: `${spec.id}-e`, text: 'Soltar periodicamente o torniquete ou curativo a cada 10 minutos para verificar se o sangramento estancou.', type: 'critical_error', feedback: 'Erro grave! Afrouxar o torniquete remove coágulos em formação, reinicia a hemorragia exsanguinante e pode levar ao choque hipovolêmico fatal.', score: -30 },
        { id: `${spec.id}-f`, text: 'Deixar a vítima sozinha no local para buscar mais ataduras em outro setor.', type: 'incorrect', feedback: 'Nunca abandone uma vítima de trauma exsanguinante. Solicite que terceiros tragam materiais adicionais enquanto mantém a contenção.', score: -15 },
      ]),
    ],
  };
};

const legacyStopTheBleedCases: SimulationCase[] = [
  buildCase({
    id: 'stb-caso-1',
    caseTitle: 'Caso 01 · Estande de Tiro (PAF)',
    description: 'Estande de Tiro · Disparo Acidental (ABDOME) · Ferimento perfurante no ABDOME (flanco). O torniquete de extremidades é totalmente ineficaz para hemorragias cavitárias de tronco. Conduta mandatória: Compressão direta com cobertura estéril superficial e rápida evacuação para centro cirúrgico. NUNCA realizar preenchimento (packing) em cavidade abdominal com vísceras.',
    characterId: 'stb-caso-1',
    focus: { x: 43, y: 59, size: 11, kind: 'venous', mask: 'venous' },
    focusTitle: 'Caso 01 · Estande de Tiro (PAF) (ABDOME)',
    pattern: 'fluxo profuso de alta vazão por laceração',
    location: 'região anatômica: ABDOME',
    action: 'Aplique conduta específica para ABDOME.',
    escalation: 'Hemostasia estabilizada conforme conduta de ABDOME.',
    step1Options: [
      { id: 'stb-caso-1-a', text: 'Aplicar compressão direta superficial com campo estéril e preparar evacuação imediata; torniquetes são contraindicados para sangramento abdominal.', type: 'essential', feedback: 'Correto! Hemorragia abdominal é cavitária interna; torniquete de membros é inútil. Exige compressão superficial e centro cirúrgico.', score: 35 },
      { id: 'stb-caso-1-b', text: 'Aplicar torniquete de extremidades ou empacotar gaze profunda dentro da cavidade sobre as vísceras.', type: 'critical_error', feedback: 'Erro crítico! Torniquetes não atuam no abdome e empacotamento profundo sobre vísceras pode causar perfuração e contaminação bacteriana.', score: -35 },
      { id: 'stb-caso-1-c', text: 'Aguardar atendimento de emergência sem aplicar qualquer cobertura ou compressão.', type: 'incorrect', feedback: 'A ferida abdominal deve ser protegida com curativo estéril superficial para limitar exposição e contaminação.', score: -15 }
    ]
  }),
  buildCase({
    id: 'stb-caso-2',
    caseTitle: 'Caso 02 · Estande de Tiro (PAF)',
    description: 'Estande de Tiro · Disparo Acidental (COXA) · Torniquete de extremidade posicionado na COXA proximalmente à lesão com rotação completa da haste do molinete, garantindo oclusão mecânica circunferencial da artéria femoral.',
    characterId: 'stb-caso-2',
    focus: { x: 59, y: 67, size: 11, kind: 'arterial', mask: 'arterial' },
    focusTitle: 'Caso 02 · Estande de Tiro (PAF) (COXA)',
    pattern: 'fluxo profuso de alta vazão por laceração',
    location: 'região anatômica: COXA',
    action: 'Aplique compressão direta e prepare torniquete proximal.',
    escalation: 'O torniquete ocluiu com sucesso a artéria.',
    step1Options: [
      { id: 'stb-caso-2-a', text: 'Garantir segurança da cena, acionar socorro e aplicar torniquete comercial 5 a 7 cm proximal à lesão (ou raiz do membro) até o sangramento e o pulso distal cessarem.', type: 'essential', feedback: 'Conduta perfeita! Em extremidades, o torniquete bem aplicado salva vidas de forma rápida e segura.', score: 35 },
      { id: 'stb-caso-2-b', text: 'Aplicar o torniquete diretamente sobre uma articulação (joelho/cotovelo) ou sobre a própria ferida aberta.', type: 'critical_error', feedback: 'Erro crítico! O torniquete nunca deve ser posicionado sobre articulações ou sobre a própria lesão.', score: -35 },
      { id: 'stb-caso-2-c', text: 'Lavar exaustivamente a ferida com soro fisiológico antes de tentar conter a perda volêmica.', type: 'incorrect', feedback: 'Em hemorragia exsanguinante, a prioridade máxima é a hemostasia imediata. A limpeza é secundária no centro cirúrgico.', score: -15 }
    ]
  }),
  buildCase({
    id: 'stb-caso-3',
    caseTitle: 'Caso 03 · Trauma Urbano',
    description: 'Cena Urbana · Acidente Lacerante (AXILA / JUNÇÃO) · Ferimento em ZONA JUNCIONAL (Axila). O torniquete de extremidades é ineficaz para oclusão de artérias profundas na raiz do tronco (artéria axilar/subclávia proximal). Conduta mandatória: Preenchimento Profundo da Cavidade (Wound Packing) com gaze hemostática + Compressão Manual Direta contínua por no mínimo 3 minutos.',
    characterId: 'stb-caso-3',
    focus: { x: 35, y: 44, size: 11, kind: 'junctional', mask: 'junctional' },
    focusTitle: 'Caso 03 · Trauma Urbano (JUNCAO)',
    pattern: 'sangramento pulsátil em orifício arredondado (PAF)',
    location: 'região anatômica: JUNCAO',
    action: 'Aplique conduta específica para JUNCAO.',
    escalation: 'Hemostasia estabilizada conforme conduta de JUNCAO.',
    step1Options: [
      { id: 'stb-caso-3-a', text: 'Realizar Preenchimento Profundo da Cavidade (Wound Packing) com gaze hemostática + Compressão Manual Direta contínua por no mínimo 3 minutos.', type: 'essential', feedback: 'Padrão-ouro! Em lesão juncional (axila/virilha), o torniquete de membro é ineficaz; o empacotamento profundo com compressão bimanual é a conduta que salva.', score: 35 },
      { id: 'stb-caso-3-b', text: 'Colocar apenas um torniquete comum no braço para tentar conter a lesão na axila.', type: 'critical_error', feedback: 'Erro grave! Torniquetes de membro não comprimem os vasos na raiz do tronco (artéria axilar profunda). A hemorragia arterial continua ativa.', score: -35 },
      { id: 'stb-caso-3-c', text: 'Fazer apenas uma atadura superficial frouxa na pele externa.', type: 'incorrect', feedback: 'Em lesões juncionais profundas, uma atadura frouxa é rapidamente encharcada sem gerar hemostasia.', score: -15 }
    ]
  }),
  buildCase({
    id: 'stb-caso-4',
    caseTitle: 'Caso 04 · Estande de Tiro (PAF)',
    description: 'Estande de Tiro · Disparo Acidental (PERNA) · Torniquete posicionado no membro inferior acima da lesão na PERNA, promovendo hemostasia e cessação imediata do sangramento pulsátil.',
    characterId: 'stb-caso-4',
    focus: { x: 69, y: 64, size: 11, kind: 'arterial', mask: 'arterial' },
    focusTitle: 'Caso 04 · Estande de Tiro (PAF) (PERNA)',
    pattern: 'fluxo profuso de alta vazão por laceração',
    location: 'região anatômica: PERNA',
    action: 'Aplique compressão direta e prepare torniquete proximal.',
    escalation: 'O torniquete ocluiu com sucesso a artéria.',
    step1Options: [
      { id: 'stb-caso-4-a', text: 'Garantir segurança da cena, acionar socorro e aplicar torniquete comercial 5 a 7 cm proximal à lesão (ou raiz do membro) até o sangramento e o pulso distal cessarem.', type: 'essential', feedback: 'Conduta perfeita! Em extremidades, o torniquete bem aplicado salva vidas de forma rápida e segura.', score: 35 },
      { id: 'stb-caso-4-b', text: 'Aplicar o torniquete diretamente sobre uma articulação (joelho/cotovelo) ou sobre a própria ferida aberta.', type: 'critical_error', feedback: 'Erro crítico! O torniquete nunca deve ser posicionado sobre articulações ou sobre a própria lesão.', score: -35 },
      { id: 'stb-caso-4-c', text: 'Lavar exaustivamente a ferida com soro fisiológico antes de tentar conter a perda volêmica.', type: 'incorrect', feedback: 'Em hemorragia exsanguinante, a prioridade máxima é a hemostasia imediata. A limpeza é secundária no centro cirúrgico.', score: -15 }
    ]
  }),
  buildCase({
    id: 'stb-caso-5',
    caseTitle: 'Caso 05 · Trauma Urbano',
    description: 'Estande de Tiro · Disparo Acidental (BRAÇO) · Torniquete posicionado no BRAÇO, 5 a 7 cm proximal ao ferimento perfurocontuso, interrompendo com sucesso o fluxo da artéria braquial.',
    characterId: 'stb-caso-5',
    focus: { x: 33, y: 41, size: 11, kind: 'arterial', mask: 'arterial' },
    focusTitle: 'Caso 05 · Trauma Urbano (BRACO)',
    pattern: 'sangramento pulsátil em orifício arredondado (PAF)',
    location: 'região anatômica: BRACO',
    action: 'Aplique compressão direta e prepare torniquete proximal.',
    escalation: 'O torniquete ocluiu com sucesso a artéria.',
    step1Options: [
      { id: 'stb-caso-5-a', text: 'Garantir segurança da cena, acionar socorro e aplicar torniquete comercial 5 a 7 cm proximal à lesão (ou raiz do membro) até o sangramento e o pulso distal cessarem.', type: 'essential', feedback: 'Conduta perfeita! Em extremidades, o torniquete bem aplicado salva vidas de forma rápida e segura.', score: 35 },
      { id: 'stb-caso-5-b', text: 'Aplicar o torniquete diretamente sobre uma articulação (joelho/cotovelo) ou sobre a própria ferida aberta.', type: 'critical_error', feedback: 'Erro crítico! O torniquete nunca deve ser posicionado sobre articulações ou sobre a própria lesão.', score: -35 },
      { id: 'stb-caso-5-c', text: 'Lavar exaustivamente a ferida com soro fisiológico antes de tentar conter a perda volêmica.', type: 'incorrect', feedback: 'Em hemorragia exsanguinante, a prioridade máxima é a hemostasia imediata. A limpeza é secundária no centro cirúrgico.', score: -15 }
    ]
  }),
  buildCase({
    id: 'stb-caso-6',
    caseTitle: 'Caso 06 · Trauma Urbano',
    description: 'Cena Urbana · Ferimento Contuso (COXA) · Torniquete de membro aplicado na COXA acima da lesão com pressão circunferencial adequada sobre a artéria femoral.',
    characterId: 'stb-caso-6',
    focus: { x: 60, y: 32, size: 11, kind: 'arterial', mask: 'arterial' },
    focusTitle: 'Caso 06 · Trauma Urbano (COXA)',
    pattern: 'sangramento pulsátil em orifício arredondado (PAF)',
    location: 'região anatômica: COXA',
    action: 'Aplique compressão direta e prepare torniquete proximal.',
    escalation: 'O torniquete ocluiu com sucesso a artéria.',
    step1Options: [
      { id: 'stb-caso-6-a', text: 'Garantir segurança da cena, acionar socorro e aplicar torniquete comercial 5 a 7 cm proximal à lesão (ou raiz do membro) até o sangramento e o pulso distal cessarem.', type: 'essential', feedback: 'Conduta perfeita! Em extremidades, o torniquete bem aplicado salva vidas de forma rápida e segura.', score: 35 },
      { id: 'stb-caso-6-b', text: 'Aplicar o torniquete diretamente sobre uma articulação (joelho/cotovelo) ou sobre a própria ferida aberta.', type: 'critical_error', feedback: 'Erro crítico! O torniquete nunca deve ser posicionado sobre articulações ou sobre a própria lesão.', score: -35 },
      { id: 'stb-caso-6-c', text: 'Lavar exaustivamente a ferida com soro fisiológico antes de tentar conter a perda volêmica.', type: 'incorrect', feedback: 'Em hemorragia exsanguinante, a prioridade máxima é a hemostasia imediata. A limpeza é secundária no centro cirúrgico.', score: -15 }
    ]
  }),
  buildCase({
    id: 'stb-caso-7',
    caseTitle: 'Caso 07 · Trauma Urbano',
    description: 'Cena Urbana · Trauma Penetrante (PEITO / TÓRAX) · Ferimento penetrante no PEITO / TÓRAX esquerdo. Torniquete de membro é totalmente contraindicado e ineficaz (colocá-lo no membro não afeta vasos intratorácicos). Conduta padrão Stop the Bleed: Curativo Oclusivo/Valvulado (Selo de Tórax / Chest Seal) para prevenir pneumotórax hipertensivo + compressão direta. NUNCA realizar preenchimento (packing) intratorácico.',
    characterId: 'stb-caso-7',
    focus: { x: 69, y: 44, size: 11, kind: 'venous', mask: 'venous' },
    focusTitle: 'Caso 07 · Trauma Urbano (PEITO)',
    pattern: 'sangramento pulsátil em orifício arredondado (PAF)',
    location: 'região anatômica: PEITO',
    action: 'Aplique conduta específica para PEITO.',
    escalation: 'Hemostasia estabilizada conforme conduta de PEITO.',
    step1Options: [
      { id: 'stb-caso-7-a', text: 'Aplicar Curativo Valvulado / Selo de Tórax (Chest Seal) e compressão estéril; torniquete de membros é contraindicado no tórax.', type: 'essential', feedback: 'Conduta correta! Lesões torácicas exigem selo valvulado para prevenir pneumotórax hipertensivo. Torniquete no membro é ineficaz.', score: 35 },
      { id: 'stb-caso-7-b', text: 'Aplicar torniquete no braço e realizar preenchimento cavitário com gaze (wound packing) dentro do tórax.', type: 'critical_error', feedback: 'Erro letal! Torniquete não oclui vasos intratorácicos e wound packing no tórax agrava o colapso pulmonar.', score: -35 },
      { id: 'stb-caso-7-c', text: 'Manter a vítima deitada sem ocluir a ferida torácica enquanto aguarda a ambulância.', type: 'incorrect', feedback: 'A ferida torácica aberta permite entrada de ar atmosférico na cavidade pleural e deve ser ocluída imediatamente.', score: -15 }
    ]
  }),
  buildCase({
    id: 'stb-caso-8',
    caseTitle: 'Caso 08 · Trauma Urbano',
    description: 'Cena Urbana · Acidente Lacerante (ANTEBRAÇO) · Torniquete de extremidade posicionado no braço proximalmente à laceração arterial no ANTEBRAÇO, alcançando controle hemostático definitivo.',
    characterId: 'stb-caso-8',
    focus: { x: 67, y: 69, size: 11, kind: 'arterial', mask: 'arterial' },
    focusTitle: 'Caso 08 · Trauma Urbano (ANTEBRACO)',
    pattern: 'fluxo profuso de alta vazão por laceração',
    location: 'região anatômica: ANTEBRACO',
    action: 'Aplique compressão direta e prepare torniquete proximal.',
    escalation: 'O torniquete ocluiu com sucesso a artéria.',
    step1Options: [
      { id: 'stb-caso-8-a', text: 'Garantir segurança da cena, acionar socorro e aplicar torniquete comercial 5 a 7 cm proximal à lesão (ou raiz do membro) até o sangramento e o pulso distal cessarem.', type: 'essential', feedback: 'Conduta perfeita! Em extremidades, o torniquete bem aplicado salva vidas de forma rápida e segura.', score: 35 },
      { id: 'stb-caso-8-b', text: 'Aplicar o torniquete diretamente sobre uma articulação (joelho/cotovelo) ou sobre a própria ferida aberta.', type: 'critical_error', feedback: 'Erro crítico! O torniquete nunca deve ser posicionado sobre articulações ou sobre a própria lesão.', score: -35 },
      { id: 'stb-caso-8-c', text: 'Lavar exaustivamente a ferida com soro fisiológico antes de tentar conter a perda volêmica.', type: 'incorrect', feedback: 'Em hemorragia exsanguinante, a prioridade máxima é a hemostasia imediata. A limpeza é secundária no centro cirúrgico.', score: -15 }
    ]
  }),
  buildCase({
    id: 'stb-caso-9',
    caseTitle: 'Caso 09 · Estande de Tiro (PAF)',
    description: 'Cena Urbana · Trauma Penetrante (ABDOME) · Ferimento penetrante no ABDOME (região periumbilical). O torniquete é contraindicado por se tratar de lesão do tronco. Conduta mandatória: Compressão direta com gaze/campo estéril superficial e transporte imediato.',
    characterId: 'stb-caso-9',
    focus: { x: 52, y: 54, size: 11, kind: 'venous', mask: 'venous' },
    focusTitle: 'Caso 09 · Estande de Tiro (PAF) (ABDOME)',
    pattern: 'fluxo profuso de alta vazão por laceração',
    location: 'região anatômica: ABDOME',
    action: 'Aplique conduta específica para ABDOME.',
    escalation: 'Hemostasia estabilizada conforme conduta de ABDOME.',
    step1Options: [
      { id: 'stb-caso-9-a', text: 'Aplicar compressão direta superficial com campo estéril e preparar evacuação imediata; torniquetes são contraindicados para sangramento abdominal.', type: 'essential', feedback: 'Correto! Hemorragia abdominal é cavitária interna; torniquete de membros é inútil. Exige compressão superficial e centro cirúrgico.', score: 35 },
      { id: 'stb-caso-9-b', text: 'Aplicar torniquete de extremidades ou empacotar gaze profunda dentro da cavidade sobre as vísceras.', type: 'critical_error', feedback: 'Erro crítico! Torniquetes não atuam no abdome e empacotamento profundo sobre vísceras pode causar perfuração e contaminação bacteriana.', score: -35 },
      { id: 'stb-caso-9-c', text: 'Aguardar atendimento de emergência sem aplicar qualquer cobertura ou compressão.', type: 'incorrect', feedback: 'A ferida abdominal deve ser protegida com curativo estéril superficial para limitar exposição e contaminação.', score: -15 }
    ]
  }),
  buildCase({
    id: 'stb-caso-10',
    caseTitle: 'Caso 10 · Estande de Tiro (PAF)',
    description: 'Cena Urbana · Acidente Traumático (PERNA) · Torniquete aplicado acima da ferida na PERNA com oclusão das artérias tibial e fibular.',
    characterId: 'stb-caso-10',
    focus: { x: 68, y: 74, size: 11, kind: 'arterial', mask: 'arterial' },
    focusTitle: 'Caso 10 · Estande de Tiro (PAF) (PERNA)',
    pattern: 'fluxo profuso de alta vazão por laceração',
    location: 'região anatômica: PERNA',
    action: 'Aplique compressão direta e prepare torniquete proximal.',
    escalation: 'O torniquete ocluiu com sucesso a artéria.',
    step1Options: [
      { id: 'stb-caso-10-a', text: 'Garantir segurança da cena, acionar socorro e aplicar torniquete comercial 5 a 7 cm proximal à lesão (ou raiz do membro) até o sangramento e o pulso distal cessarem.', type: 'essential', feedback: 'Conduta perfeita! Em extremidades, o torniquete bem aplicado salva vidas de forma rápida e segura.', score: 35 },
      { id: 'stb-caso-10-b', text: 'Aplicar o torniquete diretamente sobre uma articulação (joelho/cotovelo) ou sobre a própria ferida aberta.', type: 'critical_error', feedback: 'Erro crítico! O torniquete nunca deve ser posicionado sobre articulações ou sobre a própria lesão.', score: -35 },
      { id: 'stb-caso-10-c', text: 'Lavar exaustivamente a ferida com soro fisiológico antes de tentar conter a perda volêmica.', type: 'incorrect', feedback: 'Em hemorragia exsanguinante, a prioridade máxima é a hemostasia imediata. A limpeza é secundária no centro cirúrgico.', score: -15 }
    ]
  }),
  buildCase({
    id: 'stb-caso-11',
    caseTitle: 'Caso 11 · Trauma Urbano',
    description: 'Estande de Tiro · Disparo / Ferimento (ROSTO / TESTA) · Ferimento no ROSTO / CABEÇA (região frontal/testa). O torniquete é TERMINANTEMENTE CONTRAINDICADO (letal se aplicado no pescoço; inútil no braço para sangramento craniofacial). Conduta mandatória: Compressão manual direta contínua e firme com compressa limpa, mantendo a via aérea desobstruída e alinhamento da coluna cervical.',
    characterId: 'stb-caso-11',
    focus: { x: 43, y: 13, size: 11, kind: 'venous', mask: 'venous' },
    focusTitle: 'Caso 11 · Trauma Urbano (ROSTO)',
    pattern: 'fluxo profuso de alta vazão por laceração',
    location: 'região anatômica: ROSTO',
    action: 'Aplique conduta específica para ROSTO.',
    escalation: 'Hemostasia estabilizada conforme conduta de ROSTO.',
    step1Options: [
      { id: 'stb-caso-11-a', text: 'Aplicar compressão manual direta seletiva e contínua com gaze limpa, mantendo vias aéreas livres e imobilização cervical.', type: 'essential', feedback: 'Excelente! No rosto e pescoço, a compressão manual direta contínua é a conduta correta, garantindo que as vias aéreas permaneçam pérvias.', score: 35 },
      { id: 'stb-caso-11-b', text: 'Aplicar torniquete cervical no pescoço ou no braço para estancar o sangramento facial.', type: 'critical_error', feedback: 'Erro gravíssimo e potencialmente fatal! Torniquete no pescoço causa asfixia imediata e colapso carotídeo bilateral; no membro é inútil para a cabeça.', score: -35 },
      { id: 'stb-caso-11-c', text: 'Inclinar a cabeça da vítima para trás sem exercer pressão direta.', type: 'incorrect', feedback: 'Inclinar a cabeça para trás pode fazer o sangue escorrer para as vias aéreas superiores gerando broncoaspiração.', score: -15 }
    ]
  }),
  buildCase({
    id: 'stb-caso-12',
    caseTitle: 'Caso 12 · Trauma Urbano',
    description: 'Cena Urbana · Trauma Penetrante (PEITO / TÓRAX SUPERIOR) · Ferimento penetrante no PEITO / TÓRAX superior (infraclavicular). Torniquetes de extremidades são ineficazes e contraindicados. Conduta padrão: Curativo oclusivo/valvulado e compressão manual direta estéril. Não realizar preenchimento profundo de cavidade torácica.',
    characterId: 'stb-caso-12',
    focus: { x: 51, y: 43, size: 11, kind: 'venous', mask: 'venous' },
    focusTitle: 'Caso 12 · Trauma Urbano (PEITO)',
    pattern: 'fluxo profuso de alta vazão por laceração',
    location: 'região anatômica: PEITO',
    action: 'Aplique conduta específica para PEITO.',
    escalation: 'Hemostasia estabilizada conforme conduta de PEITO.',
    step1Options: [
      { id: 'stb-caso-12-a', text: 'Aplicar Curativo Valvulado / Selo de Tórax (Chest Seal) e compressão estéril; torniquete de membros é contraindicado no tórax.', type: 'essential', feedback: 'Conduta correta! Lesões torácicas exigem selo valvulado para prevenir pneumotórax hipertensivo. Torniquete no membro é ineficaz.', score: 35 },
      { id: 'stb-caso-12-b', text: 'Aplicar torniquete no braço e realizar preenchimento cavitário com gaze (wound packing) dentro do tórax.', type: 'critical_error', feedback: 'Erro letal! Torniquete não oclui vasos intratorácicos e wound packing no tórax agrava o colapso pulmonar.', score: -35 },
      { id: 'stb-caso-12-c', text: 'Manter a vítima deitada sem ocluir a ferida torácica enquanto aguarda a ambulância.', type: 'incorrect', feedback: 'A ferida torácica aberta permite entrada de ar atmosférico na cavidade pleural e deve ser ocluída imediatamente.', score: -15 }
    ]
  }),
  buildCase({
    id: 'stb-caso-13',
    caseTitle: 'Caso 13 · Estande de Tiro (PAF)',
    description: 'Cena Urbana · Trauma Penetrante (ABDOME) · Ferimento penetrante no ABDOME. Torniquetes de membros são contraindicados e ineficazes para conter sangramento abdominal. Conduta mandatória: Compressão direta estéril superficial e rápida evacuação cirúrgica.',
    characterId: 'stb-caso-13',
    focus: { x: 43, y: 61, size: 11, kind: 'venous', mask: 'venous' },
    focusTitle: 'Caso 13 · Estande de Tiro (PAF) (ABDOME)',
    pattern: 'fluxo profuso de alta vazão por laceração',
    location: 'região anatômica: ABDOME',
    action: 'Aplique conduta específica para ABDOME.',
    escalation: 'Hemostasia estabilizada conforme conduta de ABDOME.',
    step1Options: [
      { id: 'stb-caso-13-a', text: 'Aplicar compressão direta superficial com campo estéril e preparar evacuação imediata; torniquetes são contraindicados para sangramento abdominal.', type: 'essential', feedback: 'Correto! Hemorragia abdominal é cavitária interna; torniquete de membros é inútil. Exige compressão superficial e centro cirúrgico.', score: 35 },
      { id: 'stb-caso-13-b', text: 'Aplicar torniquete de extremidades ou empacotar gaze profunda dentro da cavidade sobre as vísceras.', type: 'critical_error', feedback: 'Erro crítico! Torniquetes não atuam no abdome e empacotamento profundo sobre vísceras pode causar perfuração e contaminação bacteriana.', score: -35 },
      { id: 'stb-caso-13-c', text: 'Aguardar atendimento de emergência sem aplicar qualquer cobertura ou compressão.', type: 'incorrect', feedback: 'A ferida abdominal deve ser protegida com curativo estéril superficial para limitar exposição e contaminação.', score: -15 }
    ]
  }),
  buildCase({
    id: 'stb-caso-14',
    caseTitle: 'Caso 14 · Trauma Urbano',
    description: 'Cena Urbana · Trauma Penetrante (ABDOME / EPIGÁSTRIO) · Ferimento penetrante no ABDOME SUPERIOR (epigástrio). Torniquete de membros é contraindicado. Conduta mandatória: Compressão direta com curativo estéril sem empacotamento visceral profundo.',
    characterId: 'stb-caso-14',
    focus: { x: 53, y: 45, size: 11, kind: 'venous', mask: 'venous' },
    focusTitle: 'Caso 14 · Trauma Urbano (ABDOME)',
    pattern: 'fluxo profuso de alta vazão por laceração',
    location: 'região anatômica: ABDOME',
    action: 'Aplique conduta específica para ABDOME.',
    escalation: 'Hemostasia estabilizada conforme conduta de ABDOME.',
    step1Options: [
      { id: 'stb-caso-14-a', text: 'Aplicar compressão direta superficial com campo estéril e preparar evacuação imediata; torniquetes são contraindicados para sangramento abdominal.', type: 'essential', feedback: 'Correto! Hemorragia abdominal é cavitária interna; torniquete de membros é inútil. Exige compressão superficial e centro cirúrgico.', score: 35 },
      { id: 'stb-caso-14-b', text: 'Aplicar torniquete de extremidades ou empacotar gaze profunda dentro da cavidade sobre as vísceras.', type: 'critical_error', feedback: 'Erro crítico! Torniquetes não atuam no abdome e empacotamento profundo sobre vísceras pode causar perfuração e contaminação bacteriana.', score: -35 },
      { id: 'stb-caso-14-c', text: 'Aguardar atendimento de emergência sem aplicar qualquer cobertura ou compressão.', type: 'incorrect', feedback: 'A ferida abdominal deve ser protegida com curativo estéril superficial para limitar exposição e contaminação.', score: -15 }
    ]
  }),
  buildCase({
    id: 'stb-caso-15',
    caseTitle: 'Caso 15 · Estande de Tiro (PAF)',
    description: 'Cena Urbana · Acidente Lacerante (PUNHO / ANTEBRAÇO) · Torniquete de extremidade posicionado no braço proximalmente ao ferimento arterial no ANTEBRAÇO/PUNHO, garantindo controle hemostático pré-hospitalar.',
    characterId: 'stb-caso-15',
    focus: { x: 77, y: 86, size: 11, kind: 'arterial', mask: 'arterial' },
    focusTitle: 'Caso 15 · Estande de Tiro (PAF) (ANTEBRACO)',
    pattern: 'fluxo profuso de alta vazão por laceração',
    location: 'região anatômica: ANTEBRACO',
    action: 'Aplique compressão direta e prepare torniquete proximal.',
    escalation: 'O torniquete ocluiu com sucesso a artéria.',
    step1Options: [
      { id: 'stb-caso-15-a', text: 'Garantir segurança da cena, acionar socorro e aplicar torniquete comercial 5 a 7 cm proximal à lesão (ou raiz do membro) até o sangramento e o pulso distal cessarem.', type: 'essential', feedback: 'Conduta perfeita! Em extremidades, o torniquete bem aplicado salva vidas de forma rápida e segura.', score: 35 },
      { id: 'stb-caso-15-b', text: 'Aplicar o torniquete diretamente sobre uma articulação (joelho/cotovelo) ou sobre a própria ferida aberta.', type: 'critical_error', feedback: 'Erro crítico! O torniquete nunca deve ser posicionado sobre articulações ou sobre a própria lesão.', score: -35 },
      { id: 'stb-caso-15-c', text: 'Lavar exaustivamente a ferida com soro fisiológico antes de tentar conter a perda volêmica.', type: 'incorrect', feedback: 'Em hemorragia exsanguinante, a prioridade máxima é a hemostasia imediata. A limpeza é secundária no centro cirúrgico.', score: -15 }
    ]
  }),
  buildCase({
    id: 'stb-caso-16',
    caseTitle: 'Caso 16 · Trauma Urbano',
    description: 'Cena Urbana · Acidente Lacerante (PERNA) · Torniquete posicionado proximalmente ao ferimento na PERNA com cessação da perda volêmica arterial.',
    characterId: 'stb-caso-16',
    focus: { x: 68, y: 77, size: 11, kind: 'arterial', mask: 'arterial' },
    focusTitle: 'Caso 16 · Trauma Urbano (PERNA)',
    pattern: 'fluxo profuso de alta vazão por laceração',
    location: 'região anatômica: PERNA',
    action: 'Aplique compressão direta e prepare torniquete proximal.',
    escalation: 'O torniquete ocluiu com sucesso a artéria.',
    step1Options: [
      { id: 'stb-caso-16-a', text: 'Garantir segurança da cena, acionar socorro e aplicar torniquete comercial 5 a 7 cm proximal à lesão (ou raiz do membro) até o sangramento e o pulso distal cessarem.', type: 'essential', feedback: 'Conduta perfeita! Em extremidades, o torniquete bem aplicado salva vidas de forma rápida e segura.', score: 35 },
      { id: 'stb-caso-16-b', text: 'Aplicar o torniquete diretamente sobre uma articulação (joelho/cotovelo) ou sobre a própria ferida aberta.', type: 'critical_error', feedback: 'Erro crítico! O torniquete nunca deve ser posicionado sobre articulações ou sobre a própria lesão.', score: -35 },
      { id: 'stb-caso-16-c', text: 'Lavar exaustivamente a ferida com soro fisiológico antes de tentar conter a perda volêmica.', type: 'incorrect', feedback: 'Em hemorragia exsanguinante, a prioridade máxima é a hemostasia imediata. A limpeza é secundária no centro cirúrgico.', score: -15 }
    ]
  }),
  buildCase({
    id: 'stb-caso-17',
    caseTitle: 'Caso 17 · Trauma Urbano',
    description: 'Cena Urbana · Ferimento Lacerante (ANTEBRAÇO) · Torniquete comercial posicionado no braço acima da lesão no ANTEBRAÇO, interrompendo a hemorragia das artérias radial e ulnar.',
    characterId: 'stb-caso-17',
    focus: { x: 70, y: 75, size: 11, kind: 'arterial', mask: 'arterial' },
    focusTitle: 'Caso 17 · Trauma Urbano (ANTEBRACO)',
    pattern: 'fluxo profuso de alta vazão por laceração',
    location: 'região anatômica: ANTEBRACO',
    action: 'Aplique compressão direta e prepare torniquete proximal.',
    escalation: 'O torniquete ocluiu com sucesso a artéria.',
    step1Options: [
      { id: 'stb-caso-17-a', text: 'Garantir segurança da cena, acionar socorro e aplicar torniquete comercial 5 a 7 cm proximal à lesão (ou raiz do membro) até o sangramento e o pulso distal cessarem.', type: 'essential', feedback: 'Conduta perfeita! Em extremidades, o torniquete bem aplicado salva vidas de forma rápida e segura.', score: 35 },
      { id: 'stb-caso-17-b', text: 'Aplicar o torniquete diretamente sobre uma articulação (joelho/cotovelo) ou sobre a própria ferida aberta.', type: 'critical_error', feedback: 'Erro crítico! O torniquete nunca deve ser posicionado sobre articulações ou sobre a própria lesão.', score: -35 },
      { id: 'stb-caso-17-c', text: 'Lavar exaustivamente a ferida com soro fisiológico antes de tentar conter a perda volêmica.', type: 'incorrect', feedback: 'Em hemorragia exsanguinante, a prioridade máxima é a hemostasia imediata. A limpeza é secundária no centro cirúrgico.', score: -15 }
    ]
  }),
  buildCase({
    id: 'stb-caso-18',
    caseTitle: 'Caso 18 · Trauma Urbano',
    description: 'Cena Urbana · Trauma Penetrante (BRAÇO) · Torniquete posicionado no BRAÇO, 5 a 7 cm proximal à lesão exsanguinante com aperto suficiente para ausência de pulso distal.',
    characterId: 'stb-caso-18',
    focus: { x: 68, y: 55, size: 11, kind: 'arterial', mask: 'arterial' },
    focusTitle: 'Caso 18 · Trauma Urbano (BRACO)',
    pattern: 'sangramento pulsátil em orifício arredondado (PAF)',
    location: 'região anatômica: BRACO',
    action: 'Aplique compressão direta e prepare torniquete proximal.',
    escalation: 'O torniquete ocluiu com sucesso a artéria.',
    step1Options: [
      { id: 'stb-caso-18-a', text: 'Garantir segurança da cena, acionar socorro e aplicar torniquete comercial 5 a 7 cm proximal à lesão (ou raiz do membro) até o sangramento e o pulso distal cessarem.', type: 'essential', feedback: 'Conduta perfeita! Em extremidades, o torniquete bem aplicado salva vidas de forma rápida e segura.', score: 35 },
      { id: 'stb-caso-18-b', text: 'Aplicar o torniquete diretamente sobre uma articulação (joelho/cotovelo) ou sobre a própria ferida aberta.', type: 'critical_error', feedback: 'Erro crítico! O torniquete nunca deve ser posicionado sobre articulações ou sobre a própria lesão.', score: -35 },
      { id: 'stb-caso-18-c', text: 'Lavar exaustivamente a ferida com soro fisiológico antes de tentar conter a perda volêmica.', type: 'incorrect', feedback: 'Em hemorragia exsanguinante, a prioridade máxima é a hemostasia imediata. A limpeza é secundária no centro cirúrgico.', score: -15 }
    ]
  }),
  buildCase({
    id: 'stb-caso-19',
    caseTitle: 'Caso 19 · Estande de Tiro (PAF)',
    description: 'Cena Urbana · Trauma Penetrante (ROSTO / PESCOÇO LATERAL) · Ferimento na região MANDIBULAR / CERVICAL / ROSTO. Torniquetes são TERMINANTEMENTE CONTRAINDICADOS (aplicação cervical leva a asfixia mecânica, isquemia cerebral aguda e óbito imediato; aplicação em membros não reduz fluxo cervical). Conduta obrigatória: Compressão manual direta seletiva sobre o ponto de sangramento com gaze hemostática sem ocluir a via aérea contralateral ou comprimir ambas as carótidas.',
    characterId: 'stb-caso-19',
    focus: { x: 47, y: 23, size: 11, kind: 'venous', mask: 'venous' },
    focusTitle: 'Caso 19 · Estande de Tiro (PAF) (ROSTO)',
    pattern: 'sangramento pulsátil em orifício arredondado (PAF)',
    location: 'região anatômica: ROSTO',
    action: 'Aplique conduta específica para ROSTO.',
    escalation: 'Hemostasia estabilizada conforme conduta de ROSTO.',
    step1Options: [
      { id: 'stb-caso-19-a', text: 'Aplicar compressão manual direta seletiva e contínua com gaze limpa, mantendo vias aéreas livres e imobilização cervical.', type: 'essential', feedback: 'Excelente! No rosto e pescoço, a compressão manual direta contínua é a conduta correta, garantindo que as vias aéreas permaneçam pérvias.', score: 35 },
      { id: 'stb-caso-19-b', text: 'Aplicar torniquete cervical no pescoço ou no braço para estancar o sangramento facial.', type: 'critical_error', feedback: 'Erro gravíssimo e potencialmente fatal! Torniquete no pescoço causa asfixia imediata e colapso carotídeo bilateral; no membro é inútil para a cabeça.', score: -35 },
      { id: 'stb-caso-19-c', text: 'Inclinar a cabeça da vítima para trás sem exercer pressão direta.', type: 'incorrect', feedback: 'Inclinar a cabeça para trás pode fazer o sangue escorrer para as vias aéreas superiores gerando broncoaspiração.', score: -15 }
    ]
  }),
  buildCase({
    id: 'stb-caso-20',
    caseTitle: 'Caso 20 · Estande de Tiro (PAF)',
    description: 'Cena Urbana · Trauma Penetrante (COXA) · Torniquete comercial posicionado na raiz da COXA proximal ao ferimento exsanguinante, com rotação completa da barra do molinete.',
    characterId: 'stb-caso-20',
    focus: { x: 52, y: 62, size: 11, kind: 'arterial', mask: 'arterial' },
    focusTitle: 'Caso 20 · Estande de Tiro (PAF) (COXA)',
    pattern: 'sangramento pulsátil em orifício arredondado (PAF)',
    location: 'região anatômica: COXA',
    action: 'Aplique compressão direta e prepare torniquete proximal.',
    escalation: 'O torniquete ocluiu com sucesso a artéria.',
    step1Options: [
      { id: 'stb-caso-20-a', text: 'Garantir segurança da cena, acionar socorro e aplicar torniquete comercial 5 a 7 cm proximal à lesão (ou raiz do membro) até o sangramento e o pulso distal cessarem.', type: 'essential', feedback: 'Conduta perfeita! Em extremidades, o torniquete bem aplicado salva vidas de forma rápida e segura.', score: 35 },
      { id: 'stb-caso-20-b', text: 'Aplicar o torniquete diretamente sobre uma articulação (joelho/cotovelo) ou sobre a própria ferida aberta.', type: 'critical_error', feedback: 'Erro crítico! O torniquete nunca deve ser posicionado sobre articulações ou sobre a própria lesão.', score: -35 },
      { id: 'stb-caso-20-c', text: 'Lavar exaustivamente a ferida com soro fisiológico antes de tentar conter a perda volêmica.', type: 'incorrect', feedback: 'Em hemorragia exsanguinante, a prioridade máxima é a hemostasia imediata. A limpeza é secundária no centro cirúrgico.', score: -15 }
    ]
  }),
  buildCase({
    id: 'stb-caso-21',
    caseTitle: 'Caso 21 · Estande de Tiro (PAF)',
    description: 'Cena Urbana · Trauma Penetrante (PERNA) · Torniquete posicionado proximalmente na extremidade inferior, controlando com segurança o sangramento na PERNA.',
    characterId: 'stb-caso-21',
    focus: { x: 62, y: 69, size: 11, kind: 'arterial', mask: 'arterial' },
    focusTitle: 'Caso 21 · Estande de Tiro (PAF) (PERNA)',
    pattern: 'sangramento pulsátil em orifício arredondado (PAF)',
    location: 'região anatômica: PERNA',
    action: 'Aplique compressão direta e prepare torniquete proximal.',
    escalation: 'O torniquete ocluiu com sucesso a artéria.',
    step1Options: [
      { id: 'stb-caso-21-a', text: 'Garantir segurança da cena, acionar socorro e aplicar torniquete comercial 5 a 7 cm proximal à lesão (ou raiz do membro) até o sangramento e o pulso distal cessarem.', type: 'essential', feedback: 'Conduta perfeita! Em extremidades, o torniquete bem aplicado salva vidas de forma rápida e segura.', score: 35 },
      { id: 'stb-caso-21-b', text: 'Aplicar o torniquete diretamente sobre uma articulação (joelho/cotovelo) ou sobre a própria ferida aberta.', type: 'critical_error', feedback: 'Erro crítico! O torniquete nunca deve ser posicionado sobre articulações ou sobre a própria lesão.', score: -35 },
      { id: 'stb-caso-21-c', text: 'Lavar exaustivamente a ferida com soro fisiológico antes de tentar conter a perda volêmica.', type: 'incorrect', feedback: 'Em hemorragia exsanguinante, a prioridade máxima é a hemostasia imediata. A limpeza é secundária no centro cirúrgico.', score: -15 }
    ]
  }),
  buildCase({
    id: 'stb-caso-22',
    caseTitle: 'Caso 22 · Trauma Urbano',
    description: 'Cena Urbana · Ferimento Lacerante (ANTEBRAÇO) · Torniquete de membro aplicado no braço acima da lesão no ANTEBRAÇO, interrompendo o sangramento arterial.',
    characterId: 'stb-caso-22',
    focus: { x: 61, y: 60, size: 11, kind: 'arterial', mask: 'arterial' },
    focusTitle: 'Caso 22 · Trauma Urbano (ANTEBRACO)',
    pattern: 'sangramento pulsátil em orifício arredondado (PAF)',
    location: 'região anatômica: ANTEBRACO',
    action: 'Aplique compressão direta e prepare torniquete proximal.',
    escalation: 'O torniquete ocluiu com sucesso a artéria.',
    step1Options: [
      { id: 'stb-caso-22-a', text: 'Garantir segurança da cena, acionar socorro e aplicar torniquete comercial 5 a 7 cm proximal à lesão (ou raiz do membro) até o sangramento e o pulso distal cessarem.', type: 'essential', feedback: 'Conduta perfeita! Em extremidades, o torniquete bem aplicado salva vidas de forma rápida e segura.', score: 35 },
      { id: 'stb-caso-22-b', text: 'Aplicar o torniquete diretamente sobre uma articulação (joelho/cotovelo) ou sobre a própria ferida aberta.', type: 'critical_error', feedback: 'Erro crítico! O torniquete nunca deve ser posicionado sobre articulações ou sobre a própria lesão.', score: -35 },
      { id: 'stb-caso-22-c', text: 'Lavar exaustivamente a ferida com soro fisiológico antes de tentar conter a perda volêmica.', type: 'incorrect', feedback: 'Em hemorragia exsanguinante, a prioridade máxima é a hemostasia imediata. A limpeza é secundária no centro cirúrgico.', score: -15 }
    ]
  }),
  buildCase({
    id: 'stb-caso-23',
    caseTitle: 'Caso 23 · Trauma Urbano',
    description: 'Cena Urbana · Trauma Penetrante (BRAÇO) · Torniquete aplicado no BRAÇO proximal à ferida exsanguinante com controle eficaz da artéria braquial.',
    characterId: 'stb-caso-23',
    focus: { x: 66, y: 64, size: 11, kind: 'arterial', mask: 'arterial' },
    focusTitle: 'Caso 23 · Trauma Urbano (BRACO)',
    pattern: 'fluxo profuso de alta vazão por laceração',
    location: 'região anatômica: BRACO',
    action: 'Aplique compressão direta e prepare torniquete proximal.',
    escalation: 'O torniquete ocluiu com sucesso a artéria.',
    step1Options: [
      { id: 'stb-caso-23-a', text: 'Garantir segurança da cena, acionar socorro e aplicar torniquete comercial 5 a 7 cm proximal à lesão (ou raiz do membro) até o sangramento e o pulso distal cessarem.', type: 'essential', feedback: 'Conduta perfeita! Em extremidades, o torniquete bem aplicado salva vidas de forma rápida e segura.', score: 35 },
      { id: 'stb-caso-23-b', text: 'Aplicar o torniquete diretamente sobre uma articulação (joelho/cotovelo) ou sobre a própria ferida aberta.', type: 'critical_error', feedback: 'Erro crítico! O torniquete nunca deve ser posicionado sobre articulações ou sobre a própria lesão.', score: -35 },
      { id: 'stb-caso-23-c', text: 'Lavar exaustivamente a ferida com soro fisiológico antes de tentar conter a perda volêmica.', type: 'incorrect', feedback: 'Em hemorragia exsanguinante, a prioridade máxima é a hemostasia imediata. A limpeza é secundária no centro cirúrgico.', score: -15 }
    ]
  }),
  buildCase({
    id: 'stb-caso-24',
    caseTitle: 'Caso 24 · Trauma Urbano',
    description: 'Cena Urbana · Acidente Traumático (PERNA / TORNOZELO) · Torniquete de extremidade posicionado acima da lesão distal na PERNA, cessando a perda volêmica.',
    characterId: 'stb-caso-24',
    focus: { x: 73, y: 78, size: 11, kind: 'arterial', mask: 'arterial' },
    focusTitle: 'Caso 24 · Trauma Urbano (PERNA)',
    pattern: 'fluxo profuso de alta vazão por laceração',
    location: 'região anatômica: PERNA',
    action: 'Aplique compressão direta e prepare torniquete proximal.',
    escalation: 'O torniquete ocluiu com sucesso a artéria.',
    step1Options: [
      { id: 'stb-caso-24-a', text: 'Garantir segurança da cena, acionar socorro e aplicar torniquete comercial 5 a 7 cm proximal à lesão (ou raiz do membro) até o sangramento e o pulso distal cessarem.', type: 'essential', feedback: 'Conduta perfeita! Em extremidades, o torniquete bem aplicado salva vidas de forma rápida e segura.', score: 35 },
      { id: 'stb-caso-24-b', text: 'Aplicar o torniquete diretamente sobre uma articulação (joelho/cotovelo) ou sobre a própria ferida aberta.', type: 'critical_error', feedback: 'Erro crítico! O torniquete nunca deve ser posicionado sobre articulações ou sobre a própria lesão.', score: -35 },
      { id: 'stb-caso-24-c', text: 'Lavar exaustivamente a ferida com soro fisiológico antes de tentar conter a perda volêmica.', type: 'incorrect', feedback: 'Em hemorragia exsanguinante, a prioridade máxima é a hemostasia imediata. A limpeza é secundária no centro cirúrgico.', score: -15 }
    ]
  }),
  buildCase({
    id: 'stb-caso-25',
    caseTitle: 'Caso 25 · Estande de Tiro (PAF)',
    description: 'Cena Urbana · Acidente Lacerante (ANTEBRAÇO) · Torniquete aplicado no braço proximalmente à lesão no ANTEBRAÇO, conduta recomendada pelo Stop the Bleed.',
    characterId: 'stb-caso-25',
    focus: { x: 33, y: 68, size: 11, kind: 'arterial', mask: 'arterial' },
    focusTitle: 'Caso 25 · Estande de Tiro (PAF) (ANTEBRACO)',
    pattern: 'sangramento pulsátil em orifício arredondado (PAF)',
    location: 'região anatômica: ANTEBRACO',
    action: 'Aplique compressão direta e prepare torniquete proximal.',
    escalation: 'O torniquete ocluiu com sucesso a artéria.',
    step1Options: [
      { id: 'stb-caso-25-a', text: 'Garantir segurança da cena, acionar socorro e aplicar torniquete comercial 5 a 7 cm proximal à lesão (ou raiz do membro) até o sangramento e o pulso distal cessarem.', type: 'essential', feedback: 'Conduta perfeita! Em extremidades, o torniquete bem aplicado salva vidas de forma rápida e segura.', score: 35 },
      { id: 'stb-caso-25-b', text: 'Aplicar o torniquete diretamente sobre uma articulação (joelho/cotovelo) ou sobre a própria ferida aberta.', type: 'critical_error', feedback: 'Erro crítico! O torniquete nunca deve ser posicionado sobre articulações ou sobre a própria lesão.', score: -35 },
      { id: 'stb-caso-25-c', text: 'Lavar exaustivamente a ferida com soro fisiológico antes de tentar conter a perda volêmica.', type: 'incorrect', feedback: 'Em hemorragia exsanguinante, a prioridade máxima é a hemostasia imediata. A limpeza é secundária no centro cirúrgico.', score: -15 }
    ]
  }),
  buildCase({
    id: 'stb-caso-26',
    caseTitle: 'Caso 26 · Estande de Tiro (PAF)',
    description: 'Cena Urbana · Trauma Penetrante (COXA) · Torniquete posicionado no membro inferior (COXA proximal), ocluindo com eficácia os ramos da artéria femoral.',
    characterId: 'stb-caso-26',
    focus: { x: 52, y: 62, size: 11, kind: 'arterial', mask: 'arterial' },
    focusTitle: 'Caso 26 · Estande de Tiro (PAF) (COXA)',
    pattern: 'sangramento pulsátil em orifício arredondado (PAF)',
    location: 'região anatômica: COXA',
    action: 'Aplique compressão direta e prepare torniquete proximal.',
    escalation: 'O torniquete ocluiu com sucesso a artéria.',
    step1Options: [
      { id: 'stb-caso-26-a', text: 'Garantir segurança da cena, acionar socorro e aplicar torniquete comercial 5 a 7 cm proximal à lesão (ou raiz do membro) até o sangramento e o pulso distal cessarem.', type: 'essential', feedback: 'Conduta perfeita! Em extremidades, o torniquete bem aplicado salva vidas de forma rápida e segura.', score: 35 },
      { id: 'stb-caso-26-b', text: 'Aplicar o torniquete diretamente sobre uma articulação (joelho/cotovelo) ou sobre a própria ferida aberta.', type: 'critical_error', feedback: 'Erro crítico! O torniquete nunca deve ser posicionado sobre articulações ou sobre a própria lesão.', score: -35 },
      { id: 'stb-caso-26-c', text: 'Lavar exaustivamente a ferida com soro fisiológico antes de tentar conter a perda volêmica.', type: 'incorrect', feedback: 'Em hemorragia exsanguinante, a prioridade máxima é a hemostasia imediata. A limpeza é secundária no centro cirúrgico.', score: -15 }
    ]
  }),
  buildCase({
    id: 'stb-caso-27',
    caseTitle: 'Caso 27 · Estande de Tiro (PAF)',
    description: 'Cena Urbana · Trauma Penetrante (ABDOME) · Ferimento perfurante no ABDOME. O torniquete é completamente contraindicado para lesões de tronco. Conduta mandatória: Cobertura com curativo estéril, compressão direta cuidadosa sem invaginação de gaze em vísceras e rápida evacuação para centro cirúrgico.',
    characterId: 'stb-caso-27',
    focus: { x: 47, y: 65, size: 11, kind: 'venous', mask: 'venous' },
    focusTitle: 'Caso 27 · Estande de Tiro (PAF) (ABDOME)',
    pattern: 'sangramento pulsátil em orifício arredondado (PAF)',
    location: 'região anatômica: ABDOME',
    action: 'Aplique conduta específica para ABDOME.',
    escalation: 'Hemostasia estabilizada conforme conduta de ABDOME.',
    step1Options: [
      { id: 'stb-caso-27-a', text: 'Aplicar compressão direta superficial com campo estéril e preparar evacuação imediata; torniquetes são contraindicados para sangramento abdominal.', type: 'essential', feedback: 'Correto! Hemorragia abdominal é cavitária interna; torniquete de membros é inútil. Exige compressão superficial e centro cirúrgico.', score: 35 },
      { id: 'stb-caso-27-b', text: 'Aplicar torniquete de extremidades ou empacotar gaze profunda dentro da cavidade sobre as vísceras.', type: 'critical_error', feedback: 'Erro crítico! Torniquetes não atuam no abdome e empacotamento profundo sobre vísceras pode causar perfuração e contaminação bacteriana.', score: -35 },
      { id: 'stb-caso-27-c', text: 'Aguardar atendimento de emergência sem aplicar qualquer cobertura ou compressão.', type: 'incorrect', feedback: 'A ferida abdominal deve ser protegida com curativo estéril superficial para limitar exposição e contaminação.', score: -15 }
    ]
  }),
];

export const stopTheBleedCases: SimulationCase[] = [...legacyStopTheBleedCases, ...generatedStopTheBleedCases].map((simulationCase) => {
  const caseId = Number(simulationCase.id.match(/caso-(\d+)/)?.[1]);
  const metadata = stopTheBleedCaseMetadata[caseId];
  return metadata ? { ...simulationCase, title: metadata.titulo, description: metadata.subtitulo } : simulationCase;
});

