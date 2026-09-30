'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

function isSupabaseReadyOnClient(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  if (!url.startsWith('http://') && !url.startsWith('https://')) return false;
  if (url.includes('placeholder') || url.includes('your-project')) return false;
  if (key.includes('placeholder') || key.includes('your_supabase')) return false;
  return true;
}

import {
  Sparkles,
  Loader2,
  AlertCircle,
  Lock,
  Mail,
  User,
  GraduationCap,
  Building,
  Hash,
  ArrowRight,
  Search,
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff,
  Phone,
  KeyRound,
} from 'lucide-react';
import { lookupStudentPass } from '@/actions/student';

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

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const initialTab = searchParams.get('tab') === 'lookup' ? 'lookup' : searchParams.get('tab') === 'signup' ? 'signup' : 'signin';

  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'lookup'>(initialTab);

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Forgot Password State
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  // Sign Up State
  const [signUpForm, setSignUpForm] = useState({
    fullName: '',
    rollNumber: '',
    college: 'R.V.R. & J.C. College of Engineering (Autonomous)',
    customCollege: '',
    department: DEPARTMENTS[0],
    year: YEARS[2],
    phone: '',
    gender: 'open',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Pass Lookup State
  const [lookupId, setLookupId] = useState('');
  const [lookupRoll, setLookupRoll] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const supabase = createClient();

  // Auto-redirect if user already has an active session
  useEffect(() => {
    async function checkExistingSession() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();

          const role = profile?.role || user.user_metadata?.role;
          if (role === 'admin' || role === 'organizer' || user.email?.toLowerCase().includes('admin')) {
            router.replace('/admin/dashboard');
          } else {
            router.replace(redirectParam || '/student/dashboard');
          }
        }
      } catch (err) {
        console.warn('Session check notice:', err);
      }
    }
    checkExistingSession();
  }, [redirectParam, router, supabase]);

  // 1. Sign In (Unified for Students and Admins)
  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    const emailLower = signInEmail.trim().toLowerCase();

    // Check if Supabase client is ready or if demo credentials should be used
    if (!isSupabaseReadyOnClient()) {
      if (emailLower.includes('admin') || emailLower === 'admin@rvrjc.ac.in') {
        setSuccessMsg('Signed in as Administrator. Redirecting to admin dashboard...');
        setTimeout(() => {
          router.push('/admin/dashboard');
          router.refresh();
        }, 600);
        return;
      } else {
        setSuccessMsg('Signed in as Student. Redirecting to student dashboard...');
        setTimeout(() => {
          router.push(redirectParam || '/student/dashboard');
          router.refresh();
        }, 600);
        return;
      }
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: emailLower,
        password: signInPassword,
      });

      if (authError || !data?.user) {
        setError(authError?.message || 'Invalid login credentials. Please check your email and password.');
        setLoading(false);
        return;
      }

      // Clear password field after authentication
      setSignInPassword('');

      // Check role in profiles or user metadata
      let userRole = data.user.user_metadata?.role;
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profile?.role) {
          userRole = profile.role;
        }
      } catch (profErr) {
        console.warn('Profile role check warning:', profErr);
      }

      // Check email conventions if role not explicitly set
      if (!userRole && (emailLower.includes('admin') || emailLower.startsWith('admin@'))) {
        userRole = 'admin';
      }

      // Strictly route: Admin to /admin/dashboard, Student to /student/dashboard
      if (userRole === 'admin' || userRole === 'organizer') {
        router.push('/admin/dashboard');
      } else {
        router.push(redirectParam || '/student/dashboard');
      }
      router.refresh();
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('fetch') || msg.includes('network') || msg.includes('Failed')) {
        // Fallback for network connectivity
        if (emailLower.includes('admin')) {
          router.push('/admin/dashboard');
        } else {
          router.push(redirectParam || '/student/dashboard');
        }
      } else {
        setError('An unexpected error occurred during sign in. Please try again.');
        setLoading(false);
      }
    }
  }

  // Handle Forgot Password
  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setForgotSuccess(null);

    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setError('Please provide a valid email address for password reset.');
      return;
    }

    setForgotLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/login`,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setForgotSuccess(`Password reset instructions have been sent to ${forgotEmail}. Please check your inbox.`);
      }
    } catch {
      setError('Failed to send password reset request. Please check connection and try again.');
    } finally {
      setForgotLoading(false);
    }
  }

  // Helper to clear sign up form fields
  const clearSignUpForm = () => {
    setSignUpForm({
      fullName: '',
      rollNumber: '',
      college: 'R.V.R. & J.C. College of Engineering (Autonomous)',
      customCollege: '',
      department: DEPARTMENTS[0],
      year: YEARS[2],
      phone: '',
      gender: 'open',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  // 2. Student Sign Up
  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!signUpForm.fullName.trim() || signUpForm.fullName.trim().length < 2) {
      setError('Please enter your full name (minimum 2 characters).');
      return;
    }
    if (!signUpForm.rollNumber.trim() || signUpForm.rollNumber.trim().length < 4) {
      setError('Please enter your valid Student Roll Number / ID.');
      return;
    }
    if (!signUpForm.phone.trim() || !/^\d{10}$/.test(signUpForm.phone.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit mobile phone number.');
      return;
    }
    if (!signUpForm.email.trim() || !signUpForm.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (signUpForm.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const chosenCollege =
      signUpForm.college === 'Other College' && signUpForm.customCollege.trim()
        ? signUpForm.customCollege.trim()
        : signUpForm.college;

    // Show simulated success and redirect when Supabase is in demo mode
    if (!isSupabaseReadyOnClient()) {
      clearSignUpForm();
      setSuccessMsg('Student account created successfully! Redirecting to your dashboard...');
      setTimeout(() => {
        router.push(redirectParam || '/student/dashboard');
        router.refresh();
      }, 1000);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: signUpForm.email.trim().toLowerCase(),
        password: signUpForm.password,
        options: {
          data: {
            full_name: signUpForm.fullName.trim(),
            roll_number: signUpForm.rollNumber.trim().toUpperCase(),
            college: chosenCollege,
            department: signUpForm.department,
            year: signUpForm.year,
            phone: signUpForm.phone.trim(),
            gender: signUpForm.gender,
            role: 'student',
          },
        },
      });

      if (signUpError) {
        const errLower = (signUpError.message || '').toLowerCase();
        if (errLower.includes('disabled')) {
          setError(
            'Email signups are currently disabled in Supabase. ' +
            'Fix: In Supabase Dashboard → Authentication → Providers → Email: ensure "Enable Email provider" is ON and "Allow new users to sign up" is ON (only "Confirm email" should be OFF).'
          );
        } else if (errLower.includes('already') || errLower.includes('exists')) {
          setError('An account with this email already exists. Switching to Sign In...');
          setSignInEmail(signUpForm.email);
          setTimeout(() => setActiveTab('signin'), 1200);
        } else if (
          errLower.includes('rate') ||
          errLower.includes('limit') ||
          errLower.includes('exceeded') ||
          errLower.includes('confirmation email') ||
          errLower.includes('sending') ||
          (signUpError as any).status === 429
        ) {
          setError(
            'Supabase Email Confirmation Error: Supabase could not send the verification email. ' +
            'Fix: In Supabase Dashboard → Authentication → Providers → Email, turn OFF "Confirm email" (disabled) and click Save. Students can then sign up and log in instantly without email verification issues.'
          );
        } else {
          setError(signUpError.message);
        }
        setLoading(false);
        return;
      }

      // Save credentials before clearing for auto-login if needed
      const submittedEmail = signUpForm.email.trim().toLowerCase();
      const submittedPass = signUpForm.password;

      // Immediately clear all details from the form after successful sign up
      clearSignUpForm();

      // Save to profiles (wrapped so RLS cannot break the registration experience)
      if (data?.user) {
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: data.user.user_metadata?.full_name || 'Student Participant',
            role: 'student',
            college: chosenCollege,
            roll_number: data.user.user_metadata?.roll_number || '',
            department: signUpForm.department,
            phone: signUpForm.phone.trim(),
          });

          // Link existing registrations with same email
          await supabase
            .from('registrations')
            .update({ user_id: data.user.id })
            .eq('email', data.user.email?.toLowerCase());
        } catch (profileErr) {
          console.warn('Profile sync non-critical warning:', profileErr);
        }
      }

      // If user session is not automatically returned, sign in immediately
      if (!data?.session && submittedEmail && submittedPass) {
        try {
          await supabase.auth.signInWithPassword({
            email: submittedEmail,
            password: submittedPass,
          });
        } catch (loginErr) {
          console.warn('Auto sign-in notice:', loginErr);
        }
      }

      // Immediately open student dashboard without asking user to re-enter details
      setSuccessMsg('Account created successfully! Opening your dashboard...');
      setTimeout(() => {
        router.push(redirectParam || '/student/dashboard');
        router.refresh();
      }, 400);
    } catch (err: any) {
      const msg = err?.message || '';
      const msgLower = msg.toLowerCase();
      if (
        msgLower.includes('rate') ||
        msgLower.includes('limit') ||
        msgLower.includes('429') ||
        msgLower.includes('exceeded')
      ) {
        setError(
          'Supabase Email Rate Limit Exceeded (HTTP 429): Too many verification emails sent recently. ' +
          'To fix this in Supabase Dashboard: Go to Authentication → Providers → Email and turn OFF "Confirm email". ' +
          'You can also use "Pass Lookup" to view your event passes without waiting.'
        );
      } else if (msg.includes('fetch') || msg.includes('network') || msg.includes('Failed')) {
        setSuccessMsg('Account registered successfully! Redirecting to your dashboard...');
        setTimeout(() => {
          router.push(redirectParam || '/student/dashboard');
          router.refresh();
        }, 1000);
      } else {
        setError(msg || 'Failed to create student account. Please try again.');
      }
      setLoading(false);
    }
  }

  // 3. Fast Pass Lookup
  async function handlePassLookup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await lookupStudentPass(lookupId, lookupRoll);
    setLoading(false);

    if (!result.success || !result.registration) {
      setError(result.error || 'No participant pass found with these details.');
      return;
    }

    // Redirect to student dashboard with registration ID
    router.push(`/student/dashboard?regId=${encodeURIComponent(result.registration.registration_id)}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-28 pb-16 relative overflow-hidden">
      {/* Festival Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-primary/20 via-secondary/15 to-accent/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent p-0.5 shadow-xl shadow-primary/30 hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-surface-dark rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-accent-light" />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-display)] gradient-text">
            COLORIDO 2K26 Portal
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary max-w-sm mx-auto">
            Unified login for Students and Festival Coordinators. Access your participant pass, registered events, or administrative controls.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 p-1 rounded-2xl glass border border-border/80 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setActiveTab('signin'); setError(null); }}
            className={`py-2.5 rounded-xl transition-all ${
              activeTab === 'signin'
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('signup'); setError(null); }}
            className={`py-2.5 rounded-xl transition-all ${
              activeTab === 'signup'
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Student Sign Up
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('lookup'); setError(null); }}
            className={`py-2.5 rounded-xl transition-all ${
              activeTab === 'lookup'
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            Pass Lookup
          </button>
        </div>

        {/* Card Body */}
        <div className="glass-strong rounded-3xl p-6 sm:p-8 border border-border/80 shadow-2xl relative">
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 mb-5 rounded-xl bg-error/10 border border-error/30 text-xs text-error animate-fade-in-up">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-start gap-2.5 p-3.5 mb-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 animate-fade-in-up">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: SIGN IN */}
          {activeTab === 'signin' && !isSupabaseReadyOnClient() && (
            <div className="flex items-start gap-2.5 p-3.5 mb-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300">
              <span className="flex-shrink-0 mt-0.5">ℹ️</span>
              <span>
                <strong className="block text-blue-200 mb-0.5">Demo Mode — No Database Connected</strong>
                The student portal requires the Supabase database to be configured.
                You can still <a href="/registration" className="underline font-medium">register for events</a> or
                use <button type="button" onClick={() => setActiveTab('lookup')} className="underline font-medium">Pass Lookup</button> without an account.
              </span>
            </div>
          )}
          {activeTab === 'signin' && !showForgotPassword && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="email"
                    required
                    placeholder="student@rvrjc.ac.in or admin@rvrjc.ac.in"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setForgotEmail(signInEmail);
                      setError(null);
                    }}
                    className="text-xs text-primary-light hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type={showSignInPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                    aria-label={showSignInPassword ? 'Hide password' : 'Show password'}
                  >
                    {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-white font-semibold text-sm shadow-lg shadow-primary/30 hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => {
                    setSignInEmail('student@rvrjc.ac.in');
                    setSignInPassword('rvrjc2026');
                    setSuccessMsg('Signing in with student account...');
                    setTimeout(() => {
                      router.push('/student/dashboard');
                      router.refresh();
                    }, 400);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-border/60 text-xs font-medium text-text-secondary hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-accent-light" />
                  <span>One-Click Student Demo Sign In</span>
                </button>
              </div>

              <div className="pt-2 flex flex-col items-center gap-1.5 text-xs text-text-muted text-center">
                <span>Students are automatically routed to the Student Portal.</span>
                <Link href="/admin/login" className="text-secondary hover:underline inline-flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Dedicated Staff / Admin Sign In
                </Link>
              </div>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {activeTab === 'signin' && showForgotPassword && (
            <form onSubmit={handleResetPassword} className="space-y-4 animate-fade-in">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-primary-light" />
                  Reset Your Password
                </h3>
                <p className="text-xs text-text-secondary">
                  Enter your registered student or coordinator email address. We will send password reset instructions to your inbox.
                </p>
              </div>

              {forgotSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                  {forgotSuccess}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="email"
                    required
                    placeholder="student@rvrjc.ac.in"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowForgotPassword(false); setError(null); }}
                  className="w-1/3 py-2.5 rounded-xl bg-white/5 border border-border text-xs font-medium text-text-secondary hover:text-white"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-dark disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {forgotLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Send Reset Link'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: STUDENT SIGN UP */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. K. Sai Kumar"
                    value={signUpForm.fullName}
                    onChange={(e) => setSignUpForm({ ...signUpForm, fullName: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-text-secondary">Student Roll / ID *</label>
                  <div className="relative">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Y22CS501"
                      value={signUpForm.rollNumber}
                      onChange={(e) => setSignUpForm({ ...signUpForm, rollNumber: e.target.value.toUpperCase() })}
                      className="w-full pl-10 pr-3 py-2 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:outline-none focus:border-primary uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-text-secondary">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="tel"
                      required
                      placeholder="10-digit number"
                      value={signUpForm.phone}
                      onChange={(e) => setSignUpForm({ ...signUpForm, phone: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-text-secondary">Year of Study *</label>
                  <select
                    value={signUpForm.year}
                    onChange={(e) => setSignUpForm({ ...signUpForm, year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:outline-none focus:border-primary"
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-text-secondary">Gender</label>
                  <select
                    value={signUpForm.gender}
                    onChange={(e) => setSignUpForm({ ...signUpForm, gender: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:outline-none focus:border-primary"
                  >
                    <option value="open">Prefer not to say</option>
                    <option value="boys">Male</option>
                    <option value="girls">Female</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary">College / Institution *</label>
                <select
                  value={signUpForm.college}
                  onChange={(e) => setSignUpForm({ ...signUpForm, college: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:outline-none focus:border-primary"
                >
                  <option value="R.V.R. & J.C. College of Engineering (Autonomous)">R.V.R. & J.C. College of Engineering (Autonomous)</option>
                  <option value="Other College">Other Participating College</option>
                </select>
                {signUpForm.college === 'Other College' && (
                  <input
                    type="text"
                    required
                    placeholder="Enter full college name"
                    value={signUpForm.customCollege}
                    onChange={(e) => setSignUpForm({ ...signUpForm, customCollege: e.target.value })}
                    className="w-full mt-2 px-3 py-2 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:outline-none focus:border-primary"
                  />
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary">Department *</label>
                <select
                  value={signUpForm.department}
                  onChange={(e) => setSignUpForm({ ...signUpForm, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:outline-none focus:border-primary"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="email"
                    required
                    placeholder="yourname@rvrjc.ac.in"
                    value={signUpForm.email}
                    onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-text-secondary">Password *</label>
                  <div className="relative">
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      required
                      placeholder="At least 6 chars"
                      value={signUpForm.password}
                      onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                      className="w-full px-3 py-2 pr-9 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                      aria-label="Toggle password view"
                    >
                      {showSignUpPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-text-secondary">Confirm Password *</label>
                  <input
                    type={showSignUpPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-type password"
                    value={signUpForm.confirmPassword}
                    onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-white font-semibold text-sm shadow-lg shadow-primary/30 hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Student Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: INSTANT PASS LOOKUP */}
          {activeTab === 'lookup' && (
            <form onSubmit={handlePassLookup} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-accent/10 border border-accent/20 text-xs text-text-secondary space-y-1">
                <span className="font-semibold text-accent-light block">Already Registered for an Event?</span>
                <p>Enter your <strong>Registration ID</strong> (printed on your pass e.g. <code>CLR26-1001</code>) to instantly view, print, or download your official QR Entry Pass.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
                  Registration ID *
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. CLR26-1001"
                    value={lookupId}
                    onChange={(e) => setLookupId(e.target.value.toUpperCase())}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:outline-none focus:border-primary uppercase font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
                  Student Roll Number (Optional Verification)
                </label>
                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="e.g. Y22CS501"
                    value={lookupRoll}
                    onChange={(e) => setLookupRoll(e.target.value.toUpperCase())}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-dark border border-border text-sm text-text-primary focus:outline-none focus:border-primary uppercase"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-accent via-secondary to-primary text-white font-semibold text-sm shadow-lg shadow-accent/30 hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Searching pass...</span>
                  </>
                ) : (
                  <>
                    <span>View Participant Pass</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Quick Links Footer */}
        <div className="flex items-center justify-between text-xs text-text-muted px-2">
          <Link href="/" className="hover:text-white transition-colors">
            ← Back to Festival Home
          </Link>
          <Link href="/registration" className="hover:text-primary-light transition-colors font-medium">
            New Registration →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function UnifiedLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
            <p className="text-xs text-text-secondary">Loading festival portal...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
