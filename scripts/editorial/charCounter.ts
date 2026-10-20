import fs from 'fs';
import path from 'path';

export function countCharactersInMarkdown(content: string): { visibleChars: number; totalChars: number } {
  // Total raw characters
  const totalChars = content.length;

  // Visible text: remove frontmatter, code blocks markers, HTML tags, but preserve substantive text in tables, lists, boxes
  let text = content;

  // Remove YAML frontmatter if exists
  text = text.replace(/^---[\s\S]*?---\s*/, '');

  // Strip html tags but keep text inside
  text = text.replace(/<[^>]+>/g, ' ');

  // Strip markdown images syntax ![alt](url) -> keep alt
  text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1');

  // Strip markdown links syntax [label](url) -> keep label
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');

  // Normalize multi-spaces/newlines
  const normalized = text.replace(/\r\n/g, '\n');

  return {
    visibleChars: normalized.length,
    totalChars
  };
}

const targetFile = process.argv[2];
if (targetFile) {
  const filePath = path.resolve(targetFile);
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { visibleChars, totalChars } = countCharactersInMarkdown(raw);
    console.log(JSON.stringify({ file: targetFile, visibleChars, totalChars, valid: visibleChars >= 15000 && visibleChars <= 40000 }, null, 2));
  } else {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }
}
