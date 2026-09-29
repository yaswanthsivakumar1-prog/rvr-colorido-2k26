import Link from 'next/link';
import { Sparkles, ChevronRight, Home } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  gradient?: 'primary' | 'secondary' | 'accent' | 'cultural' | 'sports';
  breadcrumbs?: { label: string; href?: string }[];
}

export default function PageHeader({
  title,
  subtitle,
  description,
  gradient = 'primary',
  breadcrumbs,
}: PageHeaderProps) {
  const gradientMesh = {
    primary:
      'radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.28) 0%, transparent 70%)',
    secondary:
      'radial-gradient(circle at 50% 0%, rgba(244, 63, 94, 0.25) 0%, transparent 70%)',
    accent:
      'radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.22) 0%, transparent 70%)',
    cultural:
      'radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.25) 0%, rgba(124, 58, 237, 0.15) 50%, transparent 75%)',
    sports:
      'radial-gradient(circle at 50% 0%, rgba(6, 182, 212, 0.25) 0%, rgba(16, 185, 129, 0.15) 50%, transparent 75%)',
  };

  return (
    <section className="relative pt-28 pb-12 lg:pt-36 lg:pb-16 overflow-hidden border-b border-border/40">
      {/* Ambient background glows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: gradientMesh[gradient] }}
      />
      <div className="absolute inset-0 bg-festival-pattern opacity-25 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Optional Breadcrumb navigation */}
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-xs text-text-muted mb-4">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Home className="w-3 h-3" />
              <span>Home</span>
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx} className="flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3 text-text-muted/60" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-white transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-text-primary font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : subtitle ? (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 text-[11px] font-bold tracking-widest uppercase rounded-full glass border border-primary/30 text-accent-light mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-accent-light" />
            <span>{subtitle}</span>
          </div>
        ) : null}

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-[family-name:var(--font-display)] tracking-tight text-text-primary mb-3">
          {gradient === 'cultural' ? (
            <span className="gradient-text-cultural">{title}</span>
          ) : gradient === 'sports' ? (
            <span className="gradient-text-sports">{title}</span>
          ) : (
            <span className="gradient-text">{title}</span>
          )}
        </h1>

        {description && (
          <p className="text-sm sm:text-base text-text-secondary max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
