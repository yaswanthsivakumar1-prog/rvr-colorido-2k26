import Link from 'next/link';
import { Home, Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="relative max-w-lg w-full text-center">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative glass rounded-3xl p-8 sm:p-12 border border-border/60">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary/20 via-secondary/20 to-accent/20 border border-primary/30 mb-6">
            <span className="text-4xl font-extrabold bg-gradient-to-r from-primary-light via-secondary-light to-accent-light bg-clip-text text-transparent">
              404
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-display)] text-text-primary mb-3">
            Page Not Found
          </h1>
          <p className="text-sm sm:text-base text-text-secondary mb-8 leading-relaxed">
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable during COLORIDO 2K26 festivities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium text-sm hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <Link
              href="/events/cultural"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl glass text-text-primary hover:text-primary-light text-sm font-medium border border-border/80 hover:border-primary/40 transition-all"
            >
              <Compass className="w-4 h-4" />
              Browse Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
