'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Edit2, Trash2, Loader2, X, Eye, EyeOff } from 'lucide-react';
import type { Announcement } from '@/types';
import { getAllAnnouncements } from '@/actions/announcements';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const supabase = createClient();

  async function fetchAnnouncements() {
    setLoading(true);
    try {
      const data = await getAllAnnouncements();
      setAnnouncements(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAnnouncements(); }, []);

  async function handleSave(formData: FormData) {
    setSaving(true);
    const annData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      priority: formData.get('priority') as string,
      published: formData.get('published') === 'on',
    };

    if (editing) {
      await supabase.from('announcements').update(annData).eq('id', editing.id);
    } else {
      await supabase.from('announcements').insert(annData);
    }

    setShowForm(false);
    setEditing(null);
    setSaving(false);
    fetchAnnouncements();
  }

  async function handleDelete(id: string) {
    await supabase.from('announcements').delete().eq('id', id);
    setConfirmDelete(null);
    fetchAnnouncements();
  }

  async function togglePublished(id: string, current: boolean) {
    await supabase.from('announcements').update({ published: !current }).eq('id', id);
    fetchAnnouncements();
  }

  const priorityColors: Record<string, string> = {
    urgent: 'bg-error/20 text-error',
    high: 'bg-secondary/20 text-secondary-light',
    medium: 'bg-accent/20 text-accent-light',
    low: 'bg-info/20 text-info',
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-primary">
            Announcements
          </h1>
          <p className="text-sm text-text-secondary">Create and manage announcements</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Announcement
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary-light animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((ann) => (
            <div key={ann.id} className="glass rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-text-primary">{ann.title}</h3>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${priorityColors[ann.priority] || ''}`}>
                    {ann.priority}
                  </span>
                  {ann.published ? (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-success/20 text-success">Published</span>
                  ) : (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-text-muted/20 text-text-muted">Draft</span>
                  )}
                </div>
                <p className="text-xs text-text-secondary line-clamp-1">{ann.description}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => togglePublished(ann.id, ann.published)}
                  className="p-2 rounded-lg text-text-muted hover:text-primary-light hover:bg-primary/10 transition-all"
                  title={ann.published ? 'Unpublish' : 'Publish'}
                >
                  {ann.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => { setEditing(ann); setShowForm(true); }}
                  className="p-2 rounded-lg text-text-muted hover:text-primary-light hover:bg-primary/10 transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setConfirmDelete(ann.id)}
                  className="p-2 rounded-lg text-text-muted hover:text-error hover:bg-error/10 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {announcements.length === 0 && (
            <p className="text-center py-8 text-sm text-text-muted">No announcements yet.</p>
          )}
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="glass-strong rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Delete Announcement?</h3>
            <p className="text-sm text-text-secondary mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 glass rounded-xl text-sm text-text-secondary">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} className="px-4 py-2 bg-error text-white rounded-xl text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="glass-strong rounded-2xl p-6 sm:p-8 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-primary">
                {editing ? 'Edit Announcement' : 'New Announcement'}
              </h3>
              <button onClick={() => { setShowForm(false); setEditing(null); }}>
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSave(new FormData(e.currentTarget)); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Title *</label>
                <input name="title" required defaultValue={editing?.title || ''} className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Description *</label>
                <textarea name="description" required rows={4} defaultValue={editing?.description || ''} className="form-input resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Priority</label>
                  <select name="priority" defaultValue={editing?.priority || 'medium'} className="form-input">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input name="published" type="checkbox" defaultChecked={editing?.published ?? true} className="w-4 h-4 rounded" />
                  <label className="text-sm text-text-primary">Publish immediately</label>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-5 py-2.5 glass rounded-xl text-sm text-text-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium disabled:opacity-50 flex items-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
