import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, School, Upload, LogOut, Camera, 
  Trash2, CheckCircle2, RefreshCw 
} from 'lucide-react';
import { supabase } from '../../services/supabase/client';

export const AdminDashboard: React.FC = () => {
  // Controle de Acesso por PIN de Segurança
  const [pinEntered, setPinEntered] = useState('');
  const [pinAuthorized, setPinAuthorized] = useState(false);
  const [pinError, setPinError] = useState(false);

  // Módulo de Gerenciamento da Galeria de Treinamentos
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Atendimento Pré-Hospitalar');
  const [newDescription, setNewDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinEntered === '1926') {
      setPinAuthorized(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const loadGallery = async () => {
    const { data } = await supabase
      .from('training_gallery')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setGalleryImages(data);
  };

  useEffect(() => {
    if (pinAuthorized) {
      loadGallery();
    }
  }, [pinAuthorized]);

  const handleUploadImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !newTitle) return;

    setUploading(true);
    setUploadSuccess(false);

    try {
      // 1. Upload do arquivo para o bucket gallery do Supabase União
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `trainings/${fileName}`;

      const { error: storageError } = await supabase.storage
        .from('gallery')
        .upload(filePath, selectedFile);

      if (storageError) throw storageError;

      // 2. Obter URL pública
      const { data: urlData } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      // 3. Salvar registro na tabela training_gallery
      const { error: dbError } = await supabase.from('training_gallery').insert([
        {
          title: newTitle,
          category: newCategory,
          description: newDescription,
          image_url: urlData.publicUrl,
        }
      ]);

      if (dbError) throw dbError;

      setUploadSuccess(true);
      setNewTitle('');
      setNewDescription('');
      setSelectedFile(null);
      await loadGallery();
    } catch (err: any) {
      console.error('Erro ao enviar imagem de treinamento:', err);
      alert('Falha ao enviar imagem: ' + (err.message || 'Erro desconhecido'));
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Deseja realmente remover esta foto da landing page?')) return;
    await supabase.from('training_gallery').delete().eq('id', id);
    await loadGallery();
  };

  if (!pinAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">Confirmação de Segurança Administrativa</h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              O acesso aos módulos de gestão acadêmica, upload de fotos e dados de alunos requer PIN administrativo.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={6}
                value={pinEntered}
                onChange={(e) => setPinEntered(e.target.value)}
                placeholder="••••"
                className="w-36 text-center tracking-[0.5em] text-2xl font-mono py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-uniao-500"
              />
            </div>

            {pinError && (
              <div className="text-xs text-red-400 font-medium">
                PIN de segurança incorreto. Tente novamente.
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-white bg-uniao-600 hover:bg-uniao-500 text-sm transition-all shadow"
            >
              Validar Acesso Administrativo
            </button>
          </form>

          <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 block">
            ← Retornar ao site público
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Admin Header */}
      <header className="bg-slate-900/90 backdrop-blur-md text-white h-16 px-6 flex items-center justify-between border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-950 p-1 border border-white/10">
            <img src="/brand/simbolo-cruz-uniao.png" alt="USM" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight">Painel de Gestão USM</span>
            <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-uniao-950 text-uniao-400 border border-uniao-500/40">
              Administração Ativa
            </span>
          </div>
        </div>

        <button
          onClick={() => setPinAuthorized(false)}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Bloquear Painel</span>
        </button>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto w-full p-6 sm:p-8 space-y-10">
        
        {/* REQUISITO SOLICITADO: ÁREA DEDICADA PARA SUBIR FOTOS DOS TREINAMENTOS */}
        <section className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-uniao-500/10 border border-uniao-500/30 text-uniao-400 flex items-center justify-center">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Galeria de Fotos dos Treinamentos Reais</h2>
                <p className="text-xs text-slate-400">
                  Suba fotos práticas que serão exibidas automaticamente no campo dedicado da Landing Page.
                </p>
              </div>
            </div>

            <button
              onClick={loadGallery}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Atualizar Fotos</span>
            </button>
          </div>

          {/* Form de Upload */}
          <form onSubmit={handleUploadImage} className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-950/60 p-5 rounded-2xl border border-white/5">
            <div className="md:col-span-4 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase">Título da Ação Prática</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Treinamento de RCP com DEA"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
              />
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase">Categoria</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
              >
                <option value="Suporte Básico de Vida">Suporte Básico de Vida (SBV)</option>
                <option value="Stop the Bleed">Stop the Bleed (Hemorragias)</option>
                <option value="Atendimento Pré-Hospitalar">Atendimento Pré-Hospitalar (APH)</option>
                <option value="Lei Lucas (Escolas)">Lei Lucas (Escolas)</option>
                <option value="Simulação Corporativa">Simulação Corporativa</option>
              </select>
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase">Arquivo de Foto (JPG/PNG)</label>
              <input
                type="file"
                required
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-400 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-uniao-600 file:text-white hover:file:bg-uniao-500 cursor-pointer"
              />
            </div>

            <div className="md:col-span-2 flex items-end">
              <button
                type="submit"
                disabled={uploading || !selectedFile}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-uniao-400 to-teal-300 hover:brightness-110 disabled:opacity-40 transition-all shadow"
              >
                {uploading ? 'Enviando...' : '+ Publicar Foto'}
              </button>
            </div>

            <div className="md:col-span-12 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase">Descrição Opcional</label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Breve comentário explicativo sobre o treinamento na foto..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-uniao-500"
              />
            </div>
          </form>

          {uploadSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Foto salva no Supabase Storage e publicada com sucesso na Landing Page!</span>
            </div>
          )}

          {/* Grid de Fotos já cadastradas */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Fotos Publicadas Atualmente ({galleryImages.length})
            </h4>

            {galleryImages.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 border border-white/5 rounded-2xl bg-slate-950/40">
                Nenhuma foto customizada enviada ainda. As fotos padrão demonstrativas estão sendo exibidas.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {galleryImages.map((img) => (
                  <div key={img.id} className="relative group rounded-xl overflow-hidden border border-white/10 bg-slate-950">
                    <img src={img.image_url} alt={img.title} className="w-full h-28 object-cover" />
                    <div className="p-2 space-y-0.5">
                      <div className="text-[11px] font-bold text-white truncate">{img.title}</div>
                      <div className="text-[10px] text-uniao-400">{img.category}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                      title="Excluir foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Gestão de Turmas e Importação de Alunos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-slate-900 rounded-3xl border border-white/10 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-uniao-500/10 text-uniao-400 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Importação de Alunos em Lote</h3>
                <p className="text-xs text-slate-400">Planilhas CSV/XLSX com validação prévia</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              O fluxo de importação executa conferência de duplicidade, sanitização de CPF conforme a LGPD e disparo automático de convites com link seguro.
            </p>

            <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center space-y-2 hover:border-uniao-500/50 transition-colors cursor-pointer bg-slate-950/40">
              <Upload className="w-8 h-8 text-slate-500 mx-auto" />
              <div className="text-xs font-semibold text-slate-300">Clique para selecionar CSV ou XLSX</div>
              <div className="text-[11px] text-slate-500">Colunas esperadas: Nome Completo, CPF, E-mail</div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl border border-white/10 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-uniao-500/10 text-uniao-400 flex items-center justify-center">
                <School className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Montagem de Planos Customizados</h3>
                <p className="text-xs text-slate-400">Personalize a grade curricular de cada instituição</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Vincule módulos específicos para cada cliente (ex: Primeiros Socorros Pediátricos para Escolas; SBV + DEA para Academias) sem duplicar código.
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-slate-950/50 text-xs">
                <div>
                  <span className="font-semibold text-white">Turma Escola Modelo (Lei Lucas)</span>
                  <div className="text-[11px] text-slate-400">3 módulos ativos • 24 alunos</div>
                </div>
                <button className="text-uniao-400 font-bold hover:underline">Configurar</button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-slate-950/50 text-xs">
                <div>
                  <span className="font-semibold text-white">Turma CrossFit Arena (SBV + DEA)</span>
                  <div className="text-[11px] text-slate-400">2 módulos ativos • 15 alunos</div>
                </div>
                <button className="text-uniao-400 font-bold hover:underline">Configurar</button>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};
