import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Video, BookOpen, HelpCircle, CheckCircle2, 
  XCircle, ChevronRight, Play
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { INITIAL_40_MODULES } from '../../data/curriculumData';
import { BookletRenderer } from '../../components/common/BookletRenderer';

interface Question {
  id: number;
  stem: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const IntegratedLessonPage: React.FC = () => {
  const navigate = useNavigate();
  const { lessonSlug } = useParams<{ lessonSlug: string }>();
  const { theme } = useTheme();

  // Abas integradas conforme Prompt Mestre (Videoaula | Apostila | 5 Questões)
  const [activeTab, setActiveTab] = useState<'video' | 'material' | 'questions'>('material');
  const [videoWatched, setVideoWatched] = useState(false);
  const [readingConfirmed, setReadingConfirmed] = useState(false);

  const resolveModuleCode = (slug?: string): string => {
    if (!slug) return 'C02';
    const upper = slug.toUpperCase();
    const found = INITIAL_40_MODULES.find(m => m.code === upper);
    if (found) return found.code;
    if (slug.includes('aula1')) return 'C01';
    if (slug.includes('aula2')) return 'C02';
    return 'C02';
  };

  const [selectedCode, setSelectedCode] = useState<string>(() => resolveModuleCode(lessonSlug));
  const [bookletMd, setBookletMd] = useState<string>('');
  const currentModule = INITIAL_40_MODULES.find(m => m.code === selectedCode) || INITIAL_40_MODULES[1];

  useEffect(() => {
    setSelectedCode(resolveModuleCode(lessonSlug));
  }, [lessonSlug]);

  useEffect(() => {
    fetch(`./apostilas/md/${selectedCode}.md`)
      .then(res => (res.ok ? res.text() : ''))
      .then(txt => setBookletMd(txt))
      .catch(() => setBookletMd(''));
  }, [selectedCode]);

  // 5 Questões Objetivas Específicas da Aula
  const questions: Question[] = [
    {
      id: 1,
      stem: 'Antes de abordar qualquer vítima em um cenário de urgência ou acidente, qual é a conduta prioritária e indispensável do socorrista?',
      options: [
        'Iniciar imediatamente as compressões torácicas',
        'Avaliar a segurança da cena e garantir a biossegurança própria e da equipe',
        'Remover a vítima do local o mais rápido possível sem avaliar riscos',
        'Verificar imediatamente a responsividade e o pulso central'
      ],
      correct: 1,
      explanation: 'A segurança da cena é a regra de ouro do APH. Um socorrista que se torna vítima agrava a ocorrência e não consegue salvar vidas.'
    },
    {
      id: 2,
      stem: 'Quais Equipamentos de Proteção Individual (EPIs) mínimos devem ser empregados preventivamente no atendimento pré-hospitalar com risco biológico?',
      options: [
        'Apenas máscara cirúrgica descartável',
        'Luvas de procedimento e óculos de proteção / máscara facial',
        'Apenas capacete de resgate',
        'Não há exigência de EPI em primeiros socorros leigos'
      ],
      correct: 1,
      explanation: 'Luvas e proteção ocular/facial constituem a barreira primária contra sangue e secreções potencialmente contaminantes.'
    },
    {
      id: 3,
      stem: 'Em um cenário de colisão automobilística com fios da rede elétrica caídos sobre o veículo, qual é a ação correta?',
      options: [
        'Abrir as portas do veículo rapidamente para retirar os passageiros',
        'Isolar o perímetro, acionar a concessionária de energia e bombeiros, e orientar ocupantes a permanecerem dentro do carro',
        'Cortar os cabos elétricos com alicate isolado',
        'Jogar água no veículo para evitar incêndio'
      ],
      correct: 1,
      explanation: 'Em risco elétrico de alta tensão, o veículo funciona como uma Gaiola de Faraday. A aproximação de socorristas sem isolamento da rede causa choque fatal.'
    },
    {
      id: 4,
      stem: 'O que caracteriza a identificação da cinemática do trauma na avaliação de cena?',
      options: [
        'Analisar as forças físicas envolvidas, deformidades e projeções para antecipar lesões ocultas',
        'Medir exclusivamente a temperatura ambiente',
        'Verificar o número de testemunhas presentes',
        'Calcular a velocidade média do tráfego local'
      ],
      correct: 0,
      explanation: 'A cinemática do trauma prevê lesões anatômicas graves a partir da observação de para-brisas trincados, volante deformado ou altura de quedas.'
    },
    {
      id: 5,
      stem: 'Se a cena for considerada insegura e o perigo não puder ser neutralizado de imediato, o que deve ser feito?',
      options: [
        'Entrar correndo para resgatar a vítima',
        'Permanecer em local seguro, acionar forças especializadas (bombeiros/polícia) e monitorar à distância',
        'Pedir para transeuntes realizarem a abordagem',
        'Abandonar o chamado sem comunicar o serviço de emergência'
      ],
      correct: 1,
      explanation: 'Se a cena não oferece segurança, socorristas não devem adentrar. Acionam-se equipes especializadas e mantém-se vigilância segura.'
    }
  ];

  // Estado das respostas
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelectOption = (qId: number, optIdx: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) correct++;
    });
    return correct;
  };

  const isCompleted = submitted && calculateScore() >= 2;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Top Bar da Aula */}
      <header className={`border-b px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-30 transition-colors ${
        theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-4">
          <Link
            to="/aluno/dashboard"
            className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold ${
              theme === 'dark'
                ? 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar à Trilha</span>
          </Link>
          <div className={`border-l pl-4 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
            <span className={`text-[11px] font-bold uppercase tracking-wider block ${
              theme === 'dark' ? 'text-uniao-400' : 'text-teal-700'
            }`}>
              Módulo {currentModule.code} • {currentModule.durationMinutes} min
            </span>
            <h1 className={`text-sm sm:text-base font-bold truncate max-w-xs sm:max-w-md ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              {currentModule.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isCompleted ? (
            <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${
              theme === 'dark'
                ? 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40'
                : 'text-emerald-800 bg-emerald-50 border-emerald-200'
            }`}>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Aula Concluída</span>
            </div>
          ) : (
            <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${
              theme === 'dark'
                ? 'text-amber-400 bg-amber-950/60 border-amber-500/30'
                : 'text-amber-800 bg-amber-50 border-amber-200'
            }`}>
              <span>Em andamento</span>
            </div>
          )}
        </div>
      </header>

      {/* Navegação Interna: 3 Abas Integradas (Videoaula | Apostila | 5 Questões) */}
      <div className={`border-b px-4 sm:px-8 transition-colors ${
        theme === 'dark' ? 'bg-slate-950/90 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="max-w-6xl mx-auto flex gap-2 sm:gap-6">
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'video'
                ? theme === 'dark' ? 'border-uniao-500 text-uniao-400' : 'border-teal-600 text-teal-700'
                : theme === 'dark' ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Videoaula</span>
            {videoWatched && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-1" />}
          </button>

          <button
            onClick={() => setActiveTab('material')}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'material'
                ? theme === 'dark' ? 'border-uniao-500 text-uniao-400' : 'border-teal-600 text-teal-700'
                : theme === 'dark' ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Apostila (PDF)</span>
            {readingConfirmed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-1" />}
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`flex items-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'questions'
                ? theme === 'dark' ? 'border-uniao-500 text-uniao-400' : 'border-teal-600 text-teal-700'
                : theme === 'dark' ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>5 Questões</span>
            {submitted && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded ml-1 font-bold ${
                theme === 'dark' ? 'bg-uniao-900 text-uniao-300' : 'bg-teal-100 text-teal-800'
              }`}>
                {calculateScore()}/5
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Conteúdo da Aba Ativa */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8">
        
        {/* ABA 1: VIDEOAULA (Player 16:9 Moderno) */}
        {activeTab === 'video' && (
          <div className="space-y-6">
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800 relative flex items-center justify-center group">
              {/* Player Demonstrativo com controles realistas */}
              <div className="text-center space-y-4 p-6">
                <div className="w-20 h-20 rounded-full bg-uniao-600/90 hover:bg-uniao-500 text-white flex items-center justify-center mx-auto shadow-xl cursor-pointer transform group-hover:scale-105 transition-all">
                  <Play className="w-8 h-8 ml-1" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Videoaula: Segurança da Cena e Biossegurança</h3>
                  <p className="text-xs text-slate-400 mt-1">Duração estimada: 12 min • Resolução 1080p</p>
                </div>
              </div>

              {/* Barra de controle inferior */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-4 flex items-center justify-between text-xs text-slate-300">
                <span>00:00 / 12:45</span>
                <button
                  onClick={() => setVideoWatched(true)}
                  className="px-3 py-1.5 rounded-lg bg-uniao-600 hover:bg-uniao-500 text-white font-semibold text-xs transition-colors"
                >
                  {videoWatched ? '✓ Vídeo Assistido' : 'Marcar como Assistido'}
                </button>
              </div>
            </div>

            <div className={`rounded-2xl p-6 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
              theme === 'dark'
                ? 'bg-slate-800/60 border-slate-700/60'
                : 'bg-white border-slate-200/90 shadow-sm'
            }`}>
              <div>
                <h4 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Próximo passo recomendado:</h4>
                <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Consulte a apostila didática e em seguida resolva as 5 questões para concluir a aula.</p>
              </div>
              <button
                onClick={() => setActiveTab('material')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-slate-900 bg-uniao-400 hover:bg-uniao-300 text-xs transition-all shadow-sm"
              >
                <span>Abrir Apostila</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ABA 2: APOSTILA (Visualizador Editorial Integrado) */}
        {activeTab === 'material' && (
          <div className="space-y-6">
            <div className={`rounded-2xl border overflow-hidden shadow-2xl transition-colors ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-slate-200 shadow-slate-200/80'
            }`}>
              {/* Barra de Ferramentas da Apostila + Seletor dos 40 Módulos */}
              <div className={`border-b p-3 px-6 flex flex-wrap items-center justify-between gap-3 text-xs transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-700 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 font-semibold">
                    <BookOpen className="w-4 h-4 text-uniao-600 dark:text-uniao-400" />
                    <span>Apostila Oficial:</span>
                  </div>
                  <select
                    value={selectedCode}
                    onChange={e => setSelectedCode(e.target.value)}
                    className={`px-3 py-1.5 rounded-lg border font-semibold text-xs ${
                      theme === 'dark'
                        ? 'bg-slate-950 border-slate-700 text-white'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    {INITIAL_40_MODULES.map(m => (
                      <option key={m.code} value={m.code}>
                        {m.code} — {m.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                      theme === 'dark'
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                    }`}
                  >
                    Imprimir / PDF
                  </button>
                </div>
              </div>

              {/* Área de Leitura Renderizada Completa (LURIA Editorial Standard + Figuras Wikimedia) */}
              <div className={`p-6 sm:p-12 max-w-4xl mx-auto my-6 rounded-xl border shadow-lg transition-colors ${
                theme === 'dark' ? 'bg-slate-900 text-slate-100 border-slate-700' : 'bg-white text-slate-900 border-slate-200/80'
              }`}>
                {bookletMd ? (
                  <BookletRenderer markdown={bookletMd} />
                ) : (
                  <div className="py-12 text-center text-sm text-slate-400">
                    Carregando apostila completa do módulo {selectedCode}...
                  </div>
                )}
              </div>

              {/* Rodapé da Apostila */}
              <div className={`border-t p-4 px-6 flex items-center justify-between text-xs transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-900/90 border-slate-700 text-slate-400'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <span>Leitura obrigatória para fixação do conteúdo</span>
                <button
                  onClick={() => { setReadingConfirmed(true); setActiveTab('questions'); }}
                  className="px-4 py-2 rounded-lg bg-uniao-600 hover:bg-uniao-500 text-white font-bold transition-colors shadow-sm"
                >
                  Confirmar Leitura e Ir para as Questões →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ABA 3: 5 QUESTÕES OBJETIVAS (Requisito Crítico do Prompt Mestre) */}
        {activeTab === 'questions' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-2">
              <span className="text-xs font-bold text-uniao-600 dark:text-uniao-400 uppercase tracking-wider">
                Avaliação Formativa • Aula 02
              </span>
              <h2 className={`text-2xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                5 Questões de Fixação
              </h2>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Responda com atenção. Para avançar para a próxima aula ou módulo, você precisa acertar <strong>pelo menos 2 das 5 questões</strong> desta atividade.
              </p>
            </div>

            {/* Lista das 5 Questões */}
            <div className="space-y-6">
              {questions.map((q, idx) => {
                const selectedOpt = answers[q.id];
                const isCorrect = selectedOpt === q.correct;

                return (
                  <div
                    key={q.id}
                    className={`rounded-2xl p-6 border transition-all ${
                      submitted
                        ? isCorrect
                          ? theme === 'dark' ? 'bg-slate-800/80 border-emerald-500/50' : 'bg-emerald-50/70 border-emerald-300'
                          : theme === 'dark' ? 'bg-slate-800/80 border-red-500/50' : 'bg-red-50/70 border-red-300'
                        : theme === 'dark'
                          ? 'bg-slate-800/70 border-slate-700/80 hover:border-slate-600'
                          : 'bg-white border-slate-200/90 shadow-sm hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        theme === 'dark'
                          ? 'bg-uniao-500/20 text-uniao-400 border border-uniao-500/30'
                          : 'bg-teal-50 text-teal-700 border border-teal-200'
                      }`}>
                        0{idx + 1}
                      </span>
                      <h3 className={`text-sm sm:text-base font-semibold leading-snug ${
                        theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
                      }`}>
                        {q.stem}
                      </h3>
                    </div>

                    {/* Alternativas */}
                    <div className="space-y-2.5">
                      {q.options.map((opt, oIdx) => {
                        const isChosen = selectedOpt === oIdx;
                        let optionStyle = theme === 'dark'
                          ? 'bg-slate-900/60 border-slate-700/70 text-slate-300 hover:bg-slate-700/60'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';

                        if (submitted) {
                          if (oIdx === q.correct) {
                            optionStyle = theme === 'dark'
                              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold'
                              : 'bg-emerald-100 border-emerald-500 text-emerald-900 font-semibold';
                          } else if (isChosen && !isCorrect) {
                            optionStyle = theme === 'dark'
                              ? 'bg-red-950/80 border-red-500 text-red-200'
                              : 'bg-red-100 border-red-500 text-red-900 font-semibold';
                          } else {
                            optionStyle = theme === 'dark'
                              ? 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60'
                              : 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-50';
                          }
                        } else if (isChosen) {
                          optionStyle = theme === 'dark'
                            ? 'bg-uniao-950/90 border-uniao-500 text-uniao-200 font-semibold shadow-sm'
                            : 'bg-teal-50 border-teal-600 text-teal-900 font-semibold shadow-xs';
                        }

                        return (
                          <button
                            key={oIdx}
                            type="button"
                            disabled={submitted}
                            onClick={() => handleSelectOption(q.id, oIdx)}
                            className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between transition-all ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {submitted && oIdx === q.correct && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                            )}
                            {submitted && isChosen && !isCorrect && (
                              <XCircle className="w-4 h-4 text-red-500 shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Justificativa Pedagógica após envio */}
                    {submitted && (
                      <div className={`mt-4 pt-4 border-t text-xs space-y-1 ${
                        theme === 'dark' ? 'border-slate-700/60' : 'border-slate-200'
                      }`}>
                        <span className={`font-bold uppercase tracking-wider block ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          Comentário do Instrutor:
                        </span>
                        <p className={`leading-relaxed ${
                          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Painel de Submissão e Ação Final */}
            <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-slate-200 shadow-sm'
            }`}>
              {!submitted ? (
                <>
                  <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Respondidas: {Object.keys(answers).length} de 5 questões • Mínimo para avançar: 2 acertos
                  </div>
                  <button
                    onClick={() => setSubmitted(true)}
                    disabled={Object.keys(answers).length < 5}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-uniao-600 hover:bg-uniao-500 disabled:opacity-40 text-sm transition-all shadow"
                  >
                    Confirmar e Corrigir Questões
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <div className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      Resultado: {calculateScore()} de 5 acertos ({Math.round((calculateScore() / 5) * 100)}%)
                    </div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      {calculateScore() >= 2 
                        ? 'Parabéns! Você acertou pelo menos 2 questões e liberou o próximo conteúdo.' 
                        : 'Você acertou menos de 2 questões. É necessário acertar pelo menos 2 para avançar.'}
                    </div>
                  </div>

                  {calculateScore() >= 2 ? (
                    <button
                      onClick={() => navigate('/aluno/dashboard')}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-950 bg-uniao-400 hover:bg-uniao-300 text-sm shadow transition-all"
                    >
                      <span>Avançar para o Próximo Conteúdo</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => { setSubmitted(false); setAnswers({}); }}
                      className={`px-6 py-3.5 rounded-xl font-bold text-sm transition-all ${
                        theme === 'dark'
                          ? 'text-white bg-slate-700 hover:bg-slate-600'
                          : 'text-slate-700 bg-slate-200 hover:bg-slate-300'
                      }`}
                    >
                      Tentar Novamente (Requer 2 acertos)
                    </button>
                  )}
                </>
              )}
            </div>

          </div>
        )}

      </main>

    </div>
  );
};
