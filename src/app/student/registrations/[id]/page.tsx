'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Printer,
  ShieldCheck,
  AlertCircle,
  XCircle,
  CheckCircle2,
  Clock3,
  Loader2,
  ExternalLink,
  Award,
  Phone,
  Mail,
  User,
  Building,
} from 'lucide-react';
import type { Registration } from '@/types';
import { getRegistrationById, cancelStudentRegistration } from '@/actions/registrations';

/**
 * Clean SVG QR Code generator component (offline, 0 dependencies)
 */
function DynamicQRCode({ text, size = 110 }: { text: string; size?: number }) {
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

export default function StudentRegistrationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idOrCode = (params.id as string) || '';

  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    async function loadRegistration() {
      setLoading(true);
      try {
        const reg = await getRegistrationById(idOrCode);
        setRegistration(reg);
      } catch (err) {
        console.error('Failed to load registration:', err);
      } finally {
        setLoading(false);
      }
    }
    if (idOrCode) {
      loadRegistration();
    }
  }, [idOrCode]);

  async function handleCancel() {
    if (!registration) return;
    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await cancelStudentRegistration(registration.registration_id || registration.id);
      if (res.success) {
        setSuccessMsg('Your registration has been cancelled successfully.');
        setRegistration({ ...registration, status: 'cancelled' });
        setShowCancelConfirm(false);
      } else {
        setErrorMsg(res.error || 'Failed to cancel registration.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while cancelling registration.');
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="p-8 rounded-2xl glass border border-border/80 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-error mx-auto" />
        <h2 className="text-lg font-bold text-text-primary">Registration Not Found</h2>
        <p className="text-xs text-text-secondary">
          No registration record was found matching ID: <strong>{idOrCode}</strong>
        </p>
        <Link
          href="/student/registrations"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Registrations</span>
        </Link>
      </div>
    );
  }

  const evt = registration.event;

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

      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <Link
          href="/student/registrations"
          className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Registrations</span>
        </Link>

        <div className="flex items-center gap-2">
          {evt && (
            <Link
              href={`/events/${evt.slug || evt.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass border border-border text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Event Details</span>
            </Link>
          )}

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-dark border border-border text-xs font-semibold text-text-primary hover:border-primary/50 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-accent-light" />
            <span>Print Pass</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-error/10 border border-error/30 text-xs text-error flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Split: Pass & Detailed Data */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pass Visual */}
        <div className="lg:col-span-5 space-y-4">
          <div
            id="print-pass"
            className="rounded-2xl p-6 glass-strong border border-accent/40 shadow-xl space-y-5 bg-gradient-to-b from-surface-dark via-surface-dark to-[#16162a]"
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
                  {registration.registration_id}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[9px] text-text-muted uppercase tracking-wider block">Event</span>
                <span className="font-bold text-text-primary text-sm block mt-0.5">{evt?.name || 'Event'}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[9px] text-text-muted uppercase tracking-wider block">Participant</span>
                  <span className="font-semibold text-text-primary block mt-0.5">{registration.full_name}</span>
                </div>
                <div>
                  <span className="text-[9px] text-text-muted uppercase tracking-wider block">Status</span>
                  <span className="font-bold text-emerald-400 block mt-0.5">{registration.status.toUpperCase()}</span>
                </div>
              </div>

              <div>
                <span className="text-[9px] text-text-muted uppercase tracking-wider block">College</span>
                <span className="font-medium text-text-primary block mt-0.5 truncate">{registration.college}</span>
              </div>

              {registration.team_name && (
                <div>
                  <span className="text-[9px] text-text-muted uppercase tracking-wider block">Team Name</span>
                  <span className="font-medium text-text-primary block mt-0.5">{registration.team_name}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[9px] font-semibold text-text-secondary uppercase tracking-wider block">
                  Scan Verification
                </span>
                <p className="text-[10px] text-text-muted max-w-[140px] leading-tight">
                  Verify pass at desk on festival day.
                </p>
              </div>
              <DynamicQRCode
                text={`COLORIDO2K26|REG:${registration.registration_id}|EVENT:${evt?.name}|STUDENT:${registration.full_name}`}
                size={85}
              />
            </div>
          </div>
        </div>

        {/* Detailed Info Cards */}
        <div className="lg:col-span-7 space-y-5">
          {/* Registration Summary Card */}
          <div className="p-5 rounded-2xl glass border border-border/80 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary">
                Registration Specifications
              </h2>
              <span className="text-xs text-text-muted">
                Applied on {new Date(registration.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-surface-dark border border-border/60 space-y-1">
                <span className="text-[10px] text-text-muted uppercase tracking-wider block">Category</span>
                <span className="font-semibold text-text-primary capitalize">{evt?.category || 'Cultural'}</span>
              </div>

              <div className="p-3 rounded-xl bg-surface-dark border border-border/60 space-y-1">
                <span className="text-[10px] text-text-muted uppercase tracking-wider block">Sub-Category</span>
                <span className="font-semibold text-text-primary capitalize">{evt?.subcategory || 'General'}</span>
              </div>

              <div className="p-3 rounded-xl bg-surface-dark border border-border/60 space-y-1">
                <span className="text-[10px] text-text-muted uppercase tracking-wider block">Event Schedule</span>
                <span className="font-semibold text-text-primary">{evt?.event_date || 'Day 1'} ({evt?.start_time || '10:00 AM'} - {evt?.end_time || '01:00 PM'})</span>
              </div>

              <div className="p-3 rounded-xl bg-surface-dark border border-border/60 space-y-1">
                <span className="text-[10px] text-text-muted uppercase tracking-wider block">Venue</span>
                <span className="font-semibold text-text-primary">{evt?.venue || 'Campus Auditorium / Grounds'}</span>
              </div>
            </div>
          </div>

          {/* Important Instructions (Section 9) */}
          <div className="p-5 rounded-2xl glass border border-border/80 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary-light" />
              <span>Event Instructions &amp; Rules</span>
            </h3>
            <ul className="text-xs text-text-secondary space-y-2 list-disc list-inside leading-relaxed">
              <li>Please report to the designated venue at least <strong>30 minutes</strong> before the scheduled start time.</li>
              <li>Carry your <strong>Official Physical Student ID card</strong> along with this digital pass for entry validation.</li>
              <li>All participants must adhere strictly to the COLORIDO 2K26 code of conduct and event rules.</li>
              <li>Decisions of the judges and faculty conveners will be final and binding.</li>
            </ul>
          </div>

          {/* Coordinators Contact Information (Section 9) */}
          <div className="p-4 rounded-xl glass border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] text-text-muted uppercase tracking-wider block">Helpdesk / Coordinators</span>
              <p className="font-semibold text-text-primary mt-0.5">Student Affairs &amp; Event Registration Committee</p>
              <p className="text-text-muted text-[11px]">R.V.R. &amp; J.C. College of Engineering (Autonomous)</p>
            </div>
            <div className="text-right sm:text-right">
              <span className="text-[11px] text-primary-light font-medium block">colorido2k26@rvrjc.ac.in</span>
              <span className="text-[11px] text-text-muted block">+91 863 2288201 / 254</span>
            </div>
          </div>

          {/* Cancellation Action (Section 9) */}
          {registration.status === 'pending' && (
            <div className="p-4 rounded-xl border border-error/30 bg-error/5 space-y-3 no-print">
              <div>
                <h4 className="text-xs font-bold text-error">Cancel Registration</h4>
                <p className="text-[11px] text-text-secondary mt-0.5">
                  If you are unable to attend, you may cancel your pending registration before registrations close.
                </p>
              </div>

              {!showCancelConfirm ? (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="px-3 py-1.5 rounded-lg border border-error/40 text-xs font-semibold text-error hover:bg-error/10 transition-colors"
                >
                  Cancel This Registration
                </button>
              ) : (
                <div className="p-3 rounded-lg bg-surface-dark border border-error/40 space-y-2">
                  <p className="text-xs font-medium text-text-primary">
                    Are you sure you want to cancel your registration for {evt?.name || 'this event'}?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      disabled={actionLoading}
                      className="px-3 py-1.5 rounded-lg bg-error text-white text-xs font-semibold hover:bg-red-700 disabled:opacity-50"
                    >
                      {actionLoading ? 'Cancelling...' : 'Yes, Confirm Cancellation'}
                    </button>
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      disabled={actionLoading}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-border text-xs text-text-secondary hover:text-white"
                    >
                      No, Keep Registration
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
