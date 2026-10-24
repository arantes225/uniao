import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft, CheckCircle2, ChevronRight, FileText, Folder, FolderOpen,
  Loader2, Pause, Play, Save, Type, Gauge, AlertCircle
} from 'lucide-react';
import { ContentLibrary, LearningModule, Subtopic } from '../../data/curriculumData';
import { CurriculumService } from '../../services/CurriculumService';
import { supabase } from '../../services/supabase/client';

type ViewMode = 'browser' | 'editor' | 'player';
type SaveState = 'idle' | 'saving' | 'saved' | 'error';

interface PromptRecord {
  item_key: string;
  body: string;
}

const modulePromptKey = (moduleId: string) => 'module:' + moduleId;
const topicPromptKey = (moduleId: string, subtopic: Subtopic) =>
  'topic:' + moduleId + ':' + (subtopic.id || moduleId + '-T' + subtopic.position);

/**
 * Roteiros do instrutor ficam em admin_prompters, separados das apostilas.
 * As pastas vêm do currículo vivo, inclusive alterações feitas no admin.
 */
export const PrompterTab: React.FC = () => {
  const [libraries, setLibraries] = useState<ContentLibrary[]>([]);
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [prompts, setPrompts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [libraryId, setLibraryId] = useState<string | null>(null);
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>('browser');
  const [selectedKey, setSelectedKey] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [draft, setDraft] = useState('');
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [saveError, setSaveError] = useState('');

  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(55);
  const [fontSize, setFontSize] = useState(46);
  const playerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [libs, mods, response] = await Promise.all([
          CurriculumService.getLibraries(),
          CurriculumService.getModules(),
          supabase.from('admin_prompters').select('item_key,body')
        ]);

        if (cancelled) return;
        setLibraries(libs);
        setModules(mods);

        if (response.error) {
          setLoadError('Não foi possível carregar os roteiros salvos. Confira seu acesso de equipe ao Supabase.');
        } else {
          const loaded: Record<string, string> = {};
          ((response.data || []) as PromptRecord[]).forEach(row => { loaded[row.item_key] = row.body; });
          setPrompts(loaded);
        }
      } catch {
        if (!cancelled) setLoadError('Falha ao carregar o catálogo e os roteiros. Reabra esta aba para tentar novamente.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => { cancelled = true; };
  }, []);

  const activeLibrary = libraries.find(lib => lib.id === libraryId);
  const activeModule = modules.find(mod => mod.id === moduleId);
  const libraryModules = modules
    .filter(mod => mod.libraryId === libraryId)
    .sort((a, b) => a.code.localeCompare(b.code, 'pt-BR'));
  const selectedSavedText = prompts[selectedKey] || '';
  const isDirty = draft !== selectedSavedText;

  const confirmDiscard = () => !isDirty || window.confirm('Há alterações não salvas neste roteiro. Deseja descartá-las?');

  const returnToBrowser = () => {
    if (!confirmDiscard()) return;
    setView('browser');
    setSaveState('idle');
    setSaveError('');
  };

  const chooseLibrary = (id: string | null) => {
    setLibraryId(id);
    setModuleId(null);
  };

  const chooseModule = (id: string | null) => { setModuleId(id); };

  const openEditor = (key: string, title: string) => {
    setSelectedKey(key);
    setSelectedTitle(title);
    setDraft(prompts[key] || '');
    setSaveState('idle');
    setSaveError('');
    setView('editor');
  };

  const savePrompt = async () => {
    if (!selectedKey || saveState === 'saving') return;
    setSaveState('saving');
    setSaveError('');

    const { error } = await supabase.from('admin_prompters').upsert(
      { item_key: selectedKey, body: draft, updated_at: new Date().toISOString() },
      { onConflict: 'item_key' }
    );

    if (error) {
      setSaveState('error');
      setSaveError('Não foi possível salvar no Supabase. Confirme que você está autenticado como integrante da equipe.');
      return;
    }

    setPrompts(previous => ({ ...previous, [selectedKey]: draft }));
    setSaveState('saved');
  };

  const startPrompter = () => {
    if (!draft.trim()) return;
    setPaused(false);
    setView('player');
  };

  useEffect(() => {
    if (view !== 'player') return;
    if (playerRef.current) playerRef.current.scrollTop = 0;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = originalOverflow; };
  }, [view, selectedKey]);

  useEffect(() => {
    if (view !== 'player' || paused) return;

    let animationId = 0;
    let previousTime = 0;
    const frame = (time: number) => {
      const element = playerRef.current;
      if (element && previousTime) {
        const maxScroll = element.scrollHeight - element.clientHeight;
        element.scrollTop = Math.min(maxScroll, element.scrollTop + (time - previousTime) * speed / 1000);
        if (maxScroll > 0 && element.scrollTop >= maxScroll - 1) {
          setPaused(true);
          return;
        }
      }
      previousTime = time;
      animationId = window.requestAnimationFrame(frame);
    };
    animationId = window.requestAnimationFrame(frame);
    return () => window.cancelAnimationFrame(animationId);
  }, [view, paused, speed]);

  useEffect(() => {
    if (view !== 'player') return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        setPaused(current => !current);
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        returnToBrowser();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [view, isDirty]);

  const cardStyle = 'w-full p-4 text-left rounded-2xl bg-slate-950/70 border border-white/10 hover:border-uniao-500/60 hover:bg-uniao-500/10 transition-colors group';
  const savedCountForModule = (mod: LearningModule) =>
    (prompts[modulePromptKey(mod.id)]?.trim() ? 1 : 0) +
    (mod.subtopics || []).filter(topic => !!prompts[topicPromptKey(mod.id, topic)]?.trim()).length;

  if (view === 'player') {
    return (
      <div className="fixed inset-0 z-[110] bg-[#050608] text-white flex flex-col">
        <div
          ref={playerRef}
          className="flex-1 overflow-y-auto overscroll-contain scroll-smooth"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#334155 #050608', scrollBehavior: 'auto' }}
          aria-label="Texto do prompter"
        >
          <div
            className="mx-auto max-w-6xl px-7 sm:px-14 text-center whitespace-pre-wrap break-words font-medium tracking-wide"
            style={{ paddingTop: '42vh', paddingBottom: '54vh', fontSize: fontSize + 'px', lineHeight: 1.55 }}
          >
            {draft}
          </div>
        </div>

        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#050608] to-transparent pointer-events-none" />
        <div className="bg-slate-950/95 border-t border-white/15 px-4 py-3 sm:px-6 shrink-0">
          <div className="max-w-7xl mx-auto flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={returnToBrowser}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-white/10 hover:bg-white/15 font-semibold text-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar aos prompters
              </button>
              <span className="text-xs sm:text-sm text-slate-400 truncate max-w-[55vw]">{selectedTitle}</span>
              <button
                type="button"
                onClick={() => setView('editor')}
                className="text-xs text-uniao-400 hover:text-white"
              >Editar roteiro</button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <button
                type="button"
                onClick={() => setPaused(current => !current)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-uniao-600 hover:bg-uniao-500 rounded-xl font-bold min-w-32"
              >
                {paused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                {paused ? 'Continuar' : 'Pausar'}
              </button>

              <label className="flex-1 flex items-center gap-3 text-xs font-semibold text-slate-300">
                <Gauge className="w-4 h-4 text-uniao-400 shrink-0" />
                <span className="whitespace-nowrap">Velocidade</span>
                <input
                  type="range" min="10" max="220" step="5"
                  value={speed} onChange={event => setSpeed(Number(event.target.value))}
                  className="w-full accent-emerald-500"
                  aria-label="Velocidade da rolagem"
                />
                <span className="w-14 text-right tabular-nums">{speed} px/s</span>
              </label>

              <label className="flex-1 flex items-center gap-3 text-xs font-semibold text-slate-300">
                <Type className="w-4 h-4 text-uniao-400 shrink-0" />
                <span className="whitespace-nowrap">Fonte</span>
                <input
                  type="range" min="26" max="88" step="2"
                  value={fontSize} onChange={event => setFontSize(Number(event.target.value))}
                  className="w-full accent-emerald-500"
                  aria-label="Tamanho da fonte"
                />
                <span className="w-12 text-right tabular-nums">{fontSize} px</span>
              </label>
            </div>
            <p className="hidden sm:block text-center text-[11px] text-slate-500">Espaço: pausar/continuar • Esc: voltar • A rolagem também pode ser ajustada manualmente.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <header className="rounded-3xl bg-slate-900 border border-white/10 p-6 sm:p-8 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-uniao-500/15 text-uniao-400 rounded-2xl border border-uniao-500/25">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Prompter</h2>
            <p className="text-sm text-slate-400 mt-1">
              Roteiros das aulas organizados por biblioteca, módulo e subtema. Cole o texto, salve e apresente com rolagem automática.
            </p>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="p-8 text-slate-400 flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin" /> Carregando conteúdos...
        </div>
      ) : (
        <>
          {loadError && (
            <div role="alert" className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-sm text-amber-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {loadError}
            </div>
          )}

          {view === 'editor' ? (
            <div className="space-y-5">
              <button
                type="button"
                onClick={returnToBrowser}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar às pastas
              </button>
              <div className="bg-slate-900 border border-white/10 rounded-3xl p-5 sm:p-7 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-uniao-400 uppercase tracking-wider font-bold">Editor de roteiro</div>
                    <h3 className="text-xl font-bold text-white mt-1">{selectedTitle}</h3>
                    {activeModule && <p className="text-xs text-slate-500 mt-1">{activeModule.code} · {activeModule.title}</p>}
                  </div>
                  {saveState === 'saved' && !isDirty && (
                    <span className="text-emerald-400 text-xs flex items-center gap-1 shrink-0"><CheckCircle2 className="w-4 h-4" /> Salvo</span>
                  )}
                </div>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-300">Texto do prompter</span>
                  <textarea
                    value={draft}
                    onChange={event => { setDraft(event.target.value); setSaveState('idle'); setSaveError(''); }}
                    rows={16}
                    spellCheck
                    placeholder="Cole aqui o roteiro da aula. Use linhas em branco para separar os parágrafos..."
                    className="w-full resize-y min-h-72 p-5 rounded-2xl bg-slate-950 border border-white/15 focus:outline-none focus:border-uniao-500 text-white text-base leading-relaxed placeholder:text-slate-600"
                  />
                </label>

                {saveError && (
                  <div role="alert" className="rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 p-3 text-sm">
                    {saveError}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => void savePrompt()}
                    disabled={saveState === 'saving'}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-uniao-600 hover:bg-uniao-500 disabled:opacity-50 text-white text-sm font-bold"
                  >
                    {saveState === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saveState === 'saving' ? 'Salvando...' : 'Salvar roteiro'}
                  </button>
                  <button
                    type="button"
                    onClick={startPrompter}
                    disabled={!draft.trim()}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold"
                  >
                    <Play className="w-4 h-4 fill-current" /> Iniciar prompter
                  </button>
                  <span className="text-xs text-slate-500 ml-auto">{draft.length.toLocaleString('pt-BR')} caracteres</span>
                </div>
                {isDirty && <p className="text-xs text-amber-300">Existem alterações ainda não salvas.</p>}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-5 sm:p-7 space-y-6">
              <div className="flex flex-wrap items-center gap-1.5 text-sm">
                <button
                  type="button"
                  onClick={() => chooseLibrary(null)}
                  className={libraryId ? 'text-slate-400 hover:text-white font-semibold' : 'text-white font-bold'}
                >Bibliotecas</button>
                {activeLibrary && (
                  <>
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                    <button
                      type="button"
                      onClick={() => chooseModule(null)}
                      className={moduleId ? 'text-slate-400 hover:text-white font-semibold' : 'text-white font-bold'}
                    >{activeLibrary.name}</button>
                  </>
                )}
                {activeModule && (
                  <>
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                    <span className="text-white font-semibold">{activeModule.code} · {activeModule.title}</span>
                  </>
                )}
              </div>

              {!libraryId && (
                <>
                  <div>
                    <h3 className="font-bold text-white text-lg">Pastas de conteúdos</h3>
                    <p className="text-sm text-slate-400">Selecione uma biblioteca para acessar os temas e subtemas.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {libraries.map(lib => (
                      <button type="button" key={lib.id} onClick={() => chooseLibrary(lib.id)} className={cardStyle}>
                        <div className="flex items-start gap-3">
                          <Folder className="h-6 w-6 shrink-0 text-uniao-400 group-hover:text-emerald-300" />
                          <div>
                            <h4 className="font-bold text-white">{lib.name}</h4>
                            <p className="text-xs text-slate-400 mt-1">{modules.filter(mod => mod.libraryId === lib.id).length} módulos</p>
                            <p className="text-xs text-slate-500 mt-2 line-clamp-2">{lib.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {libraryId && !moduleId && (
                <>
                  <div className="flex items-center gap-3">
                    <FolderOpen className="w-5 h-5 text-uniao-400" />
                    <h3 className="font-bold text-white text-lg">Temas de {activeLibrary?.name}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {libraryModules.map(mod => (
                      <button type="button" key={mod.id} onClick={() => chooseModule(mod.id)} className={cardStyle}>
                        <div className="flex items-start gap-3">
                          <Folder className="h-6 w-6 shrink-0 text-uniao-400 group-hover:text-emerald-300" />
                          <div className="min-w-0">
                            <p className="text-xs font-mono text-uniao-400 font-bold">{mod.code}</p>
                            <h4 className="font-bold text-white mt-1">{mod.title}</h4>
                            <p className="text-xs text-slate-400 mt-2">
                              {mod.subtopics?.length || 0} subtemas · {savedCountForModule(mod)} roteiros preenchidos
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  {!libraryModules.length && <p className="text-sm text-slate-500">Nenhum módulo nesta biblioteca.</p>}
                </>
              )}

              {activeModule && (
                <>
                  <div>
                    <h3 className="text-lg font-bold text-white">{activeModule.code} · {activeModule.title}</h3>
                    <p className="text-sm text-slate-400 mt-1">Abra um roteiro geral ou escolha a pasta de um subtema.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => openEditor(modulePromptKey(activeModule.id), 'Roteiro completo — ' + activeModule.title)}
                      className={cardStyle}
                    >
                      <div className="flex items-start gap-3">
                        <FileText className="h-6 w-6 shrink-0 text-uniao-400" />
                        <div>
                          <h4 className="font-bold text-white">Roteiro completo do módulo</h4>
                          <p className="text-xs text-slate-400 mt-2">
                            {prompts[modulePromptKey(activeModule.id)]?.trim() ? 'Roteiro salvo' : 'Ainda sem roteiro'}
                          </p>
                        </div>
                      </div>
                    </button>
                    {(activeModule.subtopics || [])
                      .slice()
                      .sort((a, b) => a.position - b.position)
                      .map(subtopic => {
                        const key = topicPromptKey(activeModule.id, subtopic);
                        return (
                          <button
                            type="button"
                            key={key}
                            onClick={() => openEditor(key, subtopic.title)}
                            className={cardStyle}
                          >
                            <div className="flex items-start gap-3">
                              <Folder className="h-6 w-6 shrink-0 text-uniao-400 group-hover:text-emerald-300" />
                              <div>
                                <p className="text-xs font-mono font-bold text-uniao-400">Subtema {subtopic.position}</p>
                                <h4 className="font-bold text-white mt-1">{subtopic.title}</h4>
                                <p className="text-xs text-slate-400 mt-2">
                                  {prompts[key]?.trim() ? 'Roteiro salvo' : 'Clique para colar o roteiro'}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
};
