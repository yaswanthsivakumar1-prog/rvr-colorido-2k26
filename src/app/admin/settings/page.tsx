'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Settings,
  Database,
  ShieldCheck,
  Calendar,
  Building,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [toggleLoading, setToggleLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const supabase = createClient();

  async function handleToggleAllRegistrations(open: boolean) {
    setToggleLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase
        .from('events')
        .update({ registration_open: open });

      if (error) {
        setMessage({ type: 'error', text: `Failed to update registrations: ${error.message}` });
      } else {
        setMessage({
          type: 'success',
          text: `All event registrations have been successfully ${open ? 'OPENED' : 'CLOSED'}.`,
        });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Unexpected error occurred.' });
    } finally {
      setToggleLoading(false);
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-primary">
          Platform Settings &amp; System Configuration
        </h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Manage event registration deadlines, college policies, and database connection status
        </p>
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

      {/* Global Registration Controls */}
      <div className="p-6 rounded-2xl glass border border-border/80 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border/60">
          <Calendar className="w-4 h-4 text-primary-light" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-primary">
            Event Registration Controls
          </h2>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed">
          Manage the public availability of the registration form. When closed, students will see
          &quot;Registration Closed&quot; on event cards and will be prevented from submitting new registrations.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => handleToggleAllRegistrations(true)}
            disabled={toggleLoading}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            {toggleLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            <span>Open All Event Registrations</span>
          </button>

          <button
            onClick={() => handleToggleAllRegistrations(false)}
            disabled={toggleLoading}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            {toggleLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <AlertCircle className="w-3.5 h-3.5" />}
            <span>Close All Event Registrations</span>
          </button>
        </div>
      </div>

      {/* Supabase Connection Status */}
      <div className="p-6 rounded-2xl glass border border-border/80 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border/60">
          <Database className="w-4 h-4 text-secondary-light" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-primary">
            Database &amp; Supabase Integration Status
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-surface-dark border border-border/60 space-y-1">
            <span className="text-[10px] text-text-muted uppercase tracking-wider block">Supabase Endpoint</span>
            <span className="font-mono text-text-primary block truncate">
              {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Configured in Environment'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-dark border border-border/60 space-y-1">
            <span className="text-[10px] text-text-muted uppercase tracking-wider block">Authentication Provider</span>
            <span className="font-semibold text-emerald-400 block">Supabase Auth (SSR Enabled)</span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-dark border border-border/60 space-y-1">
            <span className="text-[10px] text-text-muted uppercase tracking-wider block">Primary Key Strategy</span>
            <span className="font-semibold text-text-primary block">Database UUIDs (canonical)</span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-dark border border-border/60 space-y-1">
            <span className="text-[10px] text-text-muted uppercase tracking-wider block">Security &amp; Policies</span>
            <span className="font-semibold text-text-primary block">Row Level Security (RLS) Active</span>
          </div>
        </div>
      </div>

      {/* Security Best Practices */}
      <div className="p-6 rounded-2xl glass border border-border/80 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-border/60">
          <ShieldCheck className="w-4 h-4 text-accent-light" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-primary">
            Security &amp; Authorization Policy
          </h2>
        </div>

        <ul className="text-xs text-text-secondary space-y-2 list-disc list-inside leading-relaxed">
          <li>Admin and coordinator rights are strictly validated via the database <code>profiles.role</code> column.</li>
          <li>Middleware guards all <code>/admin/*</code> routes and redirects unauthorized visitors automatically.</li>
          <li>Never share the Supabase Service-Role key in frontend environment variables.</li>
        </ul>
      </div>
    </div>
  );
}
