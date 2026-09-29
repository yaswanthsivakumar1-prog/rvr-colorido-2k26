'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Edit2, Trash2, Loader2, X, ExternalLink } from 'lucide-react';
import type { Sponsor } from '@/types';
import { getSponsors } from '@/actions/sponsors';

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Sponsor | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const supabase = createClient();

  async function fetchSponsors() {
    setLoading(true);
    try {
      const data = await getSponsors();
      setSponsors(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchSponsors(); }, []);

  async function handleSave(formData: FormData) {
    setSaving(true);
    const sponsorData = {
      name: formData.get('name') as string,
      logo_url: (formData.get('logo_url') as string) || null,
      website: (formData.get('website') as string) || null,
      sponsorship_level: formData.get('sponsorship_level') as string,
    };

    if (editing) {
      await supabase.from('sponsors').update(sponsorData).eq('id', editing.id);
    } else {
      await supabase.from('sponsors').insert(sponsorData);
    }

    setShowForm(false);
    setEditing(null);
    setSaving(false);
    fetchSponsors();
  }

  async function handleDelete(id: string) {
    await supabase.from('sponsors').delete().eq('id', id);
    setConfirmDelete(null);
    fetchSponsors();
  }

  const levelColors: Record<string, string> = {
    title: 'bg-amber-500/20 text-amber-400',
    gold: 'bg-yellow-500/20 text-yellow-400',
    silver: 'bg-slate-400/20 text-slate-300',
    supporting: 'bg-blue-500/20 text-blue-400',
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-primary">Sponsors Management</h1>
          <p className="text-sm text-text-secondary">Manage event sponsors and partners</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Sponsor
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-primary-light animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className="glass rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-surface-light flex items-center justify-center shrink-0">
                    {sponsor.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={sponsor.logo_url} alt={sponsor.name} className="w-10 h-10 object-contain rounded-lg" />
                    ) : (
                      <span className="text-xl font-bold text-primary-light">{sponsor.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">{sponsor.name}</h3>
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full capitalize mt-1 ${levelColors[sponsor.sponsorship_level] || ''}`}>
                      {sponsor.sponsorship_level}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(sponsor); setShowForm(true); }} className="p-1.5 rounded-lg text-text-muted hover:text-primary-light hover:bg-primary/10 transition-all">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setConfirmDelete(sponsor.id)} className="p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-error/10 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {sponsor.website && (
                <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-3 text-xs text-primary-light hover:underline">
                  <ExternalLink className="w-3 h-3" /> Visit website
                </a>
              )}
            </div>
          ))}
          {sponsors.length === 0 && (
            <p className="col-span-full text-center py-8 text-sm text-text-muted">No sponsors added yet.</p>
          )}
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="glass-strong rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Delete Sponsor?</h3>
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
              <h3 className="text-lg font-semibold text-text-primary">{editing ? 'Edit Sponsor' : 'Add Sponsor'}</h3>
              <button onClick={() => { setShowForm(false); setEditing(null); }}><X className="w-5 h-5 text-text-muted" /></button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSave(new FormData(e.currentTarget)); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Name *</label>
                <input name="name" required defaultValue={editing?.name || ''} className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Sponsorship Level *</label>
                <select name="sponsorship_level" required defaultValue={editing?.sponsorship_level || 'supporting'} className="form-input">
                  <option value="title">Title Sponsor</option>
                  <option value="gold">Gold Sponsor</option>
                  <option value="silver">Silver Sponsor</option>
                  <option value="supporting">Supporting Sponsor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Logo URL</label>
                <input name="logo_url" defaultValue={editing?.logo_url || ''} placeholder="https://..." className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Website</label>
                <input name="website" defaultValue={editing?.website || ''} placeholder="https://..." className="form-input" />
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
