import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Video, BookOpen, HelpCircle, 
  Stethoscope, Award, ChevronLeft, ChevronRight, 
  CalendarCheck, ShieldAlert
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../services/supabase/client';

interface StudentSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({ collapsed = false, onToggle }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { theme } = useTheme();

  // Verifica se o usuário autenticado atual possui perfil de administrador
  useEffect(() => {
    let isMounted = true;
    async function checkAdminStatus() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: staffData } = await supabase
          .from('platform_staff')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (isMounted && staffData && staffData.role === 'admin') {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error('Erro ao verificar perfil admin:', err);
      }
    }
    checkAdminStatus();
    return () => { isMounted = false; };
  }, []);

  const navigationItems = [
    {
      label: 'Dashboard / Trilha',
      path: '/aluno/dashboard',
      icon: LayoutDashboard,
      highlight: false,
    },
    {
      label: 'Aula Integrada',
      path: '/aluno/aula/aph-mod1-aula2',
      icon: Video,
      highlight: false,
      badge: 'Obrigatório'
    },
    {
      label: 'Materiais & Apostilas',
      path: '/aluno/materiais',
      icon: BookOpen,
      highlight: false,
    },
    {
      label: 'Biblioteca de Vídeos',
      path: '/aluno/videos',
      icon: Video,
      highlight: false,
    },
    {
      label: 'Prova',
      path: '/aluno/provas',
      icon: HelpCircle,
      highlight: false,
      badge: 'Obrigatório'
    },
    {
      label: 'Simulador Clínico',
      path: '/aluno/simulador',
      icon: Stethoscope,
      highlight: false,
    },
    {
      label: 'Presencial (Presença)',
      path: '/aluno/presencial',
      icon: CalendarCheck,
      highlight: false,
    },
    {
      label: 'Meus Certificados',
      path: '/aluno/certificados',
      icon: Award,
      highlight: false,
    },
  ];

  return (
    <aside
      className={`h-auto w-full flex flex-row border-t pb-[env(safe-area-inset-bottom)] md:h-full md:w-full md:flex-col md:shrink-0 md:border-t-0 md:border-r md:pb-0 transition-all duration-300 ${
        collapsed ? 'md:w-20' : 'md:w-64'
      } ${
        theme === 'dark' 
          ? 'bg-slate-900/95 border-white/10 text-slate-300' 
          : 'bg-white border-slate-200 text-slate-700'
      }`}
    >
      {/* Cabeçalho do menu lateral: oculto quando a navegação vira barra inferior. */}
      <div className={`hidden md:flex h-12 items-center border-b px-3 ${
        theme === 'dark' ? 'border-white/10' : 'border-slate-200 bg-slate-50/50'
      } ${
        collapsed ? 'justify-center' : 'justify-between'
      }`}>
        {!collapsed && (
          <span className={`text-[11px] font-black uppercase tracking-wider ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Navegação
          </span>
        )}

        {/* Toggle Button */}
        <button
          type="button"
          onClick={onToggle}
          className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
            theme === 'dark' 
              ? 'text-slate-400 hover:text-white hover:bg-white/5' 
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex flex-1 min-w-0 flex-row overflow-x-auto overflow-y-hidden p-1.5 space-x-1 md:block md:overflow-y-auto md:overflow-x-hidden md:space-x-0 md:space-y-1.5 md:p-3">
        <div className={`hidden md:block px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${
          theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
        }`}>
          {!collapsed ? 'Menu Acadêmico' : '•••'}
        </div>

        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex min-w-[68px] shrink-0 flex-col items-center justify-center gap-0.5 px-1.5 py-1.5 rounded-xl text-[9px] font-semibold transition-all group md:min-w-0 md:flex-row md:gap-3 md:px-3 md:py-2.5 md:text-xs ${
                  isActive
                    ? 'bg-uniao-600 text-white shadow-md shadow-uniao-600/30'
                    : item.highlight
                    ? theme === 'dark'
                      ? 'text-uniao-400 bg-uniao-500/10 hover:bg-uniao-500/20 border border-uniao-500/30'
                      : 'text-teal-700 bg-teal-50 hover:bg-teal-100/80 border border-teal-200 font-bold'
                    : theme === 'dark'
                    ? 'text-slate-400 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <span className="w-full truncate text-center md:flex-1 md:text-left">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className={`hidden md:inline text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                  item.highlight
                    ? 'bg-uniao-400 text-slate-950 font-black'
                    : theme === 'dark'
                    ? 'bg-white/10 text-slate-300'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Botão de Área do Admin: visível APENAS para administradores autenticados */}
      {isAdmin && (
        <div className={`hidden md:block p-3 border-t shrink-0 ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
          <Link
            to="/admin"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              theme === 'dark'
                ? 'text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30'
                : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200'
            }`}
            title={collapsed ? 'Área do Administrador' : undefined}
          >
            <ShieldAlert className="w-5 h-5 shrink-0 text-amber-500" />
            {!collapsed && <span>Área do Admin</span>}
          </Link>
        </div>
      )}
    </aside>
  );
};
