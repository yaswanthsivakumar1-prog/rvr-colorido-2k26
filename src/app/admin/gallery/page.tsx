'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Trash2, Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import type { GalleryImage } from '@/types';
import { getGalleryImages, deleteGalleryImage } from '@/actions/gallery';

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const supabase = createClient();

  async function fetchImages() {
    setLoading(true);
    try {
      const data = await getGalleryImages();
      setImages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchImages(); }, []);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);

    const form = new FormData(e.currentTarget);
    const file = form.get('image') as File;
    const title = form.get('title') as string;
    const category = form.get('category') as string;
    const description = form.get('description') as string;

    if (!file || !file.name) {
      setUploading(false);
      return;
    }

    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('colorido')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      setUploading(false);
      return;
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from('colorido').getPublicUrl(filePath);

    // Insert into gallery table
    await supabase.from('gallery').insert({
      title,
      image_url: urlData.publicUrl,
      category,
      description: description || null,
    });

    setShowForm(false);
    setUploading(false);
    fetchImages();
  }

  async function handleDelete(id: string) {
    // Find the image to get its URL for storage cleanup
    const image = images.find((img) => img.id === id);
    if (image?.image_url) {
      // Try to delete from storage (extract path from URL)
      const urlParts = image.image_url.split('/storage/v1/object/public/colorido/');
      if (urlParts[1]) {
        await supabase.storage.from('colorido').remove([urlParts[1]]);
      }
    }

    await supabase.from('gallery').delete().eq('id', id);
    setConfirmDelete(null);
    fetchImages();
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-primary">
            Gallery Management
          </h1>
          <p className="text-sm text-text-secondary">{images.length} image{images.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" /> Upload Image
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-primary-light animate-spin" /></div>
      ) : images.length === 0 ? (
        <div className="text-center py-16">
          <ImageIcon className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <p className="text-text-secondary">No images uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map((image) => (
            <div key={image.id} className="glass rounded-xl overflow-hidden group relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.image_url} alt={image.title} className="w-full h-40 object-cover" loading="lazy" />
              <div className="p-3">
                <h4 className="text-xs font-medium text-text-primary truncate">{image.title}</h4>
                <span className="text-[10px] text-text-muted capitalize">{image.category}</span>
              </div>
              {/* Delete overlay */}
              <button
                onClick={() => setConfirmDelete(image.id)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="glass-strong rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Delete Image?</h3>
            <p className="text-sm text-text-secondary mb-6">This will permanently remove the image.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 glass rounded-xl text-sm text-text-secondary">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} className="px-4 py-2 bg-error text-white rounded-xl text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Upload form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="glass-strong rounded-2xl p-6 sm:p-8 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-primary">Upload Image</h3>
              <button onClick={() => setShowForm(false)} className="text-text-muted hover:text-text-primary">✕</button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Image *</label>
                <input name="image" type="file" accept="image/*" required className="form-input file:mr-3 file:rounded-lg file:border-0 file:bg-primary/20 file:text-primary-light file:px-3 file:py-1 file:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Title *</label>
                <input name="title" required placeholder="Image title" className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Category</label>
                <select name="category" className="form-input">
                  <option value="general">General</option>
                  <option value="cultural">Cultural</option>
                  <option value="sports">Sports</option>
                  <option value="stage">Stage</option>
                  <option value="campus">Campus</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
                <input name="description" placeholder="Brief description" className="form-input" />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 glass rounded-xl text-sm text-text-secondary">Cancel</button>
                <button type="submit" disabled={uploading} className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium disabled:opacity-50 flex items-center gap-2">
                  {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> Upload</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
