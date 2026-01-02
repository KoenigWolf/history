/**
 * 年別概要ページ
 * 指定した年の概要と月別リンクを表示
 */

import { notFound } from 'next/navigation';
import { getYearData, getAvailableMonths, getAllMonthsForYear, getAvailableYears } from '@/lib/data-loader';
import { Navigation } from '@/components/Navigation';
import { MonthLink } from '@/components/MonthLink';
import { EventCard } from '@/components/EventCard';

interface YearPageProps {
  params: Promise<{ year: string }>;
}

export default async function YearPage({ params }: YearPageProps) {
  const { year: yearStr } = await params;
  const year = parseInt(yearStr, 10);

  // 年が有効な数値でない場合は404
  if (isNaN(year)) {
    notFound();
  }

  // 年のデータと利用可能な月を取得
  const [yearData, months, monthDataList] = await Promise.all([
    getYearData(year),
    getAvailableMonths(year),
    getAllMonthsForYear(year),
  ]);

  // 年のデータが存在しない場合は404
  if (!yearData && months.length === 0) {
    notFound();
  }

  // 月別のイベント数を計算
  const monthEventCounts = new Map<number, number>();
  monthDataList.forEach(monthData => {
    monthEventCounts.set(monthData.month, monthData.events.length);
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Navigation currentYear={year} />

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            {year}年
          </h1>
          {yearData?.summary && (
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              {yearData.summary}
            </p>
          )}
        </div>

        {/* 主要イベントの表示 */}
        {yearData?.majorEvents && yearData.majorEvents.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              主要イベント
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {yearData.majorEvents.map((event, index) => (
                <EventCard key={index} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* 月別リンク */}
        {months.length > 0 && (
          <div>
            <h2 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              月別詳細
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {months.map(month => (
                <MonthLink
                  key={month}
                  year={year}
                  month={month}
                  eventCount={monthEventCounts.get(month)}
                />
              ))}
            </div>
          </div>
        )}

        {months.length === 0 && !yearData?.majorEvents && (
          <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-zinc-600 dark:text-zinc-400">
              この年のデータはまだ登録されていません。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 静的生成用のパラメータ生成
 */
export async function generateStaticParams() {
  const years = await getAvailableYears();
  return years.map(year => ({
    year: year.toString(),
  }));
}
