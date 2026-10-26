import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Método não permitido' }, 405);

  const authorization = request.headers.get('Authorization');
  const token = authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return json({ error: 'Sessão ausente' }, 401);

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
  const { data: authData, error: authError } = await admin.auth.getUser(token);
  if (authError || !authData.user?.email) return json({ error: 'Sessão inválida' }, 401);
  // Email alone is not ownership proof: the account must complete provider/email verification.
  if (!authData.user.email_confirmed_at) {
    return json({ error: 'Confirme seu e-mail antes de ativar uma matrícula' }, 403);
  }

  const email = authData.user.email.trim().toLowerCase();
  const { data: pending, error: pendingError } = await admin
    .from('pending_student_enrollments')
    .select('id, full_name, cpf, cohort_id')
    .eq('email', email)
    .eq('status', 'pending');
  if (pendingError) return json({ error: 'Não foi possível validar a autorização de cadastro' }, 500);
  if (!pending?.length) {
    const { data: existing } = await admin.from('enrollments')
      .select('id').eq('user_id', authData.user.id).in('status', ['active', 'completed']).limit(1);
    return json({ authorized: !!existing?.length, enrolled: !!existing?.length });
  }

  const first = pending[0];
  const { error: profileError } = await admin.from('profiles').upsert({
    id: authData.user.id,
    full_name: first.full_name,
    email,
    cpf: first.cpf,
  }, { onConflict: 'id' });
  if (profileError) return json({ error: 'Não foi possível criar o perfil do aluno' }, 400);

  let enrolled = 0;
  for (const item of pending) {
    const { data: existing } = await admin.from('enrollments')
      .select('id, status')
      .eq('cohort_id', item.cohort_id)
      .eq('user_id', authData.user.id)
      .maybeSingle();

    if (existing) {
      if (existing.status !== 'active') {
        const { error } = await admin.from('enrollments')
          .update({ status: 'active' }).eq('id', existing.id);
        if (error) return json({ error: 'Não foi possível ativar a matrícula' }, 400);
      }
    } else {
      const { error } = await admin.from('enrollments').insert({
        cohort_id: item.cohort_id,
        user_id: authData.user.id,
        status: 'active',
      });
      if (error) return json({ error: 'Não foi possível criar a matrícula' }, 400);
    }
    enrolled += 1;
    await admin.from('pending_student_enrollments')
      .update({ status: 'completed', updated_at: new Date().toISOString() })
      .eq('id', item.id);
  }

  return json({ authorized: true, enrolled });
});
