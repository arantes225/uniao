import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Highlighter, Eraser } from 'lucide-react';

interface BookletRendererProps {
  markdown: string;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-');

export const TextHighlightToolbar: React.FC = () => {
  const applyHighlight = (color: string) => {
    document.execCommand('backColor', false, color);
    window.getSelection()?.removeAllRanges();
  };

  const keepSelection = (event: React.MouseEvent) => event.preventDefault();

  return (
    <div className="flex items-center gap-1.5 rounded-xl border border-teal-500/20 bg-teal-500/5 px-2 py-1.5 text-[10px]" aria-label="Marcador de texto">
      <Highlighter className="h-3.5 w-3.5 text-teal-500" aria-hidden="true" />
      <span className="mr-1 font-bold text-slate-500">Marcar</span>
      {[
        ['#fde047', 'Amarelo'],
        ['#f9a8d4', 'Rosa'],
        ['#93c5fd', 'Azul'],
      ].map(([color, label]) => (
        <button
          key={color}
          type="button"
          title={`Marcar em ${label}`}
          aria-label={`Marcar em ${label}`}
          onMouseDown={keepSelection}
          onClick={() => applyHighlight(color)}
          className="h-5 w-5 rounded-full border border-slate-400/50 shadow-sm transition-transform hover:scale-110"
          style={{ backgroundColor: color }}
        />
      ))}
      <button
        type="button"
        title="Remover marcação da seleção"
        aria-label="Remover marcação da seleção"
        onMouseDown={keepSelection}
        onClick={() => applyHighlight('transparent')}
        className="ml-1 rounded-md p-1 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
      >
        <Eraser className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

// Performance Optimization: Pre-compile regular expressions outside render loop
const INLINE_REGEX = /(\[[^\]]+\]\([^\)]+\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
const HR_REGEX = /^---+\s*$/;
const UNORDERED_LIST_REGEX = /^\s*[-*]\s+/;
const ORDERED_LIST_REGEX = /^\s*\d+\.\s+/;
const IMG_REGEX = /^!\[([^\]]*)\]\(([^)]+)\)/;
const CALLOUT_HEADER_REGEX = /^\[!(TIP|NOTE|IMPORTANT|WARNING|CAUTION)\]/i;

const CALLOUT_STYLES = {
  TIP: { title: 'Dica prática', icon: '✓', box: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/35', titleClass: 'text-emerald-800 dark:text-emerald-300' },
  NOTE: { title: 'Entenda', icon: 'i', box: 'border-sky-500 bg-sky-50 dark:bg-sky-950/35', titleClass: 'text-sky-800 dark:text-sky-300' },
  IMPORTANT: { title: 'Prioridade', icon: '!', box: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/35', titleClass: 'text-indigo-800 dark:text-indigo-300' },
  WARNING: { title: 'Atenção', icon: '!', box: 'border-amber-500 bg-amber-50 dark:bg-amber-950/35', titleClass: 'text-amber-900 dark:text-amber-300' },
  CAUTION: { title: 'Não faça isso', icon: '×', box: 'border-rose-500 bg-rose-50 dark:bg-rose-950/35', titleClass: 'text-rose-800 dark:text-rose-300' },
} as const;


const renderInline = (text: string): React.ReactNode[] => {
  if (!text) return [];
  const parts = text.split(INLINE_REGEX);
  return parts.map((part, idx) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [label, href] = [link[1], link[2]];
      const target = href.startsWith('#') ? `#${slugify(decodeURIComponent(href.slice(1)))}` : href;
      return (
        <a
          key={idx}
          href={target}
          className="font-semibold text-teal-700 underline decoration-teal-400/60 underline-offset-2 hover:text-teal-500 dark:text-teal-300 dark:hover:text-teal-200"
        >
          {label}
        </a>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-bold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={idx} className="italic">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={idx} className="px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300 font-mono text-xs">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
};

interface ZoomableBookletImageProps {
  src: string;
  alt: string;
  caption: string;
}

const ZoomableBookletImage: React.FC<ZoomableBookletImageProps> = ({ src, alt, caption }) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [expanded]);

  return (
    <>
      <figure className="my-9 sm:my-12 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 sm:p-7 dark:border-slate-700/70 dark:bg-slate-950/50 flex flex-col items-center text-center">
        <button
          type="button"
          aria-label={`Ampliar imagem: ${alt || 'ilustração da apostila'}`}
          title="Clique para ampliar a imagem"
          className="max-w-full cursor-zoom-in rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-500"
          onClick={() => setExpanded(true)}
        >
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="max-h-[34rem] max-w-full w-auto h-auto rounded-xl object-contain bg-white p-2.5 dark:bg-slate-100"
          />
        </button>
        {caption && (
          <figcaption className="mt-5 text-[13px] sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-[1.75] italic">
            {renderInline(caption)}
          </figcaption>
        )}
        <span className="mt-3 text-xs text-teal-700 dark:text-teal-300">Toque ou clique para ampliar</span>
      </figure>
      {expanded && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Imagem ampliada: ${alt || 'ilustração'}`}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-3 bg-slate-950/95 p-3 sm:p-8"
        >
          <button
            type="button"
            aria-label="Fechar imagem ampliada"
            onClick={() => setExpanded(false)}
            className="self-end rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-900"
          >
            Fechar ✕
          </button>
          <div className="w-full flex-1 min-h-0 overflow-auto flex items-center justify-center">
            <img src={src} alt={alt} className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl bg-white" />
          </div>
          {caption && <p className="max-w-4xl text-center text-xs text-slate-200">{caption}</p>}
        </div>
      )}
    </>
  );
};

/**
 * Pure parser function that converts markdown text into React nodes.
 */
const parseMarkdown = (markdown: string): React.ReactNode[] => {
  if (!markdown) return [];
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const elements: React.ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (!line.trim()) {
      i++;
      continue;
    }

    // Horizontal Rule
    if (HR_REGEX.test(line.trim())) {
      elements.push(<hr key={`hr-${i}`} className="my-9 border-slate-200/90 dark:border-slate-800/90" />);
      i++;
      continue;
    }

    // Code block / ASCII diagram
    if (line.trim().startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <pre
          key={`pre-${i}`}
          className="my-8 rounded-2xl border border-slate-700 bg-slate-950 p-5 sm:p-7 text-slate-100 overflow-x-auto text-xs sm:text-sm font-mono leading-[1.85]"
        >
          {codeLines.join('\n')}
        </pre>
      );
      continue;
    }

    // Markdown Table
    if (line.trim().startsWith('|') && i + 1 < lines.length && lines[i + 1].includes('---')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      const parseRow = (row: string) =>
        row
          .trim()
          .replace(/^\||\|$/g, '')
          .split('|')
          .map(cell => cell.trim());

      const headers = parseRow(tableLines[0]);
      const rows = tableLines.slice(2).map(parseRow);

      elements.push(
        <div key={`tbl-${i}`} className="my-9 sm:my-11 overflow-x-auto rounded-2xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-900/70">
          <table className="w-full text-left border-collapse text-sm leading-[1.7]">
            <thead>
              <tr className="bg-teal-600/10 dark:bg-teal-950/70 border-b border-slate-200 dark:border-slate-700 text-teal-900 dark:text-teal-300">
                {headers.map((h, hIdx) => (
                  <th key={hIdx} className="px-4 py-4 sm:px-5 font-bold">
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {rows.map((r, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  {r.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-4 sm:px-5 text-slate-700 dark:text-slate-300 align-top">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Image ![alt](src)
    const imgMatch = line.trim().match(IMG_REGEX);
    if (imgMatch) {
      const alt = imgMatch[1];
      const src = imgMatch[2];
      let caption = '';
      if (i + 1 < lines.length && lines[i + 1].trim().startsWith('*') && lines[i + 1].trim().endsWith('*')) {
        caption = lines[i + 1].trim().slice(1, -1);
        i++;
      }
      elements.push(<ZoomableBookletImage key={`img-${i}`} src={src} alt={alt} caption={caption} />);
      i++;
      continue;
    }

    // Blockquote / callout: semantic distinction between teaching, priority and safety
    if (line.trim().startsWith('>')) {
      const quoteLines: string[] = [];
      let calloutType: keyof typeof CALLOUT_STYLES | null = null;
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        const clean = lines[i].trim().replace(/^>\s?/, '');
        const match = clean.match(CALLOUT_HEADER_REGEX);
        if (match) {
          calloutType = match[1].toUpperCase() as keyof typeof CALLOUT_STYLES;
        } else if (clean.trim()) {
          quoteLines.push(clean);
        }
        i++;
      }
      const style = calloutType ? CALLOUT_STYLES[calloutType] : null;
      elements.push(
        <aside
          key={`quote-${i}`}
          role={calloutType === 'WARNING' || calloutType === 'CAUTION' ? 'note' : undefined}
          className={`my-9 rounded-2xl border border-l-[3px] p-5 sm:p-7 ${style ? style.box : 'border-teal-400/50 bg-slate-50 dark:bg-slate-900/70'} text-slate-800 dark:text-slate-200`}
        >
          {style && (
            <div className={`mb-3 flex items-center gap-2 text-sm font-extrabold ${style.titleClass}`}>
              <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-full border border-current text-xs">{style.icon}</span>
              <span>{style.title}</span>
            </div>
          )}
          <div className="space-y-3 text-[15px] leading-[1.85]">
            {quoteLines.map((ql, qIdx) => (
              <p key={qIdx}>{renderInline(ql)}</p>
            ))}
          </div>
        </aside>
      );
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      elements.push(
        <h1 id={slugify(line.slice(2))} key={`h1-${i}`} className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 mb-5 tracking-tight leading-tight">
          {renderInline(line.slice(2))}
        </h1>
      );
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2
          id={slugify(line.slice(3))}
          key={`h2-${i}`}
          className="text-xl sm:text-2xl font-extrabold leading-snug text-slate-900 dark:text-white mt-12 mb-5 pb-4 border-b border-slate-200 dark:border-slate-700"
        >
          {renderInline(line.slice(3))}
        </h2>
      );
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h3 id={slugify(line.slice(4))} key={`h3-${i}`} className="scroll-mt-24 mt-12 mb-5 border-l-[3px] border-teal-500/70 pl-4 text-lg sm:text-xl font-bold leading-snug text-slate-900 dark:text-slate-100">
          {renderInline(line.slice(4))}
        </h3>
      );
      i++;
      continue;
    }
    if (line.startsWith('#### ')) {
      elements.push(
        <h4 id={slugify(line.slice(5))} key={`h4-${i}`} className="scroll-mt-24 mt-8 mb-4 text-base sm:text-lg font-bold leading-snug text-slate-800 dark:text-slate-200">
          {renderInline(line.slice(5))}
        </h4>
      );
      i++;
      continue;
    }

    // Unordered List
    if (UNORDERED_LIST_REGEX.test(line)) {
      const items: string[] = [];
      while (i < lines.length && UNORDERED_LIST_REGEX.test(lines[i])) {
        items.push(lines[i].replace(UNORDERED_LIST_REGEX, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-6 pl-6 list-disc space-y-3 text-[15px] sm:text-base text-slate-700 dark:text-slate-300">
          {items.map((it, idx) => (
            <li key={idx} className="leading-[1.85] pl-1">
              {renderInline(it)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered List
    if (ORDERED_LIST_REGEX.test(line)) {
      const items: string[] = [];
      while (i < lines.length && ORDERED_LIST_REGEX.test(lines[i])) {
        items.push(lines[i].replace(ORDERED_LIST_REGEX, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="my-6 pl-6 list-decimal space-y-3 text-[15px] sm:text-base text-slate-700 dark:text-slate-300">
          {items.map((it, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(it)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Regular Paragraph
    elements.push(
      <p key={`p-${i}`} className="my-5 text-[15px] sm:text-base leading-[1.9] text-slate-700 dark:text-slate-300">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return elements;
};

/**
 * The editorial Markdown files have the same "##" chapter structure.
 * Split only at top-level chapter headings (outside code fences) so all
 * 40 modules inherit a calm layout without changing any medical text.
 */
interface BookletSection {
  heading: string | null;
  markdown: string;
  kind: 'cover' | 'index' | 'guide' | 'chapter' | 'extra';
  chapterNumber?: string;
}

const splitBookletSections = (markdown: string): BookletSection[] => {
  if (!markdown.trim()) return [];
  const groups: Array<{ heading: string | null; lines: string[] }> = [{ heading: null, lines: [] }];
  let fenced = false;

  for (const line of markdown.replace(/\r\n/g, '\n').split('\n')) {
    if (line.trim().startsWith('```')) fenced = !fenced;
    const heading = !fenced && line.match(/^## (.+)$/);

    // The editorial masthead belongs to the cover, not to an empty chapter card.
    if (heading && !/^DIRETORIA DE /i.test(heading[1])) {
      groups.push({ heading: heading[1].trim(), lines: [] });
    } else {
      groups[groups.length - 1].lines.push(line);
    }
  }

  return groups.filter(group => group.heading || group.lines.some(line => line.trim())).map(group => {
    if (!group.heading) return { heading: null, markdown: group.lines.join('\n'), kind: 'cover' as const };

    const chapter = group.heading.match(/^(?:SEÇÃO\s+)?(\d{1,2})(?:\s|\.|—|-)/i);
    const kind: BookletSection['kind'] = /^SUMÁRIO\b/i.test(group.heading)
      ? 'index'
      : /^GUIA DE ATUAÇÃO/i.test(group.heading)
        ? 'guide'
        : chapter
          ? 'chapter'
          : 'extra';

    return {
      heading: group.heading,
      markdown: group.lines.join('\n'),
      kind,
      chapterNumber: chapter?.[1],
    };
  });
};


interface BookletSubtopic {
  heading: string | null;
  markdown: string;
}

/** Split only direct Markdown h3 headings, never lines inside code fences. */
const splitBookletSubtopics = (markdown: string): BookletSubtopic[] => {
  const groups: Array<{ heading: string | null; lines: string[] }> = [{ heading: null, lines: [] }];
  let fenced = false;
  for (const line of markdown.replace(/\r\n/g, '\n').split('\n')) {
    if (line.trim().startsWith(String.fromCharCode(96).repeat(3))) fenced = !fenced;
    const match = !fenced && line.match(/^### (.+)$/);
    if (match) groups.push({ heading: match[1], lines: [] });
    else groups[groups.length - 1].lines.push(line);
  }
  return groups.filter(group => group.heading || group.lines.some(line => line.trim())).map(group => ({
    heading: group.heading,
    markdown: group.lines.join('\n'),
  }));
};

const chapterTitle = (heading: string) =>
  heading.replace(/^(?:SEÇÃO\s+)?\d{1,2}\s*(?:[.—-]\s*|\s+)/i, '').trim() || heading;

/** Separate long thematic chapters into legible, independently framed lessons. */
const BookletChapterBody: React.FC<{ markdown: string }> = ({ markdown }) => {
  const topics = useMemo(() => splitBookletSubtopics(markdown), [markdown]);
  const multipleTopics = topics.filter(topic => topic.heading).length >= 2;
  if (!multipleTopics) {
    return <div className="booklet-chapter-content min-w-0 px-6 py-7 sm:px-10 sm:py-10">{parseMarkdown(markdown)}</div>;
  }
  return (
    <div className="min-w-0 px-5 py-7 sm:px-9 sm:py-10">
      {topics.map((topic, index) =>
        topic.heading ? (
          <section
            key={index}
            aria-labelledby={slugify(topic.heading)}
            className="booklet-subtopic my-6 rounded-2xl border border-slate-200/80 bg-slate-50/65 px-5 py-6 dark:border-slate-700/70 dark:bg-slate-800/30 sm:my-8 sm:px-7 sm:py-8"
          >
            <h3
              id={slugify(topic.heading)}
              className="scroll-mt-28 mb-5 border-b border-slate-200/90 pb-4 text-lg font-bold leading-snug text-slate-900 dark:border-slate-700 dark:text-slate-100 sm:text-xl"
            >
              {renderInline(topic.heading)}
            </h3>
            <div className="booklet-chapter-content min-w-0">{parseMarkdown(topic.markdown)}</div>
          </section>
        ) : (
          <div key={index} className="booklet-chapter-content px-1 pb-3 sm:px-2">
            {parseMarkdown(topic.markdown)}
          </div>
        ),
      )}
    </div>
  );
};

/** Keep the cover quiet while retaining the full source's editorial metadata. */
const BookletCover: React.FC<{ markdown: string }> = ({ markdown }) => {
  const lines = markdown.split('\n');
  const institution = lines.find(line => line.startsWith('# '))?.slice(2) || 'UNIÃO SERVIÇOS MÉDICOS';
  const moduleLine = lines.find(line => /^\*\*M[ÓO]DULO\b/i.test(line) || /^\*\*M[óo]dulo:\*\*/i.test(line));
  const subtitle = lines.find(line => line.startsWith('## '))?.slice(3);
  const metadata = lines
    .filter(line => line.trim() && !/^#{1,2} /.test(line) && !/^---+\s*$/.test(line) && line !== moduleLine)
    .join('\n');

  return (
    <header className="overflow-hidden rounded-[28px] border border-teal-200/70 bg-gradient-to-br from-teal-50 via-white to-slate-50 px-6 py-8 dark:border-teal-900/60 dark:from-slate-900 dark:via-slate-900 dark:to-teal-950/40 sm:px-10 sm:py-10">
      <span className="mb-4 inline-block rounded-full bg-teal-600/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-teal-700 dark:text-teal-300">
        União • Biblioteca de primeiros socorros
      </span>
      <p className="text-xs font-semibold uppercase tracking-[0.11em] text-slate-500 dark:text-slate-400">{institution}</p>
      <h1 className="mt-4 max-w-3xl text-2xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-3xl">
        {moduleLine ? renderInline(moduleLine) : 'Apostila de formação'}
      </h1>
      {subtitle && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">{subtitle}</p>}
      {metadata.trim() && (
        <details className="group mt-6 border-t border-teal-200/60 pt-4 dark:border-teal-900/70">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-teal-700 dark:text-teal-300 [&::-webkit-details-marker]:hidden">
            <span>Ficha técnica, público-alvo e dados editoriais</span>
            <span aria-hidden="true" className="transition-transform group-open:rotate-180">⌄</span>
          </summary>
          <div className="booklet-cover-metadata mt-5 border-t border-teal-100 pt-4 dark:border-slate-700">
            {parseMarkdown(metadata)}
          </div>
        </details>
      )}
    </header>
  );
};

/** Shared, chapter-based reading design for the Materials and Lesson views. */
export const BookletRenderer: React.FC<BookletRendererProps> = React.memo(({ markdown }) => {
  const sections = useMemo(() => splitBookletSections(markdown), [markdown]);
  const chapterSections = useMemo(() => sections.filter(section => section.kind === 'chapter'), [sections]);
  const articleRef = useRef<HTMLElement>(null);
  const jumpTo = (heading?: string | null) => {
    if (!heading) return;
    articleRef.current?.querySelector<HTMLElement>('#' + slugify(heading))?.scrollIntoView({ behavior: 'auto', block: 'start' });
  };

  return (
    <article ref={articleRef} className="mx-auto w-full max-w-4xl space-y-7 pb-6 sm:space-y-10">
      {chapterSections.length > 0 && (
        <nav aria-label="Navegação rápida entre capítulos" className="sticky top-0 z-20 -mx-1 rounded-2xl border border-slate-200/90 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/95 sm:px-5">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-600 dark:text-slate-300">Navegar por capítulos</span>
            <button type="button" onClick={() => articleRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' })} className="text-xs font-semibold text-teal-700 hover:underline dark:text-teal-300">Voltar ao início</button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Selecionar capítulo">
            {chapterSections.map((chapter, index) => (
              <button
                key={'nav-' + index}
                type="button"
                onClick={() => jumpTo(chapter.heading)}
                title={chapter.heading ?? ''}
                className="inline-flex max-w-[15rem] shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-left text-xs font-medium text-slate-700 transition-colors hover:border-teal-300 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-teal-700 dark:hover:bg-teal-950/60"
              >
                <span className="font-extrabold text-teal-700 dark:text-teal-300">{(chapter.chapterNumber ?? String(index + 1)).padStart(2, '0')}</span>
                <span className="truncate">{chapterTitle(chapter.heading ?? '')}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
      {sections.map((section, index) => {
        const headingId = section.heading ? slugify(section.heading) : undefined;

        if (section.kind === 'cover') {
          return <BookletCover key={'cover-' + index} markdown={section.markdown} />;
        }

        if (section.kind === 'index') {
          return (
            <nav key={`index-${index}`} aria-label="Sumário da apostila">
              <details className="group rounded-2xl border border-slate-200 bg-white/90 px-6 py-5 dark:border-slate-700/80 dark:bg-slate-900/85 sm:px-8">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900 marker:hidden dark:text-slate-100 [&::-webkit-details-marker]:hidden">
                  <span className="flex flex-col gap-1">
                    <span className="text-base sm:text-lg">Sumário da apostila</span>
                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400">Toque para ver os capítulos e navegar rapidamente</span>
                  </span>
                  <span aria-hidden="true" className="text-teal-600 text-xl transition-transform group-open:rotate-180">⌄</span>
                </summary>
                <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-700">
                  {parseMarkdown(section.markdown)}
                </div>
              </details>
            </nav>
          );
        }

        if (section.kind === 'guide') {
          return (
            <section key={`guide-${index}`} aria-labelledby={headingId} className="overflow-hidden rounded-[28px] border border-teal-200/80 bg-white dark:border-teal-800/60 dark:bg-slate-900">
              <div className="border-b border-teal-100 bg-teal-50/80 px-6 py-6 dark:border-teal-900/60 dark:bg-teal-950/30 sm:px-9">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.15em] text-teal-700 dark:text-teal-300">Comece por aqui</span>
                <h2 id={headingId} className="scroll-mt-24 text-xl font-bold leading-snug text-slate-900 dark:text-white sm:text-2xl">{renderInline(section.heading ?? '')}</h2>
              </div>
              <div className="px-6 py-6 sm:px-9 sm:py-9">{parseMarkdown(section.markdown)}</div>
            </section>
          );
        }

        return (
          <section key={`chapter-${index}`} aria-labelledby={headingId} className="overflow-hidden rounded-[28px] border border-slate-200/90 bg-white shadow-[0_8px_32px_rgba(15,23,42,0.035)] dark:border-slate-700/70 dark:bg-slate-900">
            <div className="border-b border-slate-100 bg-slate-50/65 px-6 py-7 dark:border-slate-800 dark:bg-slate-800/40 sm:px-10 sm:py-9">
              <span className="mb-3 block text-[11px] font-bold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">
                {section.chapterNumber ? `Capítulo ${section.chapterNumber.padStart(2, '0')}` : 'Material complementar'}
              </span>
              <h2 id={headingId} className="scroll-mt-24 text-xl font-bold leading-snug tracking-tight text-slate-900 dark:text-white sm:text-[26px]">
                {renderInline(section.heading ?? '')}
              </h2>
            </div>
            <BookletChapterBody markdown={section.markdown} />
          </section>
        );
      })}
    </article>
  );
});
