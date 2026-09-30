'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Users,
  Search,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  User,
  GraduationCap,
  Building,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown,
} from 'lucide-react';
import type { Profile, UserRole } from '@/types';

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const supabase = createClient();

  async function fetchUsers() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch profiles:', error);
      } else {
        setProfiles((data as Profile[]) || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleRoleChange(profileId: string, newRole: UserRole) {
    if (profileId === currentUserId) {
      setMessage({ type: 'error', text: 'You cannot change your own role to prevent administrator lockout.' });
      return;
    }

    setActionLoading(profileId);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', profileId);

      if (error) {
        setMessage({ type: 'error', text: `Failed to update role: ${error.message}` });
      } else {
        setMessage({ type: 'success', text: `User role successfully updated to ${newRole}.` });
        setProfiles((prev) =>
          prev.map((p) => (p.id === profileId ? { ...p, role: newRole } : p))
        );
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Error occurred while updating role.' });
    } finally {
      setActionLoading(null);
    }
  }

  const filtered = profiles.filter((p) => {
    const s = search.toLowerCase();
    const matchesSearch =
      search === '' ||
      p.full_name?.toLowerCase().includes(s) ||
      p.roll_number?.toLowerCase().includes(s) ||
      p.college?.toLowerCase().includes(s) ||
      p.department?.toLowerCase().includes(s);

    const matchesRole = roleFilter === 'all' || p.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-primary">
            User &amp; Role Management
          </h1>
          <p className="text-sm text-text-secondary">
            Manage authenticated students, coordinators, and administrator privileges
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-xl glass border border-border text-text-muted">
            Total Users: <strong className="text-text-primary">{profiles.length}</strong>
          </span>
        </div>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-error/10 border-error/30 text-error'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name, roll number, college, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-dark border border-border text-xs text-text-primary focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-surface-dark border border-border text-xs text-text-primary focus:outline-none focus:border-primary"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="organizer">Organizers</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-light/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">User</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Student ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">Institution</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase hidden md:table-cell">Department</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-text-muted uppercase">Role</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase">Role Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const isCurrent = p.id === currentUserId;
                  return (
                    <tr key={p.id} className="border-b border-border hover:bg-surface-light/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-surface-dark border border-border/80 flex items-center justify-center font-bold text-xs text-primary-light flex-shrink-0">
                            {p.full_name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-text-primary block">
                              {p.full_name || 'Anonymous User'}
                              {isCurrent && (
                                <span className="ml-1.5 text-[10px] text-accent-light font-mono">(You)</span>
                              )}
                            </span>
                            <span className="text-[11px] text-text-muted font-mono">{p.id.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-xs font-mono font-semibold text-primary-light block">
                          {p.roll_number || '—'}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-xs text-text-primary block max-w-[180px] truncate" title={p.college}>
                          {p.college || 'R.V.R. & J.C. College of Engineering'}
                        </span>
                      </td>

                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-text-secondary block max-w-[160px] truncate" title={p.department}>
                          {p.department || '—'}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${
                            p.role === 'admin'
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              : p.role === 'organizer'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-primary/20 text-primary-light border border-primary/30'
                          }`}
                        >
                          {p.role}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        {isCurrent ? (
                          <span className="text-[11px] text-text-muted italic">Current Session</span>
                        ) : actionLoading === p.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-primary-light ml-auto" />
                        ) : (
                          <select
                            value={p.role}
                            onChange={(e) => handleRoleChange(p.id, e.target.value as UserRole)}
                            className="px-2.5 py-1 rounded-lg bg-surface-dark border border-border text-xs text-text-primary focus:outline-none focus:border-primary"
                          >
                            <option value="student">Student</option>
                            <option value="organizer">Organizer</option>
                            <option value="admin">Administrator</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-text-muted">
                      No user accounts match the current filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
