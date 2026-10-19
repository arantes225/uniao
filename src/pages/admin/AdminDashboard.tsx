import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, School, LogOut, Camera, 
  Trash2, CheckCircle2, RefreshCw, Award, Users, 
  Settings, Clock, BookOpen, FileText, Check, Plus,
  UserPlus, UserMinus, Eye, Filter, Sparkles, X,
  GraduationCap
} from 'lucide-react';
import { supabase } from '../../services/supabase/client';
import { ContentManagerTab } from './ContentManagerTab';

// Modelos Pré-definidos para Treinamentos Médicos da União
interface CertificatePreset {
  id: string;
  name: string;
  category: string;
  courseSlug: string;
  title: string;
  workloadHours: number;
  validityMonths: number;
  legalFramework: string;
  instructorName: string;
  instructorRole: string;
  technicalDirector: string;
  modules: string[];
}

const PRESET_MODELS: CertificatePreset[] = [
  {
    id: 'aph-padrao',
    name: 'Atendimento Pré-Hospitalar (APH) & Suporte Básico',
    category: 'Emergência & Trauma',
    courseSlug: 'aph',
    title: 'Certificado de Capacitação em Atendimento Pré-Hospitalar (APH) & Controle de Hemorragias',
    workloadHours: 40,
    validityMonths: 24,
    legalFramework: 'Portaria GM/MS nº 2048/2002, Diretrizes Internacionais PHTLS 10ª Edição e Resoluções CFM/COFEN.',
    instructorName: 'Dr. Lucas Arantes',
    instructorRole: 'Instrutor Chefe & Médico Regulador (CRM-SP)',
    technicalDirector: 'Dr. Lucas Arantes - Diretor Técnico Médico USM',
    modules: [
      'Cinemática do Trauma e Avaliação da Cena com Segurança Operacional',
      'Protocolo X-A-B-C-D-E no Trauma Grave: Abordagem Sistemática',
      'Controle de Hemorragias Exsanguinantes: Curativos e Torniquete Tático',
      'Manejo de Vias Aéreas e Ventilação de Resgate (BVM/Ambu)',
      'Suporte Básico de Vida (SBV) e Desfibrilação Externa Automática (DEA)',
      'Imobilização Espinhal Seletiva, Colar Cervical e Pranchamento Seguro',
      'Simulação Prática Realística de Alta Fidelidade com Debriefing Clínico',
    ],
  },
  {
    id: 'lei-lucas',
    name: 'Lei Lucas nº 13.722/18 — Escolas e Ambientes Pedagógicos',
    category: 'Escolar / Pediátrico',
    courseSlug: 'treinamentos-personalizados',
    title: 'Certificado de Capacitação em Primeiros Socorros Escolares (Lei Lucas Federal 13.722/18)',
    workloadHours: 20,
    validityMonths: 12,
    legalFramework: 'Lei Federal nº 13.722/2018 (Lei Lucas), Ministério da Educação e Diretrizes Pediátricas AHA.',
    instructorName: 'Dr. Lucas Arantes',
    instructorRole: 'Instrutor Chefe & Especialista em Urgência Pediátrica',
    technicalDirector: 'Dr. Lucas Arantes - Diretor Técnico Médico USM',
    modules: [
      'Engasgo Pediátrico: Manobra de Heimlich em Bebês, Crianças e Adultos',
      'Prevenção de Acidentes em Pátios, Refeitórios e Salas de Aula',
      'Parada Cardiorrespiratória Pediátrica e Uso do DEA Escolar',
      'Convulsões Febris e Epilepsia no Ambiente Escolar',
      'Fraturas, Entorses e Traumatismo Cranioencefálico (TCE) em Recreio',
      'Choque Anafilático e Alergias Alimentares Graves',
      'Simulado Prático com Equipe Escolar e Simulação de Emergência',
    ],
  },
  {
    id: 'stop-the-bleed',
    name: 'Stop the Bleed — Controle Tático de Grandes Hemorragias',
    category: 'Tático / Corporativo',
    courseSlug: 'stop-the-bleed',
    title: 'Certificado de Qualificação Internacional — Stop the Bleed & Hemorragias Graves',
    workloadHours: 16,
    validityMonths: 24,
    legalFramework: 'American College of Surgeons Committee on Trauma, Protocolo TECC e Diretrizes Militares TCCC.',
    instructorName: 'Dr. Lucas Arantes',
    instructorRole: 'Instrutor Credenciado Stop the Bleed & Cirurgião',
    technicalDirector: 'Dr. Lucas Arantes - Diretor Técnico Médico USM',
    modules: [
      'Reconhecimento Imediato de Hemorragias Críticas Exsanguinantes',
      'Aplicação Rápida de Torniquetes Táticos em Extremidades (< 30s)',
      'Preenchimento de Feridas Juncionais e Curativos Hemostáticos',
      'Uso de Ataduras de Emergência (Bandagens Israelenses)',
      'Prevenção da Tríade Letal: Hipotermia, Acidose e Coagulopatia',
      'Evacuação Tática e Passagem de Plantão para Equipe de Suporte Avançado',
    ],
  },
  {
    id: 'sbv-dea-academias',
    name: 'SBV + DEA para Academias e Clubes Esportivos',
    category: 'Esportivo / Fitness',
    courseSlug: 'primeiros-socorros-sbv',
    title: 'Certificado de Capacitação em Suporte Básico de Vida & Morte Súbita no Esporte',
    workloadHours: 16,
    validityMonths: 24,
    legalFramework: 'Diretrizes AHA 2025/2026, Sociedade Brasileira de Cardiologia e Leis Estaduais de DEA.',
    instructorName: 'Dr. Lucas Arantes',
    instructorRole: 'Instrutor Chefe & Médico Regulador (CRM-SP)',
    technicalDirector: 'Dr. Lucas Arantes - Diretor Técnico Médico USM',
    modules: [
      'Morte Súbita no Esporte: Identificação Precoce de Colapso',
      'Ressuscitação Cardiopulmonar (RCP) de Alta Qualidade',
      'Manuseio Rápido e Seguro do Desfibrilador Externo Automático (DEA)',
      'Síncope, Desidratação Grave e Rabdomiólise no Treino Intenso',
      'Traumatismo Torácico (Commotio Cordis) e Acidentes com Cargas',
      'Protocolo de Emergência e Acionamento de Resgate SAMU 192',
    ],
  },
];

interface StudentRecord {
  id: string;
  name: string;
  email: string;
  cpf: string;
  cohortId: string;
  cohortName: string;
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
  scoreQuiz: number;
  simFinished: boolean;
  practicalAuthorized: boolean;
  daysRemaining: number;
}

