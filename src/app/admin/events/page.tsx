'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Edit2, Trash2, Search, Loader2, X, CheckCircle, XCircle } from 'lucide-react';
import type { Event } from '@/types';
import { getEvents } from '@/actions/events';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const supabase = createClient();

  async function fetchEvents() {
    setLoading(true);
    try {
      const data = await getEvents();
      setEvents(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchEvents(); }, []);

  const filteredEvents = events.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase()) ||
      e.subcategory.toLowerCase().includes(search.toLowerCase())
  );

  async function handleSave(formData: FormData) {
    setSaving(true);
    const rulesText = formData.get('rules') as string;
    const eventData = {
      name: formData.get('name') as string,
      slug: (formData.get('name') as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: formData.get('category') as string,
      subcategory: formData.get('subcategory') as string,
      gender: formData.get('gender') as string,
      description: formData.get('description') as string,
      rules: rulesText ? rulesText.split('\n').filter(Boolean) : [],
      venue: formData.get('venue') as string,
      event_date: formData.get('event_date') as string || null,
      start_time: formData.get('start_time') as string,
      end_time: formData.get('end_time') as string,
      max_participants: parseInt(formData.get('max_participants') as string) || 0,
      registration_open: formData.get('registration_open') === 'on',
    };

    if (editingEvent) {
      await supabase.from('events').update(eventData).eq('id', editingEvent.id);
    } else {
      await supabase.from('events').insert(eventData);
    }

    setShowForm(false);
    setEditingEvent(null);
    setSaving(false);
    fetchEvents();
  }

  async function handleDelete(id: string) {
    await supabase.from('events').delete().eq('id', id);
    setConfirmDelete(null);
    fetchEvents();
  }

  async function toggleRegistration(id: string, current: boolean) {
    await supabase.from('events').update({ registration_open: !current }).eq('id', id);
    fetchEvents();
  }

  function openEdit(event: Event) {
    setEditingEvent(event);
    setShowForm(true);
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-primary">
            Event Management
          </h1>
          <p className="text-sm text-text-secondary">Create, edit, and manage events</p>
        </div>
        <button
          onClick={() => { setEditingEvent(null); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input pl-10"
        />
      </div>

      {/* Events table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary-light animate-spin" />
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-light/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase hidden md:table-cell">Gender</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase hidden lg:table-cell">Date</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-text-muted uppercase">Reg.</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="border-b border-border hover:bg-surface-light/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-text-primary">{event.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary-light capitalize">
                        {event.subcategory.replace(/-/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-text-secondary capitalize">{event.gender}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm text-text-secondary">
                        {event.event_date ? new Date(event.event_date).toLocaleDateString('en-IN') : 'TBA'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleRegistration(event.id, event.registration_open)}
                        title={event.registration_open ? 'Close registration' : 'Open registration'}
                      >
                        {event.registration_open ? (
                          <CheckCircle className="w-5 h-5 text-success mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-text-muted mx-auto" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(event)}
                          className="p-2 rounded-lg text-text-muted hover:text-primary-light hover:bg-primary/10 transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(event.id)}
                          className="p-2 rounded-lg text-text-muted hover:text-error hover:bg-error/10 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredEvents.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-text-muted">
                      No events found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="glass-strong rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Delete Event?</h3>
            <p className="text-sm text-text-secondary mb-6">
              This action cannot be undone. All registrations for this event will be affected.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 glass rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 bg-error text-white rounded-xl text-sm font-medium hover:bg-error/80 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="glass-strong rounded-2xl p-6 sm:p-8 max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-primary">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h3>
              <button onClick={() => { setShowForm(false); setEditingEvent(null); }} className="p-2 rounded-lg hover:bg-surface-light transition-colors">
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave(new FormData(e.currentTarget));
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Name *</label>
                  <input name="name" required defaultValue={editingEvent?.name || ''} className="form-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Category *</label>
                  <select name="category" required defaultValue={editingEvent?.category || ''} className="form-input">
                    <option value="">Select</option>
                    <option value="cultural">Cultural</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Subcategory *</label>
                  <input name="subcategory" required defaultValue={editingEvent?.subcategory || ''} placeholder="e.g., dance, basketball" className="form-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Gender</label>
                  <select name="gender" defaultValue={editingEvent?.gender || 'open'} className="form-input">
                    <option value="open">Open</option>
                    <option value="boys">Boys</option>
                    <option value="girls">Girls</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Venue</label>
                  <input name="venue" defaultValue={editingEvent?.venue || ''} placeholder="Event venue" className="form-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Date</label>
                  <input name="event_date" type="date" defaultValue={editingEvent?.event_date || ''} className="form-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Start Time</label>
                  <input name="start_time" defaultValue={editingEvent?.start_time || ''} placeholder="e.g., 10:00 AM" className="form-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">End Time</label>
                  <input name="end_time" defaultValue={editingEvent?.end_time || ''} placeholder="e.g., 1:00 PM" className="form-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Max Participants</label>
                  <input name="max_participants" type="number" min="0" defaultValue={editingEvent?.max_participants || 0} className="form-input" />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    name="registration_open"
                    type="checkbox"
                    defaultChecked={editingEvent?.registration_open ?? true}
                    className="w-4 h-4 rounded"
                  />
                  <label className="text-sm text-text-primary">Registration Open</label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
                <textarea name="description" rows={3} defaultValue={editingEvent?.description || ''} className="form-input resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Rules (one per line)
                </label>
                <textarea
                  name="rules"
                  rows={4}
                  defaultValue={editingEvent?.rules?.join('\n') || ''}
                  placeholder="Enter each rule on a new line"
                  className="form-input resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingEvent(null); }}
                  className="px-5 py-2.5 glass rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
