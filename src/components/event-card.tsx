import Link from 'next/link';
import { Calendar, MapPin, Clock, Users, ArrowRight, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import type { Event } from '@/types';

interface EventCardProps {
  event: Event;
  /** If true, shows a compact version for homepage grids */
  compact?: boolean;
}

export default function EventCard({ event, compact = false }: EventCardProps) {
  const isCultural = event.category === 'cultural';

  // Fallback themed images in case an event image is not provided
  const fallbackImage = isCultural
    ? 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80'
    : 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80';

  const displayImage = event.image_url || fallbackImage;

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block h-full focus:outline-none"
    >
      <div className="relative glass-card-hover rounded-2xl overflow-hidden h-full flex flex-col border border-border/80 group-hover:border-primary/50 transition-all duration-300">
        {/* Top ambient highlight line */}
        <div
          className={`h-1 w-full bg-gradient-to-r ${
            isCultural
              ? 'from-primary via-secondary to-accent'
              : 'from-sports via-emerald to-primary'
          }`}
        />

        {/* Media / Header banner */}
        <div className="relative h-48 w-full overflow-hidden bg-surface-lighter">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayImage}
            alt={event.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Vignette & Gradients for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A16] via-[#0A0A16]/40 to-black/20" />

          {/* Badges on Top */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
            {/* Category / Subcategory Pill */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase rounded-full backdrop-blur-md shadow-md ${
                isCultural
                  ? 'bg-primary/80 text-white border border-primary-light/40'
                  : 'bg-sports/80 text-white border border-sports-light/40'
              }`}
            >
              {isCultural ? '🎭 ' : '🏆 '}
              {event.subcategory.replace(/-/g, ' ')}
            </span>

            {/* Registration Status Pill */}
            {event.registration_open ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-full bg-emerald-500/90 text-white backdrop-blur-md shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Open
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full bg-neutral-800/90 text-neutral-300 backdrop-blur-md">
                Closed
              </span>
            )}
          </div>

          {/* Gender Eligibility Badge on Bottom-Right of Image */}
          {event.gender && event.gender !== 'open' && (
            <div className="absolute bottom-2.5 right-3 z-10">
              <span
                className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md tracking-wider backdrop-blur-md ${
                  event.gender === 'boys'
                    ? 'bg-blue-600/80 text-white border border-blue-400/40'
                    : event.gender === 'girls'
                    ? 'bg-rose-600/80 text-white border border-rose-400/40'
                    : 'bg-purple-600/80 text-white border border-purple-400/40'
                }`}
              >
                {event.gender === 'boys' ? 'Boys' : event.gender === 'girls' ? 'Girls' : 'Mixed'}
              </span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold font-[family-name:var(--font-display)] text-text-primary group-hover:text-primary-light transition-colors line-clamp-1 mb-1.5">
              {event.name}
            </h3>

            {!compact && event.description && (
              <p className="text-xs sm:text-sm text-text-secondary line-clamp-2 leading-relaxed mb-4">
                {event.description}
              </p>
            )}

            {/* Quick Metadata chips */}
            <div className="grid grid-cols-2 gap-2 text-xs text-text-muted mt-2">
              {event.event_date && (
                <div className="flex items-center gap-1.5 line-clamp-1">
                  <Calendar className="w-3.5 h-3.5 text-accent-light shrink-0" />
                  <span>
                    {new Date(event.event_date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              )}

              {event.venue && (
                <div className="flex items-center gap-1.5 line-clamp-1" title={event.venue}>
                  <MapPin className="w-3.5 h-3.5 text-secondary-light shrink-0" />
                  <span className="truncate">{event.venue}</span>
                </div>
              )}

              {!compact && event.start_time && (
                <div className="flex items-center gap-1.5 line-clamp-1">
                  <Clock className="w-3.5 h-3.5 text-sports-light shrink-0" />
                  <span>{event.start_time}</span>
                </div>
              )}

              {!compact && event.max_participants > 0 && (
                <div className="flex items-center gap-1.5 line-clamp-1">
                  <Users className="w-3.5 h-3.5 text-primary-light shrink-0" />
                  <span>Max {event.max_participants}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Link Footer */}
          <div className="mt-5 pt-3.5 border-t border-border/50 flex items-center justify-between text-xs font-semibold">
            <span className="text-primary-light group-hover:text-white transition-colors flex items-center gap-1">
              View Rules &amp; Register
            </span>
            <span className="w-7 h-7 rounded-full bg-white/5 group-hover:bg-primary text-text-secondary group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
