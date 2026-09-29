import type { Metadata } from 'next';
import PageHeader from '@/components/page-header';
import { getPublishedResults } from '@/actions/results';
import ResultsBoard from './results-board';

export const metadata: Metadata = {
  title: 'Official Winners & Results | RVR COLORIDO 2K26',
  description:
    'Podium winners, scores, and standings for Cultural and Sports events at RVR COLORIDO 2K26.',
};

export default async function ResultsPage() {
  const results = await getPublishedResults();

  return (
    <>
      <PageHeader
        title="Winners &amp; Results Board"
        subtitle="Festival Champions"
        description="Celebrating the outstanding talent, team spirit, and collegiate victories across COLORIDO 2K26 arenas."
        gradient="secondary"
        breadcrumbs={[{ label: 'Results' }]}
      />

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ResultsBoard results={results} />
        </div>
      </section>
    </>
  );
}
