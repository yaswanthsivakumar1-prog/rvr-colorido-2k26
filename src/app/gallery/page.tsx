import type { Metadata } from 'next';
import PageHeader from '@/components/page-header';
import { EmptyState } from '@/components/ui/loading-states';
import { Image as ImageIcon } from 'lucide-react';
import GalleryWall from './gallery-wall';
import { getGalleryImages } from '@/actions/gallery';

export const metadata: Metadata = {
  title: 'Photo Gallery & Moments | RVR COLORIDO 2K26',
  description:
    'Experience the electric atmosphere, live performances, stage productions, and court action from RVR COLORIDO 2K26.',
};

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <>
      <PageHeader
        title="Festival Moments &amp; Gallery"
        subtitle="Memories in Motion"
        description="Relive the high-octane energy, concerts, dramatic stage productions, and championship court action of COLORIDO."
        gradient="primary"
        breadcrumbs={[{ label: 'Gallery' }]}
      />

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {images.length === 0 ? (
            <EmptyState
              icon={ImageIcon}
              title="Media Coverage In Progress"
              description="Official festival photographers are capturing moments across all stages. Photos will appear here live during the fest!"
            />
          ) : (
            <GalleryWall images={images} />
          )}
        </div>
      </section>
    </>
  );
}
