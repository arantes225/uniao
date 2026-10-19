import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, GraduationCap } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Por que a USM', href: '#urgencia' },
    { label: 'Cursos & Prática', href: '#cursos' },
    { label: 'Fotos Reais', href: '#galeria' },
    { label: 'Para Quem É', href: '#publico' },
    { label: 'Método', href: '#metodologia' },
    { label: 'Contato', href: '#contato' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Nova Logomarca Oficial Integrada de Forma Limpa */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-9 h-9 flex items-center justify-center shrink-0">
              <img 
                src="/brand/simbolo-cruz-uniao.png" 
                alt="Cruz União Serviços Médicos" 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-wider text-white font-sans flex items-center gap-1.5 leading-none">
                UNIÃO
                <span className="w-1.5 h-1.5 rounded-full bg-uniao-400" />
              </span>
              <span className="text-[10px] font-bold tracking-[0.25em] text-slate-400 uppercase mt-1">
                Serviços Médicos
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative py-1 group"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-uniao-400 to-teal-300 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Action CTA: Área do Aluno com Design Moderno */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              to="/login"
              className="relative group overflow-hidden rounded-xl p-[1px] font-semibold text-xs transition-all shadow-lg hover:shadow-[0_0_25px_rgba(20,184,166,0.35)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-uniao-500 via-teal-400 to-uniao-600 rounded-xl" />
              <span className="relative flex items-center gap-2 px-5 py-2.5 rounded-[11px] bg-slate-950 text-white group-hover:bg-opacity-80 transition-all font-bold">
                <GraduationCap className="w-4 h-4 text-uniao-400" />
                <span>Área do Aluno</span>
                <ArrowRight className="w-3.5 h-3.5 text-uniao-400 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 border border-white/10"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-slate-950/95 backdrop-blur-2xl px-6 pt-3 pb-8 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-white/10">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-uniao-400 to-teal-300 shadow"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Acessar Plataforma</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
