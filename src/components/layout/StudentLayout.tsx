import React from 'react';
import { Outlet } from 'react-router-dom';
import { StudentSidebar } from './StudentSidebar';
import { StudentNavbar } from './StudentNavbar';
import { useTheme } from '../../context/ThemeContext';

export const StudentLayout: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Menu Lateral Acadêmico Completo */}
      <StudentSidebar />

      {/* Conteúdo Central */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <StudentNavbar 
          studentName="Dr. Lucas Arantes" 
          turma="Turma APH & Stop the Bleed — 2026" 
        />
        
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