export const AdminDashboard: React.FC = () => {
  // Controle de Acesso por PIN de Segurança
  const [pinEntered, setPinEntered] = useState('');
  const [pinAuthorized, setPinAuthorized] = useState(false);
  const [pinError, setPinError] = useState(false);

  // Navegação Interna por Abas
  const [activeTab, setActiveTab] = useState<'dashboard' | 'turmas' | 'conteudos' | 'certificados' | 'galeria'>('dashboard');

  // Módulo de Gerenciamento da Galeria de Treinamentos
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Atendimento Pré-Hospitalar');
  const [newDescription, setNewDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Módulo de Turmas
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [selectedCohort, setSelectedCohort] = useState<any | null>(null);
  const [isEditingCohort, setIsEditingCohort] = useState(false);
  const [editCohortDays, setEditCohortDays] = useState(90);
  const [editCohortMaxStudents, setEditCohortMaxStudents] = useState(30);
  const [editCohortName, setEditCohortName] = useState('');
  const [editCohortStatus, setEditCohortStatus] = useState('active');
  const [editCohortLocation, setEditCohortLocation] = useState('');
  const [cohortSaveSuccess, setCohortSaveSuccess] = useState(false);

  // Alunos e Filtro por Turma
  const [cohortFilter, setCohortFilter] = useState<string>('all');
  const [students, setStudents] = useState<StudentRecord[]>([
    {
      id: '1',
      name: 'Dr. Lucas Arantes',
      email: 'aluno.uniao@gmail.com',
      cpf: '123.456.789-00',
      cohortId: '22222222-2222-2222-2222-222222222222',
      cohortName: 'Turma de Capacitação APH 2026',
      progress: 40,
      lessonsCompleted: 4,
      totalLessons: 12,
      scoreQuiz: 95,
      simFinished: true,
      practicalAuthorized: true,
      daysRemaining: 89,
    },
    {
      id: '2',
      name: 'Dra. Mariana Costa Silva',
      email: 'mariana.costa@samu.sp.gov.br',
      cpf: '234.567.890-11',
      cohortId: '22222222-2222-2222-2222-222222222222',
      cohortName: 'Turma de Capacitação APH 2026',
      progress: 75,
      lessonsCompleted: 9,
      totalLessons: 12,
      scoreQuiz: 90,
      simFinished: true,
      practicalAuthorized: true,
      daysRemaining: 89,
    },
    {
      id: '3',
      name: 'Enf. Roberto Albuquerque',
      email: 'roberto.albuquerque@hospital.med.br',
      cpf: '345.678.901-22',
      cohortId: '22222222-2222-2222-2222-222222222222',
      cohortName: 'Turma de Capacitação APH 2026',
      progress: 20,
      lessonsCompleted: 2,
      totalLessons: 12,
      scoreQuiz: 80,
      simFinished: false,
      practicalAuthorized: false,
      daysRemaining: 89,
    },
    {
      id: '4',
      name: 'Bombeiro Carlos Eduardo',
      email: 'carlos.edu@resgate.gov.br',
      cpf: '456.789.012-33',
      cohortId: '33333333-3333-3333-3333-333333333333',
      cohortName: 'Turma Stop the Bleed Tático',
      progress: 100,
      lessonsCompleted: 8,
      totalLessons: 8,
      scoreQuiz: 100,
      simFinished: true,
      practicalAuthorized: true,
      daysRemaining: 45,
    },
    {
      id: '5',
      name: 'Profa. Fernanda Oliveira',
      email: 'fernanda.oliveira@escolaobjetivo.com.br',
      cpf: '567.890.123-44',
      cohortId: '44444444-4444-4444-4444-444444444444',
      cohortName: 'Turma Colégio Objetivo (Lei Lucas 13.722)',
      progress: 60,
      lessonsCompleted: 6,
      totalLessons: 10,
      scoreQuiz: 88,
      simFinished: true,
      practicalAuthorized: true,
      daysRemaining: 115,
    },
  ]);

  // Modal para Criar Nova Turma
  const [isCreateCohortOpen, setIsCreateCohortOpen] = useState(false);
  const [newCohortName, setNewCohortName] = useState('');
  const [newCohortDays, setNewCohortDays] = useState(90);
  const [newCohortCapacity, setNewCohortCapacity] = useState(30);
  const [newCohortLocation, setNewCohortLocation] = useState('Centro de Treinamento USM');
  const [cohortCreationMode, setCohortCreationMode] = useState<'empty' | 'manual' | 'import'>('empty');
  const [cohortImportFile, setCohortImportFile] = useState<File | null>(null);

  // Modal para Adicionar Aluno a uma Turma
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [studentAddMode, setStudentAddMode] = useState<'single' | 'import'>('single');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentCpf, setNewStudentCpf] = useState('');
  const [newStudentCohortId, setNewStudentCohortId] = useState('');
  const [studentImportFile, setStudentImportFile] = useState<File | null>(null);

  // Modal para Editar Aluno
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [editStudentName, setEditStudentName] = useState('');
  const [editStudentEmail, setEditStudentEmail] = useState('');
  const [editStudentCpf, setEditStudentCpf] = useState('');
  const [editStudentCohortId, setEditStudentCohortId] = useState('');

  // =========================================================================
  // MÓDULO DE CERTIFICADOS & EMENTAS
  // =========================================================================
  const [selectedCertCohortId, setSelectedCertCohortId] = useState<string>('22222222-2222-2222-2222-222222222222');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('aph-padrao');
  
  // Dados do Modelo Editável Atual
  const [certTitle, setCertTitle] = useState(PRESET_MODELS[0].title);
  const [certWorkload, setCertWorkload] = useState(PRESET_MODELS[0].workloadHours);
  const [certValidity, setCertValidity] = useState(PRESET_MODELS[0].validityMonths);
  const [certLegal, setCertLegal] = useState(PRESET_MODELS[0].legalFramework);
  const [certInstructor, setCertInstructor] = useState(PRESET_MODELS[0].instructorName);
  const [certInstructorRole, setCertInstructorRole] = useState(PRESET_MODELS[0].instructorRole);
  const [certDirector, setCertDirector] = useState(PRESET_MODELS[0].technicalDirector);
  const [certModules, setCertModules] = useState<string[]>(PRESET_MODELS[0].modules);
  const [newCustomModule, setNewCustomModule] = useState('');
  const [certSavedSuccess, setCertSavedSuccess] = useState(false);

  // Modal de Prévia Visual do Certificado
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewStudentName, setPreviewStudentName] = useState('Dr. Lucas Arantes');
  const [previewSide, setPreviewSide] = useState<'front' | 'back'>('front');

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinEntered === '1926') {
      setPinAuthorized(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const loadData = async () => {
    // 1. Carregar galeria
    const { data: gal } = await supabase
      .from('training_gallery')
      .select('*')
      .order('created_at', { ascending: false });
    if (gal) setGalleryImages(gal);

    // 2. Carregar turmas
    const { data: coh } = await supabase
      .from('cohorts')
      .select('*')
      .order('created_at', { ascending: false });
    if (coh && coh.length > 0) {
      setCohorts(coh);
      setSelectedCohort(coh[0]);
      setEditCohortDays(coh[0].access_days_limit || 90);
      setEditCohortMaxStudents(coh[0].max_students || 30);
      setEditCohortName(coh[0].name || '');
      setEditCohortStatus(coh[0].status || 'active');
      setEditCohortLocation(coh[0].practical_location || 'Centro de Treinamento USM');
      if (!selectedCertCohortId) {
        setSelectedCertCohortId(coh[0].id);
      }
    }
  };

  useEffect(() => {
    if (pinAuthorized) {
      loadData();
    }
  }, [pinAuthorized]);

  // Aplicar Preset de Certificado
  const handleApplyPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const found = PRESET_MODELS.find(p => p.id === presetId);
    if (found) {
      setCertTitle(found.title);
      setCertWorkload(found.workloadHours);
      setCertValidity(found.validityMonths);
      setCertLegal(found.legalFramework);
      setCertInstructor(found.instructorName);
      setCertInstructorRole(found.instructorRole);
      setCertDirector(found.technicalDirector);
      setCertModules([...found.modules]);
    }
  };

  // Upload da Galeria
  const handleUploadImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !newTitle) return;

    setUploading(true);
    setUploadSuccess(false);

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `trainings/${fileName}`;

      const { error: storageError } = await supabase.storage
        .from('gallery')
        .upload(filePath, selectedFile);

      if (storageError) throw storageError;

      const { data: urlData } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase.from('training_gallery').insert([
        {
          title: newTitle,
          category: newCategory,
          description: newDescription,
          image_url: urlData.publicUrl,
        }
      ]);

      if (dbError) throw dbError;

      setUploadSuccess(true);
      setNewTitle('');
      setNewDescription('');
      setSelectedFile(null);
      await loadData();
    } catch (err: any) {
      console.error('Erro ao enviar imagem:', err);
      alert('Falha ao enviar imagem: ' + (err.message || 'Erro'));
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Deseja realmente remover esta foto da landing page?')) return;
    await supabase.from('training_gallery').delete().eq('id', id);
    await loadData();
  };

  // Salvar Parâmetros da Turma
  const handleSaveCohort = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCohort) return;
    setCohortSaveSuccess(false);

    const { error } = await supabase
      .from('cohorts')
      .update({
        name: editCohortName,
        access_days_limit: Number(editCohortDays),
        max_students: Number(editCohortMaxStudents),
        status: editCohortStatus,
        practical_location: editCohortLocation,
      })
      .eq('id', selectedCohort.id);

    if (!error) {
      setCohortSaveSuccess(true);
      setIsEditingCohort(false);
      await loadData();
    } else {
      alert('Erro ao atualizar turma: ' + error.message);
    }
  };

  // Adicionar Aluno a uma Turma
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentEmail || !newStudentCohortId) return;

    const cohort = cohorts.find(c => c.id === newStudentCohortId);
    const newEntry: StudentRecord = {
      id: Date.now().toString(),
      name: newStudentName,
      email: newStudentEmail,
      cpf: newStudentCpf || '000.000.000-00',
      cohortId: newStudentCohortId,
      cohortName: cohort ? cohort.name : 'Turma Selecionada',
      progress: 0,
      lessonsCompleted: 0,
      totalLessons: 12,
      scoreQuiz: 0,
      simFinished: false,
      practicalAuthorized: false,
      daysRemaining: cohort ? (cohort.access_days_limit || 90) : 90,
    };

    setStudents([newEntry, ...students]);
    setNewStudentName('');
    setNewStudentEmail('');
    setNewStudentCpf('');
    setStudentImportFile(null);
    setIsAddStudentOpen(false);
  };

  // Importar Alunos em Lote via PDF / Excel
  const handleImportStudents = (cohortId: string) => {
    const cohort = cohorts.find(c => c.id === cohortId);
    // Simula importação automatizada de 3 alunos da planilha/documento
    const importedEntries: StudentRecord[] = [
      {
        id: Date.now().toString() + '-1',
        name: 'Dra. Beatriz Santos Nogueira',
        email: 'beatriz.santos@hospitaluniao.med.br',
        cpf: '789.012.345-55',
        cohortId: cohortId,
        cohortName: cohort ? cohort.name : 'Turma Importada',
        progress: 0,
        lessonsCompleted: 0,
        totalLessons: 12,
        scoreQuiz: 0,
        simFinished: false,
        practicalAuthorized: false,
        daysRemaining: cohort ? (cohort.access_days_limit || 90) : 90,
      },
      {
        id: Date.now().toString() + '-2',
        name: 'Socorrista Thiago Lemos Ramos',
        email: 'thiago.lemos@resgateurgente.com.br',
        cpf: '890.123.456-66',
        cohortId: cohortId,
        cohortName: cohort ? cohort.name : 'Turma Importada',
        progress: 0,
        lessonsCompleted: 0,
        totalLessons: 12,
        scoreQuiz: 0,
        simFinished: false,
        practicalAuthorized: false,
        daysRemaining: cohort ? (cohort.access_days_limit || 90) : 90,
      },
    ];

    setStudents([...importedEntries, ...students]);
    alert(`Sucesso! ${importedEntries.length} alunos importados e matriculados na turma.`);
    setIsAddStudentOpen(false);
    setIsCreateCohortOpen(false);
    setStudentImportFile(null);
    setCohortImportFile(null);
  };

  // Criar Nova Turma
  const handleCreateCohort = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCohortName.trim()) return;

    const newId = crypto.randomUUID ? crypto.randomUUID() : (Date.now() + '-cohort');
    const newCohortObj = {
      id: newId,
      name: newCohortName.trim(),
      access_days_limit: Number(newCohortDays),
      max_students: Number(newCohortCapacity),
      status: 'active',
      practical_location: newCohortLocation.trim() || 'Centro de Treinamento USM',
      created_at: new Date().toISOString(),
    };

    // Insere no banco
    await supabase.from('cohorts').insert([newCohortObj]);

    setCohorts([newCohortObj, ...cohorts]);
    setSelectedCohort(newCohortObj);

    // Se optou por importar logo na criação
    if (cohortCreationMode === 'import' && cohortImportFile) {
      handleImportStudents(newId);
    }

    setNewCohortName('');
    setIsCreateCohortOpen(false);
    setCohortCreationMode('empty');
    setCohortImportFile(null);
    alert('Nova turma cadastrada com sucesso!');
  };

  // Abrir Edição de Aluno
  const handleOpenEditStudent = (st: StudentRecord) => {
    setEditingStudent(st);
    setEditStudentName(st.name);
    setEditStudentEmail(st.email);
    setEditStudentCpf(st.cpf);
    setEditStudentCohortId(st.cohortId);
    setIsEditStudentOpen(true);
  };

  // Salvar Edição do Aluno
  const handleSaveEditStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    const targetCohort = cohorts.find(c => c.id === editStudentCohortId);

    setStudents(students.map(s => {
      if (s.id === editingStudent.id) {
        return {
          ...s,
          name: editStudentName,
          email: editStudentEmail,
          cpf: editStudentCpf,
          cohortId: editStudentCohortId,
          cohortName: targetCohort ? targetCohort.name : s.cohortName,
        };
      }
      return s;
    }));

    setIsEditStudentOpen(false);
    setEditingStudent(null);
  };

  // Remover Aluno de uma Turma
  const handleRemoveStudent = (studentId: string, studentName: string) => {
    if (confirm(`Deseja realmente desmatricular ${studentName}?`)) {
      setStudents(students.filter(s => s.id !== studentId));
    }
  };

  // Adicionar Tópico ao Conteúdo Programático
  const handleAddModule = () => {
    if (!newCustomModule.trim()) return;
    setCertModules([...certModules, newCustomModule.trim()]);
    setNewCustomModule('');
  };

  // Remover Tópico do Conteúdo Programático
  const handleRemoveModule = (index: number) => {
    setCertModules(certModules.filter((_, i) => i !== index));
  };

  // Salvar Modelo de Certificado no Banco
  const handleSaveCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCertSavedSuccess(false);

    const { error } = await supabase
      .from('certificate_templates')
      .upsert({
        title: certTitle,
        workload_hours: Number(certWorkload),
        validity_months: Number(certValidity),
        legal_framework: certLegal,
        syllabus: certModules.join('\n'),
        instructor_name: certInstructor,
        instructor_role: certInstructorRole,
        technical_director: certDirector,
        updated_at: new Date().toISOString(),
      });

    if (!error) {
      setCertSavedSuccess(true);
      setTimeout(() => setCertSavedSuccess(false), 4000);
    } else {
      alert('Erro ao salvar modelo: ' + error.message);
    }
  };

  // Alunos Filtrados
  const filteredStudents = cohortFilter === 'all'
    ? students
    : students.filter(s => s.cohortId === cohortFilter);

  // Turma atual selecionada para Certificados
  const currentCertCohort = cohorts.find(c => c.id === selectedCertCohortId);

  if (!pinAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">Confirmação de Segurança Administrativa</h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              O acesso aos módulos de gestão acadêmica, turmas, certificados e upload requer o PIN de gestão.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={6}
                value={pinEntered}
                onChange={(e) => setPinEntered(e.target.value)}
                placeholder="••••"
                className="w-36 text-center tracking-[0.5em] text-2xl font-mono py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-uniao-500"
              />
            </div>

            {pinError && (
              <div className="text-xs text-red-400 font-medium">
                PIN de segurança incorreto. Tente novamente (Dica: 1926).
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-white bg-uniao-600 hover:bg-uniao-500 text-sm transition-all shadow"
            >
              Validar Acesso Administrativo
            </button>
          </form>

          <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 block">
            ← Retornar ao site público
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Admin Header */}
      <header className="bg-slate-900/90 backdrop-blur-md text-white h-16 px-6 flex items-center justify-between border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-950 p-1 border border-white/10">
            <img src="/brand/simbolo-cruz-uniao.png" alt="USM" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight">Painel de Gestão & Governança USM</span>
            <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-uniao-950 text-uniao-400 border border-uniao-500/40">
              Administração Geral
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/aluno/dashboard"
            className="text-xs text-uniao-400 hover:text-white px-3 py-1.5 rounded-lg border border-uniao-500/30 hover:bg-uniao-500/10 transition-colors"
          >
            Visão do Aluno →
          </Link>
          <button
            onClick={() => setPinAuthorized(false)}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Bloquear Painel</span>
          </button>
        </div>
      </header>

      {/* Navegação Secundária por Abas */}
      <div className="bg-slate-900/60 border-b border-white/10 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2">
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-uniao-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Dashboard & Alunos</span>
          </button>

          <button
            onClick={() => setActiveTab('turmas')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'turmas'
                ? 'bg-uniao-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <School className="w-4 h-4" />
            <span>Gestão de Turmas & Matrículas</span>
          </button>

          <button
            onClick={() => setActiveTab('conteudos')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'conteudos'
                ? 'bg-uniao-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Gestão de Conteúdos (40 Módulos)</span>
          </button>

          <button
            onClick={() => setActiveTab('certificados')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'certificados'
                ? 'bg-uniao-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Editor de Certificados & Ementas</span>
          </button>

          <button
            onClick={() => setActiveTab('galeria')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'galeria'
                ? 'bg-uniao-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Galeria de Treinamentos (Landing Page)</span>
          </button>

        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto w-full p-6 sm:p-8 space-y-10 flex-1">
        
        {/* ========================================================================= */}
        {/* ABA 1: DASHBOARD GERAL, ALUNOS ATUAIS COM FILTRO POR TURMA */}
        {/* ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            
            {/* Métricas do Dashboard */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
                <span className="text-xs font-semibold text-slate-400">Total de Turmas</span>
                <div className="text-2xl font-black text-white">{cohorts.length || 3} Turmas</div>
                <div className="text-[11px] text-uniao-400 font-medium">Turmas ativas no sistema</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
                <span className="text-xs font-semibold text-slate-400">Total de Alunos</span>
                <div className="text-2xl font-black text-white">{students.length} Alunos</div>
                <div className="text-[11px] text-emerald-400 font-medium">Cadastros verificados</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
                <span className="text-xs font-semibold text-slate-400">Aprovados p/ Presencial</span>
                <div className="text-2xl font-black text-white">
                  {students.filter(s => s.practicalAuthorized).length} Alunos
                </div>
                <div className="text-[11px] text-emerald-400 font-medium">Com simulador concluído</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
                <span className="text-xs font-semibold text-slate-400">Countdown Ativo</span>
                <div className="text-2xl font-black text-amber-400">Até 120 Dias</div>
                <div className="text-[11px] text-slate-400">Visível no card do aluno</div>
              </div>
            </div>

            {/* Tabela de Alunos e Progresso com FILTRO POR TURMA */}
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <h2 className="text-xl font-bold text-white">Alunos Matriculados & Progresso Pedagógico</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Filtre por turma para auditar notas, simuladores concluídos e autorizações práticas.
                  </p>
                </div>
                
                {/* REQUISITO: FILTRO PARA DIFERENCIAR POR TURMA */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
                    <Filter className="w-4 h-4 text-uniao-400" />
                    <span className="text-slate-400 text-xs">Turma:</span>
                    <select
                      value={cohortFilter}
                      onChange={(e) => setCohortFilter(e.target.value)}
                      className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="all" className="bg-slate-900 text-white">Todas as Turmas ({students.length})</option>
                      {cohorts.map((c) => (
                        <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      setNewStudentCohortId(cohorts[0]?.id || '');
                      setIsAddStudentOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-uniao-400 to-teal-300 hover:brightness-110 shadow"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-slate-950" />
                    <span>Matricular Aluno</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/70 uppercase text-[10px] tracking-wider text-slate-400 border-b border-white/5">
                    <tr>
                      <th className="py-3 px-4">Aluno / Contato</th>
                      <th className="py-3 px-4">Turma Vinculada</th>
                      <th className="py-3 px-4">Progresso Online</th>
                      <th className="py-3 px-4">Aulas Concluídas</th>
                      <th className="py-3 px-4">Média Provas</th>
                      <th className="py-3 px-4">Acesso Restante</th>
                      <th className="py-3 px-4">Simulado Prático</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-500">
                          Nenhum aluno matriculado nesta turma ainda.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white text-sm">{student.name}</div>
                            <div className="text-[11px] text-slate-400">{student.email} • CPF: {student.cpf}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-950 border border-white/10 font-semibold text-slate-300">
                              {student.cohortName}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="w-36 space-y-1">
                              <div className="flex justify-between text-[10px] font-bold">
                                <span>{student.progress}%</span>
                              </div>
                              <div className="w-full bg-slate-800 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-uniao-500 to-teal-400 h-2 rounded-full" 
                                  style={{ width: `${student.progress}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-medium">
                            {student.lessonsCompleted} / {student.totalLessons}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`font-bold font-mono px-2 py-0.5 rounded ${
                              student.scoreQuiz >= 80 ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                            }`}>
                              {student.scoreQuiz}%
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 font-mono text-amber-300">
                              <Clock className="w-3.5 h-3.5 text-amber-400" />
                              <span>{student.daysRemaining} dias</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {student.practicalAuthorized ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                <Check className="w-3 h-3" />
                                <span>Apto p/ Prático</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                <Clock className="w-3 h-3" />
                                <span>Pendente</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleRemoveStudent(student.id, student.name)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Remover Aluno da Turma"
                            >
                              <UserMinus className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* ABA 2: GESTÃO DE TURMAS (LISTA DE ALUNOS, ADICIONAR/REMOVER, PARÂMETROS) */}
        {/* ========================================================================= */}
        {activeTab === 'turmas' && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-uniao-500/10 border border-uniao-500/30 text-uniao-400 flex items-center justify-center">
                    <School className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Gestão Central de Turmas & Alunos</h2>
                    <p className="text-xs text-slate-400">
                      Veja alunos de cada turma, adicione ou remova inscrições e altere os prazos de acesso (countdown).
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* REQUISITO: BOTÃO DE CRIAR TURMA */}
                  <button
                    onClick={() => {
                      setNewCohortName('');
                      setCohortCreationMode('empty');
                      setIsCreateCohortOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-slate-800 hover:bg-slate-700 border border-white/10 transition-colors shadow"
                  >
                    <Plus className="w-4 h-4 text-uniao-400" />
                    <span>+ Criar Nova Turma</span>
                  </button>

                  <button
                    onClick={() => {
                      setNewStudentCohortId(cohorts[0]?.id || '');
                      setStudentAddMode('single');
                      setIsAddStudentOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-uniao-400 to-teal-300 hover:brightness-110 shadow"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>+ Matricular Aluno</span>
                  </button>
                </div>
              </div>

              {cohortSaveSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Configurações da turma salvas com sucesso no banco de dados!</span>
                </div>
              )}

              {/* Cards das Turmas com Lista Expandível de Alunos */}
              <div className="space-y-6">
                {cohorts.map((cohort) => {
                  const cohortStudents = students.filter(s => s.cohortId === cohort.id);
                  const isSelected = selectedCohort?.id === cohort.id;

                  return (
                    <div 
                      key={cohort.id} 
                      className={`p-6 rounded-2xl border transition-all ${
                        isSelected
                          ? 'bg-slate-950 border-uniao-500/60 shadow-xl'
                          : 'bg-slate-950/60 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-uniao-400">
                              Turma Ativa
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              {cohort.status || 'Ativa'}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white mt-0.5">{cohort.name}</h3>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCohort(cohort);
                              setEditCohortName(cohort.name);
                              setEditCohortDays(cohort.access_days_limit || 90);
                              setEditCohortMaxStudents(cohort.max_students || 30);
                              setEditCohortStatus(cohort.status || 'active');
                              setEditCohortLocation(cohort.practical_location || 'Centro de Treinamento USM');
                              setIsEditingCohort(true);
                            }}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors inline-flex items-center gap-1.5"
                          >
                            <Settings className="w-3.5 h-3.5 text-uniao-400" />
                            <span>Editar Prazos / Parâmetros</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setNewStudentCohortId(cohort.id);
                              setIsAddStudentOpen(true);
                            }}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-uniao-400 hover:bg-uniao-300 transition-colors inline-flex items-center gap-1.5"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Matricular Aluno</span>
                          </button>
                        </div>
                      </div>

                      {/* Métricas da Turma */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 p-4 rounded-xl border border-white/5 text-xs text-slate-300 mb-4">
                        <div>
                          <span className="text-slate-500 block text-[11px]">Countdown de Acesso:</span>
                          <strong className="text-amber-300 font-mono text-sm">{cohort.access_days_limit || 90} dias</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px]">Alunos Matriculados:</span>
                          <strong className="text-white font-mono text-sm">{cohortStudents.length} / {cohort.max_students || 30}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px]">Local do Treinamento:</span>
                          <strong className="text-slate-200 text-xs truncate block">{cohort.practical_location || 'Base USM'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px]">Aptos p/ Presencial:</span>
                          <strong className="text-emerald-400 font-mono text-sm">
                            {cohortStudents.filter(s => s.practicalAuthorized).length} alunos
                          </strong>
                        </div>
                      </div>

                      {/* REQUISITO: LISTA DE ALUNOS DENTRO DA TURMA COM ADICIONAR / REMOVER */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                          <span>Lista de Alunos Desta Turma ({cohortStudents.length})</span>
                          <span className="text-[11px] text-slate-500 font-normal">Gerenciamento direto de matrícula</span>
                        </div>

                        {cohortStudents.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-500 bg-slate-900/30 rounded-xl border border-white/5">
                            Nenhum aluno matriculado nesta turma ainda. Clique em "Matricular Aluno" acima.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {cohortStudents.map((st) => (
                              <div key={st.id} className="p-3 bg-slate-900 rounded-xl border border-white/5 flex items-center justify-between gap-3">
                                <div className="space-y-0.5 truncate">
                                  <div className="font-bold text-white text-xs truncate">{st.name}</div>
                                  <div className="text-[10px] text-slate-400 truncate">{st.email}</div>
                                  <div className="text-[10px] text-uniao-400">Progresso: {st.progress}% • {st.daysRemaining}d restantes</div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditStudent(st)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-uniao-300 hover:bg-uniao-500/10 transition-colors"
                                    title="Editar Dados / Turma do Aluno"
                                  >
                                    <Settings className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveStudent(st.id, st.name)}
                                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                    title="Remover da Turma"
                                  >
                                    <UserMinus className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card de Edição dos Prazos/Parâmetros logo abaixo do card da turma sendo editada */}
                      {isEditingCohort && selectedCohort?.id === cohort.id && (
                        <div className="mt-5 p-6 rounded-2xl bg-slate-900/90 border-2 border-uniao-500/60 shadow-2xl space-y-4 animate-fadeIn">
                          <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <div className="flex items-center gap-2">
                              <Settings className="w-4 h-4 text-uniao-400" />
                              <h3 className="font-bold text-white text-sm">
                                Editar Prazos e Parâmetros: {cohort.name}
                              </h3>
                            </div>
                            <button 
                              onClick={() => setIsEditingCohort(false)} 
                              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-white/5 transition-colors"
                            >
                              ✕ Fechar
                            </button>
                          </div>

                          <form onSubmit={handleSaveCohort} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-300">Nome da Turma</label>
                              <input
                                type="text"
                                value={editCohortName}
                                onChange={(e) => setEditCohortName(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-300">
                                Limite de Acesso em Dias (Countdown do Aluno)
                              </label>
                              <input
                                type="number"
                                min={1}
                                max={730}
                                value={editCohortDays}
                                onChange={(e) => setEditCohortDays(Number(e.target.value))}
                                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500 font-mono text-amber-300 font-bold"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-300">Capacidade Máxima de Alunos</label>
                              <input
                                type="number"
                                min={1}
                                value={editCohortMaxStudents}
                                onChange={(e) => setEditCohortMaxStudents(Number(e.target.value))}
                                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-300">Status Operacional</label>
                              <select
                                value={editCohortStatus}
                                onChange={(e) => setEditCohortStatus(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                              >
                                <option value="active">Ativa (Inscrições e Aulas Abertas)</option>
                                <option value="finished">Finalizada (Somente Consulta)</option>
                                <option value="paused">Pausada</option>
                              </select>
                            </div>

                            <div className="md:col-span-2 space-y-1">
                              <label className="text-xs font-semibold text-slate-300">Local do Treinamento Prático Presencial</label>
                              <input
                                type="text"
                                value={editCohortLocation}
                                onChange={(e) => setEditCohortLocation(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                              />
                            </div>

                            <div className="md:col-span-2 pt-2 flex justify-end gap-3">
                              <button
                                type="button"
                                onClick={() => setIsEditingCohort(false)}
                                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                              >
                                Cancelar
                              </button>
                              <button
                                type="submit"
                                className="px-6 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-uniao-400 to-teal-300 hover:brightness-110 shadow"
                              >
                                Salvar Prazos / Parâmetros
                              </button>
                            </div>
                          </form>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ABA: GESTÃO CENTRAL DE CONTEÚDOS CURRICULARES (40 MÓDULOS, DRIVE, PDF, QUESTÕES) */}
        {/* ========================================================================= */}
        {activeTab === 'conteudos' && (
          <ContentManagerTab />
        )}

        {/* ========================================================================= */}
        {/* ABA 3: ABA DEDICADA AOS CERTIFICADOS, MODELOS PRONTOS, SELETOR E PRÉVIA */}
        {/* ========================================================================= */}
        {activeTab === 'certificados' && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
              
              {/* Header do Módulo de Certificados */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-uniao-500/10 border border-uniao-500/30 text-uniao-400 flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Central de Certificação & Modelos de Ementa</h2>
                    <p className="text-xs text-slate-400">
                      Escolha modelos prontos, vincule à turma, gerencie módulos ensinados e pré-visualize o certificado.
                    </p>
                  </div>
                </div>

                {/* BOTÃO DA PRÉVIA VISUAL DO CERTIFICADO */}
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-uniao-400 to-teal-300 hover:brightness-110 shadow-lg transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span>Pré-visualizar Certificado (Frente & Verso)</span>
                </button>
              </div>

              {/* SELETORES CENTRAIS: TURMA + MODELO PRONTO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/80 p-5 rounded-2xl border border-white/10">
                
                {/* 1. Seletor de Turma */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-uniao-400 flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5" />
                    <span>1. Vincular à Turma para Emissão:</span>
                  </label>
                  <select
                    value={selectedCertCohortId}
                    onChange={(e) => setSelectedCertCohortId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-uniao-500 cursor-pointer"
                  >
                    {cohorts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.status || 'Ativa'})
                      </option>
                    ))}
                  </select>
                  <span className="text-[11px] text-slate-400 block">
                    Os alunos formados desta turma receberão este modelo específico.
                  </span>
                </div>

                {/* 2. Seletor de Modelos Prontos */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>2. Modelos Oficiais Prontos (Presets):</span>
                  </label>
                  <select
                    value={selectedPresetId}
                    onChange={(e) => handleApplyPreset(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-teal-500/30 text-white text-xs font-bold focus:outline-none focus:border-teal-400 cursor-pointer"
                  >
                    {PRESET_MODELS.map((preset) => (
                      <option key={preset.id} value={preset.id}>
                        [{preset.category}] {preset.name}
                      </option>
                    ))}
                  </select>
                  <span className="text-[11px] text-teal-400 block">
                    Carrega automaticamente carga horária, respaldo legal e os módulos ensinados.
                  </span>
                </div>

              </div>

              {certSavedSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Modelo de certificado e conteúdo programático vinculados e salvos com sucesso!</span>
                </div>
              )}

              {/* FORMULÁRIO DO EDITOR */}
              <form onSubmit={handleSaveCertificate} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LADO ESQUERDO: CAMPOS DE TEXTO E METADADOS DA FRENTE (Cols 7) */}
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-uniao-400 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>Frente do Certificado (Dados de Impressão)</span>
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Título Oficial do Certificado</label>
                    <input
                      type="text"
                      required
                      value={certTitle}
                      onChange={(e) => setCertTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Carga Horária (Horas)</label>
                      <input
                        type="number"
                        required
                        value={certWorkload}
                        onChange={(e) => setCertWorkload(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-uniao-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Validade da Recertificação (Meses)</label>
                      <input
                        type="number"
                        required
                        value={certValidity}
                        onChange={(e) => setCertValidity(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-uniao-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Fundamentação Legal e Portarias</label>
                    <input
                      type="text"
                      required
                      value={certLegal}
                      onChange={(e) => setCertLegal(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Instrutor Responsável</label>
                      <input
                        type="text"
                        required
                        value={certInstructor}
                        onChange={(e) => setCertInstructor(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Cargo / CRM</label>
                      <input
                        type="text"
                        required
                        value={certInstructorRole}
                        onChange={(e) => setCertInstructorRole(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Diretor Técnico Médico</label>
                    <input
                      type="text"
                      required
                      value={certDirector}
                      onChange={(e) => setCertDirector(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                    />
                  </div>

                </div>

                {/* LADO DIREITO: MÓDULOS E TÓPICOS ENSINADOS (CLICÁVEIS E CUSTOMIZÁVEIS) (Cols 5) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-teal-300 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Módulos do Verso ({certModules.length})</span>
                    </h3>
                    <span className="text-[10px] text-slate-400">Clicável para remover</span>
                  </div>

                  {/* Lista de Módulos Clicáveis */}
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {certModules.map((mod, idx) => (
                      <div
                        key={idx}
                        className="group p-2.5 rounded-xl bg-slate-950 border border-white/10 hover:border-red-500/50 flex items-center justify-between gap-3 text-xs text-slate-200 transition-colors"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-5 h-5 rounded-full bg-uniao-500/20 text-uniao-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="truncate">{mod}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveModule(idx)}
                          className="text-slate-500 hover:text-red-400 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remover módulo deste certificado"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* REQUISITO: CAMPO PARA ADICIONAR MAIS MÓDULOS SE QUISER */}
                  <div className="pt-2 space-y-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Adicionar Tópico Personalizado à Ementa:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCustomModule}
                        onChange={(e) => setNewCustomModule(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddModule(); } }}
                        placeholder="Ex: Treinamento em Afogamento e Hipotermia..."
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddModule}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-uniao-400 hover:bg-uniao-300 transition-colors"
                      >
                        + Adicionar
                      </button>
                    </div>
                  </div>

                  {/* Ação de Salvar Modelo para a Turma */}
                  <div className="pt-4 border-t border-white/10">
                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-uniao-400 to-teal-300 hover:brightness-110 shadow-lg transition-all"
                    >
                      Salvar Modelo de Certificado para a Turma Selecionada
                    </button>
                  </div>

                </div>

              </form>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ABA 4: GALERIA DE FOTOS DA LANDING PAGE */}
        {/* ========================================================================= */}
        {activeTab === 'galeria' && (
          <div className="space-y-8">
            <section className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-uniao-500/10 border border-uniao-500/30 text-uniao-400 flex items-center justify-center">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Galeria de Fotos dos Treinamentos Reais</h2>
                    <p className="text-xs text-slate-400">
                      Suba fotos práticas que serão exibidas automaticamente no campo dedicado da Landing Page.
                    </p>
                  </div>
                </div>

                <button
                  onClick={loadData}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Atualizar Fotos</span>
                </button>
              </div>

              {/* Form de Upload */}
              <form onSubmit={handleUploadImage} className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-950/60 p-5 rounded-2xl border border-white/5">
                <div className="md:col-span-4 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase">Título da Ação Prática</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Treinamento de RCP com DEA"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                  />
                </div>

                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase">Categoria</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                  >
                    <option value="Suporte Básico de Vida">Suporte Básico de Vida (SBV)</option>
                    <option value="Stop the Bleed">Stop the Bleed (Hemorragias)</option>
                    <option value="Atendimento Pré-Hospitalar">Atendimento Pré-Hospitalar (APH)</option>
                    <option value="Lei Lucas (Escolas)">Lei Lucas (Escolas)</option>
                    <option value="Simulação Corporativa">Simulação Corporativa</option>
                  </select>
                </div>

                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase">Arquivo de Foto (JPG/PNG)</label>
                  <input
                    type="file"
                    required
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-400 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-uniao-600 file:text-white hover:file:bg-uniao-500 cursor-pointer"
                  />
                </div>

                <div className="md:col-span-2 flex items-end">
                  <button
                    type="submit"
                    disabled={uploading || !selectedFile}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-uniao-400 to-teal-300 hover:brightness-110 disabled:opacity-40 transition-all shadow"
                  >
                    {uploading ? 'Enviando...' : '+ Publicar Foto'}
                  </button>
                </div>

                <div className="md:col-span-12 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase">Descrição Opcional</label>
                  <input
                    type="text"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Breve comentário explicativo sobre o treinamento na foto..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                  />
                </div>
              </form>

              {uploadSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Foto salva no Supabase Storage e publicada com sucesso na Landing Page!</span>
                </div>
              )}

              {/* Grid de Fotos já cadastradas */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Fotos Publicadas Atualmente ({galleryImages.length})
                </h4>

                {galleryImages.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 border border-white/5 rounded-2xl bg-slate-950/40">
                    Nenhuma foto customizada enviada ainda. As fotos padrão demonstrativas estão sendo exibidas.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {galleryImages.map((img) => (
                      <div key={img.id} className="relative group rounded-xl overflow-hidden border border-white/10 bg-slate-950">
                        <img src={img.image_url} alt={img.title} className="w-full h-28 object-cover" />
                        <div className="p-2 space-y-0.5">
                          <div className="text-[11px] font-bold text-white truncate">{img.title}</div>
                          <div className="text-[10px] text-uniao-400">{img.category}</div>
                        </div>
                        <button
                          onClick={() => handleDeleteImage(img.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                          title="Excluir foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL: CRIAR NOVA TURMA (OPÇÃO DE TURMA VAZIA, MANUAL OU IMPORTAR PDF/EXCEL) */}
      {/* ========================================================================= */}
      {isCreateCohortOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <School className="w-5 h-5 text-uniao-400" />
                <h3 className="font-bold text-white text-base">Cadastrar Nova Turma</h3>
              </div>
              <button 
                onClick={() => setIsCreateCohortOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCohort} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Nome da Turma</label>
                <input
                  type="text"
                  required
                  value={newCohortName}
                  onChange={(e) => setNewCohortName(e.target.value)}
                  placeholder="Ex: Turma Hospital Santa Cruz — SBV & DEA"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Prazo de Acesso (Dias)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newCohortDays}
                    onChange={(e) => setNewCohortDays(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono text-amber-300 font-bold focus:outline-none focus:border-uniao-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Vagas / Capacidade</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newCohortCapacity}
                    onChange={(e) => setNewCohortCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-uniao-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Local da Aula Prática Presencial</label>
                <input
                  type="text"
                  value={newCohortLocation}
                  onChange={(e) => setNewCohortLocation(e.target.value)}
                  placeholder="Ex: Base Central USM ou In Company"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                />
              </div>

              {/* OPÇÕES DE ALUNOS NA CRIAÇÃO: APENAS CRIAR TURMA, MANUAL OU IMPORTAR PDF/EXCEL */}
              <div className="pt-2 space-y-2 border-t border-white/10">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Matrícula de Alunos Inicial:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setCohortCreationMode('empty')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      cohortCreationMode === 'empty'
                        ? 'bg-uniao-600 text-white border-uniao-500 font-bold'
                        : 'bg-slate-950 text-slate-400 border-white/10 hover:text-white'
                    }`}
                  >
                    Apenas Criar Turma
                  </button>
                  <button
                    type="button"
                    onClick={() => setCohortCreationMode('manual')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      cohortCreationMode === 'manual'
                        ? 'bg-uniao-600 text-white border-uniao-500 font-bold'
                        : 'bg-slate-950 text-slate-400 border-white/10 hover:text-white'
                    }`}
                  >
                    Manual Depois
                  </button>
                  <button
                    type="button"
                    onClick={() => setCohortCreationMode('import')}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      cohortCreationMode === 'import'
                        ? 'bg-uniao-600 text-white border-uniao-500 font-bold'
                        : 'bg-slate-950 text-slate-400 border-white/10 hover:text-white'
                    }`}
                  >
                    Importar PDF/Excel
                  </button>
                </div>

                {cohortCreationMode === 'import' && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-2 animate-fadeIn">
                    <span className="text-[11px] text-slate-300 block font-semibold">
                      Selecione a lista em PDF ou planilha Excel (.xlsx, .csv):
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.xlsx,.xls,.csv"
                      onChange={(e) => setCohortImportFile(e.target.files?.[0] || null)}
                      className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-uniao-600 file:text-white hover:file:bg-uniao-500 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500 block">
                      A plataforma extrai Nome, E-mail e CPF automaticamente para a matrícula.
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateCohortOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-uniao-400 to-teal-300 hover:brightness-110 shadow"
                >
                  Confirmar e Criar Turma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADICIONAR ALUNO (SOMENTE UM OU IMPORTAR PDF/EXCEL) */}
      {/* ========================================================================= */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-uniao-400" />
                <h3 className="font-bold text-white text-base">Matricular Aluno na Turma</h3>
              </div>
              <button 
                onClick={() => setIsAddStudentOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Alternador de Modo: Somente Um vs Importar PDF/Excel */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setStudentAddMode('single')}
                className={`py-2 rounded-lg font-bold transition-all ${
                  studentAddMode === 'single'
                    ? 'bg-uniao-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Adicionar Somente Um
              </button>
              <button
                type="button"
                onClick={() => setStudentAddMode('import')}
                className={`py-2 rounded-lg font-bold transition-all ${
                  studentAddMode === 'import'
                    ? 'bg-uniao-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Importar PDF / Excel
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Turma de Matrícula</label>
              <select
                required
                value={newStudentCohortId}
                onChange={(e) => setNewStudentCohortId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
              >
                {cohorts.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {studentAddMode === 'single' ? (
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="Ex: Dra. Ana Paula Ramos"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">E-mail de Acesso</label>
                  <input
                    type="email"
                    required
                    value={newStudentEmail}
                    onChange={(e) => setNewStudentEmail(e.target.value)}
                    placeholder="aluno@exemplo.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">CPF (Opcional)</label>
                  <input
                    type="text"
                    value={newStudentCpf}
                    onChange={(e) => setNewStudentCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddStudentOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-uniao-400 to-teal-300 hover:brightness-110 shadow"
                  >
                    Matricular Aluno
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center space-y-2 bg-slate-950/60">
                  <input
                    type="file"
                    accept=".pdf,.xlsx,.xls,.csv"
                    onChange={(e) => setStudentImportFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-400 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-uniao-600 file:text-white hover:file:bg-uniao-500 cursor-pointer"
                  />
                  <div className="text-[11px] text-slate-400">
                    Formatos aceitos: PDF oficial de lista ou Planilha Excel (.xlsx, .csv).
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddStudentOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={!studentImportFile}
                    onClick={() => handleImportStudents(newStudentCohortId || cohorts[0]?.id)}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-uniao-400 to-teal-300 hover:brightness-110 disabled:opacity-40 shadow"
                  >
                    Processar e Importar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDITAR DADOS E TURMA DO ALUNO */}
      {/* ========================================================================= */}
      {isEditStudentOpen && editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <Settings className="w-5 h-5 text-uniao-400" />
                <h3 className="font-bold text-white text-base">Editar Aluno</h3>
              </div>
              <button 
                onClick={() => setIsEditStudentOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditStudent} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={editStudentName}
                  onChange={(e) => setEditStudentName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">E-mail</label>
                <input
                  type="email"
                  required
                  value={editStudentEmail}
                  onChange={(e) => setEditStudentEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">CPF</label>
                <input
                  type="text"
                  value={editStudentCpf}
                  onChange={(e) => setEditStudentCpf(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Turma Vinculada</label>
                <select
                  required
                  value={editStudentCohortId}
                  onChange={(e) => setEditStudentCohortId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                >
                  {cohorts.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditStudentOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-uniao-400 to-teal-300 hover:brightness-110 shadow"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PRÉ-VISUALIZAÇÃO COMPLETA DO CERTIFICADO (FRENTE & VERSO) */}
      {/* ========================================================================= */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            
            {/* Header da Prévia */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-uniao-500/10 text-uniao-400 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Pré-visualização Oficial do Certificado Digital</h3>
                  <p className="text-xs text-slate-400">
                    Turma Vinculada: <strong className="text-uniao-400">{currentCertCohort?.name || 'Turma Selecionada'}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Alternador Frente / Verso */}
                <div className="bg-slate-950 p-1 rounded-xl border border-white/10 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPreviewSide('front')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      previewSide === 'front' ? 'bg-uniao-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Frente
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewSide('back')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      previewSide === 'back' ? 'bg-uniao-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Verso (Ementa)
                  </button>
                </div>

                <button 
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Controle de Nome do Aluno na Prévia */}
            <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-white/5 text-xs">
              <span className="text-slate-400">Nome para teste na prévia:</span>
              <input
                type="text"
                value={previewStudentName}
                onChange={(e) => setPreviewStudentName(e.target.value)}
                className="bg-slate-900 px-3 py-1 rounded-lg border border-white/10 text-white font-bold text-xs focus:outline-none focus:border-uniao-500"
              />
            </div>

            {/* ============================================================= */}
            {/* O CERTIFICADO EM SI (DESIGN DE ALTA FIDELIDADE) */}
            {/* ============================================================= */}
            <div className="bg-white text-slate-900 rounded-2xl p-8 sm:p-12 shadow-2xl border-8 border-slate-900 relative overflow-hidden font-serif">
              
              {/* Borda Dourada Interna de Diploma */}
              <div className="border-2 border-amber-600/40 p-6 sm:p-10 relative">
                
                {previewSide === 'front' ? (
                  /* ===================================================== */
                  /* FRENTE DO CERTIFICADO */
                  /* ===================================================== */
                  <div className="text-center space-y-6">
                    
                    {/* Topo: Logo União e Cruz */}
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-12 h-12">
                        <img src="/brand/simbolo-cruz-uniao-verde.png" alt="Cruz USM" className="w-full h-full object-contain" />
                      </div>
                      <div className="text-left font-sans">
                        <div className="text-xl font-black text-slate-950 tracking-tight leading-none">UNIÃO</div>
                        <div className="text-[10px] font-bold text-teal-700 tracking-[0.25em] uppercase">SERVIÇOS MÉDICOS</div>
                      </div>
                    </div>

                    <div className="space-y-1 font-sans">
                      <span className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-700">
                        CERTIFICADO DE FORMAÇÃO PROFISSIONAL
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif">
                        {certTitle}
                      </h2>
                    </div>

                    <p className="text-sm text-slate-700 leading-relaxed max-w-2xl mx-auto font-sans">
                      Certificamos que <strong className="text-slate-950 font-bold underline decoration-amber-600 decoration-2 underline-offset-4 text-base">{previewStudentName}</strong> concluiu com aproveitamento integral a capacitação teórica, simulador clínico e treinamento prático presencial de alta fidelidade com carga horária de <strong className="font-bold text-slate-950">{certWorkload} horas</strong>.
                    </p>

                    <div className="text-xs text-slate-600 max-w-xl mx-auto italic font-sans">
                      Fundamentação Legal: {certLegal}
                    </div>

                    {/* Assinaturas */}
                    <div className="grid grid-cols-2 gap-8 pt-8 font-sans border-t border-slate-200 mt-6">
                      <div className="text-center space-y-1">
                        <div className="font-serif italic text-lg text-slate-800 font-bold border-b border-slate-400 pb-1 w-48 mx-auto">
                          {certInstructor}
                        </div>
                        <div className="text-[11px] font-bold text-slate-900">{certInstructor}</div>
                        <div className="text-[10px] text-slate-500">{certInstructorRole}</div>
                      </div>

                      <div className="text-center space-y-1">
                        <div className="font-serif italic text-lg text-slate-800 font-bold border-b border-slate-400 pb-1 w-48 mx-auto">
                          {certDirector.split('-')[0]}
                        </div>
                        <div className="text-[11px] font-bold text-slate-900">{certDirector}</div>
                        <div className="text-[10px] text-slate-500">União Serviços Médicos • CRM-SP</div>
                      </div>
                    </div>

                    {/* Rodapé com Hash e Autenticidade */}
                    <div className="pt-4 flex items-center justify-between text-[10px] text-slate-500 font-sans border-t border-slate-100">
                      <div>Código Autenticador: <strong>USM-2026-X89A-99F</strong></div>
                      <div>Validade: <strong>{certValidity} meses</strong></div>
                      <div>Emissão: <strong>{new Date().toLocaleDateString('pt-BR')}</strong></div>
                    </div>

                  </div>
                ) : (
                  /* ===================================================== */
                  /* VERSO DO CERTIFICADO (EMENTA E CONTEÚDO PROGRAMÁTICO) */
                  /* ===================================================== */
                  <div className="space-y-6 font-sans">
                    <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                      <div>
                        <h4 className="font-black text-sm uppercase tracking-wider text-slate-900">
                          Conteúdo Programático & Ementa do Treinamento
                        </h4>
                        <span className="text-xs text-slate-600">{certTitle}</span>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-lg text-slate-800 font-mono">
                        Carga Horária: {certWorkload} horas
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Módulos Teórico-Práticos Ministrados:
                      </div>

                      <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-700 leading-relaxed">
                        {certModules.map((item, i) => (
                          <li key={i} className="pl-1">
                            <strong>{item}</strong>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                      <strong className="text-slate-900 block">Metodologia Blended Learning USM:</strong>
                      <p>
                        Etapa 1: Videoaulas teóricas e estudos de caso • Etapa 2: Simulações Clínicas Interativas em Sistema de Decisão de Trauma • Etapa 3: Estação Prática Presencial Hands-on com manequins de RCP e torniquetes homologados.
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-[10px] text-slate-500">
                      <div>Registro Nacional de Capacitação Médica USM</div>
                      <div>Documento Válido em Todo Território Nacional</div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700"
              >
                Fechar Prévia
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
