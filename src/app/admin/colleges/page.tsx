'use client';

import { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Edit2,
  CheckCircle2,
  XCircle,
  Loader2,
  Search,
  Check,
  X,
} from 'lucide-react';
import type { College } from '@/types';
import {
  getColleges,
  createCollege,
  updateCollege,
  toggleCollegeParticipation,
} from '@/actions/colleges';

export default function AdminCollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formShortName, setFormShortName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formIsParticipating, setFormIsParticipating] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function loadColleges() {
    setLoading(true);
    try {
      const data = await getColleges();
      setColleges(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadColleges();
  }, []);

  function resetForm() {
    setFormName('');
    setFormShortName('');
    setFormCode('');
    setFormIsParticipating(true);
    setIsAdding(false);
    setEditingId(null);
    setErrorMsg(null);
  }

  function startEdit(college: College) {
    setIsAdding(false);
    setEditingId(college.id);
    setFormName(college.name);
    setFormShortName(college.short_name);
    setFormCode(college.code);
    setFormIsParticipating(college.is_participating);
    setErrorMsg(null);
  }

  async function handleSaveNew(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim()) {
      setErrorMsg('College name is required');
      return;
    }
    setFormSubmitting(true);
    setErrorMsg(null);
    try {
      const result = await createCollege({
        name: formName.trim(),
        short_name: formShortName.trim() || formName.trim(),
        code: (formCode || 'COL').trim().toUpperCase(),
        is_participating: formIsParticipating,
      });

      if (!result.success) {
        setErrorMsg(result.error || 'Failed to add college');
      } else {
        await loadColleges();
        resetForm();
      }
    } catch {
      setErrorMsg('An unexpected error occurred');
    } finally {
      setFormSubmitting(false);
    }
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId || !formName.trim()) {
      setErrorMsg('College name is required');
      return;
    }
    setFormSubmitting(true);
    setErrorMsg(null);
    try {
      const result = await updateCollege(editingId, {
        name: formName.trim(),
        short_name: formShortName.trim() || formName.trim(),
        code: (formCode || 'COL').trim().toUpperCase(),
        is_participating: formIsParticipating,
      });

      if (!result.success) {
        setErrorMsg(result.error || 'Failed to update college');
      } else {
        await loadColleges();
        resetForm();
      }
    } catch {
      setErrorMsg('An unexpected error occurred');
    } finally {
      setFormSubmitting(false);
    }
  }

  async function handleToggle(id: string, currentStatus: boolean) {
    await toggleCollegeParticipation(id, !currentStatus);
    await loadColleges();
  }

  const filteredColleges = colleges.filter((c) => {
    const s = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(s) ||
      c.short_name.toLowerCase().includes(s) ||
      c.code.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-primary">
            Participating Colleges
          </h1>
          <p className="text-sm text-text-secondary">
            Manage institutions eligible to participate in COLORIDO 2K26.
          </p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => {
              resetForm();
              setIsAdding(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary-light transition-all shadow-md shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add College</span>
          </button>
        )}
      </div>

      {/* Add / Edit Form Modal/Card */}
      {(isAdding || editingId) && (
        <div className="glass-strong p-6 rounded-2xl border border-primary/40 space-y-4 animate-fade-in-up">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-base font-bold text-text-primary">
              {isAdding ? 'Add Participating College' : 'Edit College Details'}
            </h3>
            <button
              onClick={resetForm}
              className="p-1 rounded-lg text-text-muted hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={isAdding ? handleSaveNew : handleSaveEdit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-medium text-text-secondary">
                  College Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vignan University / Vasireddy Venkatadri Institute"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary">
                  Short Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. VVIT / VRSEC"
                  value={formShortName}
                  onChange={(e) => setFormShortName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary">
                  College Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. RVRJC / PARTICIPATING"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-dark border border-border text-sm text-text-primary uppercase font-mono focus:outline-none focus:border-primary"
                />
              </div>

              <div className="sm:col-span-2 flex items-center gap-3 pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-text-primary">
                  <input
                    type="checkbox"
                    checked={formIsParticipating}
                    onChange={(e) => setFormIsParticipating(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-0 bg-surface-dark"
                  />
                  <span>Participation Status Enabled (Active for Registration)</span>
                </label>
              </div>
            </div>

            {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={formSubmitting}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary-light transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {formSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                <span>{isAdding ? 'Save College' : 'Update College'}</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-xl glass border border-border text-text-secondary hover:text-white text-xs font-medium transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search colleges by name or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input pl-10 w-full"
        />
      </div>

      {/* College Table */}
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
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">
                    Code
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase">
                    Institution / College Name
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase hidden sm:table-cell">
                    Short Name
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-text-muted uppercase">
                    Status
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-text-muted uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredColleges.map((col) => (
                  <tr
                    key={col.id}
                    className="border-b border-border hover:bg-surface-light/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono font-bold text-accent-light">
                        {col.code}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary-light flex-shrink-0" />
                        <span className="text-sm font-semibold text-text-primary">
                          {col.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs text-text-secondary">{col.short_name}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggle(col.id, col.is_participating)}
                        title="Click to toggle status"
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full cursor-pointer transition-transform hover:scale-105 ${
                          col.is_participating
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {col.is_participating ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Participating</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Disabled</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => startEdit(col)}
                        className="p-2 rounded-lg text-text-muted hover:text-primary-light hover:bg-primary/10 transition-all"
                        title="Edit college"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredColleges.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-text-muted">
                      No participating colleges found.
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
