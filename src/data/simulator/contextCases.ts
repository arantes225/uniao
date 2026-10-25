import type { BleedingFocus, SimulationCase, SimulationStep } from './types';
import { SHARED_ACTIONS, sharedOptions, type SharedActionKey } from './sharedActions';

type ContextTemplate = {
  incident: string;
  scene: string;
  location: string;
  mechanism: string;
  kind: BleedingFocus['kind'];
  primary: SharedActionKey;
  primaryDistractors: SharedActionKey[];
  variant: string;
};

const schoolTemplates: ContextTemplate[] = [
  { incident: 'corte em papelão na oficina de artes', scene: 'Durante uma atividade de artes, uma lâmina de estilete escapa da mão de um aluno e atinge o antebraço.', location: 'antebraço', mechanism: 'laceração profunda com fluxo contínuo', kind: 'venous', primary: 'direct-pressure', primaryDistractors: ['do-not-wash-first', 'do-not-use-powder', 'do-not-elevate'], variant: 'oficina de artes' },
  { incident: 'queda no parquinho', scene: 'No recreio, uma criança cai sobre uma quina metálica do brinquedo e a calça começa a encharcar de sangue.', location: 'coxa', mechanism: 'sangramento intenso de extremidade', kind: 'arterial', primary: 'tourniquet-limb', primaryDistractors: ['do-not-elevate', 'improvise-wire', 'do-not-wash-first'], variant: 'parquinho' },
  { incident: 'vidro quebrado na cantina', scene: 'Um copo se quebra na cantina. A estudante apresenta ferida aberta no punho, com sangue atravessando o pano colocado por um colega.', location: 'punho e antebraço', mechanism: 'sangramento persistente apesar de cobertura superficial', kind: 'arterial', primary: 'tourniquet-limb', primaryDistractors: ['do-not-wash-first', 'do-not-use-powder', 'do-not-elevate'], variant: 'cantina' },
  { incident: 'acidente na quadra', scene: 'Durante a aula de educação física, um aluno escorrega e bate a canela em uma estrutura quebrada, produzindo um corte que forma uma poça rapidamente.', location: 'perna', mechanism: 'fluxo intenso de extremidade', kind: 'arterial', primary: 'tourniquet-limb', primaryDistractors: ['do-not-elevate', 'do-not-wash-first', 'improvise-wire'], variant: 'quadra' },
  { incident: 'porta atingindo a mão', scene: 'Uma porta pesada fecha sobre a mão de uma funcionária. Há laceração na palma e sangramento que não cede com um lenço frouxo.', location: 'mão', mechanism: 'laceração com sangramento contínuo', kind: 'venous', primary: 'direct-pressure', primaryDistractors: ['do-not-probe', 'do-not-wash-first', 'do-not-use-powder'], variant: 'corredor' },
  { incident: 'queda com ferida no couro cabeludo', scene: 'Um estudante cai no corredor e bate a cabeça na quina de um banco. O couro cabeludo sangra bastante, mas não há objeto cravado.', location: 'couro cabeludo', mechanism: 'ferida muito vascularizada', kind: 'venous', primary: 'direct-pressure', primaryDistractors: ['do-not-probe', 'do-not-use-powder', 'do-not-tourniquet-trunk'], variant: 'corredor' },
  { incident: 'estilhaço no laboratório', scene: 'Após a quebra de um tubo de vidro, um aluno tem uma ferida profunda na panturrilha e fica pálido e confuso.', location: 'panturrilha', mechanism: 'sangramento grave com sinais de choque', kind: 'arterial', primary: 'tourniquet-limb', primaryDistractors: ['do-not-wash-first', 'do-not-elevate', 'improvise-wire'], variant: 'laboratório' },
  { incident: 'objeto empalado no pátio', scene: 'Uma criança cai sobre uma haste fina no pátio. O objeto permanece fixo na coxa e há sangue ao redor.', location: 'coxa', mechanism: 'ferida penetrante com objeto retido', kind: 'arterial', primary: 'secure-call', primaryDistractors: ['do-not-remove', 'do-not-wash-first', 'do-not-elevate'], variant: 'pátio' },
  { incident: 'corte em equipamento esportivo', scene: 'Na sala de esportes, uma aluna se corta em uma grade e o sangue escorre continuamente do braço.', location: 'braço', mechanism: 'laceração de extremidade', kind: 'venous', primary: 'direct-pressure', primaryDistractors: ['do-not-use-powder', 'do-not-wash-first', 'do-not-elevate'], variant: 'sala de esportes' },
  { incident: 'ferida na virilha após queda', scene: 'Durante uma gincana, um aluno cai sobre uma quina e apresenta ferida profunda na virilha, de difícil acesso.', location: 'virilha', mechanism: 'sangramento juncional', kind: 'junctional', primary: 'packing-junction', primaryDistractors: ['do-not-tourniquet-trunk', 'do-not-elevate', 'do-not-use-powder'], variant: 'gincana' },
  { incident: 'corte no rosto na oficina', scene: 'Uma ferramenta escapa na oficina escolar e produz um corte na bochecha. O sangue é volumoso, mas a via aérea está livre.', location: 'face', mechanism: 'sangramento facial com via aérea preservada', kind: 'venous', primary: 'direct-pressure', primaryDistractors: ['do-not-tourniquet-trunk', 'do-not-probe', 'do-not-use-powder'], variant: 'oficina escolar' },
  { incident: 'sangramento nasal após colisão', scene: 'Dois alunos colidem durante o recreio. Um deles tem epistaxe persistente e sangue escorrendo para a frente, sem sinais de inconsciência.', location: 'nariz', mechanism: 'sangramento nasal traumático', kind: 'venous', primary: 'direct-pressure', primaryDistractors: ['do-not-tourniquet-trunk', 'do-not-probe', 'do-not-use-powder'], variant: 'recreio' },
  { incident: 'mordida com ferida aberta', scene: 'Após uma briga, um aluno apresenta ferida sangrante no antebraço. A cena ainda tem colegas agitados ao redor.', location: 'antebraço', mechanism: 'ferida contaminada com sangramento ativo', kind: 'venous', primary: 'secure-call', primaryDistractors: ['do-not-wash-first', 'do-not-use-powder', 'do-not-probe'], variant: 'pátio' },
  { incident: 'amputação traumática em manutenção', scene: 'Um dedo fica preso em um equipamento da manutenção escolar. O coto sangra e o segmento está no chão, sem contato com gelo.', location: 'dedo e mão', mechanism: 'amputação distal com sangramento', kind: 'arterial', primary: 'direct-pressure', primaryDistractors: ['do-not-ice-directly', 'do-not-use-powder', 'do-not-wash-first'], variant: 'manutenção' },
  { incident: 'queda de bicicleta na saída', scene: 'Na saída da escola, uma bicicleta colide com um aluno. Há corte profundo no braço e o sangue atravessa duas compressas.', location: 'braço', mechanism: 'sangramento grave refratário à cobertura', kind: 'arterial', primary: 'tourniquet-limb', primaryDistractors: ['do-not-elevate', 'do-not-wash-first', 'improvise-wire'], variant: 'saída escolar' },
  { incident: 'acidente com tesoura', scene: 'Uma tesoura cai durante uma aula e causa ferida na coxa. O aluno está consciente, muito assustado e com roupa rapidamente encharcada.', location: 'coxa', mechanism: 'sangramento de grande vaso em extremidade', kind: 'arterial', primary: 'tourniquet-limb', primaryDistractors: ['do-not-wash-first', 'do-not-elevate', 'do-not-use-powder'], variant: 'sala de aula' },
  { incident: 'queda na escada', scene: 'Uma professora cai na escada, bate a testa e apresenta corte no couro cabeludo, sem afundamento ósseo aparente.', location: 'testa e couro cabeludo', mechanism: 'laceração externa de cabeça', kind: 'venous', primary: 'direct-pressure', primaryDistractors: ['do-not-probe', 'do-not-tourniquet-trunk', 'do-not-use-powder'], variant: 'escada' },
  { incident: 'acidente no refeitório', scene: 'Uma bandeja metálica corta a panturrilha de um funcionário. A ferida sangra de forma contínua e o chão começa a ficar escorregadio.', location: 'panturrilha', mechanism: 'laceração com perda progressiva', kind: 'venous', primary: 'direct-pressure', primaryDistractors: ['do-not-wash-first', 'do-not-elevate', 'do-not-use-powder'], variant: 'refeitório' },
  { incident: 'ferida no tórax por queda', scene: 'Um estudante cai sobre uma quina e apresenta ferida penetrante no tórax. Há dor e dificuldade respiratória crescente.', location: 'tórax', mechanism: 'ferida de tronco com risco respiratório', kind: 'venous', primary: 'cover-trunk', primaryDistractors: ['do-not-tourniquet-trunk', 'do-not-probe', 'do-not-use-powder'], variant: 'quadra' },
  { incident: 'corte na mão com estilete', scene: 'Durante maquete, um estilete corta a mão de uma aluna. O sangramento diminui quando a compressa é pressionada, mas retorna quando ela é levantada.', location: 'mão', mechanism: 'sangramento controlável por pressão', kind: 'venous', primary: 'direct-pressure', primaryDistractors: ['do-not-loosen', 'do-not-wash-first', 'do-not-use-powder'], variant: 'sala de artes' },
  { incident: 'ferida em aluno com anticoagulante', scene: 'Um adolescente com condição de saúde registrada sofre pequeno corte na canela que continua sangrando apesar de parecer superficial.', location: 'canela', mechanism: 'sangramento persistente em pessoa vulnerável', kind: 'venous', primary: 'direct-pressure', primaryDistractors: ['do-not-wash-first', 'do-not-use-powder', 'do-not-elevate'], variant: 'sala de aula' },
  { incident: 'queda no ônibus escolar', scene: 'Em uma freada, uma criança se machuca em uma peça interna e apresenta sangramento no antebraço. O ônibus está parado em local seguro.', location: 'antebraço', mechanism: 'laceração em ambiente de transporte', kind: 'venous', primary: 'secure-call', primaryDistractors: ['do-not-wash-first', 'do-not-elevate', 'do-not-use-powder'], variant: 'ônibus escolar' },
  { incident: 'acidente com ferramenta no jardim', scene: 'Um funcionário se corta com ferramenta de jardinagem e o sangue jorra de forma pulsátil pela perna.', location: 'perna', mechanism: 'hemorragia arterial de extremidade', kind: 'arterial', primary: 'tourniquet-limb', primaryDistractors: ['do-not-wash-first', 'improvise-wire', 'do-not-elevate'], variant: 'jardim' },
  { incident: 'ferida profunda na axila', scene: 'Durante uma brincadeira, um aluno cai sobre uma borda e tem ferida profunda na axila, com sangramento que reaparece quando a mão é retirada.', location: 'axila', mechanism: 'sangramento juncional', kind: 'junctional', primary: 'packing-junction', primaryDistractors: ['do-not-tourniquet-trunk', 'do-not-use-powder', 'do-not-elevate'], variant: 'pátio' }
];

