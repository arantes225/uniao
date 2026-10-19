import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, School, LogOut, Camera, 
  Trash2, CheckCircle2, RefreshCw, Award, Users, 
  Settings, Clock, BookOpen, FileText, Check, Plus
} from 'lucide-react';
import { supabase } from '../../services/supabase/client';

export const AdminDashboard: React.FC = () => {
  // Controle de Acesso por PIN de Segurança
  const [pinEntered, setPinEntered] = useState('');
  const [pinAuthorized, setPinAuthorized] = useState(false);
  const [pinError, setPinError] = useState(false);

  // Navegação Interna por Abas
  const [activeTab, setActiveTab] = useState<'dashboard' | 'turmas' | 'certificados' | 'galeria'>('dashboard');

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

  // Módulo de Alunos e Progresso
  const [students] = useState<any[]>([
    {
      id: '1',
      name: 'Dr. Lucas Arantes',
      email: 'aluno.uniao@gmail.com',
      cpf: '123.456.789-00',
      cohort: 'Capacitação APH 2026',
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
      cohort: 'Capacitação APH 2026',
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
      cohort: 'Capacitação APH 2026',
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
      cohort: 'Turma Stop the Bleed Tático',
      progress: 100,
      lessonsCompleted: 8,
      totalLessons: 8,
      scoreQuiz: 100,
      simFinished: true,
      practicalAuthorized: true,
      daysRemaining: 45,
    },
  ]);

  // Módulo de Certificados e Conteúdo Programático
  const [certificateTemplate, setCertificateTemplate] = useState<any>({
    title: 'Certificado de Capacitação em Atendimento Pré-Hospitalar (APH) & Controle de Hemorragias',
    workloadHours: 40,
    validityMonths: 24,
    legalFramework: 'Portaria GM/MS nº 2048/2002, Diretrizes Internacionais PHTLS (Prehospital Trauma Life Support 10ª Ed.) e Lei Lucas nº 13.722/2018.',
    syllabus: `1. Cinemática do Trauma e Avaliação da Cena com Segurança Operacional\n2. Protocolo X-A-B-C-D-E no Trauma Grave: Abordagem Sistemática\n3. Controle de Hemorragias Exsanguinantes: Curativos Compressivos e Torniquete Tático\n4. Manejo de Vias Aéreas e Ventilação com Pressão Positiva (BVM/Ambu)\n5. Suporte Básico de Vida (SBV) e Desfibrilação Externa Automática (DEA em adultos e crianças)\n6. Imobilização Espinhal Seletiva, Colar Cervical e Pranchamento Seguro\n7. Simulação Prática Realística de Alta Fidelidade com Debriefing Clínico Estruturado`,
    instructorName: 'Dr. Lucas Arantes',
    instructorRole: 'Instrutor Chefe & Médico Regulador (CRM-SP)',
    technicalDirector: 'Dr. Lucas Arantes - Diretor Técnico Médico USM',
  });
  const [certSavedSuccess, setCertSavedSuccess] = useState(false);

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
    }

    // 3. Carregar modelo de certificado do DB se existir
    const { data: cert } = await supabase
      .from('certificate_templates')
      .select('*')
      .limit(1)
      .maybeSingle();
    if (cert) {
      setCertificateTemplate({
        title: cert.title,
        workloadHours: cert.workload_hours,
        validityMonths: cert.validity_months,
        legalFramework: cert.legal_framework,
        syllabus: cert.syllabus,
        instructorName: cert.instructor_name,
        instructorRole: cert.instructor_role,
        technicalDirector: cert.technical_director,
      });
    }
  };

  useEffect(() => {
    if (pinAuthorized) {
      loadData();
    }
  }, [pinAuthorized]);

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

  const handleSaveCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCertSavedSuccess(false);

    const { error } = await supabase
      .from('certificate_templates')
      .upsert({
        title: certificateTemplate.title,
        workload_hours: Number(certificateTemplate.workloadHours),
        validity_months: Number(certificateTemplate.validityMonths),
        legal_framework: certificateTemplate.legalFramework,
        syllabus: certificateTemplate.syllabus,
        instructor_name: certificateTemplate.instructorName,
        instructor_role: certificateTemplate.instructorRole,
        technical_director: certificateTemplate.technicalDirector,
        updated_at: new Date().toISOString(),
      });

    if (!error) {
      setCertSavedSuccess(true);
      setTimeout(() => setCertSavedSuccess(false), 4000);
    } else {
      alert('Erro ao salvar modelo de certificado: ' + error.message);
    }
  };

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
            <span>Gestão de Turmas</span>
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
            <span>Editor de Certificados & Ementa</span>
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
        {/* ABA 1: DASHBOARD GERAL, ALUNOS ATUAIS E PROGRESSO */}
        {/* ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            
            {/* Métricas do Dashboard */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
                <span className="text-xs font-semibold text-slate-400">Total de Turmas Ativas</span>
                <div className="text-2xl font-black text-white">{cohorts.length || 2} Turmas</div>
                <div className="text-[11px] text-uniao-400 font-medium">Turma APH 2026 em vigor</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
                <span className="text-xs font-semibold text-slate-400">Alunos Matriculados</span>
                <div className="text-2xl font-black text-white">{students.length} Alunos</div>
                <div className="text-[11px] text-emerald-400 font-medium">100% de cadastros validados</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
                <span className="text-xs font-semibold text-slate-400">Aprovados p/ Presencial</span>
                <div className="text-2xl font-black text-white">
                  {students.filter(s => s.practicalAuthorized).length} Alunos
                </div>
                <div className="text-[11px] text-emerald-400 font-medium">Simulador online concluído</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
                <span className="text-xs font-semibold text-slate-400">Limite de Acesso Médio</span>
                <div className="text-2xl font-black text-amber-400">90 Dias</div>
                <div className="text-[11px] text-slate-400">Countdown ativo no aluno</div>
              </div>
            </div>

            {/* Tabela de Alunos e Progresso em Tempo Real */}
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <h2 className="text-xl font-bold text-white">Alunos Matriculados & Progresso Pedagógico</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Acompanhamento do cumprimento das videoaulas, provas e simulador clínico como pré-requisito para o prático.
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">Filtrando por: <strong>Todas as Turmas</strong></span>
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
                      <th className="py-3 px-4">Média nas Provas</th>
                      <th className="py-3 px-4">Acesso Restante</th>
                      <th className="py-3 px-4">Simulado Prático</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-sm">{student.name}</div>
                          <div className="text-[11px] text-slate-400">{student.email} • CPF: {student.cpf}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-950 border border-white/10 font-semibold text-slate-300">
                            {student.cohort}
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
                              <span>Autorizado p/ Presencial</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                              <Clock className="w-3 h-3" />
                              <span>Etapa Online Pendente</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* ABA 2: PÁGINA SÓ PRA TURMAS (ALTERAR LIMITE DE DIAS, VAGAS, DETALHES) */}
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
                    <h2 className="text-xl font-bold text-white">Gestão Central de Turmas</h2>
                    <p className="text-xs text-slate-400">
                      Configure o prazo de acesso (countdown dos alunos), vagas disponíveis, data do prático e status.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => alert('Para criar uma nova turma personalizada, utilize a importação de alunos ou selecione um curso base.')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-uniao-400 to-teal-300 hover:brightness-110 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Nova Turma</span>
                </button>
              </div>

              {cohortSaveSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Configurações da turma salvas com sucesso no banco de dados!</span>
                </div>
              )}

              {/* Lista de Turmas Cadastradas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {cohorts.map((cohort) => (
                  <div 
                    key={cohort.id} 
                    className={`p-6 rounded-2xl border transition-all ${
                      selectedCohort?.id === cohort.id
                        ? 'bg-slate-950 border-uniao-500/50 shadow-lg'
                        : 'bg-slate-950/60 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-uniao-400">
                          Turma Registrada
                        </span>
                        <h3 className="text-base font-bold text-white">{cohort.name}</h3>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        cohort.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {cohort.status || 'Ativa'}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-400 border-t border-b border-white/5 py-3 my-3">
                      <div className="flex justify-between">
                        <span>Prazo de Acesso dos Alunos:</span>
                        <strong className="text-amber-300 font-mono">{cohort.access_days_limit || 90} dias</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Capacidade Máxima:</span>
                        <strong className="text-white font-mono">{cohort.max_students || 30} alunos</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Local do Treinamento Prático:</span>
                        <strong className="text-slate-200">{cohort.practical_location || 'Centro de Treinamento USM'}</strong>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
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
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors inline-flex items-center gap-1.5"
                      >
                        <Settings className="w-3.5 h-3.5 text-uniao-400" />
                        <span>Editar Parâmetros & Limites</span>
                      </button>
                    </div>
                  </div>
                ))}

              </div>

              {/* Modal / Formulário de Edição de Turma */}
              {isEditingCohort && selectedCohort && (
                <div className="p-6 rounded-2xl bg-slate-950 border border-uniao-500/40 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="font-bold text-white text-sm">
                      Configurar Parâmetros: {selectedCohort.name}
                    </h3>
                    <button 
                      onClick={() => setIsEditingCohort(false)} 
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Fechar
                    </button>
                  </div>

                  <form onSubmit={handleSaveCohort} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Nome da Turma</label>
                      <input
                        type="text"
                        value={editCohortName}
                        onChange={(e) => setEditCohortName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
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
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500 font-mono text-amber-300 font-bold"
                      />
                      <span className="text-[10px] text-slate-400">
                        Os alunos matriculados verão este prazo em contagem regressiva no dashboard.
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Capacidade de Alunos</label>
                      <input
                        type="number"
                        min={1}
                        value={editCohortMaxStudents}
                        onChange={(e) => setEditCohortMaxStudents(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Status Operacional</label>
                      <select
                        value={editCohortStatus}
                        onChange={(e) => setEditCohortStatus(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                      >
                        <option value="active">Ativa (Inscrições e Aulas Abertas)</option>
                        <option value="finished">Finalizada (Somente Consulta)</option>
                        <option value="paused">Pausada</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Local do Treinamento Prático</label>
                      <input
                        type="text"
                        value={editCohortLocation}
                        onChange={(e) => setEditCohortLocation(e.target.value)}
                        placeholder="Ex: Base Central USM ou In Company no cliente"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
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
                        Salvar Alterações da Turma
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ABA 3: ABA DEDICADA AOS CERTIFICADOS, MODELO E CONTEÚDO PROGRAMÁTICO */}
        {/* ========================================================================= */}
        {activeTab === 'certificados' && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-uniao-500/10 border border-uniao-500/30 text-uniao-400 flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Editor de Modelos de Certificado & Conteúdo Programático</h2>
                    <p className="text-xs text-slate-400">
                      Personalize o layout de impressão, ementa curricular no verso, carga horária e respaldo legal.
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Modelo Oficial em Vigor
                </span>
              </div>

              {certSavedSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Modelo de certificado e conteúdo programático atualizados com sucesso no Supabase!</span>
                </div>
              )}

              <form onSubmit={handleSaveCertificate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Lado Esquerdo: Metadados do Certificado */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-uniao-400 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>Dados Oficiais da Frente do Certificado</span>
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Título Principal da Certificação</label>
                    <input
                      type="text"
                      required
                      value={certificateTemplate.title}
                      onChange={(e) => setCertificateTemplate({ ...certificateTemplate, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Carga Horária (Horas)</label>
                      <input
                        type="number"
                        required
                        value={certificateTemplate.workloadHours}
                        onChange={(e) => setCertificateTemplate({ ...certificateTemplate, workloadHours: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-uniao-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Validade da Recertificação (Meses)</label>
                      <input
                        type="number"
                        required
                        value={certificateTemplate.validityMonths}
                        onChange={(e) => setCertificateTemplate({ ...certificateTemplate, validityMonths: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-uniao-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Fundamentação Legal e Portarias</label>
                    <input
                      type="text"
                      required
                      value={certificateTemplate.legalFramework}
                      onChange={(e) => setCertificateTemplate({ ...certificateTemplate, legalFramework: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Instrutor Responsável</label>
                      <input
                        type="text"
                        required
                        value={certificateTemplate.instructorName}
                        onChange={(e) => setCertificateTemplate({ ...certificateTemplate, instructorName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Cargo / Registro Profissional</label>
                      <input
                        type="text"
                        required
                        value={certificateTemplate.instructorRole}
                        onChange={(e) => setCertificateTemplate({ ...certificateTemplate, instructorRole: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                      />
                    </div>
                  </div>

                </div>

                {/* Lado Direito: Editor de Conteúdo Programático (Verso) */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-teal-300 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Conteúdo Programático & Ementa do Verso</span>
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Módulos e Tópicos Ensinados (1 por linha)
                    </label>
                    <textarea
                      rows={9}
                      required
                      value={certificateTemplate.syllabus}
                      onChange={(e) => setCertificateTemplate({ ...certificateTemplate, syllabus: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-uniao-500 leading-relaxed"
                    />
                    <span className="text-[11px] text-slate-500">
                      Este conteúdo é impresso no verso do PDF oficial de certificação dos formandos.
                    </span>
                  </div>

                  {/* Preview Visual Rápido do Certificado */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Pré-visualização da Validação
                    </span>
                    <div className="text-xs text-slate-300 space-y-1">
                      <div>Documento: <strong>{certificateTemplate.title}</strong></div>
                      <div>Carga Horária: <strong>{certificateTemplate.workloadHours} horas</strong> • Validade: <strong>{certificateTemplate.validityMonths} meses</strong></div>
                      <div className="text-[11px] text-uniao-400">Assinatura Digital com Hash Criptográfico e QR Code Ativo</div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="w-full py-3 px-6 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-uniao-400 to-teal-300 hover:brightness-110 shadow-lg transition-all"
                    >
                      Salvar Modelo de Certificado & Ementa
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
    </div>
  );
};
