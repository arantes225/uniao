import { supabase } from '../services/supabase/client';
import { INITIAL_LIBRARIES, INITIAL_40_MODULES, LearningModule, ContentLibrary } from '../data/curriculumData';

export class CurriculumService {
  /**
   * Sincroniza e garante o cadastro inicial idempotente das 5 bibliotecas e 40 módulos
   * SEM sobrescrever edições que o administrador já tenha feito no banco.
   */
  static async seedCurriculumIdempotent(): Promise<void> {
    try {
      // 1. Bibliotecas
      for (const lib of INITIAL_LIBRARIES) {
        const { data: existingLib } = await supabase
          .from('content_libraries')
          .select('id')
          .eq('id', lib.id)
          .maybeSingle();

        if (!existingLib) {
          await supabase.from('content_libraries').insert([
            {
              id: lib.id,
              code: lib.code,
              name: lib.name,
              description: lib.description,
              modules_count: lib.modulesCount,
            }
          ]);
        }
      }

      // 2. Módulos
      for (const mod of INITIAL_40_MODULES) {
        const { data: existingMod } = await supabase
          .from('learning_modules')
          .select('id')
          .eq('id', mod.id)
          .maybeSingle();

        if (!existingMod) {
          await supabase.from('learning_modules').insert([
            {
              id: mod.id,
              library_id: mod.libraryId,
              code: mod.code,
              title: mod.title,
              description: mod.description,
              duration_minutes: mod.durationMinutes,
              workload_theoretical: mod.workloadTheoretical,
              workload_practical: mod.workloadPractical,
              editorial_status: mod.editorialStatus,
              video_provider: mod.videoProvider,
              video_url: mod.videoUrl || null,
              video_duration: mod.videoDuration || null,
              material_title: mod.materialTitle || null,
              material_allow_download: mod.materialAllowDownload,
              material_version: mod.materialVersion,
            }
          ]);

          // Subtemas
          if (mod.subtopics && mod.subtopics.length > 0) {
            const topicsToInsert = mod.subtopics.map(t => ({
              id: `${mod.id}-T${t.position}`,
              module_id: mod.id,
              position: t.position,
              title: t.title,
            }));
            await supabase.from('module_topics').insert(topicsToInsert);
          }
        }
      }
    } catch (err) {
      console.warn('Erro ao sincronizar catálogo curricular no Supabase:', err);
    }
  }

  /**
   * Carrega todas as bibliotecas
   */
  static async getLibraries(): Promise<ContentLibrary[]> {
    try {
      const { data, error } = await supabase
        .from('content_libraries')
        .select('*')
        .order('id');

      if (error || !data || data.length === 0) {
        return INITIAL_LIBRARIES;
      }

      return data.map(item => ({
        id: item.id,
        code: item.code,
        name: item.name,
        description: item.description,
        modulesCount: item.modules_count,
      }));
    } catch {
      return INITIAL_LIBRARIES;
    }
  }

