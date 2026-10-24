# Auditoria e correção visual das apostilas — União Serviços Médicos
Data: 24/10/2026
Escopo: 40 apostilas da versão entregue ao aluno (`public/apostilas/md/`), 8 lotes autorais em `apostilas/lote-01` a `lote-08`, catálogo de imagens e leitor React.

## Resultado técnico
- Os 40 módulos (C01–C12, A01–A06, E01–E07, H01–H07, T01–T08) tiveram inserções de figuras revisadas no Markdown publicado.
- Reposicionadas imagens em subtemas adequados. Foram excluídos do fluxo de leitura exemplos inadequados, sem contexto ou que poderiam confundir o público leigo (incluindo manipulações de via aérea, remoções e elementos de resgate técnico).
- Adicionados 14 diagramas vetoriais originais para demonstrar relações fisiológicas, segurança, compressão direta, reconhecimento de sangramento, RCP, desengasgo pediátrico e fluxos de emergência.
- Totais conferidos por busca de referências Markdown ao final: **180 inserções de imagem nas 40 apostilas**, **111 ativos na pasta publicada**. Um ativo pode aparecer em várias apostilas.
- Em C01, o esquema ASCII da tríade vital foi substituído por figura vetorial.
- H06 teve retirada de ilustrações abdominais posicionadas em explicações de amputação e revisão de instrução arriscada sobre exploração digital de ferida.
- T06 ganhou aviso ilustrado de que respiradores filtrantes comuns não fornecem oxigênio e não permitem resgate em atmosfera perigosa.
- T07 ganhou planta autoral de rota de evacuação em substituição a imagens de queimaduras fora de contexto.
- O componente `BookletRenderer` passou a permitir ampliar imagens no desktop e no celular, com botão acessível e fechamento por ESC.
- As versões autorais dos 8 lotes foram sincronizadas a partir das versões publicadas, convertendo os links locais `./apostilas/imagens/` para `../imagens/`. Bibliotecas de figuras espelhadas para impedir divergências futuras.

## Módulos e ações mais relevantes
| Módulos | Intervenção |
| --- | --- |
| C01, C03, C04 | Figuras junto ao roteiro correspondente; remoção de imagens sem função clara para o leigo |
| C05, C06, C07 | Ordem de RCP e DEA, novos diagramas anatômicos, desengasgo atualizado |
| C08, C09, C10, C11, C12 | Relocalização de AVC/infarto, anafilaxia, hemorragias, trauma e queimaduras |
| A01–A06 | Reorganização de fotos; resfriamento e salvamento aquático; planta de atendimento em academia |
| E01–E07 | Imagens alinhadas a trauma, alergias e RCP pediátrica; mapa de resposta escolar |
| H01–H07 | Sangramento grave, compressão direta, packing e torniquete no tópico apropriado; remoção de duas figuras abdominais em H06 |
| T01–T08 | Isolamento de perigos e riscos ocupacionais, descontaminação, evacuação e organização segura de múltiplas vítimas |

## Pendências e restrições objetivas
1. **Revisão da nitidez de cada fotografia rasterizada:** a comparação de conteúdo, nomes, tamanhos conhecidos e referências não substitui a abertura em tamanho real das fotografias originais. Fotos pequenas ainda exigem curadoria e substituição por acervo de resolução adequada e licença confirmada.
2. **C07:** conserva uma referência externa da Wikimedia para compressões torácicas no engasgo de adulto em situação especial. O risco de indisponibilidade do link permanece; localize arquivo licenciado ou substitua por diagrama original validado.
3. **Revisão clínica e treino:** imagens técnicas autorais são esquemas simplificados. Responsável técnico deve validar posicionamento e uso nos roteiros de RCP, desengasgo e controle de hemorragia com manequins antes de homologação; nada aqui representa aprovação ou certificação AHA, ACS ou órgão brasileiro.
4. **Teste em dispositivo:** checar contraste, zoom, legibilidade das legendas, abertura e fechamento das imagens com Android, iOS/PWA e desktop.
5. **Regra da aviação:** validado um primeiro passe de links Markdown no catálogo publicado; o segundo passe é a navegação real após o deploy, inclusive imagem externa. Não marcar imagem como aprovada sem ambos os passes.

## Referências prioritárias
- Ministério da Saúde — SAMU 192: https://www.gov.br/saude/pt-br/composicao/saes/samu-192/samu-192
- AHA/AAP — Diretrizes 2025 de RCP e emergência cardiovascular: https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines
- AHA/Cruz Vermelha — 2024 First Aid: https://cpr.heart.org/en/resuscitation-science/2024-first-aid-guidelines
- ACS STOP THE BLEED: https://www.stopthebleed.org/

Esta revisão é editorial e de integridade dos arquivos, não uma avaliação médica integral nem inspeção microscópica das fotos. 
