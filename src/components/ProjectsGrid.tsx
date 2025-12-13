import { useEffect, useRef, useState } from 'react';
import type { Project } from '../utils/types';

type Props = { projects: Project[] };

export default function ProjectsGrid({ projects }: Props) {
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const getRepoDisplay = (project: Project) => {
    const repoUrl = project.links?.repo;
    if (!repoUrl || repoUrl === '#') return null;
    try {
      const { pathname } = new URL(repoUrl);
      const parts = pathname.split('/').filter(Boolean);
      return parts.slice(-2).join('/');
    } catch {
      return repoUrl;
    }
  };

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
            className="w-[240px] flex flex-col overflow-hidden rounded-2xl border border-gray-200/70 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl backdrop-blur-[2px] sm:w-[260px]"
          >
            <button
              type="button"
              className="group relative flex-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 overflow-hidden"
              aria-haspopup="dialog"
              onClick={() => openModal(p)}
            >
              {p.previewImage ? (
                <>
                  <img
                    src={p.previewImage}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 bg-black/20 dark:bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-secondary transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/10 dark:bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </>
              )}
              <div className="relative flex h-full flex-col items-center justify-center px-5 py-8 text-center">
                <div className="rounded-2xl border border-white/30 bg-white/45 px-4 py-3.5 shadow-lg backdrop-blur-[6px] transition-all duration-500 group-hover:bg-white/60 dark:border-white/15 dark:bg-white/10 dark:group-hover:bg-white/15">
                  <h3 className={`font-semibold text-title tracking-tight ${
                    p.previewImage 
                      ? 'text-gray-900 dark:text-gray-900' 
                      : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {p.title}
                  </h3>
                  <p className={`mt-1.5 text-small ${
                    p.previewImage 
                      ? 'text-gray-700/85 dark:text-gray-800' 
                      : 'text-gray-700/85 dark:text-gray-200/90'
                  }`}>
                    {p.tagline}
                  </p>
                </div>
              </div>
            </button>

            {p.links?.repo ? (
              <a
                href={p.links.repo}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3 border-t border-gray-200/70 dark:border-gray-800/60 text-secondary hover:text-secondary/90 dark:text-secondary/90 dark:hover:text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 transition-colors"
                aria-label={`Open ${p.title} on GitHub`}
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 .5C5.648.5.5 5.648.5 12.004c0 5.094 3.292 9.41 7.864 10.94.575.106.787-.25.787-.558 0-.276-.01-1.17-.016-2.123-3.2.696-3.876-1.373-3.876-1.373-.523-1.327-1.278-1.68-1.278-1.68-1.044-.714.079-.7.079-.7 1.154.081 1.761 1.185 1.761 1.185 1.027 1.76 2.695 1.252 3.35.958.104-.744.402-1.252.73-1.54-2.553-.29-5.236-1.278-5.236-5.69 0-1.257.449-2.287 1.184-3.093-.119-.29-.513-1.457.113-3.04 0 0 .967-.31 3.17 1.182a11.06 11.06 0 0 1 2.886-.388c.979.004 1.967.132 2.888.388 2.2-1.492 3.165-1.182 3.165-1.182.629 1.583.235 2.75.116 3.04.738.806 1.183 1.836 1.183 3.093 0 4.425-2.688 5.395-5.252 5.68.413.357.78 1.057.78 2.132 0 1.54-.014 2.78-.014 3.16 0 .311.207.67.793.556C20.213 21.41 23.5 17.096 23.5 12.004 23.5 5.648 18.352.5 12 .5Z" />
                </svg>
                <span className="text-small font-medium">View on GitHub</span>
              </a>
            ) : (
              <div className="px-6 py-4 border-t border-gray-200/70 dark:border-gray-800/60 text-small text-gray-500 dark:text-gray-400 text-center">
                Repository coming soon
              </div>
            )}
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
                className="px-2.5 py-1.5 rounded-md text-sm border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/15 shadow-md hover:shadow-lg transition-shadow duration-300"
                aria-label="Close"
              >
                Close
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-3 text-center">
                <h3 className="text-2xl font-semibold text-title text-gray-900 dark:text-gray-100">
                  {openProject.title}
                </h3>
                {getRepoDisplay(openProject) && (
                  <p className="flex items-center justify-center gap-2 text-small font-medium text-secondary">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 .5C5.648.5.5 5.648.5 12.004c0 5.094 3.292 9.41 7.864 10.94.575.106.787-.25.787-.558 0-.276-.01-1.17-.016-2.123-3.2.696-3.876-1.373-3.876-1.373-.523-1.327-1.278-1.68-1.278-1.68-1.044-.714.079-.7.079-.7 1.154.081 1.761 1.185 1.761 1.185 1.027 1.76 2.695 1.252 3.35.958.104-.744.402-1.252.73-1.54-2.553-.29-5.236-1.278-5.236-5.69 0-1.257.449-2.287 1.184-3.093-.119-.29-.513-1.457.113-3.04 0 0 .967-.31 3.17 1.182a11.06 11.06 0 0 1 2.886-.388c.979.004 1.967.132 2.888.388 2.2-1.492 3.165-1.182 3.165-1.182.629 1.583.235 2.75.116 3.04.738.806 1.183 1.836 1.183 3.093 0 4.425-2.688 5.395-5.252 5.68.413.357.78 1.057.78 2.132 0 1.54-.014 2.78-.014 3.16 0 .311.207.67.793.556C20.213 21.41 23.5 17.096 23.5 12.004 23.5 5.648 18.352.5 12 .5Z" />
                    </svg>
                    {getRepoDisplay(openProject)}
                  </p>
                )}
              </div>

              <div className="space-y-3 text-body text-gray-700 dark:text-gray-200">
                {openProject.tagline && (
                  <p className="font-medium">{openProject.tagline}</p>
                )}
                <p>{openProject.description}</p>
              </div>

              {openProject.stack?.length ? (
                <div className="space-y-3 text-center">
                  <span className="text-small uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 block">
                    Implementation Stack
                  </span>
                  <div className="flex flex-wrap justify-center gap-2 text-small text-gray-700 dark:text-gray-200">
                    {openProject.stack.map((tech) => (
                      <span key={tech} className="px-2">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="flex flex-wrap items-center justify-center gap-3">
                {openProject.links?.repo && openProject.links.repo !== '#' && (
                  <a
                    className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-2 text-small font-medium text-secondary transition-colors hover:border-secondary/60 hover:bg-secondary/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-secondary/20 dark:bg-secondary/15 dark:text-secondary/90 dark:hover:border-secondary/40 dark:hover:bg-secondary/20 dark:focus-visible:ring-offset-gray-900"
                    href={openProject.links.repo}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${openProject.title} repository on GitHub`}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 .5C5.648.5.5 5.648.5 12.004c0 5.094 3.292 9.41 7.864 10.94.575.106.787-.25.787-.558 0-.276-.01-1.17-.016-2.123-3.2.696-3.876-1.373-3.876-1.373-.523-1.327-1.278-1.68-1.278-1.68-1.044-.714.079-.7.079-.7 1.154.081 1.761 1.185 1.761 1.185 1.027 1.76 2.695 1.252 3.35.958.104-.744.402-1.252.73-1.54-2.553-.29-5.236-1.278-5.236-5.69 0-1.257.449-2.287 1.184-3.093-.119-.29-.513-1.457.113-3.04 0 0 .967-.31 3.17 1.182a11.06 11.06 0 0 1 2.886-.388c.979.004 1.967.132 2.888.388 2.2-1.492 3.165-1.182 3.165-1.182.629 1.583.235 2.75.116 3.04.738.806 1.183 1.836 1.183 3.093 0 4.425-2.688 5.395-5.252 5.68.413.357.78 1.057.78 2.132 0 1.54-.014 2.78-.014 3.16 0 .311.207.67.793.556C20.213 21.41 23.5 17.096 23.5 12.004 23.5 5.648 18.352.5 12 .5Z" />
                    </svg>
                    View Repository
                  </a>
                )}

                {openProject.links?.demo && openProject.links.demo !== '#' && (
                  <a
                    className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-small font-medium text-primary transition-colors hover:border-primary/60 hover:bg-primary/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-primary/20 dark:bg-primary/15 dark:text-primary/90 dark:hover:border-primary/40 dark:hover:bg-primary/20 dark:focus-visible:ring-offset-gray-900"
                    href={openProject.links.demo}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${openProject.title} live demo`}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M9.5 7.5a1 1 0 0 1 1.53-.848l6 3.5a1 1 0 0 1 0 1.696l-6 3.5A1 1 0 0 1 9.5 15.5v-7Z" />
                    </svg>
                    View Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




