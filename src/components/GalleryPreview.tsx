import { useState, useEffect, useRef } from 'react';
import type { GalleryItem } from '../utils/types';
import ProtectedImage from './ProtectedImage';

type Props = { items: GalleryItem[] };

// Extract date from filename (gallery-YYYY-MM-DD.jpg) and sort by date descending
function sortByDateDesc(items: GalleryItem[]): GalleryItem[] {
  return [...items].sort((a, b) => {
    // Extract date from filename: /gallery/gallery-YYYY-MM-DD.jpg
    const dateA = a.src.match(/gallery-(\d{4}-\d{2}-\d{2})/)?.[1] || '';
    const dateB = b.src.match(/gallery-(\d{4}-\d{2}-\d{2})/)?.[1] || '';
    // Compare dates (YYYY-MM-DD format sorts lexicographically)
    return dateB.localeCompare(dateA); // Descending order (newest first)
  });
}

export default function GalleryPreview({ items }: Props) {
  const sortedItems = sortByDateDesc(items);
  const [openImage, setOpenImage] = useState<GalleryItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  function openModal(item: GalleryItem) {
    setOpenImage(item);
  }

  function closeModal() {
    setModalVisible(false);
    setTimeout(() => {
      setOpenImage(null);
      document.body.style.overflow = '';
    }, 200);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeModal();
    }
    function onClickOutside(e: MouseEvent) {
      if (openImage) {
        const target = e.target as HTMLElement;
        const modalContent = target.closest('.gallery-modal-content');
        if (!modalContent) {
          closeModal();
        }
      }
    }
    if (openImage) {
      document.addEventListener('keydown', onKey);
      document.addEventListener('mousedown', onClickOutside);
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => setModalVisible(true));
      setTimeout(() => closeButtonRef.current?.focus(), 0);
      return () => {
        document.removeEventListener('keydown', onKey);
        document.removeEventListener('mousedown', onClickOutside);
        document.body.style.overflow = prev;
      };
    }
  }, [openImage]);

  return (
    <>
      <section id="gallery" className="w-full bg-accent-sand/5 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-16">
          <div className="mb-6">
          <h2 className="text-3xl font-semibold text-accent-teal dark:text-white">Gallery</h2>
          <p className="mx-auto mt-2 mb-4 max-w-2xl px-4 text-center text-sm italic text-gray-700 dark:text-gray-300 sm:text-base">
            A glimpse into the daily scenes and patterns that fuel my sense of style and aesthetic inspiration.
          </p>
          <a 
            href="/gallery" 
            className="mt-2 inline-block text-sm underline text-gray-800 dark:text-gray-100 hover:text-accent-teal"
          >
            View all
          </a>
        </div>
        <div className="mx-auto max-w-6xl grid gap-4 justify-center justify-items-center grid-cols-[repeat(auto-fit,minmax(110px,1fr))]">
          {sortedItems.slice(0, 8).map((item, idx) => (
            <button
              key={idx}
              onClick={() => openModal(item)}
              className="aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 group"
            >
              <ProtectedImage
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading={idx < 4 ? "eager" : "lazy"}
                watermark={false}
                overlayProtection={false}
                disableRightClick={false}
                disableDrag={false}
              />
            </button>
          ))}
        </div>
        </div>
      </section>

      {/* Full-size image modal */}
      {openImage && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 gallery-modal-backdrop ${
            modalVisible ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-200`}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
          onClick={closeModal}
        >
          <div className="relative w-full h-full flex flex-col items-center justify-center gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            <ProtectedImage
              src={openImage.src}
              alt={openImage.alt}
              className={`max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl transition-all duration-300 ${
                modalVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
              }`}
              loading="eager"
              watermark={true}
              overlayProtection={true}
            />
            <div className={`mt-4 px-6 py-3 bg-black/80 backdrop-blur-sm rounded-lg text-white text-sm transition-all duration-300 ${
              modalVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}>
              <p className="font-medium text-white">{openImage.alt}</p>
              {openImage.location && openImage.location.trim() && (
                <p className="mt-1 text-xs text-white font-medium">📍 {openImage.location}</p>
              )}
            </div>
            <button
              ref={closeButtonRef}
              onClick={closeModal}
              className="absolute top-4 right-4 px-4 py-2 rounded-lg bg-white/10 dark:bg-white/20 backdrop-blur-sm text-white hover:bg-white/20 dark:hover:bg-white/30 transition-colors shadow-lg"
              aria-label="Close"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

