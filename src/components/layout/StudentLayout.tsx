import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { StudentSidebar } from './StudentSidebar';
import { StudentNavbar } from './StudentNavbar';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../services/supabase/client';

export const StudentLayout: React.FC = () => {
  const { theme } = useTheme();
  const [studentName, setStudentName] = useState('Aluno(a) União');

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

      {/* Área Principal: Menu lateral que fica fixo/flutuante enquanto a página rola */}
      <div className="flex-1 flex min-w-0 relative">
        {/* Menu Lateral Acadêmico Fixo / Flutuante */}
        <div className="sticky top-16 h-[calc(100vh-4rem)] shrink-0 z-30">
          <StudentSidebar />
        </div>

        {/* Conteúdo Central com scroll natural */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <Outlet context={{ studentName }} />
        </main>
      </div>
    </div>
  );
};
