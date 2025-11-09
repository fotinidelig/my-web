import { useEffect, useState } from 'react';

type ThemeToggleProps = {
  className?: string;
};

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored ? stored === 'dark' : prefersDark;
    setIsDark(initial);
    root.classList.toggle('dark', initial);

    function handleThemeChange(event: Event) {
      if ('detail' in event && typeof (event as CustomEvent<boolean>).detail === 'boolean') {
        setIsDark((event as CustomEvent<boolean>).detail);
      }
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === 'theme' && event.newValue) {
        const next = event.newValue === 'dark';
        setIsDark(next);
        root.classList.toggle('dark', next);
      }
    }

    window.addEventListener('theme-change', handleThemeChange as EventListener);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('theme-change', handleThemeChange as EventListener);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    const root = document.documentElement;
    root.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    window.dispatchEvent(new CustomEvent('theme-change', { detail: next }));
  }

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className={`inline-flex items-center justify-center rounded-full border border-gray-300/70 bg-white/70 p-2 text-gray-700 shadow-sm transition-colors duration-300 hover:border-secondary/60 hover:text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700/60 dark:bg-gray-900/70 dark:text-gray-200 dark:hover:border-secondary/50 dark:hover:text-secondary ${className}`}
      type="button"
    >
      {isDark ? (
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}




