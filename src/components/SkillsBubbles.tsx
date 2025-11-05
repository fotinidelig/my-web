import { useState } from 'react';
import type { Skill } from '../utils/types';

type Props = { skills: Skill[] };

function getCategoryClasses(category?: Skill['category']): string {
  switch (category) {
    case 'programming':
      return 'bg-accent-teal/40 text-accent-teal dark:bg-accent-teal/35 dark:text-accent-teal';
    case 'framework':
      return 'bg-accent-rose/35 text-accent-rose dark:bg-accent-rose/30 dark:text-accent-rose';
    case 'tool':
      return 'bg-accent-sand/40 text-accent-sand dark:bg-accent-sand/35 dark:text-accent-sand';
    case 'ai':
      return 'bg-indigo-400/40 text-indigo-700 dark:bg-indigo-400/35 dark:text-indigo-300';
    default:
      return 'bg-white/80 dark:bg-gray-800/70 text-gray-800 dark:text-gray-100';
  }
}

// Jitter utility: small, deterministic offsets to break straight rows
function getJitter(idx: number): { dx: number; dy: number } {
  const a = Math.sin(idx * 12.9898) * 43758.5453;
  const b = Math.cos(idx * 78.233) * 9631.517;
  const randA = a - Math.floor(a);
  const randB = b - Math.floor(b);
  const dx = (randA - 0.5) * 20; // -10px to 10px
  const dy = (randB - 0.5) * 32; // -16px to 16px
  return { dx, dy };
}

export default function SkillsBubbles({ skills }: Props) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="-mt-2 mx-auto max-w-5xl flex flex-wrap justify-center gap-5 md:gap-6">
      {skills.map((s, idx) => {
        const minSize = 65; // px
        const maxSize = 150; // px
        const clamped = Math.max(0, Math.min(100, s.level));
        const baseSize = Math.round(minSize + (maxSize - minSize) * (clamped / 100));
        const hoverSize = baseSize * 1.15; // 15% larger on hover
        const isHovered = hoveredIdx === idx;
        const size = isHovered ? hoverSize : baseSize;
        // Deterministic per-bubble pace
        const seed = Math.abs(Math.sin((idx + 1) * 0.61803398875));
        const animDurationSec = 4 + seed * 5; // 4s .. 9s
        const animDelaySec = (seed * 2); // 0 .. 2s
        const jitter = getJitter(idx);
        // Reserve space for max hover size + jitter range (max jitter is ~20px left/right, ~32px top/bottom)
        const wrapperSize = hoverSize + 50; // enough for hover + jitter buffer

        return (
          <span
            key={s.name}
            className="relative inline-block overflow-visible"
            style={{ width: wrapperSize, height: wrapperSize }}
          >
            <span
              className={`absolute inline-flex items-center justify-center rounded-full shadow-xl backdrop-blur-sm animate-float-soft transition-all duration-500 ease-out z-10 hover:z-20 ${getCategoryClasses(s.category)}`}
              style={{
                width: baseSize,
                height: baseSize,
                left: `calc(50% + ${jitter.dx}px)`,
                top: `calc(50% + ${jitter.dy}px)`,
                '--scale': isHovered ? 1.15 : 1,
                '--jtx': `${jitter.dx}px`,
                '--jty': `${jitter.dy}px`,
                transformOrigin: 'center center',
                animationDelay: `${animDelaySec}s`,
                animationDuration: `${animDurationSec}s`,
              } as React.CSSProperties}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              aria-label={`${s.name}${s.category ? ` • ${s.category}` : ''}`}
            >
              <div className="text-center px-2">
                <span className="block text-sm md:text-base font-medium select-none leading-tight">
                  {s.name}
                </span>
                {isHovered && (
                  <span className="block text-xs mt-1 opacity-90">
                    {s.category ? s.category : ''}{s.category && s.years ? ' • ' : ''}{s.years ? `${s.years} ${s.years === 1 ? 'year' : 'years'}` : ''}
                  </span>
                )}
              </div>
            </span>
          </span>
        );
      })}
    </div>
  );
}




