import { createBrowserClient } from '@supabase/ssr'
import { createOfflineClient, isOfflineMode } from './offline-client'

export function createClient() {
  if (isOfflineMode()) return createOfflineClient()

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
