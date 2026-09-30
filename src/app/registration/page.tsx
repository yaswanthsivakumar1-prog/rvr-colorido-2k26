import type { Metadata } from 'next';
import PageHeader from '@/components/page-header';
import { getEvents } from '@/actions/events';
import { getColleges } from '@/actions/colleges';
import { ShieldCheck } from 'lucide-react';
import RegistrationForm from './registration-form';

export const metadata: Metadata = {
  title: 'Student Registration | RVR COLORIDO 2K26',
  description:
    'Online event registration for eligible students of RVR & JC College of Engineering and participating colleges for COLORIDO 2K26 Two-Day Cultural & Sports Event.',
};

export default async function RegistrationPage() {
  const [events, colleges] = await Promise.all([
    getEvents(),
    getColleges(true),
  ]);

  return (
    <>
      <PageHeader
        title="Student Registration"
        subtitle="RVR COLORIDO 2K26"
        description="Registration is open to eligible students from R.V.R. &amp; J.C. College of Engineering (Autonomous) and eligible participating colleges. Register below for your chosen cultural or sports competition."
        gradient="primary"
        breadcrumbs={[{ label: 'Registration' }]}
      />

      <section className="py-12 lg:py-16 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Eligibility Notice */}
          <div className="p-4 sm:p-5 rounded-2xl glass border border-primary/20 flex items-start gap-3 bg-primary/5">
            <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs sm:text-sm">
              <h2 className="font-semibold text-text-primary">
                Eligibility Notice: Open to RVR &amp; JC and Participating Colleges
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Registration is open to students from R.V.R. &amp; J.C. College of Engineering (Autonomous) and verified participating colleges. Valid student ID cards must be presented at the registration desk on the event day.
              </p>
            </div>
          </div>

          {/* Registration Form Component */}
          <RegistrationForm events={events} colleges={colleges} />
        </div>
      </section>
    </>
  );
}
