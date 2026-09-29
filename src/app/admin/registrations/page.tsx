'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, Eye, Download, ChevronDown, Filter } from 'lucide-react';
import type { Registration, Event } from '@/types';
import { getRegistrations, updateRegistrationStatus } from '@/actions/registrations';
import { getEvents } from '@/actions/events';

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [collegeFilter, setCollegeFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);

  async function fetchData() {
    setLoading(true);
    try {
      const [regData, evtData] = await Promise.all([
        getRegistrations(),
        getEvents(),
      ]);
      setRegistrations((regData as Registration[]) || []);
      setEvents(evtData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Extract unique colleges from registrations for filtering
  const uniqueColleges = Array.from(
    new Set(registrations.map((r) => r.college).filter(Boolean))
  );

  const filtered = registrations.filter((r) => {
    const s = search.toLowerCase();
    const matchesSearch =
      search === '' ||
      r.full_name.toLowerCase().includes(s) ||
      r.email.toLowerCase().includes(s) ||
      (r.college && r.college.toLowerCase().includes(s)) ||
      (r.additional_info && r.additional_info.toLowerCase().includes(s)) ||
      (r.course && r.course.toLowerCase().includes(s)) ||
      r.registration_id.toLowerCase().includes(s);

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesCollege = collegeFilter === 'all' || r.college === collegeFilter;
    const matchesEvent = eventFilter === 'all' || r.event_id === eventFilter;
    const matchesCategory =
      categoryFilter === 'all' || (r.event as any)?.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCollege && matchesEvent && matchesCategory;
  });

  async function updateStatus(id: string, status: string) {
    await updateRegistrationStatus(id, status);
    fetchData();
    if (selectedReg?.id === id) {
      setSelectedReg({ ...selectedReg, status: status as Registration['status'] });
    }
  }

  function exportCSV() {
    const headers = [
      'Registration ID',
      'Student Name',
      'College',
      'Department',
      'Event',
      'Day',
      'Email',
      'Phone',
      'Year',
      'Gender',
      'Team',
      'Status',
      'Date',
    ];
    const rows = filtered.map((r) => [
      r.registration_id,
      r.full_name,
      r.college,
      r.course,
      (r.event as any)?.name || '',
      (r.event as any)?.event_date || 'Day 1',
      r.email,
      r.phone,
      r.year,
      r.gender,
      r.team_name || '',
      r.status,
      new Date(r.created_at).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((row) => row.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-accent/20 text-accent-light',
    confirmed: 'bg-success/20 text-success',
    cancelled: 'bg-error/20 text-error',
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-primary">
            Registration Management
          </h1>
          <p className="text-sm text-text-secondary">
            {filtered.length} registration{filtered.length !== 1 ? 's' : ''} across participating institutions
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 glass rounded-xl text-sm font-medium text-text-primary hover:bg-white/10 transition-all"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Multi-Dimensional Filters (College, Event, Category, Status) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search student, college, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-10 w-full"
          />
        </div>

        {/* College Filter */}
        <select
          value={collegeFilter}
          onChange={(e) => setCollegeFilter(e.target.value)}
          className="form-input w-full text-xs"
        >
          <option value="all">All Colleges ({uniqueColleges.length})</option>
          {uniqueColleges.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="form-input w-full text-xs"
        >
          <option value="all">All Categories</option>
          <option value="cultural">Cultural Activities</option>
          <option value="sports">Sports Activities</option>
        </select>

        {/* Event Filter */}
        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          className="form-input w-full text-xs"
        >
          <option value="all">All Events ({events.length})</option>
          {events.map((evt) => (
            <option key={evt.id} value={evt.id}>
              {evt.name}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-input w-full text-xs"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary-light animate-spin" />
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-light/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Student</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">College</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase hidden md:table-cell">Department</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Event</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-text-muted uppercase">Day</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-text-muted uppercase">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((reg) => {
                  const eventDate = (reg.event as any)?.event_date || 'Day 1';
                  return (
                    <tr key={reg.id} className="border-b border-border hover:bg-surface-light/30 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <span className="text-sm font-semibold text-text-primary block">{reg.full_name}</span>
                          <span className="text-xs font-mono text-primary-light">{reg.registration_id}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium text-text-primary block max-w-[160px] truncate" title={reg.college}>
                          {reg.college}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-text-secondary max-w-[140px] truncate block" title={reg.course}>
                          {reg.course}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium text-text-primary">
                          {(reg.event as any)?.name || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-accent-light font-medium">
                          {eventDate}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${statusColors[reg.status] || ''}`}>
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedReg(reg)}
                            className="p-2 rounded-lg text-text-muted hover:text-primary-light hover:bg-primary/10 transition-all"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <div className="relative group">
                            <button className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-light transition-all">
                              <ChevronDown className="w-4 h-4" />
                            </button>
                            <div className="absolute right-0 top-full mt-1 w-36 glass-strong rounded-xl py-1 hidden group-hover:block z-10 shadow-xl border border-border">
                              {['pending', 'confirmed', 'cancelled'].map((status) => (
                                <button
                                  key={status}
                                  onClick={() => updateStatus(reg.id, status)}
                                  className="block w-full text-left px-4 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-light capitalize transition-colors"
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-text-muted">
                      No registrations match the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="glass-strong rounded-2xl p-6 sm:p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto border border-border">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-border/60">
              <h3 className="text-lg font-semibold text-text-primary">Registration Details</h3>
              <button onClick={() => setSelectedReg(null)} className="p-2 rounded-lg hover:bg-surface-light text-text-muted hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {[
                ['Registration ID', selectedReg.registration_id],
                ['Student Name', selectedReg.full_name],
                ['College / Institution', selectedReg.college],
                ['Department', selectedReg.course],
                ['Roll No / ID', selectedReg.additional_info || 'N/A'],
                ['Email', selectedReg.email],
                ['Phone', selectedReg.phone],
                ['Year', selectedReg.year],
                ['Gender', selectedReg.gender],
                ['Event', (selectedReg.event as any)?.name || 'N/A'],
                ['Event Day', (selectedReg.event as any)?.event_date || 'Day 1'],
                ['Team Name', selectedReg.team_name || 'Individual'],
                ['Status', selectedReg.status],
                ['Registered On', new Date(selectedReg.created_at).toLocaleString('en-IN')],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col sm:flex-row sm:items-start gap-1">
                  <span className="text-xs text-text-muted w-36 shrink-0 font-medium">{label}</span>
                  <span className="text-xs sm:text-sm text-text-primary font-semibold">{value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-6 pt-4 border-t border-border/60">
              {['pending', 'confirmed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => updateStatus(selectedReg.id, status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                    selectedReg.status === status
                      ? statusColors[status]
                      : 'glass text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Mark as {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
