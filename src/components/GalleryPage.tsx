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

export default function GalleryPage({ items }: Props) {
  const sortedItems = sortByDateDesc(items);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const openImage = openIndex !== null ? sortedItems[openIndex] : null;

  function openModal(idx: number) {
    setOpenIndex(idx);
  }

  function closeModal() {
    setModalVisible(false);
    setTimeout(() => {
      setOpenIndex(null);
      document.body.style.overflow = '';
    }, 200);
  }

  const showAdjacent = (direction: 1 | -1) => {
    setOpenIndex((current) => {
      if (current === null) return current;
      const nextIndex = (current + direction + sortedItems.length) % sortedItems.length;
      return nextIndex;
    });
  };

  const showNext = () => showAdjacent(1);
  const showPrevious = () => showAdjacent(-1);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeModal();
      if (openImage) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          showNext();
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          showPrevious();
        }
      }
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
      <div className="mx-auto max-w-6xl grid gap-3 justify-center justify-items-center grid-cols-[repeat(auto-fit,minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(160px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
        {sortedItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => openModal(idx)}
            className="group relative aspect-[4/3] w-full max-w-[200px] overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            aria-label={`View ${item.alt}${item.location ? ` from ${item.location}` : ''}`}
          >
            <ProtectedImage
              src={item.src}
              alt={item.alt}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading={idx < 12 ? "eager" : "lazy"}
              watermark={false}
              overlayProtection={true}
            />
          </button>
        ))}
      </div>

      {/* Full-size image modal */}
      {openImage && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 gallery-modal-backdrop ${
            modalVisible ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-200`}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
          onClick={closeModal}
        >
          <div className="relative flex h-full w-full max-w-6xl flex-col items-center justify-center gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 sm:p-4 text-white shadow-lg backdrop-blur-md transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white z-20"
              style={{ touchAction: 'manipulation' }}
              aria-label="Previous image"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.707 15.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L9.414 10l3.293 3.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>

            <ProtectedImage
              src={openImage.src}
              alt={openImage.alt}
              className={`relative z-10 max-h-[80vh] w-auto max-w-full object-contain rounded-lg shadow-2xl transition-all duration-300 ${
                modalVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
              }`}
              loading="eager"
              watermark={true}
              overlayProtection={true}
            />

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 sm:p-4 text-white shadow-lg backdrop-blur-md transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white z-20"
              style={{ touchAction: 'manipulation' }}
              aria-label="Next image"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 4.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L10.586 10 7.293 6.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            <div
              className={`mt-4 px-6 py-3 bg-black/80 backdrop-blur-sm rounded-lg text-white text-sm transition-all duration-300 ${
                modalVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="font-medium text-white">{openImage.alt}</p>
              {openImage.location && openImage.location.trim() && (
                <p className="mt-1 text-xs text-white font-medium">📍 {openImage.location}</p>
              )}
            </div>
            <button
              ref={closeButtonRef}
              onClick={closeModal}
              className="absolute top-3 right-3 rounded-lg bg-white/15 px-3 py-1.5 text-sm text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-white/25 z-30"
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

