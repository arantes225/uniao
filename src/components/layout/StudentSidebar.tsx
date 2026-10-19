import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Video, BookOpen, HelpCircle, 
  Stethoscope, Award, ChevronLeft, ChevronRight, 
  CalendarCheck, ShieldAlert
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface StudentSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();

  const navigationItems = [
    {
      label: 'Dashboard / Trilha',
      path: '/aluno/dashboard',
      icon: LayoutDashboard,
      badge: 'Principal'
    },
    {
      label: 'Aula Integrada',
      path: '/aluno/aula/aph-mod1-aula2',
      icon: Video,
      badge: 'Em curso'
    },
    {
      label: 'Materiais & Apostilas',
      path: '/aluno/materiais',
      icon: BookOpen,
      badge: 'PDF'
    },
    {
      label: 'Biblioteca de Vídeos',
      path: '/aluno/videos',
      icon: Video,
    },
    {
      label: 'Prova',
      path: '/aluno/provas',
      icon: HelpCircle,
      badge: 'Obrigatório'
    },
    {
      label: 'Simulador Clínico',
      path: '/aluno/simulador',
      icon: Stethoscope,
      badge: 'Pré-Requisito',
      highlight: true
    },
    {
      label: 'Presença Presencial',
      path: '/aluno/frequencia',
      icon: CalendarCheck,
    },
    {
      label: 'Meus Certificados',
      path: '/aluno/certificados',
      icon: Award,
    },
  ];

  return (
    <aside
      className={`relative flex flex-col shrink-0 border-r transition-all duration-300 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      } ${
        theme === 'dark' 
          ? 'bg-slate-900/95 border-white/10 text-slate-300' 
          : 'bg-white border-slate-200 text-slate-700'
      }`}
    >
      {/* Header do Menu Lateral (Apenas controle de recolher/expandir) */}
      <div className={`h-12 flex items-center border-b px-3 ${
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
          onClick={() => setCollapsed(!collapsed)}
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
      <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
        <div className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${
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
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
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
                <span className="truncate flex-1">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
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

      {/* Admin Quick Shortcut */}
      <div className={`p-3 border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
        <Link
          to="/admin"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
            theme === 'dark'
              ? 'text-slate-400 hover:text-white hover:bg-white/5'
              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
          }`}
          title={collapsed ? 'Acesso Administrativo' : undefined}
        >
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-500" />
          {!collapsed && <span>Acesso Admin</span>}
        </Link>
      </div>
    </aside>
  );
};
