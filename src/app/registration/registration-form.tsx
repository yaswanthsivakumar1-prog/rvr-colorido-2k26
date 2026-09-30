'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { submitRegistration } from '@/actions/registrations';
import {
  Loader2,
  CheckCircle2,
  Printer,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  User,
  GraduationCap,
  Users,
  Trophy,
  Lock,
} from 'lucide-react';
import type { Event, RegistrationFormData, College } from '@/types';

interface RegistrationFormProps {
  events: Event[];
  colleges?: College[];
}

const DEFAULT_COLLEGES: College[] = [
  {
    id: 'col-rvrjc',
    name: 'R.V.R. & J.C. College of Engineering (Autonomous)',
    short_name: 'RVR & JC',
    code: 'RVRJC',
    is_participating: true,
    created_at: '',
  },
  {
    id: 'col-participating-default',
    name: 'Participating College',
    short_name: 'Participating College',
    code: 'PARTICIPATING',
    is_participating: true,
    created_at: '',
  },
];

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

export default function RegistrationForm({ events, colleges }: RegistrationFormProps) {
  const searchParams = useSearchParams();
  const preselectedParam = searchParams.get('event') || '';
  const preselectedEvent = events.find((e) => e.id === preselectedParam || e.slug === preselectedParam);
  const preselectedEventId = preselectedEvent ? preselectedEvent.id : preselectedParam;

  const availableColleges = colleges && colleges.length > 0 ? colleges : DEFAULT_COLLEGES;

  const [categoryFilter, setCategoryFilter] = useState<'all' | 'cultural' | 'sports'>(
    preselectedEvent ? preselectedEvent.category : 'all'
  );

  const [loggedInStudent, setLoggedInStudent] = useState<{
    name: string;
    roll: string;
    email: string;
  } | null>(null);

  const [form, setForm] = useState({
    college: availableColleges[0]?.name || 'R.V.R. & J.C. College of Engineering',
    custom_college: '',
    full_name: '',
    roll_number: '',
    department: '',
    year: '',
    phone: '',
    email: '',
    event_id: preselectedEventId,
    team_name: '',
    agreement: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Auto-detect authenticated student and pre-fill details (Section 6)
  useEffect(() => {
    async function loadStudentProfile() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          setIsAuthenticated(true);
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          const name = profile?.full_name || user.user_metadata?.full_name || '';
          const roll = profile?.roll_number || user.user_metadata?.roll_number || '';
          const phone = profile?.phone || user.user_metadata?.phone || '';
          const dept = profile?.department || user.user_metadata?.department || '';
          const collegeName = profile?.college || user.user_metadata?.college || '';
          const yr = user.user_metadata?.year || YEARS[2];

          setLoggedInStudent({
            name,
            roll,
            email: user.email || '',
          });

          setForm((prev) => ({
            ...prev,
            full_name: name || prev.full_name,
            roll_number: roll || prev.roll_number,
            phone: phone || prev.phone,
            email: user.email || prev.email,
            department: dept || prev.department,
            college: collegeName || prev.college,
            year: yr || prev.year,
          }));
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.warn('Could not auto-fetch user profile for registration:', err);
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    }

    loadStudentProfile();
  }, []);

  const [successData, setSuccessData] = useState<{
    registrationId: string;
    studentName: string;
    college: string;
    rollNumber: string;
    department: string;
    eventName: string;
    category: string;
    day: string;
    venue: string;
    time: string;
    teamName?: string;
  } | null>(null);

  const filteredEvents = events.filter((e) => {
    if (categoryFilter === 'all') return true;
    return e.category === categoryFilter;
  });

  const selectedEvent = events.find((e) => e.id === form.event_id);

  function validate(): boolean {
    const errs: Record<string, string> = {};

    if (!form.college) {
      errs.college = 'Please select your college / institution.';
    }
    if (!form.full_name.trim() || form.full_name.trim().length < 2) {
      errs.full_name = 'Please enter your full name (minimum 2 characters).';
    }
    const roll = form.roll_number.trim().toUpperCase();
    if (!roll || roll.length < 4) {
      errs.roll_number = 'Please enter your valid Student Roll Number / ID.';
    }
    if (!form.department) {
      errs.department = 'Please select your department.';
    }
    if (!form.year) {
      errs.year = 'Please select your year of study.';
    }
    if (!form.phone || !/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) {
      errs.phone = 'Please enter a valid 10-digit mobile number.';
    }
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!form.event_id) {
      errs.event_id = 'Please select an event.';
    }
    if (!form.agreement) {
      errs.agreement = 'You must confirm your student status and agree to rules.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const selectedCollegeName =
        (form.college === 'Participating College' || form.college === 'Other College') && form.custom_college.trim()
          ? form.custom_college.trim()
          : form.college;

      const payload: RegistrationFormData = {
        full_name: form.full_name.trim(),
        roll_number: form.roll_number.trim().toUpperCase(),
        department: form.department,
        year: form.year,
        phone: form.phone.trim(),
        email: form.email.trim().toLowerCase(),
        category: selectedEvent?.category || 'cultural',
        event_id: form.event_id,
        team_name: form.team_name.trim() || undefined,
        agreement: form.agreement,
        college: selectedCollegeName,
        course: form.department,
      };

      const result = await submitRegistration(payload);

      if (!result.success || !result.registrationId) {
        setApiError(result.error || 'Failed to submit registration. Please try again.');
        setIsSubmitting(false);
        return;
      }

      setSuccessData({
        registrationId: result.registrationId,
        studentName: form.full_name.trim(),
        college: selectedCollegeName,
        rollNumber: form.roll_number.trim().toUpperCase(),
        department: form.department,
        eventName: selectedEvent?.name || 'Selected Event',
        category: selectedEvent?.category === 'sports' ? 'Sports' : 'Cultural',
        day: selectedEvent?.event_date || 'Day 1',
        venue: selectedEvent?.venue || 'Campus Venue',
        time: selectedEvent ? `${selectedEvent.start_time} – ${selectedEvent.end_time}` : '',
        teamName: form.team_name.trim() || undefined,
      });
    } catch (err: any) {
      setApiError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // =========================================================================
  // SUCCESS SCREEN (Section 16: Keep this page simple)
  // =========================================================================
  if (successData) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="glass-strong rounded-3xl border border-emerald-500/30 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Header */}
          <div className="text-center space-y-2 pb-6 border-b border-border/60">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-[family-name:var(--font-display)] text-white">
              Registration Successful
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary">
              Your registration for COLORIDO 2K26 has been recorded.
            </p>
          </div>

          {/* Simple Confirmation Card */}
          <div className="my-6 p-6 rounded-2xl bg-[#070712] border border-border/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <span className="text-xs text-text-muted uppercase font-bold tracking-wider">
                Registration ID
              </span>
              <span className="text-lg font-black text-accent-light font-mono">
                {successData.registrationId}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-text-muted block">Student Name</span>
                <span className="font-bold text-text-primary text-sm">{successData.studentName}</span>
              </div>
              <div>
                <span className="text-text-muted block">College / Institution</span>
                <span className="font-bold text-text-primary text-sm">{successData.college}</span>
              </div>
              <div>
                <span className="text-text-muted block">Roll Number / Student ID</span>
                <span className="font-bold text-text-primary text-sm font-mono">{successData.rollNumber}</span>
              </div>
              <div>
                <span className="text-text-muted block">Department</span>
                <span className="font-bold text-text-primary text-sm">{successData.department}</span>
              </div>
              <div>
                <span className="text-text-muted block">Event</span>
                <span className="font-bold text-text-primary text-sm">
                  {successData.eventName} ({successData.category})
                </span>
              </div>
              <div>
                <span className="text-text-muted block">Event Schedule</span>
                <span className="font-bold text-text-primary text-sm">{successData.day}</span>
              </div>
              <div>
                <span className="text-text-muted block">Venue</span>
                <span className="font-bold text-text-primary">{successData.venue}</span>
              </div>
              <div>
                <span className="text-text-muted block">Status</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Registered
                </span>
              </div>
            </div>

            {successData.teamName && (
              <div className="pt-2 border-t border-border/40 text-xs">
                <span className="text-text-muted block">Team Name</span>
                <span className="font-semibold text-text-primary">{successData.teamName}</span>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-surface-light/40 border border-border/50 text-xs text-text-muted text-center">
            Please take a screenshot of this confirmation or note down your <strong>Registration ID</strong>. You must show your College ID card at the venue.
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl glass border border-border text-xs font-semibold text-white hover:bg-white/10 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Confirmation</span>
            </button>
            <button
              onClick={() => {
                setSuccessData(null);
                setForm({
                  college: availableColleges[0]?.name || 'R.V.R. & J.C. College of Engineering',
                  custom_college: '',
                  full_name: '',
                  roll_number: '',
                  department: '',
                  year: '',
                  phone: '',
                  email: '',
                  event_id: '',
                  team_name: '',
                  agreement: false,
                });
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-light transition-colors"
            >
              <span>Register Another Event</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/student/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white/10 border border-border text-xs font-semibold text-text-primary hover:bg-white/20 transition-colors"
            >
              <span>Go to My Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Gate: If not authenticated, prompt student to login/sign up first
  if (authChecked && !isAuthenticated) {
    return (
      <div className="glass rounded-3xl p-8 sm:p-12 border border-border/80 shadow-2xl text-center space-y-6 max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center mx-auto shadow-xl shadow-primary/30">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <div className="space-y-2">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary-light border border-primary/30">
            Student Portal Authentication
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-display)] text-text-primary">
            Student Login Required
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            To register for COLORIDO 2K26 cultural and sports events, please sign in with your student account or create an account first.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/login?redirect=/registration"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-[1.01]"
          >
            <User className="w-4 h-4" />
            <span>Sign In to Register</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login?tab=signup&redirect=/registration"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-border text-text-primary text-sm font-bold transition-all hover:scale-[1.01]"
          >
            <Sparkles className="w-4 h-4 text-accent-light" />
            <span>Create Student Account (Sign Up)</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsAuthenticated(true)}
            className="text-xs text-text-muted hover:text-text-primary transition-colors underline pt-2 block mx-auto"
          >
            Continue as Guest / Manual Registration
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // REGISTRATION FORM (Immediately visible for individuals & teams)
  // =========================================================================
  return (
    <form noValidate onSubmit={handleSubmit} className="glass rounded-3xl p-6 sm:p-10 border border-border/80 shadow-2xl space-y-6">
      {/* Header distinguishing Event Registration from Student Portal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/60 gap-3">
        <div>
          <span className="text-[11px] font-bold text-primary-light uppercase tracking-wider block">
            Individual &amp; Team Event Registration
          </span>
          <h2 className="text-lg font-bold text-text-primary">
            Official Festival Participation Entry Form
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Fill in your details to register for events and receive your festival pass.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold glass border border-primary/30 text-primary-light hover:text-white hover:bg-primary/20 transition-colors"
          >
            <User className="w-3.5 h-3.5" />
            <span>Student Portal / Website Login →</span>
          </Link>
        </div>
      </div>

      {/* Logged in student notice */}
      {loggedInStudent && (
        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-primary-light flex-shrink-0" />
            <div>
              <span className="font-semibold text-text-primary block">
                Signed in as {loggedInStudent.name || 'Student'} ({loggedInStudent.roll || 'Verified'})
              </span>
              <span className="text-text-secondary text-[11px]">
                Your student profile details have been automatically pre-filled. Only choose your event and team details below.
              </span>
            </div>
          </div>
          <Link
            href="/student/dashboard"
            className="text-xs text-primary-light hover:underline font-semibold flex items-center gap-1 flex-shrink-0"
          >
            <span>My Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {apiError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-xs sm:text-sm text-red-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Category selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
          1. Select Category
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'all', label: 'All Events' },
            { id: 'cultural', label: 'Cultural' },
            { id: 'sports', label: 'Sports' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setCategoryFilter(cat.id as any);
                setForm((prev) => ({ ...prev, event_id: '' }));
              }}
              className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                categoryFilter === cat.id
                  ? 'bg-primary text-white shadow-md shadow-primary/30 border border-primary-light/40'
                  : 'glass text-text-secondary hover:text-white border border-border'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Event selection */}
      <div className="space-y-1.5">
        <label htmlFor="event_id" className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
          2. Select Event <span className="text-red-400">*</span>
        </label>
        <select
          id="event_id"
          value={form.event_id}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, event_id: e.target.value }));
            setErrors((prev) => ({ ...prev, event_id: '' }));
          }}
          className={`w-full px-4 py-3 rounded-xl bg-surface-dark border text-text-primary text-sm focus:outline-none focus:border-primary transition-colors ${
            errors.event_id ? 'border-red-500' : 'border-border'
          }`}
        >
          <option className="bg-[#121226] text-white" value="">-- Choose an event --</option>
          {filteredEvents.map((evt) => (
            <option className="bg-[#121226] text-white" key={evt.id} value={evt.id}>
              {evt.name} ({evt.category === 'sports' ? `Sports - ${evt.gender}` : 'Cultural'}) — {evt.event_date}
            </option>
          ))}
        </select>
        {errors.event_id && <p className="text-[11px] text-red-400">{errors.event_id}</p>}

        {selectedEvent && selectedEvent.registration_open === false && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2 mt-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>Registration for &quot;{selectedEvent.name}&quot; has been closed by event coordinators.</span>
          </div>
        )}

        {selectedEvent && (
          <div className="p-3 rounded-xl bg-surface-light/40 border border-border/50 text-xs text-text-muted mt-2 space-y-1">
            <div className="flex items-center gap-2 text-text-secondary">
              <Calendar className="w-3.5 h-3.5 text-accent-light" />
              <span>Schedule: <strong>{selectedEvent.event_date}</strong> ({selectedEvent.start_time} – {selectedEvent.end_time})</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-secondary-light" />
              <span>Venue: <strong>{selectedEvent.venue}</strong></span>
            </div>
            {selectedEvent.max_participants > 0 && (
              <div className="flex items-center gap-2 text-text-muted pt-1">
                <Users className="w-3.5 h-3.5 text-primary-light" />
                <span>Max Participants: {selectedEvent.max_participants}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-border/60">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-4">
          3. Student Information
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* College / Institution */}
          <div className="sm:col-span-2 space-y-1">
            <label htmlFor="college" className="text-xs font-medium text-text-secondary">
              College / Institution <span className="text-red-400">*</span>
            </label>
            <select
              id="college"
              name="college"
              value={form.college}
              onChange={(e) => setForm({ ...form, college: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-surface-dark border text-sm text-text-primary focus:outline-none focus:border-primary ${
                errors.college ? 'border-red-500' : 'border-border'
              }`}
            >
              {availableColleges.map((c) => (
                <option className="bg-[#121226] text-white" key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            {(form.college === 'Participating College' || form.college === 'Other College') && (
              <div className="pt-2">
                <input
                  type="text"
                  id="custom_college"
                  name="custom_college"
                  placeholder="Enter your college name"
                  value={form.custom_college}
                  onChange={(e) => setForm({ ...form, custom_college: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:outline-none focus:border-primary"
                />
              </div>
            )}
            {errors.college && <p className="text-[11px] text-red-400">{errors.college}</p>}
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label htmlFor="full_name" className="text-xs font-medium text-text-secondary">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              id="full_name"
              type="text"
              placeholder="e.g. K. Sai Kumar"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-surface-dark border text-sm text-text-primary focus:outline-none focus:border-primary ${
                errors.full_name ? 'border-red-500' : 'border-border'
              }`}
            />
            {errors.full_name && <p className="text-[11px] text-red-400">{errors.full_name}</p>}
          </div>

          {/* Roll Number / Student ID */}
          <div className="space-y-1">
            <label htmlFor="roll_number" className="text-xs font-medium text-text-secondary">
              Student ID / Roll Number <span className="text-red-400">*</span>
            </label>
            <input
              id="roll_number"
              type="text"
              placeholder="e.g. Y22CS012 / Student ID"
              value={form.roll_number}
              onChange={(e) => setForm({ ...form, roll_number: e.target.value.toUpperCase() })}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-surface-dark border text-sm text-text-primary font-mono uppercase focus:outline-none focus:border-primary ${
                errors.roll_number ? 'border-red-500' : 'border-border'
              }`}
            />
            {errors.roll_number && <p className="text-[11px] text-red-400">{errors.roll_number}</p>}
          </div>

          {/* Department */}
          <div className="space-y-1">
            <label htmlFor="department" className="text-xs font-medium text-text-secondary">
              Department <span className="text-red-400">*</span>
            </label>
            <select
              id="department"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-surface-dark border text-sm text-text-primary focus:outline-none focus:border-primary ${
                errors.department ? 'border-red-500' : 'border-border'
              }`}
            >
              <option className="bg-[#121226] text-white" value="">-- Select Department --</option>
              {DEPARTMENTS.map((dept) => (
                <option className="bg-[#121226] text-white" key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && <p className="text-[11px] text-red-400">{errors.department}</p>}
          </div>

          {/* Year */}
          <div className="space-y-1">
            <label htmlFor="year" className="text-xs font-medium text-text-secondary">
              Year of Study <span className="text-red-400">*</span>
            </label>
            <select
              id="year"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-surface-dark border text-sm text-text-primary focus:outline-none focus:border-primary ${
                errors.year ? 'border-red-500' : 'border-border'
              }`}
            >
              <option className="bg-[#121226] text-white" value="">-- Select Year --</option>
              {YEARS.map((yr) => (
                <option className="bg-[#121226] text-white" key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
            {errors.year && <p className="text-[11px] text-red-400">{errors.year}</p>}
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label htmlFor="phone" className="text-xs font-medium text-text-secondary">
              Phone Number (10 digits) <span className="text-red-400">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="e.g. 9848012345"
              maxLength={10}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-surface-dark border text-sm text-text-primary focus:outline-none focus:border-primary ${
                errors.phone ? 'border-red-500' : 'border-border'
              }`}
            />
            {errors.phone && <p className="text-[11px] text-red-400">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-medium text-text-secondary">
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="e.g. student@rvrjc.ac.in"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-surface-dark border text-sm text-text-primary focus:outline-none focus:border-primary ${
                errors.email ? 'border-red-500' : 'border-border'
              }`}
            />
            {errors.email && <p className="text-[11px] text-red-400">{errors.email}</p>}
          </div>
        </div>

        {/* Team Name if applicable */}
        <div className="mt-4 space-y-1">
          <label htmlFor="team_name" className="text-xs font-medium text-text-secondary">
            Team Name <span className="text-text-muted">(Optional — only for group/team events)</span>
          </label>
          <input
            id="team_name"
            type="text"
            placeholder="e.g. CSE Warriors, RVR Rhythm Crew"
            value={form.team_name}
            onChange={(e) => setForm({ ...form, team_name: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Agreement checkbox */}
      <div className="pt-2 border-t border-border/60">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.agreement}
            onChange={(e) => setForm({ ...form, agreement: e.target.checked })}
            className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 bg-surface-dark"
          />
          <span className="text-xs text-text-secondary leading-relaxed">
            I confirm that I am a current student of <strong className="text-text-primary">R.V.R. &amp; J.C. College of Engineering</strong> or an <strong className="text-text-primary">eligible participating college</strong>. I agree to carry my college physical ID card to the venue and adhere to all festival rules and campus regulations.
          </span>
        </label>
        {errors.agreement && <p className="text-[11px] text-red-400 mt-1">{errors.agreement}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || (selectedEvent && selectedEvent.registration_open === false)}
        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-white font-bold text-sm uppercase tracking-wider shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Submitting Registration...</span>
          </>
        ) : selectedEvent && selectedEvent.registration_open === false ? (
          <span>Registration Closed</span>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-accent-light" />
            <span>Submit Registration</span>
          </>
        )}
      </button>
    </form>
  );
}
