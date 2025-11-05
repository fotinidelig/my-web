import { useEffect, useRef, useState } from 'react';
import type { Project } from '../utils/types';

type Props = { projects: Project[] };

export default function ProjectsGrid({ projects }: Props) {
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  function openModal(p: Project) {
    setOpenProject(p);
  }

  function closeModal() {
    setModalVisible(false);
    // wait for exit transition
    setTimeout(() => {
      setOpenProject(null);
      document.body.style.overflow = '';
    }, 220);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeModal();
    }
    if (openProject) {
      document.addEventListener('keydown', onKey);
      // prevent background scroll
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      // enter transition and focus
      requestAnimationFrame(() => setModalVisible(true));
      setTimeout(() => closeButtonRef.current?.focus(), 0);
      return () => {
        document.removeEventListener('keydown', onKey);
        document.body.style.overflow = prev;
      };
    }
  }, [openProject]);

  return (
    <div className="mx-auto max-w-7xl flex flex-wrap justify-center gap-4 md:gap-5 lg:gap-6">
      {projects.map((p) => {
        return (
          <article
            key={p.id}
            className="w-[260px] flex flex-col rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900/60"
          >
            <button
              className="w-full text-left flex flex-col"
              aria-haspopup="dialog"
              onClick={() => openModal(p)}
            >
              <div className="w-full h-40 md:h-44 overflow-hidden">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{p.title}</h3>
                <p className="text-sm opacity-80 text-gray-700 dark:text-gray-200 mt-1">{p.tagline}</p>
              </div>
            </button>
          </article>
        );
      })}

      {openProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={openProject.title}
          onClick={closeModal}
        >
          <div
            className={`absolute inset-0 backdrop-blur-sm transition-opacity duration-200 ${modalVisible ? 'opacity-100 bg-black/40' : 'opacity-0 bg-black/20'}`}
          />

          <div
            className={`relative z-10 w-full max-w-xl rounded-2xl shadow-xl ring-1 ring-black/10 dark:ring-white/10 bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100 transition-all duration-250 ease-out ${modalVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute right-3 top-3">
              <button
                ref={closeButtonRef}
                onClick={closeModal}
                className="px-2.5 py-1.5 rounded-md text-sm border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/15"
                aria-label="Close"
              >
                Close
              </button>
            </div>

            <img
              src={openProject.image}
              alt={openProject.title}
              className="w-full h-56 object-cover rounded-t-2xl"
            />

            <div className="p-5">
              <h3 className="text-xl font-semibold">{openProject.title}</h3>
              <p className="mt-1 text-sm opacity-80">{openProject.tagline}</p>
              <p className="mt-4 text-base">{openProject.description}</p>
              <div className="mt-5 text-sm">
                {openProject.links?.demo && (
                  <a className="underline mr-4" href={openProject.links.demo} target="_blank" rel="noreferrer">Demo</a>
                )}
                {openProject.links?.repo && (
                  <a className="underline" href={openProject.links.repo} target="_blank" rel="noreferrer">Code</a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




