import Link from 'next/link';
import {
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Award,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import {
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
  FacebookIcon,
} from '@/components/icons/social';

const culturalLinks = [
  { href: '/events/cultural', label: 'Fine Arts' },
  { href: '/events/cultural', label: 'Music & Band' },
  { href: '/events/cultural', label: 'Dance (Solo & Group)' },
  { href: '/events/cultural', label: 'Choreoday' },
  { href: '/events/cultural', label: 'Dramatics & Fashion Show' },
  { href: '/events/cultural', label: 'Tekraft & Literary' },
];

const sportsLinks = [
  { href: '/events/sports', label: 'Boys Basketball' },
  { href: '/events/sports', label: 'Boys Volleyball' },
  { href: '/events/sports', label: 'Boys Table Tennis' },
  { href: '/events/sports', label: 'Girls Throwball' },
  { href: '/events/sports', label: 'Girls TenniKoit' },
  { href: '/events/sports', label: 'Girls Table Tennis' },
];

const quickLinks = [
  { href: '/about', label: 'About Fest' },
  { href: '/events', label: 'All Events' },
  { href: '/schedule', label: 'Two-Day Schedule' },
  { href: '/announcements', label: 'Announcements' },
  { href: '/results', label: 'Results' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/registration', label: 'Register Now' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#070712] border-t border-border/80 overflow-hidden">
      {/* Subtle top festival glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary-light to-transparent opacity-60" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-border/60">
          {/* Brand Column (Span 2 on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary via-secondary to-accent flex items-center justify-center p-0.5 shadow-lg shadow-primary/25">
                <div className="w-full h-full rounded-[10px] bg-[#0A0A16] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-accent-light" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black font-[family-name:var(--font-display)] gradient-text tracking-wider">
                  COLORIDO 2K26
                </span>
                <span className="text-[10px] text-text-muted font-semibold tracking-widest uppercase">
                  Two-Day Cultural &amp; Sports Event
                </span>
              </div>
            </Link>

            <p className="text-sm text-text-secondary leading-relaxed max-w-md">
              Hosted by <strong className="text-text-primary">R.V.R. &amp; J.C. College of Engineering (Autonomous)</strong> . Open to eligible students from RVR &amp; J.C. College and participating colleges. A two-day celebration of artistic talents, stage performance, and sports competition.
            </p>

            <div className="p-3.5 rounded-xl bg-surface-light/60 border border-border/50 text-xs text-text-muted space-y-1">
              <div className="flex items-center gap-2 text-text-secondary font-medium">
                <Calendar className="w-3.5 h-3.5 text-accent-light" />
                <span>Two-Day Event — Day 1 &amp; Day 2</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-secondary-light" />
                <span>Chandramoulipuram, Chowdavaram, Guntur, AP - 522019</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              {[
                { icon: InstagramIcon, href: '#', label: 'Instagram' },
                { icon: TwitterIcon, href: '#', label: 'Twitter' },
                { icon: YoutubeIcon, href: '#', label: 'YouTube' },
                { icon: FacebookIcon, href: '#', label: 'Facebook' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-xl glass border border-border flex items-center justify-center text-text-muted hover:text-white hover:border-primary/50 hover:bg-primary/20 transition-all duration-200"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Cultural Events Column */}
          <div>
            <h3 className="text-xs font-bold text-accent-light uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <span>Cultural Arena</span>
            </h3>
            <ul className="space-y-2 text-xs">
              {culturalLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="text-text-secondary hover:text-white transition-colors block py-0.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sports Events Column */}
          <div>
            <h3 className="text-xs font-bold text-sports-light uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <span>Sports Arena</span>
            </h3>
            <ul className="space-y-2 text-xs">
              {sportsLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="text-text-secondary hover:text-white transition-colors block py-0.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-xs font-bold text-primary-light uppercase tracking-widest mb-4">
              Explore &amp; Info
            </h3>
            <ul className="space-y-2 text-xs">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-white transition-colors block py-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright + Disclaimer + Admin Link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <div>
            &copy; 2026 <strong className="text-text-secondary">RVR COLORIDO 2K26</strong>. All rights reserved. RVR &amp; JC College of Engineering.
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[11px] text-text-muted/80">
              Where Talent Meets Competition
            </span>
            <Link
              href="/login"
              className="text-text-muted hover:text-primary-light transition-colors flex items-center gap-1 font-medium"
            >
              <span>Portal Login</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
