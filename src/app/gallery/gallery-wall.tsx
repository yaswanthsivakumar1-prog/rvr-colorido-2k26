'use client';

import { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  Camera,
} from 'lucide-react';
import type { GalleryImage } from '@/types';

interface GalleryWallProps {
  images: GalleryImage[];
}

export default function GalleryWall({ images }: GalleryWallProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Extract categories
  const categories = Array.from(
    new Set(images.map((img) => img.category).filter(Boolean) as string[])
  );

  const filteredImages = images.filter((img) => {
    return selectedCategory === 'all' || img.category === selectedCategory;
  });

  // Handle keyboard navigation for Lightbox
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % filteredImages.length : null
        );
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + filteredImages.length) % filteredImages.length : null
        );
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredImages.length]);

  return (
    <div className="space-y-8">
      {/* Category Filter Pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25'
                : 'glass text-text-secondary hover:text-white'
            }`}
          >
            All Moments ({images.length})
          </button>

          {categories.map((cat) => {
            const count = images.filter((img) => img.category === cat).length;
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                  isActive
                    ? 'bg-primary text-white border border-primary-light/40 shadow-md'
                    : 'glass text-text-secondary hover:text-white'
                }`}
              >
                {cat} <span className="opacity-60 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Masonry / Dynamic Multi-column Grid */}
      {filteredImages.length === 0 ? (
        <div className="glass-strong rounded-3xl p-12 text-center max-w-md mx-auto border border-border/80 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 text-primary-light flex items-center justify-center mx-auto">
            <Camera className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white font-[family-name:var(--font-display)]">
            No Images In This Category
          </h3>
          <p className="text-xs text-text-secondary">
            Photos from this segment will be uploaded directly after stage performances conclude.
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              onClick={() => setLightboxIndex(index)}
              className="break-inside-avoid relative rounded-3xl overflow-hidden glass-card-hover border border-border/80 group cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.image_url}
                alt={image.title}
                loading="lazy"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Overlay with details */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
                <div className="flex justify-end">
                  <span className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>

                <div>
                  {image.category && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/80 text-white backdrop-blur-md mb-2">
                      {image.category}
                    </span>
                  )}
                  <h3 className="text-base font-bold text-white font-[family-name:var(--font-display)] leading-snug">
                    {image.title}
                  </h3>
                  {image.description && (
                    <p className="text-xs text-white/80 line-clamp-2 mt-1">
                      {image.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredImages[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-fade-in-up">
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50 focus:outline-none"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(
                (lightboxIndex - 1 + filteredImages.length) % filteredImages.length
              );
            }}
            className="absolute left-4 sm:left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50 focus:outline-none"
            aria-label="Previous Photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
            }}
            className="absolute right-4 sm:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50 focus:outline-none"
            aria-label="Next Photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Active Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center space-y-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={filteredImages[lightboxIndex].image_url}
              alt={filteredImages[lightboxIndex].title}
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />

            <div className="text-center text-white space-y-1">
              <h4 className="text-lg font-bold font-[family-name:var(--font-display)]">
                {filteredImages[lightboxIndex].title}
              </h4>
              {filteredImages[lightboxIndex].description && (
                <p className="text-xs text-text-secondary max-w-xl mx-auto">
                  {filteredImages[lightboxIndex].description}
                </p>
              )}
              <span className="text-[11px] text-text-muted">
                {lightboxIndex + 1} of {filteredImages.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
