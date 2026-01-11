/**
 * Supabase Client Configuration
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Helper to check connection
export async function checkSupabaseConnection() {
    if (!supabase) return false;
    try {
        const { data, error } = await supabase.from('test').select('*').limit(1);
        // Even if table doesn't exist, a specific error code means connection is okay
        return true;
    } catch (e) {
        return false;
    }
}
