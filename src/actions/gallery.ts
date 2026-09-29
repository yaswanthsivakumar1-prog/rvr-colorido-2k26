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
    const fetchPromise = (async () => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching gallery:', error);
        return MOCK_GALLERY;
      }
      return (data as GalleryImage[]) || [];
    })();

    const timeoutPromise = new Promise<GalleryImage[]>((resolve) =>
      setTimeout(() => resolve(MOCK_GALLERY), 3500)
    );

    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch (err) {
    console.error('Exception fetching gallery:', err);
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
