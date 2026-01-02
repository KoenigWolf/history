/**
 * 年カードコンポーネント
 * @module components/features/history/YearCard
 */

import { memo } from 'react';
import Link from 'next/link';
import type { Year } from '@/domain/types';
import { t } from '@/config/i18n';
import { Card, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

/** 年カードのプロパティ */
export interface YearCardProps {
  /** 年 */
  readonly year: Year;
  /** イベント数（任意） */
  readonly eventCount?: number;
  /** 追加のクラス名 */
  readonly className?: string;
}

/**
 * 年カードコンポーネント
 * 年へのリンクをカード形式で表示
 */
function YearCardComponent({
  year,
  eventCount,
  className,
}: YearCardProps) {
  const hasEvents = eventCount !== undefined && eventCount > 0;

  return (
    <Link
      href={`/${year}`}
      className={`block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl ${className ?? ''}`}
      aria-label={t.a11y.navigateToYear(year)}
    >
      <Card className="transition-all hover:shadow-md hover:border-primary/20 group-hover:bg-accent/50 group-focus-visible:ring-2 group-focus-visible:ring-ring">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            {t.nav.year(year)}
          </CardTitle>
          <CardAction className="flex items-center gap-2">
            {hasEvents && (
              <Badge variant="secondary" aria-label={t.stats.eventsInYear(eventCount)}>
                {t.stats.eventCount(eventCount)}
              </Badge>
            )}
            <ChevronRight
              className="size-5 text-muted-foreground group-hover:text-foreground transition-colors"
              aria-hidden="true"
            />
          </CardAction>
        </CardHeader>
      </Card>
    </Link>
  );
}

/** メモ化された年カード */
export const YearCard = memo(YearCardComponent);

export default YearCard;
