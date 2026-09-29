import type { Metadata } from 'next';
import PageHeader from '@/components/page-header';
import { getEvents } from '@/actions/events';
import { EmptyState } from '@/components/ui/loading-states';
import { Trophy } from 'lucide-react';
import SportsFilters from './sports-filters';

export const metadata: Metadata = {
  title: 'Sports Events',
  description:
    'Explore sports events at COLORIDO 2K26 — Basketball, Volleyball, Table Tennis, Throwball, and TenniKoit competitions.',
};

export default async function SportsEventsPage() {
  const events = await getEvents('sports');

  return (
    <>
      <PageHeader
        title="Sports Tournaments"
        subtitle="Sports Arena"
        description="Compete in national-level collegiate championships across Basketball, Volleyball, Throwball, TenniKoit, Table Tennis."
        gradient="sports"
        breadcrumbs={[{ label: 'Events', href: '/events/sports' }, { label: 'Sports' }]}
      />

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {events.length > 0 ? (
            <SportsFilters events={events} />
          ) : (
            <EmptyState
              icon={Trophy}
              title="No Sports Events Available"
              description="Sports events will be added soon. Check back later for updates!"
            />
          )}
        </div>
      </section>
    </>
  );
}
