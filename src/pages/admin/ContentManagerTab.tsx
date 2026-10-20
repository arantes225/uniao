import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Video, FileText, HelpCircle, CheckCircle2, 
  Search, Plus, Eye,
  ExternalLink, Trash2
} from 'lucide-react';
import { LearningModule, ContentLibrary } from '../../data/curriculumData';
import { CurriculumService } from '../../services/CurriculumService';
import { BookletRenderer } from '../../components/common/BookletRenderer';

export const ContentManagerTab: React.FC = () => {
  const [libraries, setLibraries] = useState<ContentLibrary[]>([]);
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLibraryId, setSelectedLibraryId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Editor Modal / Drawer
  const [editingModule, setEditingModule] = useState<LearningModule | null>(null);
  const [activeEditorSubtab, setActiveEditorSubtab] = useState<'info' | 'subtopics' | 'video' | 'material' | 'questions'>('info');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewVideoOpen, setPreviewVideoOpen] = useState(false);
  const [previewBookletMd, setPreviewBookletMd] = useState<string>('');
  const [previewBookletOpen, setPreviewBookletOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await CurriculumService.seedCurriculumIdempotent();
    const [libs, mods] = await Promise.all([
      CurriculumService.getLibraries(),
      CurriculumService.getModules()
    ]);
    setLibraries(libs);
    setModules(mods);
    setLoading(false);
  };

  const filteredModules = modules.filter(m => {
    const matchesLib = selectedLibraryId === 'all' || m.libraryId === selectedLibraryId;
    const matchesStatus = statusFilter === 'all' || m.editorialStatus === statusFilter;
    const matchesSearch = m.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLib && matchesStatus && matchesSearch;
  });

  // Estatísticas Reais
  const totalModules = modules.length;
  const publishedCount = modules.filter(m => m.editorialStatus === 'published').length;
  const inProductionCount = modules.filter(m => m.editorialStatus === 'in_production' || m.editorialStatus === 'draft').length;
  const withVideoCount = modules.filter(m => !!m.videoUrl).length;
  const withMaterialCount = modules.filter(m => !!m.materialPdfUrl || !!m.materialTitle).length;
  const questionsCount = modules.reduce((acc, m) => acc + (m.questions?.length || 0), 0);

  const handleOpenEdit = (mod: LearningModule) => {
    // Clona para edição local
    setEditingModule(JSON.parse(JSON.stringify(mod)));
    setActiveEditorSubtab('info');
    setSaveSuccess(false);
    setPreviewBookletOpen(false);
    setPreviewBookletMd('');
  };

  const handleCreateModule = () => {
    const newMod: LearningModule = {
      id: `MOD-${Date.now().toString().slice(-4)}`,
      libraryId: selectedLibraryId === 'all' ? 'core' : selectedLibraryId,
      code: `C${(modules.length + 1).toString().padStart(2, '0')}`,
      title: 'Novo Módulo de Capacitação',
      description: 'Descrição e objetivos pedagógicos do módulo.',
      durationMinutes: 45,
      workloadTheoretical: 1,
      workloadPractical: 0,
      editorialStatus: 'draft',
      videoProvider: 'google_drive',
      materialAllowDownload: true,
      materialVersion: 1,
      subtopics: [
        { position: 1, title: 'Introdução e contextualização' },
        { position: 2, title: 'Desenvolvimento e conduta' }
      ],
      questions: []
    };
    setEditingModule(newMod);
    setActiveEditorSubtab('info');
  };

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule) return;

    await CurriculumService.saveModule(editingModule);
    setModules(prev => prev.map(m => m.id === editingModule.id ? editingModule : m));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Subtemas helpers
  const handleAddSubtopic = () => {
    if (!editingModule) return;
    const nextPos = (editingModule.subtopics?.length || 0) + 1;
    setEditingModule({
      ...editingModule,
      subtopics: [
        ...(editingModule.subtopics || []),
        { position: nextPos, title: `Novo Subtema ${nextPos}` }
      ]
    });
  };

  const handleRemoveSubtopic = (idx: number) => {
    if (!editingModule) return;
    const next = [...(editingModule.subtopics || [])];
    next.splice(idx, 1);
    setEditingModule({
      ...editingModule,
      subtopics: next.map((s, i) => ({ ...s, position: i + 1 }))
    });
  };

  // Questões helpers
  const handleAddQuestion = () => {
    if (!editingModule) return;
    const nextPos = (editingModule.questions?.length || 0) + 1;
    if (nextPos > 5) {
      alert('Cada módulo possui 5 questões de fixação essenciais.');
      return;
    }
    setEditingModule({
      ...editingModule,
      questions: [
        ...(editingModule.questions || []),
        {
          position: nextPos,
          stem: `Enunciado da Questão 0${nextPos}`,
          options: ['Alternativa A', 'Alternativa B', 'Alternativa C', 'Alternativa D'],
          correctOptionIndex: 0,
          explanation: 'Comentário instrutivo pedagógico da resposta correta.'
        }
      ]
    });
  };

  const handleRemoveQuestion = (idx: number) => {
    if (!editingModule) return;
    const next = [...(editingModule.questions || [])];
    next.splice(idx, 1);
    setEditingModule({
      ...editingModule,
      questions: next.map((q, i) => ({ ...q, position: i + 1 }))
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Cabeçalho da Gestão de Conteúdos */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-uniao-500/10 border border-uniao-500/30 text-uniao-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Gestão Central de Conteúdos & Catálogo Curricular</h2>
            <p className="text-xs text-slate-400">
              Gerencie 5 bibliotecas, 40 módulos, subtemas, links do Google Drive, apostilas PDF e questões de fixação.
            </p>
          </div>
        </div>

        <button
          onClick={handleCreateModule}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-uniao-400 to-teal-300 hover:brightness-110 shadow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ Criar Módulo</span>
        </button>
      </div>

      {/* Métricas Reais do CMS Educacional */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Total de Módulos</span>
          <div className="text-2xl font-black text-white">{totalModules}</div>
          <div className="text-[10px] text-uniao-400">5 bibliotecas ativas</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Publicados</span>
          <div className="text-2xl font-black text-emerald-400">{publishedCount}</div>
          <div className="text-[10px] text-slate-400">Liberados p/ alunos</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Em Produção/Rascunho</span>
          <div className="text-2xl font-black text-amber-400">{inProductionCount}</div>
          <div className="text-[10px] text-slate-400">Aguardando mídias</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Vídeos Cadastrados</span>
          <div className="text-2xl font-black text-blue-400">{withVideoCount} / 40</div>
          <div className="text-[10px] text-slate-400">Google Drive</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Apostilas Atreladas</span>
          <div className="text-2xl font-black text-purple-400">{withMaterialCount} / 40</div>
          <div className="text-[10px] text-slate-400">PDFs pedagógicos</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Questões de Fixação</span>
          <div className="text-2xl font-black text-teal-400">{questionsCount} / 200</div>
          <div className="text-[10px] text-slate-400">Meta: 5 por módulo</div>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-white/10 text-xs">
        {/* Seletor de Biblioteca */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedLibraryId('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              selectedLibraryId === 'all'
                ? 'bg-uniao-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Todas as Bibliotecas ({totalModules})
          </button>
          {libraries.map(lib => (
            <button
              key={lib.id}
              onClick={() => setSelectedLibraryId(lib.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                selectedLibraryId === lib.id
                  ? 'bg-uniao-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {lib.name} ({modules.filter(m => m.libraryId === lib.id).length})
            </button>
          ))}
        </div>

        {/* Busca e Status */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por código ou título..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs w-56 focus:outline-none focus:border-uniao-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
          >
            <option value="all">Todos os Status</option>
            <option value="published">Publicado</option>
            <option value="in_production">Em Produção</option>
            <option value="draft">Rascunho</option>
            <option value="awaiting_review">Aguardando Revisão</option>
          </select>
        </div>
      </div>

      {/* Tabela de Módulos */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/10 font-bold">
              <tr>
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Título do Módulo</th>
                <th className="py-3 px-4">Biblioteca</th>
                <th className="py-3 px-4">Subtemas</th>
                <th className="py-3 px-4">Videoaula (Drive)</th>
                <th className="py-3 px-4">Apostila PDF</th>
                <th className="py-3 px-4">Questões</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Carregando catálogo de 40 módulos...
                  </td>
                </tr>
              ) : filteredModules.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    Nenhum módulo encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredModules.map(mod => {
                  const hasVideo = !!mod.videoUrl;
                  const hasMaterial = !!mod.materialPdfUrl || !!mod.materialTitle;
                  const qCount = mod.questions?.length || 0;

                  return (
                    <tr key={mod.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-uniao-400 bg-uniao-500/10 px-2 py-0.5 rounded border border-uniao-500/20">
                          {mod.code}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-white max-w-xs truncate" title={mod.title}>
                        {mod.title}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {libraries.find(l => l.id === mod.libraryId)?.name || mod.libraryId}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {mod.subtopics?.length || 0} subtemas
                      </td>
                      <td className="py-3 px-4">
                        {hasVideo ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                            <Video className="w-3.5 h-3.5" />
                            <span>Vinculado</span>
                          </span>
                        ) : (
                          <span className="text-slate-500 font-normal">Pendente</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {hasMaterial ? (
                          <span className="inline-flex items-center gap-1 text-purple-400 font-semibold truncate max-w-[140px]" title={mod.materialTitle}>
                            <FileText className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{mod.materialTitle || 'PDF Ativo'}</span>
                          </span>
                        ) : (
                          <span className="text-slate-500 font-normal">Pendente</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 font-bold ${
                          qCount >= 5 ? 'text-emerald-400' : qCount > 0 ? 'text-amber-400' : 'text-slate-500 font-normal'
                        }`}>
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>{qCount}/5</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          mod.editorialStatus === 'published'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : mod.editorialStatus === 'in_production'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : mod.editorialStatus === 'awaiting_review'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-slate-500/10 text-slate-400 border-slate-500/30'
                        }`}>
                          {mod.editorialStatus === 'published' ? 'Publicado' :
                           mod.editorialStatus === 'in_production' ? 'Em Produção' :
                           mod.editorialStatus === 'awaiting_review' ? 'Revisão' : 'Rascunho'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenEdit(mod)}
                          className="px-3 py-1.5 rounded-lg bg-uniao-600/80 hover:bg-uniao-500 text-white font-bold transition-all shadow-xs"
                        >
                          Editar Módulo
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EDITOR COMPLETO DO MÓDULO (INFORMAÇÕES | SUBTEMAS | VIDEO | APOSTILA | QUESTÕES) */}
      {/* ========================================================================= */}
      {editingModule && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-uniao-500/40 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[92vh] flex flex-col animate-fadeIn">
            
            {/* Header do Editor */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-black px-2.5 py-1 rounded-xl bg-uniao-500/20 text-uniao-400 border border-uniao-500/40">
                  {editingModule.code}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white truncate max-w-lg">
                    {editingModule.title}
                  </h3>
                  <span className="text-xs text-slate-400">
                    Biblioteca: {libraries.find(l => l.id === editingModule.libraryId)?.name || editingModule.libraryId}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {saveSuccess && (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-pulse">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Salvo no Supabase!</span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setEditingModule(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-xs font-bold"
                >
                  ✕ Fechar
                </button>
              </div>
            </div>

            {/* Abas do Editor */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs font-bold shrink-0 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveEditorSubtab('info')}
                className={`px-3 py-2 rounded-xl transition-all ${
                  activeEditorSubtab === 'info'
                    ? 'bg-uniao-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                1. Informações Gerais
              </button>
              <button
                type="button"
                onClick={() => setActiveEditorSubtab('subtopics')}
                className={`px-3 py-2 rounded-xl transition-all ${
                  activeEditorSubtab === 'subtopics'
                    ? 'bg-uniao-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                2. Subtemas ({editingModule.subtopics?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveEditorSubtab('video')}
                className={`px-3 py-2 rounded-xl transition-all ${
                  activeEditorSubtab === 'video'
                    ? 'bg-uniao-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                3. Videoaula (Google Drive)
              </button>
              <button
                type="button"
                onClick={() => setActiveEditorSubtab('material')}
                className={`px-3 py-2 rounded-xl transition-all ${
                  activeEditorSubtab === 'material'
                    ? 'bg-uniao-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                4. Apostila (PDF)
              </button>
              <button
                type="button"
                onClick={() => setActiveEditorSubtab('questions')}
                className={`px-3 py-2 rounded-xl transition-all ${
                  activeEditorSubtab === 'questions'
                    ? 'bg-uniao-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                5. 5 Questões de Fixação ({editingModule.questions?.length || 0}/5)
              </button>
            </div>

            {/* Conteúdo da Aba Ativa */}
            <div className="flex-1 overflow-y-auto pr-1">
              <form id="module-editor-form" onSubmit={handleSaveModule} className="space-y-6">
                
                {/* SUBABA 1: INFORMAÇÕES */}
                {activeEditorSubtab === 'info' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-300">Código do Módulo</label>
                      <input
                        type="text"
                        value={editingModule.code}
                        onChange={e => setEditingModule({ ...editingModule, code: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-mono"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-300">Biblioteca Curricular</label>
                      <select
                        value={editingModule.libraryId}
                        onChange={e => setEditingModule({ ...editingModule, libraryId: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                      >
                        {libraries.map(lib => (
                          <option key={lib.id} value={lib.id}>{lib.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="font-semibold text-slate-300">Título do Módulo</label>
                      <input
                        type="text"
                        value={editingModule.title}
                        onChange={e => setEditingModule({ ...editingModule, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-sm font-bold"
                        required
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="font-semibold text-slate-300">Descrição Geral</label>
                      <textarea
                        rows={3}
                        value={editingModule.description}
                        onChange={e => setEditingModule({ ...editingModule, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-300">Duração Estimada (min)</label>
                      <input
                        type="number"
                        value={editingModule.durationMinutes}
                        onChange={e => setEditingModule({ ...editingModule, durationMinutes: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-300">Estado de Publicação</label>
                      <select
                        value={editingModule.editorialStatus}
                        onChange={e => setEditingModule({ ...editingModule, editorialStatus: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-bold"
                      >
                        <option value="draft">Rascunho (Oculto)</option>
                        <option value="in_production">Em Produção</option>
                        <option value="awaiting_review">Aguardando Revisão Científica</option>
                        <option value="approved">Aprovado</option>
                        <option value="published">Publicado (Visível aos Alunos)</option>
                        <option value="archived">Arquivado</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* SUBABA 2: SUBTEMAS (Capítulos da Aula) */}
                {activeEditorSubtab === 'subtopics' && (
                  <div className="space-y-4 text-xs">
                    <div className="flex items-center justify-between">
                      <p className="text-slate-400">
                        Cada módulo é <strong>uma aula completa</strong> com capítulos/subtemas estruturados. Adicione livremente sem limite artificial.
                      </p>
                      <button
                        type="button"
                        onClick={handleAddSubtopic}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1 border border-white/10"
                      >
                        <Plus className="w-3.5 h-3.5 text-uniao-400" />
                        <span>Adicionar Subtema</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {editingModule.subtopics?.map((sub, sIdx) => (
                        <div key={sIdx} className="p-3 rounded-xl bg-slate-950 border border-white/10 flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-uniao-500/20 text-uniao-400 border border-uniao-500/30 flex items-center justify-center font-bold text-[11px] shrink-0">
                            {sIdx + 1}
                          </span>
                          <input
                            type="text"
                            value={sub.title}
                            onChange={e => {
                              const next = [...(editingModule.subtopics || [])];
                              next[sIdx].title = e.target.value;
                              setEditingModule({ ...editingModule, subtopics: next });
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
                            placeholder="Título do subtema..."
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSubtopic(sIdx)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Remover Subtema"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUBABA 3: VIDEOAULA (Google Drive) */}
                {activeEditorSubtab === 'video' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                      <div className="flex items-center gap-2 text-uniao-400 font-bold">
                        <Video className="w-4 h-4" />
                        <span>Hospedagem Gratuita de Videoaulas via Google Drive</span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        Cole o link de visualização ou compartilhamento do arquivo no Google Drive. O sistema converterá automaticamente para a URL de incorporação segura (<code className="text-teal-300">/preview</code>).
                      </p>

                      <div className="space-y-1 pt-1">
                        <label className="font-semibold text-slate-300">Link do Vídeo no Google Drive</label>
                        <input
                          type="url"
                          placeholder="https://drive.google.com/file/d/1234567890abcdef/view"
                          value={editingModule.videoUrl || ''}
                          onChange={e => setEditingModule({ ...editingModule, videoUrl: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-300">Duração do Vídeo</label>
                          <input
                            type="text"
                            placeholder="Ex: 15 min"
                            value={editingModule.videoDuration || ''}
                            onChange={e => setEditingModule({ ...editingModule, videoDuration: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold text-slate-300">Provedor</label>
                          <select
                            value={editingModule.videoProvider}
                            onChange={e => setEditingModule({ ...editingModule, videoProvider: e.target.value as any })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                          >
                            <option value="google_drive">Google Drive (Padrão Gratuito)</option>
                            <option value="youtube">YouTube (Vídeos Públicos)</option>
                            <option value="vimeo">Vimeo</option>
                            <option value="custom">Streaming Personalizado</option>
                          </select>
                        </div>
                      </div>

                      {/* Botão de Testar e Pré-visualizar Incorporação */}
                      {editingModule.videoUrl && (
                        <div className="pt-2 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setPreviewVideoOpen(!previewVideoOpen)}
                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1.5 border border-white/10 shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-teal-400" />
                            <span>{previewVideoOpen ? 'Fechar Pré-visualização' : 'Testar e Pré-visualizar Vídeo'}</span>
                          </button>
                          <a
                            href={editingModule.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-uniao-400 hover:text-white flex items-center gap-1 text-[11px]"
                          >
                            <span>Abrir no Drive</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Prévia do Player Incorporado */}
                    {previewVideoOpen && editingModule.videoUrl && (
                      <div className="p-4 rounded-2xl bg-black border border-slate-700 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Player de Teste Incorporado (Google Drive / iframe)
                        </span>
                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">
                          <iframe
                            src={CurriculumService.formatDriveEmbedUrl(editingModule.videoUrl) || ''}
                            title="Pré-visualização da videoaula"
                            className="w-full h-full border-0"
                            allow="autoplay"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* SUBABA 4: APOSTILA (PDF) */}
                {activeEditorSubtab === 'material' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                      <div className="flex items-center gap-2 text-purple-400 font-bold">
                        <FileText className="w-4 h-4" />
                        <span>Gerenciamento da Apostila Principal (PDF)</span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        Cada módulo possui uma apostila oficial em PDF. Você pode informar o título, vincular uma URL ou fazer upload e substituição segura de versão.
                      </p>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-300">Título do Arquivo / Apostila</label>
                        <input
                          type="text"
                          placeholder="Ex: Apostila_USM_Mod01_Fundamentos.pdf"
                          value={editingModule.materialTitle || ''}
                          onChange={e => setEditingModule({ ...editingModule, materialTitle: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-300">URL / Caminho do PDF (Supabase Storage ou Link Seguro)</label>
                        <input
                          type="text"
                          placeholder="https://... ou caminho relativo do bucket"
                          value={editingModule.materialPdfUrl || ''}
                          onChange={e => setEditingModule({ ...editingModule, materialPdfUrl: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-[11px]"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-4 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingModule.materialAllowDownload}
                            onChange={e => setEditingModule({ ...editingModule, materialAllowDownload: e.target.checked })}
                            className="rounded bg-slate-900 border-white/10 text-uniao-500"
                          />
                          <span className="text-slate-300">Permitir download do PDF pelo aluno</span>
                        </label>
                        <span className="text-slate-500">
                          Versão atual: v{editingModule.materialVersion || 1}
                        </span>
                        <button
                          type="button"
                          onClick={async () => {
                            if (previewBookletOpen) {
                              setPreviewBookletOpen(false);
                              return;
                            }
                            const res = await fetch(`./apostilas/md/${editingModule.code}.md`);
                            if (res.ok) {
                              setPreviewBookletMd(await res.text());
                              setPreviewBookletOpen(true);
                            }
                          }}
                          className="ml-auto px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 font-bold flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{previewBookletOpen ? 'Ocultar Apostila Renderizada' : 'Visualizar Apostila Completa e Imagens'}</span>
                        </button>
                      </div>
                    </div>

                    {previewBookletOpen && previewBookletMd && (
                      <div className="p-6 rounded-2xl bg-slate-900 border border-purple-500/30 max-h-[60vh] overflow-y-auto">
                        <BookletRenderer markdown={previewBookletMd} />
                      </div>
                    )}
                  </div>
                )}

                {/* SUBABA 5: 5 QUESTÕES DE FIXAÇÃO */}
                {activeEditorSubtab === 'questions' && (
                  <div className="space-y-4 text-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-slate-400">
                          Meta pedagógica da União: <strong>5 questões de fixação</strong> por módulo. Cadastradas: <strong>{editingModule.questions?.length || 0}/5</strong>
                        </span>
                      </div>
                      {(editingModule.questions?.length || 0) < 5 && (
                        <button
                          type="button"
                          onClick={handleAddQuestion}
                          className="px-3 py-1.5 rounded-xl bg-uniao-600 hover:bg-uniao-500 text-white font-bold flex items-center gap-1 shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Adicionar Questão</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {editingModule.questions?.length === 0 ? (
                        <div className="p-6 text-center text-slate-500 bg-slate-950 rounded-2xl border border-white/10 space-y-2">
                          <HelpCircle className="w-8 h-8 text-slate-600 mx-auto" />
                          <p>Nenhuma questão de fixação cadastrada para este módulo ainda.</p>
                          <button
                            type="button"
                            onClick={handleAddQuestion}
                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
                          >
                            + Cadastrar Questão 01
                          </button>
                        </div>
                      ) : (
                        editingModule.questions?.map((q, qIdx) => (
                          <div key={qIdx} className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                              <span className="font-bold text-uniao-400">
                                Questão 0{qIdx + 1} de 5
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveQuestion(qIdx)}
                                className="text-slate-500 hover:text-red-400 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="space-y-1">
                              <label className="font-semibold text-slate-300">Enunciado da Questão</label>
                              <textarea
                                rows={2}
                                value={q.stem}
                                onChange={e => {
                                  const next = [...(editingModule.questions || [])];
                                  next[qIdx].stem = e.target.value;
                                  setEditingModule({ ...editingModule, questions: next });
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                              />
                            </div>

                            {/* Alternativas */}
                            <div className="space-y-2">
                              <label className="font-semibold text-slate-400 block text-[11px]">Alternativas (selecione a correta):</label>
                              {q.options.map((opt, oIdx) => (
                                <div key={oIdx} className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`correct-${qIdx}`}
                                    checked={q.correctOptionIndex === oIdx}
                                    onChange={() => {
                                      const next = [...(editingModule.questions || [])];
                                      next[qIdx].correctOptionIndex = oIdx;
                                      setEditingModule({ ...editingModule, questions: next });
                                    }}
                                    className="text-uniao-500"
                                  />
                                  <input
                                    type="text"
                                    value={opt}
                                    onChange={e => {
                                      const next = [...(editingModule.questions || [])];
                                      next[qIdx].options[oIdx] = e.target.value;
                                      setEditingModule({ ...editingModule, questions: next });
                                    }}
                                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white text-xs"
                                  />
                                </div>
                              ))}
                            </div>

                            <div className="space-y-1 pt-1">
                              <label className="font-semibold text-slate-400 block text-[11px]">Comentário Pedagógico / Gabarito Comentado</label>
                              <textarea
                                rows={2}
                                value={q.explanation}
                                onChange={e => {
                                  const next = [...(editingModule.questions || [])];
                                  next[qIdx].explanation = e.target.value;
                                  setEditingModule({ ...editingModule, questions: next });
                                }}
                                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white text-xs text-slate-300"
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

              </form>
            </div>

            {/* Rodapé do Modal */}
            <div className="border-t border-white/10 pt-4 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500">
                Alterações persistidas diretamente no Supabase oficial da União.
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditingModule(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  form="module-editor-form"
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-uniao-400 to-teal-300 hover:brightness-110 shadow-lg"
                >
                  Salvar Módulo no Supabase
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
