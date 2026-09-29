import type { Metadata } from 'next';
import PageHeader from '@/components/page-header';
import { getEvents } from '@/actions/events';
import { EmptyState } from '@/components/ui/loading-states';
import { Calendar } from 'lucide-react';
import ScheduleExplorer from './schedule-explorer';

export const metadata: Metadata = {
  title: 'Two-Day Event Schedule | RVR COLORIDO 2K26',
  description:
    'Two-day cultural and sports event schedule for COLORIDO 2K26 at RVR & JC College of Engineering, Guntur.',
};

export default async function SchedulePage() {
  const events = await getEvents();

  return (
    <>
      <PageHeader
        title="Two-Day Event Schedule"
        subtitle="Day 1 &amp; Day 2 Timeline"
        description="Event timings and campus venues for all cultural and sports competitions at COLORIDO 2K26."
        gradient="primary"
        breadcrumbs={[{ label: 'Schedule' }]}
      />

      <section className="py-12 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {events.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="Schedule Being Finalized"
              description="The event schedule is being prepared by the student organizing committee."
            />
          ) : (
            <ScheduleExplorer events={events} />
          )}
        </div>
      </section>
    </>
  );
}
