import { Metadata } from 'next';
import PageHeader from '@/components/page-header';
import ContactForm from './contact-form';
import {
  MapPin,
  Mail,
  Clock,
  Globe,
  Building,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact | RVR COLORIDO 2K26',
  description:
    'Contact information and queries desk for COLORIDO 2K26 at RVR & JC College of Engineering, Guntur.',
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact &amp; Helpdesk"
        subtitle="Organizing Committee"
        description="Reach out to the COLORIDO 2K26 organizing committee for event and registration inquiries."
        gradient="secondary"
        breadcrumbs={[{ label: 'Contact' }]}
      />

      <section className="py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-text-primary mb-3">
                  Event Helpdesk
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Have questions about event guidelines, venue locations, or online registration? Contact the student committee below.
                </p>
              </div>

              <div className="space-y-4">
                {/* Institution Address */}
                <div className="flex items-start gap-4 p-4 rounded-2xl glass border border-border/70">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 text-primary-light">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Campus Location</h3>
                    <p className="text-sm font-semibold text-text-primary">
                      R.V.R. &amp; J.C. College of Engineering (Autonomous)
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Chandramoulipuram, Chowdavaram, Guntur, Andhra Pradesh — 522019
                    </p>
                  </div>
                </div>

                {/* Organizing Committee Email */}
                <div className="flex items-start gap-4 p-4 rounded-2xl glass border border-border/70">
                  <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center shrink-0 text-secondary-light">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Event Inquiries</h3>
                    <p className="text-sm font-semibold text-text-primary">
                      COLORIDO Organizing Committee
                    </p>
                    <a
                      href="mailto:colorido@rvrjc.ac.in"
                      className="text-xs font-medium text-primary-light hover:underline mt-0.5 block"
                    >
                      colorido@rvrjc.ac.in
                    </a>
                  </div>
                </div>

                {/* College Website */}
                <div className="flex items-start gap-4 p-4 rounded-2xl glass border border-border/70">
                  <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center shrink-0 text-accent-light">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Official Website</h3>
                    <a
                      href="https://rvrjc.ac.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-text-primary hover:text-primary-light hover:underline"
                    >
                      www.rvrjc.ac.in
                    </a>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Official portal of RVR &amp; JC College of Engineering
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Queries Form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
