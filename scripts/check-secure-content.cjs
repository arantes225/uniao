'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const publicMarkdown = path.join(root, 'public', 'apostilas', 'md');
if (fs.existsSync(publicMarkdown)) {
  const leaked = fs.readdirSync(publicMarkdown).filter(name => name.toLowerCase().endsWith('.md'));
  assert.equal(leaked.length, 0,
    'Apostilas privadas não podem estar em public/apostilas/md: ' + leaked.join(', '));
}
for (const file of ['src/pages/student/MaterialsPage.tsx', 'src/pages/student/IntegratedLessonPage.tsx']) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  assert(source.includes('getSecureBooklet'), file + ' precisa consultar o Supabase protegido');
  assert(!source.includes('fetch(`./apostilas/md/'), file + ' contém leitura estática insegura');
}
const presence = fs.readFileSync(path.join(root, 'src/pages/student/PresencePage.tsx'), 'utf8');
const admin = fs.readFileSync(path.join(root, 'src/pages/admin/AdminDashboard.tsx'), 'utf8');
assert(presence.includes('redeem_presence_code'), 'A frequência deve ser gravada no servidor');
assert(admin.includes('create_presence_session'), 'Código de presença precisa ser gerado pelo servidor');
assert(!presence.includes('usm_student_presence_validated'), 'A presença não pode depender de localStorage');
assert(!admin.includes('usm_presence_code_aph'), 'PIN de presença local é proibido');
console.log('Security guard: nenhum Markdown privado distribuído, presença delegada ao servidor.');