  /**
   * Carrega todos os módulos com subtemas e contagem de questões
   */
  static async getModules(): Promise<LearningModule[]> {
    try {
      const { data, error } = await supabase
        .from('learning_modules')
        .select(`
          *,
          module_topics (*),
          module_questions (*)
        `)
        .order('code');

      if (error || !data || data.length === 0) {
        return INITIAL_40_MODULES;
      }

      return data.map((m: any) => ({
        id: m.id,
        libraryId: m.library_id,
        code: m.code,
        title: m.title,
        description: m.description || '',
        learningObjectives: m.learning_objectives || '',
        targetAudience: m.target_audience || '',
        durationMinutes: m.duration_minutes || 45,
        workloadTheoretical: m.workload_theoretical || 1,
        workloadPractical: m.workload_practical || 0,
        prerequisites: m.prerequisites || '',
        thumbnailUrl: m.thumbnail_url || '',
        editorialStatus: m.editorial_status || 'draft',
        videoProvider: m.video_provider || 'google_drive',
        videoUrl: m.video_url || '',
        videoDuration: m.video_duration || '',
        videoChapters: m.video_chapters || [],
        materialTitle: m.material_title || '',
        materialDescription: m.material_description || '',
        materialPdfUrl: m.material_pdf_url || '',
        materialAllowDownload: m.material_allow_download ?? true,
        materialVersion: m.material_version || 1,
        subtopics: (m.module_topics || [])
          .sort((a: any, b: any) => a.position - b.position)
          .map((t: any) => ({
            id: t.id,
            position: t.position,
            title: t.title,
            description: t.description || '',
          })),
        questions: (m.module_questions || [])
          .sort((a: any, b: any) => a.position - b.position)
          .map((q: any) => ({
            id: q.id,
            position: q.position,
            stem: q.stem,
            options: q.options || [],
            correctOptionIndex: q.correct_option_index || 0,
            explanation: q.explanation || '',
            difficulty: q.difficulty || 'medium',
          })),
      }));
    } catch {
      return INITIAL_40_MODULES;
    }
  }

  /**
   * Salva ou atualiza um módulo completo
   */
  static async saveModule(moduleData: LearningModule): Promise<void> {
    try {
      await supabase.from('learning_modules').upsert({
        id: moduleData.id,
        library_id: moduleData.libraryId,
        code: moduleData.code,
        title: moduleData.title,
        description: moduleData.description,
        learning_objectives: moduleData.learningObjectives,
        target_audience: moduleData.targetAudience,
        duration_minutes: moduleData.durationMinutes,
        workload_theoretical: moduleData.workloadTheoretical,
        workload_practical: moduleData.workloadPractical,
        prerequisites: moduleData.prerequisites,
        thumbnail_url: moduleData.thumbnailUrl,
        editorial_status: moduleData.editorialStatus,
        video_provider: moduleData.videoProvider,
        video_url: moduleData.videoUrl,
        video_duration: moduleData.videoDuration,
        video_chapters: moduleData.videoChapters,
        material_title: moduleData.materialTitle,
        material_description: moduleData.materialDescription,
        material_pdf_url: moduleData.materialPdfUrl,
        material_allow_download: moduleData.materialAllowDownload,
        material_version: moduleData.materialVersion,
        updated_at: new Date().toISOString(),
      });

      // Atualiza subtemas
      if (moduleData.subtopics) {
        await supabase.from('module_topics').delete().eq('module_id', moduleData.id);
        if (moduleData.subtopics.length > 0) {
          const rows = moduleData.subtopics.map((t, idx) => ({
            id: t.id || `${moduleData.id}-T${idx + 1}`,
            module_id: moduleData.id,
            position: idx + 1,
            title: t.title,
            description: t.description || '',
          }));
          await supabase.from('module_topics').insert(rows);
        }
      }

      // Atualiza questões
      if (moduleData.questions) {
        await supabase.from('module_questions').delete().eq('module_id', moduleData.id);
        if (moduleData.questions.length > 0) {
          const qRows = moduleData.questions.map((q, idx) => ({
            id: q.id || `${moduleData.id}-Q${idx + 1}`,
            module_id: moduleData.id,
            position: idx + 1,
            stem: q.stem,
            options: q.options,
            correct_option_index: q.correctOptionIndex,
            explanation: q.explanation,
            difficulty: q.difficulty || 'medium',
            updated_at: new Date().toISOString(),
          }));
          await supabase.from('module_questions').insert(qRows);
        }
      }
    } catch (err) {
      console.warn('Erro ao salvar módulo no Supabase:', err);
    }
  }

  /**
   * Converte link do Google Drive para URL segura de incorporação (iframe)
   */
  static formatDriveEmbedUrl(url?: string): string | null {
    if (!url) return null;
    
    // Suporta link no formato /file/d/{ID}/view ou id={ID}
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }

    // Se já é preview
    if (url.includes('drive.google.com') && url.includes('/preview')) {
      return url;
    }

    return url;
  }
}
