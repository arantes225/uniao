import React from 'react';
import { Outlet } from 'react-router-dom';
import { StudentSidebar } from './StudentSidebar';
import { StudentNavbar } from './StudentNavbar';
import { useTheme } from '../../context/ThemeContext';

export const StudentLayout: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Barra superior fixa de ponta a ponta (com logo completa União Serviços Médicos e perfil) */}
      <StudentNavbar 
        studentName="Dr. Lucas Arantes" 
        turma="Turma APH & Stop the Bleed — 2026" 
      />

      {/* Área Principal: Menu lateral que fica fixo/flutuante enquanto a página rola */}
      <div className="flex-1 flex min-w-0 relative">
        {/* Menu Lateral Acadêmico Fixo / Flutuante */}
        <div className="sticky top-16 h-[calc(100vh-4rem)] shrink-0 z-30">
          <StudentSidebar />
        </div>

        {/* Conteúdo Central com scroll natural */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
