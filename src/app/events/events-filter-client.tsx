'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Palette,
  Trophy,
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import type { Event } from '@/types';

interface EventsListWithFilterProps {
  events: Event[];
}

export default function EventsListWithFilter({ events }: EventsListWithFilterProps) {
  const [filter, setFilter] = useState<'all' | 'cultural' | 'sports-boys' | 'sports-girls'>('all');

  const filteredEvents = events.filter((e) => {
    if (filter === 'all') return true;
    if (filter === 'cultural') return e.category === 'cultural';
    if (filter === 'sports-boys') return e.category === 'sports' && e.gender === 'boys';
    if (filter === 'sports-girls') return e.category === 'sports' && e.gender === 'girls';
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Simple Filter Pills */}
      <div className="glass rounded-2xl p-3 sm:p-4 border border-border/80 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            filter === 'all'
              ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
              : 'glass text-text-secondary hover:text-white border border-border'
          }`}
        >
          All Events ({events.length})
        </button>

        <button
          onClick={() => setFilter('cultural')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
            filter === 'cultural'
              ? 'bg-primary text-white shadow-md shadow-primary/30 border border-primary-light/40'
              : 'glass text-text-secondary hover:text-white border border-border'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Cultural (8)</span>
        </button>

        <button
          onClick={() => setFilter('sports-boys')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
            filter === 'sports-boys'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
              : 'glass text-text-secondary hover:text-white border border-border'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Boys Sports (3)</span>
        </button>

        <button
          onClick={() => setFilter('sports-girls')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
            filter === 'sports-girls'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
              : 'glass text-text-secondary hover:text-white border border-border'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Girls Sports (3)</span>
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredEvents.map((evt) => {
          const isCultural = evt.category === 'cultural';
          return (
            <div
              key={evt.id}
              className="group glass rounded-2xl border border-border/80 overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative h-40 w-full overflow-hidden bg-surface-dark">
                  {evt.image_url ? (
                    <img
                      src={evt.image_url}
                      alt={evt.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      {isCultural ? (
                        <Palette className="w-8 h-8 text-primary-light/40" />
                      ) : (
                        <Trophy className="w-8 h-8 text-sports-light/40" />
                      )}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A16] via-transparent to-transparent" />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-accent-light border border-white/10">
                    {evt.event_date}
                  </span>
                  <span
                    className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      isCultural
                        ? 'bg-primary/80 text-white'
                        : 'bg-sports/80 text-white'
                    }`}
                  >
                    {isCultural ? 'Cultural' : `Sports • ${evt.gender}`}
                  </span>
                </div>

                {/* Body */}
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-base text-text-primary group-hover:text-primary-light transition-colors">
                    {evt.name}
                  </h3>
                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>
                  <div className="pt-2 text-[11px] text-text-muted space-y-1">
                    <p className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3 h-3 text-secondary-light flex-shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-accent-light flex-shrink-0" />
                      <span>{evt.start_time} – {evt.end_time}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-4 pt-0">
                <Link
                  href={`/events/${evt.slug}`}
                  className="w-full py-2 px-3 rounded-xl bg-surface-light border border-border/70 hover:border-primary/50 text-xs font-semibold text-text-primary hover:text-white flex items-center justify-between transition-colors"
                >
                  <span>View Details &amp; Rules</span>
                  <ChevronRight className="w-3.5 h-3.5 text-primary-light" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
