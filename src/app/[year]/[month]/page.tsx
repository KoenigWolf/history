/**
 * 月別詳細ページ
 * 指定した年・月の出来事を詳細表示
 */

import { notFound } from 'next/navigation';
import { getMonthData, getAvailableMonths } from '@/lib/data-loader';
import { Navigation } from '@/components/Navigation';
import { EventCard } from '@/components/EventCard';

interface MonthPageProps {
  params: Promise<{ year: string; month: string }>;
}

const monthNames = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月'
];

export default async function MonthPage({ params }: MonthPageProps) {
  const { year: yearStr, month: monthStr } = await params;
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  // 年・月が有効な数値でない場合は404
  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    notFound();
  }

  // 月別データを取得
  const monthData = await getMonthData(year, month);

  // データが存在しない場合は404
  if (!monthData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Navigation currentYear={year} currentMonth={month} />

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            {year}年 {monthNames[month - 1]}
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {monthData.events.length}件の出来事
          </p>
        </div>

        {monthData.events.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-zinc-600 dark:text-zinc-400">
              この月のデータはまだ登録されていません。
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {monthData.events.map((event, index) => (
              <EventCard key={index} event={event} />
            ))}
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
  // 利用可能な年を取得
  const { getAvailableYears } = await import('@/lib/data-loader');
  const years = await getAvailableYears();
  
  // 各年の利用可能な月を取得して組み合わせを生成
  const params: Array<{ year: string; month: string }> = [];
  
  for (const year of years) {
    const months = await getAvailableMonths(year);
    for (const month of months) {
      params.push({
        year: year.toString(),
        month: month.toString(),
      });
    }
  }
  
  return params;
}
