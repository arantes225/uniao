import React from 'react';
import { PhoneCall } from 'lucide-react';

export const FloatingWhatsAppButton: React.FC = () => {
  const whatsappUrl = "https://wa.me/5561999638011?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20uma%20proposta%20de%20capacita%C3%A7%C3%A3o%20para%20minha%20institui%C3%A7%C3%A3o.";

  return (
    <aside aria-label="Contato Rápido WhatsApp" className="fixed bottom-6 right-6 z-50 group">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com a coordenação médica no WhatsApp"
        className="relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-[0_10px_25px_rgba(16,185,129,0.45)] hover:shadow-[0_15px_35px_rgba(16,185,129,0.6)] transition-all transform hover:-translate-y-1"
      >
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-950"></span>
        </span>
        <PhoneCall className="w-4 h-4 fill-slate-950" />
        <span className="hidden sm:inline">Solicitar Proposta no WhatsApp</span>
      </a>
    </aside>
  );
};