const gymTemplates: ContextTemplate[] = [
  { incident: 'corte em anilha', scene: 'Na musculação, uma anilha cai e corta a panturrilha do aluno. O sangue forma uma poça crescente no piso.', location: 'panturrilha', mechanism: 'sangramento grave em extremidade', kind: 'arterial', primary: 'tourniquet-limb', primaryDistractors: ['do-not-elevate', 'do-not-wash-first', 'improvise-wire'], variant: 'musculação' },
  { incident: 'acidente no rack', scene: 'Durante um agachamento, uma peça metálica rasga o braço do praticante. O fluxo é contínuo e encharca a toalha.', location: 'braço', mechanism: 'laceração profunda de extremidade', kind: 'venous', primary: 'direct-pressure', primaryDistractors: ['do-not-wash-first', 'do-not-use-powder', 'do-not-elevate'], variant: 'rack de agachamento' },
  { incident: 'queda no crossfit', scene: 'No treino funcional, a atleta cai sobre uma quina e apresenta sangramento pulsátil na coxa, com palidez e fraqueza.', location: 'coxa', mechanism: 'hemorragia arterial com sinais de choque', kind: 'arterial', primary: 'tourniquet-limb', primaryDistractors: ['do-not-elevate', 'do-not-wash-first', 'improvise-wire'], variant: 'crossfit' },
  { incident: 'corte em cabo de aço', scene: 'Um cabo se rompe durante o exercício e atinge o antebraço do aluno. A compressa fica rapidamente encharcada.', location: 'antebraço', mechanism: 'sangramento grave refratário à pressão inicial', kind: 'arterial', primary: 'tourniquet-limb', primaryDistractors: ['do-not-wash-first', 'do-not-elevate', 'do-not-use-powder'], variant: 'sala de pesos' },
  { incident: 'queda na esteira', scene: 'Uma corredora cai da esteira e raspa profundamente a perna em uma lateral quebrada. Há perda contínua de sangue.', location: 'perna', mechanism: 'ferida lacerante com fluxo persistente', kind: 'venous', primary: 'direct-pressure', primaryDistractors: ['do-not-wash-first', 'do-not-elevate', 'do-not-use-powder'], variant: 'cardio' },
  { incident: 'ferida no vestiário', scene: 'Um vidro quebra no vestiário e corta o punho de um aluno. Ele quer lavar a ferida antes de qualquer outra medida.', location: 'punho', mechanism: 'laceração com sangramento ativo', kind: 'venous', primary: 'direct-pressure', primaryDistractors: ['do-not-wash-first', 'do-not-use-powder', 'do-not-elevate'], variant: 'vestiário' },
  { incident: 'barra atingindo o rosto', scene: 'Uma barra escapa e causa corte na face. O sangramento é volumoso, mas a pessoa fala com clareza e respira normalmente.', location: 'face', mechanism: 'sangramento facial externo', kind: 'venous', primary: 'direct-pressure', primaryDistractors: ['do-not-tourniquet-trunk', 'do-not-probe', 'do-not-use-powder'], variant: 'área de pesos' },
  { incident: 'corte na virilha com equipamento', scene: 'Uma alça rompe e causa ferida profunda na virilha do praticante, onde um torniquete comum não alcança.', location: 'virilha', mechanism: 'sangramento juncional de difícil compressão', kind: 'junctional', primary: 'packing-junction', primaryDistractors: ['do-not-tourniquet-trunk', 'do-not-elevate', 'do-not-use-powder'], variant: 'treino funcional' },
  { incident: 'trauma no tórax', scene: 'Durante um treino, a pessoa cai sobre uma estrutura e apresenta ferida penetrante no tórax, com respiração dolorosa.', location: 'tórax', mechanism: 'lesão de tronco com risco respiratório', kind: 'venous', primary: 'cover-trunk', primaryDistractors: ['do-not-tourniquet-trunk', 'do-not-probe', 'do-not-use-powder'], variant: 'sala de ginástica' },
  { incident: 'amputação distal em máquina', scene: 'Um dedo é lesionado por uma máquina de treino e o segmento fica separado. O coto apresenta sangramento ativo.', location: 'dedo e mão', mechanism: 'amputação distal', kind: 'arterial', primary: 'direct-pressure', primaryDistractors: ['do-not-ice-directly', 'do-not-use-powder', 'do-not-wash-first'], variant: 'sala de máquinas' },
  { incident: 'corte em aula de spinning', scene: 'Uma peça do equipamento corta a canela durante a aula. A vítima está ansiosa, mas consciente e colaborativa.', location: 'canela', mechanism: 'ferida de extremidade com sangramento contínuo', kind: 'venous', primary: 'direct-pressure', primaryDistractors: ['do-not-wash-first', 'do-not-elevate', 'do-not-use-powder'], variant: 'spinning' },
  { incident: 'queda no step', scene: 'A praticante cai e atinge o joelho em uma borda. O sangue é intenso e não cede com uma toalha colocada sem pressão.', location: 'perna e joelho', mechanism: 'ferida próxima a articulação', kind: 'venous', primary: 'direct-pressure', primaryDistractors: ['do-not-tourniquet-trunk', 'do-not-wash-first', 'do-not-elevate'], variant: 'aula coletiva' },
  { incident: 'acidente com corda naval', scene: 'A corda naval causa uma laceração profunda na mão. Um colega sugere passar álcool na ferida antes de comprimir.', location: 'mão', mechanism: 'sangramento externo com contaminação', kind: 'venous', primary: 'direct-pressure', primaryDistractors: ['do-not-wash-first', 'do-not-use-powder', 'do-not-probe'], variant: 'treino funcional' },
  { incident: 'ferida no ombro após queda', scene: 'Um aluno cai sobre uma peça metálica e apresenta ferida no ombro, com sangramento persistente e dor intensa.', location: 'ombro', mechanism: 'sangramento em região de transição', kind: 'junctional', primary: 'packing-junction', primaryDistractors: ['do-not-tourniquet-trunk', 'do-not-use-powder', 'do-not-elevate'], variant: 'área externa' },
  { incident: 'corte no pé no deck', scene: 'Um praticante pisa em uma lâmina esquecida no deck e tem sangramento significativo no pé, sem possibilidade de torniquete distal.', location: 'pé', mechanism: 'ferida distal com sangramento persistente', kind: 'venous', primary: 'direct-pressure', primaryDistractors: ['do-not-wash-first', 'do-not-elevate', 'do-not-use-powder'], variant: 'área externa' },
  { incident: 'queda em aula de luta', scene: 'Durante a aula, uma atleta bate a cabeça no tatame e em uma borda, produzindo laceração no couro cabeludo.', location: 'couro cabeludo', mechanism: 'ferida externa muito vascularizada', kind: 'venous', primary: 'direct-pressure', primaryDistractors: ['do-not-probe', 'do-not-tourniquet-trunk', 'do-not-use-powder'], variant: 'lutas' },
  { incident: 'corte por halter', scene: 'Um halter escorrega e abre ferida profunda no antebraço. O aluno insiste em manter o braço elevado sem comprimir.', location: 'antebraço', mechanism: 'sangramento que exige ação mecânica', kind: 'arterial', primary: 'direct-pressure', primaryDistractors: ['do-not-elevate', 'do-not-wash-first', 'do-not-use-powder'], variant: 'musculação' },
  { incident: 'ferida em usuário anticoagulado', scene: 'Uma pessoa idosa em uso de anticoagulante sofre pequeno corte no tornozelo e continua sangrando após vários minutos.', location: 'tornozelo', mechanism: 'sangramento persistente em pessoa vulnerável', kind: 'venous', primary: 'direct-pressure', primaryDistractors: ['do-not-wash-first', 'do-not-use-powder', 'do-not-elevate'], variant: 'academia inclusiva' },
  { incident: 'corte no abdome durante manutenção', scene: 'Durante um reparo autorizado, uma ferramenta causa ferida no abdome. Há dor intensa e sangramento externo, sem objeto retido.', location: 'abdome', mechanism: 'lesão de tronco sem indicação de torniquete', kind: 'venous', primary: 'cover-trunk', primaryDistractors: ['do-not-tourniquet-trunk', 'do-not-probe', 'do-not-use-powder'], variant: 'manutenção' },
  { incident: 'acidente em piscina', scene: 'Na área aquática, uma pessoa se corta em uma borda e sai da água com sangue escorrendo da coxa.', location: 'coxa', mechanism: 'hemorragia de extremidade após resgate', kind: 'arterial', primary: 'secure-call', primaryDistractors: ['do-not-wash-first', 'do-not-elevate', 'do-not-use-powder'], variant: 'piscina' },
  { incident: 'queda em trilha da academia', scene: 'Durante uma atividade externa, um praticante cai sobre uma pedra e apresenta ferida profunda na perna; o grupo está sem kit completo.', location: 'perna', mechanism: 'sangramento grave com recursos limitados', kind: 'arterial', primary: 'direct-pressure', primaryDistractors: ['improvise-wire', 'do-not-use-powder', 'do-not-wash-first'], variant: 'atividade ao ar livre' },
  { incident: 'corte em bicicleta ergométrica', scene: 'Uma peça solta corta o braço durante o exercício. A equipe da academia encontra compressas e luvas no armário de primeiros socorros.', location: 'braço', mechanism: 'laceração de extremidade com material disponível', kind: 'venous', primary: 'direct-pressure', primaryDistractors: ['do-not-wash-first', 'do-not-use-powder', 'do-not-elevate'], variant: 'cardio' },
  { incident: 'ferida na axila após queda', scene: 'Uma praticante cai sobre a lateral de uma estrutura e apresenta ferida profunda na axila, com sangramento que não é alcançado por faixa comum.', location: 'axila', mechanism: 'sangramento juncional', kind: 'junctional', primary: 'packing-junction', primaryDistractors: ['do-not-tourniquet-trunk', 'do-not-use-powder', 'do-not-elevate'], variant: 'sala de musculação' }
];

