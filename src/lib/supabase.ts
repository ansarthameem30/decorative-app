import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aohrpdpswmrlizlqcrdy.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_vf-0iDFmwphrDqmpzRcP1Q_bsysvNhe';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
