/**
 * 年別ページ
 * @module app/[year]/page
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Calendar, Star } from 'lucide-react';

import type { Year, Month } from '@/domain/types';
import { t } from '@/config/i18n';
import { parseYear, parseMonth } from '@/domain/validation/validators';
import {
  getAvailableYears,
  getYearData,
  getAvailableMonths,
  getAllMonthsForYear,
} from '@/services/history-service';
import {
  PageContainer,
  PageHeader,
  Breadcrumbs,
  Section,
  EventCard,
  MonthCard,
  EmptyState,
} from '@/components/features';

/** ページパラメータの型 */
interface YearPageParams {
  readonly year: string;
}

/** ページプロパティ */
interface YearPageProps {
  readonly params: Promise<YearPageParams>;
}

/**
 * 動的メタデータ生成
 */
export async function generateMetadata({
  params,
}: YearPageProps): Promise<Metadata> {
  const { year: yearStr } = await params;
  const yearResult = parseYear(yearStr);

  if (!yearResult.success) {
    return { title: t.error.notFound };
  }

  return {
    title: t.page.yearTitle(yearResult.data),
    description: `${yearResult.data}年の歴史的出来事`,
  };
}

/**
 * 静的生成パラメータ
 */
export async function generateStaticParams(): Promise<YearPageParams[]> {
  const years = await getAvailableYears();
  return years.map((year) => ({
    year: year.toString(),
  }));
}

/**
 * 年別ページコンポーネント
 */
export default async function YearPage({
  params,
}: YearPageProps) {
  const { year: yearStr } = await params;

  // パラメータバリデーション
  const yearResult = parseYear(yearStr);
  if (!yearResult.success) {
    notFound();
  }

  const year = yearResult.data;

  // データ取得（並列）
  const [yearData, months, monthDataList] = await Promise.all([
    getYearData(year),
    getAvailableMonths(year),
    getAllMonthsForYear(year),
  ]);

  // データが存在しない場合は404
  if (!yearData && months.length === 0) {
    notFound();
  }

  // 月別イベント数マップ
  const monthEventCounts = new Map<Month, number>();
  monthDataList.forEach((monthData) => {
    monthEventCounts.set(monthData.month, monthData.events.length);
  });

  // 総イベント数
  const totalEvents = monthDataList.reduce(
    (sum, m) => sum + m.events.length,
    0
  );

  const hasMajorEvents =
    yearData?.majorEvents && yearData.majorEvents.length > 0;
  const hasMonths = months.length > 0;
  const hasNoData = !hasMajorEvents && !hasMonths;

  // 全年のリストを取得（ドロップダウン用）
  const allYears = await getAvailableYears();

  return (
    <PageContainer>
      <Breadcrumbs
        currentYear={year}
        availableYears={allYears}
        availableMonths={months}
      />

      <PageHeader
        title={t.page.yearTitle(year)}
        badge={totalEvents > 0 ? t.stats.eventCount(totalEvents) : undefined}
        description={yearData?.summary}
      />

      {/* 主要イベント */}
      {hasMajorEvents && (
        <Section
          title={t.section.majorEvents}
          icon={<Star className="size-5 text-amber-500" />}
        >
          <div className="grid gap-6 md:grid-cols-2" role="list">
            {yearData.majorEvents!.map((event, index) => (
              <div key={`${event.date}-${index}`} role="listitem">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 月別リンク */}
      {hasMonths && (
        <Section
          title={t.section.monthlyDetails}
          icon={<Calendar className="size-5 text-muted-foreground" />}
          className={hasMajorEvents ? '' : 'mb-12'}
        >
          <div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            role="list"
            aria-label="月一覧"
          >
            {months.map((month) => (
              <div key={month} role="listitem">
                <MonthCard
                  year={year}
                  month={month}
                  eventCount={monthEventCounts.get(month)}
                />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* 空状態 */}
      {hasNoData && <EmptyState variant="noYearData" />}
    </PageContainer>
  );
}
