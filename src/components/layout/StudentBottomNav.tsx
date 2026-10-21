import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Award, BookOpen, CalendarCheck, HelpCircle, LayoutDashboard,
  MoreHorizontal, ShieldAlert, Stethoscope, Video, X,
} from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../services/supabase/client';

const primaryItems = [
  { label: 'Início', path: '/aluno/dashboard', icon: LayoutDashboard },
  { label: 'Aulas', path: '/aluno/aula/aph-mod1-aula2', icon: Video },
  { label: 'Materiais', path: '/aluno/materiais', icon: BookOpen },
  { label: 'Provas', path: '/aluno/provas', icon: HelpCircle },
  { label: 'Simulador', path: '/aluno/simulador', icon: Stethoscope },
];

const extraItems = [
  { label: 'Biblioteca de vídeos', path: '/aluno/videos', icon: Video },
  { label: 'Presença', path: '/aluno/presencial', icon: CalendarCheck },
  { label: 'Certificados', path: '/aluno/certificados', icon: Award },
];

export const StudentBottomNav: React.FC<{ initialLessonCode?: string }> = ({ initialLessonCode }) => {
  const { theme } = useTheme();
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const dark = theme === 'dark';
  const currentPrimaryItems = primaryItems.map(item => item.label === 'Aulas' ? { ...item, path: initialLessonCode ? `/aluno/aula/${initialLessonCode}` : '/aluno/dashboard' } : item);

  useEffect(() => {
    let mounted = true;

    const checkAdmin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
          .from('platform_staff')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();
        if (mounted) setIsAdmin(data?.role === 'admin');
      } catch (error) {
        console.error('Não foi possível verificar o acesso administrativo:', error);
      }
    };

    void checkAdmin();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    setMoreOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!moreOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setMoreOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMoreOpen(false);
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [moreOpen]);

  const isExtraActive = extraItems.some(({ path }) => location.pathname === path)
    || location.pathname === '/aluno/frequencia';

  const itemClass = (active: boolean) => clsx(
    'min-w-0 min-h-[54px] flex flex-col items-center justify-center gap-1 rounded-xl px-0.5 py-1',
    'text-[9px] font-semibold leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-uniao-400',
    active
      ? 'bg-uniao-600 text-white'
      : dark
        ? 'text-slate-300 hover:bg-white/10'
        : 'text-slate-600 hover:bg-slate-100',
  );

  return (
    <nav
      ref={navRef}
      aria-label="Navegação inferior da área do aluno"
      className={clsx(
        'fixed inset-x-0 bottom-0 z-50 border-t px-2 pt-2 shadow-[0_-10px_35px_rgba(0,0,0,0.16)] backdrop-blur-xl md:hidden',
        dark ? 'border-white/10 bg-slate-900/95' : 'border-slate-200 bg-white/95',
      )}
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      {moreOpen && (
        <div
          id="menu-inferior-mais"
          className={clsx(
            'absolute inset-x-3 bottom-full mb-3 rounded-2xl border p-3 shadow-2xl',
            dark ? 'border-slate-700 bg-slate-900 text-slate-100' : 'border-slate-200 bg-white text-slate-900',
          )}
        >
          <div className="flex items-center justify-between px-1 pb-3">
            <span className="text-xs font-bold uppercase tracking-wide">Mais opções</span>
            <button
              type="button"
              onClick={() => setMoreOpen(false)}
              aria-label="Fechar mais opções"
              className="rounded-lg p-1.5 hover:bg-slate-500/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {extraItems.map(({ label, path, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMoreOpen(false)}
                className={clsx(
                  'flex min-h-[56px] items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold',
                  location.pathname === path
                    ? 'bg-uniao-600 text-white'
                    : dark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200',
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{label}</span>
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMoreOpen(false)}
                className="flex min-h-[56px] items-center gap-2 rounded-xl bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-600"
              >
                <ShieldAlert className="h-5 w-5 shrink-0" />
                <span>Área do Admin</span>
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-6 gap-1">
        {currentPrimaryItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={() => setMoreOpen(false)}
            className={({ isActive }) => itemClass(
              path.startsWith('/aluno/aula/')
                ? location.pathname.startsWith('/aluno/aula/')
                : isActive,
            )}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="truncate max-w-full">{label}</span>
          </NavLink>
        ))}
        <button
          type="button"
          onClick={() => setMoreOpen(open => !open)}
          aria-expanded={moreOpen}
          aria-controls="menu-inferior-mais"
          className={itemClass(moreOpen || isExtraActive)}
        >
          <MoreHorizontal className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span>Mais</span>
        </button>
      </div>
    </nav>
  );
};
