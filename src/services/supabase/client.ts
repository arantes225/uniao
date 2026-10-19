import { createClient } from '@supabase/supabase-js';

// Conexão exclusiva com o Supabase União Serviços Médicos
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://aezmhkylxmpoxmhyvjwm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlem1oa3lseG1wb3htaHl2andtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0MzUwMDUsImV4cCI6MjEwODAxMTAwNX0.VUg6ebCBQ57fWKao9HO1JNymsnhNn5Yo60wmNTa-fQk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
