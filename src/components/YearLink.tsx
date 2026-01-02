/**
 * 年へのリンクコンポーネント
 */

import Link from 'next/link';

interface YearLinkProps {
  year: number;
  eventCount?: number;
}

export function YearLink({ year, eventCount }: YearLinkProps) {
  return (
    <Link
      href={`/${year}`}
      className="block rounded-lg border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {year}年
        </h3>
        {eventCount !== undefined && (
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {eventCount}件の出来事
          </span>
        )}
      </div>
    </Link>
  );
}
