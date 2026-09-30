'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  Ticket,
  Calendar,
  Megaphone,
  User,
  LogOut,
  Sparkles,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react';
import type { Profile } from '@/types';

const studentNavLinks = [
  { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/student/registrations', label: 'My Registrations', icon: Ticket },
  { href: '/events', label: 'Browse Events', icon: Calendar },
  { href: '/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/student/profile', label: 'My Profile', icon: User },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [studentProfile, setStudentProfile] = useState<Profile | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function getProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: prof } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (prof) {
            setStudentProfile(prof as Profile);
          } else {
            setStudentProfile({
              id: user.id,
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student',
              role: 'student',
              college: user.user_metadata?.college || 'R.V.R. & J.C. College of Engineering',
              roll_number: user.user_metadata?.roll_number || '',
              department: user.user_metadata?.department || '',
              created_at: user.created_at,
            });
          }
        }
      } catch (err) {
        console.warn('Student layout profile check notice:', err);
      }
    }
    getProfile();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="min-h-screen pt-16 bg-surface-dark/50">
      {/* Mobile Top Sub-Header */}
      <div className="lg:hidden border-b border-border bg-surface px-4 py-3 flex items-center justify-between sticky top-16 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary-light flex items-center justify-center font-bold text-xs">
            SP
          </div>
          <div>
            <span className="text-xs font-semibold text-text-primary block">Student Portal</span>
            <span className="text-[10px] text-text-muted">
              {studentProfile?.roll_number || 'Participant'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/registration"
            className="text-xs px-2.5 py-1.5 rounded-lg bg-primary text-white font-medium inline-flex items-center gap-1 shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Register
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-lg border border-border text-text-secondary hover:text-text-primary"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="glass rounded-2xl p-4 border border-border/80 sticky top-24 space-y-5">
              {/* User Identity Card */}
              <div className="p-3.5 rounded-xl bg-surface-dark border border-border/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 border border-primary/20 flex items-center justify-center text-primary-light font-bold text-sm">
                    {studentProfile?.full_name?.charAt(0) || 'S'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-text-primary truncate">
                      {studentProfile?.full_name || 'Student Participant'}
                    </p>
                    <p className="text-[11px] text-primary-light font-mono truncate">
                      {studentProfile?.roll_number || 'RVR & JC'}
                    </p>
                  </div>
                </div>
                {studentProfile?.college && (
                  <p className="text-[10px] text-text-muted mt-2 pt-2 border-t border-border/50 truncate">
                    {studentProfile.college}
                  </p>
                )}
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1">
                {studentNavLinks.map((link) => {
                  const isActive = pathname === link.href || (link.href !== '/student/dashboard' && pathname.startsWith(link.href + '/'));
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-primary/15 text-primary-light font-semibold shadow-sm'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-light/50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-primary-light' : 'text-text-muted'}`} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Action Button */}
              <div className="pt-2 border-t border-border/60 space-y-2">
                <Link
                  href="/registration"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-dark shadow-sm transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Register for Event</span>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-border text-xs text-text-secondary hover:text-error hover:border-error/30 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Mobile Drawer */}
          {mobileOpen && (
            <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
              <div
                className="absolute top-16 right-0 w-64 h-[calc(100vh-4rem)] bg-surface border-l border-border p-4 space-y-4 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-3 rounded-xl bg-surface-dark border border-border">
                  <p className="text-xs font-bold text-text-primary truncate">
                    {studentProfile?.full_name || 'Student Participant'}
                  </p>
                  <p className="text-[11px] text-primary-light font-mono">
                    {studentProfile?.roll_number || 'Roll No'}
                  </p>
                </div>

                <nav className="space-y-1">
                  {studentNavLinks.map((link) => {
                    const isActive = pathname === link.href || (link.href !== '/student/dashboard' && pathname.startsWith(link.href + '/'));
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-primary/15 text-primary-light font-semibold'
                            : 'text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="pt-3 border-t border-border space-y-2">
                  <Link
                    href="/registration"
                    onClick={() => setMobileOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Register for Event</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-border text-xs text-error"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
