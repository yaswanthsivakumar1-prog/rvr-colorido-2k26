'use server';

import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured, MOCK_GALLERY } from '@/lib/data/mock-data';
import type { GalleryImage } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getGalleryImages(): Promise<GalleryImage[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_GALLERY;
  }

  try {
    const supabase = await createClient();

    const query = supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: new Error('Query timeout') }), 3500)
    );

    const { data, error } = await Promise.race([query, timeoutPromise]);

    if (error || !data || data.length === 0) {
      if (error) {
        console.warn('Supabase fetch gallery failed, using fallback:', error.message || error);
      }
      return MOCK_GALLERY;
    }

    return (data as GalleryImage[]) || [];
  } catch (err) {
    console.warn('Supabase fetch gallery failed, using fallback:', err);
    return MOCK_GALLERY;
  }
}

export async function deleteGalleryImage(id: string) {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/gallery');
    revalidatePath('/admin/gallery');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
