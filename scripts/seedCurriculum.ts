import { createClient } from '@supabase/supabase-js';
import { INITIAL_LIBRARIES, INITIAL_40_MODULES } from '../src/data/curriculumData.ts';

const supabaseUrl = 'https://aezmhkylxmpoxmhyvjwm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlem1oa3lseG1wb3htaHl2andtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0MzUwMDUsImV4cCI6MjEwODAxMTAwNX0.VUg6ebCBQ57fWKao9HO1JNymsnhNn5Yo60wmNTa-fQk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runSeed() {
  console.log('--- Iniciando Seed Idempotente dos 40 Módulos da União Serviços Médicos ---');

  // 1. Bibliotecas
  for (const lib of INITIAL_LIBRARIES) {
    const { data: existing } = await supabase.from('content_libraries').select('id').eq('id', lib.id).maybeSingle();
    if (!existing) {
      const { error } = await supabase.from('content_libraries').insert([{
        id: lib.id,
        code: lib.code,
        name: lib.name,
        description: lib.description,
        modules_count: lib.modulesCount
      }]);
      if (error) console.error('Erro lib ' + lib.code, error.message);
      else console.log('✓ Biblioteca inserida:', lib.name);
    } else {
      console.log('• Biblioteca já existente:', lib.name);
    }
  }

  // 2. 40 Módulos e Subtemas
  let insertedMods = 0;
  for (const mod of INITIAL_40_MODULES) {
    const { data: existing } = await supabase.from('learning_modules').select('id').eq('id', mod.id).maybeSingle();
    if (!existing) {
      const { error } = await supabase.from('learning_modules').insert([{
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
        material_version: mod.materialVersion
      }]);

      if (error) {
        console.error('Erro mod ' + mod.code, error.message);
      } else {
        insertedMods++;
        // Inserir subtemas
        if (mod.subtopics && mod.subtopics.length > 0) {
          const rows = mod.subtopics.map(t => ({
            id: `${mod.id}-T${t.position}`,
            module_id: mod.id,
            position: t.position,
            title: t.title
          }));
          await supabase.from('module_topics').insert(rows);
        }
      }
    }
  }

  console.log(`--- Seed Concluído! Inseridos ${insertedMods} novos módulos. Total: ${INITIAL_40_MODULES.length} módulos no catálogo. ---`);
}

runSeed().catch(console.error);
