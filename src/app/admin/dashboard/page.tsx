import { createClient } from '@/lib/supabase/server';
import {
  Calendar,
  Users,
  Megaphone,
  Award,
  Palette,
  Trophy,
} from 'lucide-react';
import type { DashboardStats } from '@/types';

import {
  isSupabaseConfigured,
  MOCK_EVENTS,
  MOCK_ANNOUNCEMENTS,
  MOCK_RESULTS,
  MOCK_REGISTRATIONS,
} from '@/lib/data/mock-data';

const DEFAULT_STATS: DashboardStats = {
  totalRegistrations: MOCK_REGISTRATIONS.length,
  totalEvents: MOCK_EVENTS.length,
  culturalEvents: MOCK_EVENTS.filter((e) => e.category === 'cultural').length,
  sportsEvents: MOCK_EVENTS.filter((e) => e.category === 'sports').length,
  publishedAnnouncements: MOCK_ANNOUNCEMENTS.length,
  publishedResults: MOCK_RESULTS.length,
};

async function getDashboardStats(): Promise<DashboardStats> {
  if (!isSupabaseConfigured()) {
    return DEFAULT_STATS;
  }

  try {
    const fetchPromise = (async () => {
      const supabase = await createClient();
      const [
        { count: totalRegistrations },
        { count: totalEvents },
        { count: culturalEvents },
        { count: sportsEvents },
        { count: publishedAnnouncements },
        { count: publishedResults },
      ] = await Promise.all([
        supabase.from('registrations').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }).eq('category', 'cultural'),
        supabase.from('events').select('*', { count: 'exact', head: true }).eq('category', 'sports'),
        supabase.from('announcements').select('*', { count: 'exact', head: true }).eq('published', true),
        supabase.from('results').select('*', { count: 'exact', head: true }).eq('published', true),
      ]);

      return {
        totalRegistrations: totalRegistrations || 0,
        totalEvents: totalEvents || 0,
        culturalEvents: culturalEvents || 0,
        sportsEvents: sportsEvents || 0,
        publishedAnnouncements: publishedAnnouncements || 0,
        publishedResults: publishedResults || 0,
      };
    })();

    const timeoutPromise = new Promise<DashboardStats>((resolve) =>
      setTimeout(() => resolve(DEFAULT_STATS), 3500)
    );

    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return DEFAULT_STATS;
  }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      label: 'Total Registrations',
      value: stats.totalRegistrations,
      icon: Users,
      color: 'text-primary-light',
      bg: 'bg-primary/15',
    },
    {
      label: 'Total Events',
      value: stats.totalEvents,
      icon: Calendar,
      color: 'text-accent-light',
      bg: 'bg-accent/15',
    },
    {
      label: 'Cultural Events',
      value: stats.culturalEvents,
      icon: Palette,
      color: 'text-purple-400',
      bg: 'bg-purple-500/15',
    },
    {
      label: 'Sports Events',
      value: stats.sportsEvents,
      icon: Trophy,
      color: 'text-orange-400',
      bg: 'bg-orange-500/15',
    },
    {
      label: 'Published Announcements',
      value: stats.publishedAnnouncements,
      icon: Megaphone,
      color: 'text-blue-400',
      bg: 'bg-blue-500/15',
    },
    {
      label: 'Published Results',
      value: stats.publishedResults,
      icon: Award,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/15',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-primary mb-1">
          Dashboard
        </h1>
        <p className="text-sm text-text-secondary">
          Welcome to the COLORIDO 2K26 Admin Dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary font-[family-name:var(--font-display)]">
                  {stat.value}
                </p>
                <p className="text-xs text-text-muted">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4 font-[family-name:var(--font-display)]">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Manage Events', href: '/admin/events', icon: Calendar, color: 'from-primary to-purple-500' },
            { label: 'View Registrations', href: '/admin/registrations', icon: Users, color: 'from-secondary to-orange-500' },
            { label: 'Post Announcement', href: '/admin/announcements', icon: Megaphone, color: 'from-blue-500 to-indigo-500' },
            { label: 'Publish Results', href: '/admin/results', icon: Award, color: 'from-emerald-500 to-teal-500' },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r ${action.color} text-white text-sm font-medium hover:shadow-lg transition-all hover:scale-[1.02]`}
            >
              <action.icon className="w-5 h-5" />
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
