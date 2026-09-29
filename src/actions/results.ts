'use server';

import { createClient } from '@/lib/supabase/server';
import type { Result } from '@/types';
import { isSupabaseConfigured, MOCK_RESULTS } from '@/lib/data/mock-data';

/** Fetch all published results (public) */
export async function getPublishedResults(): Promise<Result[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_RESULTS.filter((r) => r.published);
  }

  try {
    const supabase = await createClient();

    const query = supabase
      .from('results')
      .select('*, event:events(*)')
      .eq('published', true)
      .order('position', { ascending: true });

    const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: new Error('Query timeout') }), 3500)
    );

    const { data, error } = await Promise.race([query, timeoutPromise]);

    if (error || !data || data.length === 0) {
      return MOCK_RESULTS.filter((r) => r.published);
    }

    return (data as Result[]) || [];
  } catch (err) {
    console.warn('Supabase fetch results failed, using fallback:', err);
    return MOCK_RESULTS.filter((r) => r.published);
  }
}

/** Fetch all results (admin) */
export async function getAllResults(): Promise<Result[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_RESULTS;
  }

  try {
    const supabase = await createClient();

    const query = supabase
      .from('results')
      .select('*, event:events(*)')
      .order('created_at', { ascending: false });

    const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: new Error('Query timeout') }), 3500)
    );

    const { data, error } = await Promise.race([query, timeoutPromise]);

    if (error || !data || data.length === 0) {
      return MOCK_RESULTS;
    }

    return (data as Result[]) || [];
  } catch (err) {
    console.warn('Supabase fetch all results failed, using fallback:', err);
    return MOCK_RESULTS;
  }
}

/** Create a result (admin) */
export async function createResult(result: {
  event_id: string;
  position: number;
  participant_name: string;
  team_name?: string;
  college: string;
  score?: string;
  remarks?: string;
  published: boolean;
}): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase.from('results').insert({
      event_id: result.event_id,
      position: result.position,
      participant_name: result.participant_name,
      team_name: result.team_name || null,
      college: result.college,
      score: result.score || null,
      remarks: result.remarks || null,
      published: result.published,
    });

    if (error) {
      console.error('Error creating result:', error);
      return { success: false, error: 'Failed to create result.' };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

/** Update a result (admin) */
export async function updateResult(
  id: string,
  updates: Partial<Result>
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('results')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating result:', error);
      return { success: false, error: 'Failed to update result.' };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

/** Delete a result (admin) */
export async function deleteResult(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('results')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting result:', error);
      return { success: false, error: 'Failed to delete result.' };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
