import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/page-header';
import { getSponsors } from '@/actions/sponsors';
import { Heart, Mail, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Event Partners & Sponsors | RVR COLORIDO 2K26',
  description:
    'Sponsors and partners for COLORIDO 2K26 at RVR & JC College of Engineering, Guntur.',
};

export default async function SponsorsPage() {
  const sponsors = await getSponsors();

  return (
    <>
      <PageHeader
        title="Event Partners &amp; Sponsors"
        subtitle="Sponsors &amp; Supporters"
        description="Official supporters and partners associated with RVR COLORIDO 2K26."
        gradient="primary"
        breadcrumbs={[{ label: 'Sponsors' }]}
      />

      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {sponsors.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-text-primary font-[family-name:var(--font-display)]">
                Our Supporters
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {sponsors.map((sponsor) => (
                  <div
                    key={sponsor.id}
                    className="glass rounded-2xl p-5 border border-border/80 flex flex-col items-center justify-center text-center space-y-3"
                  >
                    <div className="w-16 h-16 rounded-xl bg-surface-dark flex items-center justify-center p-2 overflow-hidden">
                      {sponsor.logo_url ? (
                        <img src={sponsor.logo_url} alt={sponsor.name} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <Heart className="w-6 h-6 text-primary-light" />
                      )}
                    </div>
                    <span className="text-xs font-semibold text-text-primary">{sponsor.name}</span>
                    {sponsor.website && (
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-primary-light hover:underline inline-flex items-center gap-1"
                      >
                        <span>Visit</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Minimal Placeholder (as instructed in Section 24) */
            <div className="glass rounded-3xl p-10 sm:p-16 border border-border/80 space-y-4 max-w-2xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary-light flex items-center justify-center mx-auto mb-2">
                <Heart className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-primary">
                Event Partners &amp; Sponsors
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Event partners and sponsors will be updated here.
              </p>
              <p className="text-xs text-text-muted leading-relaxed">
                For official inquiries or stalls during COLORIDO 2K26, please contact the organizing committee.
              </p>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-border text-xs font-semibold text-text-primary hover:text-white hover:border-primary/40 transition-colors"
                >
                  <Mail className="w-4 h-4 text-primary-light" />
                  <span>Contact Organizing Committee</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
