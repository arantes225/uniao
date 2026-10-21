import React, { useState } from 'react';
import { PlayCircle, Video, Clock, Search } from 'lucide-react';
import { INITIAL_40_MODULES } from '../../data/curriculumData';
import { useTheme } from '../../context/ThemeContext';

export const VideosPage: React.FC = () => {
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const [playing, setPlaying] = useState<string | null>(null);
  const videos = INITIAL_40_MODULES.filter(module =>
    `${module.code} ${module.title} ${module.description}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-uniao-400 flex items-center gap-2"><Video className="w-4 h-4" /> Biblioteca de Vídeos</span>
          <h1 className={`text-2xl sm:text-3xl font-black mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Reveja suas videoaulas</h1>
          <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Aulas organizadas para você assistir novamente quando quiser.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar videoaula" className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs ${theme === 'dark' ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map(module => (
          <article key={module.code} className={`rounded-2xl border overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="aspect-video bg-slate-950 flex items-center justify-center relative">
              {playing === module.code && module.videoUrl ? <iframe src={module.videoUrl} title={`Videoaula ${module.title}`} className="w-full h-full" allow="autoplay; fullscreen" /> : <button type="button" onClick={() => setPlaying(module.code)} className="w-14 h-14 rounded-full bg-teal-400 text-slate-950 flex items-center justify-center hover:scale-105 transition-transform" aria-label={`Reproduzir ${module.title}`}><PlayCircle className="w-7 h-7" /></button>}
              <span className="absolute left-3 bottom-3 text-[10px] font-bold px-2 py-1 rounded-md bg-black/60 text-white flex items-center gap-1"><Clock className="w-3 h-3" /> {module.videoDuration || 'Aula gravada'}</span>
            </div>
            <div className="p-5 space-y-2"><span className="text-[10px] font-bold text-teal-500">{module.code}</span><h2 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{module.title}</h2><p className="text-xs text-slate-500 line-clamp-2">{module.description}</p></div>
          </article>
        ))}
      </div>
    </div>
  );
};
