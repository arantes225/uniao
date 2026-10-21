import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, CheckSquare } from 'lucide-react';
import { INITIAL_LIBRARIES, LearningModule } from '../../data/curriculumData';

export interface CurriculumLessonOption {
  id: string;
  module_id: string;
  title: string;
  position: number;
}

interface CohortCurriculumSelectorProps {
  modules: LearningModule[];
  lessons: CurriculumLessonOption[];
  selectedLessonIds: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
}

/** Reutiliza os módulos publicados no catálogo. A seleção é sempre por aula, sem duplicar conteúdos. */
export const CohortCurriculumSelector: React.FC<CohortCurriculumSelectorProps> = ({
  modules, lessons, selectedLessonIds, onChange, disabled = false,
}) => {
  const [expanded, setExpanded] = useState<string[]>([]);
  const groupedModules = useMemo(() =>
    INITIAL_LIBRARIES.map(library => ({
      library,
      modules: modules.filter(module => module.libraryId === library.id),
    })).filter(group => group.modules.length > 0), [modules]);
  const selectableIds = lessons.map(lesson => lesson.id);
  const selected = new Set(selectedLessonIds);
  const countModules = new Set(lessons.filter(l => selected.has(l.id)).map(l => l.module_id)).size;

  const toggleModule = (id: string) => {
    const ids = lessons.filter(l => l.module_id === id).map(l => l.id);
    const allSelected = ids.length > 0 && ids.every(l => selected.has(l));
    onChange(allSelected ? selectedLessonIds.filter(l => !ids.includes(l)) : [...new Set([...selectedLessonIds, ...ids])]);
  };

  return (
    <section className="space-y-3 rounded-2xl border border-teal-500/30 bg-slate-950/60 p-4" aria-label="Escolher módulos e aulas da turma">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2"><BookOpen className="w-4 h-4 text-teal-400" /> Módulos e aulas da turma</h4>
          <p className="text-[11px] text-slate-400 mt-1">
            {countModules} módulos e {selectedLessonIds.length} aulas selecionados. Cada aula integrada contém seus subtemas, apostila, vídeo e questões.
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" disabled={disabled || !selectableIds.length}
            onClick={() => onChange([...selectableIds])}
            className="rounded-lg bg-teal-500/15 px-3 py-2 text-[11px] font-semibold text-teal-300 hover:bg-teal-500/25 disabled:opacity-50">
            Selecionar todos
          </button>
          <button type="button" disabled={disabled} onClick={() => onChange([])}
            className="rounded-lg border border-white/10 px-3 py-2 text-[11px] font-semibold text-slate-300 hover:bg-white/5">
            Desmarcar todos
          </button>
        </div>
      </div>

      {groupedModules.length === 0 ? (
        <p className="text-xs text-amber-300">Não foi possível carregar o catálogo de módulos. Verifique a conexão antes de salvar.</p>
      ) : (
        <div className="max-h-80 overflow-y-auto space-y-3 pr-1 styled-scrollbar">
          {groupedModules.map(({ library, modules: entries }) => (
            <div key={library.id} className="rounded-xl border border-white/10 overflow-hidden">
              <div className="bg-slate-800/80 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-teal-300">
                {library.name} ({entries.length})
              </div>
              <div className="divide-y divide-white/5">
                {entries.map(module => {
                  const moduleLessons = lessons.filter(l => l.module_id === module.id);
                  const enabledCount = moduleLessons.filter(l => selected.has(l.id)).length;
                  const isExpanded = expanded.includes(module.id);
                  return (
                    <div key={module.id} className="bg-slate-900/50">
                      <div className="flex items-center gap-2 px-3 py-2">
                        <input type="checkbox" aria-label={`Selecionar módulo ${module.title}`}
                          disabled={disabled || moduleLessons.length === 0}
                          checked={moduleLessons.length > 0 && enabledCount === moduleLessons.length}
                          ref={el => { if (el) el.indeterminate = enabledCount > 0 && enabledCount < moduleLessons.length; }}
                          onChange={() => toggleModule(module.id)}
                          className="accent-teal-400 h-4 w-4 shrink-0" />
                        <span className="text-[11px] text-slate-400 shrink-0 font-mono">{module.code}</span>
                        <span className="flex-1 text-xs font-semibold text-slate-100">{module.title}</span>
                        <button type="button" aria-label={isExpanded ? 'Ocultar aulas' : 'Mostrar aulas'}
                          aria-expanded={isExpanded}
                          onClick={() => setExpanded(p => isExpanded ? p.filter(id => id !== module.id) : [...p, module.id])}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400">
                          {isExpanded ? <ChevronDown className="w-4 h-4"/> : <ChevronRight className="w-4 h-4"/>}
                        </button>
                      </div>
                      {isExpanded && <div className="pl-8 pr-3 pb-3 space-y-2">
                        {moduleLessons.length ? moduleLessons.map(lesson => (
                          <label key={lesson.id} className="flex gap-2 items-start cursor-pointer text-xs text-slate-300">
                            <input type="checkbox" checked={selected.has(lesson.id)} disabled={disabled}
                              onChange={() => onChange(selected.has(lesson.id) ? selectedLessonIds.filter(id => id !== lesson.id) : [...selectedLessonIds, lesson.id])}
                              className="accent-teal-400 mt-0.5" />
                            <span>{lesson.title}</span>
                          </label>
                        )) : <span className="text-xs text-amber-300">Nenhuma aula disponível neste módulo</span>}
                        {module.subtopics.length > 0 && (
                          <p className="text-[10px] text-slate-500">
                            Subtemas: {module.subtopics.map(topic => topic.title).join(' • ')}
                          </p>
                        )}
                      </div>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2 items-center text-xs text-slate-300 border-t border-white/10 pt-3">
        <CheckSquare className="w-4 h-4 text-teal-400" />
        <strong>Resumo:</strong> {countModules} módulos · {selectedLessonIds.length} aulas selecionadas
      </div>
      {selectedLessonIds.length === 0 && <p role="alert" className="text-xs text-amber-300">Selecione pelo menos uma aula para habilitar a turma.</p>}
    </section>
  );
};
