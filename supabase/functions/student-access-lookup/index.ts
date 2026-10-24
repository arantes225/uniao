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

  const payload = await request.json().catch(() => null);
  const email = typeof payload?.email === 'string' ? payload.email.trim().toLowerCase() : '';
  if (!email) return json({ authorized: false }, 400);

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const { data: users, error: usersError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (usersError) return json({ authorized: false }, 500);
  const user = users.users.find(candidate => candidate.email?.toLowerCase() === email);

  if (user) {
    const { data: enrollment, error } = await admin
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .in('status', ['active', 'completed'])
      .limit(1)
      .maybeSingle();
    if (error) return json({ authorized: false }, 500);
    if (enrollment) return json({ authorized: true });
  }

  const { data: pending, error: pendingError } = await admin
    .from('pending_student_enrollments')
    .select('id')
    .eq('email', email)
    .eq('status', 'pending')
    .limit(1)
    .maybeSingle();
  if (pendingError) return json({ authorized: false }, 500);

  return json({ authorized: !!pending });
});
