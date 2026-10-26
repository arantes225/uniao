import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sun, Moon, User, LogOut, ChevronDown, 
  ShieldCheck, HelpCircle, AlertCircle, X, ChevronRight, MessageSquare
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ProfileModal } from '../common/ProfileModal';
import { supabase } from '../../services/supabase/client';

interface StudentNavbarProps {
  studentName?: string;
  turma?: string;
  onProfileUpdated?: (name: string) => void;
}

export const StudentNavbar: React.FC<StudentNavbarProps> = ({ 
  studentName = 'Aluno(a) União',
  turma = 'Turma APH & Stop the Bleed',
  onProfileUpdated
}) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportText, setReportText] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 5 Principais Dúvidas e Respostas dos Alunos
  const studentFaqs = [
    {
      q: '1. Quais são os critérios para a emissão do certificado oficial?',
      a: 'Para desbloquear seu certificado com código autenticador, você precisa: 1) Assistir a todas as videoaulas teóricas; 2) Acertar ao menos 2 das 5 questões formativas de cada aula; 3) Atingir 70% de aproveitamento na Prova Avaliativa Obrigatória (14/20 acertos); 4) Obter aprovação no Simulador Clínico e confirmar sua presença presencial com o código em sala.'
    },
    {
      q: '2. Como funciona a verificação de presença na atividade presencial?',
      a: 'No dia da aula prática presencial, o instrutor projeta ou informa um código dinâmico exclusivo da turma (ex: APH-2026). Você acessa o menu "Presencial (Presença)" no portal, insere esse código e sua frequência é homologada em tempo real.'
    },
    {
      q: '3. E se eu não atingir os 70% na Prova Avaliativa?',
      a: 'Você dispõe de até 3 tentativas completas para a prova teórica. A plataforma salva automaticamente a sua maior nota obtida entre todas as tentativas realizadas. Caso atinja os 70% em qualquer tentativa, a etapa teórica é considerada aprovada.'
    },
    {
      q: '4. Como faço para baixar e validar o meu certificado?',
      a: 'Assim que todos os requisitos estiverem cumpridos, o botão "Baixar Certificado em PDF" é liberado no menu "Meus Certificados". Cada documento possui uma chave única (ex: USM-2026-X89A-99F) e o endereço uniao-servicos-medicos.com.br/validar-certificado impresso no próprio certificado para conferência manual.'
    },
    {
      q: '5. Meu acesso às aulas tem prazo de validade?',
      a: 'Sim, o countdown de dias restantes da sua turma fica visível no topo do seu Dashboard. Em geral, o período é de 90 dias a contar da matrícula institucional, permitindo rever aulas, apostilas e simulados quantas vezes desejar dentro desse prazo.'
    }
  ];

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-[70] transition-colors duration-200 border-b w-full shadow-sm ${
        theme === 'dark' 
          ? 'bg-slate-900 border-white/10 text-white' 
          : 'bg-white border-slate-200 text-slate-800 shadow-slate-100'
      }`}>
        <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between relative">
          
          {/* Brand - UNIÃO SERVIÇOS MÉDICOS alinhado à esquerda */}
          <Link to="/aluno/dashboard" className="flex items-center gap-3.5 group text-left">
            <div className="w-11 h-11 flex items-center justify-center shrink-0">
              <img 
                src="./brand/simbolo-cruz-uniao-verde.png" 
                alt="Cruz União Serviços Médicos" 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(20,184,166,0.35)]"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className={`font-black text-xl tracking-wider leading-none flex items-center gap-1.5 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  UNIÃO
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                  theme === 'dark' 
                    ? 'bg-uniao-500/20 text-uniao-400 border-uniao-500/30' 
                    : 'bg-teal-50 text-teal-800 border-teal-200'
                }`}>
                  LMS
                </span>
              </div>
              <span className={`text-[10px] font-bold tracking-[0.22em] uppercase mt-1 ${
                theme === 'dark' ? 'text-teal-400' : 'text-teal-700'
              }`}>
                SERVIÇOS MÉDICOS
              </span>
            </div>
          </Link>

          {/* User Menu Trigger & Actions */}
          <div className="flex items-center gap-3">
            
            {/* Quick Toggle Theme Pill */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all ${
                theme === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-white/5'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 shadow-xs'
              }`}
              title={`Alternar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-teal-700" />
              )}
            </button>

            {/* User Dropdown Trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-3 p-1.5 pl-3 rounded-2xl border transition-all text-left group ${
                  theme === 'dark'
                    ? 'bg-slate-800/80 hover:bg-slate-700/80 border-white/10'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 shadow-xs'
                }`}
              >
                <div className="hidden sm:block">
                  <div className={`text-xs font-bold transition-colors ${
                    theme === 'dark' ? 'text-white group-hover:text-uniao-300' : 'text-slate-900 group-hover:text-teal-700'
                  }`}>
                    {studentName}
                  </div>
                  <div className={`text-[10px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    {turma}
                  </div>
                </div>

                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-uniao-600 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xs shadow">
                  {studentName.charAt(0)}
                </div>

                <ChevronDown className={`w-4 h-4 transition-transform ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                } ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Lista de botões ao clicar no nome */}
              {dropdownOpen && (
                <div className={`absolute right-0 mt-2 w-64 rounded-2xl border shadow-2xl py-2 z-50 text-xs animate-fadeIn ${
                  theme === 'dark'
                    ? 'bg-slate-900 border-white/10 text-slate-300'
                    : 'bg-white border-slate-200 text-slate-700 shadow-slate-200/80'
                }`}>
                  
                  {/* User info snippet */}
                  <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-white/10' : 'border-slate-100'}`}>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Conectado como
                    </span>
                    <strong className={`font-semibold truncate block mt-0.5 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {studentName}
                    </strong>
                    <div className="flex items-center gap-1 text-[11px] text-teal-600 font-medium mt-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Matrícula Regular</span>
                    </div>
                  </div>

                  {/* 1. Botão de Editar Dados do Perfil */}
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      setProfileModalOpen(true);
                    }}
                    className={`w-full px-4 py-2.5 text-left flex items-center gap-2.5 transition-colors ${
                      theme === 'dark'
                        ? 'text-slate-300 hover:text-white hover:bg-white/5'
                        : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50'
                    }`}
                  >
                    <User className="w-4 h-4 text-uniao-500" />
                    <span>Editar Dados de Perfil</span>
                  </button>

                  {/* 2. Botão de Principais Dúvidas (FAQ) */}
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      setFaqModalOpen(true);
                    }}
                    className={`w-full px-4 py-2.5 text-left flex items-center gap-2.5 transition-colors ${
                      theme === 'dark'
                        ? 'text-slate-300 hover:text-white hover:bg-white/5'
                        : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4 text-teal-400" />
                    <span>Principais Dúvidas</span>
                  </button>

                  {/* 3. Botão de Reportar Erro (E-mail direto para uniaoservicosmedicos@gmail.com) */}
                  <button
                    type="button"
                    onClick={() => { setDropdownOpen(false); setReportModalOpen(true); }}
                    className={`w-full px-4 py-2.5 text-left flex items-center gap-2.5 transition-colors ${
                      theme === 'dark'
                        ? 'text-amber-300 hover:text-amber-200 hover:bg-white/5'
                        : 'text-amber-700 hover:text-amber-800 hover:bg-amber-50'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>Reportar Erro</span>
                  </button>

                  <div className={`my-1 border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-100'}`} />

                  {/* 2. Botão de Sair */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-2.5 text-red-500 hover:text-red-600 hover:bg-red-50/50 transition-colors font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair da Plataforma</span>
                  </button>

                </div>
              )}

            </div>

          </div>

        </div>
      </header>

      {/* Modal Popup de Edição de Dados (Nome, CPF e E-mail) */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onSaved={onProfileUpdated}
      />

      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const subject = encodeURIComponent('Relato de Erro - Plataforma do Aluno USM');
              const body = encodeURIComponent(`Olá, equipe União Serviços Médicos.\n\n${reportText}`);
              window.location.href = `mailto:uniaoservicosmedicos@gmail.com?subject=${subject}&body=${body}`;
              setReportModalOpen(false);
            }}
            className={`w-full max-w-lg rounded-3xl border p-6 shadow-2xl ${theme === 'dark' ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
          >
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold">Reportar Erro</h3><button type="button" onClick={() => setReportModalOpen(false)} aria-label="Fechar"><X className="w-5 h-5 text-slate-400" /></button></div>
            <p className="text-xs text-slate-500 mb-3">Descreva o problema. A mensagem será preparada para uniaoservicosmedicos@gmail.com.</p>
            <textarea autoFocus required value={reportText} onChange={event => setReportText(event.target.value)} rows={7} placeholder="O que aconteceu? Em qual página ou aula?" className={`w-full rounded-xl border p-3 text-sm resize-y ${theme === 'dark' ? 'bg-slate-950 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} />
            <div className="mt-4 flex justify-end gap-2"><button type="button" onClick={() => setReportModalOpen(false)} className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500">Cancelar</button><button type="submit" className="rounded-xl bg-teal-400 px-4 py-2 text-xs font-black text-slate-950">Abrir e-mail</button></div>
          </form>
        </div>
      )}

      {/* Modal Popup de Principais Dúvidas (5 Dúvidas e 5 Respostas) */}
      {faqModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className={`border rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-auto space-y-6 shadow-2xl animate-fadeIn ${
            theme === 'dark' ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            {/* Header do Modal de Dúvidas */}
            <div className="flex items-center justify-between border-b pb-4 border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">Principais Dúvidas dos Alunos</h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Respostas rápidas sobre certificação, provas, simulador e aula presencial.
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setFaqModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lista das 5 Dúvidas com Acordeão Interativo */}
            <div className="space-y-3">
              {studentFaqs.map((faq, idx) => {
                const isOpen = expandedFaq === idx;

                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isOpen
                        ? theme === 'dark'
                          ? 'bg-slate-950/90 border-teal-500/40'
                          : 'bg-teal-50/50 border-teal-300'
                        : theme === 'dark'
                        ? 'bg-slate-950/40 border-white/5 hover:border-white/10'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3"
                    >
                      <span className={`text-xs sm:text-sm font-bold ${
                        isOpen 
                          ? 'text-teal-400' 
                          : theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                      }`}>
                        {faq.q}
                      </span>
                      <ChevronRight className={`w-4 h-4 text-teal-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-90' : ''
                      }`} />
                    </button>

                    {isOpen && (
                      <div className={`px-4 pb-4 text-xs leading-relaxed border-t pt-3 ${
                        theme === 'dark' ? 'border-white/5 text-slate-300' : 'border-slate-200/80 text-slate-600'
                      }`}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Rodapé com Botão Direto para Contato de Suporte */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-white/10 gap-3 text-xs">
              <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
                Não encontrou o que procurava?
              </span>

              <div className="flex items-center gap-2">
                <a
                  href="mailto:uniaoservicosmedicos@gmail.com?subject=Duvida%20do%20Aluno%20USM"
                  className="px-4 py-2 rounded-xl border border-teal-500/30 text-teal-400 hover:bg-teal-500/10 font-bold transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Falar com Coordenação</span>
                </a>

                <button
                  type="button"
                  onClick={() => setFaqModalOpen(false)}
                  className="px-5 py-2 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-emerald-300 hover:brightness-110 shadow"
                >
                  Entendi
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

