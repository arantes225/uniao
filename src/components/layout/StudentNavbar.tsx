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
      <header className={`sticky top-0 z-40 transition-colors duration-200 border-b w-full shadow-sm ${
        theme === 'dark' 
          ? 'bg-slate-900 border-white/10 text-white' 
          : 'bg-white border-slate-200 text-slate-800 shadow-slate-100'
      }`}>
        <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Brand - UNIÃO SERVIÇOS MÉDICOS alinhado à esquerda */}
          <Link to="/aluno/dashboard" className="flex items-center gap-3.5 group text-left">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center p-1 shrink-0 ${
              theme === 'dark' ? 'bg-slate-950/60' : 'bg-slate-50 border border-slate-200/80 shadow-xs'
            }`}>
              <img 
                src={theme === 'light' ? "/brand/simbolo-cruz-uniao-verde.png" : "/brand/simbolo-cruz-uniao.png"} 
                alt="União Serviços Médicos" 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className={`font-black text-base tracking-wider ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  UNIÃO
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                  theme === 'dark' 
                    ? 'bg-uniao-500/20 text-uniao-400 border-uniao-500/30' 
                    : 'bg-teal-50 text-teal-800 border-teal-200'
                }`}>
                  LMS
                </span>
              </div>
              <span className={`text-[10px] font-extrabold tracking-widest uppercase ${
                theme === 'dark' ? 'text-slate-400' : 'text-teal-700'
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

                  {/* 2. Botão de Trocar de Tema */}
                  <button
                    type="button"
                    onClick={() => {
                      toggleTheme();
                      setDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left flex items-center justify-between transition-colors ${
                      theme === 'dark'
                        ? 'text-slate-300 hover:text-white hover:bg-white/5'
                        : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {theme === 'dark' ? (
                        <Sun className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Moon className="w-4 h-4 text-teal-600" />
                      )}
                      <span>Alternar Tema</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-mono ${
                      theme === 'dark' ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {theme === 'dark' ? 'Escuro' : 'Claro'}
                    </span>
                  </button>

                  <div className={`my-1 border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-100'}`} />

                  {/* 3. Botão de Sair */}
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
        initialData={{
          name: studentName,
          cpf: '123.456.789-00',
          email: 'aluno@uniaoservicosmedicos.com.br'
        }}
      />
    </>
  );
};
