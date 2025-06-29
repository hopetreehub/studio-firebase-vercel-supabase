import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create a fallback client for build time when env vars are not set
let supabaseAdmin: any;

if (supabaseUrl && supabaseServiceRoleKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
} else {
  // Fallback for build time - create a mock client that won't be used in production
  supabaseAdmin = {
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
      insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
      update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
      upsert: () => Promise.resolve({ data: null, error: null }),
    }),
    auth: {
      admin: {
        getUserById: () => Promise.resolve({ data: null, error: null }),
        updateUserById: () => Promise.resolve({ error: null }),
        listUsers: () => Promise.resolve({ data: { users: [] }, error: null }),
      },
    },
  };
}

export { supabaseAdmin };