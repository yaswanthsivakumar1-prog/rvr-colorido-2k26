'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Sparkles, Loader2, AlertCircle, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !authData?.user) {
        setError(authError?.message || 'Invalid login credentials.');
        setLoading(false);
        return;
      }

      // Check role in profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .maybeSingle();

      // Strictly enforce admin/organizer access only
      const userRole = profile?.role;

      if (userRole === 'admin' || userRole === 'organizer') {
        router.push('/admin/dashboard');
        router.refresh();
      } else {
        // Non-admin user: sign out and show access denied
        await supabase.auth.signOut();
        setError(
          'Access denied. This portal is for administrators only. ' +
          'Students, please use the Student Portal at /login.'
        );
        setLoading(false);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] gradient-text mb-1">
            COLORIDO Admin
          </h1>
          <p className="text-sm text-text-secondary">
            Sign in to manage COLORIDO 2K26
          </p>
        </div>

        {/* Login form */}
        <div className="glass rounded-2xl p-6 sm:p-8">
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-error/10 border border-error/20">
              <AlertCircle className="w-4 h-4 text-error shrink-0" />
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="form-input"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-text-muted mt-6">
          Admin access only.{' '}
          <a href="/login" className="text-primary-light hover:underline font-medium">
            Students: use the Student Portal →
          </a>
        </p>
      </div>
    </div>
  );
}
