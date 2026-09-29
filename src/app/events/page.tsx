import type { Metadata } from 'next';
import Link from 'next/link';
import PageHeader from '@/components/page-header';
import { getEvents } from '@/actions/events';
import EventsListWithFilter from './events-filter-client';

export const metadata: Metadata = {
  title: 'All Events | RVR COLORIDO 2K26',
  description:
    'Browse all cultural and sports events at RVR COLORIDO 2K26. Two-day festival for eligible students of RVR & JC College of Engineering and participating colleges.',
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <PageHeader
        title="Festival Events"
        subtitle="Cultural &amp; Sports"
        description="Explore the complete list of cultural categories and sports tournaments for eligible students of RVR &amp; JC College and participating colleges."
        gradient="primary"
        breadcrumbs={[{ label: 'Events' }]}
      />

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EventsListWithFilter events={events} />
        </div>
      </section>
    </>
  );
}
