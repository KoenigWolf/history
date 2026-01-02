/**
 * 歴史イベントを表示するカードコンポーネント
 */

import type { HistoryEvent } from '@/types/history';

interface EventCardProps {
  event: HistoryEvent;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {event.date}
          </div>
          <h3 className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {event.title}
          </h3>
        </div>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {event.category}
        </span>
      </div>
      
      <p className="mb-4 text-zinc-700 dark:text-zinc-300">
        {event.description}
      </p>
      
      {event.related_countries.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
            関連国・地域
          </div>
          <div className="flex flex-wrap gap-2">
            {event.related_countries.map((country, index) => (
              <span
                key={index}
                className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              >
                {country}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {event.sources && event.sources.length > 0 && (
        <div>
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
            参考文献
          </div>
          <ul className="space-y-1">
            {event.sources.map((source, index) => (
              <li key={index} className="text-xs text-zinc-600 dark:text-zinc-400">
                • {source}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
