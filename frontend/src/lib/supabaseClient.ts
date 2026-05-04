import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Make sure .env.local is configured properly.');
}

/**
 * Global Supabase Client Instance
 * Used for Authentication, Database operations, and Edge Functions.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
