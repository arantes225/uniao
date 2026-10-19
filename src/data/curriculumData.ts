export interface Subtopic {
  id?: string;
  position: number;
  title: string;
  description?: string;
}

export interface ModuleQuestion {
  id?: string;
  position: number;
  stem: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface LearningModule {
  id: string;
  libraryId: string;
  code: string;
  title: string;
  description: string;
  learningObjectives?: string;
  targetAudience?: string;
  durationMinutes: number;
  workloadTheoretical: number;
  workloadPractical: number;
  prerequisites?: string;
  thumbnailUrl?: string;
  editorialStatus: 'draft' | 'in_production' | 'awaiting_review' | 'approved' | 'published' | 'archived';
  videoProvider: 'google_drive' | 'youtube' | 'vimeo' | 'custom';
  videoUrl?: string;
  videoDuration?: string;
  videoChapters?: Array<{ timestamp: string; title: string }>;
  materialTitle?: string;
  materialDescription?: string;
  materialPdfUrl?: string;
  materialAllowDownload: boolean;
  materialVersion: number;
  subtopics: Subtopic[];
  questions?: ModuleQuestion[];
}

export interface ContentLibrary {
  id: string;
  code: string;
  name: string;
  description: string;
  modulesCount: number;
}

export const INITIAL_LIBRARIES: ContentLibrary[] = [
  {
    id: 'core',
    code: 'core',
    name: 'Núcleo Compartilhado',
    description: 'Bases fundamentais do atendimento pré-hospitalar, suporte de vida e segurança da cena.',
    modulesCount: 12
  },
  {
    id: 'schools',
    code: 'schools',
    name: 'Primeiros Socorros em Escolas',
    description: 'Capacitação escolar em conformidade com a Lei Lucas (Lei nº 13.722/2018) e suporte pediátrico.',
    modulesCount: 7
  },
  {
    id: 'fitness',
    code: 'fitness',
    name: 'Emergências em Academias',
    description: 'Resposta a eventos cardiovasculares, metabólicos e musculoesqueléticos no esporte.',
    modulesCount: 6
  },
  {
    id: 'bleeding_control',
    code: 'bleeding_control',
    name: 'Controle de Hemorragias Graves',
    description: 'Doutrina técnica de contenção de hemorragias exsanguinantes, torniquetes e curativos hemostáticos.',
    modulesCount: 7
  },
  {
    id: 'companies',
    code: 'companies',
    name: 'Primeiros Socorros em Empresas',
    description: 'Segurança ocupacional, resposta a acidentes com máquinas, choque elétrico e traumas industriais.',
    modulesCount: 8
  }
];

export const INITIAL_40_MODULES: LearningModule[] = [
  // ==========================================
  // BIBLIOTECA 1 — NÚCLEO COMPARTILHADO (12)
  // ==========================================
  {
    id: 'C01',
    libraryId: 'core',
    code: 'C01',
    title: 'Fundamentos dos Primeiros Socorros e APH',
    description: 'Conceituação básica, limites de atuação e ética no atendimento pré-hospitalar.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'published',
    videoProvider: 'google_drive',
    videoUrl: 'https://drive.google.com/file/d/1DEMO_APH_FUNDAMENTOS/preview',
    videoDuration: '15 min',
    materialTitle: 'Apostila C01 — Fundamentos do APH.pdf',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Introdução ao atendimento pré-hospitalar' },
      { position: 2, title: 'Papel e limites de atuação do socorrista' },
      { position: 3, title: 'Anatomia e fisiologia aplicadas aos primeiros socorros' },
      { position: 4, title: 'Conceitos de urgência e emergência' },
      { position: 5, title: 'Princípios éticos e legais' },
      { position: 6, title: 'Prioridades no atendimento' }
    ]
  },
  {
    id: 'C02',
    libraryId: 'core',
    code: 'C02',
    title: 'Segurança da Cena e Biossegurança',
    description: 'Avaliação estrita de riscos, uso correto de EPIs e proteção da equipe de resposta.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'published',
    videoProvider: 'google_drive',
    videoUrl: 'https://drive.google.com/file/d/1DEMO_SEGURANCA_CENA/preview',
    videoDuration: '12 min',
    materialTitle: 'Apostila C02 — Segurança da Cena e Biossegurança.pdf',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Avaliação de riscos ambientais' },
      { position: 2, title: 'Autoproteção' },
      { position: 3, title: 'Equipamentos de proteção individual' },
      { position: 4, title: 'Exposição a sangue e fluidos' },
      { position: 5, title: 'Segurança no contato com vítimas' },
      { position: 6, title: 'Prevenção de acidentes e contaminações' }
    ]
  },
  {
    id: 'C03',
    libraryId: 'core',
    code: 'C03',
    title: 'Acionamento e Organização do Socorro',
    description: 'Fluxo comunicativo, despacho e integração com SAMU (192) e Bombeiros (193).',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'SAMU e Corpo de Bombeiros' },
      { position: 2, title: 'Informações essenciais ao chamado' },
      { position: 3, title: 'Comunicação com vítimas e testemunhas' },
      { position: 4, title: 'Trabalho em equipe' },
      { position: 5, title: 'Transferência de informações' },
      { position: 6, title: 'Organização da resposta até a chegada do socorro' }
    ]
  },
  {
    id: 'C04',
    libraryId: 'core',
    code: 'C04',
    title: 'Avaliação Inicial da Vítima',
    description: 'Protocolos de verificação de consciência, respiração e ameaças imediatas à sobrevivência.',
    durationMinutes: 50,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Abordagem inicial' },
      { position: 2, title: 'Verificação de responsividade' },
      { position: 3, title: 'Avaliação da respiração' },
      { position: 4, title: 'Reconhecimento de ameaças imediatas à vida' },
      { position: 5, title: 'Identificação de sinais de gravidade' },
      { position: 6, title: 'Reavaliação e monitoramento' }
    ]
  },
  {
    id: 'C05',
    libraryId: 'core',
    code: 'C05',
    title: 'Ressuscitação Cardiopulmonar no Adulto',
    description: 'Qualidade das compressões torácicas, posicionamento e suporte básico no adulto.',
    durationMinutes: 60,
    workloadTheoretical: 1,
    workloadPractical: 1,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Reconhecimento da parada cardiorrespiratória' },
      { position: 2, title: 'Cadeia de sobrevivência' },
      { position: 3, title: 'Qualidade das compressões torácicas' },
      { position: 4, title: 'Ventilações conforme o treinamento' },
      { position: 5, title: 'RCP com um ou mais socorristas' },
      { position: 6, title: 'Treinamento prático' }
    ]
  },
  {
    id: 'C06',
    libraryId: 'core',
    code: 'C06',
    title: 'Desfibrilador Externo Automático',
    description: 'Operação segura do DEA em ambiente público e integração com as compressões torácicas.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 1,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Princípios da desfibrilação' },
      { position: 2, title: 'Identificação e utilização do DEA' },
      { position: 3, title: 'Aplicação dos eletrodos' },
      { position: 4, title: 'Cuidados de segurança' },
      { position: 5, title: 'Integração com a RCP' },
      { position: 6, title: 'Simulações com equipamento de treinamento' }
    ]
  },
  {
    id: 'C07',
    libraryId: 'core',
    code: 'C07',
    title: 'Engasgo e Obstrução das Vias Aéreas',
    description: 'Manobras de desengasgo (Heimlich), abordagem na vítima consciente e inconsciente.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Anatomia funcional das vias aéreas' },
      { position: 2, title: 'Obstrução parcial e grave' },
      { position: 3, title: 'Abordagem do adulto' },
      { position: 4, title: 'Particularidades de crianças e lactentes' },
      { position: 5, title: 'Atendimento da vítima inconsciente' },
      { position: 6, title: 'Prevenção e simulações' }
    ]
  },
  {
    id: 'C08',
    libraryId: 'core',
    code: 'C08',
    title: 'Emergências Cardiovasculares e Neurológicas',
    description: 'Identificação de dor torácica aguda (IAM), escala de Cincinnati no AVC e conduta em convulsões.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Dor torácica' },
      { position: 2, title: 'Suspeita de infarto' },
      { position: 3, title: 'Identificação do AVC' },
      { position: 4, title: 'Síncope' },
      { position: 5, title: 'Crises convulsivas' },
      { position: 6, title: 'Perda de consciência e sinais de alerta' }
    ]
  },
  {
    id: 'C09',
    libraryId: 'core',
    code: 'C09',
    title: 'Emergências Respiratórias e Metabólicas',
    description: 'Abordagem da asma grave, hipoglicemia, anafilaxia e choque alérgico.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Dificuldade respiratória' },
      { position: 2, title: 'Asma' },
      { position: 3, title: 'Hipoglicemia' },
      { position: 4, title: 'Hiperglicemia com sinais de gravidade' },
      { position: 5, title: 'Anafilaxia' },
      { position: 6, title: 'Reconhecimento e abordagem inicial das emergências clínicas' }
    ]
  },
  {
    id: 'C10',
    libraryId: 'core',
    code: 'C10',
    title: 'Ferimentos e Controle Inicial de Sangramentos',
    description: 'Técnicas de compressão direta, curativos compressivos e identificação de hemorragias.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Tipos de ferimentos' },
      { position: 2, title: 'Proteção da ferida' },
      { position: 3, title: 'Reconhecimento de hemorragias' },
      { position: 4, title: 'Compressão direta' },
      { position: 5, title: 'Curativos' },
      { position: 6, title: 'Identificação de situações graves' }
    ]
  },
  {
    id: 'C11',
    libraryId: 'core',
    code: 'C11',
    title: 'Traumatismos e Lesões Musculoesqueléticas',
    description: 'Imobilizações provisórias de membros, prevenção de lesões vertebrais e alinhamento.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Mecanismos de trauma' },
      { position: 2, title: 'Fraturas' },
      { position: 3, title: 'Entorses e luxações' },
      { position: 4, title: 'Traumatismo craniano' },
      { position: 5, title: 'Suspeita de lesão vertebral' },
      { position: 6, title: 'Cuidados com a movimentação da vítima' }
    ]
  },
  {
    id: 'C12',
    libraryId: 'core',
    code: 'C12',
    title: 'Emergências Ambientais e Intoxicações',
    description: 'Tratamento imediato de queimaduras, acidentes elétricos, afogamento e intoxicações.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Queimaduras' },
      { position: 2, title: 'Emergências relacionadas ao calor e ao frio' },
      { position: 3, title: 'Acidentes elétricos' },
      { position: 4, title: 'Intoxicações' },
      { position: 5, title: 'Acidentes com animais' },
      { position: 6, title: 'Afogamento e segurança do socorrista' }
    ]
  },

  // ==========================================
  // BIBLIOTECA 2 — PRIMEIROS SOCORROS EM ESCOLAS (7)
  // ==========================================
  {
    id: 'E01',
    libraryId: 'schools',
    code: 'E01',
    title: 'Lei Lucas e Segurança no Ambiente Escolar',
    description: 'Diretrizes da Lei nº 13.722/2018, estruturação de kits e planos de emergência escolar.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Lei nº 13.722/2018' },
      { position: 2, title: 'Responsabilidades institucionais' },
      { position: 3, title: 'Identificação de riscos escolares' },
      { position: 4, title: 'Planejamento de capacitações' },
      { position: 5, title: 'Materiais e kits de primeiros socorros' },
      { position: 6, title: 'Prevenção e documentação' }
    ]
  },
  {
    id: 'E02',
    libraryId: 'schools',
    code: 'E02',
    title: 'Suporte Básico de Vida Pediátrico',
    description: 'RCP em crianças e lactentes, adaptações de técnica e utilização do DEA pediátrico.',
    durationMinutes: 50,
    workloadTheoretical: 1,
    workloadPractical: 1,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Particularidades anatômicas e fisiológicas pediátricas' },
      { position: 2, title: 'Reconhecimento da parada cardiorrespiratória' },
      { position: 3, title: 'RCP na criança' },
      { position: 4, title: 'RCP no lactente' },
      { position: 5, title: 'Utilização do DEA em pediatria' },
      { position: 6, title: 'Treinamento prático e simulações' }
    ]
  },
  {
    id: 'E03',
    libraryId: 'schools',
    code: 'E03',
    title: 'Engasgos e Acidentes Relacionados à Alimentação',
    description: 'Desobstrução de via aérea em bebês e crianças durante o lanche e refeições escolares.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Desenvolvimento infantil e risco de aspiração' },
      { position: 2, title: 'Obstrução em lactentes' },
      { position: 3, title: 'Obstrução em crianças' },
      { position: 4, title: 'Abordagem conforme a faixa etária' },
      { position: 5, title: 'Prevenção de engasgos em creches' },
      { position: 6, title: 'Simulação de emergência durante alimentação' }
    ]
  },
  {
    id: 'E04',
    libraryId: 'schools',
    code: 'E04',
    title: 'Emergências Clínicas na Infância',
    description: 'Manejo de convulsões febris, crises de broncoespasmo e perda transitória da consciência.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Convulsões febris e outras crises convulsivas' },
      { position: 2, title: 'Crises asmáticas' },
      { position: 3, title: 'Alterações da glicemia' },
      { position: 4, title: 'Febre e sinais de gravidade' },
      { position: 5, title: 'Desmaios e alterações de consciência' },
      { position: 6, title: 'Reconhecimento de situações de emergência' }
    ]
  },
  {
    id: 'E05',
    libraryId: 'schools',
    code: 'E05',
    title: 'Acidentes e Traumas no Ambiente Escolar',
    description: 'Quedas em playgrounds, TCE leve a moderado, avulsão dentária e escoriações.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Quedas e acidentes em playgrounds' },
      { position: 2, title: 'Traumatismo craniano' },
      { position: 3, title: 'Ferimentos e sangramentos' },
      { position: 4, title: 'Lesões dentárias' },
      { position: 5, title: 'Queimaduras e intoxicações' },
      { position: 6, title: 'Acidentes durante atividades físicas' }
    ]
  },
  {
    id: 'E06',
    libraryId: 'schools',
    code: 'E06',
    title: 'Alunos com Condições de Saúde Específicas',
    description: 'Planos de contingência para alunos com diabetes tipo 1, epilepsia diagnosticada e alergias severas.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Alergias e anafilaxia' },
      { position: 2, title: 'Diabetes no ambiente escolar' },
      { position: 3, title: 'Epilepsia' },
      { position: 4, title: 'Condições respiratórias crônicas' },
      { position: 5, title: 'Planos individuais de emergência' },
      { position: 6, title: 'Comunicação com familiares e profissionais responsáveis' }
    ]
  },
  {
    id: 'E07',
    libraryId: 'schools',
    code: 'E07',
    title: 'Protocolos, Prevenção e Simulações Escolares',
    description: 'Organização do corpo docente e funcionários para resposta integrada a incidentes.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 1,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Plano de emergência escolar' },
      { position: 2, title: 'Atribuições dos funcionários' },
      { position: 3, title: 'Acionamento dos serviços de saúde' },
      { position: 4, title: 'Comunicação com responsáveis' },
      { position: 5, title: 'Preparação de equipamentos e materiais' },
      { position: 6, title: 'Simulações integradas' }
    ]
  },

  // ==========================================
  // BIBLIOTECA 3 — EMERGÊNCIAS EM ACADEMIAS (6)
  // ==========================================
  {
    id: 'A01',
    libraryId: 'fitness',
    code: 'A01',
    title: 'Segurança e Prevenção de Emergências Esportivas',
    description: 'Mapeamento de riscos em salas de musculação, crossfit e áreas de alto rendimento.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Riscos em ambientes de treinamento' },
      { position: 2, title: 'Reconhecimento de sinais de alerta' },
      { position: 3, title: 'Prevenção de acidentes' },
      { position: 4, title: 'Inspeção de áreas e equipamentos' },
      { position: 5, title: 'Limites de atuação profissional' },
      { position: 6, title: 'Organização do atendimento emergencial' }
    ]
  },
  {
    id: 'A02',
    libraryId: 'fitness',
    code: 'A02',
    title: 'Emergências Cardiovasculares Durante o Exercício',
    description: 'Dor torácica de esforço, colapso súbito no treino e aplicação imediata de RCP + DEA.',
    durationMinutes: 50,
    workloadTheoretical: 1,
    workloadPractical: 1,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Dor torácica' },
      { position: 2, title: 'Sinais sugestivos de infarto' },
      { position: 3, title: 'Síncope durante atividades físicas' },
      { position: 4, title: 'Parada cardiorrespiratória' },
      { position: 5, title: 'RCP e DEA' },
      { position: 6, title: 'Simulação de emergência em academia' }
    ]
  },
  {
    id: 'A03',
    libraryId: 'fitness',
    code: 'A03',
    title: 'Lesões Musculoesqueléticas no Esporte',
    description: 'Fraturas por sobrecarga/impacto, luxações articulares, entorses e concussão esportiva.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Entorses' },
      { position: 2, title: 'Distensões' },
      { position: 3, title: 'Luxações' },
      { position: 4, title: 'Fraturas' },
      { position: 5, title: 'Traumatismo craniano e concussão' },
      { position: 6, title: 'Cuidados iniciais e encaminhamento' }
    ]
  },
  {
    id: 'A04',
    libraryId: 'fitness',
    code: 'A04',
    title: 'Emergências Metabólicas e Relacionadas ao Esforço',
    description: 'Desidratação grave, intermação, colapso por calor e suspeita de rabdomiólise aguda.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Hipoglicemia' },
      { position: 2, title: 'Desidratação' },
      { position: 3, title: 'Exaustão pelo calor' },
      { position: 4, title: 'Hipertermia grave' },
      { position: 5, title: 'Suspeita de rabdomiólise' },
      { position: 6, title: 'Reconhecimento de sinais de deterioração' }
    ]
  },
  {
    id: 'A05',
    libraryId: 'fitness',
    code: 'A05',
    title: 'Emergências em Atividades Aquáticas e ao Ar Livre',
    description: 'Prevenção e resgate seguro em piscinas de natação, corridas de rua e trilhas.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Segurança em piscinas' },
      { position: 2, title: 'Prevenção de afogamentos' },
      { position: 3, title: 'Resposta inicial ao afogamento' },
      { position: 4, title: 'Acidentes em trilhas' },
      { position: 5, title: 'Exposição a temperaturas extremas' },
      { position: 6, title: 'Organização do resgate seguro' }
    ]
  },
  {
    id: 'A06',
    libraryId: 'fitness',
    code: 'A06',
    title: 'Plano de Emergência e Simulações em Academias',
    description: 'Protocolos de acionamento rápido, localização do DEA e exercícios práticos periódicos.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 1,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Mapeamento de riscos' },
      { position: 2, title: 'Disponibilidade do DEA' },
      { position: 3, title: 'Atribuição de funções' },
      { position: 4, title: 'Comunicação com o serviço de emergência' },
      { position: 5, title: 'Treinamento periódico' },
      { position: 6, title: 'Simulações de incidentes esportivos' }
    ]
  },

  // ==========================================
  // BIBLIOTECA 4 — CONTROLE DE HEMORRAGIAS GRAVES (7)
  // ==========================================
  {
    id: 'H01',
    libraryId: 'bleeding_control',
    code: 'H01',
    title: 'Fundamentos da Hemorragia e do Choque',
    description: 'Fisiopatologia do choque hipovolêmico e dinamismo da perda sanguínea rápida.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Anatomia vascular básica' },
      { position: 2, title: 'Fisiologia da circulação' },
      { position: 3, title: 'Hemostasia' },
      { position: 4, title: 'Tipos de hemorragia' },
      { position: 5, title: 'Reconhecimento da perda sanguínea grave' },
      { position: 6, title: 'Sinais de choque hemorrágico' }
    ]
  },
  {
    id: 'H02',
    libraryId: 'bleeding_control',
    code: 'H02',
    title: 'Reconhecimento de Sangramentos Potencialmente Fatais',
    description: 'Identificação imediata de sangramento arterial em jato, poças contínuas e roupas ensopadas.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Identificação de hemorragias graves' },
      { position: 2, title: 'Avaliação rápida da vítima' },
      { position: 3, title: 'Segurança da cena' },
      { position: 4, title: 'Priorização de medidas' },
      { position: 5, title: 'Acionamento de emergência' },
      { position: 6, title: 'Limites da intervenção' }
    ]
  },
  {
    id: 'H03',
    libraryId: 'bleeding_control',
    code: 'H03',
    title: 'Compressão Direta e Curativos Hemostáticos',
    description: 'Aplicação correta de pressão sustentada e uso de gazes impregnadas com agentes hemostáticos.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 1,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Princípios da compressão direta' },
      { position: 2, title: 'Posicionamento e manutenção da pressão' },
      { position: 3, title: 'Curativos compressivos' },
      { position: 4, title: 'Materiais hemostáticos' },
      { position: 5, title: 'Erros frequentes' },
      { position: 6, title: 'Avaliação prática' }
    ]
  },
  {
    id: 'H04',
    libraryId: 'bleeding_control',
    code: 'H04',
    title: 'Preenchimento de Feridas — Wound Packing',
    description: 'Técnica de preenchimento de cavidades em áreas juncionais (virilha, axila e pescoço).',
    durationMinutes: 50,
    workloadTheoretical: 1,
    workloadPractical: 1,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Conceitos e indicações' },
      { position: 2, title: 'Regiões anatômicas pertinentes' },
      { position: 3, title: 'Materiais utilizados' },
      { position: 4, title: 'Demonstração e prática supervisionada' },
      { position: 5, title: 'Situações em que não realizar' },
      { position: 6, title: 'Manutenção da pressão e reavaliação' }
    ]
  },
  {
    id: 'H05',
    libraryId: 'bleeding_control',
    code: 'H05',
    title: 'Torniquetes para Controle de Hemorragias',
    description: 'Aplicação correta de torniquetes em extremidades, aperto do molinete e registro de horário.',
    durationMinutes: 50,
    workloadTheoretical: 1,
    workloadPractical: 1,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Princípios de funcionamento' },
      { position: 2, title: 'Indicações' },
      { position: 3, title: 'Dispositivos adequados' },
      { position: 4, title: 'Aplicação prática em membros' },
      { position: 5, title: 'Avaliação da efetividade' },
      { position: 6, title: 'Erros e cuidados após a aplicação' }
    ]
  },
  {
    id: 'H06',
    libraryId: 'bleeding_control',
    code: 'H06',
    title: 'Hemorragias em Situações Especiais',
    description: 'Abordagem de amputações traumáticas, ferimentos penetrantes múltiplos e vítimas pediátricas.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Ferimentos profundos' },
      { position: 2, title: 'Hemorragias em regiões de difícil compressão' },
      { position: 3, title: 'Amputações traumáticas' },
      { position: 4, title: 'Múltiplos ferimentos' },
      { position: 5, title: 'Vítimas pediátricas e populações específicas' },
      { position: 6, title: 'Prioridades e transferência de cuidados' }
    ]
  },
  {
    id: 'H07',
    libraryId: 'bleeding_control',
    code: 'H07',
    title: 'Estações Práticas e Simulações de Hemorragia',
    description: 'Estações sequenciais de compressão, wound packing e aplicação sob pressão de tempo.',
    durationMinutes: 60,
    workloadTheoretical: 1,
    workloadPractical: 2,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Estação de compressão direta' },
      { position: 2, title: 'Estação de curativos' },
      { position: 3, title: 'Estação de preenchimento de feridas' },
      { position: 4, title: 'Estação de torniquetes' },
      { position: 5, title: 'Cenários com decisões sequenciais' },
      { position: 6, title: 'Avaliação prática e debriefing' }
    ]
  },

  // ==========================================
  // BIBLIOTECA 5 — PRIMEIROS SOCORROS EM EMPRESAS (8)
  // ==========================================
  {
    id: 'T01',
    libraryId: 'companies',
    code: 'T01',
    title: 'Segurança Ocupacional e Prevenção de Acidentes',
    description: 'Mapeamento de riscos no local de trabalho e conformidade com normas regulamentadoras.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Identificação de riscos' },
      { position: 2, title: 'Princípios de prevenção' },
      { position: 3, title: 'Interfaces com normas regulamentadoras' },
      { position: 4, title: 'Mapeamento do ambiente' },
      { position: 5, title: 'Recursos de emergência' },
      { position: 6, title: 'Responsabilidades e limites de atuação' }
    ]
  },
  {
    id: 'T02',
    libraryId: 'companies',
    code: 'T02',
    title: 'Acidentes com Máquinas, Equipamentos e Ferramentas',
    description: 'Primeiros socorros em lacerações severas, esmagamentos mecânicos e amputações industriais.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Mecanismos de lesão' },
      { position: 2, title: 'Cortes e lacerações' },
      { position: 3, title: 'Esmagamentos' },
      { position: 4, title: 'Amputações traumáticas' },
      { position: 5, title: 'Hemorragias graves' },
      { position: 6, title: 'Segurança e organização do socorro' }
    ]
  },
  {
    id: 'T03',
    libraryId: 'companies',
    code: 'T03',
    title: 'Emergências com Substâncias Químicas',
    description: 'Descontaminação imediata, queimaduras químicas e lavagem ocular de emergência.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Tipos de exposição' },
      { position: 2, title: 'Sinalização e informações de segurança' },
      { position: 3, title: 'Produtos corrosivos' },
      { position: 4, title: 'Contaminação cutânea e ocular' },
      { position: 5, title: 'Inalação de substâncias tóxicas' },
      { position: 6, title: 'Isolamento e acionamento de equipes especializadas' }
    ]
  },
  {
    id: 'T04',
    libraryId: 'companies',
    code: 'T04',
    title: 'Acidentes Elétricos',
    description: 'Desenergização prévia mandatória, choque elétrico em média/alta tensão e queimaduras internas.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Riscos da corrente elétrica' },
      { position: 2, title: 'Prevenção' },
      { position: 3, title: 'Segurança antes de abordar a vítima' },
      { position: 4, title: 'Queimaduras elétricas' },
      { position: 5, title: 'Complicações cardiovasculares' },
      { position: 6, title: 'Organização do atendimento' }
    ]
  },
  {
    id: 'T05',
    libraryId: 'companies',
    code: 'T05',
    title: 'Quedas de Altura e Traumas Ocupacionais',
    description: 'Protocolos de queda com cinto de segurança, síndrome da suspensão inerte e politrauma.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Riscos em trabalhos em altura' },
      { position: 2, title: 'Mecanismos de queda' },
      { position: 3, title: 'Suspeita de trauma grave' },
      { position: 4, title: 'Proteção da vítima' },
      { position: 5, title: 'Riscos associados à suspensão após queda' },
      { position: 6, title: 'Acionamento de equipes habilitadas' }
    ]
  },
  {
    id: 'T06',
    libraryId: 'companies',
    code: 'T06',
    title: 'Emergências em Espaços Confinados',
    description: 'Prevenção de resgate impulsivo desprotegido em atmosferas tóxicas ou pobres em oxigênio.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Características dos espaços confinados' },
      { position: 2, title: 'Deficiência de oxigênio' },
      { position: 3, title: 'Atmosferas perigosas' },
      { position: 4, title: 'Reconhecimento de acidentes' },
      { position: 5, title: 'Prevenção de resgate impulsivo' },
      { position: 6, title: 'Acionamento de equipes especializadas' }
    ]
  },
  {
    id: 'T07',
    libraryId: 'companies',
    code: 'T07',
    title: 'Incêndios, Fumaça e Evacuação',
    description: 'Rotas de fuga industriais, inalação de fumaça aquecida/gases tóxicos e apoio à brigada.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 0,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Riscos de incêndio' },
      { position: 2, title: 'Fumaça e inalação' },
      { position: 3, title: 'Rotas de fuga' },
      { position: 4, title: 'Comunicação de emergência' },
      { position: 5, title: 'Evacuação segura' },
      { position: 6, title: 'Interface com brigadas e Corpo de Bombeiros' }
    ]
  },
  {
    id: 'T08',
    libraryId: 'companies',
    code: 'T08',
    title: 'Resposta a Incidentes com Múltiplas Vítimas',
    description: 'Organização inicial em incidentes ampliados e colaboração com equipes públicas de socorro.',
    durationMinutes: 45,
    workloadTheoretical: 1,
    workloadPractical: 1,
    editorialStatus: 'draft',
    videoProvider: 'google_drive',
    materialAllowDownload: true,
    materialVersion: 1,
    subtopics: [
      { position: 1, title: 'Reconhecimento de incidentes complexos' },
      { position: 2, title: 'Autoproteção' },
      { position: 3, title: 'Organização inicial da cena' },
      { position: 4, title: 'Comunicação com serviços de emergência' },
      { position: 5, title: 'Apoio à priorização por equipes habilitadas' },
      { position: 6, title: 'Exercícios simulados de resposta institucional' }
    ]
  }
];
