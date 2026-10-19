import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand info com o ícone branco puro em escala generosa */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 sm:w-14 sm:h-14 flex items-center justify-center shrink-0">
                <img 
                  src="/brand/simbolo-cruz-uniao.png" 
                  alt="União Serviços Médicos" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-tight text-white leading-none">
                  UNIÃO
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase mt-1">
                  Serviços Médicos
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Capacitação especializada em Atendimento Pré-Hospitalar, Controle de Hemorragias (Stop the Bleed) e Suporte Básico de Vida para organizações de alto desempenho.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-uniao-500" />
              <span>Ambiente institucional auditado e seguro</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navegação
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#inicio" className="hover:text-uniao-400 transition-colors">Início</a></li>
              <li><a href="#sobre" className="hover:text-uniao-400 transition-colors">Sobre nós</a></li>
              <li><a href="#cursos" className="hover:text-uniao-400 transition-colors">Cursos Oferecidos</a></li>
              <li><a href="#metodologia" className="hover:text-uniao-400 transition-colors">Metodologia</a></li>
              <li><a href="#instrutores" className="hover:text-uniao-400 transition-colors">Instrutores</a></li>
              <li><a href="#contato" className="hover:text-uniao-400 transition-colors">Solicitar Treinamento</a></li>
            </ul>
          </div>

          {/* Portal & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Acesso Acadêmico
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="flex items-center gap-1.5 text-uniao-400 hover:text-uniao-300 font-medium">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Área do Aluno (Login)</span>
                </Link>
              </li>
              <li>
                <Link to="/validar-certificado" className="hover:text-uniao-400 transition-colors">
                  Validar Certificado
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className="hover:text-uniao-400 transition-colors">
                  Política de Privacidade (LGPD)
                </Link>
              </li>
              <li>
                <Link to="/termos" className="hover:text-uniao-400 transition-colors">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} União Serviços Médicos. Todos os direitos reservados.</p>
          <p>Plataforma Institucional e Educacional Oficial — USM.</p>
        </div>

      </div>
    </footer>
  );
};
