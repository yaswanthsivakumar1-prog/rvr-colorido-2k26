'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Award,
  Medal,
  Palette,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import type { Result } from '@/types';

interface ResultsBoardProps {
  results: Result[];
}

export default function ResultsBoard({ results }: ResultsBoardProps) {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'cultural' | 'sports'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Group results by event
  const eventsMap: Record<
    string,
    {
      eventId: string;
      eventName: string;
      eventCategory: string;
      eventSubcategory: string;
      items: Result[];
    }
  > = {};

  results.forEach((res) => {
    const id = res.event_id;
    if (!eventsMap[id]) {
      eventsMap[id] = {
        eventId: id,
        eventName: res.event?.name || 'Tournament Competition',
        eventCategory: res.event?.category || 'cultural',
        eventSubcategory: res.event?.subcategory || 'General',
        items: [],
      };
    }
    eventsMap[id].items.push(res);
  });

  const eventGroups = Object.values(eventsMap).filter((group) => {
    const matchesCategory = categoryFilter === 'all' || group.eventCategory === categoryFilter;
    const matchesSearch =
      searchQuery === '' ||
      group.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.eventSubcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.items.some(
        (i) =>
          i.participant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (i.team_name && i.team_name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    return matchesCategory && matchesSearch;
  });

  const medalStyles: Record<number, { border: string; glow: string; text: string; bg: string; label: string; icon: string }> = {
    1: {
      border: 'border-amber-400/60',
      glow: 'shadow-lg shadow-amber-500/20',
      text: 'text-amber-300',
      bg: 'bg-gradient-to-br from-amber-500/20 to-yellow-600/10',
      label: '🥇 1st Place (Gold Champion)',
      icon: '🥇',
    },
    2: {
      border: 'border-slate-300/50',
      glow: 'shadow-lg shadow-slate-300/10',
      text: 'text-slate-200',
      bg: 'bg-gradient-to-br from-slate-400/20 to-gray-500/10',
      label: '🥈 2nd Place (Silver Runner-up)',
      icon: '🥈',
    },
    3: {
      border: 'border-amber-700/50',
      glow: 'shadow-lg shadow-amber-800/10',
      text: 'text-amber-500',
      bg: 'bg-gradient-to-br from-amber-800/20 to-orange-950/10',
      label: '🥉 3rd Place (Bronze Second Runner-up)',
      icon: '🥉',
    },
  };

  return (
    <div className="space-y-8">
      {/* Filter and Search Bar */}
      <div className="glass-strong rounded-3xl p-5 sm:p-6 border border-border/80 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search winners by participant, college, or event..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-light focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface border border-border shrink-0">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                categoryFilter === 'all'
                  ? 'bg-gradient-to-r from-accent to-secondary text-white shadow-sm'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              All Results
            </button>
            <button
              onClick={() => setCategoryFilter('cultural')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                categoryFilter === 'cultural'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Cultural</span>
            </button>
            <button
              onClick={() => setCategoryFilter('sports')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                categoryFilter === 'sports'
                  ? 'bg-sports text-white shadow-sm'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Sports</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Groups */}
      {eventGroups.length === 0 ? (
        <div className="glass-strong rounded-3xl p-12 text-center max-w-md mx-auto border border-border/80 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-accent/20 text-accent-light flex items-center justify-center mx-auto">
            <Award className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white font-[family-name:var(--font-display)]">
            No Published Results Yet
          </h3>
          <p className="text-xs text-text-secondary">
            Results will be updated live as each tournament bracket and stage competition concludes.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {eventGroups.map((group) => {
            const isCultural = group.eventCategory === 'cultural';
            const sortedItems = [...group.items].sort((a, b) => a.position - b.position);

            return (
              <div
                key={group.eventId}
                className="glass-strong rounded-3xl overflow-hidden border border-border/80 shadow-2xl space-y-6"
              >
                {/* Event Banner Header */}
                <div
                  className={`p-6 bg-gradient-to-r flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCultural
                      ? 'from-primary-dark/80 via-primary/60 to-surface'
                      : 'from-sports/80 via-sports/50 to-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                      {isCultural ? <Palette className="w-6 h-6" /> : <Trophy className="w-6 h-6" />}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-accent-light block">
                        {group.eventCategory} • {group.eventSubcategory}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black font-[family-name:var(--font-display)] text-white">
                        {group.eventName}
                      </h3>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-white backdrop-blur-md w-fit">
                    Verified Podium
                  </span>
                </div>

                {/* Podium Cards Grid */}
                <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sortedItems.map((res) => {
                    const style = medalStyles[res.position] || medalStyles[3];
                    return (
                      <div
                        key={res.id}
                        className={`rounded-2xl p-5 border ${style.border} ${style.bg} ${style.glow} flex flex-col justify-between space-y-4`}
                      >
                        <div>
                          {/* Position Badge */}
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl">{style.icon}</span>
                            <span className={`text-xs font-black uppercase tracking-wider ${style.text}`}>
                              {res.position === 1
                                ? '1st Place • Winner'
                                : res.position === 2
                                ? '2nd Place • Runner-Up'
                                : '3rd Place • 2nd Runner'}
                            </span>
                          </div>

                          {/* Winner Name */}
                          <h4 className="text-lg font-bold text-white font-[family-name:var(--font-display)]">
                            {res.participant_name}
                          </h4>

                          {res.team_name && (
                            <p className="text-xs font-semibold text-accent-light mt-0.5">
                              Team: {res.team_name}
                            </p>
                          )}

                          {/* College */}
                          <p className="text-xs text-text-secondary mt-1">
                            {res.college}
                          </p>
                        </div>

                        {/* Score & Remarks */}
                        {(res.score || res.remarks) && (
                          <div className="pt-3 border-t border-border/40 text-xs space-y-1">
                            {res.score && (
                              <div className="flex items-center justify-between">
                                <span className="text-text-muted">Final Score:</span>
                                <span className="font-mono font-bold text-white">{res.score}</span>
                              </div>
                            )}
                            {res.remarks && (
                              <p className="text-[11px] text-text-muted italic line-clamp-2">
                                &ldquo;{res.remarks}&rdquo;
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
