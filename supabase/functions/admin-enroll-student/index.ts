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

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: caller, error: callerError } = await admin.auth.getUser(token);
  if (callerError || !caller.user) return json({ error: 'Sessão inválida' }, 401);

  const { data: staff, error: staffError } = await admin
    .from('platform_staff')
    .select('user_id')
    .eq('user_id', caller.user.id)
    .maybeSingle();
  if (staffError || !staff) return json({ error: 'Apenas a equipe autorizada pode matricular alunos' }, 403);

  const payload = await request.json().catch(() => null);
  const name = typeof payload?.name === 'string' ? payload.name.trim() : '';
  const email = typeof payload?.email === 'string' ? payload.email.trim().toLowerCase() : '';
  const cpf = typeof payload?.cpf === 'string' && payload.cpf.trim() ? payload.cpf.trim() : null;
  const cohortId = typeof payload?.cohort_id === 'string' ? payload.cohort_id : '';
  if (!name || !email || !cohortId) return json({ error: 'Nome, e-mail e turma são obrigatórios' }, 400);

  const { data: cohort, error: cohortError } = await admin
    .from('cohorts').select('id, max_students').eq('id', cohortId).maybeSingle();
  if (cohortError || !cohort) return json({ error: 'Turma não encontrada' }, 404);

  const { data: users, error: usersError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (usersError) return json({ error: 'Não foi possível consultar os usuários' }, 500);
  const user = users.users.find((candidate) => candidate.email?.toLowerCase() === email) ?? null;

  if (!user) {
    const { count: activeCount } = await admin
      .from('enrollments').select('id', { count: 'exact', head: true })
      .eq('cohort_id', cohortId).eq('status', 'active');
    const { count: pendingCount } = await admin
      .from('pending_student_enrollments').select('id', { count: 'exact', head: true })
      .eq('cohort_id', cohortId).eq('status', 'pending');
    if ((cohort.max_students ?? 30) <= (activeCount ?? 0) + (pendingCount ?? 0)) {
      return json({ error: 'A turma atingiu a capacidade máxima' }, 409);
    }

    const { data: pending, error: pendingError } = await admin
      .from('pending_student_enrollments')
      .upsert({
        email,
        full_name: name,
        cpf,
        cohort_id: cohortId,
        status: 'pending',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email,cohort_id' })
      .select('id')
      .single();
    if (pendingError) return json({ error: 'Não foi possível liberar o cadastro deste e-mail' }, 400);

    return json({
      registration_required: true,
      pending_id: pending.id,
      email,
      message: 'E-mail autorizado para cadastro. O aluno poderá concluir o primeiro acesso com este endereço.',
    });
  }

  const { error: profileError } = await admin.from('profiles').upsert({
    id: user.id,
    full_name: name,
    email,
    cpf,
  }, { onConflict: 'id' });
  if (profileError) return json({ error: 'Não foi possível salvar o perfil do aluno' }, 400);

  const { data: existing } = await admin.from('enrollments')
    .select('id, status').eq('cohort_id', cohortId).eq('user_id', user.id).maybeSingle();

  if (existing) {
    if (existing.status !== 'active') {
      const { error } = await admin.from('enrollments').update({ status: 'active' }).eq('id', existing.id);
      if (error) return json({ error: 'Não foi possível reativar a matrícula' }, 400);
    }
    await admin.from('pending_student_enrollments')
      .update({ status: 'completed', updated_at: new Date().toISOString() })
      .eq('email', email).eq('cohort_id', cohortId).eq('status', 'pending');
    return json({ user_id: user.id, enrollment_id: existing.id, access_granted: true, reactivated: true });
  }

  const { count } = await admin
    .from('enrollments').select('id', { count: 'exact', head: true })
    .eq('cohort_id', cohortId).eq('status', 'active');
  if ((cohort.max_students ?? 30) <= (count ?? 0)) {
    return json({ error: 'A turma atingiu a capacidade máxima' }, 409);
  }

  const { data: enrollment, error: enrollmentError } = await admin.from('enrollments').insert({
    cohort_id: cohortId,
    user_id: user.id,
    status: 'active',
  }).select('id').single();
  if (enrollmentError) return json({ error: enrollmentError.message }, 400);

  await admin.from('pending_student_enrollments')
    .update({ status: 'completed', updated_at: new Date().toISOString() })
    .eq('email', email).eq('cohort_id', cohortId).eq('status', 'pending');

  return json({ user_id: user.id, enrollment_id: enrollment.id, access_granted: true });
});
