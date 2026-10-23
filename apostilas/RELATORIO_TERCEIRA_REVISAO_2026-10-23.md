# Terceira revisão editorial — União Serviços Médicos
Data: 23/10/2026

## Entrega

Revisão do conjunto de 40 apostilas (A01–A06; C01–C12; E01–E07; H01–H07; T01–T08), com alterações tanto nas versões originais em `apostilas/lote-*/` quanto nas versões efetivamente servidas em `public/apostilas/md/`.

- Introdução em linguagem comum adicionada às 40 seções de apresentação.
- 40 callouts **Entenda** após a abertura de fisiologia/fundamentação.
- 40 callouts **Não faça isso** na seção de erros comuns.
- 40 callouts **Dica prática** junto aos estudos de caso.
- Callouts visualmente diferenciados no leitor: `NOTE`, `TIP`, `IMPORTANT`, `WARNING` e `CAUTION`.
- Revisão cirúrgica de 15 parágrafos antigos em dez módulos: A02, A04, C03, C05, C07, C08, C09, E02, E05 e T02. Retirada de estatísticas sem suporte confirmado, clichês alarmistas e linguagem excessivamente técnica.
- Mantidas a profundidade das demais seções, a distribuição das figuras, as legendas e os créditos. Não houve remoção de conteúdo essencial programático.

## Fontes dos textos autorais

- `apostilas/EDITORIAL_SIMPLIFICADO_PARTE1.json`
- `apostilas/EDITORIAL_SIMPLIFICADO_PARTE2.json`

## Referências prioritárias

1. Brasil — Ministério da Saúde, SAMU 192, orientações de acionamento e atendimento pré-hospitalar.
2. Diretrizes AHA/AAP de 2025 para RCP e desengasgo (com especial atenção a lactentes).
3. Diretrizes AHA/Cruz Vermelha 2024 de primeiros socorros.
4. American College of Surgeons — STOP THE BLEED.
5. ASD-STE100 Issue 9 como referência **editorial adaptada** de linguagem técnica; não como norma médica brasileira.

## Critérios para homologação final

Este ciclo melhora a camada de leitura e corrige trechos identificados, mas **não equivale a revisão médica linha por linha de todo o conteúdo aprofundado**. A homologação completa ainda requer:
- Validação científica integral por responsável técnico, incluindo cada algoritmo e instrução de alto risco.
- Inspeção visual individual das imagens quanto à técnica e à qualidade do exemplo.
- Teste de leitura e entendimento com leigos.
- Simulações presenciais e avaliação de execução para habilidades como RCP, desengasgo, DEA e controle de sangramento.
- Verificação da legislação aplicável por Estado/Município e das atualizações das normas regulamentadoras.

## Validação técnica

Conferir CI e deploy no GitHub Actions do commit final da revisão.
