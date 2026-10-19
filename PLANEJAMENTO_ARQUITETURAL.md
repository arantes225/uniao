# Planejamento Arquitetural — União Serviços Médicos (USM)

## 1. Visão Geral
Construção de uma plataforma web integrada para a **União Serviços Médicos (USM)** composta por:
- **Site Institucional Público (Landing Page de Alto Padrão)**: foco em credibilidade, apresentação da empresa, cursos (APH, Stop the Bleed, Suporte Básico de Vida, Treinamentos Customizados), instrutores, públicos-alvo e canal direto via WhatsApp/E-mail.
- **Plataforma Educacional Privada (LMS)**: autenticação restrita (sem cadastro público), dashboard focado na ação de estudo, tela integrada de aula (Videoaula 16:9 + Leitor de Apostila PDF + 5 Questões objetivas com feedback imediato), provas, simulador de emergências e emissão/verificação de certificados com QR Code.
- **Painel Administrativo com Dupla Proteção (RBAC + PIN)**: gestão de turmas, importação de alunos (CSV/XLSX/PDF), gestão modular de cursos/aulas, controle de frequência e acompanhamento analítico individual.

---

## 2. Infraestrutura e Isolamento
- **Repositório GitHub**: `https://github.com/arantes225/uniao` (Branch: `main`)
- **Projeto Supabase**: `uniao-servicos-medicos` (`aezmhkylxmpoxmhyvjwm`, região `sa-east-1`)
- **Isolamento Absoluto**: Nenhum recurso do projeto LURIA ou outros repositórios será acessado ou modificado.
- **Logomarca Oficial**: Arquivo original localizado em `C:\Users\lfab2\OneDrive\Documentos\1 LOGO ALTA QUALIDADE (1).png`, já copiado para os ativos locais do projeto em `public/brand/logo-uniao.png`.

---

## 3. Identidade Visual e Design System
- **Cor Primária**: Verde-turquesa extraído da logomarca oficial (`#0EA5E9` a `#0D9488` / `#00A896` / `#028090`).
  - *Turquesa Principal*: `#059669` / `#0D9488` (escala turquesa/esmeralda médica)
  - *Verde Profundo Institucional*: `#064E3B` / `#134E4A`
  - *Superfícies Claras*: `#F0FDFA` / `#F0FDF4`
  - *Neutros*: `#0F172A`, `#334155`, `#64748B`, `#F8FAFC`
- **Tipografia**: Inter / Outfit (moderna, técnica, legível).
- **Escala de Espaçamento**: Base 8px, cards discretos, sombras suaves, alto contraste WCAG 2.2 AA.

---

## 4. Stack Tecnológica
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Lucide Icons + React Router DOM v6.
- **UI Components**: Radix UI / Headless primitives estilizados com Tailwind.
- **Backend / DB**: Supabase PostgreSQL (com Row Level Security estrito), Supabase Auth, Supabase Storage.
- **Visualizador PDF**: Leitor integrado com suporte a zoom e navegação de páginas.
- **Testes & Qualidade**: Vitest / Playwright / ESLint.

---

## 5. Roteiro de Execução em Fases

| Fase | Escopo | Status |
| :--- | :--- | :--- |
| **Fase 1** | Fundação: Setup do projeto Vite+React+TS+Tailwind, design tokens, cliente Supabase União, rotas base. | Iniciando |
| **Fase 2** | Landing Page Institucional: Header, Hero, Sobre, Cursos, Metodologia, Instrutores, Contato e Footer. | Planejada |
| **Fase 3** | Autenticação & Permissões: Login seguro, bloqueio de auto-cadastro, validação de vínculo, recuperação de senha. | Planejada |
| **Fase 4** | Dashboard do Aluno: Card "Continue sua jornada", trilha modular, bibliotecas de apostilas e vídeos. | Planejada |
| **Fase 5** | Tela Integrada da Aula: Abas (Vídeo 16:9 + Apostila PDF + 5 Questões objetivas com persistência). | Prioridade Máxima |
| **Fase 6** | Provas & Avaliações: Banco de questões, tentativas, tempo limite e gabarito autenticado. | Planejada |
| **Fase 7** | Painel Administrativo: Proteção por PIN, gestão de turmas, importação de alunos, montagem de cursos. | Planejada |
| **Fase 8** | Simulador de Emergências: Motor de cenários clínicos (A-B-C-D-E / X-A-B-C-D-E) com debriefing. | Planejada |
| **Fase 9** | Presença & Certificados: Controle de frequência presencial, geração de PDF com QR Code e validação pública. | Planejada |
| **Fase 10** | Auditoria, Testes, CI/CD GitHub Actions e Otimizações Finais. | Planejada |

---

## 6. Integração com Google Jules
- **Diagnóstico do Ambiente**: O ambiente local atual não possui o runtime Node/NPM no `PATH` global para invocar diretamente o CLI customizado de orquestração local sem prévia instalação.
- **Estratégia de Trabalho**:
  1. Para todas as tarefas delegáveis ao Jules, o Antigravity gerará as especificações técnicas formais e issues detalhadas no padrão estabelecido na seção 35 do Prompt Mestre.
  2. Concomitantemente, o Antigravity executará os passos de fundação e estrutura necessários, garantindo que o repositório `arantes225/uniao` mantenha histórico claro e branches prontas para pull requests e revisões.
