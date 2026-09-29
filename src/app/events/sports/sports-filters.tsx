'use client';

import { useState } from 'react';
import Link from 'next/link';
import EventCard from '@/components/event-card';
import { Trophy, Search, X, Palette, ArrowRight, Filter, ShieldCheck } from 'lucide-react';
import type { Event } from '@/types';

interface SportsFiltersProps {
  events: Event[];
}

export default function SportsFilters({ events }: SportsFiltersProps) {
  const [genderFilter, setGenderFilter] = useState<'all' | 'boys' | 'girls'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sportFilter, setSportFilter] = useState('all');

  const sportsList = Array.from(new Set(events.map((e) => e.subcategory)));

  const filteredEvents = events.filter((e) => {
    const matchesGender = genderFilter === 'all' || e.gender === genderFilter;
    const matchesSport = sportFilter === 'all' || e.subcategory === sportFilter;
    const matchesSearch =
      searchQuery === '' ||
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.venue && e.venue.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGender && matchesSport && matchesSearch;
  });

  const boysEvents = filteredEvents.filter((e) => e.gender === 'boys');
  const girlsEvents = filteredEvents.filter((e) => e.gender === 'girls');

  return (
    <div className="space-y-8">
      {/* Control Bar */}
      <div className="glass-strong rounded-2xl p-4 sm:p-6 border border-border/80 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search sports by title, tournament, or court..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-sports-light focus:ring-2 focus:ring-sports/25 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Division Selector Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface border border-border shrink-0">
            <button
              onClick={() => setGenderFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                genderFilter === 'all'
                  ? 'bg-gradient-to-r from-sports to-emerald text-white shadow-md'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              All Divisions
            </button>
            <button
              onClick={() => setGenderFilter('boys')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                genderFilter === 'boys'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              Boys (Men)
            </button>
            <button
              onClick={() => setGenderFilter('girls')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                genderFilter === 'girls'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              Girls (Women)
            </button>
          </div>
        </div>

        {/* Sport Sub-filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
          <span className="text-xs text-text-muted flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Sport:</span>
          </span>

          <button
            onClick={() => setSportFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase transition-all ${
              sportFilter === 'all'
                ? 'bg-white/20 text-white border border-white/30'
                : 'glass text-text-secondary hover:text-white'
            }`}
          >
            All Sports
          </button>

          {sportsList.map((sport) => {
            const count = events.filter((e) => e.subcategory === sport).length;
            const isActive = sportFilter === sport;
            return (
              <button
                key={sport}
                onClick={() => setSportFilter(sport)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  isActive
                    ? 'bg-sports text-white border border-sports-light/40 shadow-sm'
                    : 'glass text-text-secondary hover:text-white'
                }`}
              >
                {sport.replace(/-/g, ' ')} <span className="opacity-60 text-[10px]">({count})</span>
              </button>
            );
          })}

          {(searchQuery || sportFilter !== 'all' || genderFilter !== 'all') && (
            <button
              onClick={() => {
                setGenderFilter('all');
                setSportFilter('all');
                setSearchQuery('');
              }}
              className="text-xs text-accent-light hover:underline font-semibold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results View */}
      {filteredEvents.length === 0 ? (
        <div className="glass-strong rounded-3xl p-12 text-center max-w-xl mx-auto border border-border/80 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-sports/20 text-sports-light flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white font-[family-name:var(--font-display)]">
            No Sports Matches Found
          </h3>
          <p className="text-sm text-text-secondary">
            No sports championships matched your filter criteria. Try resetting the filters to view all tournaments.
          </p>
          <button
            onClick={() => {
              setGenderFilter('all');
              setSportFilter('all');
              setSearchQuery('');
            }}
            className="px-5 py-2.5 rounded-xl bg-sports text-white text-xs font-bold uppercase tracking-wider hover:bg-sports-light transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : genderFilter === 'all' && sportFilter === 'all' && searchQuery === '' ? (
        <div className="space-y-12">
          {/* Boys Section */}
          {boysEvents.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-border/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-white">
                      Boys Championships
                    </h2>
                    <p className="text-xs text-text-muted">Inter-College Men&apos;s Division</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30 uppercase">
                  {boysEvents.length} Tournaments
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {boysEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}

          {/* Girls Section */}
          {girlsEvents.length > 0 && (
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-white">
                      Girls Championships
                    </h2>
                    <p className="text-xs text-text-muted">Inter-College Women&apos;s Division</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-600/20 text-rose-400 border border-rose-500/30 uppercase">
                  {girlsEvents.length} Tournaments
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {girlsEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Switch to Cultural Banner */}
      <div className="p-6 rounded-2xl glass border border-primary/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary-light shrink-0">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-[family-name:var(--font-display)]">
              Looking for Cultural &amp; Music Events?
            </h4>
            <p className="text-xs text-text-secondary">
              Explore Battle of the Bands, Solo &amp; Group Dance, Choreoday, Dramatics, and Fine Arts.
            </p>
          </div>
        </div>
        <Link
          href="/events/cultural"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary-light font-bold text-xs uppercase tracking-wider transition-all shrink-0"
        >
          <span>Go to Cultural Arena</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
