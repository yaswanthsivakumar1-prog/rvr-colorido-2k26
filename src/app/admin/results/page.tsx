'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Edit2, Trash2, Loader2, X } from 'lucide-react';
import type { Result, Event } from '@/types';
import { getAllResults } from '@/actions/results';
import { getEvents } from '@/actions/events';

export default function AdminResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Result | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const supabase = createClient();

  async function fetchData() {
    setLoading(true);
    try {
      const [resultsData, eventsData] = await Promise.all([
        getAllResults(),
        getEvents(),
      ]);
      setResults(resultsData || []);
      setEvents(eventsData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  async function handleSave(formData: FormData) {
    setSaving(true);
    const resultData = {
      event_id: formData.get('event_id') as string,
      position: parseInt(formData.get('position') as string) || 1,
      participant_name: formData.get('participant_name') as string,
      team_name: (formData.get('team_name') as string) || null,
      college: formData.get('college') as string,
      score: (formData.get('score') as string) || null,
      remarks: (formData.get('remarks') as string) || null,
      published: formData.get('published') === 'on',
    };

    if (editing) {
      await supabase.from('results').update(resultData).eq('id', editing.id);
    } else {
      await supabase.from('results').insert(resultData);
    }

    setShowForm(false);
    setEditing(null);
    setSaving(false);
    fetchData();
  }

  async function handleDelete(id: string) {
    await supabase.from('results').delete().eq('id', id);
    setConfirmDelete(null);
    fetchData();
  }

  const positionEmoji: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-primary">Results Management</h1>
          <p className="text-sm text-text-secondary">Publish event results and winners</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Result
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-primary-light animate-spin" /></div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-light/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Pos.</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Participant</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase hidden md:table-cell">Event</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase hidden md:table-cell">College</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-text-muted uppercase">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.id} className="border-b border-border hover:bg-surface-light/30 transition-colors">
                    <td className="px-4 py-3 text-lg">{positionEmoji[r.position] || `#${r.position}`}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-text-primary">{r.participant_name}</span>
                      {r.team_name && <span className="block text-xs text-text-muted">{r.team_name}</span>}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-sm text-text-secondary">{(r.event as any)?.name || 'N/A'}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-sm text-text-secondary">{r.college}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${r.published ? 'bg-success/20 text-success' : 'bg-text-muted/20 text-text-muted'}`}>
                        {r.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setEditing(r); setShowForm(true); }} className="p-2 rounded-lg text-text-muted hover:text-primary-light hover:bg-primary/10 transition-all"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => setConfirmDelete(r.id)} className="p-2 rounded-lg text-text-muted hover:text-error hover:bg-error/10 transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {results.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-text-muted">No results yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="glass-strong rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Delete Result?</h3>
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
          <div className="glass-strong rounded-2xl p-6 sm:p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-primary">{editing ? 'Edit Result' : 'Add Result'}</h3>
              <button onClick={() => { setShowForm(false); setEditing(null); }}><X className="w-5 h-5 text-text-muted" /></button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSave(new FormData(e.currentTarget)); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Event *</label>
                  <select name="event_id" required defaultValue={editing?.event_id || ''} className="form-input">
                    <option value="">Select event</option>
                    {events.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Position *</label>
                  <select name="position" required defaultValue={editing?.position || 1} className="form-input">
                    <option value={1}>🥇 1st Place</option>
                    <option value={2}>🥈 2nd Place</option>
                    <option value={3}>🥉 3rd Place</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Participant Name *</label>
                <input name="participant_name" required defaultValue={editing?.participant_name || ''} className="form-input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Team Name</label>
                  <input name="team_name" defaultValue={editing?.team_name || ''} className="form-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">College *</label>
                  <input name="college" required defaultValue={editing?.college || ''} className="form-input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Score</label>
                  <input name="score" defaultValue={editing?.score || ''} className="form-input" />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input name="published" type="checkbox" defaultChecked={editing?.published ?? true} className="w-4 h-4 rounded" />
                  <label className="text-sm text-text-primary">Publish</label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Remarks</label>
                <textarea name="remarks" rows={2} defaultValue={editing?.remarks || ''} className="form-input resize-none" />
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
