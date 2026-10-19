import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sun, Moon, User, LogOut, ChevronDown, 
  ShieldCheck 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ProfileModal } from '../common/ProfileModal';
import { supabase } from '../../services/supabase/client';

interface StudentNavbarProps {
  studentName?: string;
  turma?: string;
}

export const StudentNavbar: React.FC<StudentNavbarProps> = ({ 
  studentName = 'Dr(a). Aluno(a) União',
  turma = 'Turma APH & Stop the Bleed'
}) => {
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    window.location.href = '/login';
  };

  return (
    <>
      <header className="sticky top-0 z-40 transition-colors duration-200 border-b bg-slate-900 border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand */}
          <Link to="/aluno/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
              <img 
                src="/brand/simbolo-cruz-uniao.png" 
                alt="USM" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(255,255,255,0.7)] group-hover:scale-105 transition-transform" 
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-wider text-white flex items-center gap-1">
                UNIÃO
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-uniao-500/20 text-uniao-400 border border-uniao-500/30">
                  LMS
                </span>
              </span>
              <span className="text-[9px] font-semibold text-slate-400 tracking-widest uppercase">
                Área de Aprendizagem
              </span>
            </div>
          </Link>

          {/* User Menu Trigger & Actions */}
          <div className="flex items-center gap-3">
            
            {/* Quick Toggle Theme Pill */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/5 transition-all"
              title={`Alternar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-uniao-300" />
              )}
            </button>

            {/* User Dropdown Trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 p-1.5 pl-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 transition-all text-left group"
              >
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-white group-hover:text-uniao-300 transition-colors">
                    {studentName}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {turma}
                  </div>
                </div>

                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-uniao-600 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xs shadow">
                  {studentName.charAt(0)}
                </div>

                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Lista de botões ao clicar no nome (REQUISITO SOLICITADO) */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl py-2 z-50 text-xs animate-fadeIn">
                  
                  {/* User info snippet */}
                  <div className="px-4 py-3 border-b border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                      Conectado como
                    </span>
                    <strong className="text-white font-semibold truncate block mt-0.5">
                      {studentName}
                    </strong>
                    <div className="flex items-center gap-1 text-[11px] text-uniao-400 mt-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Matrícula Regular</span>
                    </div>
                  </div>

                  {/* 1. Botão de Editar Dados do Perfil (Abre popup) */}
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      setProfileModalOpen(true);
                    }}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-2.5 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <User className="w-4 h-4 text-uniao-400" />
                    <span>Editar Dados de Perfil</span>
                  </button>

                  {/* 2. Botão de Trocar de Tema */}
                  <button
                    type="button"
                    onClick={() => {
                      toggleTheme();
                      setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left flex items-center justify-between text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      {theme === 'dark' ? (
                        <Sun className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Moon className="w-4 h-4 text-uniao-400" />
                      )}
                      <span>Alternar Tema</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 uppercase font-mono">
                      {theme === 'dark' ? 'Escuro' : 'Claro'}
                    </span>
                  </button>

                  <div className="my-1 border-t border-white/10" />

                  {/* 3. Botão de Sair */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors font-semibold"
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
        initialData={{
          name: studentName,
          cpf: '123.456.789-00',
          email: 'aluno@uniaoservicosmedicos.com.br'
        }}
      />
    </>
  );
};
