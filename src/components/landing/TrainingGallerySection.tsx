import React, { useEffect, useState } from 'react';
import { Camera, ShieldCheck } from 'lucide-react';
import { supabase } from '../../services/supabase/client';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  description: string;
}

export const TrainingGallerySection: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);

  const placeholderImages: GalleryItem[] = [
    {
      id: 'demo-1',
      title: 'Prática de RCP com Manequins de Feedback',
      category: 'Suporte Básico de Vida',
      image_url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      description: 'Compressões torácicas profundas e uso do DEA por equipe capacitada.'
    },
    {
      id: 'demo-2',
      title: 'Aplicação Rápida de Torniquetes de Extremidade',
      category: 'Stop the Bleed',
      image_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      description: 'Controle de hemorragias com contenção em menos de 60 segundos.'
    },
    {
      id: 'demo-3',
      title: 'Simulação de Emergência Pediátrica em Escola',
      category: 'Lei Lucas',
      image_url: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80',
      description: 'Manobras de desengasgo (Heimlich) e resposta ágil para professores.'
    },
    {
      id: 'demo-4',
      title: 'Imobilização Alinhada e Pranchamento em Trauma',
      category: 'APH Tático',
      image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      description: 'Técnicas de restrição de movimento da coluna e extração segura.'
    }
  ];

  useEffect(() => {
    async function fetchGallery() {
      try {
        const { data, error } = await supabase
          .from('training_gallery')
          .select('*')
          .order('position', { ascending: true });

        if (!error && data && data.length > 0) {
          setItems(data);
        } else {
          setItems(placeholderImages);
        }
      } catch (err) {
        setItems(placeholderImages);
      }
    }
    fetchGallery();
  }, []);

  return (
    <section id="galeria" className="py-24 lg:py-32 bg-slate-950 text-white relative border-t border-white/5 overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-uniao-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div data-reveal="fade-down" className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-uniao-500/10 border border-uniao-500/30 text-uniao-400 text-xs font-bold uppercase tracking-wider">
            <Camera className="w-4 h-4" />
            <span>Treinamento Real em Campo</span>
          </div>

          <h2 data-reveal="fade-up" className="text-3xl sm:text-5xl font-black tracking-tight font-sans text-white">
            Imersão, técnica e prática sem filtros.
          </h2>

          <p data-reveal="fade-up" className="text-base sm:text-lg text-slate-400 leading-relaxed font-light">
            Não ensinamos com palestras cansativas. Ensinamos com as mãos na massa, equipamentos de verdade e simulações realistas que preparam o reflexo de quem socorre.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <div 
              key={item.id || idx}
              data-reveal="fade-up"
              data-reveal-delay={`${idx * 120}`}
              className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-white/10 hover:border-uniao-500/60 shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(20,184,166,0.2)]"
            >
              {/* Image Frame */}
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-800 relative">
                <img 
                  src={item.image_url} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                
                <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-uniao-300 border border-uniao-500/40">
                  {item.category}
                </span>
              </div>

              {/* Caption & Description */}
              <div className="p-5 space-y-2">
                <h3 className="text-base font-bold text-white group-hover:text-uniao-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Bottom Subtle Indicator */}
              <div className="px-5 pb-4 pt-1 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 font-medium text-uniao-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>USM Prático</span>
                </span>
                <span className="text-slate-600">Registro Real</span>
              </div>

            </div>
          ))}
        </div>

        {/* Callout para Upload de Fotos */}
        <div className="mt-12 text-center">
          <p className="text-xs text-slate-500">
            * Fotos oficiais de turmas e capacitações corporativas. Novas fotos podem ser gerenciadas diretamente pelo painel administrativo.
          </p>
        </div>

      </div>
    </section>
  );
};
