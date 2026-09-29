import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getEventBySlug } from '@/actions/events';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Sparkles,
  ShieldCheck,
  Tag,
  Users,
} from 'lucide-react';

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: 'Event Not Found | COLORIDO 2K26' };
  }

  return {
    title: `${event.name} | RVR COLORIDO 2K26`,
    description: event.description || `Event information and rules for ${event.name} at RVR COLORIDO 2K26.`,
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const isCultural = event.category === 'cultural';
  const defaultImage = isCultural
    ? 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80'
    : 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80';

  const bannerImage = event.image_url || defaultImage;

  return (
    <div className="min-h-screen pb-20">
      {/* Header Banner */}
      <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-16 overflow-hidden border-b border-border/80">
        <div className="absolute inset-0 z-0">
          <img
            src={bannerImage}
            alt={event.name}
            className="w-full h-full object-cover object-center filter brightness-[0.3] blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A16] via-[#0A0A16]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href={isCultural ? '/events/cultural' : '/events/sports'}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-border/60 text-xs font-semibold text-text-secondary hover:text-white hover:border-primary/50 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to {isCultural ? 'Cultural' : 'Sports'} Events</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isCultural
                  ? 'bg-primary text-white border border-primary-light/40'
                  : 'bg-sports text-white border border-sports-light/40'
              }`}
            >
              {isCultural ? 'Cultural' : 'Sports'}
            </span>

            {event.gender && event.gender !== 'open' && (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white border border-white/20">
                {event.gender === 'boys' ? 'Boys' : 'Girls'}
              </span>
            )}

            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-accent/20 text-accent-light border border-accent/30">
              {event.event_date}
            </span>

            {event.registration_open ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/80 text-white">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Registration Open
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neutral-800 text-neutral-300">
                <XCircle className="w-3.5 h-3.5" />
                Registration Closed
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-[family-name:var(--font-display)] text-white tracking-tight mb-4">
            {event.name}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-text-secondary">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-accent-light" />
              <span className="text-white font-medium">{event.event_date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sports-light" />
              <span className="text-white font-medium">
                {event.start_time} – {event.end_time}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-secondary-light" />
              <span className="text-white font-medium">{event.venue}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Details Body */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column (2 Cols): Description & Rules */}
            <div className="lg:col-span-2 space-y-6">
              {/* Short Description */}
              <div className="glass rounded-2xl p-6 border border-border/80 space-y-3">
                <h2 className="text-base font-bold text-white font-[family-name:var(--font-display)]">
                  About The Event
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Event Rules */}
              <div className="glass rounded-2xl p-6 border border-border/80 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                  <ShieldCheck className="w-4 h-4 text-primary-light" />
                  <h2 className="text-base font-bold text-white font-[family-name:var(--font-display)]">
                    Event Rules &amp; Guidelines
                  </h2>
                </div>

                <div className="space-y-2.5">
                  {event.rules && event.rules.length > 0 ? (
                    event.rules.map((rule, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-xl bg-surface-light/30 border border-border/40 text-xs sm:text-sm text-text-secondary leading-relaxed"
                      >
                        <span className="w-5 h-5 rounded-full bg-primary/20 text-primary-light text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{rule}</span>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-2 text-xs text-text-secondary">
                      <p>• Participants must report before the scheduled time.</p>
                      <p>• Participants must carry their college ID.</p>
                      <p>• Participants must follow event instructions.</p>
                      <p>• Organizers&apos; decisions will be final.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column (1 Col): Quick Info & Action */}
            <div className="space-y-6">
              <div className="glass rounded-2xl p-6 border border-border/80 space-y-5">
                <h3 className="font-bold text-base text-white font-[family-name:var(--font-display)]">
                  Event Summary
                </h3>

                <div className="space-y-3 text-xs divide-y divide-border/60">
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-text-muted">Category</span>
                    <span className="font-semibold text-white capitalize">{event.category}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2.5">
                    <span className="text-text-muted">Section</span>
                    <span className="font-semibold text-white capitalize">{event.gender === 'open' ? 'All Students' : event.gender}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2.5">
                    <span className="text-text-muted">Schedule</span>
                    <span className="font-semibold text-accent-light">{event.event_date}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2.5">
                    <span className="text-text-muted">Time</span>
                    <span className="font-semibold text-white">{event.start_time} – {event.end_time}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2.5">
                    <span className="text-text-muted">Venue</span>
                    <span className="font-semibold text-white text-right max-w-[150px] truncate" title={event.venue}>
                      {event.venue}
                    </span>
                   </div>
                  <div className="flex items-center justify-between pt-2.5">
                    <span className="text-text-muted">Eligibility</span>
                    <span className="font-semibold text-white text-right max-w-[180px] text-[11px]">
                      {event.eligibility || 'Open to eligible students from RVR & J.C. College and participating colleges'}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  {event.registration_open ? (
                    <Link
                      href={`/registration?event=${event.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Register Now</span>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full py-3 rounded-xl bg-surface-light text-text-muted font-bold text-xs uppercase cursor-not-allowed border border-border"
                    >
                      Registration Closed
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-text-muted text-center">
                  Eligibility: Open to eligible students from RVR &amp; J.C. College and participating colleges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
