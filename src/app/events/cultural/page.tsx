import type { Metadata } from 'next';
import PageHeader from '@/components/page-header';
import { getEvents } from '@/actions/events';
import EventCard from '@/components/event-card';
import { EmptyState } from '@/components/ui/loading-states';
import { Palette } from 'lucide-react';
import CulturalFilters from './cultural-filters';

export const metadata: Metadata = {
  title: 'Cultural Events',
  description:
    'Explore cultural events at COLORIDO 2K26 — Fine Arts, Music, Dance, Choreoday, Dramatics, Fashion Show, Tekraft, and Literary competitions.',
};

export default async function CulturalEventsPage() {
  const events = await getEvents('cultural');

  // Extract unique subcategories for filters
  const subcategories = Array.from(new Set(events.map((e) => e.subcategory)));

  return (
    <>
      <PageHeader
        title="Cultural Fest Competitions"
        subtitle="Cultural Arena"
        description="Showcase your artistic expression, musical virtuosity, and stage brilliance across eight premier cultural disciplines."
        gradient="cultural"
        breadcrumbs={[{ label: 'Events', href: '/events/cultural' }, { label: 'Cultural' }]}
      />

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {events.length > 0 ? (
            <CulturalFilters events={events} subcategories={subcategories} />
          ) : (
            <EmptyState
              icon={Palette}
              title="No Cultural Events Available"
              description="Cultural events will be added soon. Check back later for updates!"
            />
          )}
        </div>
      </section>
    </>
  );
}
