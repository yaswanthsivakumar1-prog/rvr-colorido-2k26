import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Palette,
  Trophy,
  Calendar,
  Clock,
  MapPin,
  Megaphone,
  CheckCircle2,
  Mail,
  Phone,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { getEvents } from '@/actions/events';
import { getPublishedAnnouncements } from '@/actions/announcements';
import { getGalleryImages } from '@/actions/gallery';

export default async function HomePage() {
  const [events, announcements, galleryImages] = await Promise.all([
    getEvents(),
    getPublishedAnnouncements(),
    getGalleryImages(),
  ]);

  const culturalEvents = events.filter((e) => e.category === 'cultural');
  const sportsEvents = events.filter((e) => e.category === 'sports');
  const boysSports = sportsEvents.filter((e) => e.gender === 'boys');
  const girlsSports = sportsEvents.filter((e) => e.gender === 'girls');

  return (
    <div className="relative overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Ambient Festival Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-primary/20 via-secondary/15 to-accent/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8 z-10">
          {/* College Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/30 shadow-lg shadow-primary/10 text-xs sm:text-sm font-medium text-text-secondary animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-accent-light animate-pulse" />
            <span>RVR &amp; J.C. College of Engineering (Autonomous), Guntur</span>
          </div>

          {/* Main Title & Subtitle */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black font-[family-name:var(--font-display)] tracking-tight leading-none">
              <span className="text-text-primary">COLORIDO </span>
              <span className="gradient-text">2K26</span>
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary font-[family-name:var(--font-display)] tracking-wide">
              Two-Day Cultural &amp; Sports Event
            </p>
            <p className="text-sm sm:text-base font-semibold text-accent-light">
              Hosted by R.V.R. &amp; J.C. College of Engineering
            </p>
            <div className="inline-block px-4 py-1 rounded-full bg-secondary/15 border border-secondary/30 text-secondary-light text-xs sm:text-sm font-semibold tracking-wide uppercase">
              Open to Eligible Students from RVR &amp; J.C. College and Participating Colleges
            </div>
          </div>

          {/* Short Tagline */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-text-secondary leading-relaxed">
            Where talent meets competition. Two full days of high-energy stage performances, artistic exhibitions, and inter-department sports tournaments across campus.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/registration"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent text-white font-bold text-sm uppercase tracking-wider shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-4 h-4 text-accent-light" />
              <span>Register Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/events"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl glass border border-border text-text-primary hover:text-primary hover:border-primary/40 hover:bg-surface-lighter font-semibold text-sm uppercase tracking-wider transition-all"
            >
              <span>Explore Events</span>
            </Link>
          </div>

          {/* Quick Schedule Badge */}
          <div className="pt-6 inline-flex flex-wrap items-center justify-center gap-6 text-xs text-text-muted">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-accent-light" />
              <span className="text-text-secondary font-medium">Day 1 &amp; Day 2</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-secondary-light" />
              <span className="text-text-secondary font-medium">Campus Grounds &amp; Auditoriums</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-text-secondary font-medium">College ID Card Required</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. ABOUT COLORIDO */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 border-y border-border/60 bg-surface-dark/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-accent-light uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>About The Fest</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black font-[family-name:var(--font-display)] text-text-primary">
            Celebrating Talent Across Campus
          </h2>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            COLORIDO 2K26 is a two-day cultural and sports event hosted by RVR &amp; J.C. College of Engineering, bringing together students from RVR &amp; J.C. and other participating colleges for selected cultural and sporting activities.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="glass p-5 rounded-2xl border border-border/80 text-left">
              <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary-light flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-text-primary text-base font-[family-name:var(--font-display)]">Two-Day Event</h3>
              <p className="text-xs text-text-muted mt-1">Conducted over 2 focused days featuring morning sports and evening cultural showcases.</p>
            </div>

            <div className="glass p-5 rounded-2xl border border-border/80 text-left">
              <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary-light flex items-center justify-center mb-3">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-text-primary text-base font-[family-name:var(--font-display)]">Cultural Activities</h3>
              <p className="text-xs text-text-muted mt-1">Fine Arts, Music &amp; Band, Dance, Choreoday, Dramatics, Fashion Show, Tekraft, and Literary.</p>
            </div>

            <div className="glass p-5 rounded-2xl border border-border/80 text-left">
              <div className="w-10 h-10 rounded-xl bg-sports/15 text-sports-light flex items-center justify-center mb-3">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-text-primary text-base font-[family-name:var(--font-display)]">Sports Tournaments</h3>
              <p className="text-xs text-text-muted mt-1">Basketball, Volleyball, Table Tennis, Throwball, and TenniKoit across college courts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CULTURAL EVENTS SECTION */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-light uppercase tracking-widest mb-2">
                <Palette className="w-3.5 h-3.5" />
                <span>Stage &amp; Creative Arts</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black font-[family-name:var(--font-display)] text-text-primary">
                Cultural Activities
              </h2>
              <p className="text-sm text-text-secondary mt-1 max-w-xl">
                Participate in your favorite creative arts, music, dance, dramatics, and fashion categories.
              </p>
            </div>
            <Link
              href="/events/cultural"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-light hover:text-white transition-colors group"
            >
              <span>View All Cultural Events</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Cultural Event Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {culturalEvents.map((evt) => (
              <div
                key={evt.id}
                className="group relative glass rounded-2xl border border-border/80 overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-44 w-full overflow-hidden bg-surface-dark">
                  {evt.image_url ? (
                    <img
                      src={evt.image_url}
                      alt={evt.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <Palette className="w-10 h-10 text-primary-light/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A16] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-accent-light border border-white/10">
                    {evt.event_date}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-lg text-text-primary font-[family-name:var(--font-display)] group-hover:text-primary-light transition-colors">
                      {evt.name}
                    </h3>
                    <p className="text-xs text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                    <span className="text-text-muted truncate max-w-[140px]">{evt.venue}</span>
                    <Link
                      href={`/events/${evt.slug}`}
                      className="font-semibold text-primary-light hover:text-white inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SPORTS SECTION */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-surface-dark/30 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sports-light uppercase tracking-widest mb-2">
                <Trophy className="w-3.5 h-3.5" />
                <span>Court &amp; Ground Championships</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black font-[family-name:var(--font-display)] text-text-primary">
                Sports Activities
              </h2>
              <p className="text-sm text-text-secondary mt-1 max-w-xl">
                Inter-department sports competitions for boys and girls conducted across college sports facilities.
              </p>
            </div>
            <Link
              href="/events/sports"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sports-light hover:text-white transition-colors group"
            >
              <span>View All Sports</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* BOYS SPORTS */}
            <div className="glass rounded-2xl p-6 border border-border/80 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <h3 className="font-bold text-lg text-text-primary font-[family-name:var(--font-display)]">
                    Boys Tournaments
                  </h3>
                </div>
                <span className="text-xs text-text-muted">3 Events</span>
              </div>

              <div className="space-y-3">
                {boysSports.map((evt) => (
                  <Link
                    key={evt.id}
                    href={`/events/${evt.slug}`}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-surface-light/40 border border-border/40 hover:border-sports/50 hover:bg-surface-light transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-dark flex-shrink-0">
                        {evt.image_url ? (
                          <img src={evt.image_url} alt={evt.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-sports/10 text-sports-light">
                            <Trophy className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-text-primary group-hover:text-sports-light transition-colors">
                          {evt.name}
                        </h4>
                        <p className="text-[11px] text-text-muted">{evt.venue} • {evt.event_date}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-sports-light group-hover:translate-x-1 transition-transform">
                      Rules &amp; Register →
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* GIRLS SPORTS */}
            <div className="glass rounded-2xl p-6 border border-border/80 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <h3 className="font-bold text-lg text-text-primary font-[family-name:var(--font-display)]">
                    Girls Tournaments
                  </h3>
                </div>
                <span className="text-xs text-text-muted">3 Events</span>
              </div>

              <div className="space-y-3">
                {girlsSports.map((evt) => (
                  <Link
                    key={evt.id}
                    href={`/events/${evt.slug}`}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-surface-light/40 border border-border/40 hover:border-accent/50 hover:bg-surface-light transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-dark flex-shrink-0">
                        {evt.image_url ? (
                          <img src={evt.image_url} alt={evt.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-accent/10 text-accent-light">
                            <Trophy className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-text-primary group-hover:text-accent-light transition-colors">
                          {evt.name}
                        </h4>
                        <p className="text-[11px] text-text-muted">{evt.venue} • {evt.event_date}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-accent-light group-hover:translate-x-1 transition-transform">
                      Rules &amp; Register →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. TWO-DAY SCHEDULE */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-light uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5" />
              <span>Event Timeline</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-[family-name:var(--font-display)] text-text-primary">
              Two-Day Schedule Structure
            </h2>
            <p className="text-sm text-text-secondary max-w-md mx-auto">
              COLORIDO 2K26 is conducted across 2 focused days with distinct morning, afternoon, and evening tracks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Day 1 */}
            <div className="glass rounded-2xl p-6 border border-primary/30 relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-5">
                <div>
                  <span className="text-xs font-bold text-accent-light uppercase tracking-wider">Day 1</span>
                  <h3 className="text-xl font-bold text-text-primary font-[family-name:var(--font-display)]">Opening &amp; Prelims</h3>
                </div>
                <div className="px-3 py-1 rounded-full bg-primary/20 text-primary-light text-xs font-semibold">
                  Day 1
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-light/30">
                  <Clock className="w-4 h-4 text-accent-light mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-text-primary">Morning (08:30 AM – 12:30 PM)</span>
                    <p className="text-xs text-text-muted mt-0.5">Basketball (Boys), Throwball (Girls), Fine Arts Sketching &amp; Tekraft presentations.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-light/30">
                  <Clock className="w-4 h-4 text-accent-light mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-text-primary">Afternoon (01:30 PM – 05:00 PM)</span>
                    <p className="text-xs text-text-muted mt-0.5">Table Tennis (Boys), Music &amp; Acoustic Band performances in the Main Auditorium.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-light/30">
                  <Clock className="w-4 h-4 text-accent-light mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-text-primary">Evening (05:30 PM – 08:30 PM)</span>
                    <p className="text-xs text-text-muted mt-0.5">Dance Showcase (Solo &amp; Group styles) at the Open Air Theatre (OAT).</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Day 2 */}
            <div className="glass rounded-2xl p-6 border border-secondary/30 relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-5">
                <div>
                  <span className="text-xs font-bold text-secondary-light uppercase tracking-wider">Day 2</span>
                  <h3 className="text-xl font-bold text-text-primary font-[family-name:var(--font-display)]">Finals &amp; Valedictory</h3>
                </div>
                <div className="px-3 py-1 rounded-full bg-secondary/20 text-secondary-light text-xs font-semibold">
                  Day 2
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-light/30">
                  <Clock className="w-4 h-4 text-secondary-light mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-text-primary">Morning (09:00 AM – 01:00 PM)</span>
                    <p className="text-xs text-text-muted mt-0.5">TenniKoit (Girls), Dramatics &amp; Skits, and Volleyball Semi-finals.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-light/30">
                  <Clock className="w-4 h-4 text-secondary-light mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-text-primary">Afternoon (01:30 PM – 05:00 PM)</span>
                    <p className="text-xs text-text-muted mt-0.5">Table Tennis (Girls), Literary Competitions, and Inter-Department Sports Finals.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-light/30">
                  <Clock className="w-4 h-4 text-secondary-light mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-text-primary">Evening (05:00 PM – 08:30 PM)</span>
                    <p className="text-xs text-text-muted mt-0.5">Fashion Show, Choreoday Grand Performances, and Valedictory Award Ceremony.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/schedule"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-light hover:text-white"
            >
              <span>View Detailed Schedule with Venues &amp; Timings →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. REGISTRATION CTA CARD */}
      {/* ========================================================================= */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-r from-primary-dark via-surface to-secondary-dark border border-primary/40 shadow-2xl">
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent-light text-xs font-bold uppercase tracking-wider">
                Online Student Registration
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-[family-name:var(--font-display)] text-white">
                Ready to Represent Your Department?
              </h2>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                Registration is open to eligible students from R.V.R. &amp; J.C. College of Engineering and participating colleges. Register with your student ID or roll number to participate in your chosen event.
              </p>
              <div className="pt-2">
                <Link
                  href="/registration"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-accent-light transition-all shadow-lg"
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Register Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. LATEST ANNOUNCEMENTS */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 border-t border-border/60 bg-surface-dark/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-light uppercase tracking-widest mb-1">
                <Megaphone className="w-3.5 h-3.5" />
                <span>Notice Board</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-[family-name:var(--font-display)] text-text-primary">
                Announcements
              </h2>
            </div>
            <Link
              href="/announcements"
              className="text-xs font-semibold text-primary-light hover:text-white"
            >
              All Notices →
            </Link>
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-4 sm:p-5 rounded-2xl glass border border-border/80 flex items-start gap-4"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary-light flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="font-bold text-sm sm:text-base text-text-primary">
                      {ann.title}
                    </h3>
                    <span className="text-[11px] text-text-muted">
                      {new Date(ann.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    {ann.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. SMALL GALLERY (6-8 MOMENTS) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 border-t border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black font-[family-name:var(--font-display)] text-text-primary">
                Festival Moments
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                Snapshots of stage events, court action, and celebrations across campus.
              </p>
            </div>
            <Link
              href="/gallery"
              className="text-xs font-semibold text-primary-light hover:text-white"
            >
              Full Gallery →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {galleryImages.slice(0, 6).map((img) => (
              <div
                key={img.id}
                className="group relative h-40 rounded-xl overflow-hidden glass border border-border/80"
              >
                <img
                  src={img.image_url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                  <span className="text-[11px] font-semibold text-white line-clamp-1">
                    {img.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. CONTACT INFORMATION */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 border-t border-border/60 bg-surface-dark/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-light uppercase tracking-widest">
            <Mail className="w-3.5 h-3.5" />
            <span>Campus Helpdesk</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-[family-name:var(--font-display)] text-text-primary">
            COLORIDO Organizing Committee
          </h2>

          <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto">
            For event questions, schedule confirmations, or registration queries, contact the student coordinator committee.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left pt-2">
            <div className="glass p-4 rounded-xl border border-border/80">
              <span className="text-[11px] text-text-muted uppercase font-bold tracking-wider">Institution</span>
              <p className="text-xs font-semibold text-text-primary mt-1">
                R.V.R. &amp; J.C. College of Engineering (Autonomous)
              </p>
              <p className="text-[11px] text-text-muted mt-0.5">
                Chandramoulipuram, Chowdavaram, Guntur - 522019
              </p>
            </div>

            <div className="glass p-4 rounded-xl border border-border/80">
              <span className="text-[11px] text-text-muted uppercase font-bold tracking-wider">Official Inquiries</span>
              <p className="text-xs font-semibold text-text-primary mt-1">
                colorido@rvrjc.ac.in
              </p>
              <p className="text-[11px] text-text-muted mt-0.5">
                Student Affairs &amp; Cultural Committee
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
