'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  Ticket,
  Search,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock3,
  XCircle,
  PlusCircle,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import type { Registration } from '@/types';
import { getStudentData } from '@/actions/student';

export default function StudentRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const supabase = createClient();

  useEffect(() => {
    async function fetchRegistrations() {
      setLoading(true);
      try {
        let user = null;
        try {
          const authRes = await supabase.auth.getUser();
          user = authRes.data?.user || null;
        } catch {
          user = null;
        }

        if (user) {
          const data = await getStudentData(user.id, user.email);
          setRegistrations(data.registrations);
        } else {
          const data = await getStudentData();
          setRegistrations(data.registrations);
        }
      } catch (err) {
        console.warn('Student registrations data notice:', err);
        const data = await getStudentData();
        setRegistrations(data.registrations);
      } finally {
        setLoading(false);
      }
    }
    fetchRegistrations();
  }, []);

  const filtered = registrations.filter((reg) => {
    const s = search.toLowerCase();
    const matchesSearch =
      search === '' ||
      reg.registration_id.toLowerCase().includes(s) ||
      (reg.event?.name && reg.event.name.toLowerCase().includes(s)) ||
      (reg.team_name && reg.team_name.toLowerCase().includes(s));

    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            CONFIRMED
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/15 text-accent-light border border-accent/30">
            <Clock3 className="w-3 h-3" />
            PENDING
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            COMPLETED
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-500/15 text-gray-400 border border-gray-500/30">
            CANCELLED
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
            <XCircle className="w-3 h-3" />
            REJECTED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-surface-light text-text-secondary">
            {status?.toUpperCase()}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-primary">
            My Event Registrations
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Track registration status, entry passes, and schedule for your events
          </p>
        </div>

        <Link
          href="/registration"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-dark shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register for Another Event</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by Registration ID or event name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-dark border border-border text-xs text-text-primary focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-surface-dark border border-border text-xs text-text-primary focus:outline-none focus:border-primary"
          >
            <option value="all">All Statuses ({registrations.length})</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-8 rounded-2xl glass border border-border/80 text-center space-y-3">
          <Ticket className="w-10 h-10 text-text-muted mx-auto" />
          <h3 className="text-sm font-semibold text-text-primary">No Registrations Match Filter</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            {search || statusFilter !== 'all'
              ? 'Try adjusting your search criteria or filter.'
              : 'You have not registered for any events yet.'}
          </p>
          <Link
            href="/registration"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Register for an Event</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((reg) => {
            const evt = reg.event;
            return (
              <div
                key={reg.id}
                className="p-5 rounded-2xl glass border border-border/80 hover:border-primary/40 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          evt?.category === 'sports'
                            ? 'bg-secondary/20 text-secondary-light border border-secondary/30'
                            : 'bg-primary/20 text-primary-light border border-primary/30'
                        }`}
                      >
                        {evt?.category === 'sports' ? 'Sports' : 'Cultural'}
                      </span>
                      <span className="font-mono text-xs font-semibold text-text-muted">
                        Pass ID: {reg.registration_id}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-text-primary mt-1">
                      {evt?.name || 'Festival Competition'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(reg.status)}
                    <Link
                      href={`/student/registrations/${reg.registration_id || reg.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-dark border border-border/80 text-xs font-medium text-text-primary hover:border-primary/50 transition-colors"
                    >
                      <span>View Pass &amp; Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-border/60 text-xs text-text-secondary">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-accent-light" />
                    <span>Schedule: <strong>{evt?.event_date || 'Day 1'}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-secondary-light" />
                    <span>Venue: <strong>{evt?.venue || 'Campus Venue'}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-text-muted" />
                    <span>Registered: <strong>{new Date(reg.created_at).toLocaleDateString()}</strong></span>
                  </div>
                </div>

                {reg.team_name && (
                  <p className="text-xs text-text-muted pt-1">
                    Team: <strong className="text-text-primary">{reg.team_name}</strong>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
