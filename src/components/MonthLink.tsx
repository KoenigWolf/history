/**
 * 月へのリンクコンポーネント
 */

import Link from 'next/link';

interface MonthLinkProps {
  year: number;
  month: number;
  eventCount?: number;
}

const monthNames = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月'
];

export function MonthLink({ year, month, eventCount }: MonthLinkProps) {
  return (
    <Link
      href={`/${year}/${month}`}
      className="block rounded-lg border border-zinc-200 bg-white p-4 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {monthNames[month - 1]}
        </h4>
        {eventCount !== undefined && (
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {eventCount}件
          </span>
        )}
      </div>
    </Link>
  );
}
