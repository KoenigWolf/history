/**
 * 年一覧ページ（ルートページ）
 * 1800年から2025年までの利用可能な年を一覧表示
 */

import { getAvailableYears, getAllEventsForYear } from '@/lib/data-loader';
import { YearLink } from '@/components/YearLink';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

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

  // 統計情報
  const totalEvents = yearEventCounts.reduce((sum, { count }) => sum + count, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Navigation />

        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            世界史年表
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            1800年から2025年までの日本中心の世界史を閲覧できます
          </p>
          {totalEvents > 0 && (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="size-4" />
              <span>全{totalEvents}件の出来事を収録</span>
            </div>
          )}
        </header>

        {years.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="size-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-center">
                データがまだ登録されていません。
              </p>
            </CardContent>
          </Card>
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
