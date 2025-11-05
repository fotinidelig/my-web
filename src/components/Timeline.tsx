import { useState, useEffect, useRef } from 'react';
import type { TimelineItem } from '../utils/types';

type Props = { items: TimelineItem[] };

export default function Timeline({ items }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const detailRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  function openDetail(id: string) {
    setOpenId(id);
    requestAnimationFrame(() => setModalVisible(true));
  }

  function closeDetail() {
    setModalVisible(false);
    setTimeout(() => setOpenId(null), 200);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeDetail();
    }
    function onClickOutside(e: MouseEvent) {
      if (openId) {
        const target = e.target as HTMLElement;
        const detailEl = detailRefs.current[openId];
        const buttonEl = buttonRefs.current[openId];
        // Close if click is outside both the detail window and the bubble button
        if (detailEl && !detailEl.contains(target) && buttonEl && !buttonEl.contains(target)) {
          closeDetail();
        }
      }
    }
    if (openId) {
      document.addEventListener('keydown', onKey);
      document.addEventListener('mousedown', onClickOutside);
      return () => {
        document.removeEventListener('keydown', onKey);
        document.removeEventListener('mousedown', onClickOutside);
      };
    }
  }, [openId]);


  // Items are already in chronological order (oldest first, newest last)
  // Keep as-is so left to right shows oldest to newest (newest on right)
  const sortedItems = items;

  // Extract year from period for display
  function extractYear(period: string): string {
    // If it's a range like "2022-2025", return it as-is
    if (period.match(/\d{4}-\d{4}/)) {
      return period.match(/\d{4}-\d{4}/)?.[0] || period;
    }
    // Otherwise extract first year
    const match = period.match(/\d{4}/);
    return match ? match[0] : period;
  }

  return (
    <div className="relative py-12 pb-20">
      {/* Intro text */}
      <p className="text-center text-gray-700 dark:text-gray-300 mb-12 max-w-2xl mx-auto px-4">
        Here are some key milestones in my journey, from academic studies to research positions.
      </p>

      {/* Timeline items container */}
      <div 
        className="timeline-container relative flex justify-between max-w-6xl mx-auto px-8"
        style={{ minHeight: '200px' }}
      >
        {/* Arrow and gradient line - positioned at center of container */}
        <div className="absolute left-0 right-0" style={{ top: '50%', transform: 'translateY(-50%)' }}>
          <div 
            className="timeline-line absolute left-0 right-0 top-0 h-1"
            style={{
              background: 'linear-gradient(to right, #c55d81, #ca6a5f, #bc7f49, #a09449, #7da562, #7caa6b, #7ab074, #79b57e, #9ab36f, #b9af6a, #d4aa6e, #eaa57d)',
              transform: 'translateY(-50%)',
            }} 
          />
          {/* Arrow at the end - aligned with line center */}
          <div 
            className="timeline-arrow absolute right-0 top-0 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px]"
            style={{ 
              borderLeftColor: '#eaa57d',
              transform: 'translate(50%, -50%)',
            }} 
          />
        </div>

        {sortedItems.map((item, idx) => {
          const isOpen = openId === item.id;
          const year = extractYear(item.period);

          return (
            <div key={item.id} className="relative flex-1 flex flex-col items-center" style={{ minHeight: '200px' }}>
              {/* Title above - aligned at bottom so all titles sit on same baseline */}
              <div className="absolute left-0 right-0 flex justify-center" style={{ bottom: 'calc(50% + 3rem)' }}>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 text-center max-w-[120px]">
                  {item.title}
                </p>
              </div>

              {/* Bubble centered on line - fixed position at 50% */}
              <button
                ref={(el) => { buttonRefs.current[item.id] = el; }}
                onClick={() => isOpen ? closeDetail() : openDetail(item.id)}
                className={`absolute z-10 w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white dark:border-[#1d1d1d] shadow-lg backdrop-blur-sm transition-transform duration-300 ease-out timeline-bubble ${
                  isOpen ? 'timeline-bubble-open' : ''
                }`}
                style={{
                  background: 'linear-gradient(135deg, #C55D81, #46B49A)',
                  top: '50%',
                  left: '50%',
                }}
                aria-label={`${item.organization} - ${item.title}`}
              >
                {item.icon ? (
                  <img src={item.icon} alt="" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="flex items-center justify-center h-full text-white text-xs md:text-sm font-semibold">
                    {item.iconText || item.organization.substring(0, 3)}
                  </span>
                )}
              </button>

              {/* Year below - closer to bubble */}
              <div className="absolute left-0 right-0 flex justify-center" style={{ top: 'calc(50% + 2.5rem)' }}>
                <p className="text-xs opacity-70 text-gray-700 dark:text-gray-300">
                  {year}
                </p>
              </div>

              {/* Floating detail window */}
              {isOpen && (
                <>
                  {/* Connecting curved dashed line from bubble to detail box */}
                  <svg 
                    className="absolute z-10 pointer-events-none"
                    style={{
                      top: 'calc(50% + 40px)', // start from bubble bottom
                      left: '50%',
                      width: '150px',
                      height: '50px', // reduced gap
                      transform: 'translateX(-50%)',
                    }}
                    viewBox="0 0 150 50"
                    preserveAspectRatio="none"
                  >
                    <path 
                      d="M 75 0 Q 60 25 75 50" // Curved path: starts at center top, curves slightly left, then down to center bottom
                      fill="none"
                      stroke={`url(#dashedGradient-${item.id})`}
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    <defs>
                      <linearGradient id={`dashedGradient-${item.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#C55D81" />
                        <stop offset="100%" stopColor="#46B49A" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div
                    ref={(el) => { detailRefs.current[item.id] = el; }}
                    className={`absolute w-72 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-[#2a2a2a] dark:to-[#1f1f1f] text-gray-900 dark:text-gray-100 transition-all duration-200 z-20 ${
                      modalVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                    style={{
                      top: 'calc(50% + 40px + 50px)', // bubble center + half bubble height + line height
                      left: '50%',
                      transform: 'translateX(-50%)', // center horizontally with bubble
                    }}
                  >
                    <div className="p-5">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-sm text-accent-teal dark:text-accent-teal mt-1">{item.organization}</p>
                      <p className="text-xs opacity-70 mt-2">{item.period}</p>
                      <p className="text-sm mt-3 opacity-90">{item.description}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

