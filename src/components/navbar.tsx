'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Sparkles,
  ArrowRight,
  Palette,
  Trophy,
  Calendar,
  Megaphone,
  Award,
  Image,
  Heart,
  Phone,
  Info,
  ChevronDown,
  User,
} from 'lucide-react';

const mainNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/announcements', label: 'Announcements' },
  { href: '/results', label: 'Results' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

const secondaryLinks = [
  { href: '/events/cultural', label: 'Cultural Events', icon: Palette },
  { href: '/events/sports', label: 'Sports Events', icon: Trophy },
  { href: '/sponsors', label: 'Sponsors & Partners', icon: Heart },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setMoreDropdownOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'py-2.5 glass-strong shadow-2xl shadow-black/60 border-b border-border'
          : 'py-4 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-primary via-secondary to-accent flex items-center justify-center p-0.5 shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-[10px] bg-[#0A0A16] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent-light group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black font-[family-name:var(--font-display)] tracking-wider gradient-text">
                  COLORIDO
                </span>
                <span className="text-xs font-bold text-accent-light px-1.5 py-0.5 rounded-full bg-accent/15 border border-accent/30 tracking-widest">
                  2K26
                </span>
              </div>
              <span className="text-[10px] text-text-muted font-medium tracking-wide uppercase">
                RVR &amp; JC College of Engg.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {mainNavLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide uppercase transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-primary/25 border border-primary/40 shadow-sm shadow-primary/20'
                      : 'text-text-secondary hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* More dropdown (Sponsors, Contact) */}
            <div className="relative">
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                onBlur={() => setTimeout(() => setMoreDropdownOpen(false), 200)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide uppercase transition-all duration-200 ${
                  pathname === '/sponsors' || pathname === '/contact'
                    ? 'text-white bg-primary/25 border border-primary/40'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {moreDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl glass-strong border border-border shadow-2xl py-2 z-50 animate-fade-in-up">
                  {secondaryLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-text-secondary hover:text-white hover:bg-primary/20 transition-colors"
                    >
                      <item.icon className="w-3.5 h-3.5 text-accent-light" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Compact desktop links for large screens (lg to xl) */}
          <nav className="hidden lg:flex xl:hidden items-center gap-1">
            <Link
              href="/events/cultural"
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium uppercase ${
                pathname.startsWith('/events/cultural')
                  ? 'text-white bg-primary/25'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              Cultural
            </Link>
            <Link
              href="/events/sports"
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium uppercase ${
                pathname.startsWith('/events/sports')
                  ? 'text-white bg-primary/25'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              Sports
            </Link>
            <Link
              href="/schedule"
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium uppercase ${
                pathname === '/schedule'
                  ? 'text-white bg-primary/25'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              Schedule
            </Link>
            <Link
              href="/results"
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium uppercase ${
                pathname === '/results'
                  ? 'text-white bg-primary/25'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              Results
            </Link>
            <Link
              href="/gallery"
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium uppercase ${
                pathname === '/gallery'
                  ? 'text-white bg-primary/25'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              Gallery
            </Link>
          </nav>

          {/* Action CTAs & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold glass border border-border text-text-secondary hover:text-white hover:border-primary/40 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-primary-light" />
              <span>Portal</span>
            </Link>

            <Link
              href="/registration"
              className="relative inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm tracking-wide text-white uppercase overflow-hidden shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
            >
              {/* Animated glowing gradient background */}
              <span className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-90 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-1.5 font-bold">
                <Sparkles className="w-4 h-4 text-accent-light" />
                <span>Register Now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2.5 rounded-xl glass border border-border text-text-secondary hover:text-white hover:border-primary/40 transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Sleek dropdown card, doesn't unnecessarily block entire screen) */}
      {isOpen && (
        <div className="lg:hidden px-4 pt-3 pb-6 max-w-7xl mx-auto">
          <div className="glass-strong rounded-2xl border border-border/80 p-5 shadow-2xl space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <span className="text-xs font-bold text-accent-light tracking-wider uppercase">
                Festival Navigation
              </span>
              <span className="text-[11px] text-text-muted">COLORIDO 2K26</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/events/cultural"
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-medium text-text-primary hover:bg-primary/20 transition-all"
              >
                <Palette className="w-4 h-4 text-primary-light" />
                <span>Cultural Fest</span>
              </Link>
              <Link
                href="/events/sports"
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-sports/10 border border-sports/20 text-xs font-medium text-text-primary hover:bg-sports/20 transition-all"
              >
                <Trophy className="w-4 h-4 text-sports-light" />
                <span>Sports Arena</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-xs text-text-secondary">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Fest' },
                { href: '/schedule', label: 'Schedule' },
                { href: '/results', label: 'Results' },
                { href: '/announcements', label: 'Announcements' },
                { href: '/gallery', label: 'Photo Gallery' },
                { href: '/sponsors', label: 'Our Sponsors' },
                { href: '/contact', label: 'Helpdesk & Contact' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    pathname === link.href
                      ? 'text-white bg-white/10 font-semibold'
                      : 'hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-text-muted">
              <span>Festival Portal</span>
              <Link
                href="/login"
                className="text-primary-light hover:underline font-medium"
              >
                Student &amp; Admin Login →
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
