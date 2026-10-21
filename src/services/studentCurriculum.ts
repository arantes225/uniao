import { supabase } from './supabase/client';

export interface StudentCohortAccess {
  id: string;
  name: string;
  moduleIds: string[];
  daysRemaining: number;
}

export interface StudentOutletContext {
  studentName: string;
  cohorts: StudentCohortAccess[];
  activeCohortId: string;
  setActiveCohortId: (id: string) => void;
  allowedModuleIds: string[];
  curriculumLoading: boolean;
  curriculumError: string | null;
}

/** Consulta matrículas e acessos do próprio aluno. Falhas nunca liberam todo o catálogo. */
export async function loadStudentCohortAccess(): Promise<StudentCohortAccess[]> {
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) throw new Error('Entre com sua conta para acessar as aulas.');
  const { data: enrollments, error: enrollmentError } = await supabase
    .from('enrollments').select('cohort_id,enrolled_at')
    .eq('user_id', auth.user.id).in('status', ['active', 'completed']);
  if (enrollmentError) throw enrollmentError;
  if (!enrollments?.length) return [];
  const ids = [...new Set(enrollments.map(e => e.cohort_id))];
  const [cohortResponse, lessonResponse] = await Promise.all([
    supabase.from('cohorts').select('id,name,access_days_limit,status')
      .in('id', ids),
    supabase.from('cohort_lesson_access').select('cohort_id,module_id').in('cohort_id', ids),
  ]);
  if (cohortResponse.error) throw cohortResponse.error;
  if (lessonResponse.error) throw lessonResponse.error;
  return (cohortResponse.data || []).filter(c => c.status === 'active').map(c => {
    const accessStart = enrollments.find(e => e.cohort_id === c.id)?.enrolled_at;
    const expiration = accessStart
      ? new Date(accessStart).getTime() + (c.access_days_limit || 90) * 86400000
      : Date.now();
    const daysRemaining = Math.max(0, Math.ceil((expiration - Date.now()) / 86400000));
    return {
      id: c.id, name: c.name,
      moduleIds: [...new Set((lessonResponse.data || []).filter(l => l.cohort_id === c.id).map(l => l.module_id))],
      daysRemaining,
    };
  }).filter(c => c.daysRemaining > 0);
}
