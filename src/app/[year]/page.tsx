/**
 * 年別概要ページ
 * 指定した年の概要と月別リンクを表示
 */

import { notFound } from 'next/navigation';
import { getYearData, getAvailableMonths, getAllMonthsForYear, getAvailableYears } from '@/lib/data-loader';
import { Navigation } from '@/components/Navigation';
import { MonthLink } from '@/components/MonthLink';
import { EventCard } from '@/components/EventCard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Star, FileText } from 'lucide-react';

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

  // 総イベント数
  const totalEvents = monthDataList.reduce((sum, m) => sum + m.events.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Navigation currentYear={year} />

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {year}年
            </h1>
            {totalEvents > 0 && (
              <Badge variant="secondary" className="text-sm">
                {totalEvents}件
              </Badge>
            )}
          </div>
          {yearData?.summary && (
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {yearData.summary}
            </p>
          )}
        </header>

        {/* 主要イベントの表示 */}
        {yearData?.majorEvents && yearData.majorEvents.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="size-5 text-amber-500" />
              <h2 className="text-2xl font-semibold text-foreground">
                主要イベント
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {yearData.majorEvents.map((event, index) => (
                <EventCard key={index} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* 月別リンク */}
        {months.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="size-5 text-muted-foreground" />
              <h2 className="text-2xl font-semibold text-foreground">
                月別詳細
              </h2>
            </div>
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
          </section>
        )}

        {months.length === 0 && !yearData?.majorEvents && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="size-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-center">
                この年のデータはまだ登録されていません。
              </p>
            </CardContent>
          </Card>
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
