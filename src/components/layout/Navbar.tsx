import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, GraduationCap, House, Images, Mail,
  MoreHorizontal, ShieldAlert, ShieldCheck, Users, X,
} from 'lucide-react';

const navLinks = [
  { label: 'Por que a USM', id: 'urgencia' },
  { label: 'Cursos & Prática', id: 'metodologia' },
  { label: 'Fotos Reais', id: 'galeria' },
  { label: 'Para Quem É', id: 'publico' },
  { label: 'Método', id: 'metodologia' },
  { label: 'Contato', id: 'contato' },
];

export const Navbar: React.FC = () => {
  const [moreOpen, setMoreOpen] = useState(false);

  const goToSection = (id: string) => {
    setMoreOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const mobileTabClass = 'flex min-h-[54px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-0.5 py-1 text-[10px] font-semibold text-slate-300 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-uniao-400';

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-4 group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0">
                <img
                  src="./brand/simbolo-cruz-uniao.png"
                  alt="Cruz União Serviços Médicos"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-wider text-white font-sans flex items-center gap-1 leading-none">
                  UNIÃO
                </span>
                <span className="text-[9px] font-bold tracking-[0.2em] text-slate-300 uppercase mt-1">
                  Serviços Médicos
                </span>
              </div>
            </Link>

            <nav aria-label="Navegação institucional" className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.label}
                  onClick={() => goToSection(link.id)}
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative py-1 group"
                >
                  <span>{link.label}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-uniao-400 to-teal-300 group-hover:w-full transition-all duration-300" />
                </button>
              ))}
              <Link
                to="/validar-certificado"
                className="text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/30 hover:bg-teal-500/20"
              >
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Validar Certificado</span>
              </Link>
            </nav>

            <Link
              to="/login"
              aria-label="Acessar a Área do Aluno"
              className="relative group overflow-hidden rounded-xl p-[1px] font-semibold text-xs transition-all shadow-lg hover:shadow-[0_0_25px_rgba(20,184,166,0.35)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-uniao-500 via-teal-400 to-uniao-600 rounded-xl" />
              <span className="relative flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-[11px] bg-slate-950 text-white group-hover:bg-opacity-80 transition-all font-bold">
                <GraduationCap className="w-4 h-4 text-uniao-400" />
                <span className="hidden sm:inline">Área do Aluno</span>
                <ArrowRight className="hidden sm:block w-3.5 h-3.5 text-uniao-400 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </header>

      <nav
        aria-label="Menu inferior do site institucional"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-slate-900/95 px-2 pt-2 text-white shadow-[0_-10px_35px_rgba(0,0,0,0.22)] backdrop-blur-xl lg:hidden"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        {moreOpen && (
          <div
            id="menu-publico-mais"
            className="absolute inset-x-3 bottom-full mb-3 rounded-2xl border border-white/10 bg-slate-900 p-3 shadow-2xl"
          >
            <div className="flex items-center justify-between px-1 pb-3">
              <span className="text-xs font-bold uppercase tracking-wide">Explorar o site</span>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                aria-label="Fechar mais opções"
                className="rounded-lg p-1.5 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Fotos reais', id: 'galeria', icon: Images },
                { label: 'Para quem é', id: 'publico', icon: Users },
                { label: 'Sobre a União', id: 'sobre', icon: ShieldAlert },
                { label: 'Instrutores', id: 'instrutores', icon: Users },
              ].map(({ label, id, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => goToSection(id)}
                  className="flex min-h-[54px] items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-left text-xs font-semibold text-slate-200 hover:bg-white/10"
                >
                  <Icon className="h-5 w-5 shrink-0 text-uniao-400" />
                  <span>{label}</span>
                </button>
              ))}
              <Link
                to="/validar-certificado"
                onClick={() => setMoreOpen(false)}
                className="flex min-h-[54px] items-center gap-2 rounded-xl bg-teal-500/10 px-3 py-2 text-xs font-semibold text-teal-300"
              >
                <ShieldCheck className="h-5 w-5 shrink-0" />
                <span>Validar certificado</span>
              </Link>
              <Link
                to="/login"
                onClick={() => setMoreOpen(false)}
                className="flex min-h-[54px] items-center gap-2 rounded-xl bg-uniao-600/20 px-3 py-2 text-xs font-semibold text-uniao-300"
              >
                <GraduationCap className="h-5 w-5 shrink-0" />
                <span>Área do aluno</span>
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-5 gap-1">
          <button type="button" onClick={() => goToSection('inicio')} className={mobileTabClass}>
            <House className="h-5 w-5" aria-hidden="true" />
            <span>Início</span>
          </button>
          <button type="button" onClick={() => goToSection('urgencia')} className={mobileTabClass}>
            <ShieldAlert className="h-5 w-5" aria-hidden="true" />
            <span>Proteção</span>
          </button>
          <button type="button" onClick={() => goToSection('metodologia')} className={mobileTabClass}>
            <BookOpen className="h-5 w-5" aria-hidden="true" />
            <span>Método</span>
          </button>
          <button type="button" onClick={() => goToSection('contato')} className={mobileTabClass}>
            <Mail className="h-5 w-5" aria-hidden="true" />
            <span>Contato</span>
          </button>
          <button
            type="button"
            onClick={() => setMoreOpen(open => !open)}
            aria-expanded={moreOpen}
            aria-controls="menu-publico-mais"
            className={moreOpen ? mobileTabClass + ' bg-uniao-600 text-white' : mobileTabClass}
          >
            <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
            <span>Mais</span>
          </button>
        </div>
      </nav>
    </>
  );
};
