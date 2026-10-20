import React, { useMemo } from 'react';

interface BookletRendererProps {
  markdown: string;
}

// Performance Optimization: Pre-compile regular expressions outside render loop
// to avoid re-creating RegExp objects on every inline text chunk and render pass.
const INLINE_REGEX = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
const HR_REGEX = /^---+\s*$/;
const UNORDERED_LIST_REGEX = /^\s*[-*]\s+/;
const ORDERED_LIST_REGEX = /^\s*\d+\.\s+/;
const IMG_REGEX = /^!\[([^\]]*)\]\(([^)]+)\)/;
const CALLOUT_HEADER_REGEX = /^\[!(TIP|NOTE|IMPORTANT|WARNING|CAUTION)\]/i;

const renderInline = (text: string): React.ReactNode[] => {
  if (!text) return [];
  // Handle bold (**text**), italic (*text*), and inline code (`code`)
  const parts = text.split(INLINE_REGEX);
  return parts.map((part, idx) => {
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
 * 1. Wrapped in React.memo to prevent unnecessary re-renders when parent state
 *    (e.g., active tabs, quiz answer selections, or form field edits) updates.
 * 2. Memoized AST line parsing using useMemo based on the `markdown` prop.
 * Expected Impact: Eliminates ~100% of redundant line-by-line parsing overhead
 * on non-markdown parent state changes, reducing main thread rendering time.
 */
export const BookletRenderer: React.FC<BookletRendererProps> = React.memo(({ markdown }) => {
  const elements = useMemo(() => parseMarkdown(markdown), [markdown]);

  return <div className="space-y-1">{elements}</div>;
});
