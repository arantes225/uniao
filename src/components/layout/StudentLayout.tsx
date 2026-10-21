import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { StudentSidebar } from './StudentSidebar';
import { StudentBottomNav } from './StudentBottomNav';
import { StudentNavbar } from './StudentNavbar';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../services/supabase/client';

export const StudentLayout: React.FC = () => {
  const { theme } = useTheme();
  const [studentName, setStudentName] = useState('Aluno(a) União');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return;
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.id)
        .maybeSingle();
      if (profileError) {
        console.error('Falha ao carregar o perfil:', profileError);
        return;
      }
      if (mounted) setStudentName(profile?.full_name?.trim() || 'Aluno(a) União');

      // Sincroniza o e-mail oficial após confirmação no Supabase Auth.
      if (user.email && profile && profile.email !== user.email) {
        const { error: syncError } = await supabase
          .from('profiles')
          .update({ email: user.email })
          .eq('id', user.id);
        if (syncError) console.error('Falha ao sincronizar e-mail:', syncError);
      }
    };
    void loadProfile();
    return () => { mounted = false; };
  }, []);

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Barra superior fixa de ponta a ponta (com logo completa União Serviços Médicos e perfil) */}
      <StudentNavbar 
        studentName={studentName}
        onProfileUpdated={setStudentName} 
        turma="Turma APH & Stop the Bleed — 2026" 
      />

      {/* Área principal: lateral no desktop e barra inferior fixa no mobile */}
      <div className="flex-1 flex min-w-0 relative">
        <div className={`hidden md:block md:shrink-0 ${sidebarCollapsed ? 'md:w-20' : 'md:w-64'}`}>
          <div className={`fixed left-0 top-16 bottom-0 z-30 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
            <StudentSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(prev => !prev)} />
          </div>
        </div>

        {/* Espaço inferior evita que a barra móvel cubra o conteúdo. */}
        <main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0">
          <Outlet context={{ studentName }} />
        </main>
      </div>
      <StudentBottomNav />
    </div>
  );
};
