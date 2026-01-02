/**
 * ナビゲーションコンポーネント
 */

import Link from 'next/link';

interface NavigationProps {
  currentYear?: number;
  currentMonth?: number;
}

export function Navigation({ currentYear, currentMonth }: NavigationProps) {
  return (
    <nav className="mb-8 flex items-center gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
      <Link
        href="/"
        className="text-lg font-semibold text-zinc-900 hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
      >
        世界史年表
      </Link>
      {currentYear && (
        <>
          <span className="text-zinc-400 dark:text-zinc-600">/</span>
          <Link
            href={`/${currentYear}`}
            className="text-lg font-semibold text-zinc-900 hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
          >
            {currentYear}年
          </Link>
        </>
      )}
      {currentMonth && (
        <>
          <span className="text-zinc-400 dark:text-zinc-600">/</span>
          <span className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">
            {currentMonth}月
          </span>
        </>
      )}
    </nav>
  );
}
