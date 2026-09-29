'use server';

import { createClient } from '@/lib/supabase/server';
import type { Announcement } from '@/types';
import { isSupabaseConfigured, MOCK_ANNOUNCEMENTS } from '@/lib/data/mock-data';

/** Fetch all published announcements (public) */
export async function getPublishedAnnouncements(): Promise<Announcement[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_ANNOUNCEMENTS.filter((a) => a.published);
  }

  try {
    const supabase = await createClient();

    const query = supabase
      .from('announcements')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: new Error('Query timeout') }), 3500)
    );

    const { data, error } = await Promise.race([query, timeoutPromise]);

    if (error || !data || data.length === 0) {
      return MOCK_ANNOUNCEMENTS.filter((a) => a.published);
    }

    return (data as Announcement[]) || [];
  } catch (err) {
    console.warn('Supabase fetch announcements failed, using fallback:', err);
    return MOCK_ANNOUNCEMENTS.filter((a) => a.published);
  }
}

/** Fetch all announcements (admin) */
export async function getAllAnnouncements(): Promise<Announcement[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_ANNOUNCEMENTS;
  }

  try {
    const supabase = await createClient();

    const query = supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: new Error('Query timeout') }), 3500)
    );

    const { data, error } = await Promise.race([query, timeoutPromise]);

    if (error || !data || data.length === 0) {
      return MOCK_ANNOUNCEMENTS;
    }

    return (data as Announcement[]) || [];
  } catch (err) {
    console.warn('Supabase fetch all announcements failed, using fallback:', err);
    return MOCK_ANNOUNCEMENTS;
  }
}

/** Create a new announcement (admin) */
export async function createAnnouncement(announcement: {
  title: string;
  description: string;
  priority: string;
  published: boolean;
}): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase.from('announcements').insert({
      title: announcement.title,
      description: announcement.description,
      priority: announcement.priority,
      published: announcement.published,
    });

    if (error) {
      console.error('Error creating announcement:', error);
      return { success: false, error: 'Failed to create announcement.' };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

/** Update an announcement (admin) */
export async function updateAnnouncement(
  id: string,
  updates: Partial<Announcement>
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('announcements')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating announcement:', error);
      return { success: false, error: 'Failed to update announcement.' };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

/** Delete an announcement (admin) */
export async function deleteAnnouncement(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting announcement:', error);
      return { success: false, error: 'Failed to delete announcement.' };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
