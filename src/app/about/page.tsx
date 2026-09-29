import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/page-header';
import {
  Sparkles,
  Trophy,
  Palette,
  Calendar,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About COLORIDO 2K26 | RVR & JC College of Engineering',
  description:
    'COLORIDO 2K26 is a two-day cultural and sports event hosted by RVR & JC College of Engineering . Open to eligible students from RVR & J.C. College and participating colleges.',
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About COLORIDO 2K26"
        subtitle="Two-Day College Fest"
        description="A celebration of student creativity, performance arts, and athletic sportsmanship across the campus."
        gradient="primary"
        breadcrumbs={[{ label: 'About' }]}
      />

      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Core About Statement */}
          <div className="glass rounded-3xl p-8 sm:p-10 border border-border/80 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary-light text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Two-Day Student Event</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-[family-name:var(--font-display)] text-text-primary">
              Where Talent Meets Competition
            </h2>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
              COLORIDO 2K26 is a two-day cultural and sports event hosted by RVR &amp; J.C. College of Engineering, bringing together students from RVR &amp; J.C. and other participating colleges for selected cultural and sporting activities.
            </p>

            <p className="text-sm text-text-secondary leading-relaxed">
              Conducted across college auditoriums, open-air stages, and campus sports courts, COLORIDO brings together students from all academic departments in an atmosphere of healthy competition and creative expression.
            </p>
          </div>

          {/* Event Structure & Scope */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-6 border border-border/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary-light flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-text-primary font-[family-name:var(--font-display)]">
                Cultural Activities
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Features 8 major categories: Fine Arts, Music &amp; Band (Solo/Group), Dance (Solo/Group), Choreoday, Dramatics, Fashion Show, Tekraft Events, and Literary competitions.
              </p>
              <div className="pt-2">
                <Link
                  href="/events/cultural"
                  className="text-xs font-semibold text-primary-light hover:underline inline-flex items-center gap-1"
                >
                  <span>Explore Cultural Events</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border border-border/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sports/15 text-sports-light flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-text-primary font-[family-name:var(--font-display)]">
                Sports Tournaments
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Organized separately for Boys and Girls. Boys participate in Basketball, Volleyball, and Table Tennis. Girls compete in Throwball, TenniKoit, and Table Tennis.
              </p>
              <div className="pt-2">
                <Link
                  href="/events/sports"
                  className="text-xs font-semibold text-sports-light hover:underline inline-flex items-center gap-1"
                >
                  <span>Explore Sports Events</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Host Institution & Venues */}
          <div className="glass rounded-2xl p-6 sm:p-8 border border-border/80 space-y-4">
            <h3 className="text-xl font-bold text-text-primary font-[family-name:var(--font-display)]">
              Host Institution &amp; Campus Venues
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              <strong>R.V.R. &amp; J.C. College of Engineering (Autonomous)</strong> is located at Chandramoulipuram, Chowdavaram, Guntur - 522019. The events are hosted across verified campus venues:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-surface-light/40 border border-border/40">
                <span className="font-semibold text-text-primary block">Main Auditorium &amp; Mini Auditorium</span>
                <span className="text-text-muted">Acoustic halls for Music, Band &amp; Dramatics skits.</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-light/40 border border-border/40">
                <span className="font-semibold text-text-primary block">Open Air Theatre (OAT)</span>
                <span className="text-text-muted">Main evening stage for Dance, Choreoday &amp; Fashion Show.</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-light/40 border border-border/40">
                <span className="font-semibold text-text-primary block">Silver Jubilee Block</span>
                <span className="text-text-muted">Drawing Hall &amp; Seminar Halls for Fine Arts &amp; Tekraft.</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-light/40 border border-border/40">
                <span className="font-semibold text-text-primary block">Outdoor Courts &amp; Indoor Complex</span>
                <span className="text-text-muted">Basketball, Volleyball, Throwball, TenniKoit &amp; Table Tennis.</span>
              </div>
            </div>
          </div>

          {/* Registration Notice CTA */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/15 to-secondary/15 border border-primary/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-text-primary text-sm sm:text-base">
                Ready to take part in COLORIDO 2K26?
              </h4>
              <p className="text-xs text-text-secondary mt-0.5">
                Online registration is open to eligible students from RVR &amp; J.C. College and participating colleges.
              </p>
            </div>
            <Link
              href="/registration"
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary-light transition-all flex-shrink-0"
            >
              Register Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
