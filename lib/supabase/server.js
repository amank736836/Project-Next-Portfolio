import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createOfflineClient, isOfflineMode } from './offline-client';

export async function createClient() {
  if (isOfflineMode()) return createOfflineClient();

  const cookieStore = await cookies();

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    }
  );
}

export async function createAdminClient() {
  if (isOfflineMode()) return createOfflineClient();

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SERVICE_ROLE_KEY,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );
}
