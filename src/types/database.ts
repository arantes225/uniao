export type UserRole = 'student' | 'instructor' | 'admin';

export interface UserProfile {
  id: string;
  full_name: string;
  email?: string;
  created_at: string;
  role?: UserRole;
  avatar_url?: string;
}

export interface Institution {
  id: string;
  name: string;
  category: string;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  published: boolean;
  thumbnail_url?: string;
  created_at: string;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  position: number;
  description?: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  kind: 'video_reading_quiz' | 'video' | 'reading' | 'quiz';
  content?: string;
  video_path?: string;
  pdf_path?: string;
  duration_minutes?: number;
  position: number;
  published: boolean;
}

export interface QuestionOption {
  id: string;
  question_id: string;
  label: string;
  is_correct: boolean;
  position: number;
}

export interface AssessmentQuestion {
  id: string;
  assessment_id?: string;
  lesson_id?: string;
  stem: string;
  explanation: string;
  position: number;
  options?: QuestionOption[];
}

export interface SimulationCase {
  id: string;
  course_id: string;
  slug: string;
  title: string;
  scenario: any;
  actions: any;
  scoring: any;
  debrief: any;
  published: boolean;
  created_at: string;
}

export interface ContactLead {
  id?: string;
  contact_name: string;
  email: string;
  phone?: string;
  institution_name?: string;
  audience?: string;
  message?: string;
  created_at?: string;
}
