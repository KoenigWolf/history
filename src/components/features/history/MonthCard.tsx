/**
 * 月カードコンポーネント
 * @module components/features/history/MonthCard
 */

import { memo } from 'react';
import Link from 'next/link';
import type { Year, Month } from '@/domain/types';
import { t, getMonthName } from '@/config/i18n';
import { Card, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

/** 月カードのプロパティ */
export interface MonthCardProps {
  /** 年 */
  readonly year: Year;
  /** 月 */
  readonly month: Month;
  /** イベント数（任意） */
  readonly eventCount?: number;
  /** 追加のクラス名 */
  readonly className?: string;
}

/**
 * 月カードコンポーネント
 * 月へのリンクをカード形式で表示
 */
function MonthCardComponent({
  year,
  month,
  eventCount,
  className,
}: MonthCardProps) {
  const hasEvents = eventCount !== undefined && eventCount > 0;
  const monthName = getMonthName(month);

  return (
    <Link
      href={`/${year}/${month}`}
      className={`block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl ${className ?? ''}`}
      aria-label={t.a11y.navigateToMonth(year, month)}
    >
      <Card className="transition-all hover:shadow-md hover:border-primary/20 group-hover:bg-accent/50 group-focus-visible:ring-2 group-focus-visible:ring-ring">
        <CardHeader className="flex-row items-center justify-between py-4">
          <CardTitle className="text-lg font-semibold">{monthName}</CardTitle>
          <CardAction className="flex items-center gap-2">
            {hasEvents && (
              <Badge variant="secondary" aria-label={t.stats.eventCount(eventCount)}>
                {t.stats.eventCount(eventCount)}
              </Badge>
            )}
            <ChevronRight
              className="size-4 text-muted-foreground group-hover:text-foreground transition-colors"
              aria-hidden="true"
            />
          </CardAction>
        </CardHeader>
      </Card>
    </Link>
  );
}

/** メモ化された月カード */
export const MonthCard = memo(MonthCardComponent);

export default MonthCard;
