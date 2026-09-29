import type { Metadata } from 'next';
import PageHeader from '@/components/page-header';
import { getPublishedAnnouncements } from '@/actions/announcements';
import { EmptyState } from '@/components/ui/loading-states';
import {
  Megaphone,
  AlertTriangle,
  Info,
  AlertCircle,
  BellRing,
  Calendar,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import type { Announcement } from '@/types';

export const metadata: Metadata = {
  title: 'Official Bulletins & Announcements | RVR COLORIDO 2K26',
  description:
    'Stay updated with official schedules, rule updates, venue shifts, and news from the RVR COLORIDO 2K26 organizing committee.',
};

const priorityStyles: Record<
  string,
  { badge: string; border: string; glow: string; icon: typeof Info; label: string }
> = {
  urgent: {
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    border: 'border-l-rose-500',
    glow: 'shadow-lg shadow-rose-500/10',
    icon: AlertTriangle,
    label: 'Urgent Bulletin',
  },
  high: {
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    border: 'border-l-amber-500',
    glow: 'shadow-lg shadow-amber-500/10',
    icon: AlertCircle,
    label: 'High Priority',
  },
  medium: {
    badge: 'bg-primary/20 text-primary-light border-primary/40',
    border: 'border-l-primary',
    glow: '',
    icon: Info,
    label: 'Notice',
  },
  low: {
    badge: 'bg-sports/20 text-sports-light border-sports/40',
    border: 'border-l-sports',
    glow: '',
    icon: Info,
    label: 'General Info',
  },
};

export default async function AnnouncementsPage() {
  const announcements = await getPublishedAnnouncements();

  const featuredNotice = announcements.find((a) => a.priority === 'urgent') || announcements[0];
  const regularNotices = featuredNotice
    ? announcements.filter((a) => a.id !== featuredNotice.id)
    : announcements;

  return (
    <>
      <PageHeader
        title="Announcements"
        subtitle="Notice Board"
        description="Official updates and notifications from the COLORIDO 2K26 organizing committee."
        gradient="accent"
        breadcrumbs={[{ label: 'Announcements' }]}
      />

      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {announcements.length === 0 ? (
            <EmptyState
              icon={Megaphone}
              title="No Active Announcements"
              description="Official updates from the festival organizers will appear here. Please check back as festival dates approach!"
            />
          ) : (
            <>
              {/* Featured / Pin Notice */}
              {featuredNotice && (
                <div className="glass-strong rounded-3xl p-6 sm:p-8 border border-primary/40 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <BellRing className="w-32 h-32 text-primary" />
                  </div>

                  <div className="relative z-10 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-rose-500/20 to-amber-500/20 border border-rose-500/30 text-rose-300 uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Featured Broadcast</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-text-muted">
                        <Calendar className="w-3.5 h-3.5 text-accent-light" />
                        <span>
                          {new Date(featuredNotice.created_at).toLocaleDateString('en-IN', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-white font-[family-name:var(--font-display)]">
                      {featuredNotice.title}
                    </h2>

                    <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                      {featuredNotice.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Feed List */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-2 border-b border-border/80">
                  <span className="text-xs font-bold text-accent-light uppercase tracking-widest">
                    Recent Bulletins ({regularNotices.length})
                  </span>
                  <span className="text-xs text-text-muted">
                    Official Central Notice Board
                  </span>
                </div>

                {regularNotices.map((announcement) => {
                  const style = priorityStyles[announcement.priority] || priorityStyles.low;
                  const Icon = style.icon;

                  return (
                    <div
                      key={announcement.id}
                      className={`glass-card-hover rounded-2xl p-6 border border-border/80 border-l-4 ${style.border} ${style.glow} flex flex-col justify-between space-y-3`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full border ${style.badge} w-fit`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{style.label}</span>
                        </span>

                        <span className="text-xs text-text-muted">
                          {new Date(announcement.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-white font-[family-name:var(--font-display)]">
                        {announcement.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                        {announcement.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Verification Notice Banner */}
          <div className="p-5 rounded-2xl glass border border-border/80 flex items-center gap-3.5 text-xs text-text-muted">
            <ShieldCheck className="w-6 h-6 text-primary-light shrink-0" />
            <span>
              All notifications published here are verified by the <strong>RVR COLORIDO 2K26 Central Organizing Committee</strong>. For urgent queries, please visit the Helpdesk desk in the Silver Jubilee Block.
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
