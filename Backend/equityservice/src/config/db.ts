import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

const connectDatabase = async (): Promise<void> => {
  if (!supabase) {
    throw new Error('Database configuration missing. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env');
  }
};

export { supabase, connectDatabase };