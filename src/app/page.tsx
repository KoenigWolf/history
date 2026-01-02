/**
 * ホームページ（年一覧）
 * @module app/page
 */

import { BookOpen } from 'lucide-react';
import type { Year } from '@/domain/types';
import { t } from '@/config/i18n';
import { getAvailableYears, getAllEventsForYear } from '@/services/history-service';
import {
  PageContainer,
  PageHeader,
  Breadcrumbs,
  YearCard,
  EmptyState,
} from '@/components/features';

/** 年別イベント数の型 */
interface YearEventCount {
  readonly year: Year;
  readonly count: number;
}

/**
 * 年別のイベント数を並列取得
 */
async function fetchYearEventCounts(years: Year[]): Promise<YearEventCount[]> {
  const results = await Promise.all(
    years.map(async (year) => {
      const events = await getAllEventsForYear(year);
      return { year, count: events.length };
    })
  );
  return results;
}

/**
 * ホームページコンポーネント
 * 利用可能な年の一覧を表示
 */
export default async function HomePage() {
  // データ取得
  const years = await getAvailableYears();
  const yearEventCounts = await fetchYearEventCounts(years);

  // 統計計算
  const totalEvents = yearEventCounts.reduce((sum, { count }) => sum + count, 0);
  const hasData = years.length > 0;

  return (
    <PageContainer>
      <Breadcrumbs availableYears={years} />

      <PageHeader
        title={t.page.homeTitle}
        description={t.page.homeDescription}
      >
        {totalEvents > 0 && (
          <div
            className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"
            aria-live="polite"
          >
            <BookOpen className="size-4" aria-hidden="true" />
            <span>{t.stats.totalEvents(totalEvents)}</span>
          </div>
        )}
      </PageHeader>

      {hasData ? (
        <div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          role="list"
          aria-label="年一覧"
        >
          {yearEventCounts.map(({ year, count }) => (
            <div key={year} role="listitem">
              <YearCard year={year} eventCount={count} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState variant="noData" />
      )}
    </PageContainer>
  );
}
