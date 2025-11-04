import { useState } from 'react';
import type { Project } from '../utils/types';

type Props = { projects: Project[] };

export default function ProjectsGrid({ projects }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((p) => {
        const open = openId === p.id;
        return (
          <article key={p.id} className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <button
              className="w-full text-left"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : p.id)}
            >
              <img src={p.image} alt={p.title} className="w-full aspect-video object-cover" loading="lazy" />
              <div className="p-4">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm opacity-80">{p.tagline}</p>
              </div>
            </button>
            {open && (
              <div className="p-4 pt-0 text-sm">
                <p className="mb-3 opacity-90">{p.description}</p>
                {p.links?.demo && (
                  <a className="underline mr-3" href={p.links.demo} target="_blank" rel="noreferrer">Demo</a>
                )}
                {p.links?.repo && (
                  <a className="underline" href={p.links.repo} target="_blank" rel="noreferrer">Code</a>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}


