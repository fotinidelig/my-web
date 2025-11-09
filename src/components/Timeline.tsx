import { useState, useEffect, useRef } from 'react';
import type { TimelineItem } from '../utils/types';

type Props = { items: TimelineItem[] };

export default function Timeline({ items }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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
      if (openId) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          cycleDetail(1);
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          cycleDetail(-1);
        }
      }
    }

    function onClickOutside(e: MouseEvent) {
      if (openId) {
        const target = e.target as HTMLElement;
        const detailEl = detailRefs.current[openId];
        const buttonEl = buttonRefs.current[openId];
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const query = window.matchMedia('(max-width: 767px)');
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(event.matches);
    };

    handleChange(query);

    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', handleChange as (event: MediaQueryListEvent) => void);
    } else {
      query.addListener(handleChange as (event: MediaQueryListEvent) => void);
    }

    return () => {
      if (typeof query.removeEventListener === 'function') {
        query.removeEventListener('change', handleChange as (event: MediaQueryListEvent) => void);
      } else {
        query.removeListener(handleChange as (event: MediaQueryListEvent) => void);
      }
    };
  }, []);

  const sortedItems = items;
  const mobileItems = [...sortedItems].reverse();

  function extractYear(period: string): string {
    if (period.match(/\d{4}-\d{4}/)) {
      return period.match(/\d{4}-\d{4}/)?.[0] || period;
    }
    const match = period.match(/\d{4}/);
    return match ? match[0] : period;
  }

  function cycleDetail(direction: 1 | -1) {
    if (!openId) return;
    const currentIndex = sortedItems.findIndex((item) => item.id === openId);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + direction + sortedItems.length) % sortedItems.length;
    const nextId = sortedItems[nextIndex].id;
    setOpenId(nextId);
    requestAnimationFrame(() => setModalVisible(true));
  }

  const renderDesktop = () => (
    <div
      className="timeline-container relative mx-auto flex max-w-6xl justify-between px-8"
      style={{ minHeight: '200px' }}
    >
      <div className="absolute left-0 right-0" style={{ top: '50%', transform: 'translateY(-50%)' }}>
        <div
          className="timeline-line absolute left-0 right-0 top-0 h-1"
          style={{
            background:
              'linear-gradient(to right, #c55d81, #ca6a5f, #bc7f49, #a09449, #7da562, #7caa6b, #7ab074, #79b57e, #9ab36f, #b9af6a, #d4aa6e, #eaa57d)',
            transform: 'translateY(-50%)',
          }}
        />
        <div
          className="timeline-arrow absolute right-0 top-0 h-0 w-0 border-l-[8px] border-t-[6px] border-b-[6px] border-t-transparent border-b-transparent"
          style={{ borderLeftColor: '#eaa57d', transform: 'translate(50%, -50%)' }}
        />
      </div>

      {sortedItems.map((item) => {
        const isOpen = openId === item.id;
        const year = extractYear(item.period);

        return (
          <div key={item.id} className="relative flex flex-1 flex-col items-center" style={{ minHeight: '200px' }}>
            <div className="absolute left-0 right-0 flex justify-center" style={{ bottom: 'calc(50% + 3rem)' }}>
              <p className="max-w-[120px] text-center text-sm font-medium text-gray-800 dark:text-gray-200">{item.title}</p>
            </div>

            <button
              ref={(el) => {
                buttonRefs.current[item.id] = el;
              }}
              onClick={() => (isOpen ? closeDetail() : openDetail(item.id))}
              className={`timeline-bubble absolute z-10 h-16 w-16 rounded-full border-4 border-white shadow-lg backdrop-blur-sm transition-transform duration-300 ease-out dark:border-[#1d1d1d] md:h-20 md:w-20 ${
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
                <img src={item.icon} alt="" className="h-full w-full rounded-full object-cover" />
              ) : (
                <span className="flex h-full items-center justify-center text-xs font-semibold text-white md:text-sm">
                  {item.iconText || item.organization.substring(0, 3)}
                </span>
              )}
            </button>

            <div className="absolute left-0 right-0 flex justify-center" style={{ top: 'calc(50% + 2.5rem)' }}>
              <p className="text-xs text-gray-700 opacity-70 dark:text-gray-300">{year}</p>
            </div>

            {isOpen && (
              <>
                <svg
                  className="pointer-events-none absolute z-10"
                  style={{
                    top: 'calc(50% + 40px)',
                    left: '50%',
                    width: '150px',
                    height: '50px',
                    transform: 'translateX(-50%)',
                  }}
                  viewBox="0 0 150 50"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 75 0 Q 60 25 75 50"
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
                  ref={(el) => {
                    detailRefs.current[item.id] = el;
                  }}
                  className={`absolute z-20 w-72 rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 text-gray-900 shadow-xl transition-all duration-200 dark:border-gray-700 dark:from-[#2a2a2a] dark:to-[#1f1f1f] dark:text-gray-100 ${
                    modalVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                  style={{
                    top: 'calc(50% + 90px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <div className="p-5">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm text-accent-teal dark:text-accent-teal">{item.organization}</p>
                    <p className="mt-2 text-xs opacity-70">{item.period}</p>
                    <p className="mt-3 text-sm opacity-90">{item.description}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderMobile = () => (
    <div className="relative mx-auto max-w-xl px-6 pb-16">
      <div className="pointer-events-none absolute inset-y-16 left-[5.2rem] w-[3px] rounded-full bg-gradient-to-b from-[#C55D81] via-[#7ab074] to-[#EAA57D]" />
      {/* <div className="pointer-events-none absolute left-[3.75rem] top-12 -translate-x-1/2 h-0 w-0 border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent border-b-[#C55D81]" />
      <div className="pointer-events-none absolute left-[3.75rem] bottom-12 -translate-x-1/2 h-3 w-3 rounded-full border-2 border-[#EAA57D] bg-[#EAA57D]/40" /> */}

      <div className="flex flex-col gap-12 pt-10">
        {mobileItems.map((item) => {
          const isOpen = openId === item.id;
          const year = extractYear(item.period);

          return (
            <div key={item.id} className="relative flex flex-col items-start pl-24" style={{ minHeight: '6rem' }}>
              <button
                ref={(el) => {
                  buttonRefs.current[item.id] = el;
                }}
                onClick={() => (isOpen ? closeDetail() : openDetail(item.id))}
                className={`absolute left-[3.75rem] top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white shadow-lg backdrop-blur-sm transition-transform duration-300 ease-out dark:border-[#1d1d1d] ${
                  isOpen ? 'scale-105' : ''
                }`}
                style={{ background: 'linear-gradient(135deg, #C55D81, #46B49A)' }}
                aria-label={`${item.organization} - ${item.title}`}
              >
                {item.icon ? (
                  <img src={item.icon} alt="" className="h-full w-full rounded-full object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center text-xs font-semibold text-white">
                    {item.iconText || item.organization.substring(0, 3)}
                  </span>
                )}
              </button>

              <div className="flex flex-col justify-center">
                <span className="text-xs uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">{year}</span>
                <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-100">{item.title}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-accent-rose dark:text-accent-rose">{item.organization}</p>
              </div>

              {isOpen && (
                <div
                  ref={(el) => {
                    detailRefs.current[item.id] = el;
                  }}
                  className={`mt-4 w-full rounded-xl border border-gray-200 bg-white/90 p-4 text-left text-gray-900 shadow-lg backdrop-blur-sm transition-all duration-200 dark:border-gray-700 dark:bg-[#2a2a2a]/90 dark:text-gray-100 ${
                    modalVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">{item.period}</p>
                  <p className="mt-2 text-sm leading-relaxed opacity-90">{item.description}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="relative py-12 pb-20">
      <p className="mx-auto mb-12 max-w-2xl px-4 text-center text-gray-700 dark:text-gray-300">
        Here are some key milestones in my journey, from academic studies to research positions.
      </p>

      {isMobile ? renderMobile() : renderDesktop()}
    </div>
  );
}

