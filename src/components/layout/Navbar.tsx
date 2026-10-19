import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, GraduationCap } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Sobre nós', href: '#sobre' },
    { label: 'Cursos', href: '#cursos' },
    { label: 'Para quem é', href: '#publico' },
    { label: 'Metodologia', href: '#metodologia' },
    { label: 'Instrutores', href: '#instrutores' },
    { label: 'Contato', href: '#contato' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-slate-200/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logomarca Oficial */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center p-2 group-hover:border-uniao-500/30 transition-all">
              <img 
                src="/brand/logo-uniao.png" 
                alt="União Serviços Médicos" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-uniao-700 transition-colors">
                UNIÃO
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-uniao-600 uppercase">
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
                className="text-sm font-medium text-slate-600 hover:text-uniao-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTA: Área do Aluno */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-uniao-600 hover:bg-uniao-700 shadow-sm hover:shadow transition-all duration-200"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Área do Aluno</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-uniao-700 hover:bg-uniao-50 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-slate-100">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-base font-semibold text-white bg-uniao-600 hover:bg-uniao-700 shadow"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Acessar Área do Aluno</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
