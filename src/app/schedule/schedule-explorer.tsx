'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Palette,
  Trophy,
  ArrowRight,
  Filter,
} from 'lucide-react';
import type { Event } from '@/types';

interface ScheduleExplorerProps {
  events: Event[];
}

export default function ScheduleExplorer({ events }: ScheduleExplorerProps) {
  const [activeDay, setActiveDay] = useState<'Day 1' | 'Day 2'>('Day 1');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'cultural' | 'sports'>('all');

  const dayEvents = events.filter((e) => {
    const matchesDay = e.event_date === activeDay || (activeDay === 'Day 1' && !e.event_date.includes('Day 2'));
    const matchesCat = categoryFilter === 'all' || e.category === categoryFilter;
    return matchesDay && matchesCat;
  });

  // Categorize events by time of day
  const morningEvents = dayEvents.filter((e) => {
    const time = e.start_time.toUpperCase();
    return time.includes('08:') || time.includes('09:') || time.includes('10:') || time.includes('11:');
  });

  const afternoonEvents = dayEvents.filter((e) => {
    const time = e.start_time.toUpperCase();
    return time.includes('12:') || time.includes('01:') || time.includes('02:') || time.includes('03:') || time.includes('04:');
  });

  const eveningEvents = dayEvents.filter((e) => {
    const time = e.start_time.toUpperCase();
    return time.includes('05:') || time.includes('06:') || time.includes('07:') || time.includes('08:') || time.includes('PM') && !afternoonEvents.includes(e);
  });

  return (
    <div className="space-y-8">
      {/* Day Selector & Category Filter */}
      <div className="glass rounded-2xl p-4 sm:p-5 border border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Day 1 & Day 2 Tabs */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveDay('Day 1')}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              activeDay === 'Day 1'
                ? 'bg-primary text-white shadow-lg shadow-primary/25 border border-primary-light/40'
                : 'glass text-text-secondary hover:text-white border border-border'
            }`}
          >
            Day 1 Schedule
          </button>
          <button
            onClick={() => setActiveDay('Day 2')}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              activeDay === 'Day 2'
                ? 'bg-secondary text-white shadow-lg shadow-secondary/25 border border-secondary-light/40'
                : 'glass text-text-secondary hover:text-white border border-border'
            }`}
          >
            Day 2 Schedule
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-dark border border-border w-full sm:w-auto justify-center">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              categoryFilter === 'all'
                ? 'bg-white/15 text-white'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setCategoryFilter('cultural')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              categoryFilter === 'cultural'
                ? 'bg-primary/20 text-primary-light border border-primary/40'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Palette className="w-3 h-3" />
            <span>Cultural</span>
          </button>
          <button
            onClick={() => setCategoryFilter('sports')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              categoryFilter === 'sports'
                ? 'bg-sports/20 text-sports-light border border-sports/40'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Trophy className="w-3 h-3" />
            <span>Sports</span>
          </button>
        </div>
      </div>

      {/* Day Overview Banner */}
      <div className="p-4 sm:p-5 rounded-2xl glass border border-border/80 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg text-text-primary font-[family-name:var(--font-display)]">
            {activeDay === 'Day 1' ? 'Day 1 — Inauguration, Prelims & Evening Dance' : 'Day 2 — Competitions, Finals & Valedictory'}
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            {activeDay === 'Day 1'
              ? 'Opening sports rounds in the morning, band & fine arts in the afternoon, followed by dance at OAT.'
              : 'Dramatics & tennis in the morning, literary & sports finals in afternoon, followed by Choreoday & awards.'}
          </p>
        </div>
        <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-accent/15 text-accent-light text-xs font-semibold uppercase tracking-wider">
          {dayEvents.length} Events
        </span>
      </div>

      {/* Schedule Tracks */}
      <div className="space-y-6">
        {/* Morning Track */}
        {morningEvents.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-light">
              <Clock className="w-4 h-4" />
              <span>Morning Session (08:30 AM – 01:00 PM)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {morningEvents.map((evt) => (
                <ScheduleEventCard key={evt.id} event={evt} />
              ))}
            </div>
          </div>
        )}

        {/* Afternoon Track */}
        {afternoonEvents.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary-light">
              <Clock className="w-4 h-4" />
              <span>Afternoon Session (01:30 PM – 05:00 PM)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {afternoonEvents.map((evt) => (
                <ScheduleEventCard key={evt.id} event={evt} />
              ))}
            </div>
          </div>
        )}

        {/* Evening Track */}
        {eveningEvents.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-light">
              <Clock className="w-4 h-4" />
              <span>Evening Session (05:00 PM – 08:30 PM)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {eveningEvents.map((evt) => (
                <ScheduleEventCard key={evt.id} event={evt} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ScheduleEventCard({ event }: { event: Event }) {
  const isCultural = event.category === 'cultural';

  return (
    <div className="glass rounded-xl p-4 border border-border/80 hover:border-primary/40 transition-all flex items-start justify-between gap-3">
      <div className="space-y-1 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
              isCultural
                ? 'bg-primary/20 text-primary-light border border-primary/30'
                : 'bg-sports/20 text-sports-light border border-sports/30'
            }`}
          >
            {isCultural ? 'Cultural' : `Sports • ${event.gender}`}
          </span>
          <span className="text-[11px] text-text-muted flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3 text-text-muted" />
            {event.start_time} – {event.end_time}
          </span>
        </div>

        <h4 className="font-bold text-sm text-text-primary">{event.name}</h4>
        <p className="text-xs text-text-muted flex items-center gap-1">
          <MapPin className="w-3 h-3 text-secondary-light flex-shrink-0" />
          <span className="truncate">{event.venue}</span>
        </p>
      </div>

      <Link
        href={`/events/${event.slug}`}
        className="px-3 py-1.5 rounded-lg bg-surface-light border border-border text-xs font-medium text-text-primary hover:text-white hover:border-primary/50 transition-colors flex-shrink-0 mt-1"
      >
        Rules
      </Link>
    </div>
  );
}
