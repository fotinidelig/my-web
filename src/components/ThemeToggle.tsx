import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored ? stored === 'dark' : prefersDark;
    setIsDark(initial);
    root.classList.toggle('dark', initial);
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    const root = document.documentElement;
    root.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-700 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {isDark ? 'Light' : 'Dark'}
    </button>
  );
}


