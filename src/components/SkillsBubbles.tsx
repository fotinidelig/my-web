import type { Skill } from '../utils/types';

type Props = { skills: Skill[] };

export default function SkillsBubbles({ skills }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      {skills.map((s) => (
        <span
          key={s.name}
          className="px-3 py-1.5 rounded-full text-sm border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-gray-900/60 hover:scale-105 transition-transform"
          style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.04)' }}
          aria-label={`${s.name} proficiency ${s.level}/100`}
        >
          {s.name}
        </span>
      ))}
    </div>
  );
}


