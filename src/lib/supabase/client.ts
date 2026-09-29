import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client for use in Client Components.
 * Uses the anon key (public) — RLS protects data on the server side.
 */
export function createClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseUrl =
    rawUrl && (rawUrl.startsWith('http://') || rawUrl.startsWith('https://'))
      ? rawUrl
      : 'https://placeholder.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  );
}