const academyCharacterIds = [
  'homem-branco-sentado', 'mulher-negra-sentada', 'homem-branco-deitado', 'mulher-negra-deitada',
  'idoso-negro-sentado', 'idoso-negro-deitado', 'idosa-branca-sentada', 'idosa-branca-deitada'
];

const schoolCharacterIds = [
  'professora-sentada', 'professora-deitada', 'zelador-sentado', 'zelador-deitado',
  'menina-sentada', 'menina-deitada', 'menino-sentado', 'menino-deitado',
  'bebe-sentado', 'bebe-deitado'
];

const visibleRegions = [
  { label: 'face exposta', x: 50, y: 24, woundShape: 'laceration' as const },
  { label: 'antebraço exposto', x: 38, y: 63, woundShape: 'laceration' as const },
  { label: 'mão exposta', x: 58, y: 68, woundShape: 'laceration' as const },
  { label: 'couro cabeludo exposto', x: 50, y: 13, woundShape: 'laceration' as const },
  { label: 'antebraço exposto', x: 63, y: 63, woundShape: 'laceration' as const },
  { label: 'bochecha exposta', x: 45, y: 25, woundShape: 'laceration' as const },
  { label: 'mão exposta', x: 42, y: 68, woundShape: 'puncture' as const },
  { label: 'antebraço exposto', x: 58, y: 60, woundShape: 'laceration' as const }
];

