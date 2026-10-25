import { supabase } from './supabase/client';

/** Load a booklet only through Supabase RLS, never from the public static path. */
export async function getSecureBooklet(moduleCode: string): Promise<string> {
  if (!/^[ACEHT][0-9]{2}$/.test(moduleCode)) throw new Error('Código da apostila inválido.');
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Entre na sua conta para acessar este material.');
  const { data, error } = await supabase.from('secure_booklets')
    .select('markdown').eq('code', moduleCode).maybeSingle();
  if (error) throw new Error('Não foi possível consultar o material protegido.');
  if (!data?.markdown) throw new Error('Material indisponível ou não liberado para esta turma.');
  return data.markdown as string;
}
