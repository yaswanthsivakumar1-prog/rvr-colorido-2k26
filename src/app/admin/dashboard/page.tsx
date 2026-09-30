import { createClient } from "@/lib/supabase/server";
import { Calendar, Users, Megaphone, Award, Palette, Trophy, CheckCircle2, Clock, TrendingUp, Building2, ArrowUpRight, Activity, Shield } from "lucide-react";
import Link from "next/link";
import type { DashboardStats } from "@/types";
import { isSupabaseConfigured, MOCK_EVENTS, MOCK_ANNOUNCEMENTS, MOCK_RESULTS, MOCK_REGISTRATIONS } from "@/lib/data/mock-data";

const DEFAULT_STATS: DashboardStats = {
  totalRegistrations: MOCK_REGISTRATIONS.length,
  totalEvents: MOCK_EVENTS.length,
  culturalEvents: MOCK_EVENTS.filter((e) => e.category === "cultural").length,
  sportsEvents: MOCK_EVENTS.filter((e) => e.category === "sports").length,
  publishedAnnouncements: MOCK_ANNOUNCEMENTS.length,
  publishedResults: MOCK_RESULTS.length,
};

interface ExtendedStats extends DashboardStats {
  pendingRegistrations: number;
  confirmedRegistrations: number;
  recentRegistrations: Array<{ id: string; full_name: string; college: string; event_name: string; status: string; created_at: string; }>;
  openEvents: number;
  closedEvents: number;
}