function makeStep(id: number, phase: string, scenarioText: string, bleeding: string, focus: BleedingFocus, correct: SharedActionKey, distractors: SharedActionKey[]): SimulationStep {
  return {
    id,
    phase,
    scenarioText,
    vitalSigns: {
      consciousness: id === 1 ? 'Consciente, ansioso e capaz de responder' : 'Consciente, pálido e sob observação',
      breathing: id === 1 ? '22 rpm' : '20 rpm',
      circulation: id === 1 ? 'Pulso rápido e periférico fino' : 'Pulso palpável; reavaliar tendência',
      bleeding
    },
    bleedingFocus: focus,
    options: sharedOptions(correct, distractors, focus.title)
  };
}

function makeContextCase(folder: 'escola' | 'academia', number: number, template: ContextTemplate): SimulationCase {
  const prefix = folder === 'escola' ? 'Escola' : 'Academia';
  const visibleRegion = visibleRegions[(number - 1) % visibleRegions.length];
  const characterId = (folder === 'escola' ? schoolCharacterIds : academyCharacterIds)[(number - 1) % (folder === 'escola' ? schoolCharacterIds.length : academyCharacterIds.length)];
  const exposedWoundText = `A lesão de referência está em ${visibleRegion.label}, com a pele totalmente exposta e sem roupa, faixa ou equipamento cobrindo o ferimento.`;
  const focus: BleedingFocus = {
    x: visibleRegion.x,
    y: visibleRegion.y,
    size: visibleRegion.woundShape === 'puncture' ? 8 : 10,
    kind: template.kind,
    title: `${prefix} · Caso ${String(number).padStart(3, '0')} · ${visibleRegion.label}`,
    appearance: `${template.mechanism}. ${exposedWoundText} Observe o corte/ferida, a velocidade do fluxo e sinais de hipoperfusão; a cor do sangue isoladamente não decide a gravidade.`,
    action: SHARED_ACTIONS[template.primary].text,
    mask: template.kind,
    woundShape: visibleRegion.woundShape,
    visibleRegion: visibleRegion.label,
    skinExposed: true
  };
  const caseId = `${folder}-hemorragia-${String(number).padStart(3, '0')}`;
  const secondCorrect = template.primary === 'tourniquet-limb' ? 'continue-pressure' : template.primary === 'packing-junction' ? 'continue-pressure' : 'pressure-dressing';
  const secondDistractors: SharedActionKey[] = template.primary === 'tourniquet-limb'
    ? ['do-not-loosen', 'do-not-use-powder', 'do-not-wash-first']
    : ['do-not-loosen', 'do-not-use-powder', 'do-not-elevate'];
  return {
    id: caseId,
    title: `${prefix} · ${String(number).padStart(3, '0')} · ${template.incident} · ${visibleRegion.label}`,
    description: `${template.variant} · ${exposedWoundText} Treino baseado nas apostilas H01–H07 e nos módulos ${folder === 'escola' ? 'E01–E07' : 'A01–A06'}.`,
    characterId,
    patientKind: folder,
    steps: [
      makeStep(1, 'Etapa 1: Segurança, reconhecimento e primeira ação', `${template.scene} ${exposedWoundText}`, `${template.mechanism}; risco de deterioração se não for controlado`, focus, template.primary, template.primaryDistractors),
      makeStep(2, 'Etapa 2: Hemostasia sustentada', `A equipe já identificou a fonte em ${visibleRegion.label}. O fluxo diminui quando a conduta é executada, mas retorna quando alguém interrompe a pressão. ${exposedWoundText}`, 'Sangramento parcialmente controlado; reavaliar continuamente', { ...focus, title: `${focus.title} · manutenção`, kind: 'controlled', woundShape: 'controlled', appearance: `A contenção inicial foi feita em ${visibleRegion.label}. A próxima ameaça é perder o coágulo, deixar a vítima esfriar ou não reconhecer retorno do sangramento.`, action: SHARED_ACTIONS[secondCorrect].text }, secondCorrect, secondDistractors),
      makeStep(3, 'Etapa 3: Reavaliação e transferência', `O resgate foi acionado. A vítima permanece vulnerável e precisa ser observada até a transferência. A área de ${visibleRegion.label} continua acessível para reavaliação, sem roupa cobrindo a lesão.`, 'Controlado sob observação; risco de recorrência', { ...focus, title: `${focus.title} · transferência`, kind: 'controlled', woundShape: 'controlled', appearance: `A ferida está protegida em ${visibleRegion.label}, mas o caso ainda é uma emergência. Monitore a vítima e não desfaça a intervenção eficaz.`, action: SHARED_ACTIONS['warm-monitor'].text }, 'warm-monitor', ['do-not-loosen', 'do-not-use-powder', 'do-not-ice-directly'])
    ]
  };
}

export const schoolCases: SimulationCase[] = Array.from({ length: 120 }, (_, index) => makeContextCase('escola', index + 1, schoolTemplates[index % schoolTemplates.length]));
export const gymCases: SimulationCase[] = Array.from({ length: 120 }, (_, index) => makeContextCase('academia', index + 1, gymTemplates[index % gymTemplates.length]));
