'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  User,
  GraduationCap,
  Building,
  Hash,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
} from 'lucide-react';
import type { Profile } from '@/types';
import { getStudentData } from '@/actions/student';

const DEPARTMENTS = [
  'Computer Science & Engineering (CSE)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering (MECH)',
  'Civil Engineering (CIVIL)',
  'Information Technology (IT)',
  'Chemical Engineering (CHEM)',
  'Computer Science & Business Systems (CSBS)',
  'Artificial Intelligence & Data Science (AI & DS)',
  'CSE - Internet of Things (IoT)',
  'Master of Computer Applications (MCA)',
  'Master of Business Administration (MBA)',
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Post Graduate (PG)'];

export default function StudentProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  // Editable fields
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [year, setYear] = useState(YEARS[2]);
  const [college, setCollege] = useState('R.V.R. & J.C. College of Engineering (Autonomous)');
  const [customCollege, setCustomCollege] = useState('');

  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserEmail(user.email || '');
          const data = await getStudentData(user.id, user.email);
          if (data.profile) {
            setProfile(data.profile);
            setPhone(data.profile.phone || '');
            if (data.profile.department) setDepartment(data.profile.department);
            if (data.profile.college) {
              if (data.profile.college.includes('R.V.R.')) {
                setCollege('R.V.R. & J.C. College of Engineering (Autonomous)');
              } else {
                setCollege('Other College');
                setCustomCollege(data.profile.college);
              }
            }
          }
        } else {
          const fallback = await getStudentData();
          if (fallback.profile) {
            setProfile(fallback.profile);
            setPhone(fallback.profile.phone || '9876543210');
            setUserEmail('student@rvrjc.ac.in');
          }
        }
      } catch (err) {
        console.error('Error fetching student profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      setError('Please provide a valid 10-digit mobile phone number.');
      return;
    }

    const chosenCollege =
      college === 'Other College' && customCollege.trim()
        ? customCollege.trim()
        : college;

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Strict safe update: only update permitted personal fields. Never update role or id!
        const { error: updateErr } = await supabase
          .from('profiles')
          .update({
            phone: cleanPhone,
            department: department,
            college: chosenCollege,
          })
          .eq('id', user.id);

        if (updateErr) {
          setError(updateErr.message);
          setSaving(false);
          return;
        }

        // Also update Supabase auth metadata
        await supabase.auth.updateUser({
          data: {
            phone: cleanPhone,
            department: department,
            college: chosenCollege,
            year: year,
          },
        });
      }

      setSuccess('Profile updated successfully!');
      if (profile) {
        setProfile({
          ...profile,
          phone: cleanPhone,
          department: department,
          college: chosenCollege,
        });
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-primary">
          Student Profile Settings
        </h1>
        <p className="text-xs text-text-secondary mt-0.5">
          View your verified participant credentials and keep your contact details current
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-error/10 border border-error/30 text-xs text-error flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Identity Card (Non-editable locked fields) */}
      <div className="p-5 rounded-2xl glass border border-border/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Verified Academic Identity
            </h2>
          </div>
          <span className="text-[10px] text-text-muted">Managed by Registrar &amp; Registration Desk</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-surface-dark border border-border/60">
            <span className="text-[10px] text-text-muted uppercase tracking-wider block">Full Name</span>
            <span className="font-semibold text-text-primary text-sm mt-0.5 block">{profile?.full_name || 'Participant'}</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-dark border border-border/60">
            <span className="text-[10px] text-text-muted uppercase tracking-wider block">Student ID / Roll Number</span>
            <span className="font-mono font-semibold text-text-primary text-sm mt-0.5 block">{profile?.roll_number || 'N/A'}</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-dark border border-border/60">
            <span className="text-[10px] text-text-muted uppercase tracking-wider block">Registered Email</span>
            <span className="font-medium text-text-primary mt-0.5 block">{userEmail || 'N/A'}</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-dark border border-border/60">
            <span className="text-[10px] text-text-muted uppercase tracking-wider block">Platform Role</span>
            <span className="font-semibold text-primary-light uppercase mt-0.5 block">{profile?.role || 'student'}</span>
          </div>
        </div>
      </div>

      {/* Editable Information Form */}
      <form onSubmit={handleSave} className="p-5 rounded-2xl glass border border-border/80 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
          Contact &amp; Academic Details
        </h2>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">Phone Number *</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="tel"
              required
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-dark border border-border text-xs text-text-primary focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">College / Institution *</label>
          <select
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-surface-dark border border-border text-xs text-text-primary focus:outline-none focus:border-primary"
          >
            <option value="R.V.R. & J.C. College of Engineering (Autonomous)">R.V.R. & J.C. College of Engineering (Autonomous)</option>
            <option value="Other College">Other Participating College</option>
          </select>
          {college === 'Other College' && (
            <input
              type="text"
              required
              placeholder="Enter full college name"
              value={customCollege}
              onChange={(e) => setCustomCollege(e.target.value)}
              className="w-full mt-2 px-3 py-2 rounded-xl bg-surface-dark border border-border text-xs text-text-primary focus:outline-none focus:border-primary"
            />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Department / Branch *</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-dark border border-border text-xs text-text-primary focus:outline-none focus:border-primary"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">Year of Study *</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-dark border border-border text-xs text-text-primary focus:outline-none focus:border-primary"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
