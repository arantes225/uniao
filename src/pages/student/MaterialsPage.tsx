import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { BookOpen, CheckCircle2, Eye, X, Search, Layers } from 'lucide-react';
import { INITIAL_LIBRARIES, INITIAL_40_MODULES, LearningModule } from '../../data/curriculumData';
import { BookletRenderer, TextHighlightToolbar } from '../../components/common/BookletRenderer';
import { useTheme } from '../../context/ThemeContext';
import { StudentOutletContext } from '../../services/studentCurriculum';

export const MaterialsPage: React.FC = () => {
  const { theme } = useTheme();
  const { allowedModuleIds, curriculumLoading, curriculumError } = useOutletContext<StudentOutletContext>();
  const [selectedLibraryId, setSelectedLibraryId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeModule, setActiveModule] = useState<LearningModule | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [loadingMd, setLoadingMd] = useState<boolean>(false);
  const [studiedCodes, setStudiedCodes] = useState<string[]>(['C01', 'C02', 'H01']);

  const filteredModules = INITIAL_40_MODULES.filter(mod => {
    if (!allowedModuleIds.includes(mod.code)) return false;
    const matchesLib = selectedLibraryId === 'all' || mod.libraryId === selectedLibraryId;
    const matchesSearch =
      mod.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLib && matchesSearch;
  });

  const handleOpenBooklet = async (mod: LearningModule) => {
    if (!allowedModuleIds.includes(mod.code) || curriculumLoading || curriculumError) return;
    setActiveModule(mod);
    setLoadingMd(true);
    try {
      const res = await fetch(`./apostilas/md/${mod.code}.md`);
      if (res.ok) {
        const text = await res.text();
        setMarkdownContent(text);
      } else {
        setMarkdownContent(`# ${mod.code} — ${mod.title}\n\nApostila em carregamento...`);
      }
    } catch {
      setMarkdownContent(`# ${mod.code} — ${mod.title}\n\nErro ao carregar o arquivo da apostila.`);
    } finally {
      setLoadingMd(false);
    }
  };

  const toggleStudied = (code: string) => {
    setStudiedCodes(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModule(null);
      if (activeModule && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModule]);

  if (curriculumLoading) return <p className="p-8 text-sm text-slate-400">Carregando apostilas da turma...</p>;
  if (curriculumError) return <p role="alert" className="p-8 text-sm text-red-400">{curriculumError}</p>;
  return (
    <div className="apostilas-page p-6 sm:p-10 space-y-8 max-w-7xl mx-auto w-full">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-uniao-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            <span>Acervo da Turma • Materiais Liberados</span>
          </span>
          <h1 className={`text-2xl sm:text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Apostilas Didáticas & Ilustrações
          </h1>
          <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Material didático oficial da União Serviços Médicos com figuras certificadas, algoritmos e casos clínicos.
          </p>
        </div>

        {/* Busca */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por código (ex: C05, T03) ou tema..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-xs focus:outline-none focus:border-uniao-500 ${
              theme === 'dark'
                ? 'bg-slate-900 border-white/10 text-white placeholder-slate-500'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-xs'
            }`}
          />
        </div>
      </div>

      {/* Filtro de Bibliotecas */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedLibraryId('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            selectedLibraryId === 'all'
              ? 'bg-uniao-600 text-white shadow-md'
              : theme === 'dark'
              ? 'bg-slate-900 text-slate-400 hover:text-white border border-white/10'
              : 'bg-white text-slate-600 hover:text-slate-950 border border-slate-200'
          }`}
        >
          Todas as Apostilas ({allowedModuleIds.length})
        </button>
        {INITIAL_LIBRARIES.map(lib => (
          <button
            key={lib.id}
            onClick={() => setSelectedLibraryId(lib.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedLibraryId === lib.id
                ? 'bg-uniao-600 text-white shadow-md'
                : theme === 'dark'
                ? 'bg-slate-900 text-slate-400 hover:text-white border border-white/10'
                : 'bg-white text-slate-600 hover:text-slate-950 border border-slate-200'
            }`}
          >
            {lib.name} ({INITIAL_40_MODULES.filter(m => m.libraryId === lib.id && allowedModuleIds.includes(m.code)).length})
          </button>
        ))}
      </div>

      {/* Grid das 40 Apostilas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map(mod => {
          const lib = INITIAL_LIBRARIES.find(l => l.id === mod.libraryId);
          const isStudied = studiedCodes.includes(mod.code);

          return (
            <div
              key={mod.id}
              className={`rounded-3xl p-6 flex flex-col justify-between space-y-4 border transition-all shadow-lg hover:border-uniao-500/50 ${
                theme === 'dark'
                  ? 'bg-slate-900 border-white/10'
                  : 'bg-white border-slate-200/90 shadow-slate-200/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-uniao-500/10 text-uniao-500 flex items-center justify-center border border-uniao-500/30 font-black text-xs">
                      {mod.code}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-300 border border-teal-500/20">
                      {lib?.name}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleStudied(mod.code)}
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                      isStudied
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                        : theme === 'dark'
                        ? 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isStudied ? 'Conferido' : 'Disponível'}</span>
                  </button>
                </div>

                <h3 className={`text-base font-bold leading-snug ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Apostila {mod.code} — {mod.title}
                </h3>
                <p className={`text-xs mt-2 line-clamp-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {mod.description}
                </p>

                <div className="text-[11px] text-slate-500 mt-3 flex items-center gap-2 font-medium">
                  <span>{mod.subtopics.length} subtemas oficiais</span>
                  <span>•</span>
                  <span>Ilustrada (Wikimedia Commons)</span>
                </div>
              </div>

              <div className={`pt-4 border-t flex items-center justify-between gap-2 ${
                theme === 'dark' ? 'border-white/10' : 'border-slate-100'
              }`}>
                <button
                  onClick={() => handleOpenBooklet(mod)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-uniao-400 hover:bg-uniao-300 transition-all shadow"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ler Apostila Completa</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Leitura Completa da Apostila */}
      {activeModule && (
        <div className="apostila-leitor fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-0">
          <div
            className={`w-full h-screen rounded-none border-0 shadow-2xl flex flex-col overflow-hidden ${
              theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Header do Leitor */}
            <div
              className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${
                theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-uniao-500/20 text-uniao-400 border border-uniao-500/30 flex items-center justify-center font-black text-xs shrink-0">
                  {activeModule.code}
                </div>
                <div className="truncate">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-uniao-500 block">
                    Leitor Oficial de Apostilas • União Serviços Médicos
                  </span>
                  <h2 className="text-sm sm:text-base font-bold truncate">
                    {activeModule.code} — {activeModule.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <TextHighlightToolbar />
                <button
                  onClick={() => setActiveModule(null)}
                  className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                  title="Fechar Leitor (ESC)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Corpo da Apostila */}
            <div className="styled-scrollbar flex-1 overflow-y-auto p-6 sm:p-12">
              <div className="max-w-3xl mx-auto">
                {loadingMd ? (
                  <div className="py-24 text-center space-y-3">
                    <BookOpen className="w-10 h-10 text-uniao-400 animate-pulse mx-auto" />
                    <p className="text-sm text-slate-400">Carregando apostila completa e ilustrações...</p>
                  </div>
                ) : (
                  <BookletRenderer markdown={markdownContent} />
                )}
              </div>
            </div>

            <div className={`px-6 py-2 border-t text-[11px] shrink-0 ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
              União Serviços Médicos • Leitura exclusiva dentro da plataforma
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