async function getDashboardStats(): Promise<ExtendedStats> {
  const defaults: ExtendedStats = {
    ...DEFAULT_STATS,
    pendingRegistrations: MOCK_REGISTRATIONS.filter((r) => r.status === "pending").length,
    confirmedRegistrations: MOCK_REGISTRATIONS.filter((r) => r.status === "confirmed").length,
    recentRegistrations: MOCK_REGISTRATIONS.slice(0, 5).map((r) => ({
      id: r.id,
      full_name: r.full_name,
      college: r.college || "R.V.R. & J.C. College",
      event_name: r.event?.name || "Festival Event",
      status: r.status,
      created_at: r.created_at,
    })),
    openEvents: MOCK_EVENTS.filter((e) => e.registration_open).length,
    closedEvents: MOCK_EVENTS.filter((e) => !e.registration_open).length,
  };

  if (!isSupabaseConfigured()) return defaults;

  try {
    const fetchPromise = (async () => {
      const supabase = await createClient();
      const [
        { count: totalRegistrations }, { count: totalEvents }, { count: culturalEvents },
        { count: sportsEvents }, { count: publishedAnnouncements }, { count: publishedResults },
        { count: pendingRegistrations }, { count: confirmedRegistrations },
        { count: openEvents }, { count: closedEvents }, { data: recentRegsData },
      ] = await Promise.all([
        supabase.from("registrations").select("*", { count: "exact", head: true }),
        supabase.from("events").select("*", { count: "exact", head: true }),
        supabase.from("events").select("*", { count: "exact", head: true }).eq("category", "cultural"),
        supabase.from("events").select("*", { count: "exact", head: true }).eq("category", "sports"),
        supabase.from("announcements").select("*", { count: "exact", head: true }).eq("published", true),
        supabase.from("results").select("*", { count: "exact", head: true }).eq("published", true),
        supabase.from("registrations").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("registrations").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
        supabase.from("events").select("*", { count: "exact", head: true }).eq("registration_open", true),
        supabase.from("events").select("*", { count: "exact", head: true }).eq("registration_open", false),
        supabase.from("registrations").select("id, full_name, college, status, created_at, event:events(name)").order("created_at", { ascending: false }).limit(5),
      ]);
      return {
        totalRegistrations: totalRegistrations || 0, totalEvents: totalEvents || 0,
        culturalEvents: culturalEvents || 0, sportsEvents: sportsEvents || 0,
        publishedAnnouncements: publishedAnnouncements || 0, publishedResults: publishedResults || 0,
        pendingRegistrations: pendingRegistrations || 0, confirmedRegistrations: confirmedRegistrations || 0,
        openEvents: openEvents || 0, closedEvents: closedEvents || 0,
        recentRegistrations: (recentRegsData || []).map((r: any) => ({
          id: r.id, full_name: r.full_name, college: r.college || "N/A",
          event_name: r.event?.name || "Unknown Event", status: r.status, created_at: r.created_at,
        })),
      };
    })();
    const timeoutPromise = new Promise<ExtendedStats>((resolve) => setTimeout(() => resolve(defaults), 3500));
    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch { return defaults; }
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    confirmed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    completed: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${styles[status] || styles.pending}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const primaryStats = [
    { label: "Total Registrations", value: stats.totalRegistrations, sub: `${stats.pendingRegistrations} pending`, icon: Users, color: "text-primary-light", bg: "bg-primary/15", border: "border-primary/20", href: "/admin/registrations" },
    { label: "Total Events", value: stats.totalEvents, sub: `${stats.openEvents} open for reg.`, icon: Calendar, color: "text-accent-light", bg: "bg-accent/15", border: "border-accent/20", href: "/admin/events" },
    { label: "Cultural Events", value: stats.culturalEvents, sub: "Competitions & Arts", icon: Palette, color: "text-purple-400", bg: "bg-purple-500/15", border: "border-purple-500/20", href: "/admin/events" },
    { label: "Sports Events", value: stats.sportsEvents, sub: "Boys & Girls Tournaments", icon: Trophy, color: "text-orange-400", bg: "bg-orange-500/15", border: "border-orange-500/20", href: "/admin/events" },
    { label: "Announcements", value: stats.publishedAnnouncements, sub: "Published notices", icon: Megaphone, color: "text-blue-400", bg: "bg-blue-500/15", border: "border-blue-500/20", href: "/admin/announcements" },
    { label: "Published Results", value: stats.publishedResults, sub: "Event results", icon: Award, color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/20", href: "/admin/results" },
  ];

  const quickActions = [
    { label: "Manage Events", desc: "Add, edit, open/close events", href: "/admin/events", icon: Calendar, gradient: "from-primary/80 to-purple-600/80" },
    { label: "Registrations", desc: "View & manage participants", href: "/admin/registrations", icon: Users, gradient: "from-secondary/80 to-orange-500/80" },
    { label: "Post Announcement", desc: "Publish notices for students", href: "/admin/announcements", icon: Megaphone, gradient: "from-blue-600/80 to-indigo-600/80" },
    { label: "Publish Results", desc: "Declare event winners", href: "/admin/results", icon: Award, gradient: "from-emerald-600/80 to-teal-600/80" },
    { label: "Colleges", desc: "Manage participating colleges", href: "/admin/colleges", icon: Building2, gradient: "from-pink-600/80 to-rose-500/80" },
    { label: "Gallery", desc: "Upload event photos", href: "/admin/gallery", icon: Activity, gradient: "from-cyan-600/80 to-sky-500/80" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl glass border border-border/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 pointer-events-none" />
        <div className="relative space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-primary-light">
            <Shield className="w-3.5 h-3.5" />
            Admin Control Panel
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-display)] text-text-primary">
            COLORIDO 2K26 Dashboard
          </h1>
          <p className="text-xs text-text-secondary">
            R.V.R. & J.C. College of Engineering (Autonomous) — Two-Day Cultural & Sports Fest
          </p>
        </div>
        <div className="relative flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass border border-emerald-500/30 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-medium">Event Active</span>
          </div>
          <Link href="/admin/registrations" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all shadow-sm">
            <Users className="w-3.5 h-3.5" />
            View Registrations
          </Link>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {primaryStats.map((stat) => (
          <Link key={stat.label} href={stat.href} className={`group p-4 rounded-2xl glass border ${stat.border} hover:scale-[1.02] transition-all space-y-3`}>
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-[18px] h-[18px] ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary font-mono">{stat.value}</p>
              <p className="text-[11px] font-semibold text-text-primary mt-0.5 truncate">{stat.label}</p>
              <p className="text-[10px] text-text-muted truncate">{stat.sub}</p>
            </div>
            <ArrowUpRight className={`w-3.5 h-3.5 ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
          </Link>
        ))}
      </div>

      {/* Registration Breakdown + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass rounded-2xl border border-border/80 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary-light" />
              Registration Breakdown
            </h2>
            <Link href="/admin/registrations" className="text-xs text-primary-light hover:underline font-medium flex items-center gap-1">
              View All <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { label: "Pending Review", count: stats.pendingRegistrations, total: stats.totalRegistrations || 1, color: "bg-amber-400", textColor: "text-amber-400" },
              { label: "Confirmed", count: stats.confirmedRegistrations, total: stats.totalRegistrations || 1, color: "bg-emerald-400", textColor: "text-emerald-400" },
              { label: "Total Registered", count: stats.totalRegistrations, total: stats.totalRegistrations || 1, color: "bg-primary-light", textColor: "text-primary-light" },
            ].map((item) => {
              const pct = Math.round((item.count / item.total) * 100);
              return (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary">{item.label}</span>
                    <span className={`font-bold ${item.textColor}`}>{item.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-dark overflow-hidden">
                    <div className={`h-full rounded-full ${item.color} transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pt-3 border-t border-border/60 grid grid-cols-2 gap-3 text-center">
            <div className="p-2 rounded-xl bg-surface-dark/60 border border-border/50">
              <p className="text-base font-bold text-emerald-400 font-mono">{stats.openEvents}</p>
              <p className="text-[10px] text-text-muted">Events Open</p>
            </div>
            <div className="p-2 rounded-xl bg-surface-dark/60 border border-border/50">
              <p className="text-base font-bold text-text-secondary font-mono">{stats.closedEvents}</p>
              <p className="text-[10px] text-text-muted">Events Closed</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl border border-border/80 p-5 space-y-4">
          <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent-light" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href} className={`group relative flex flex-col justify-between p-3.5 rounded-xl bg-gradient-to-br ${action.gradient} hover:scale-[1.02] transition-all overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="relative">
                  <action.icon className="w-4 h-4 text-white mb-2" />
                  <p className="text-xs font-bold text-white">{action.label}</p>
                  <p className="text-[10px] text-white/70 mt-0.5 leading-tight">{action.desc}</p>
                </div>
                <ArrowUpRight className="relative w-3.5 h-3.5 text-white/60 group-hover:text-white self-end mt-2 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Registrations Table */}
      <div className="glass rounded-2xl border border-border/80 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
          <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent-light" />
            Recent Registrations
          </h2>
          <Link href="/admin/registrations" className="text-xs text-primary-light hover:underline font-medium flex items-center gap-1">
            See All <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          {stats.recentRegistrations.length === 0 ? (
            <div className="text-center py-10">
              <Users className="w-8 h-8 text-text-muted mx-auto mb-2" />
              <p className="text-xs text-text-muted">No registrations yet.</p>
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Student Name</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider hidden sm:table-cell">College</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Event</th>
                  <th className="text-center px-4 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {stats.recentRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 font-medium text-text-primary truncate max-w-[140px]">{reg.full_name}</td>
                    <td className="px-4 py-3 text-text-secondary truncate max-w-[160px] hidden sm:table-cell">{reg.college}</td>
                    <td className="px-4 py-3 text-text-secondary truncate max-w-[140px]">{reg.event_name}</td>
                    <td className="px-4 py-3 text-center"><StatusBadge status={reg.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Event Info + System Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass rounded-2xl border border-border/80 p-5 space-y-3">
          <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary-light" />
            Event Summary
          </h2>
          {[
            { label: "Event Name", value: "RVR COLORIDO 2K26" },
            { label: "Duration", value: "Two-Day Event — Day 1 & Day 2" },
            { label: "Host", value: "R.V.R. & J.C. College of Engineering (Autonomous)" },
            { label: "Cultural Events", value: `${stats.culturalEvents} competitions` },
            { label: "Sports Events", value: `${stats.sportsEvents} tournaments` },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-start justify-between gap-3 text-xs">
              <span className="text-text-muted flex-shrink-0">{label}</span>
              <span className="text-text-primary font-medium text-right">{value}</span>
            </div>
          ))}
        </div>
        <div className="glass rounded-2xl border border-border/80 p-5 space-y-3">
          <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            System Status
          </h2>
          {[
            { label: "Registration Portal", status: "Online", ok: true },
            { label: "Student Portal Login", status: "Active", ok: true },
            { label: "Event Directory", status: "Published", ok: true },
            { label: "Announcements Module", status: stats.publishedAnnouncements > 0 ? "Active" : "No Posts", ok: stats.publishedAnnouncements > 0 },
            { label: "Results Module", status: stats.publishedResults > 0 ? "Active" : "No Results", ok: stats.publishedResults > 0 },
          ].map(({ label, status, ok }) => (
            <div key={label} className="flex items-center justify-between gap-3 text-xs">
              <span className="text-text-muted">{label}</span>
              <span className={`flex items-center gap-1.5 font-semibold ${ok ? "text-emerald-400" : "text-amber-400"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-emerald-400" : "bg-amber-400"}`} />
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}