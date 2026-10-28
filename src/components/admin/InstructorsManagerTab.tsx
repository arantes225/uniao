import React, { useCallback, useEffect, useState } from 'react';
import { Download, ExternalLink, FileText, Plus, RefreshCw, Save, Trash2, Upload } from 'lucide-react';
import { supabase } from '../../services/supabase/client';

const BUCKET = 'instructor-curricula';
const MAX_PDF_BYTES = 10 * 1024 * 1024;

interface Instructor {
  id: string;
  display_name: string;
  role_title: string;
  biography: string;
  curriculum_pdf_path: string | null;
  published: boolean;
  position: number;
}

type Draft = Pick<Instructor, 'display_name' | 'role_title' | 'biography' | 'published' | 'position'>;
const emptyDraft = (): Draft => ({
  display_name: '', role_title: '', biography: '', published: false, position: 0,
});

export const InstructorsManagerTab: React.FC = () => {
  const [profiles, setProfiles] = useState<Instructor[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadProfiles = useCallback(async () => {
    setLoading(true);
    const { data, error: queryError } = await supabase
      .from('instructor_profiles')
      .select('id,display_name,role_title,biography,curriculum_pdf_path,published,position')
      .order('position')
      .order('display_name');
    setLoading(false);
    if (queryError) {
      setError('Falha ao carregar instrutores. Verifique se a migração foi aplicada e se o MFA administrativo está ativo. ' + queryError.message);
      return;
    }
    setProfiles((data || []) as Instructor[]);
  }, []);

  useEffect(() => { void loadProfiles(); }, [loadProfiles]);

  const editProfile = (profile: Instructor) => {
    setEditingId(profile.id);
    setDraft({
      display_name: profile.display_name,
      role_title: profile.role_title,
      biography: profile.biography,
      published: profile.published,
      position: profile.position,
    });
    setSelectedPdf(null);
    setError('');
    setNotice('');
  };

  const newProfile = () => {
    setEditingId(null);
    setDraft(emptyDraft());
    setSelectedPdf(null);
    setError('');
    setNotice('');
  };

  const validatePdf = async (file: File) => {
    if (file.size === 0 || file.size > MAX_PDF_BYTES) {
      throw new Error('Escolha um arquivo PDF de até 10 MB.');
    }
    if (file.type && file.type !== 'application/pdf') {
      throw new Error('Somente arquivos PDF são permitidos.');
    }
    const signature = await file.slice(0, 5).text();
    if (signature !== '%PDF-') throw new Error('O arquivo selecionado não é um PDF válido.');
  };

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (saving) return;
    setError('');
    setNotice('');

    const name = draft.display_name.trim();
    const role = draft.role_title.trim();
    const biography = draft.biography.trim();
    const existing = profiles.find(profile => profile.id === editingId);
    if (name.length < 2 || name.length > 160) {
      setError('Informe um nome entre 2 e 160 caracteres.');
      return;
    }
    if (draft.published && !selectedPdf && !existing?.curriculum_pdf_path) {
      setError('Anexe o currículo em PDF antes de publicar este instrutor.');
      return;
    }

    setSaving(true);
    let uploadedPath: string | null = null;
    try {
      if (selectedPdf) await validatePdf(selectedPdf);
      const id = existing?.id || crypto.randomUUID();
      let pdfPath = existing?.curriculum_pdf_path || null;
      if (selectedPdf) {
        pdfPath = `instructors/${id}/${crypto.randomUUID()}.pdf`;
        const { error: uploadError } = await supabase.storage.from(BUCKET).upload(
          pdfPath, selectedPdf, { contentType: 'application/pdf', cacheControl: '3600', upsert: false },
        );
        if (uploadError) throw uploadError;
        uploadedPath = pdfPath;
      }

      const record = {
        id,
        display_name: name,
        role_title: role,
        biography,
        curriculum_pdf_path: pdfPath,
        published: draft.published,
        position: draft.position,
        updated_at: new Date().toISOString(),
      };
      const result = existing
        ? await supabase.from('instructor_profiles').update(record).eq('id', id).select('id').single()
        : await supabase.from('instructor_profiles').insert(record).select('id').single();

      if (result.error) throw result.error;
      // Só remova o PDF anterior depois de confirmar o registro no banco.
      if (existing?.curriculum_pdf_path && uploadedPath) {
        const { error: removalError } = await supabase.storage.from(BUCKET).remove([existing.curriculum_pdf_path]);
        if (removalError) console.warn('PDF anterior não removido:', removalError.message);
      }
      setSelectedPdf(null);
      setEditingId(id);
      setNotice('Instrutor e currículo salvos. A publicação respeita a opção selecionada.');
      await loadProfiles();
    } catch (caught) {
      if (uploadedPath) {
        await supabase.storage.from(BUCKET).remove([uploadedPath]);
      }
      setError(caught instanceof Error ? caught.message : 'Não foi possível salvar o currículo.');
    } finally {
      setSaving(false);
    }
  };

  const deleteProfile = async (profile: Instructor) => {
    if (!window.confirm(`Excluir o perfil de ${profile.display_name} e seu currículo PDF?`)) return;
    setError('');
    setNotice('');
    const { error: deleteError } = await supabase.from('instructor_profiles').delete().eq('id', profile.id);
    if (deleteError) {
      setError('Não foi possível excluir o instrutor: ' + deleteError.message);
      return;
    }
    if (profile.curriculum_pdf_path) {
      const { error: fileError } = await supabase.storage.from(BUCKET).remove([profile.curriculum_pdf_path]);
      if (fileError) console.warn('Não foi possível remover o PDF antigo:', fileError.message);
    }
    if (editingId === profile.id) newProfile();
    setNotice('Perfil excluído.');
    await loadProfiles();
  };

  const openPdf = async (path: string, name: string, download: boolean) => {
    // Abrir a aba no evento do clique evita o bloqueio de pop-up após o await.
    const tab = window.open('', '_blank');
    setError('');
    const safeName = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    const { data, error: signedError } = await supabase.storage.from(BUCKET).createSignedUrl(
      path, 120, download ? { download: `curriculo-${safeName}.pdf` } : undefined,
    );
    if (signedError || !data?.signedUrl) {
      tab?.close();
      setError('Não foi possível abrir o PDF. Confira as permissões do arquivo e tente novamente.');
      return;
    }
    if (tab) tab.location.replace(data.signedUrl);
    else window.location.assign(data.signedUrl);
  };

  const editingProfile = profiles.find(profile => profile.id === editingId);
  return (
    <section className="space-y-6 rounded-3xl border border-white/10 bg-slate-900 p-5 sm:p-8">
      <header className="flex flex-wrap gap-3 items-start justify-between border-b border-white/10 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white">Instrutores e currículos em PDF</h2>
          <p className="text-xs text-slate-400 mt-1">
            Cadastre o corpo docente, envie/substitua PDFs e publique os currículos na página inicial.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={newProfile}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-3 py-2 text-xs font-bold text-slate-950">
            <Plus className="h-4 w-4" /> Novo instrutor
          </button>
          <button type="button" onClick={() => void loadProfiles()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-300">
            <RefreshCw className="h-4 w-4" /> Atualizar
          </button>
        </div>
      </header>

      {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
      {notice && <p role="status" className="rounded-xl border border-teal-500/30 bg-teal-500/10 p-3 text-sm text-teal-300">{notice}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-6">
        <form onSubmit={saveProfile} className="space-y-4 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
          <h3 className="font-bold text-white text-sm">{editingProfile ? 'Editar instrutor' : 'Cadastrar instrutor'}</h3>
          <label className="block text-xs font-semibold text-slate-300">
            Nome completo
            <input required maxLength={160} value={draft.display_name}
              onChange={event => setDraft(previous => ({ ...previous, display_name: event.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-sm text-white" />
          </label>
          <label className="block text-xs font-semibold text-slate-300">
            Formação / função
            <input maxLength={240} value={draft.role_title}
              onChange={event => setDraft(previous => ({ ...previous, role_title: event.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-sm text-white" />
          </label>
          <label className="block text-xs font-semibold text-slate-300">
            Apresentação breve
            <textarea rows={4} maxLength={2000} value={draft.biography}
              onChange={event => setDraft(previous => ({ ...previous, biography: event.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-sm text-white" />
          </label>
          <label className="block text-xs font-semibold text-slate-300">
            Currículo em PDF
            <span className="mt-1.5 flex gap-2 items-center rounded-xl border border-dashed border-teal-500/40 bg-teal-500/5 p-3">
              <Upload className="w-5 h-5 shrink-0 text-teal-400" />
              <input type="file" accept=".pdf,application/pdf" key={editingId || 'new'}
                onChange={event => setSelectedPdf(event.target.files?.[0] || null)}
                className="w-full text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-500 file:px-3 file:py-2 file:font-bold file:text-slate-950" />
            </span>
            <span className="mt-1 block text-[11px] font-normal text-slate-400">
              Apenas PDF, até 10 MB. {editingProfile?.curriculum_pdf_path
                ? 'Já existe um PDF; selecionar outro irá substituí-lo.' : 'Envie um arquivo para habilitar a publicação.'}
            </span>
          </label>
          <label className="block text-xs text-slate-300">
            Ordem de exibição
            <input type="number" value={draft.position}
              onChange={event => setDraft(previous => ({ ...previous, position: Number(event.target.value) || 0 }))}
              className="mt-1.5 block w-28 rounded-xl border border-white/10 bg-slate-900 p-3 text-sm text-white" />
          </label>
          <label className="flex items-start gap-3 rounded-xl border border-white/10 p-3 text-sm text-slate-200">
            <input type="checkbox" checked={draft.published}
              onChange={event => setDraft(previous => ({ ...previous, published: event.target.checked }))}
              className="mt-1 accent-teal-400" />
            <span>Publicar o perfil e disponibilizar o currículo para visitantes.
              <span className="block text-xs text-slate-400 mt-1">Revise o PDF e remova dados pessoais que não devem ser públicos.</span>
            </span>
          </label>
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-uniao-500 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">
            <Save className="h-4 w-4" /> {saving ? 'Enviando e salvando…' : 'Salvar instrutor'}
          </button>
        </form>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">Instrutores cadastrados ({profiles.length})</h3>
          {loading ? <p className="text-xs text-slate-400">Carregando…</p>
            : profiles.length === 0 ? <p className="text-xs text-slate-400">Nenhum instrutor cadastrado.</p>
            : profiles.map(profile => (
              <div key={profile.id}
                className="rounded-xl border border-white/10 bg-slate-950/60 p-4 space-y-3">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div>
                    <p className="text-sm font-bold text-white">{profile.display_name}</p>
                    <p className="text-xs text-slate-400">{profile.role_title || 'Função não informada'}</p>
                  </div>
                  <span className={profile.published ? 'text-xs text-teal-300' : 'text-xs text-amber-300'}>
                    {profile.published ? 'Publicado' : 'Rascunho'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => editProfile(profile)}
                    className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-200">
                    Editar
                  </button>
                  {profile.curriculum_pdf_path && (
                    <>
                      <button type="button"
                        onClick={() => void openPdf(profile.curriculum_pdf_path!, profile.display_name, false)}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-xs text-teal-300">
                        <FileText className="h-3.5 w-3.5" /> Abrir PDF <ExternalLink className="h-3 w-3" />
                      </button>
                      <button type="button"
                        onClick={() => void openPdf(profile.curriculum_pdf_path!, profile.display_name, true)}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-xs text-teal-300">
                        <Download className="h-3.5 w-3.5" /> Baixar
                      </button>
                    </>
                  )}
                  <button type="button" onClick={() => void deleteProfile(profile)}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 px-3 py-2 text-xs text-red-300">
                    <Trash2 className="h-3.5 w-3.5" /> Excluir
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};
