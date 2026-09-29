'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, X, Sparkles, Filter, Trophy, ArrowRight } from 'lucide-react';
import EventCard from '@/components/event-card';
import type { Event } from '@/types';

interface CulturalFiltersProps {
  events: Event[];
  subcategories: string[];
}

export default function CulturalFilters({ events, subcategories }: CulturalFiltersProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = events.filter((event) => {
    const matchesFilter = activeFilter === 'all' || event.subcategory === activeFilter;
    const matchesSearch =
      searchQuery === '' ||
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (event.venue && event.venue.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Control Bar: Search & Subcategory Pills */}
      <div className="glass-strong rounded-2xl p-4 sm:p-6 border border-border/80 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search cultural events by name, theme, or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary/25 transition-all"
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

          {/* Quick Stats & Reset */}
          <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-text-muted">
            <span>
              Showing <strong className="text-white">{filteredEvents.length}</strong> of{' '}
              {events.length} competitions
            </span>
            {(activeFilter !== 'all' || searchQuery !== '') && (
              <button
                onClick={() => {
                  setActiveFilter('all');
                  setSearchQuery('');
                }}
                className="text-xs text-accent-light hover:underline font-semibold"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Subcategory Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
          <span className="text-xs text-text-muted flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </span>

          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-200 ${
              activeFilter === 'all'
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/25'
                : 'glass text-text-secondary hover:text-white hover:bg-white/10'
            }`}
          >
            All Cultural ({events.length})
          </button>

          {subcategories.map((sub) => {
            const count = events.filter((e) => e.subcategory === sub).length;
            const isActive = activeFilter === sub;
            return (
              <button
                key={sub}
                onClick={() => setActiveFilter(sub)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/30 border border-primary-light/40'
                    : 'glass text-text-secondary hover:text-white hover:bg-white/10'
                }`}
              >
                {sub.replace(/-/g, ' ')} <span className="opacity-60 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Event Cards Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="glass-strong rounded-3xl p-12 text-center max-w-xl mx-auto border border-border/80 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary-light flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white font-[family-name:var(--font-display)]">
            No Cultural Events Found
          </h3>
          <p className="text-sm text-text-secondary">
            No competitions matched your search query &ldquo;{searchQuery}&rdquo;. Try another keyword or clear your filters.
          </p>
          <button
            onClick={() => {
              setActiveFilter('all');
              setSearchQuery('');
            }}
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary-light transition-colors"
          >
            Show All Events
          </button>
        </div>
      )}

      {/* Switch to Sports Banner */}
      <div className="p-6 rounded-2xl glass border border-sports/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-sports/20 flex items-center justify-center text-sports-light shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-[family-name:var(--font-display)]">
              Looking for Sports Tournaments?
            </h4>
            <p className="text-xs text-text-secondary">
              Explore Boys &amp; Girls championships in Basketball, Volleyball, Throwball, Badminton, and Table Tennis.
            </p>
          </div>
        </div>
        <Link
          href="/events/sports"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sports/20 hover:bg-sports/30 border border-sports/40 text-sports-light font-bold text-xs uppercase tracking-wider transition-all shrink-0"
        >
          <span>Go to Sports Arena</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
