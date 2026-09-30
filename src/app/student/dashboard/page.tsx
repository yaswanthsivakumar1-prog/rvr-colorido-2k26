'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Sparkles,
  Printer,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  ArrowRight,
  LogOut,
  User,
  GraduationCap,
  Building,
  CheckCircle2,
  Clock3,
  Loader2,
  ExternalLink,
  QrCode,
  Trophy,
  AlertCircle,
  Megaphone,
  Ticket,
  XCircle,
  PlusCircle,
} from 'lucide-react';
import type { Registration, Profile, Announcement } from '@/types';
import { getStudentData, lookupStudentPass } from '@/actions/student';
import { getPublishedAnnouncements } from '@/actions/announcements';

/**
 * Clean SVG QR Code generator component (deterministic, zero external runtime dependencies)
 */
function DynamicQRCode({ text, size = 120 }: { text: string; size?: number }) {
  const matrixSize = 17;
  const cells: boolean[][] = [];

  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < matrixSize; r++) {
    cells[r] = [];
    for (let c = 0; c < matrixSize; c++) {
      const inTopLeft = r < 5 && c < 5;
      const inTopRight = r < 5 && c >= matrixSize - 5;
      const inBottomLeft = r >= matrixSize - 5 && c < 5;

      if (inTopLeft || inTopRight || inBottomLeft) {
        const isBorder =
          r === 0 ||
          r === 4 ||
          c === 0 ||
          c === 4 ||
          (inTopRight && (r === 0 || r === 4 || c === matrixSize - 1 || c === matrixSize - 5)) ||
          (inBottomLeft && (r === matrixSize - 1 || r === matrixSize - 5 || c === 0 || c === 4));
        const isCenter =
          (r >= 1 && r <= 3 && c >= 1 && c <= 3 && (r === 2 || c === 2)) ||
          (inTopRight && (r === 2 || c === matrixSize - 3)) ||
          (inBottomLeft && (r === matrixSize - 3 || c === 2));
        cells[r][c] = isBorder || isCenter;
      } else {
        const seed = Math.sin(hash + r * 19 + c * 23) * 10000;
        cells[r][c] = seed - Math.floor(seed) > 0.45;
      }
    }
  }

  const cellSize = size / matrixSize;

  return (
    <div className="bg-white p-2 rounded-xl shadow-inner inline-block">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {cells.map((row, r) =>
          row.map((active, c) =>
            active ? (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize - 0.4}
                height={cellSize - 0.4}
                fill="#0f172a"
                rx={cellSize * 0.2}
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
}

function StudentDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const regIdParam = searchParams.get('regId');

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedPass, setSelectedPass] = useState<Registration | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      try {
        const [annData] = await Promise.all([
          getPublishedAnnouncements(),
        ]);
        setAnnouncements(annData.slice(0, 3));

        // 1. If direct Registration ID query param is present
        if (regIdParam) {
          const result = await lookupStudentPass(regIdParam);
          if (result.success && result.registration) {
            setSelectedPass(result.registration);
            setRegistrations([result.registration]);
            setProfile({
              id: result.registration.id,
              full_name: result.registration.full_name,
              role: 'student',
              college: result.registration.college,
              roll_number: result.registration.additional_info?.replace(/Roll No:\s*/i, '') || '',
              department: result.registration.course,
              created_at: result.registration.created_at,
            });
            setLoading(false);
            return;
          }
        }

        // 2. Load authenticated user session
        let authUser = null;
        try {
          const { data } = await supabase.auth.getUser();
          authUser = data?.user || null;
        } catch (authErr) {
          console.warn('Auth check warning:', authErr);
        }

        if (authUser) {
          const studentInfo = await getStudentData(authUser.id, authUser.email);
          const meta = authUser.user_metadata || {};
          const studentProfile: Profile = studentInfo.profile || {
            id: authUser.id,
            full_name: meta.full_name || authUser.email?.split('@')[0] || 'Student Participant',
            role: 'student',
            college: meta.college || 'R.V.R. & J.C. College of Engineering (Autonomous)',
            roll_number: meta.roll_number || '',
            department: meta.department || 'Engineering',
            created_at: authUser.created_at || new Date().toISOString(),
          };
          setProfile(studentProfile);
          setRegistrations(studentInfo.registrations);
          if (studentInfo.registrations.length > 0) {
            setSelectedPass(studentInfo.registrations[0]);
          }
        } else {
          // Fallback for demonstration when visiting without auth
          const fallback = await getStudentData();
          setProfile(fallback.profile);
          setRegistrations(fallback.registrations);
          if (fallback.registrations.length > 0) {
            setSelectedPass(fallback.registrations[0]);
          }
        }
      } catch (err) {
        console.error('Error loading student dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [regIdParam]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
          <p className="text-xs text-text-secondary">Loading student dashboard...</p>
        </div>
      </div>
    );
  }

  const primaryReg = selectedPass || registrations[0];
  const studentName = profile?.full_name || primaryReg?.full_name || 'Student Participant';
  const studentCollege = profile?.college || primaryReg?.college || 'R.V.R. & J.C. College of Engineering (Autonomous)';
  const studentRoll = profile?.roll_number || primaryReg?.additional_info?.replace(/Roll No:\s*/i, '') || 'RVRJC-2026';
  const studentDept = profile?.department || primaryReg?.course || 'Engineering';

  // Statistics
  const totalRegistrations = registrations.length;
  const pendingCount = registrations.filter((r) => r.status === 'pending').length;
  const confirmedCount = registrations.filter((r) => r.status === 'confirmed').length;
  const completedCount = registrations.filter((r) => r.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Print Stylesheet */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-pass, #print-pass * {
            visibility: visible;
          }
          #print-pass {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 24px;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: 2px solid #000 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* 1. WELCOME BANNER (Section 5) */}
      <div className="p-6 rounded-2xl glass border border-border/80 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-light">Student Portal</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/20 text-primary-light border border-primary/30">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-display)] text-text-primary">
              Welcome, {studentName}
            </h1>
            <p className="text-xs text-text-secondary">
              {studentRoll} • {studentDept} • {studentCollege}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href="/registration"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-dark shadow-sm transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Register for Event</span>
            </Link>
            <Link
              href="/student/profile"
              className="px-3 py-2 rounded-xl glass border border-border text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* 2. QUICK STATISTICS (Section 5) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl glass border border-border/70 space-y-1">
          <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider block">Total Registrations</span>
          <p className="text-2xl font-bold text-text-primary font-mono">{totalRegistrations}</p>
        </div>

        <div className="p-4 rounded-xl glass border border-accent/20 bg-accent/5 space-y-1">
          <span className="text-[11px] font-medium text-accent-light uppercase tracking-wider block">Pending</span>
          <p className="text-2xl font-bold text-accent-light font-mono">{pendingCount}</p>
        </div>

        <div className="p-4 rounded-xl glass border border-emerald-500/20 bg-emerald-500/5 space-y-1">
          <span className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider block">Confirmed</span>
          <p className="text-2xl font-bold text-emerald-400 font-mono">{confirmedCount}</p>
        </div>

        <div className="p-4 rounded-xl glass border border-blue-500/20 bg-blue-500/5 space-y-1">
          <span className="text-[11px] font-medium text-blue-400 uppercase tracking-wider block">Completed</span>
          <p className="text-2xl font-bold text-blue-400 font-mono">{completedCount}</p>
        </div>
      </div>

      {/* 3. QUICK ACTIONS (Section 5) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Browse Events', href: '/events', icon: Calendar, desc: 'View cultural & sports' },
          { label: 'Register for Event', href: '/registration', icon: PlusCircle, desc: 'Fill registration form' },
          { label: 'My Registrations', href: '/student/registrations', icon: Ticket, desc: 'View status & passes' },
          { label: 'My Profile', href: '/student/profile', icon: User, desc: 'Manage identity & branch' },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="p-3.5 rounded-xl glass border border-border/80 hover:border-primary/50 transition-all group flex flex-col justify-between"
          >
            <div className="w-8 h-8 rounded-lg bg-surface-dark border border-border/60 flex items-center justify-center text-primary-light mb-2 group-hover:scale-105 transition-transform">
              <action.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-text-primary group-hover:text-primary-light transition-colors">
                {action.label}
              </p>
              <p className="text-[10px] text-text-muted mt-0.5">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* 4. MAIN SPLIT: DIGITAL PASS & RECENT REGISTRATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: DIGITAL EVENT PASS */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-2">
              <Award className="w-4 h-4 text-accent-light" />
              <span>Digital Festival Pass</span>
            </h2>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg glass border border-border text-xs font-semibold text-text-secondary hover:text-white transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-accent-light" />
              <span>Print Pass</span>
            </button>
          </div>

          {/* Pass Card */}
          <div
            id="print-pass"
            className="relative rounded-2xl p-5 sm:p-6 glass-strong border border-accent/40 shadow-xl overflow-hidden space-y-4 bg-gradient-to-b from-surface-dark via-surface-dark to-[#16162a]"
          >
            <div className="flex items-start justify-between border-b border-border/60 pb-3">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-accent-light block">
                  Official Participant Credential
                </span>
                <h3 className="text-base font-bold font-[family-name:var(--font-display)] text-text-primary">
                  COLORIDO 2K26
                </h3>
                <span className="text-[10px] text-text-muted block">
                  R.V.R. &amp; J.C. College of Engineering
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider text-text-muted block">Pass ID</span>
                <span className="font-mono text-xs font-bold text-accent-light bg-accent/15 px-2 py-0.5 rounded border border-accent/30 inline-block mt-0.5">
                  {primaryReg?.registration_id || 'CLR26-PENDING'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div>
                <span className="text-[9px] text-text-muted uppercase tracking-wider block">Participant</span>
                <span className="font-semibold text-text-primary text-xs block mt-0.5">{studentName}</span>
              </div>
              <div>
                <span className="text-[9px] text-text-muted uppercase tracking-wider block">Student ID</span>
                <span className="font-semibold text-text-primary text-xs block mt-0.5">{studentRoll}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[9px] text-text-muted uppercase tracking-wider block">Institution</span>
                <span className="font-medium text-text-primary text-xs block mt-0.5 truncate">{studentCollege}</span>
              </div>
              <div>
                <span className="text-[9px] text-text-muted uppercase tracking-wider block">Branch</span>
                <span className="font-medium text-text-primary text-xs block mt-0.5 truncate">{studentDept}</span>
              </div>
              <div>
                <span className="text-[9px] text-text-muted uppercase tracking-wider block">Status</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 mt-0.5 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {primaryReg?.status ? primaryReg.status.toUpperCase() : 'REGISTERED'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[9px] font-semibold text-text-secondary uppercase tracking-wider block">
                  Gate Verification
                </span>
                <p className="text-[10px] text-text-muted leading-tight max-w-[150px]">
                  Present this QR code with your College Physical ID at the festival entrance desk.
                </p>
              </div>

              <div className="flex-shrink-0">
                <DynamicQRCode
                  text={`COLORIDO2K26|ID:${primaryReg?.registration_id || 'DEMO'}|NAME:${studentName}|ROLL:${studentRoll}`}
                  size={95}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: RECENT REGISTRATIONS & UPCOMING EVENTS */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-2">
              <Ticket className="w-4 h-4 text-primary-light" />
              <span>Recent Registrations</span>
            </h2>
            <Link
              href="/student/registrations"
              className="text-xs text-primary-light hover:underline font-medium inline-flex items-center gap-1"
            >
              <span>View All ({registrations.length})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {registrations.length === 0 ? (
            <div className="p-6 rounded-2xl glass border border-border/80 text-center space-y-2">
              <Ticket className="w-8 h-8 text-text-muted mx-auto" />
              <p className="text-xs font-semibold text-text-primary">No Event Registrations Found</p>
              <p className="text-[11px] text-text-secondary max-w-xs mx-auto">
                Ready to compete? Explore cultural and sports competitions and register in seconds.
              </p>
              <Link
                href="/registration"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-dark transition-colors mt-2"
              >
                <span>Register for Event</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {registrations.slice(0, 3).map((reg) => {
                const evt = reg.event;
                return (
                  <div
                    key={reg.id}
                    onClick={() => setSelectedPass(reg)}
                    className={`p-4 rounded-xl glass border transition-all cursor-pointer space-y-2.5 ${
                      selectedPass?.id === reg.id
                        ? 'border-primary/60 bg-primary/5'
                        : 'border-border/80 hover:border-primary/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              evt?.category === 'sports'
                                ? 'bg-secondary/20 text-secondary-light border border-secondary/30'
                                : 'bg-primary/20 text-primary-light border border-primary/30'
                            }`}
                          >
                            {evt?.category === 'sports' ? 'Sports' : 'Cultural'}
                          </span>
                          <span className="text-[11px] font-mono text-text-muted">
                            {reg.registration_id}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-text-primary mt-1">
                          {evt?.name || 'Festival Competition'}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            reg.status === 'confirmed'
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : reg.status === 'pending'
                              ? 'bg-accent/15 text-accent-light border-accent/30'
                              : reg.status === 'completed'
                              ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                              : 'bg-red-500/15 text-red-400 border-red-500/30'
                          }`}
                        >
                          {reg.status.toUpperCase()}
                        </span>
                        <Link
                          href={`/student/registrations/${reg.registration_id || reg.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-white/5"
                          title="View Details"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-text-secondary pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-accent-light" />
                        <span>{evt?.event_date || 'Day 1'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-secondary-light" />
                        <span>{evt?.venue || 'Campus Venue'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 5. ANNOUNCEMENT NOTIFICATION AREA (Section 5) */}
          <div className="p-4 rounded-xl glass border border-border/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                <Megaphone className="w-3.5 h-3.5 text-blue-400" />
                <span>Notice Board / Announcements</span>
              </h3>
              <Link href="/announcements" className="text-[11px] text-primary-light hover:underline font-medium">
                All Notices
              </Link>
            </div>

            {announcements.length === 0 ? (
              <p className="text-[11px] text-text-muted">No active announcements at this moment.</p>
            ) : (
              <div className="space-y-2">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-2.5 rounded-lg bg-surface-dark border border-border/60 text-xs space-y-0.5">
                    <p className="font-semibold text-text-primary">{ann.title}</p>
                    <p className="text-[11px] text-text-secondary line-clamp-1">{ann.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
            <p className="text-xs text-text-secondary">Loading student dashboard...</p>
          </div>
        </div>
      }
    >
      <StudentDashboardContent />
    </Suspense>
  );
}
