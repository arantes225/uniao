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

const studentCertificates = fs.readFileSync(path.join(root, 'src/pages/student/CertificatesPage.tsx'), 'utf8');
const certificateRenderer = fs.readFileSync(path.join(root, 'src/components/student/StudentCertificate.tsx'), 'utf8');
const certMigration = fs.readFileSync(path.join(root, 'supabase/migrations/20261026080000_harden_certificate_snapshots_attempts.sql'), 'utf8');
assert(admin.includes('supabase.auth.signOut()'), 'Bloquear painel precisa terminar a sessão no servidor');
assert(!admin.includes('ADMIN_PIN'), 'Não inserir PIN administrativo no frontend');
assert(admin.includes('confirm_practical_attendance'), 'Certificação exige conferência presencial por instrutor');
assert(studentCertificates.includes('student_name_snapshot'), 'Nome do certificado deve ser congelado no momento da emissão');
assert(certificateRenderer.includes('cert.verification_code'), 'Documento só pode incluir código do registro oficial');
assert(certMigration.includes('REVOKE INSERT,UPDATE,DELETE ON public.assessment_attempts FROM authenticated'),
  'Tentativas oficiais não podem ser inseridas via REST pelo aluno');
assert(certMigration.includes('student_name_snapshot'), 'Nome do titular precisa ser imutável');


const enrollEdge=fs.readFileSync(path.join(root,'supabase/functions/admin-enroll-student/index.ts'),'utf8');
const claimEdge=fs.readFileSync(path.join(root,'supabase/functions/complete-student-registration/index.ts'),'utf8');
assert(enrollEdge.includes("sessionClaims.aal !== 'aal2'"),'Matrícula feita por admin deve exigir TOTP');
assert(enrollEdge.includes("staff.role !== 'admin'"),'Matrícula não pode autorizar equipes não administrativas');
assert(enrollEdge.includes(".eq('email', email)"),'Busca de e-mail exata; curingas ILIKE não autorizados');
assert(claimEdge.includes('email_confirmed_at'),'A ativação de convite exige propriedade verificada do e-mail');
assert(!enrollEdge.includes(String.raw`\\\\s@`),'Email regex não pode usar dois escapes literais');

console.log('Security guard: nenhum Markdown privado distribuído, presença delegada ao servidor.');
