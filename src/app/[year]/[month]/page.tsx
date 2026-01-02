/**
 * 月別詳細ページ
 * 指定した年・月の出来事を詳細表示
 */

import { notFound } from 'next/navigation';
import { getMonthData, getAvailableMonths, getAvailableYears } from '@/lib/data-loader';
import { Navigation } from '@/components/Navigation';
import { EventCard } from '@/components/EventCard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';

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
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Navigation currentYear={year} currentMonth={month} />

        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {year}年 {monthNames[month - 1]}
            </h1>
            <Badge variant="secondary" className="text-sm">
              {monthData.events.length}件
            </Badge>
          </div>
        </header>

        {monthData.events.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="size-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-center">
                この月のデータはまだ登録されていません。
              </p>
            </CardContent>
          </Card>
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
