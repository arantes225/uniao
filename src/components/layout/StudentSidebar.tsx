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
      label: 'Banco de Provas',
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
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
        <Link to="/aluno/dashboard" className="flex items-center gap-3.5 overflow-hidden">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center p-1 shrink-0">
            <img 
              src={theme === 'light' ? "/brand/simbolo-cruz-uniao-verde.png" : "/brand/simbolo-cruz-uniao.png"} 
              alt="USM" 
              className="w-full h-full object-contain" 
            />
          </div>
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className={`font-black text-base tracking-wider ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>UNIÃO</span>
              <span className="text-[10px] font-bold text-uniao-500 tracking-widest uppercase">LMS Educacional</span>
            </div>
          )}
        </Link>

        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors hidden sm:flex items-center justify-center"
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
        <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
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
                    ? 'text-uniao-400 bg-uniao-500/10 hover:bg-uniao-500/20 border border-uniao-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
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
                    : 'bg-white/10 text-slate-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Admin Quick Shortcut */}
      <div className="p-3 border-t border-white/10">
        <Link
          to="/admin"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          title={collapsed ? 'Acesso Administrativo' : undefined}
        >
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400" />
          {!collapsed && <span>Acesso Admin</span>}
        </Link>
      </div>
    </aside>
  );
};
