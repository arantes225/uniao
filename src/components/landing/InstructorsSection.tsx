import React, { useEffect, useState } from 'react';
import { Download, ExternalLink, FileText, ShieldCheck, UserCheck } from 'lucide-react';
import { supabase } from '../../services/supabase/client';

type InstructorProfile = {
  id: string;
  display_name: string;
  role_title: string;
  biography: string;
  curriculum_pdf_path: string | null;
};

type InstructorWithLinks = InstructorProfile & {
  previewUrl: string | null;
  downloadUrl: string | null;
};

export const InstructorsSection: React.FC = () => {
  const [instructors, setInstructors] = useState<InstructorWithLinks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(false);
      const { data, error: queryError } = await supabase
        .from('instructor_profiles')
        .select('id,display_name,role_title,biography,curriculum_pdf_path')
        .eq('published', true)
        .order('position', { ascending: true })
        .order('display_name');

      if (cancelled) return;
      if (queryError) {
        setError(true);
        setLoading(false);
        return;
      }

      const rows = await Promise.all(((data || []) as InstructorProfile[]).map(async (profile) => {
        if (!profile.curriculum_pdf_path) {
          return { ...profile, previewUrl: null, downloadUrl: null };
        }
        const [preview, download] = await Promise.all([
          supabase.storage.from('instructor-curricula').createSignedUrl(profile.curriculum_pdf_path, 3600),
          supabase.storage.from('instructor-curricula').createSignedUrl(
            profile.curriculum_pdf_path, 3600,
            { download: `curriculo-${profile.display_name.trim().replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.pdf` },
          ),
        ]);
        return {
          ...profile,
          previewUrl: preview.error ? null : preview.data?.signedUrl || null,
          downloadUrl: download.error ? null : download.data?.signedUrl || null,
        };
      }));
      if (!cancelled) {
        setInstructors(rows);
        setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  return (
    <section id="instrutores" className="py-20 lg:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold tracking-widest text-uniao-600 uppercase bg-uniao-50 px-3.5 py-1.5 rounded-full border border-uniao-100">
            Corpo Docente
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Conheça nossos instrutores
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Conheça a experiência e a formação dos profissionais responsáveis pelos treinamentos.
          </p>
        </div>

        {loading ? (
          <p className="mt-12 text-center text-sm text-slate-500" role="status">Carregando instrutores…</p>
        ) : error ? (
          <p className="mt-12 text-center text-sm text-red-600" role="alert">
            Não foi possível carregar os currículos. Tente atualizar a página.
          </p>
        ) : instructors.length === 0 ? (
          <p className="mt-12 text-center text-sm text-slate-500">
            Os perfis dos instrutores serão publicados aqui em breve.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto">
            {instructors.map((instructor) => (
              <article key={instructor.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col items-center text-center hover:shadow-soft transition-all">
                <div className="w-20 h-20 rounded-full bg-uniao-100/70 border-2 border-uniao-200 flex items-center justify-center text-uniao-700 mb-5">
                  <UserCheck className="w-9 h-9" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{instructor.display_name}</h3>
                {instructor.role_title && (
                  <p className="text-sm text-uniao-700 font-semibold mt-1">{instructor.role_title}</p>
                )}
                {instructor.biography && (
                  <p className="text-sm text-slate-600 leading-relaxed mt-4 whitespace-pre-line">{instructor.biography}</p>
                )}
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-uniao-700 mt-5 mb-4">
                  <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Instrutor União Serviços Médicos</span>
                </div>
                {instructor.previewUrl ? (
                  <div className="mt-auto w-full flex flex-wrap justify-center gap-2">
                    <a href={instructor.previewUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-uniao-700 text-white px-4 py-2.5 text-xs font-bold hover:bg-uniao-800"
                      aria-label={`Abrir currículo em PDF de ${instructor.display_name}`}>
                      <FileText className="w-4 h-4" /> Ver currículo (PDF) <ExternalLink className="w-3 h-3" />
                    </a>
                    {instructor.downloadUrl && (
                      <a href={instructor.downloadUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-uniao-200 bg-white text-uniao-700 px-4 py-2.5 text-xs font-bold hover:bg-uniao-50"
                        aria-label={`Baixar currículo em PDF de ${instructor.display_name}`}>
                        <Download className="w-4 h-4" /> Baixar
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="mt-auto text-xs text-slate-500">Currículo em PDF indisponível no momento.</p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
