import type { Metadata } from 'next';
import PageHeader from '@/components/page-header';
import { getEvents } from '@/actions/events';
import { getColleges } from '@/actions/colleges';
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
          {/* Registration Form Component */}
          <RegistrationForm events={events} colleges={colleges} />
        </div>
      </section>
    </>
  );
}
