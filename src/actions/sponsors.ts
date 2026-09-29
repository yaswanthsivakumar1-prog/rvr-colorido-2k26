'use server';

import { createClient } from '@/lib/supabase/server';
import type { Sponsor } from '@/types';
import { isSupabaseConfigured, MOCK_SPONSORS } from '@/lib/data/mock-data';

/** Fetch all sponsors ordered by creation date */
export async function getSponsors(): Promise<Sponsor[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_SPONSORS;
  }

  try {
    const supabase = await createClient();

    const query = supabase
      .from('sponsors')
      .select('*')
      .order('created_at', { ascending: true });

    const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: new Error('Query timeout') }), 3500)
    );

    const { data, error } = await Promise.race([query, timeoutPromise]);

    if (error || !data || data.length === 0) {
      return MOCK_SPONSORS;
    }

    return (data as Sponsor[]) || [];
  } catch (err) {
    console.warn('Supabase fetch sponsors failed, using fallback:', err);
    return MOCK_SPONSORS;
  }
}
