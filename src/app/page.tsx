/**
 * 年一覧ページ（ルートページ）
 * 1800年から2025年までの利用可能な年を一覧表示
 */

import { getAvailableYears, getAllEventsForYear } from '@/lib/data-loader';
import { YearLink } from '@/components/YearLink';
import { Navigation } from '@/components/Navigation';

export default async function HomePage() {
  // 利用可能な年のリストを取得
  const years = await getAvailableYears();
  
  // 各年のイベント数を取得
  const yearEventCounts = await Promise.all(
    years.map(async (year) => {
      const events = await getAllEventsForYear(year);
      return { year, count: events.length };
    })
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Navigation />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            世界史年表
          </h1>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
            1800年から2025年までの日本中心の世界史を閲覧できます
          </p>
        </div>

        {years.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-zinc-600 dark:text-zinc-400">
              データがまだ登録されていません。
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {yearEventCounts.map(({ year, count }) => (
              <YearLink key={year} year={year} eventCount={count} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
