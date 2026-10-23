import React, { useMemo } from 'react';
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
    .replace(/\s+/g, '-');

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

/**
 * Pure parser function that converts markdown text into React nodes.
 */
/**
 * Espalha as figuras pelo desenvolvimento do tema, com a legenda e os créditos.
 * Os arquivos históricos mantêm o bloco "Figuras de Apoio" para rastreabilidade.
 * A apresentação ao aluno não deve concentrar ilustrações em uma única página.
 */
const prepareIllustratedMarkdown = (markdown: string): string => {
  if (!markdown.includes('### Figuras de Apoio')) return markdown;
  const lines = prepareIllustratedMarkdown(markdown).replace(/\r\n/g, '\n').split('\n');
  const beginning = lines.findIndex(line => line.trim() === '### Figuras de Apoio');
  const ending = lines.findIndex((line, idx) => idx > beginning && line.trim() === '---');
  if (beginning < 0 || ending < 0) return markdown;

  const repairCaption = (value: string): string => {
    const substitutions: Record<string, string> = {
      'Ã¡': 'á', 'Ã©': 'é', 'Ã­': 'í', 'Ã³': 'ó', 'Ãº': 'ú',
      'Ã¢': 'â', 'Ãª': 'ê', 'Ã´': 'ô', 'Ã£': 'ã', 'Ãµ': 'õ',
      'Ã§': 'ç', 'Ã€': 'À', 'Ã': 'Á', 'Ã‰': 'É', 'Ã“': 'Ó',
      'Ãš': 'Ú', 'Ã‡': 'Ç', 'Ãƒ': 'Ã', 'Ã•': 'Õ',
      'â€“': '–', 'â€”': '—', 'â€œ': '“', 'â€': '”', 'â€™': '’',
    };
    return value.replace(/Ã.|â€.|â€“|â€”/g, match => substitutions[match] ?? match);
  };

  const figures: { alt: string; source: string; caption: string }[] = [];
  for (let i = beginning + 1; i < ending; i++) {
    const image = lines[i].match(/^!\[([^\]]+)\]\(([^)]+)\)\s*$/);
    if (!image) continue;
    const caption = lines[i + 1]?.trim().startsWith('*') ? lines[i + 1].trim() : '';
    figures.push({ alt: repairCaption(image[1]), source: image[2], caption: repairCaption(caption) });
  }
  if (figures.length < 2) return markdown;

  // Remove apenas a galeria agrupada. Preserva a divisão e o restante do texto.
  const body = [...lines.slice(0, beginning), ...lines.slice(ending)];
  const first = body.findIndex(line => /^## SEÇÃO 3\b/i.test(line));
  const end = body.findIndex((line, index) => index > first && /^## SEÇÃO 8\b/i.test(line));
  const lower = first >= 0 ? first : Math.round(body.length * 0.16);
  const upper = end > lower ? end : Math.round(body.length * 0.8);
  if (upper - lower < figures.length * 8) return markdown;

  const normalized = (value: string): string => value.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ');
  const stopwords = new Set([
    'figura', 'credito', 'licenca', 'fonte', 'wikimedia', 'commons',
    'emergencia', 'emergencias', 'primeiros', 'atendimento', 'medico',
    'medica', 'com', 'para', 'das', 'dos', 'uma', 'quando', 'sobre',
    'procedimento', 'aplicacao', 'tecnica', 'tecnicas', 'durante',
    'apenas', 'como', 'mostra', 'esquema', 'demonstracao', 'treinamento'
  ]);
  const keywords = (value: string): Set<string> => new Set(
    normalized(value).split(/\s+/).filter(word => word.length >= 4 && !stopwords.has(word))
  );
  const candidates: { index: number; words: Set<string> }[] = [];
  let fenced = false;
  let heading = '';
  for (let i = lower + 1; i < upper; i++) {
    const line = body[i].trim();
    if (line.startsWith('```')) { fenced = !fenced; continue; }
    if (fenced) continue;
    if (/^#{2,4}\s/.test(line)) heading = line;
    const isParagraph = line.length > 65 &&
      !/^(#|>|\||\+|[-*]\s|\d+\.\s|```|---|│)/.test(line) &&
      (i === body.length - 1 || !body[i + 1].trim());
    if (isParagraph) candidates.push({ index: i, words: keywords(line + ' ' + heading) });
  }
  if (!candidates.length) return markdown;

  const assigned: { index: number; figure: typeof figures[number] }[] = [];
  for (let n = 0; n < figures.length; n++) {
    const figure = figures[n];
    const words = keywords(figure.alt);
    const desired = lower + ((n + 1) / (figures.length + 1)) * (upper - lower);
    let best = candidates[0];
    let bestScore = -Infinity;
    for (const candidate of candidates) {
      let overlap = 0;
      for (const word of words) if (candidate.words.has(word)) overlap++;
      const distancePenalty = 8 * Math.abs(candidate.index - desired) / (upper - lower);
      const crowdingPenalty = assigned.reduce((penalty, placed) => {
        const gap = Math.abs(candidate.index - placed.index);
        return penalty + (gap < 18 ? 40 : gap < 35 ? 12 : 0);
      }, 0);
      const score = Math.min(overlap, 4) * 7 - distancePenalty - crowdingPenalty;
      if (score > bestScore) { bestScore = score; best = candidate; }
    }
    assigned.push({ index: best.index, figure });
  }

  assigned.sort((a, b) => a.index - b.index);
  const placement = new Map<number, string[]>();
  assigned.forEach(({ index, figure }, i) => {
    const number = i + 1;
    const alt = figure.alt.replace(/^Figura\s+\d+\s*[-–—]\s*/i, 'Figura ' + number + ' — ');
    const caption = figure.caption.replace(/^(\*?)Figura\s+\d+\s*[-–—]\s*/i, '$1Figura ' + number + ' — ');
    const block = ['', '![' + alt + '](' + figure.source + ')', caption, ''];
    placement.set(index, [...(placement.get(index) ?? []), ...block]);
  });

  const output: string[] = [];
  body.forEach((line, index) => {
    output.push(line);
    const figureLines = placement.get(index);
    if (figureLines) output.push(...figureLines);
  });
  return output.join('\n');
};

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
      elements.push(<hr key={`hr-${i}`} className="my-6 border-slate-200 dark:border-slate-800" />);
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
          className="my-5 p-4 rounded-2xl bg-slate-950 text-teal-300 border border-teal-500/30 overflow-x-auto text-xs font-mono leading-relaxed shadow-inner"
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
        <div key={`tbl-${i}`} className="my-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-teal-600/10 dark:bg-teal-950/70 border-b border-slate-200 dark:border-slate-700 text-teal-900 dark:text-teal-300">
                {headers.map((h, hIdx) => (
                  <th key={hIdx} className="p-3 font-bold">
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {rows.map((r, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  {r.map((cell, cIdx) => (
                    <td key={cIdx} className="p-3 text-slate-700 dark:text-slate-300 align-top">
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
      elements.push(
        <figure
          key={`img-${i}`}
          className="my-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center shadow-md"
        >
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="max-h-96 w-auto rounded-xl object-contain border border-slate-200 dark:border-slate-800 bg-white p-2"
          />
          {caption && (
            <figcaption className="mt-3 text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed italic">
              {renderInline(caption)}
            </figcaption>
          )}
        </figure>
      );
      i++;
      continue;
    }

    // Blockquote / Callout
    if (line.trim().startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        const clean = lines[i].trim().replace(/^>\s?/, '');
        if (!CALLOUT_HEADER_REGEX.test(clean)) {
          quoteLines.push(clean);
        }
        i++;
      }
      elements.push(
        <div
          key={`quote-${i}`}
          className="my-5 p-5 rounded-2xl bg-teal-500/10 border-l-4 border-teal-500 text-slate-800 dark:text-slate-200 space-y-2 text-sm"
        >
          {quoteLines.map((ql, qIdx) => (
            <p key={qIdx} className="leading-relaxed">
              {renderInline(ql)}
            </p>
          ))}
        </div>
      );
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-2xl sm:text-3xl font-black text-teal-700 dark:text-teal-400 mt-6 mb-3 tracking-tight">
          {renderInline(line.slice(2))}
        </h1>
      );
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2
          key={`h2-${i}`}
          className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-8 mb-3 pb-2 border-b border-teal-500/30 flex items-center gap-2"
        >
          {renderInline(line.slice(3))}
        </h2>
      );
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-base sm:text-lg font-bold text-teal-700 dark:text-teal-300 mt-6 mb-2">
          {renderInline(line.slice(4))}
        </h3>
      );
      i++;
      continue;
    }
    if (line.startsWith('#### ')) {
      elements.push(
        <h4 key={`h4-${i}`} className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 mt-4 mb-1.5">
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
        <ul key={`ul-${i}`} className="my-3 pl-5 list-disc space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
          {items.map((it, idx) => (
            <li key={idx} className="leading-relaxed">
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
        <ol key={`ol-${i}`} className="my-3 pl-5 list-decimal space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
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
      <p key={`p-${i}`} className="my-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return elements;
};

/**
 * Bolt Performance Optimization:
 * 1. Wrapped in React.memo to prevent unnecessary re-renders when parent state updates.
 * 2. Memoized AST line parsing using useMemo based on the `markdown` prop.
 */
export const BookletRenderer: React.FC<BookletRendererProps> = React.memo(({ markdown }) => {
  const elements = useMemo(() => parseMarkdown(markdown), [markdown]);

  return <div className="space-y-1">{elements}</div>;
});
