'use server';

import { createClient } from '@/lib/supabase/server';
import type { College } from '@/types';
import { isSupabaseConfigured } from '@/lib/data/mock-data';
import { revalidatePath } from 'next/cache';

// Helper to normalize college database record to College type (internal, not exported as server action)
function normalizeCollegeRow(c: any): College {
  if (!c) {
    return {
      id: 'col-' + Date.now(),
      name: '',
      short_name: '',
      code: 'COL',
      is_participating: true,
      is_active: true,
      created_at: new Date().toISOString(),
    };
  }
  return {
    id: String(c.id || 'col-' + Date.now()),
    name: String(c.name || ''),
    short_name: String(c.short_name || c.name || ''),
    code: String(c.code || c.short_name || 'COL'),
    is_participating: Boolean(c.is_participating ?? c.is_active ?? true),
    is_active: Boolean(c.is_active ?? c.is_participating ?? true),
    created_at: String(c.created_at || new Date().toISOString()),
  };
}

// Default colleges: host college + configurable participating college placeholder
const memoryColleges: College[] = [
  {
    id: 'col-rvrjc',
    name: 'R.V.R. & J.C. College of Engineering (Autonomous)',
    short_name: 'RVR & JC',
    code: 'RVRJC',
    is_participating: true,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'col-other',
    name: 'Other College',
    short_name: 'Other College',
    code: 'OTHER',
    is_participating: true,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'col-participating',
    name: 'Participating College',
    short_name: 'Participating College',
    code: 'PARTICIPATING',
    is_participating: true,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];


/** Fetch all participating colleges */
export async function getColleges(onlyParticipating: boolean = false): Promise<College[]> {
  const filterList = (list: College[]) =>
    onlyParticipating
      ? list.filter((c) => c.is_participating !== false && c.is_active !== false)
      : list;

  if (!isSupabaseConfigured()) {
    return filterList(memoryColleges);
  }

  try {
    const supabase = await createClient();

    const fetchPromise = supabase
      .from('participating_colleges')
      .select('*')
      .order('name', { ascending: true });

    const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: new Error('Query timeout') }), 3500)
    );

    const result = await Promise.race([fetchPromise, timeoutPromise]);
    const { data, error } = result as { data: any[] | null; error: any };

    if (error || !data || data.length === 0) {
      // Fallback to legacy colleges table if participating_colleges isn't populated
      const fallbackResult = await supabase
        .from('colleges')
        .select('*')
        .order('name', { ascending: true });
      if (!fallbackResult.error && fallbackResult.data && fallbackResult.data.length > 0) {
        return filterList(fallbackResult.data.map(normalizeCollegeRow));
      }
      return filterList(memoryColleges);
    }

    return filterList(data.map(normalizeCollegeRow));
  } catch {
    return filterList(memoryColleges);
  }
}

/** Create a new participating college */
export async function createCollege(
  data: Omit<College, 'id' | 'created_at'>
): Promise<{ success: boolean; college?: College; error?: string }> {
  if (!data.name || data.name.trim().length < 2) {
    return { success: false, error: 'College name is required.' };
  }

  const active = data.is_active ?? data.is_participating ?? true;
  const newCollege: College = {
    id: 'col-' + Date.now(),
    name: data.name.trim(),
    short_name: data.short_name?.trim() || data.name.trim(),
    code: (data.code || data.short_name || 'COL').trim().toUpperCase(),
    is_participating: active,
    is_active: active,
    created_at: new Date().toISOString(),
  };

  memoryColleges.push(newCollege);

  try {
    revalidatePath('/registration');
    revalidatePath('/admin/colleges');
  } catch {}

  if (!isSupabaseConfigured()) {
    return { success: true, college: newCollege };
  }

  try {
    const supabase = await createClient();
    const { data: inserted, error } = await supabase
      .from('participating_colleges')
      .insert({
        name: newCollege.name,
        short_name: newCollege.short_name,
        code: newCollege.code,
        is_active: active,
        is_participating: active,
      })
      .select()
      .single();

    if (error) {
      console.warn('Supabase insert participating_colleges failed, falling back to colleges table:', error.message);
      const fallback = await supabase.from('colleges').insert({
        name: newCollege.name,
        short_name: newCollege.short_name,
        code: newCollege.code,
        is_participating: active,
      }).select().single();
      if (!fallback.error && fallback.data) {
        return { success: true, college: normalizeCollegeRow(fallback.data) };
      }
    }

    return { success: true, college: inserted ? normalizeCollegeRow(inserted) : newCollege };
  } catch {
    return { success: true, college: newCollege };
  }
}

/** Update an existing participating college */
export async function updateCollege(
  id: string,
  data: Partial<Omit<College, 'id' | 'created_at'>>
): Promise<{ success: boolean; college?: College; error?: string }> {
  const index = memoryColleges.findIndex((c) => c.id === id);
  if (index !== -1) {
    memoryColleges[index] = {
      ...memoryColleges[index],
      ...data,
      is_participating: data.is_participating ?? data.is_active ?? memoryColleges[index].is_participating,
      is_active: data.is_active ?? data.is_participating ?? memoryColleges[index].is_active,
    };
  }

  try {
    revalidatePath('/registration');
    revalidatePath('/admin/colleges');
  } catch {}

  if (!isSupabaseConfigured()) {
    return { success: true, college: memoryColleges[index] };
  }

  try {
    const supabase = await createClient();
    const updatePayload: Record<string, any> = {};
    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.short_name !== undefined) updatePayload.short_name = data.short_name;
    if (data.code !== undefined) updatePayload.code = data.code;
    if (data.is_active !== undefined || data.is_participating !== undefined) {
      const state = data.is_active ?? data.is_participating;
      updatePayload.is_active = state;
      updatePayload.is_participating = state;
    }

    const { data: updated, error } = await supabase
      .from('participating_colleges')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      const fallback = await supabase.from('colleges').update(updatePayload).eq('id', id).select().single();
      if (!fallback.error && fallback.data) {
        return { success: true, college: normalizeCollegeRow(fallback.data) };
      }
    }

    return { success: true, college: updated ? normalizeCollegeRow(updated) : memoryColleges[index] };
  } catch {
    return { success: true, college: memoryColleges[index] };
  }
}

/** Delete an existing participating college */
export async function deleteCollege(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const index = memoryColleges.findIndex((c) => c.id === id);
  if (index !== -1) {
    memoryColleges.splice(index, 1);
  }

  try {
    revalidatePath('/registration');
    revalidatePath('/admin/colleges');
  } catch {}

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const supabase = await createClient();
    await supabase.from('participating_colleges').delete().eq('id', id);
    await supabase.from('colleges').delete().eq('id', id);
    return { success: true };
  } catch {
    return { success: true };
  }
}

/** Toggle participation status for a college */
export async function toggleCollegeParticipation(
  id: string,
  is_participating: boolean
): Promise<{ success: boolean; error?: string }> {
  return updateCollege(id, { is_participating, is_active: is_participating });
}
