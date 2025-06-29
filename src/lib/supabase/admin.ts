import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // This should be a server-side environment variable

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase URL or Service Role Key environment variables.');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
  },
});

export { supabaseAdmin };